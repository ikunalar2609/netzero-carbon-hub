import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Zap, Truck, Car, Plane, Factory, Recycle, TrendingDown, TrendingUp, Leaf, Info, Lightbulb, Target, AlertCircle, Loader2, MapPin, Save, Ship, Anchor, ArrowRight, Database } from "lucide-react";
import { toast } from "sonner";
import { useRegionDetection } from "@/hooks/useRegionDetection";
import { useSeaRoute } from "@/hooks/useSeaRoute";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { AirportSearch } from "./AirportSearch";
import { FlightRouteMap } from "./FlightRouteMap";
import { PortSearch, type Port } from "./PortSearch";
import { SeaRouteMap } from "./SeaRouteMap";
import { RouteComparison } from "./RouteComparison";
// IPCC GWP values (AR6)
const GWP_CH4 = 27.9;
const GWP_N2O = 273;

// Emission factors (DEFRA 2024 & IPCC)
const FUEL_EF = {
  petrol: { co2_per_L: 2.34, ch4_factor: 0.0005, n2o_factor: 0.0005, wtt_factor: 0.55 },
  diesel: { co2_per_L: 2.68, ch4_factor: 0.0004, n2o_factor: 0.0006, wtt_factor: 0.62 },
  cng: { co2_per_kg: 2.80, ch4_factor: 0.001, n2o_factor: 0.0001, wtt_factor: 0.48 }
};

// Distance-based emission factors (DEFRA 2024) - kgCO₂/km
const DISTANCE_EF = {
  'small-petrol': 0.180,
  'medium-petrol': 0.220,
  'large-petrol': 0.280,
  'small-diesel': 0.165,
  'medium-diesel': 0.220,
  'large-diesel': 0.270,
  'motorcycle': 0.080,
  'bus-per-passenger': 0.105,
  'train-per-passenger': 0.041,
  'electric': 0.053
};

// Industry emission factors (CBAM/ecoinvent/EPA)
const INDUSTRY_EF: Record<string, { ef: number; unit: string; source: string }> = {
  'steel-hot-rolled': { ef: 2.0, unit: 'kg product', source: 'CBAM' },
  'steel-wire': { ef: 2.6, unit: 'kg product', source: 'CBAM' },
  'aluminium-primary': { ef: 8.6, unit: 'kg product', source: 'ecoinvent' },
  'copper-cathode': { ef: 3.5, unit: 'kg product', source: 'sustainalize' },
  'cement-cem1': { ef: 0.87, unit: 'kg product', source: 'CBAM' },
  'concrete-c30': { ef: 0.132, unit: 'kg product', source: 'sustainalize' },
  'hdpe-granules': { ef: 1.89, unit: 'kg product', source: 'sustainalize' },
  'polypropylene': { ef: 1.63, unit: 'kg product', source: 'sustainalize' },
  'glass-bottles': { ef: 0.85, unit: 'kg product', source: 'sustainalize' },
  'paper-uncoated': { ef: 1.09, unit: 'kg product', source: 'sustainalize' },
  'li-battery-nmc': { ef: 73.0, unit: 'kWh capacity', source: 'ecoinvent' },
  'cotton-textile': { ef: 5.2, unit: 'kg fabric', source: 'ecoinvent' },
  'refrigerant-r410a': { ef: 2088.0, unit: 'kg leaked', source: 'EPA' },
};

// Agriculture emission factors
const AGRICULTURE_EF: Record<string, { ef: number; unit: string; source: string }> = {
  'nitrogen-fertilizer': { ef: 6.8, unit: 'kg N applied', source: 'IPCC AR6' },
  'rice-flooded': { ef: 1.3, unit: 'm² cultivated', source: 'IPCC AR6' },
  'beef-enteric': { ef: 27.0, unit: 'head/year', source: 'ecoinvent' },
  'soybean': { ef: 0.35, unit: 'kg harvested', source: 'ecoinvent' },
  'dairy-cow': { ef: 14.5, unit: 'head/year', source: 'IPCC AR6' },
  'poultry': { ef: 0.02, unit: 'head/year', source: 'IPCC AR6' },
  'wheat': { ef: 0.28, unit: 'kg harvested', source: 'ecoinvent' },
  'corn-maize': { ef: 0.32, unit: 'kg harvested', source: 'ecoinvent' },
};

// Digital/Cloud emission factors
const DIGITAL_EF: Record<string, { ef: number; unit: string; source: string }> = {
  'cloud-ec2': { ef: 0.056, unit: 'instance-hour', source: 'sustainalize' },
  'data-centre': { ef: 0.42, unit: 'kWh (PUE 1.2)', source: 'sustainalize' },
  'email-send': { ef: 0.004, unit: 'email', source: 'ecoinvent' },
  'video-stream-hd': { ef: 0.036, unit: 'hour streamed', source: 'IEA' },
  'web-page-view': { ef: 0.0002, unit: 'page view', source: 'ecoinvent' },
  'blockchain-tx': { ef: 0.4, unit: 'transaction', source: 'ecoinvent' },
};

interface IndustryData {
  product: string;
  quantity: number;
}

interface AgricultureData {
  activity: string;
  quantity: number;
}

interface DigitalData {
  activity: string;
  quantity: number;
}
// Source: DEFRA 2024, IEA, EPA
const GRID_EF = {
  'grid-mixed': 0.25,      // Average global grid mix
  'grid-uk': 0.193,        // UK grid 2024
  'grid-us': 0.386,        // US average
  'grid-eu': 0.295,        // EU average
  'grid-china': 0.555,     // China grid
  'grid-india': 0.708,     // India grid
  'renewable': 0.0,        // 100% renewable/zero-emission
  'coal-heavy': 0.82,      // Coal-dominated grid
  'gas-heavy': 0.49        // Natural gas-dominated grid
};

// Stationary Fuel Combustion Factors (Scope 1) - DEFRA 2024 & IPCC
const STATIONARY_FUEL_EF = {
  'diesel': 2.68,          // kgCO₂/L
  'lpg': 1.51,             // kgCO₂/L
  'natural-gas': 0.202,    // kgCO₂/kWh (or 56.1 kgCO₂/GJ)
  'fuel-oil': 3.18,        // kgCO₂/L
  'coal': 94.6             // kgCO₂/GJ
};

interface TransportData {
  distance: number;
  fuelType: string;
  vehicle: string;
  calculationMethod: 'fuel' | 'distance';
  fuelUsed?: number;
  fuelEconomy?: number;
  includeWTW: boolean;
}

interface EnergyData {
  // Electricity (Scope 2)
  electricity: number;
  electricityMethod: 'location' | 'market';
  gridType: string;
  supplierEF?: number;
  hasRenewableCerts: boolean;
  
  // Stationary Fuel (Scope 1)
  fuelType: string;
  fuelAmount: number;
  fuelUnit: 'L' | 'kWh' | 'GJ';
}

interface FlightData {
  departureIata: string;
  arrivalIata: string;
  passengers: number;
  includeRF: boolean;
}

interface SeaFreightData {
  originPort: Port | null;
  destinationPort: Port | null;
  cargoWeight: number;
  shipType: string;
  fuelType: string;
  loadFactor: number;
  calculationMethod: 'tonne-km' | 'fuel-based';
  fuelConsumed?: number;
}

// Maritime emission factors (IMO / GLEC Framework) - gCO₂/tonne-km
const SHIP_EF = {
  'container': 0.015,      // Container ship average
  'bulk-carrier': 0.008,   // Bulk carrier
  'oil-tanker': 0.011,     // Oil/Chemical tanker  
  'ro-ro': 0.022,          // Roll-on/Roll-off
  'general-cargo': 0.018,  // General cargo vessel
};

// Fuel type CO₂ factors (kgCO₂/tonne fuel) - IMO
const MARINE_FUEL_EF = {
  'hfo': 3.114,    // Heavy Fuel Oil
  'mgo': 3.206,    // Marine Gas Oil
  'lng': 2.750,    // Liquefied Natural Gas
};

// CH₄ and N₂O factors for maritime (gCH₄/tonne-km, gN₂O/tonne-km)
const MARITIME_GHG = {
  'hfo': { ch4: 0.00006, n2o: 0.00015 },
  'mgo': { ch4: 0.00005, n2o: 0.00014 },
  'lng': { ch4: 0.00025, n2o: 0.00010 }, // Higher CH₄ for LNG (methane slip)
};

