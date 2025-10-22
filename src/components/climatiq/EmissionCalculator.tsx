import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, Zap, Truck, Plane, Cloud, TreePine, Droplets, Factory, Home, Recycle, Wheat, Hammer, MapPin, Info, Loader2, TrendingDown, Leaf, Car, TreeDeciduous } from "lucide-react";
import { toast } from "sonner";
import { ExportResults } from "./ExportResults";
import { ComparisonView } from "./ComparisonView";
import { CalculationHistory } from "./CalculationHistory";
import { useRegionDetection } from "@/hooks/useRegionDetection";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const EmissionCalculator = () => {
  const [activeCalculator, setActiveCalculator] = useState("electricity");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [comparisons, setComparisons] = useState<any[]>([]);
  const { region } = useRegionDetection();

  const calculators = {
    electricity: {
      name: "Electricity",
      icon: Zap,
      color: "bg-[#2563EB]",
      fields: [
        { name: "amount", label: "Amount (kWh)", type: "number", placeholder: "1000", min: 0, max: 10000, step: 100, showSlider: true, tooltip: "Enter your electricity consumption in kilowatt-hours" },
        { name: "region", label: "Region", type: "select", options: ["US", "EU", "UK", "AU", "Global"], showSlider: false, tooltip: "Select your geographic region" },
        { name: "energy_source", label: "Energy Source", type: "select", options: ["grid", "solar", "wind", "natural_gas", "coal"], tooltip: "Choose your primary energy source" }
      ]
    },
    transport: {
      name: "Transportation",
      icon: Truck,
      color: "bg-[#10B981]",
      fields: [
        { name: "mode", label: "Transport Mode", type: "select", options: ["car", "truck", "bus", "train", "motorcycle", "bicycle"], tooltip: "Select your mode of transport" },
        { name: "distance", label: "Distance (km)", type: "number", placeholder: "100", min: 0, max: 5000, step: 10, showSlider: true, tooltip: "Enter the distance traveled" },
        { name: "fuel_type", label: "Fuel Type", type: "select", options: ["gasoline", "diesel", "electric", "hybrid", "hydrogen"], tooltip: "Choose your fuel type" },
        { name: "passengers", label: "Passengers", type: "number", placeholder: "1", min: 1, max: 10, step: 1, showSlider: true, tooltip: "Number of passengers sharing the journey" }
      ]
    },
    flight: {
      name: "Flight",
      icon: Plane,
      color: "bg-[#F97316]",
      fields: [
        { name: "origin", label: "Origin Airport", type: "text", placeholder: "LAX", tooltip: "Enter departure airport code" },
        { name: "destination", label: "Destination Airport", type: "text", placeholder: "JFK", tooltip: "Enter arrival airport code" },
        { name: "passengers", label: "Passengers", type: "number", placeholder: "1", tooltip: "Number of passengers" },
        { name: "cabin_class", label: "Cabin Class", type: "select", options: ["economy", "business", "first"], tooltip: "Select your travel class" },
        { name: "trip_type", label: "Trip Type", type: "select", options: ["one_way", "round_trip"], tooltip: "Choose trip type" }
      ]
    },
    cloud: {
      name: "Cloud Computing",
      icon: Cloud,
      color: "bg-[#6366F1]",
      fields: [
        { name: "provider", label: "Provider", type: "select", options: ["AWS", "Azure", "GCP", "Other"], tooltip: "Select cloud provider" },
        { name: "service", label: "Service Type", type: "select", options: ["compute", "storage", "network", "database"], tooltip: "Choose service type" },
        { name: "usage_hours", label: "Usage Hours", type: "number", placeholder: "720", tooltip: "Monthly usage in hours" },
        { name: "region", label: "Cloud Region", type: "select", options: ["us-east", "us-west", "eu-west", "asia-pacific"], tooltip: "Select data center region" }
      ]
    },
    agriculture: {
      name: "Agriculture",
      icon: Wheat,
      color: "bg-[#84CC16]",
      fields: [
        { name: "crop_type", label: "Crop Type", type: "select", options: ["wheat", "corn", "rice", "soybeans", "cotton"], tooltip: "Select crop type" },
        { name: "area", label: "Area (hectares)", type: "number", placeholder: "100", tooltip: "Farm area in hectares" },
        { name: "fertilizer_amount", label: "Fertilizer (kg)", type: "number", placeholder: "500", tooltip: "Fertilizer amount in kilograms" },
        { name: "irrigation", label: "Irrigation Type", type: "select", options: ["none", "drip", "sprinkler", "flood"], tooltip: "Select irrigation method" }
      ]
    },
    livestock: {
      name: "Livestock",
      icon: TreePine,
      color: "bg-[#EF4444]",
      fields: [
        { name: "animal_type", label: "Animal Type", type: "select", options: ["cattle", "sheep", "pigs", "chickens", "goats"], tooltip: "Select animal type" },
        { name: "count", label: "Number of Animals", type: "number", placeholder: "100", tooltip: "Total animal count" },
        { name: "feed_type", label: "Feed Type", type: "select", options: ["grass", "grain", "mixed", "organic"], tooltip: "Select feed type" },
        { name: "housing", label: "Housing Type", type: "select", options: ["pasture", "barn", "feedlot", "free_range"], tooltip: "Select housing type" }
      ]
    },
    waste: {
      name: "Waste",
      icon: Recycle,
      color: "bg-[#64748B]",
      fields: [
        { name: "waste_type", label: "Waste Type", type: "select", options: ["organic", "paper", "plastic", "glass", "metal"], tooltip: "Select waste material" },
        { name: "amount", label: "Amount (kg)", type: "number", placeholder: "1000", tooltip: "Waste amount in kilograms" },
        { name: "treatment", label: "Treatment Method", type: "select", options: ["landfill", "incineration", "recycling", "composting"], tooltip: "Select disposal method" }
      ]
    },
    water: {
      name: "Water",
      icon: Droplets,
      color: "bg-[#06B6D4]",
      fields: [
        { name: "volume", label: "Volume (liters)", type: "number", placeholder: "10000", tooltip: "Water volume in liters" },
        { name: "source", label: "Water Source", type: "select", options: ["municipal", "well", "surface", "desalinated"], tooltip: "Select water source" },
        { name: "treatment", label: "Treatment Level", type: "select", options: ["none", "basic", "advanced", "reverse_osmosis"], tooltip: "Select treatment level" }
      ]
    },
    construction: {
      name: "Construction",
      icon: Hammer,
      color: "bg-[#F59E0B]",
      fields: [
        { name: "material", label: "Material Type", type: "select", options: ["concrete", "steel", "wood", "aluminum", "brick"], tooltip: "Select construction material" },
        { name: "quantity", label: "Quantity (tons)", type: "number", placeholder: "10", tooltip: "Material quantity in tons" },
        { name: "transport_distance", label: "Transport Distance (km)", type: "number", placeholder: "50", tooltip: "Distance from supplier" }
      ]
    },
    manufacturing: {
      name: "Manufacturing",
      icon: Factory,
      color: "bg-[#475569]",
      fields: [
        { name: "product_type", label: "Product Type", type: "select", options: ["electronics", "textiles", "automotive", "food", "chemicals"], tooltip: "Select product category" },
        { name: "units", label: "Units Produced", type: "number", placeholder: "1000", tooltip: "Number of units" },
        { name: "energy_intensity", label: "Energy Intensity", type: "select", options: ["low", "medium", "high", "very_high"], tooltip: "Energy usage level" }
      ]
    },
    residential: {
      name: "Residential",
      icon: Home,
      color: "bg-[#EC4899]",
      fields: [
        { name: "home_size", label: "Home Size (sq ft)", type: "number", placeholder: "2000", tooltip: "Total home area" },
        { name: "heating_type", label: "Heating Type", type: "select", options: ["natural_gas", "electric", "oil", "solar", "heat_pump"], tooltip: "Select heating system" },
        { name: "occupants", label: "Occupants", type: "number", placeholder: "4", tooltip: "Number of residents" }
      ]
    }
  };

  const handleCalculate = async () => {
    setLoading(true);
    
    setTimeout(() => {
      const baseEmission = Math.random() * 500 + 50;
      const mockResults = {
        co2e_kg: baseEmission,
        methodology: "AR6",
        confidence: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
        scope: {
          scope1: baseEmission * 0.4,
          scope2: baseEmission * 0.35,
          scope3: baseEmission * 0.25
        },
        breakdown: {
          direct: Math.random() * 200 + 20,
          indirect: Math.random() * 300 + 30
        },
        offsetSuggestion: {
          trees: Math.ceil(baseEmission / 22),
          cost_usd: (baseEmission * 0.02).toFixed(2)
        },
        comparison: {
          car_km: (baseEmission / 0.12).toFixed(0),
          home_days: (baseEmission / 16.4).toFixed(1)
        }
      };
      
      setResults(mockResults);
      
      const calculationRecord = {
        id: Date.now().toString(),
        calculationType: currentCalculator.name,
        results: mockResults,
        formData: { ...formData },
        timestamp: new Date()
      };
      
      if ((window as any).saveCalculationToHistory) {
        (window as any).saveCalculationToHistory(calculationRecord);
      }
      
      setLoading(false);
      toast.success("Calculation completed!");
    }, 1500);
  };

  const handleAddToComparison = (item: any) => {
    const newComparison = {
      id: Date.now().toString(),
      calculationType: activeCalculator,
      results,
      formData: { ...formData },
      timestamp: new Date()
    };
    setComparisons([...comparisons, newComparison]);
    toast.success("Added to comparison");
  };

  const handleLoadCalculation = (record: any) => {
    setActiveCalculator(record.calculationType.toLowerCase().replace(/\s+/g, ''));
    setFormData(record.formData);
    setResults(record.results);
    toast.success("Calculation loaded");
  };

  useEffect(() => {
    if (region && !formData.region) {
      setFormData(prev => ({ ...prev, region: region.region }));
    }
  }, [region, formData.region]);

  const currentCalculator = calculators[activeCalculator as keyof typeof calculators];
  const Icon = currentCalculator.icon;
  
  const filledFields = currentCalculator.fields.filter(field => formData[field.name]).length;
  const totalFields = currentCalculator.fields.length;
  const progressPercentage = (filledFields / totalFields) * 100;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B]">
              Advanced Emission Calculator
            </h1>
            {region && (
              <div className="hidden md:flex items-center gap-2 text-sm text-[#475569] bg-white rounded-full px-4 py-2 shadow-sm">
                <MapPin className="h-4 w-4 text-[#2563EB]" />
                {region.country} ({region.region})
              </div>
            )}
          </div>
          <p className="text-[#475569]">Calculate CO₂ emissions across multiple industries with precision</p>
        </motion.div>

        {/* Three-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[1440px] mx-auto">
          {/* Left Sidebar - Category Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] p-4 sticky top-4">
              <h2 className="text-sm font-semibold text-[#1E293B] mb-4 px-2">Categories</h2>
              <div className="space-y-2">
                {Object.entries(calculators).map(([key, calc]) => {
                  const CalcIcon = calc.icon;
                  const isActive = activeCalculator === key;
                  return (
                    <motion.button
                      key={key}
                      onClick={() => {
                        setActiveCalculator(key);
                        setResults(null);
                        setFormData({});
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#2563EB]/10 to-[#10B981]/10 shadow-md ring-2 ring-[#2563EB]/20' 
                          : 'hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-2 rounded-xl ${calc.color} shadow-sm`}>
                        <CalcIcon className="h-4 w-4 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${isActive ? 'text-[#2563EB]' : 'text-[#475569]'}`}>
                        {calc.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Center Panel - Active Calculator */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCalculator}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                {/* Progress Bar */}
                <div className="h-1 bg-gray-100">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#10B981]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="p-6 md:p-8">
                  {/* Calculator Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-2xl ${currentCalculator.color} shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#1E293B]">{currentCalculator.name}</h2>
                      <p className="text-sm text-[#475569]">
                        {filledFields} of {totalFields} fields completed
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    {currentCalculator.fields.map((field) => (
                      <motion.div 
                        key={field.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center gap-2">
                          <Label htmlFor={field.name} className="text-sm font-medium text-[#1E293B]">
                            {field.label}
                          </Label>
                          {field.tooltip && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-[#475569] cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">{field.tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        
                        {field.type === "select" ? (
                          <Select
                            value={formData[field.name] || ""}
                            onValueChange={(value) => setFormData({ ...formData, [field.name]: value })}
                          >
                            <SelectTrigger className="border-gray-200 focus:ring-[#2563EB] focus:border-[#2563EB] rounded-xl h-12 transition-all">
                              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.showSlider ? (
                          <div className="space-y-3">
                            <Input
                              id={field.name}
                              type="number"
                              placeholder={field.placeholder}
                              value={formData[field.name] || ""}
                              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                              className="border-gray-200 focus:ring-[#2563EB] focus:border-[#2563EB] rounded-xl h-12 transition-all"
                              min={field.min}
                              max={field.max}
                              step={field.step}
                            />
                            <Slider
                              value={[Number(formData[field.name]) || field.min || 0]}
                              onValueChange={([value]) => setFormData({ ...formData, [field.name]: value.toString() })}
                              min={field.min}
                              max={field.max}
                              step={field.step}
                              className="py-2"
                            />
                          </div>
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ""}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                            className="border-gray-200 focus:ring-[#2563EB] focus:border-[#2563EB] rounded-xl h-12 transition-all"
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-8"
                  >
                    <Button
                      onClick={handleCalculate}
                      disabled={loading || filledFields === 0}
                      className="w-full h-14 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Calculator className="mr-2 h-5 w-5" />
                          Calculate CO₂ Emissions
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Panel - Results & History */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="space-y-6 sticky top-4">
              {/* Results Summary */}
              <AnimatePresence mode="wait">
                {results ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] p-6 space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#1E293B]">Results</h3>
                      <Badge className="bg-[#10B981]/10 text-[#10B981] border-0">
                        {results.confidence}
                      </Badge>
                    </div>

                    {/* Total Emissions */}
                    <div className="text-center py-6 bg-gradient-to-br from-[#2563EB]/5 to-[#10B981]/5 rounded-xl">
                      <div className="text-4xl font-bold text-[#1E293B] mb-1">
                        {results.co2e_kg.toFixed(2)}
                      </div>
                      <div className="text-sm text-[#475569]">kg CO₂e</div>
                    </div>

                    {/* Scope Breakdown */}
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-[#1E293B]">Emission Breakdown</div>
                      {Object.entries(results.scope).map(([scope, value]: [string, any]) => (
                        <div key={scope} className="space-y-1">
                          <div className="flex justify-between text-xs text-[#475569]">
                            <span className="capitalize">{scope}</span>
                            <span>{value.toFixed(1)} kg</span>
                          </div>
                          <Progress 
                            value={(value / results.co2e_kg) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Offset Suggestions */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="text-sm font-medium text-[#1E293B]">Offset Suggestions</div>
                      <div className="flex items-center gap-3 p-3 bg-[#10B981]/5 rounded-xl">
                        <TreeDeciduous className="h-5 w-5 text-[#10B981]" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#1E293B]">
                            {results.offsetSuggestion.trees} trees
                          </div>
                          <div className="text-xs text-[#475569]">Annual planting needed</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-[#F97316]/5 rounded-xl">
                        <TrendingDown className="h-5 w-5 text-[#F97316]" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#1E293B]">
                            ${results.offsetSuggestion.cost_usd}
                          </div>
                          <div className="text-xs text-[#475569]">Carbon offset cost</div>
                        </div>
                      </div>
                    </div>

                    {/* Comparisons */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="text-sm font-medium text-[#1E293B]">Real-world Impact</div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Car className="h-5 w-5 text-[#475569]" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#1E293B]">
                            {results.comparison.car_km} km
                          </div>
                          <div className="text-xs text-[#475569]">Average car travel</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Home className="h-5 w-5 text-[#475569]" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[#1E293B]">
                            {results.comparison.home_days} days
                          </div>
                          <div className="text-xs text-[#475569]">Home energy usage</div>
                        </div>
                      </div>
                    </div>

                    {/* Export Button */}
                    <ExportResults results={results} calculationType={currentCalculator.name} formData={formData} />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calculator className="h-8 w-8 text-[#475569]" />
                    </div>
                    <p className="text-sm text-[#475569]">
                      Complete the form and calculate to see your emission results
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Calculation History */}
              <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">
                <CalculationHistory onLoadCalculation={handleLoadCalculation} onAddToComparison={handleAddToComparison} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Comparison View */}
        {comparisons.length > 0 && (
          <div className="mt-8 max-w-[1440px] mx-auto">
            <ComparisonView 
              comparisons={comparisons} 
              onAddToComparison={handleAddToComparison}
              onRemoveFromComparison={(id) => setComparisons(comparisons.filter(c => c.id !== id))} 
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
