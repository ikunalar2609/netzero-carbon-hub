import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Zap, Truck, Car, Plane, Factory, Recycle, TrendingDown, TrendingUp, Leaf, Info, Lightbulb, Target, AlertCircle, Loader2, MapPin, Save } from "lucide-react";
import { toast } from "sonner";
import { useRegionDetection } from "@/hooks/useRegionDetection";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { AirportSearch } from "./AirportSearch";
import { FlightRouteMap } from "./FlightRouteMap";
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

// Electricity Grid Emission Factors (Scope 2 - Location-Based) - kgCO₂e/kWh
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

export const EmissionCalculator = () => {
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
  const [flightData, setFlightData] = useState<FlightData>({
    departureIata: '',
    arrivalIata: '',
    passengers: 1,
    includeRF: false
  });
  const [flightResult, setFlightResult] = useState<FlightResult | null>(null);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightEmissions, setFlightEmissions] = useState(0);
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [emissionsBreakdown, setEmissionsBreakdown] = useState({ transport: 0, energy: 0, waste: 0, flight: 0 });
  const [detailedTransport, setDetailedTransport] = useState({ total: 0, co2: 0, ch4: 0, n2o: 0, wtt: 0 });
  const [detailedEnergy, setDetailedEnergy] = useState({ total: 0, scope2: 0, scope1: 0, method: 'location' as 'location' | 'market' });
  const [trendData, setTrendData] = useState<any[]>([]);
  const { region } = useRegionDetection();

  // Save calculation to database
  const saveCalculation = async (
    type: 'flight' | 'vehicle' | 'energy' | 'diet',
    inputData: any,
    resultData: any,
    totalEmissions: number
  ) => {
    try {
      const { error } = await supabase.from('emission_calculations').insert({
        calculation_type: type,
        input_data: inputData,
        result_data: resultData,
        total_emissions: totalEmissions
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
      // Transport calculations with IPCC methodology
      const transportResult = calculateVehicleEmissions(transportData);
      const transportEmissions = transportResult.total;
      setDetailedTransport(transportResult);
      
      // Energy calculations with GHG Protocol Scope 1 & 2
      const energyResult = calculateEnergyEmissions(energyData);
      const energyEmissions = energyResult.total;
      setDetailedEnergy(energyResult);
      
      // Waste calculations
      const wasteFactor = wasteData.disposal === "recycling" ? 0.1 : wasteData.disposal === "composting" ? 0.05 : 2.5;
      const wasteEmissions = wasteData.amount * wasteFactor;
      
      const total = transportEmissions + energyEmissions + wasteEmissions + flightEmissions;
      setTotalEmissions(total);
      setEmissionsBreakdown({
        transport: transportEmissions,
        energy: energyEmissions,
        waste: wasteEmissions,
        flight: flightEmissions
      });
      
      // Update trend data
      if (total > 0) {
        const now = new Date();
        const timeLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        setTrendData(prev => {
          const updated = [...prev, { time: timeLabel, emissions: total }];
          return updated.slice(-7); // Keep last 7 data points
        });
      }
    };
    
    calculateEmissions();
  }, [transportData, energyData, wasteData, flightEmissions]);

  const pieData = [
    { name: "Transport", value: emissionsBreakdown.transport, color: "#2563EB" },
    { name: "Energy", value: emissionsBreakdown.energy, color: "#10B981" },
    { name: "Waste", value: emissionsBreakdown.waste, color: "#F97316" },
    { name: "Flight", value: emissionsBreakdown.flight, color: "#8B5CF6" }
  ].filter(d => d.value > 0);

  const getInsights = () => {
    const insights = [];
    if (emissionsBreakdown.transport > totalEmissions * 0.4) {
      insights.push({ icon: Car, text: "Consider carpooling or public transport to reduce emissions by up to 30%", type: "warning" });
    }
    if (emissionsBreakdown.flight > 0) {
      insights.push({ icon: Plane, text: "Flight emissions are significant. Consider carbon offsetting or alternative travel for shorter routes.", type: "warning" });
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

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-white to-[#F0F9FF] p-4 md:p-8">
        <div className="max-w-[1440px] mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">
              Emission Calculator Dashboard
            </h1>
            <p className="text-[#475569]">Track and optimize your carbon footprint in real-time</p>
          </motion.div>

          {/* Summary Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          >
            {/* Total Emissions Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#475569]">Total Emissions</span>
                  <Calculator className="h-5 w-5 text-[#2563EB]" />
                </div>
                <div className="text-3xl font-bold text-[#1E293B] mb-1">
                  {totalEmissions.toFixed(2)}
                  <span className="text-lg text-[#475569] ml-1">kg CO₂e</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {totalEmissions > 50 ? (
                    <>
                      <TrendingUp className="h-3 w-3 text-orange-500" />
                      <span className="text-orange-500">Above target</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 text-[#10B981]" />
                      <span className="text-[#10B981]">On track</span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Transport Emissions Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#475569]">Transport</span>
                  <Car className="h-5 w-5 text-[#10B981]" />
                </div>
                <div className="text-3xl font-bold text-[#1E293B] mb-1">
                  {emissionsBreakdown.transport.toFixed(1)}
                  <span className="text-lg text-[#475569] ml-1">kg</span>
                </div>
                <div className="text-xs text-[#475569]">
                  {totalEmissions > 0 ? `${((emissionsBreakdown.transport / totalEmissions) * 100).toFixed(0)}% of total` : '0% of total'}
                </div>
              </div>
            </motion.div>

            {/* Flight Emissions Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#475569]">Flight</span>
                  <Plane className="h-5 w-5 text-[#8B5CF6]" />
                </div>
                <div className="text-3xl font-bold text-[#1E293B] mb-1">
                  {emissionsBreakdown.flight.toFixed(1)}
                  <span className="text-lg text-[#475569] ml-1">kg</span>
                </div>
                <div className="text-xs text-[#475569]">
                  {totalEmissions > 0 ? `${((emissionsBreakdown.flight / totalEmissions) * 100).toFixed(0)}% of total` : '0% of total'}
                </div>
              </div>
            </motion.div>

            {/* Energy + Waste Combined Card */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 to-transparent" />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#475569]">Energy & Waste</span>
                  <Factory className="h-5 w-5 text-[#F97316]" />
                </div>
                <div className="text-3xl font-bold text-[#1E293B] mb-1">
                  {(emissionsBreakdown.energy + emissionsBreakdown.waste).toFixed(1)}
                  <span className="text-lg text-[#475569] ml-1">kg</span>
                </div>
                <div className="text-xs text-[#475569]">
                  Energy: {emissionsBreakdown.energy.toFixed(1)}kg | Waste: {emissionsBreakdown.waste.toFixed(1)}kg
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Input Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Input Forms Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 via-transparent to-[#10B981]/5" />
                <div className="relative p-6">
                  <h2 className="text-xl font-bold text-[#1E293B] mb-4">Calculate Emissions</h2>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4 mb-6 bg-[#F9FAFB]/50 backdrop-blur-sm">
                      <TabsTrigger value="transport" className="data-[state=active]:bg-white data-[state=active]:text-[#2563EB]">
                        <Truck className="h-4 w-4 mr-2" />
                        Transport
                      </TabsTrigger>
                      <TabsTrigger value="flight" className="data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6]">
                        <Plane className="h-4 w-4 mr-2" />
                        Flight
                      </TabsTrigger>
                      <TabsTrigger value="energy" className="data-[state=active]:bg-white data-[state=active]:text-[#10B981]">
                        <Zap className="h-4 w-4 mr-2" />
                        Energy
                      </TabsTrigger>
                      <TabsTrigger value="waste" className="data-[state=active]:bg-white data-[state=active]:text-[#F97316]">
                        <Recycle className="h-4 w-4 mr-2" />
                        Waste
                      </TabsTrigger>
                    </TabsList>

                    {/* Transport Form */}
                    <TabsContent value="transport" className="space-y-4 mt-0">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-[#1E293B] mb-2">Calculation Method</Label>
                          <Select 
                            value={transportData.calculationMethod} 
                            onValueChange={(v: 'fuel' | 'distance') => setTransportData({ ...transportData, calculationMethod: v })}
                          >
                            <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fuel">Fuel-Based (IPCC Tier 1 & 2)</SelectItem>
                              <SelectItem value="distance">Distance-Based (Tier 2)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-[#1E293B] mb-2 flex items-center gap-2">
                            Distance (km)
                            <Tooltip>
                              <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                              <TooltipContent>Total distance traveled</TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input 
                            type="number" 
                            value={transportData.distance || ''}
                            onChange={(e) => setTransportData({ ...transportData, distance: Number(e.target.value) })}
                            placeholder="e.g., 1000"
                            className="rounded-xl border-[#E5E7EB] focus:border-[#2563EB] focus:ring-[#2563EB] transition-all"
                          />
                        </div>

                        {transportData.calculationMethod === 'fuel' ? (
                          <>
                            <div>
                              <Label className="text-sm font-medium text-[#1E293B] mb-2">Fuel Type</Label>
                              <Select value={transportData.fuelType} onValueChange={(v) => setTransportData({ ...transportData, fuelType: v })}>
                                <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="petrol">Petrol (2.34 kgCO₂/L)</SelectItem>
                                  <SelectItem value="diesel">Diesel (2.68 kgCO₂/L)</SelectItem>
                                  <SelectItem value="cng">CNG (2.80 kgCO₂/kg)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-[#1E293B] mb-2 flex items-center gap-2">
                                Fuel Economy (L/100km)
                                <Tooltip>
                                  <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                                  <TooltipContent>Vehicle fuel consumption rate</TooltipContent>
                                </Tooltip>
                              </Label>
                              <Input 
                                type="number" 
                                step="0.1"
                                value={transportData.fuelEconomy || ''}
                                onChange={(e) => setTransportData({ ...transportData, fuelEconomy: Number(e.target.value) })}
                                placeholder="e.g., 7.0"
                                className="rounded-xl border-[#E5E7EB] focus:border-[#2563EB] focus:ring-[#2563EB] transition-all"
                              />
                            </div>
                          </>
                        ) : (
                          <div>
                            <Label className="text-sm font-medium text-[#1E293B] mb-2">Vehicle Type</Label>
                            <Select value={transportData.vehicle} onValueChange={(v) => setTransportData({ ...transportData, vehicle: v })}>
                              <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small-petrol">Small Petrol Car (0.180 kg/km)</SelectItem>
                                <SelectItem value="medium-petrol">Medium Petrol Car (0.220 kg/km)</SelectItem>
                                <SelectItem value="large-petrol">Large Petrol Car (0.280 kg/km)</SelectItem>
                                <SelectItem value="small-diesel">Small Diesel Car (0.165 kg/km)</SelectItem>
                                <SelectItem value="medium-diesel">Medium Diesel Car (0.220 kg/km)</SelectItem>
                                <SelectItem value="large-diesel">Large Diesel Car (0.270 kg/km)</SelectItem>
                                <SelectItem value="motorcycle">Motorcycle (0.080 kg/km)</SelectItem>
                                <SelectItem value="bus-per-passenger">Bus (per passenger) (0.105 kg/km)</SelectItem>
                                <SelectItem value="train-per-passenger">Train (per passenger) (0.041 kg/km)</SelectItem>
                                <SelectItem value="electric">Electric Vehicle (0.053 kg/km)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 pt-2">
                          <input
                            type="checkbox"
                            id="wtw"
                            checked={transportData.includeWTW}
                            onChange={(e) => setTransportData({ ...transportData, includeWTW: e.target.checked })}
                            className="rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]"
                          />
                          <Label htmlFor="wtw" className="text-sm font-medium text-[#1E293B] flex items-center gap-2">
                            Include Well-to-Wheel (WTW) emissions
                            <Tooltip>
                              <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                              <TooltipContent>Add upstream fuel production emissions</TooltipContent>
                            </Tooltip>
                          </Label>
                        </div>

                        {/* Emission breakdown display */}
                        {detailedTransport.total > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 rounded-xl bg-gradient-to-br from-[#2563EB]/5 to-transparent border border-[#2563EB]/20"
                          >
                            <h4 className="text-sm font-semibold text-[#1E293B] mb-2">Emission Breakdown</h4>
                            <div className="space-y-1 text-xs text-[#475569]">
                              <div className="flex justify-between">
                                <span>CO₂ (Tank-to-Wheel):</span>
                                <span className="font-mono">{detailedTransport.co2.toFixed(2)} kg</span>
                              </div>
                              <div className="flex justify-between">
                                <span>CH₄ (as CO₂e, GWP={GWP_CH4}):</span>
                                <span className="font-mono">{detailedTransport.ch4.toFixed(2)} kg</span>
                              </div>
                              <div className="flex justify-between">
                                <span>N₂O (as CO₂e, GWP={GWP_N2O}):</span>
                                <span className="font-mono">{detailedTransport.n2o.toFixed(2)} kg</span>
                              </div>
                              {transportData.includeWTW && (
                                <div className="flex justify-between text-[#F97316]">
                                  <span>Well-to-Tank (WTT):</span>
                                  <span className="font-mono">{detailedTransport.wtt.toFixed(2)} kg</span>
                                </div>
                              )}
                              <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-semibold text-[#1E293B]">
                                <span>Total CO₂e {transportData.includeWTW ? '(WTW)' : '(TTW)'}:</span>
                                <span className="font-mono">{detailedTransport.total.toFixed(2)} kg</span>
                              </div>
                            </div>
                            <Button 
                              onClick={saveTransportCalculation}
                              className="w-full mt-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8]"
                              size="sm"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save to History
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    </TabsContent>

                    {/* Energy Form */}
                    <TabsContent value="energy" className="space-y-4 mt-0">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        {/* Electricity Section (Scope 2) */}
                        <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-[#10B981]/5 to-transparent border border-[#10B981]/20">
                          <h4 className="text-sm font-semibold text-[#1E293B] flex items-center gap-2">
                            <Zap className="h-4 w-4 text-[#10B981]" />
                            Electricity (Scope 2)
                          </h4>

                          <div>
                            <Label className="text-sm font-medium text-[#1E293B] mb-2 flex items-center gap-2">
                              Electricity Consumption (kWh)
                              <Tooltip>
                                <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                                <TooltipContent>Total electricity consumed</TooltipContent>
                              </Tooltip>
                            </Label>
                            <Input 
                              type="number" 
                              value={energyData.electricity || ''}
                              onChange={(e) => setEnergyData({ ...energyData, electricity: Number(e.target.value) })}
                              placeholder="e.g., 5000"
                              className="rounded-xl border-[#E5E7EB] focus:border-[#10B981] focus:ring-[#10B981] transition-all"
                            />
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-[#1E293B] mb-2">Calculation Method</Label>
                            <Select 
                              value={energyData.electricityMethod} 
                              onValueChange={(v: 'location' | 'market') => setEnergyData({ ...energyData, electricityMethod: v })}
                            >
                              <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="location">Location-Based (Regional Grid)</SelectItem>
                                <SelectItem value="market">Market-Based (Supplier/RECs)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {energyData.electricityMethod === 'location' ? (
                            <div>
                              <Label className="text-sm font-medium text-[#1E293B] mb-2">Grid Type</Label>
                              <Select value={energyData.gridType} onValueChange={(v) => setEnergyData({ ...energyData, gridType: v })}>
                                <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="grid-mixed">Global Average (0.25 kgCO₂e/kWh)</SelectItem>
                                  <SelectItem value="grid-uk">UK Grid (0.193 kgCO₂e/kWh)</SelectItem>
                                  <SelectItem value="grid-us">US Grid (0.386 kgCO₂e/kWh)</SelectItem>
                                  <SelectItem value="grid-eu">EU Grid (0.295 kgCO₂e/kWh)</SelectItem>
                                  <SelectItem value="grid-china">China Grid (0.555 kgCO₂e/kWh)</SelectItem>
                                  <SelectItem value="grid-india">India Grid (0.708 kgCO₂e/kWh)</SelectItem>
                                  <SelectItem value="coal-heavy">Coal-Heavy Grid (0.82 kgCO₂e/kWh)</SelectItem>
                                  <SelectItem value="gas-heavy">Gas-Heavy Grid (0.49 kgCO₂e/kWh)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="renewable-certs"
                                  checked={energyData.hasRenewableCerts}
                                  onChange={(e) => setEnergyData({ ...energyData, hasRenewableCerts: e.target.checked })}
                                  className="rounded border-[#E5E7EB] text-[#10B981] focus:ring-[#10B981]"
                                />
                                <Label htmlFor="renewable-certs" className="text-sm font-medium text-[#1E293B] flex items-center gap-2">
                                  Have Renewable Certificates (RECs/REGOs/GoOs)
                                  <Tooltip>
                                    <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                                    <TooltipContent>Zero emissions with valid certificates</TooltipContent>
                                  </Tooltip>
                                </Label>
                              </div>

                              {!energyData.hasRenewableCerts && (
                                <div>
                                  <Label className="text-sm font-medium text-[#1E293B] mb-2 flex items-center gap-2">
                                    Supplier Emission Factor (kgCO₂e/kWh)
                                    <Tooltip>
                                      <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                                      <TooltipContent>Optional: Your supplier's specific emission factor</TooltipContent>
                                    </Tooltip>
                                  </Label>
                                  <Input 
                                    type="number" 
                                    step="0.001"
                                    value={energyData.supplierEF || ''}
                                    onChange={(e) => setEnergyData({ ...energyData, supplierEF: e.target.value ? Number(e.target.value) : undefined })}
                                    placeholder="e.g., 0.15"
                                    className="rounded-xl border-[#E5E7EB] focus:border-[#10B981] focus:ring-[#10B981] transition-all"
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Stationary Fuel Section (Scope 1) */}
                        <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-[#F97316]/5 to-transparent border border-[#F97316]/20">
                          <h4 className="text-sm font-semibold text-[#1E293B] flex items-center gap-2">
                            <Factory className="h-4 w-4 text-[#F97316]" />
                            Stationary Fuel Combustion (Scope 1)
                          </h4>

                          <div>
                            <Label className="text-sm font-medium text-[#1E293B] mb-2">Fuel Type</Label>
                            <Select value={energyData.fuelType} onValueChange={(v) => setEnergyData({ ...energyData, fuelType: v })}>
                              <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="diesel">Diesel (2.68 kgCO₂/L)</SelectItem>
                                <SelectItem value="lpg">LPG (1.51 kgCO₂/L)</SelectItem>
                                <SelectItem value="natural-gas">Natural Gas (0.202 kgCO₂/kWh)</SelectItem>
                                <SelectItem value="fuel-oil">Fuel Oil (3.18 kgCO₂/L)</SelectItem>
                                <SelectItem value="coal">Coal (94.6 kgCO₂/GJ)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-1">
                              <Label className="text-sm font-medium text-[#1E293B] mb-2">Fuel Amount</Label>
                              <Input 
                                type="number" 
                                value={energyData.fuelAmount || ''}
                                onChange={(e) => setEnergyData({ ...energyData, fuelAmount: Number(e.target.value) })}
                                placeholder="e.g., 1000"
                                className="rounded-xl border-[#E5E7EB] focus:border-[#F97316] focus:ring-[#F97316] transition-all"
                              />
                            </div>
                            <div className="col-span-1">
                              <Label className="text-sm font-medium text-[#1E293B] mb-2">Unit</Label>
                              <Select value={energyData.fuelUnit} onValueChange={(v: 'L' | 'kWh' | 'GJ') => setEnergyData({ ...energyData, fuelUnit: v })}>
                                <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="L">Liters (L)</SelectItem>
                                  <SelectItem value="kWh">Kilowatt-hours (kWh)</SelectItem>
                                  <SelectItem value="GJ">Gigajoules (GJ)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Energy Emission Breakdown */}
                        {detailedEnergy.total > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-gradient-to-br from-[#10B981]/5 to-transparent border border-[#10B981]/20"
                          >
                            <h4 className="text-sm font-semibold text-[#1E293B] mb-2">Energy Emission Breakdown</h4>
                            <div className="space-y-1 text-xs text-[#475569]">
                              <div className="flex justify-between">
                                <span>Scope 2 (Electricity - {detailedEnergy.method === 'location' ? 'Location-Based' : 'Market-Based'}):</span>
                                <span className="font-mono">{detailedEnergy.scope2.toFixed(2)} kg CO₂e</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Scope 1 (Stationary Fuel):</span>
                                <span className="font-mono">{detailedEnergy.scope1.toFixed(2)} kg CO₂</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-semibold text-[#1E293B]">
                                <span>Total Energy Emissions:</span>
                                <span className="font-mono">{detailedEnergy.total.toFixed(2)} kg CO₂e</span>
                              </div>
                            </div>
                            <Button 
                              onClick={saveEnergyCalculation}
                              className="w-full mt-3 rounded-xl bg-[#10B981] hover:bg-[#059669]"
                              size="sm"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save to History
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    </TabsContent>

                    {/* Waste Form */}
                    <TabsContent value="waste" className="space-y-4 mt-0">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-[#1E293B] mb-2 flex items-center gap-2">
                            Waste Amount (kg/month)
                            <Tooltip>
                              <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                              <TooltipContent>Monthly household waste</TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input 
                            type="number" 
                            value={wasteData.amount || ''}
                            onChange={(e) => setWasteData({ ...wasteData, amount: Number(e.target.value) })}
                            placeholder="e.g., 100"
                            className="rounded-xl border-[#E5E7EB] focus:border-[#F97316] focus:ring-[#F97316] transition-all"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#1E293B] mb-2">Waste Type</Label>
                          <Select value={wasteData.type} onValueChange={(v) => setWasteData({ ...wasteData, type: v })}>
                            <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mixed">Mixed Waste</SelectItem>
                              <SelectItem value="organic">Organic</SelectItem>
                              <SelectItem value="plastic">Plastic</SelectItem>
                              <SelectItem value="paper">Paper</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#1E293B] mb-2">Disposal Method</Label>
                          <Select value={wasteData.disposal} onValueChange={(v) => setWasteData({ ...wasteData, disposal: v })}>
                            <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="landfill">Landfill</SelectItem>
                              <SelectItem value="recycling">Recycling</SelectItem>
                              <SelectItem value="composting">Composting</SelectItem>
                              <SelectItem value="incineration">Incineration</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Waste Emission Display */}
                        {emissionsBreakdown.waste > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-gradient-to-br from-[#F97316]/5 to-transparent border border-[#F97316]/20"
                          >
                            <h4 className="text-sm font-semibold text-[#1E293B] mb-2">Waste Emission Summary</h4>
                            <div className="space-y-1 text-xs text-[#475569]">
                              <div className="flex justify-between">
                                <span>Waste Type:</span>
                                <span className="font-mono capitalize">{wasteData.type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Disposal Method:</span>
                                <span className="font-mono capitalize">{wasteData.disposal}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-semibold text-[#1E293B]">
                                <span>Total Waste Emissions:</span>
                                <span className="font-mono">{emissionsBreakdown.waste.toFixed(2)} kg CO₂e</span>
                              </div>
                            </div>
                            <Button 
                              onClick={saveWasteCalculation}
                              className="w-full mt-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C]"
                              size="sm"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save to History
                            </Button>
                          </motion.div>
                        )}
                      </motion.div>
                    </TabsContent>

                    {/* Flight Form */}
                    <TabsContent value="flight" className="space-y-4 mt-0">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        {/* Flight Calculator Header */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#8B5CF6]/5 border border-[#8B5CF6]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <Plane className="h-5 w-5 text-[#8B5CF6]" />
                            <h4 className="text-sm font-semibold text-[#1E293B]">Flight Emissions Calculator</h4>
                          </div>
                          <p className="text-xs text-[#475569]">
                            Calculate carbon emissions using real airport coordinates and ICAO/DEFRA emission factors.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-[#1E293B] mb-2 flex items-center gap-2">
                              Departure Airport
                              <Tooltip>
                                <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                                <TooltipContent>Search by city name or IATA code</TooltipContent>
                              </Tooltip>
                            </Label>
                            <AirportSearch
                              value={flightData.departureIata}
                              onChange={(iata) => setFlightData({ ...flightData, departureIata: iata })}
                              placeholder="Search departure city..."
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-[#1E293B] mb-2 flex items-center gap-2">
                              Arrival Airport
                              <Tooltip>
                                <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                                <TooltipContent>Search by city name or IATA code</TooltipContent>
                              </Tooltip>
                            </Label>
                            <AirportSearch
                              value={flightData.arrivalIata}
                              onChange={(iata) => setFlightData({ ...flightData, arrivalIata: iata })}
                              placeholder="Search arrival city..."
                            />
                          </div>
                        </div>

                        {/* Flight Route Map */}
                        <FlightRouteMap
                          departure={flightResult ? {
                            iata: flightResult.route.departure.iata,
                            name: flightResult.route.departure.name,
                            lat: flightResult.route.departure.coordinates.latitude,
                            lon: flightResult.route.departure.coordinates.longitude,
                          } : undefined}
                          arrival={flightResult ? {
                            iata: flightResult.route.arrival.iata,
                            name: flightResult.route.arrival.name,
                            lat: flightResult.route.arrival.coordinates.latitude,
                            lon: flightResult.route.arrival.coordinates.longitude,
                          } : undefined}
                          distanceKm={flightResult?.distance.km}
                        />

                        <div>
                          <Label className="text-sm font-medium text-[#1E293B] mb-2">Number of Passengers</Label>
                          <Input 
                            type="number" 
                            min={1}
                            value={flightData.passengers || ''}
                            onChange={(e) => setFlightData({ ...flightData, passengers: Math.max(1, Number(e.target.value)) })}
                            placeholder="1"
                            className="rounded-xl border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6] transition-all"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <input
                            type="checkbox"
                            id="include-rf"
                            checked={flightData.includeRF}
                            onChange={(e) => setFlightData({ ...flightData, includeRF: e.target.checked })}
                            className="rounded border-[#E5E7EB] text-[#8B5CF6] focus:ring-[#8B5CF6]"
                          />
                          <Label htmlFor="include-rf" className="text-sm font-medium text-[#1E293B] flex items-center gap-2">
                            Include non-CO₂ effects (RF multiplier: 1.9x)
                            <Tooltip>
                              <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                              <TooltipContent>Includes contrails, NOx, and water vapor effects</TooltipContent>
                            </Tooltip>
                          </Label>
                        </div>

                        <Button 
                          onClick={calculateFlightEmissions}
                          disabled={flightLoading}
                          className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl py-3"
                        >
                          {flightLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Calculating...
                            </>
                          ) : (
                            <>
                              <Calculator className="h-4 w-4 mr-2" />
                              Calculate Flight Emissions
                            </>
                          )}
                        </Button>

                        {/* Flight Result Display */}
                        {flightResult && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 space-y-4"
                          >
                            {/* Route Info */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-[#8B5CF6]/5 to-transparent border border-[#8B5CF6]/20">
                              <h4 className="text-sm font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#8B5CF6]" />
                                Route Details
                              </h4>
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-center">
                                  <div className="text-lg font-bold text-[#8B5CF6]">{flightResult.route.departure.iata}</div>
                                  <div className="text-xs text-[#475569] max-w-[120px] truncate">{flightResult.route.departure.name}</div>
                                </div>
                                <div className="flex-1 flex items-center justify-center px-4">
                                  <div className="h-px flex-1 bg-[#8B5CF6]/30"></div>
                                  <Plane className="h-5 w-5 text-[#8B5CF6] mx-2 transform rotate-90" />
                                  <div className="h-px flex-1 bg-[#8B5CF6]/30"></div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-bold text-[#8B5CF6]">{flightResult.route.arrival.iata}</div>
                                  <div className="text-xs text-[#475569] max-w-[120px] truncate">{flightResult.route.arrival.name}</div>
                                </div>
                              </div>
                              <div className="text-center mt-3">
                                <span className="text-sm text-[#475569]">Distance: </span>
                                <span className="text-sm font-semibold text-[#1E293B]">{flightResult.distance.km.toLocaleString()} km</span>
                                <span className="text-xs text-[#475569] ml-2">({flightResult.distance.miles.toLocaleString()} miles)</span>
                              </div>
                            </div>

                            {/* Emissions Breakdown */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-[#10B981]/5 to-transparent border border-[#10B981]/20">
                              <h4 className="text-sm font-semibold text-[#1E293B] mb-2">Emissions Breakdown</h4>
                              <div className="space-y-1 text-xs text-[#475569]">
                                <div className="flex justify-between">
                                  <span>Flight Category:</span>
                                  <span className="font-medium text-[#1E293B]">{flightResult.emissions.category}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Emission Factor:</span>
                                  <span className="font-mono">{flightResult.emissions.emissionFactor} kg CO₂/km</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>CO₂ per Passenger:</span>
                                  <span className="font-mono">{flightResult.emissions.co2PerPassenger.toFixed(2)} kg</span>
                                </div>
                                {flightData.includeRF && flightResult.emissions.co2ePerPassenger && (
                                  <div className="flex justify-between text-[#8B5CF6]">
                                    <span>CO₂e per Passenger (with RF):</span>
                                    <span className="font-mono">{flightResult.emissions.co2ePerPassenger.toFixed(2)} kg</span>
                                  </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-semibold text-[#1E293B]">
                                  <span>Total {flightData.includeRF ? 'CO₂e' : 'CO₂'} ({flightResult.emissions.passengers} passenger{flightResult.emissions.passengers > 1 ? 's' : ''}):</span>
                                  <span className="font-mono text-[#8B5CF6]">
                                    {(flightData.includeRF ? flightResult.emissions.totalCo2e : flightResult.emissions.totalCo2)?.toFixed(2)} kg
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Methodology */}
                            <div className="p-3 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB]">
                              <h5 className="text-xs font-semibold text-[#475569] mb-1">Methodology</h5>
                              <p className="text-xs text-[#64748B]">
                                {flightResult.methodology.distanceCalculation} • {flightResult.methodology.emissionFactors}
                              </p>
                              <p className="text-xs text-[#64748B] mt-1 italic">
                                {flightResult.methodology.rfExplanation}
                              </p>
                            </div>

                            {/* Inspirational Message */}
                            <div className="p-3 rounded-lg bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/5 border border-[#10B981]/20 text-center">
                              <p className="text-xs text-[#475569] italic">
                                "Flying connects worlds — but it also leaves a footprint. By understanding our impact, we take the first small step toward flying smarter, lighter, and greener."
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trend Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-transparent" />
                  <div className="relative">
                    <h3 className="text-sm font-semibold text-[#1E293B] mb-4">Emission Trend</h3>
                    {trendData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#475569" }} />
                          <YAxis tick={{ fontSize: 11, fill: "#475569" }} />
                          <Line type="monotone" dataKey="emissions" stroke="#2563EB" strokeWidth={2} dot={{ fill: "#2563EB", r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[180px] flex items-center justify-center text-sm text-[#475569]">
                        Start entering data to see trends
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Breakdown Pie Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent" />
                  <div className="relative">
                    <h3 className="text-sm font-semibold text-[#1E293B] mb-4">Emissions Breakdown</h3>
                    {totalEmissions > 0 ? (
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                            {pieData.map((entry, index) => (
                              <Cell key={index} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend wrapperStyle={{ fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[180px] flex items-center justify-center text-sm text-[#475569]">
                        No data to display
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right Column - Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 h-fit"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 via-transparent to-[#F97316]/5" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-[#F97316]" />
                  <h3 className="text-lg font-bold text-[#1E293B]">Sustainability Insights</h3>
                </div>
                
                <div className="space-y-3">
                  {getInsights().map((insight, idx) => {
                    const InsightIcon = insight.icon;
                    const colors = {
                      warning: 'bg-orange-50 border-orange-200 text-orange-700',
                      tip: 'bg-blue-50 border-blue-200 text-blue-700',
                      info: 'bg-purple-50 border-purple-200 text-purple-700',
                      success: 'bg-green-50 border-green-200 text-green-700'
                    };
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-4 rounded-xl border backdrop-blur-sm ${colors[insight.type as keyof typeof colors]}`}
                      >
                        <div className="flex items-start gap-3">
                          <InsightIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <p className="text-sm leading-relaxed">{insight.text}</p>
                        </div>
                      </motion.div>
                    );
                  })}

                  {getInsights().length === 0 && (
                    <div className="text-center py-8 text-sm text-[#475569]">
                      <Leaf className="h-8 w-8 mx-auto mb-2 text-[#10B981]" />
                      Enter your data to receive personalized sustainability insights
                    </div>
                  )}
                </div>

                {/* Offset Info */}
                {totalEmissions > 10 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/5 border border-[#10B981]/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="h-4 w-4 text-[#10B981]" />
                      <span className="text-sm font-semibold text-[#1E293B]">Carbon Offset</span>
                    </div>
                    <p className="text-xs text-[#475569] mb-2">
                      Plant <span className="font-bold text-[#10B981]">{Math.ceil(totalEmissions / 22)} trees</span> to offset your emissions
                    </p>
                    <p className="text-xs text-[#475569]">
                      Estimated cost: <span className="font-bold">${(totalEmissions * 0.02).toFixed(2)}</span>
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};