interface FlightResult {
  route: {
    departure: { 
      name: string; 
      iata: string; 
      city: string;
      country: string;
      coordinates: { latitude: number; longitude: number };
    };
    arrival: { 
      name: string; 
      iata: string; 
      city: string;
      country: string;
      coordinates: { latitude: number; longitude: number };
    };
  };
  distance: { km: number; miles: number };
  emissions: {
    category: string;
    emissionFactor: number;
    co2PerPassenger: number;
    totalCo2: number;
    passengers: number;
    rfMultiplier?: number;
    co2ePerPassenger?: number;
    totalCo2e?: number;
  };
  methodology: {
    distanceCalculation: string;
    emissionFactors: string;
    rfExplanation: string;
  };
}

interface SeaFreightResult {
  distance: number;
  tonneKm: number;
  emissions: {
    co2: number;
    ch4: number;
    n2o: number;
    co2e: number;
  };
  method: 'tonne-km' | 'fuel-based';
  routeGeometry?: [number, number][];
  waypoints?: string[];
}

import { type EmissionFactor } from "@/data/emissionFactors";

interface EmissionCalculatorProps {
  factors?: EmissionFactor[];
  onSwitchToBenchmark?: () => void;
}

export const EmissionCalculator = ({ factors = [], onSwitchToBenchmark }: EmissionCalculatorProps) => {
  const [activeTab, setActiveTab] = useState("transport");
  const [transportData, setTransportData] = useState<TransportData>({ 
    distance: 0, 
    fuelType: "petrol", 
    vehicle: "medium-petrol",
    calculationMethod: 'distance',
    fuelEconomy: 7.0,
    includeWTW: false
  });
  const [energyData, setEnergyData] = useState<EnergyData>({ 
    electricity: 0,
    electricityMethod: 'location',
    gridType: 'grid-mixed',
    hasRenewableCerts: false,
    fuelType: 'natural-gas',
    fuelAmount: 0,
    fuelUnit: 'kWh'
  });
  const [wasteData, setWasteData] = useState({ amount: 0, type: "mixed", disposal: "landfill" });
  const [industryData, setIndustryData] = useState<IndustryData>({ product: 'steel-hot-rolled', quantity: 0 });
  const [agricultureData, setAgricultureData] = useState<AgricultureData>({ activity: 'nitrogen-fertilizer', quantity: 0 });
  const [digitalData, setDigitalData] = useState<DigitalData>({ activity: 'cloud-ec2', quantity: 0 });
  const [flightData, setFlightData] = useState<FlightData>({
    departureIata: '',
    arrivalIata: '',
    passengers: 1,
    includeRF: false
  });
  const [seaFreightData, setSeaFreightData] = useState<SeaFreightData>({
    originPort: null,
    destinationPort: null,
    cargoWeight: 0,
    shipType: 'container',
    fuelType: 'hfo',
    loadFactor: 70,
    calculationMethod: 'tonne-km',
    fuelConsumed: undefined
  });
  const [flightResult, setFlightResult] = useState<FlightResult | null>(null);
  const [seaFreightResult, setSeaFreightResult] = useState<SeaFreightResult | null>(null);
  const [flightLoading, setFlightLoading] = useState(false);
  const [seaLoading, setSeaLoading] = useState(false);
  const [flightEmissions, setFlightEmissions] = useState(0);
  const [seaEmissions, setSeaEmissions] = useState(0);
  const [industryEmissions, setIndustryEmissions] = useState(0);
  const [agricultureEmissions, setAgricultureEmissions] = useState(0);
  const [digitalEmissions, setDigitalEmissions] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [emissionsBreakdown, setEmissionsBreakdown] = useState({ transport: 0, energy: 0, waste: 0, flight: 0, sea: 0, industry: 0, agriculture: 0, digital: 0 });
  const [detailedTransport, setDetailedTransport] = useState({ total: 0, co2: 0, ch4: 0, n2o: 0, wtt: 0 });
  const [detailedEnergy, setDetailedEnergy] = useState({ total: 0, scope2: 0, scope1: 0, method: 'location' as 'location' | 'market' });
  const [trendData, setTrendData] = useState<any[]>([]);
  const { region } = useRegionDetection();
  const { calculateRoute: calculateSeaRoute } = useSeaRoute();

  // Save calculation to database
  const saveCalculation = async (
    type: 'flight' | 'vehicle' | 'energy' | 'diet',
    inputData: any,
    resultData: any,
    totalEmissions: number
  ) => {
    try {
      // Get current user for RLS
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please log in to save calculations');
        return false;
      }

      const { error } = await supabase.from('emission_calculations').insert({
        calculation_type: type,
        input_data: inputData,
        result_data: resultData,
        total_emissions: totalEmissions,
        user_id: user.id
      });

      if (error) {
        console.error('Error saving calculation:', error);
        toast.error('Failed to save calculation to history');
        return false;
      }
      
      toast.success('Calculation saved to history');
      return true;
    } catch (err) {
      console.error('Error saving calculation:', err);
      return false;
    }
  };

  // Calculate flight emissions
  const calculateFlightEmissions = async () => {
    if (!flightData.departureIata || !flightData.arrivalIata) {
      toast.error('Please enter both departure and arrival airport codes');
      return;
    }
    
    if (flightData.departureIata.length !== 3 || flightData.arrivalIata.length !== 3) {
      toast.error('Please enter valid 3-letter IATA codes (e.g., JFK, LAX)');
      return;
    }
    
    setFlightLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('flight-emissions', {
        body: {
          departureIata: flightData.departureIata.toUpperCase(),
          arrivalIata: flightData.arrivalIata.toUpperCase(),
          passengers: flightData.passengers,
          includeRF: flightData.includeRF
        }
      });
      
      if (error) {
        console.error('Flight emissions error:', error);
        toast.error(error.message || 'Failed to calculate flight emissions');
        return;
      }
      
      if (data.error) {
        toast.error(data.error);
        return;
      }
      
      setFlightResult(data);
      const emissions = flightData.includeRF ? data.emissions.totalCo2e : data.emissions.totalCo2;
      setFlightEmissions(emissions);
      
      // Save flight calculation to database
      await saveCalculation('flight', flightData, data, emissions);
      
      toast.success(`Flight emissions calculated: ${emissions.toFixed(2)} kg CO₂${flightData.includeRF ? 'e' : ''}`);
    } catch (err) {
      console.error('Error calculating flight emissions:', err);
      toast.error('Failed to calculate flight emissions. Please check your airport codes.');
    } finally {
      setFlightLoading(false);
    }
  };

  // Save current transport calculation
  const saveTransportCalculation = async () => {
    if (detailedTransport.total <= 0) {
      toast.error('Please calculate transport emissions first');
      return;
    }
    await saveCalculation('vehicle', transportData, detailedTransport, detailedTransport.total);
  };

  // Save current energy calculation
  const saveEnergyCalculation = async () => {
    if (detailedEnergy.total <= 0) {
      toast.error('Please calculate energy emissions first');
      return;
    }
    await saveCalculation('energy', energyData, detailedEnergy, detailedEnergy.total);
  };

  // Save current waste calculation
  const saveWasteCalculation = async () => {
    if (emissionsBreakdown.waste <= 0) {
      toast.error('Please calculate waste emissions first');
      return;
    }
    await saveCalculation('diet', wasteData, { total: emissionsBreakdown.waste }, emissionsBreakdown.waste);
  };

  // Save current sea freight calculation
  const saveSeaFreightCalculation = async () => {
    if (!seaFreightResult || seaFreightResult.emissions.co2e <= 0) {
      toast.error('Please calculate sea freight emissions first');
      return;
    }
    await saveCalculation('vehicle', seaFreightData, seaFreightResult, seaFreightResult.emissions.co2e);
  };

  // Calculate Haversine distance as fallback for sea routes
  const calculateSeaDistanceFallback = (origin: Port, destination: Port): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLon = (destination.lon - origin.lon) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Sea routes are typically 1.4x longer than straight-line distance
    return R * c * 1.4;
  };

  // Calculate sea freight emissions
  const calculateSeaFreightEmissions = () => {
    if (!seaFreightData.originPort || !seaFreightData.destinationPort) {
      toast.error('Please select both origin and destination ports');
      return;
    }
    
    if (seaFreightData.cargoWeight <= 0) {
      toast.error('Please enter cargo weight');
      return;
    }
    
    setSeaLoading(true);
    
    try {
      // Try to get real sea route using searoute-js
      const routeData = calculateSeaRoute(
        { lon: seaFreightData.originPort.lon, lat: seaFreightData.originPort.lat, name: seaFreightData.originPort.city },
        { lon: seaFreightData.destinationPort.lon, lat: seaFreightData.destinationPort.lat, name: seaFreightData.destinationPort.city }
      );
      
      let distance: number;
      let routeGeometry: [number, number][] | undefined;
      let waypoints: string[] = [];

      if (routeData) {
        distance = routeData.distance;
        routeGeometry = routeData.geometry;
        waypoints = routeData.waypoints;
        console.log(`Real sea route: ${distance.toFixed(0)} km, ${routeGeometry.length} points, waypoints: ${waypoints.join(', ')}`);
      } else {
        // Fallback to Haversine estimation
        distance = calculateSeaDistanceFallback(seaFreightData.originPort, seaFreightData.destinationPort);
        console.log(`Fallback Haversine distance: ${distance.toFixed(0)} km`);
      }

      const tonneKm = seaFreightData.cargoWeight * distance;
      
      let co2 = 0;
      let ch4 = 0;
      let n2o = 0;
      
      if (seaFreightData.calculationMethod === 'tonne-km') {
        // Tonne-km method (GLEC/IPCC)
        const shipEF = SHIP_EF[seaFreightData.shipType as keyof typeof SHIP_EF] || SHIP_EF['container'];
        co2 = tonneKm * shipEF; // kg CO₂
        
        // Add CH₄ and N₂O based on fuel type
        const ghgFactors = MARITIME_GHG[seaFreightData.fuelType as keyof typeof MARITIME_GHG] || MARITIME_GHG['hfo'];
        ch4 = tonneKm * ghgFactors.ch4 * GWP_CH4 / 1000; // Convert g to kg and apply GWP
        n2o = tonneKm * ghgFactors.n2o * GWP_N2O / 1000;
      } else if (seaFreightData.calculationMethod === 'fuel-based' && seaFreightData.fuelConsumed) {
        // Fuel-based method (IMO)
        const fuelEF = MARINE_FUEL_EF[seaFreightData.fuelType as keyof typeof MARINE_FUEL_EF] || MARINE_FUEL_EF['hfo'];
        co2 = seaFreightData.fuelConsumed * fuelEF; // tonnes fuel * kgCO₂/tonne
        
        // Estimate CH₄ and N₂O from fuel
        const ghgFactors = MARITIME_GHG[seaFreightData.fuelType as keyof typeof MARITIME_GHG] || MARITIME_GHG['hfo'];
        ch4 = seaFreightData.fuelConsumed * 1000 * ghgFactors.ch4 * GWP_CH4 / 1000;
        n2o = seaFreightData.fuelConsumed * 1000 * ghgFactors.n2o * GWP_N2O / 1000;
      }
      
      const co2e = co2 + ch4 + n2o;
      
      const result: SeaFreightResult = {
        distance: Math.round(distance),
        tonneKm: Math.round(tonneKm),
        emissions: {
          co2: Math.round(co2 * 100) / 100,
          ch4: Math.round(ch4 * 100) / 100,
          n2o: Math.round(n2o * 100) / 100,
          co2e: Math.round(co2e * 100) / 100,
        },
        method: seaFreightData.calculationMethod,
        routeGeometry,
        waypoints,
      };
      
      setSeaFreightResult(result);
      setSeaEmissions(result.emissions.co2e);
      
      const waypointInfo = waypoints.length > 0 ? ` via ${waypoints.join(', ')}` : '';
      toast.success(`Sea freight emissions: ${result.emissions.co2e.toFixed(2)} kg CO₂e${waypointInfo}`);
    } catch (err) {
      console.error('Error calculating sea freight emissions:', err);
      toast.error('Failed to calculate sea freight emissions');
    } finally {
      setSeaLoading(false);
    }
  };

  // Calculate energy emissions with GHG Protocol Scope 1 & 2
  const calculateEnergyEmissions = (data: EnergyData) => {
    let scope2_emissions = 0; // Electricity (Scope 2)
    let scope1_emissions = 0; // Stationary Fuel Combustion (Scope 1)
    let method: 'location' | 'market' = 'location';

    // 1️⃣ Electricity (Scope 2)
    if (data.electricity > 0) {
      // Determine method: Market-Based if supplier data or RECs exist, else Location-Based
      if (data.electricityMethod === 'market' && (data.supplierEF !== undefined || data.hasRenewableCerts)) {
        method = 'market';
        if (data.hasRenewableCerts) {
          scope2_emissions = 0; // Zero emissions with renewable certificates
        } else if (data.supplierEF !== undefined) {
          scope2_emissions = data.electricity * data.supplierEF;
        }
      } else {
        method = 'location';
        const gridEF = GRID_EF[data.gridType as keyof typeof GRID_EF] || GRID_EF['grid-mixed'];
        scope2_emissions = data.electricity * gridEF;
      }
    }

    // 2️⃣ Stationary Fuel Combustion (Scope 1)
    if (data.fuelAmount > 0) {
      const fuelEF = STATIONARY_FUEL_EF[data.fuelType as keyof typeof STATIONARY_FUEL_EF] || 0;
      
      if (data.fuelUnit === 'L') {
        // Direct volume-based calculation
        scope1_emissions = data.fuelAmount * fuelEF;
      } else if (data.fuelUnit === 'kWh') {
        // Energy content-based (for natural gas typically)
        scope1_emissions = data.fuelAmount * fuelEF;
      } else if (data.fuelUnit === 'GJ') {
        // Convert GJ to emissions (mainly for coal)
        scope1_emissions = data.fuelAmount * fuelEF;
      }
    }

    const total = scope2_emissions + scope1_emissions;
    
    return {
      total,
      scope2: scope2_emissions,
      scope1: scope1_emissions,
      method
    };
  };

  // Calculate vehicle emissions with IPCC methodology
  const calculateVehicleEmissions = (data: TransportData) => {
    let co2_ttw = 0; // Tank-to-Wheel CO2
    let ch4_ttw = 0;
    let n2o_ttw = 0;
    let wtt = 0; // Well-to-Tank

    if (data.calculationMethod === 'fuel' && data.distance > 0) {
      // 1️⃣ Fuel-Based Method (IPCC Tier 1 & 2)
      let fuelUsed = data.fuelUsed || 0;
      
      // Calculate fuel used from distance and fuel economy if not provided
      if (!data.fuelUsed && data.fuelEconomy && data.distance > 0) {
        fuelUsed = (data.distance * data.fuelEconomy) / 100; // L
      }

      if (fuelUsed > 0) {
        const ef = data.fuelType === 'diesel' ? FUEL_EF.diesel : 
                    data.fuelType === 'cng' ? FUEL_EF.cng :
                    FUEL_EF.petrol;
        
        // CO2 emissions
        co2_ttw = fuelUsed * ('co2_per_L' in ef ? ef.co2_per_L : ef.co2_per_kg);
        
        // CH4 and N2O emissions (converted to CO2e using GWP)
        ch4_ttw = (co2_ttw * ef.ch4_factor) * GWP_CH4;
        n2o_ttw = (co2_ttw * ef.n2o_factor) * GWP_N2O;
        
        // Well-to-Tank emissions if enabled
        if (data.includeWTW) {
          wtt = co2_ttw * ef.wtt_factor;
        }
      }
    } else if (data.calculationMethod === 'distance' && data.distance > 0) {
      // 2️⃣ Distance-Based Method (Tier 2 approximation)
      const efKey = data.vehicle as keyof typeof DISTANCE_EF;
      const ef = DISTANCE_EF[efKey] || 0.22; // Default to medium car
      
      co2_ttw = data.distance * ef;
      
      // Estimate CH4 and N2O (0.5% total for distance-based)
      const nonCO2 = co2_ttw * 0.005;
      ch4_ttw = nonCO2 * 0.6 * GWP_CH4;
      n2o_ttw = nonCO2 * 0.4 * GWP_N2O;
      
      // Well-to-Tank (approximate 20% for distance-based)
      if (data.includeWTW) {
        wtt = co2_ttw * 0.20;
      }
    }

    const totalCO2e = co2_ttw + ch4_ttw + n2o_ttw + wtt;
    
    return {
      total: totalCO2e,
      co2: co2_ttw,
      ch4: ch4_ttw,
      n2o: n2o_ttw,
      wtt: wtt
    };
  };

  // Real-time calculation effect
  useEffect(() => {
    const calculateEmissions = () => {
      const transportResult = calculateVehicleEmissions(transportData);
      const transportEmissions = transportResult.total;
      setDetailedTransport(transportResult);
      
      const energyResult = calculateEnergyEmissions(energyData);
      const energyEmissions = energyResult.total;
      setDetailedEnergy(energyResult);
      
      const wasteFactor = wasteData.disposal === "recycling" ? 0.1 : wasteData.disposal === "composting" ? 0.05 : wasteData.disposal === "incineration" ? 0.33 : 2.5;
      const wasteEmissions = wasteData.amount * wasteFactor;
      
      // Industry
      const indEf = INDUSTRY_EF[industryData.product];
      const indEmissions = indEf ? industryData.quantity * indEf.ef : 0;
      setIndustryEmissions(indEmissions);
      
      // Agriculture
      const agEf = AGRICULTURE_EF[agricultureData.activity];
      const agEmissions = agEf ? agricultureData.quantity * agEf.ef : 0;
      setAgricultureEmissions(agEmissions);
      
      // Digital
      const digEf = DIGITAL_EF[digitalData.activity];
      const digEmissions = digEf ? digitalData.quantity * digEf.ef : 0;
      setDigitalEmissions(digEmissions);
      
      const total = transportEmissions + energyEmissions + wasteEmissions + flightEmissions + seaEmissions + indEmissions + agEmissions + digEmissions;
      setTotalEmissions(total);
      setEmissionsBreakdown({
        transport: transportEmissions,
        energy: energyEmissions,
        waste: wasteEmissions,
        flight: flightEmissions,
        sea: seaEmissions,
        industry: indEmissions,
        agriculture: agEmissions,
        digital: digEmissions,
      });
      
      if (total > 0) {
        const now = new Date();
        const timeLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        setTrendData(prev => {
          const updated = [...prev, { time: timeLabel, emissions: total }];
          return updated.slice(-7);
        });
      }
    };
    
    calculateEmissions();
  }, [transportData, energyData, wasteData, flightEmissions, seaEmissions, industryData, agricultureData, digitalData]);

  const pieData = [
    { name: "Transport", value: emissionsBreakdown.transport, color: "#2563EB" },
    { name: "Energy", value: emissionsBreakdown.energy, color: "#10B981" },
    { name: "Waste", value: emissionsBreakdown.waste, color: "#F97316" },
    { name: "Flight", value: emissionsBreakdown.flight, color: "#8B5CF6" },
    { name: "Sea Freight", value: emissionsBreakdown.sea, color: "#0EA5E9" },
    { name: "Industry", value: emissionsBreakdown.industry, color: "#DC2626" },
    { name: "Agriculture", value: emissionsBreakdown.agriculture, color: "#84CC16" },
    { name: "Digital", value: emissionsBreakdown.digital, color: "#06B6D4" }
  ].filter(d => d.value > 0);

  const getInsights = () => {
    const insights = [];
    if (emissionsBreakdown.transport > totalEmissions * 0.4) {
      insights.push({ icon: Car, text: "Consider carpooling or public transport to reduce emissions by up to 30%", type: "warning" });
    }
    if (emissionsBreakdown.flight > 0) {
      insights.push({ icon: Plane, text: "Flight emissions are significant. Consider carbon offsetting or alternative travel for shorter routes.", type: "warning" });
    }
    if (emissionsBreakdown.sea > 0) {
      insights.push({ icon: Ship, text: "Sea freight has lower emissions per tonne-km than air. Consider consolidating shipments for efficiency.", type: "tip" });
    }
    if (energyData.gridType !== 'renewable' && !energyData.hasRenewableCerts) {
      insights.push({ icon: Zap, text: "Switch to renewable energy sources or obtain RECs to cut energy emissions by 50-100%", type: "tip" });
    }
    if (wasteData.disposal === "landfill") {
      insights.push({ icon: Recycle, text: "Composting and recycling can reduce waste emissions by up to 90%", type: "tip" });
    }
    if (totalEmissions > 100) {
      insights.push({ icon: Target, text: "Your emissions are above average. Small daily changes can make a big impact!", type: "info" });
    } else if (totalEmissions > 0) {
      insights.push({ icon: Leaf, text: "Great work! You're below the average carbon footprint.", type: "success" });
    }
    return insights;
  };

  // Find matching benchmark emission factors for current calculation
  const getMatchedBenchmarks = () => {
    if (factors.length === 0) return [];
    const tabCategoryMap: Record<string, string[]> = {
      transport: ["Transportation"],
      flight: ["Transportation"],
      sea: ["Transportation"],
      energy: ["Energy"],
      waste: ["Waste"],
      industry: ["Industry"],
      agriculture: ["Agriculture"],
      digital: ["Digital"],
    };
    const categories = tabCategoryMap[activeTab] || [];
    return factors.filter(f => categories.includes(f.category)).slice(0, 4);
  };

  const matchedBenchmarks = getMatchedBenchmarks();

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* ── Summary Metric Strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "TOTAL", value: totalEmissions.toFixed(2), unit: "kg CO₂e", icon: Calculator, accent: "#4F46E5", gradient: "from-[#4F46E5]/8 to-[#4F46E5]/2", iconBg: "bg-[#4F46E5]/10", trend: totalEmissions > 50 },
            { label: "TRANSPORT", value: emissionsBreakdown.transport.toFixed(1), unit: "kg", icon: Car, accent: "#2563EB", gradient: "from-[#2563EB]/8 to-[#2563EB]/2", iconBg: "bg-[#2563EB]/10" },
            { label: "FLIGHT", value: emissionsBreakdown.flight.toFixed(1), unit: "kg", icon: Plane, accent: "#8B5CF6", gradient: "from-[#8B5CF6]/8 to-[#8B5CF6]/2", iconBg: "bg-[#8B5CF6]/10" },
            { label: "SEA FREIGHT", value: emissionsBreakdown.sea.toFixed(1), unit: "kg", icon: Ship, accent: "#0EA5E9", gradient: "from-[#0EA5E9]/8 to-[#0EA5E9]/2", iconBg: "bg-[#0EA5E9]/10" },
            { label: "ENERGY & WASTE", value: (emissionsBreakdown.energy + emissionsBreakdown.waste).toFixed(1), unit: "kg", icon: Factory, accent: "#F97316", gradient: "from-[#F97316]/8 to-[#F97316]/2", iconBg: "bg-[#F97316]/10" },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} border border-gray-200/60 rounded-xl p-4 cursor-default`}
              >
                {/* Subtle decorative circle */}
                <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-[0.07]" style={{ backgroundColor: card.accent }} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-extrabold tracking-[0.15em] text-gray-400 uppercase">{card.label}</span>
                    <div className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                      <Icon className="h-3.5 w-3.5" style={{ color: card.accent }} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold text-gray-900 tracking-tight leading-none">{card.value}</span>
                    <span className="text-[10px] font-semibold text-gray-400">{card.unit}</span>
                  </div>
                  {card.trend !== undefined && (
                    <div className="flex items-center gap-1 mt-2">
                      {card.trend ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100/80">
                          <TrendingUp className="h-3 w-3 text-orange-500" />
                          <span className="text-[9px] text-orange-600 font-bold">Above target</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/80">
                          <TrendingDown className="h-3 w-3 text-emerald-500" />
                          <span className="text-[9px] text-emerald-600 font-bold">On track</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Main Layout: Forms + Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Calculator Forms */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Inner tab bar */}
              <div className="flex items-center gap-1 px-3 pt-3 pb-0 border-b border-gray-100 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {[
                  { id: "transport", label: "TRANSPORT", icon: Truck, accent: "#2563EB" },
                  { id: "flight", label: "FLIGHT", icon: Plane, accent: "#8B5CF6" },
                  { id: "sea", label: "SEA", icon: Ship, accent: "#0EA5E9" },
                  { id: "energy", label: "ENERGY", icon: Zap, accent: "#10B981" },
                  { id: "waste", label: "WASTE", icon: Recycle, accent: "#F97316" },
                  { id: "industry", label: "INDUSTRY", icon: Factory, accent: "#DC2626" },
                  { id: "agriculture", label: "AGRI", icon: Leaf, accent: "#84CC16" },
                  { id: "digital", label: "DIGITAL", icon: Lightbulb, accent: "#06B6D4" },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold tracking-wide rounded-t-md transition-all whitespace-nowrap ${
                        isActive ? "text-white shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                      style={isActive ? { backgroundColor: tab.accent } : {}}
                    >
                      <Icon className="h-3 w-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Form Content */}
              <div className="p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.1 }}
                  >
                    {/* ─── TRANSPORT FORM ─── */}
                    {activeTab === "transport" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Calculation Method</label>
                          <Select value={transportData.calculationMethod} onValueChange={(v: 'fuel' | 'distance') => setTransportData({ ...transportData, calculationMethod: v })}>
                            <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fuel">Fuel-Based (IPCC Tier 1 & 2)</SelectItem>
                              <SelectItem value="distance">Distance-Based (Tier 2)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                            Distance (km)
                            <Tooltip><TooltipTrigger><Info className="h-3 w-3 text-gray-400" /></TooltipTrigger><TooltipContent>Total distance traveled</TooltipContent></Tooltip>
                          </label>
                          <Input type="number" value={transportData.distance || ''} onChange={(e) => setTransportData({ ...transportData, distance: Number(e.target.value) })} placeholder="e.g., 1000" className="h-9 rounded-md border-gray-200 text-[12px]" />
                        </div>
                        {transportData.calculationMethod === 'fuel' ? (
                          <>
                            <div>
                              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Fuel Type</label>
                              <Select value={transportData.fuelType} onValueChange={(v) => setTransportData({ ...transportData, fuelType: v })}>
                                <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="petrol">Petrol (2.34 kgCO₂/L)</SelectItem>
                                  <SelectItem value="diesel">Diesel (2.68 kgCO₂/L)</SelectItem>
                                  <SelectItem value="cng">CNG (2.80 kgCO₂/kg)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                Fuel Economy (L/100km)
                                <Tooltip><TooltipTrigger><Info className="h-3 w-3 text-gray-400" /></TooltipTrigger><TooltipContent>Vehicle fuel consumption rate</TooltipContent></Tooltip>
                              </label>
                              <Input type="number" step="0.1" value={transportData.fuelEconomy || ''} onChange={(e) => setTransportData({ ...transportData, fuelEconomy: Number(e.target.value) })} placeholder="e.g., 7.0" className="h-9 rounded-md border-gray-200 text-[12px]" />
                            </div>
                          </>
                        ) : (
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Vehicle Type</label>
                            <Select value={transportData.vehicle} onValueChange={(v) => setTransportData({ ...transportData, vehicle: v })}>
                              <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small-petrol">Small Petrol (0.180 kg/km)</SelectItem>
                                <SelectItem value="medium-petrol">Medium Petrol (0.220 kg/km)</SelectItem>
                                <SelectItem value="large-petrol">Large Petrol (0.280 kg/km)</SelectItem>
                                <SelectItem value="small-diesel">Small Diesel (0.165 kg/km)</SelectItem>
                                <SelectItem value="medium-diesel">Medium Diesel (0.220 kg/km)</SelectItem>
                                <SelectItem value="large-diesel">Large Diesel (0.270 kg/km)</SelectItem>
                                <SelectItem value="motorcycle">Motorcycle (0.080 kg/km)</SelectItem>
                                <SelectItem value="bus-per-passenger">Bus/passenger (0.105 kg/km)</SelectItem>
                                <SelectItem value="train-per-passenger">Train/passenger (0.041 kg/km)</SelectItem>
                                <SelectItem value="electric">Electric (0.053 kg/km)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <label className="flex items-center gap-2 py-1 cursor-pointer">
                          <input type="checkbox" checked={transportData.includeWTW} onChange={(e) => setTransportData({ ...transportData, includeWTW: e.target.checked })} className="rounded border-gray-300 h-3.5 w-3.5" />
                          <span className="text-[11px] font-medium text-gray-700">Include Well-to-Wheel (WTW)</span>
                        </label>

                        {detailedTransport.total > 0 && (
                          <ResultCard accent="#2563EB">
                            <ResultRow label="CO₂ (Tank-to-Wheel)" value={`${detailedTransport.co2.toFixed(2)} kg`} />
                            <ResultRow label={`CH₄ (GWP=${GWP_CH4})`} value={`${detailedTransport.ch4.toFixed(2)} kg`} />
                            <ResultRow label={`N₂O (GWP=${GWP_N2O})`} value={`${detailedTransport.n2o.toFixed(2)} kg`} />
                            {transportData.includeWTW && <ResultRow label="Well-to-Tank" value={`${detailedTransport.wtt.toFixed(2)} kg`} accent />}
                            <ResultTotal label={`Total CO₂e ${transportData.includeWTW ? '(WTW)' : '(TTW)'}`} value={`${detailedTransport.total.toFixed(2)} kg`} />
                            <SaveButton onClick={saveTransportCalculation} accent="#2563EB" />
                          </ResultCard>
                        )}
                      </div>
                    )}

                    {/* ─── FLIGHT FORM ─── */}
                    {activeTab === "flight" && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-[#8B5CF6]/5 border border-[#8B5CF6]/15">
                          <div className="flex items-center gap-2 mb-1">
                            <Plane className="h-4 w-4 text-[#8B5CF6]" />
                            <span className="text-[11px] font-bold text-gray-800">Flight Emissions Calculator</span>
                          </div>
                          <p className="text-[10px] text-gray-500">ICAO/DEFRA emission factors with real airport coordinates.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Departure</label>
                            <AirportSearch value={flightData.departureIata} onChange={(iata) => setFlightData({ ...flightData, departureIata: iata })} placeholder="Search city..." />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Arrival</label>
                            <AirportSearch value={flightData.arrivalIata} onChange={(iata) => setFlightData({ ...flightData, arrivalIata: iata })} placeholder="Search city..." />
                          </div>
                        </div>
                        <FlightRouteMap
                          departure={flightResult ? { iata: flightResult.route.departure.iata, name: flightResult.route.departure.name, lat: flightResult.route.departure.coordinates.latitude, lon: flightResult.route.departure.coordinates.longitude } : undefined}
                          arrival={flightResult ? { iata: flightResult.route.arrival.iata, name: flightResult.route.arrival.name, lat: flightResult.route.arrival.coordinates.latitude, lon: flightResult.route.arrival.coordinates.longitude } : undefined}
                          distanceKm={flightResult?.distance.km}
                        />
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Passengers</label>
                          <Input type="number" min={1} value={flightData.passengers || ''} onChange={(e) => setFlightData({ ...flightData, passengers: Math.max(1, Number(e.target.value)) })} placeholder="1" className="h-9 rounded-md border-gray-200 text-[12px]" />
                        </div>
                        <label className="flex items-center gap-2 py-1 cursor-pointer">
                          <input type="checkbox" checked={flightData.includeRF} onChange={(e) => setFlightData({ ...flightData, includeRF: e.target.checked })} className="rounded border-gray-300 h-3.5 w-3.5" />
                          <span className="text-[11px] font-medium text-gray-700">Include non-CO₂ effects (RF ×1.9)</span>
                        </label>
                        <button onClick={calculateFlightEmissions} disabled={flightLoading} className="w-full h-9 rounded-md bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[11px] font-bold tracking-wide transition-colors flex items-center justify-center gap-2">
                          {flightLoading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Calculating...</> : <><Calculator className="h-3.5 w-3.5" /> CALCULATE FLIGHT</>}
                        </button>

                        {flightResult && (
                          <div className="space-y-3 mt-2">
                            <div className="p-3 rounded-md bg-[#8B5CF6]/5 border border-[#8B5CF6]/15">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-center">
                                  <div className="text-sm font-bold text-[#8B5CF6]">{flightResult.route.departure.iata}</div>
                                  <div className="text-[10px] text-gray-500 max-w-[100px] truncate">{flightResult.route.departure.city}</div>
                                </div>
                                <div className="flex-1 flex items-center justify-center px-3">
                                  <div className="h-px flex-1 bg-[#8B5CF6]/30" /><Plane className="h-4 w-4 text-[#8B5CF6] mx-1.5 rotate-90" /><div className="h-px flex-1 bg-[#8B5CF6]/30" />
                                </div>
                                <div className="text-center">
                                  <div className="text-sm font-bold text-[#8B5CF6]">{flightResult.route.arrival.iata}</div>
                                  <div className="text-[10px] text-gray-500 max-w-[100px] truncate">{flightResult.route.arrival.city}</div>
                                </div>
                              </div>
                              <div className="text-center text-[11px] text-gray-500">{flightResult.distance.km.toLocaleString()} km ({flightResult.distance.miles.toLocaleString()} mi)</div>
                            </div>
                            <ResultCard accent="#8B5CF6">
                              <ResultRow label="Category" value={flightResult.emissions.category} />
                              <ResultRow label="EF" value={`${flightResult.emissions.emissionFactor} kg CO₂/km`} />
                              <ResultRow label="CO₂/passenger" value={`${flightResult.emissions.co2PerPassenger.toFixed(2)} kg`} />
                              {flightData.includeRF && flightResult.emissions.co2ePerPassenger && (
                                <ResultRow label="CO₂e/passenger (RF)" value={`${flightResult.emissions.co2ePerPassenger.toFixed(2)} kg`} accent />
                              )}
                              <ResultTotal label={`Total ${flightData.includeRF ? 'CO₂e' : 'CO₂'}`} value={`${(flightData.includeRF ? flightResult.emissions.totalCo2e : flightResult.emissions.totalCo2)?.toFixed(2)} kg`} />
                            </ResultCard>
                            <div className="p-2 rounded-md bg-gray-50 border border-gray-200">
                              <p className="text-[10px] text-gray-500"><strong>Methodology:</strong> {flightResult.methodology.distanceCalculation} • {flightResult.methodology.emissionFactors}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ─── SEA FREIGHT FORM ─── */}
                    {activeTab === "sea" && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-[#0EA5E9]/5 border border-[#0EA5E9]/15">
                          <div className="flex items-center gap-2 mb-1">
                            <Ship className="h-4 w-4 text-[#0EA5E9]" />
                            <span className="text-[11px] font-bold text-gray-800">Sea Freight Emissions Calculator</span>
                          </div>
                          <p className="text-[10px] text-gray-500">IMO/GLEC Framework and IPCC methodologies.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Origin Port</label>
                            <PortSearch value={seaFreightData.originPort?.code || ''} onChange={(port) => setSeaFreightData({ ...seaFreightData, originPort: port })} placeholder="Search port..." />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Destination Port</label>
                            <PortSearch value={seaFreightData.destinationPort?.code || ''} onChange={(port) => setSeaFreightData({ ...seaFreightData, destinationPort: port })} placeholder="Search port..." />
                          </div>
                        </div>
                        <SeaRouteMap origin={seaFreightData.originPort || undefined} destination={seaFreightData.destinationPort || undefined} distanceKm={seaFreightResult?.distance} routeGeometry={seaFreightResult?.routeGeometry} waypoints={seaFreightResult?.waypoints} />
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Cargo Weight (t)</label>
                            <Input type="number" min={0} value={seaFreightData.cargoWeight || ''} onChange={(e) => setSeaFreightData({ ...seaFreightData, cargoWeight: Number(e.target.value) })} placeholder="e.g., 20" className="h-9 rounded-md border-gray-200 text-[12px]" />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Ship Type</label>
                            <Select value={seaFreightData.shipType} onValueChange={(v) => setSeaFreightData({ ...seaFreightData, shipType: v })}>
                              <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="container">Container Ship</SelectItem>
                                <SelectItem value="bulk-carrier">Bulk Carrier</SelectItem>
                                <SelectItem value="oil-tanker">Oil/Chemical Tanker</SelectItem>
                                <SelectItem value="ro-ro">Ro-Ro</SelectItem>
                                <SelectItem value="general-cargo">General Cargo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Fuel Type</label>
                            <Select value={seaFreightData.fuelType} onValueChange={(v) => setSeaFreightData({ ...seaFreightData, fuelType: v })}>
                              <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="hfo">Heavy Fuel Oil (HFO)</SelectItem>
                                <SelectItem value="mgo">Marine Gas Oil (MGO)</SelectItem>
                                <SelectItem value="lng">LNG</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Calc Method</label>
                            <Select value={seaFreightData.calculationMethod} onValueChange={(v: 'tonne-km' | 'fuel-based') => setSeaFreightData({ ...seaFreightData, calculationMethod: v })}>
                              <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tonne-km">Tonne-km (GLEC/IPCC)</SelectItem>
                                <SelectItem value="fuel-based">Fuel-Based (IMO)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {seaFreightData.calculationMethod === 'fuel-based' && (
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Fuel Consumed (tonnes)</label>
                            <Input type="number" min={0} step={0.1} value={seaFreightData.fuelConsumed || ''} onChange={(e) => setSeaFreightData({ ...seaFreightData, fuelConsumed: Number(e.target.value) })} placeholder="e.g., 150" className="h-9 rounded-md border-gray-200 text-[12px]" />
                          </div>
                        )}
                        <button onClick={calculateSeaFreightEmissions} disabled={seaLoading} className="w-full h-9 rounded-md bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-[11px] font-bold tracking-wide transition-colors flex items-center justify-center gap-2">
                          {seaLoading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Calculating...</> : <><Calculator className="h-3.5 w-3.5" /> CALCULATE SEA FREIGHT</>}
                        </button>

                        {seaFreightResult && (
                          <div className="space-y-3 mt-2">
                            <div className="p-3 rounded-md bg-[#0EA5E9]/5 border border-[#0EA5E9]/15">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-center">
                                  <div className="text-sm font-bold text-[#0EA5E9]">{seaFreightData.originPort?.code}</div>
                                  <div className="text-[10px] text-gray-500 truncate max-w-[100px]">{seaFreightData.originPort?.city}</div>
                                </div>
                                <div className="flex-1 flex items-center justify-center px-3">
                                  <div className="h-px flex-1 bg-[#0EA5E9]/30" /><Ship className="h-4 w-4 text-[#0EA5E9] mx-1.5" /><div className="h-px flex-1 bg-[#0EA5E9]/30" />
                                </div>
                                <div className="text-center">
                                  <div className="text-sm font-bold text-[#0EA5E9]">{seaFreightData.destinationPort?.code}</div>
                                  <div className="text-[10px] text-gray-500 truncate max-w-[100px]">{seaFreightData.destinationPort?.city}</div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mt-2 text-center">
                                <div><span className="text-[10px] text-gray-500">Distance</span><div className="text-[12px] font-semibold text-gray-800">{seaFreightResult.distance.toLocaleString()} km</div></div>
                                <div><span className="text-[10px] text-gray-500">Tonne-km</span><div className="text-[12px] font-semibold text-gray-800">{seaFreightResult.tonneKm.toLocaleString()}</div></div>
                              </div>
                            </div>
                            <ResultCard accent="#0EA5E9">
                              <ResultRow label="Ship Type" value={seaFreightData.shipType.replace('-', ' ')} />
                              <ResultRow label="Method" value={seaFreightResult.method === 'tonne-km' ? 'Tonne-km (GLEC)' : 'Fuel-based (IMO)'} />
                              <ResultRow label="CO₂" value={`${seaFreightResult.emissions.co2.toFixed(2)} kg`} />
                              <ResultRow label="CH₄ (CO₂e)" value={`${seaFreightResult.emissions.ch4.toFixed(2)} kg`} />
                              <ResultRow label="N₂O (CO₂e)" value={`${seaFreightResult.emissions.n2o.toFixed(2)} kg`} />
                              <ResultTotal label="Total CO₂e" value={`${seaFreightResult.emissions.co2e.toFixed(2)} kg`} />
                              <SaveButton onClick={saveSeaFreightCalculation} accent="#0EA5E9" />
                            </ResultCard>
                            <RouteComparison
                              origin={seaFreightData.originPort}
                              destination={seaFreightData.destinationPort}
                              cargoWeight={seaFreightData.cargoWeight}
                              shipType={seaFreightData.shipType}
                              primaryRoute={seaFreightResult ? { name: seaFreightResult.waypoints.length > 0 ? `Via ${seaFreightResult.waypoints[0]}` : 'Direct', distance: seaFreightResult.distance, waypoints: seaFreightResult.waypoints || [], geometry: seaFreightResult.routeGeometry || [], co2: seaFreightResult.emissions.co2e, estimatedDays: Math.round((seaFreightResult.distance / 1.852) / (15 * 24)) } : undefined}
                              calculateRoute={calculateSeaRoute}
                              emissionFactor={SHIP_EF[seaFreightData.shipType as keyof typeof SHIP_EF] || 0.015}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* ─── ENERGY FORM ─── */}
                    {activeTab === "energy" && (
                      <div className="space-y-4">
                        {/* Scope 2 */}
                        <div className="p-3 rounded-md bg-[#10B981]/5 border border-[#10B981]/15 space-y-3">
                          <div className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-[#10B981]" /><span className="text-[11px] font-bold text-gray-800">Electricity (Scope 2)</span></div>
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Consumption (kWh)</label>
                            <Input type="number" value={energyData.electricity || ''} onChange={(e) => setEnergyData({ ...energyData, electricity: Number(e.target.value) })} placeholder="e.g., 5000" className="h-9 rounded-md border-gray-200 text-[12px]" />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Method</label>
                            <Select value={energyData.electricityMethod} onValueChange={(v: 'location' | 'market') => setEnergyData({ ...energyData, electricityMethod: v })}>
                              <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="location">Location-Based</SelectItem>
                                <SelectItem value="market">Market-Based</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {energyData.electricityMethod === 'location' ? (
                            <div>
                              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Grid Type</label>
                              <Select value={energyData.gridType} onValueChange={(v) => setEnergyData({ ...energyData, gridType: v })}>
                                <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="grid-mixed">Global Average (0.25)</SelectItem>
                                  <SelectItem value="grid-uk">UK (0.193)</SelectItem>
                                  <SelectItem value="grid-us">US (0.386)</SelectItem>
                                  <SelectItem value="grid-eu">EU (0.295)</SelectItem>
                                  <SelectItem value="grid-china">China (0.555)</SelectItem>
                                  <SelectItem value="grid-india">India (0.708)</SelectItem>
                                  <SelectItem value="coal-heavy">Coal-Heavy (0.82)</SelectItem>
                                  <SelectItem value="gas-heavy">Gas-Heavy (0.49)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <>
                              <label className="flex items-center gap-2 py-1 cursor-pointer">
                                <input type="checkbox" checked={energyData.hasRenewableCerts} onChange={(e) => setEnergyData({ ...energyData, hasRenewableCerts: e.target.checked })} className="rounded border-gray-300 h-3.5 w-3.5" />
                                <span className="text-[11px] font-medium text-gray-700">Renewable Certificates (RECs/REGOs)</span>
                              </label>
                              {!energyData.hasRenewableCerts && (
                                <div>
                                  <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Supplier EF (kgCO₂e/kWh)</label>
                                  <Input type="number" step="0.001" value={energyData.supplierEF || ''} onChange={(e) => setEnergyData({ ...energyData, supplierEF: e.target.value ? Number(e.target.value) : undefined })} placeholder="e.g., 0.15" className="h-9 rounded-md border-gray-200 text-[12px]" />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        {/* Scope 1 */}
                        <div className="p-3 rounded-md bg-[#F97316]/5 border border-[#F97316]/15 space-y-3">
                          <div className="flex items-center gap-2"><Factory className="h-3.5 w-3.5 text-[#F97316]" /><span className="text-[11px] font-bold text-gray-800">Stationary Fuel (Scope 1)</span></div>
                          <div>
                            <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Fuel Type</label>
                            <Select value={energyData.fuelType} onValueChange={(v) => setEnergyData({ ...energyData, fuelType: v })}>
                              <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="natural-gas">Natural Gas</SelectItem>
                                <SelectItem value="diesel">Diesel</SelectItem>
                                <SelectItem value="lpg">LPG</SelectItem>
                                <SelectItem value="fuel-oil">Fuel Oil</SelectItem>
                                <SelectItem value="coal">Coal</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Amount</label>
                              <Input type="number" value={energyData.fuelAmount || ''} onChange={(e) => setEnergyData({ ...energyData, fuelAmount: Number(e.target.value) })} placeholder="e.g., 1000" className="h-9 rounded-md border-gray-200 text-[12px]" />
                            </div>
                            <div>
                              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Unit</label>
                              <Select value={energyData.fuelUnit} onValueChange={(v: 'L' | 'kWh' | 'GJ') => setEnergyData({ ...energyData, fuelUnit: v })}>
                                <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="L">Liters</SelectItem>
                                  <SelectItem value="kWh">kWh</SelectItem>
                                  <SelectItem value="GJ">GJ</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {detailedEnergy.total > 0 && (
                          <ResultCard accent="#10B981">
                            <ResultRow label={`Scope 2 (${detailedEnergy.method === 'location' ? 'Location' : 'Market'})`} value={`${detailedEnergy.scope2.toFixed(2)} kg CO₂e`} />
                            <ResultRow label="Scope 1 (Fuel)" value={`${detailedEnergy.scope1.toFixed(2)} kg CO₂`} />
                            <ResultTotal label="Total Energy" value={`${detailedEnergy.total.toFixed(2)} kg CO₂e`} />
                            <SaveButton onClick={saveEnergyCalculation} accent="#10B981" />
                          </ResultCard>
                        )}
                      </div>
                    )}

                    {/* ─── WASTE FORM ─── */}
                    {activeTab === "waste" && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Waste Amount (kg/month)</label>
                          <Input type="number" value={wasteData.amount || ''} onChange={(e) => setWasteData({ ...wasteData, amount: Number(e.target.value) })} placeholder="e.g., 100" className="h-9 rounded-md border-gray-200 text-[12px]" />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Waste Type</label>
                          <Select value={wasteData.type} onValueChange={(v) => setWasteData({ ...wasteData, type: v })}>
                            <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mixed">Mixed</SelectItem>
                              <SelectItem value="organic">Organic</SelectItem>
                              <SelectItem value="plastic">Plastic</SelectItem>
                              <SelectItem value="paper">Paper</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Disposal Method</label>
                          <Select value={wasteData.disposal} onValueChange={(v) => setWasteData({ ...wasteData, disposal: v })}>
                            <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="landfill">Landfill</SelectItem>
                              <SelectItem value="recycling">Recycling</SelectItem>
                              <SelectItem value="composting">Composting</SelectItem>
                              <SelectItem value="incineration">Incineration</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {emissionsBreakdown.waste > 0 && (
                          <ResultCard accent="#F97316">
                            <ResultRow label="Waste Type" value={wasteData.type} />
                            <ResultRow label="Disposal" value={wasteData.disposal} />
                            <ResultTotal label="Total Waste" value={`${emissionsBreakdown.waste.toFixed(2)} kg CO₂e`} />
                            <SaveButton onClick={saveWasteCalculation} accent="#F97316" />
                          </ResultCard>
                        )}
                      </div>
                    )}

                    {/* ─── INDUSTRY FORM ─── */}
                    {activeTab === "industry" && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-[#DC2626]/5 border border-[#DC2626]/15">
                          <div className="flex items-center gap-2 mb-1">
                            <Factory className="h-4 w-4 text-[#DC2626]" />
                            <span className="text-[11px] font-bold text-gray-800">Industry & Manufacturing</span>
                          </div>
                          <p className="text-[10px] text-gray-500">CBAM, ecoinvent & EPA emission factors for industrial products and processes.</p>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Product / Process</label>
                          <Select value={industryData.product} onValueChange={(v) => setIndustryData({ ...industryData, product: v })}>
                            <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Object.entries(INDUSTRY_EF).map(([key, val]) => (
                                <SelectItem key={key} value={key}>
                                  {key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} ({val.ef} kgCO₂e/{val.unit})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                            Quantity ({INDUSTRY_EF[industryData.product]?.unit || 'units'})
                            <Tooltip><TooltipTrigger><Info className="h-3 w-3 text-gray-400" /></TooltipTrigger><TooltipContent>Amount of product manufactured or process quantity</TooltipContent></Tooltip>
                          </label>
                          <Input type="number" value={industryData.quantity || ''} onChange={(e) => setIndustryData({ ...industryData, quantity: Number(e.target.value) })} placeholder="e.g., 1000" className="h-9 rounded-md border-gray-200 text-[12px]" />
                        </div>
                        {industryEmissions > 0 && (
                          <ResultCard accent="#DC2626">
                            <ResultRow label="Product" value={industryData.product.replace(/-/g, ' ')} />
                            <ResultRow label="EF" value={`${INDUSTRY_EF[industryData.product]?.ef} kgCO₂e/${INDUSTRY_EF[industryData.product]?.unit}`} />
                            <ResultRow label="Source" value={INDUSTRY_EF[industryData.product]?.source || 'N/A'} />
                            <ResultRow label="Quantity" value={`${industryData.quantity} ${INDUSTRY_EF[industryData.product]?.unit}`} />
                            <ResultTotal label="Total Industry" value={`${industryEmissions.toFixed(2)} kg CO₂e`} />
                            <SaveButton onClick={async () => { await saveCalculation('vehicle', industryData, { total: industryEmissions }, industryEmissions); }} accent="#DC2626" />
                          </ResultCard>
                        )}
                      </div>
                    )}

                    {/* ─── AGRICULTURE FORM ─── */}
                    {activeTab === "agriculture" && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-[#84CC16]/10 border border-[#84CC16]/20">
                          <div className="flex items-center gap-2 mb-1">
                            <Leaf className="h-4 w-4 text-[#84CC16]" />
                            <span className="text-[11px] font-bold text-gray-800">Agriculture & Land Use</span>
                          </div>
                          <p className="text-[10px] text-gray-500">IPCC AR6 & ecoinvent factors for crops, livestock, and fertilizers.</p>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Activity</label>
                          <Select value={agricultureData.activity} onValueChange={(v) => setAgricultureData({ ...agricultureData, activity: v })}>
                            <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Object.entries(AGRICULTURE_EF).map(([key, val]) => (
                                <SelectItem key={key} value={key}>
                                  {key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} ({val.ef} kgCO₂e/{val.unit})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                            Quantity ({AGRICULTURE_EF[agricultureData.activity]?.unit || 'units'})
                            <Tooltip><TooltipTrigger><Info className="h-3 w-3 text-gray-400" /></TooltipTrigger><TooltipContent>Amount of activity (e.g., kg fertilizer applied, number of heads)</TooltipContent></Tooltip>
                          </label>
                          <Input type="number" value={agricultureData.quantity || ''} onChange={(e) => setAgricultureData({ ...agricultureData, quantity: Number(e.target.value) })} placeholder="e.g., 500" className="h-9 rounded-md border-gray-200 text-[12px]" />
                        </div>
                        {agricultureEmissions > 0 && (
                          <ResultCard accent="#84CC16">
                            <ResultRow label="Activity" value={agricultureData.activity.replace(/-/g, ' ')} />
                            <ResultRow label="EF" value={`${AGRICULTURE_EF[agricultureData.activity]?.ef} kgCO₂e/${AGRICULTURE_EF[agricultureData.activity]?.unit}`} />
                            <ResultRow label="Source" value={AGRICULTURE_EF[agricultureData.activity]?.source || 'N/A'} />
                            <ResultRow label="Quantity" value={`${agricultureData.quantity} ${AGRICULTURE_EF[agricultureData.activity]?.unit}`} />
                            <ResultTotal label="Total Agriculture" value={`${agricultureEmissions.toFixed(2)} kg CO₂e`} />
                            <SaveButton onClick={async () => { await saveCalculation('vehicle', agricultureData, { total: agricultureEmissions }, agricultureEmissions); }} accent="#84CC16" />
                          </ResultCard>
                        )}
                      </div>
                    )}

                    {/* ─── DIGITAL FORM ─── */}
                    {activeTab === "digital" && (
                      <div className="space-y-3">
                        <div className="p-3 rounded-md bg-[#06B6D4]/5 border border-[#06B6D4]/15">
                          <div className="flex items-center gap-2 mb-1">
                            <Lightbulb className="h-4 w-4 text-[#06B6D4]" />
                            <span className="text-[11px] font-bold text-gray-800">Digital & Cloud Services</span>
                          </div>
                          <p className="text-[10px] text-gray-500">Emission factors for cloud computing, streaming, data centres, and digital activities.</p>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Activity</label>
                          <Select value={digitalData.activity} onValueChange={(v) => setDigitalData({ ...digitalData, activity: v })}>
                            <SelectTrigger className="h-9 rounded-md border-gray-200 text-[12px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Object.entries(DIGITAL_EF).map(([key, val]) => (
                                <SelectItem key={key} value={key}>
                                  {key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} ({val.ef} kgCO₂e/{val.unit})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                            Quantity ({DIGITAL_EF[digitalData.activity]?.unit || 'units'})
                            <Tooltip><TooltipTrigger><Info className="h-3 w-3 text-gray-400" /></TooltipTrigger><TooltipContent>Number of units consumed (e.g., instance-hours, emails sent)</TooltipContent></Tooltip>
                          </label>
                          <Input type="number" value={digitalData.quantity || ''} onChange={(e) => setDigitalData({ ...digitalData, quantity: Number(e.target.value) })} placeholder="e.g., 10000" className="h-9 rounded-md border-gray-200 text-[12px]" />
                        </div>
                        {digitalEmissions > 0 && (
                          <ResultCard accent="#06B6D4">
                            <ResultRow label="Activity" value={digitalData.activity.replace(/-/g, ' ')} />
                            <ResultRow label="EF" value={`${DIGITAL_EF[digitalData.activity]?.ef} kgCO₂e/${DIGITAL_EF[digitalData.activity]?.unit}`} />
                            <ResultRow label="Source" value={DIGITAL_EF[digitalData.activity]?.source || 'N/A'} />
                            <ResultRow label="Quantity" value={`${digitalData.quantity} ${DIGITAL_EF[digitalData.activity]?.unit}`} />
                            <ResultTotal label="Total Digital" value={`${digitalEmissions.toFixed(2)} kg CO₂e`} />
                            <SaveButton onClick={async () => { await saveCalculation('vehicle', digitalData, { total: digitalEmissions }, digitalEmissions); }} accent="#06B6D4" />
                          </ResultCard>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-3">Emission Trend</h3>
                {trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                      <Line type="monotone" dataKey="emissions" stroke="#4F46E5" strokeWidth={2} dot={{ fill: "#4F46E5", r: 2.5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[160px] flex items-center justify-center text-[11px] text-gray-400">Enter data to see trends</div>
                )}
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-[11px] font-bold text-gray-600 uppercase tracking-wide mb-3">Breakdown</h3>
                {totalEmissions > 0 ? (
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3}>
                        {pieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                      </Pie>
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[160px] flex items-center justify-center text-[11px] text-gray-400">No data</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Insights */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 h-fit">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
              <h3 className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">Sustainability Insights</h3>
            </div>
            <div className="space-y-2">
              {getInsights().map((insight, idx) => {
                const InsightIcon = insight.icon;
                const colors: Record<string, string> = {
                  warning: 'bg-orange-50 border-orange-200 text-orange-700',
                  tip: 'bg-blue-50 border-blue-200 text-blue-700',
                  info: 'bg-purple-50 border-purple-200 text-purple-700',
                  success: 'bg-green-50 border-green-200 text-green-700'
                };
                return (
                  <div key={idx} className={`p-3 rounded-md border ${colors[insight.type] || ''}`}>
                    <div className="flex items-start gap-2">
                      <InsightIcon className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">{insight.text}</p>
                    </div>
                  </div>
                );
              })}
              {getInsights().length === 0 && (
                <div className="text-center py-6 text-[11px] text-gray-400">
                  <Leaf className="h-6 w-6 mx-auto mb-2 text-[#10B981]/40" />
                  Enter data for insights
                </div>
              )}
            </div>
            {totalEmissions > 10 && (
              <div className="mt-4 p-3 rounded-md bg-[#10B981]/5 border border-[#10B981]/15">
                <div className="flex items-center gap-1.5 mb-1">
                  <Leaf className="h-3.5 w-3.5 text-[#10B981]" />
                  <span className="text-[11px] font-bold text-gray-800">Carbon Offset</span>
                </div>
                <p className="text-[10px] text-gray-500">Plant <span className="font-bold text-[#10B981]">{Math.ceil(totalEmissions / 22)} trees</span> to offset • Est. cost: <span className="font-bold">${(totalEmissions * 0.02).toFixed(2)}</span></p>
              </div>
            )}

            {/* Matched Benchmark EFs */}
            {matchedBenchmarks.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-[#4F46E5]" />
                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">Related EFs</span>
                  </div>
                  {onSwitchToBenchmark && (
                    <button onClick={onSwitchToBenchmark} className="text-[10px] font-bold text-[#4F46E5] hover:underline flex items-center gap-0.5">
                      VIEW ALL <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div className="space-y-1.5">
                  {matchedBenchmarks.map((ef) => (
                    <div key={ef.id} className="p-2 rounded-md bg-[#4F46E5]/[0.03] border border-[#4F46E5]/10 hover:border-[#4F46E5]/25 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-gray-700 truncate max-w-[140px]">{ef.name}</span>
                        <span className="text-[10px] font-bold text-[#4F46E5] ml-2 shrink-0">{ef.fe} kgCO₂e/{ef.unit}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-gray-400">{ef.source}</span>
                        <span className="text-[9px] text-gray-300">•</span>
                        <span className="text-[9px] text-gray-400">{ef.scope.replace("scope", "Scope ")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

/* ─── Shared Sub-components ─── */

const ResultCard = ({ accent, children }: { accent: string; children: React.ReactNode }) => (
  <div className="p-3 rounded-md border space-y-1" style={{ borderColor: `${accent}30`, backgroundColor: `${accent}08` }}>
    {children}
  </div>
);

const ResultRow = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex justify-between text-[11px]">
    <span className={accent ? "text-orange-600" : "text-gray-500"}>{label}</span>
    <span className="font-mono text-gray-800">{value}</span>
  </div>
);

const ResultTotal = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-[11px] pt-1.5 mt-1 border-t border-gray-200 font-semibold">
    <span className="text-gray-800">{label}</span>
    <span className="font-mono text-gray-900">{value}</span>
  </div>
);

const SaveButton = ({ onClick, accent }: { onClick: () => void; accent: string }) => (
  <button onClick={onClick} className="w-full mt-2 h-8 rounded-md text-white text-[10px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90" style={{ backgroundColor: accent }}>
    <Save className="h-3 w-3" /> SAVE TO HISTORY
  </button>
);
