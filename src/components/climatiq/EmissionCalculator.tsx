import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Zap, Truck, Car, Plane, Factory, Recycle, TrendingDown, TrendingUp, Leaf, Info, Lightbulb, Target, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRegionDetection } from "@/hooks/useRegionDetection";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

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

interface TransportData {
  distance: number;
  fuelType: string;
  vehicle: string;
  calculationMethod: 'fuel' | 'distance';
  fuelUsed?: number;
  fuelEconomy?: number;
  includeWTW: boolean;
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
  const [energyData, setEnergyData] = useState({ electricity: 0, gas: 0, source: "grid" });
  const [wasteData, setWasteData] = useState({ amount: 0, type: "mixed", disposal: "landfill" });
  const [totalEmissions, setTotalEmissions] = useState(0);
  const [emissionsBreakdown, setEmissionsBreakdown] = useState({ transport: 0, energy: 0, waste: 0 });
  const [detailedTransport, setDetailedTransport] = useState({ total: 0, co2: 0, ch4: 0, n2o: 0, wtt: 0 });
  const [trendData, setTrendData] = useState<any[]>([]);
  const { region } = useRegionDetection();

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
      
      // Energy calculations
      const energyEmissions = (energyData.electricity * 0.5) + (energyData.gas * 2.5);
      
      // Waste calculations
      const wasteFactor = wasteData.disposal === "recycling" ? 0.1 : wasteData.disposal === "composting" ? 0.05 : 2.5;
      const wasteEmissions = wasteData.amount * wasteFactor;
      
      const total = transportEmissions + energyEmissions + wasteEmissions;
      setTotalEmissions(total);
      setEmissionsBreakdown({
        transport: transportEmissions,
        energy: energyEmissions,
        waste: wasteEmissions
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
  }, [transportData, energyData, wasteData]);

  const pieData = [
    { name: "Transport", value: emissionsBreakdown.transport, color: "#2563EB" },
    { name: "Energy", value: emissionsBreakdown.energy, color: "#10B981" },
    { name: "Waste", value: emissionsBreakdown.waste, color: "#F97316" }
  ].filter(d => d.value > 0);

  const getInsights = () => {
    const insights = [];
    if (emissionsBreakdown.transport > totalEmissions * 0.4) {
      insights.push({ icon: Car, text: "Consider carpooling or public transport to reduce emissions by up to 30%", type: "warning" });
    }
    if (energyData.source === "grid") {
      insights.push({ icon: Zap, text: "Switch to renewable energy sources to cut energy emissions by 50-70%", type: "tip" });
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
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
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
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#F9FAFB]/50 backdrop-blur-sm">
                      <TabsTrigger value="transport" className="data-[state=active]:bg-white data-[state=active]:text-[#2563EB]">
                        <Truck className="h-4 w-4 mr-2" />
                        Transport
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
                          </motion.div>
                        )}
                      </motion.div>
                    </TabsContent>

                    {/* Energy Form */}
                    <TabsContent value="energy" className="space-y-4 mt-0">
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-[#1E293B] mb-2 flex items-center gap-2">
                            Electricity (kWh/month)
                            <Tooltip>
                              <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                              <TooltipContent>Average monthly consumption</TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input 
                            type="number" 
                            value={energyData.electricity || ''}
                            onChange={(e) => setEnergyData({ ...energyData, electricity: Number(e.target.value) })}
                            placeholder="e.g., 500"
                            className="rounded-xl border-[#E5E7EB] focus:border-[#10B981] focus:ring-[#10B981] transition-all"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#1E293B] mb-2 flex items-center gap-2">
                            Natural Gas (m³/month)
                            <Tooltip>
                              <TooltipTrigger><Info className="h-3.5 w-3.5 text-[#475569]" /></TooltipTrigger>
                              <TooltipContent>Heating and cooking gas</TooltipContent>
                            </Tooltip>
                          </Label>
                          <Input 
                            type="number" 
                            value={energyData.gas || ''}
                            onChange={(e) => setEnergyData({ ...energyData, gas: Number(e.target.value) })}
                            placeholder="e.g., 50"
                            className="rounded-xl border-[#E5E7EB] focus:border-[#10B981] focus:ring-[#10B981] transition-all"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-[#1E293B] mb-2">Energy Source</Label>
                          <Select value={energyData.source} onValueChange={(v) => setEnergyData({ ...energyData, source: v })}>
                            <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="grid">Grid (Mixed)</SelectItem>
                              <SelectItem value="renewable">100% Renewable</SelectItem>
                              <SelectItem value="coal">Coal-based</SelectItem>
                              <SelectItem value="gas">Gas-based</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
