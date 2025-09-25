
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
import { Calculator, Zap, Truck, Plane, Cloud, TreePine, Droplets, Factory, Home, Recycle, Wheat, Hammer, MapPin, TrendingUp, BarChart3, Sparkles, Target, Award, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { DarkModeToggle } from "./DarkModeToggle";
import { ExportResults } from "./ExportResults";
import { ComparisonView } from "./ComparisonView";
import { CalculationHistory } from "./CalculationHistory";
import { useRegionDetection } from "@/hooks/useRegionDetection";

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
      color: "from-yellow-500 to-orange-500",
      fields: [
        { name: "amount", label: "Amount (kWh)", type: "number", placeholder: "1000", min: 0, max: 10000, step: 100, showSlider: true },
        { name: "region", label: "Region", type: "select", options: ["US", "EU", "UK", "AU", "Global"], showSlider: false },
        { name: "energy_source", label: "Energy Source", type: "select", options: ["grid", "solar", "wind", "natural_gas", "coal"] }
      ]
    },
    transport: {
      name: "Transportation",
      icon: Truck,
      color: "from-blue-500 to-green-500",
      fields: [
        { name: "mode", label: "Transport Mode", type: "select", options: ["car", "truck", "bus", "train", "motorcycle", "bicycle"] },
        { name: "distance", label: "Distance (km)", type: "number", placeholder: "100", min: 0, max: 5000, step: 10, showSlider: true },
        { name: "fuel_type", label: "Fuel Type", type: "select", options: ["gasoline", "diesel", "electric", "hybrid", "hydrogen"] },
        { name: "passengers", label: "Passengers", type: "number", placeholder: "1", min: 1, max: 10, step: 1, showSlider: true }
      ]
    },
    flight: {
      name: "Flight Emissions",
      icon: Plane,
      color: "from-purple-500 to-blue-500",
      fields: [
        { name: "origin", label: "Origin Airport", type: "text", placeholder: "LAX (Los Angeles)" },
        { name: "destination", label: "Destination Airport", type: "text", placeholder: "JFK (New York)" },
        { name: "passengers", label: "Number of Passengers", type: "number", placeholder: "1" },
        { name: "cabin_class", label: "Cabin Class", type: "select", options: ["economy", "business", "first"] },
        { name: "aircraft_type", label: "Aircraft Type", type: "select", options: ["narrow-body", "wide-body", "regional"] },
        { name: "trip_type", label: "Trip Type", type: "select", options: ["one_way", "round_trip"] },
        { name: "methodology", label: "Methodology", type: "select", options: ["AR4", "AR5", "AR6"] }
      ]
    },
    cloud: {
      name: "Cloud Computing",
      icon: Cloud,
      color: "from-indigo-500 to-purple-500",
      fields: [
        { name: "provider", label: "Provider", type: "select", options: ["AWS", "Azure", "GCP", "Other"] },
        { name: "service", label: "Service Type", type: "select", options: ["compute", "storage", "network", "database"] },
        { name: "usage_hours", label: "Usage Hours", type: "number", placeholder: "720" },
        { name: "region", label: "Cloud Region", type: "select", options: ["us-east", "us-west", "eu-west", "asia-pacific"] }
      ]
    },
    agriculture: {
      name: "Agriculture",
      icon: Wheat,
      color: "from-green-600 to-lime-500",
      fields: [
        { name: "crop_type", label: "Crop Type", type: "select", options: ["wheat", "corn", "rice", "soybeans", "cotton"] },
        { name: "area", label: "Area (hectares)", type: "number", placeholder: "100" },
        { name: "fertilizer_amount", label: "Fertilizer (kg)", type: "number", placeholder: "500" },
        { name: "irrigation", label: "Irrigation Type", type: "select", options: ["none", "drip", "sprinkler", "flood"] }
      ]
    },
    livestock: {
      name: "Livestock",
      icon: TreePine,
      color: "from-orange-500 to-red-500",
      fields: [
        { name: "animal_type", label: "Animal Type", type: "select", options: ["cattle", "sheep", "pigs", "chickens", "goats"] },
        { name: "count", label: "Number of Animals", type: "number", placeholder: "100" },
        { name: "feed_type", label: "Feed Type", type: "select", options: ["grass", "grain", "mixed", "organic"] },
        { name: "housing", label: "Housing Type", type: "select", options: ["pasture", "barn", "feedlot", "free_range"] }
      ]
    },
    waste: {
      name: "Waste Management",
      icon: Recycle,
      color: "from-gray-500 to-slate-600",
      fields: [
        { name: "waste_type", label: "Waste Type", type: "select", options: ["organic", "paper", "plastic", "glass", "metal"] },
        { name: "amount", label: "Amount (kg)", type: "number", placeholder: "1000" },
        { name: "treatment", label: "Treatment Method", type: "select", options: ["landfill", "incineration", "recycling", "composting"] },
        { name: "location", label: "Location", type: "select", options: ["urban", "rural", "industrial"] }
      ]
    },
    water: {
      name: "Water Usage",
      icon: Droplets,
      color: "from-blue-400 to-cyan-500",
      fields: [
        { name: "volume", label: "Volume (liters)", type: "number", placeholder: "10000" },
        { name: "source", label: "Water Source", type: "select", options: ["municipal", "well", "surface", "desalinated"] },
        { name: "treatment", label: "Treatment Level", type: "select", options: ["none", "basic", "advanced", "reverse_osmosis"] },
        { name: "usage", label: "Usage Type", type: "select", options: ["domestic", "industrial", "irrigation", "cooling"] }
      ]
    },
    construction: {
      name: "Construction",
      icon: Hammer,
      color: "from-amber-500 to-orange-600",
      fields: [
        { name: "material", label: "Material Type", type: "select", options: ["concrete", "steel", "wood", "aluminum", "brick"] },
        { name: "quantity", label: "Quantity (tons)", type: "number", placeholder: "10" },
        { name: "transport_distance", label: "Transport Distance (km)", type: "number", placeholder: "50" },
        { name: "project_type", label: "Project Type", type: "select", options: ["residential", "commercial", "infrastructure", "industrial"] }
      ]
    },
    manufacturing: {
      name: "Manufacturing",
      icon: Factory,
      color: "from-slate-600 to-gray-700",
      fields: [
        { name: "product_type", label: "Product Type", type: "select", options: ["electronics", "textiles", "automotive", "food", "chemicals"] },
        { name: "units", label: "Units Produced", type: "number", placeholder: "1000" },
        { name: "energy_intensity", label: "Energy Intensity", type: "select", options: ["low", "medium", "high", "very_high"] },
        { name: "production_method", label: "Production Method", type: "select", options: ["automated", "manual", "hybrid"] }
      ]
    },
    residential: {
      name: "Residential",
      icon: Home,
      color: "from-rose-500 to-pink-600",
      fields: [
        { name: "home_size", label: "Home Size (sq ft)", type: "number", placeholder: "2000" },
        { name: "heating_type", label: "Heating Type", type: "select", options: ["natural_gas", "electric", "oil", "solar", "heat_pump"] },
        { name: "occupants", label: "Number of Occupants", type: "number", placeholder: "4" },
        { name: "insulation", label: "Insulation Level", type: "select", options: ["poor", "average", "good", "excellent"] }
      ]
    }
  };


  const handleCalculate = async () => {
    setLoading(true);
    
    // Simulate API call
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
          trees: Math.ceil(baseEmission / 22), // Avg tree absorbs ~22kg CO2/year
          cost_usd: (baseEmission * 0.02).toFixed(2) // $0.02 per kg CO2e
        },
        comparison: {
          car_km: (baseEmission / 0.12).toFixed(0), // ~0.12 kg CO2/km for avg car
          home_days: (baseEmission / 16.4).toFixed(1) // ~16.4 kg CO2/day avg US home
        }
      };
      
      setResults(mockResults);
      
      // Save to history
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

  // Auto-detect region and set it in form data
  useEffect(() => {
    if (region && !formData.region) {
      setFormData(prev => ({ ...prev, region: region.region }));
    }
  }, [region, formData.region]);

  const currentCalculator = calculators[activeCalculator as keyof typeof calculators];
  const Icon = currentCalculator.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-border/50 backdrop-blur-sm mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-20" />
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
                  AI-Powered Analytics
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Advanced 
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"> Emission</span>
                <br />Calculator
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-6">
                Calculate CO2e emissions across 12+ industries with precision. Get detailed breakdowns, offset suggestions, and actionable insights.
              </p>
              {region && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 rounded-full px-4 py-2 w-fit">
                  <MapPin className="h-4 w-4 text-primary" />
                  Auto-detected: {region.country} ({region.region})
                </div>
              )}
            </motion.div>
            <div className="flex items-center gap-4">
              <DarkModeToggle />
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="hidden lg:flex flex-col items-center gap-4 p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50"
              >
                <div className="flex -space-x-2">
                  {[Calculator, TrendingUp, BarChart3].map((Icon, i) => (
                    <div key={i} className="p-2 bg-primary/10 rounded-xl border-2 border-background">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">12+</div>
                  <div className="text-xs text-muted-foreground">Industries</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Calculator Types - Enhanced Sidebar */}
        <div className="xl:col-span-3 space-y-4">
          <div className="sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Categories</h3>
            </div>
            
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
              {Object.entries(calculators).map(([key, calc], index) => {
                const CalcIcon = calc.icon;
                const isActive = activeCalculator === key;
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full h-auto p-0 overflow-hidden rounded-2xl transition-all duration-500 ${
                        isActive ? 'ring-2 ring-primary/50' : ''
                      }`}
                      onClick={() => {
                        setActiveCalculator(key);
                        setResults(null);
                        setFormData({});
                      }}
                    >
                      <div className={`w-full p-5 bg-gradient-to-br ${
                        isActive 
                          ? 'from-primary/20 via-secondary/10 to-accent/10 border-primary/30' 
                          : 'from-card via-card to-secondary/5 hover:from-primary/5 hover:to-secondary/5'
                      } border border-border/50 backdrop-blur-sm transition-all duration-500`}>
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${calc.color} shadow-lg transition-transform duration-300 ${
                            isActive ? 'scale-110' : 'group-hover:scale-105'
                          }`}>
                            <CalcIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <div className={`font-semibold text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                              {calc.name}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs px-2 py-0">
                                {calc.fields.length} fields
                              </Badge>
                              {isActive && (
                                <ArrowRight className="h-3 w-3 text-primary animate-pulse" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calculator Form - Enhanced */}
        <div className="xl:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCalculator}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            >
              <div className="bg-gradient-to-br from-card via-card to-secondary/5 rounded-3xl p-8 shadow-xl border border-border/50 backdrop-blur-sm">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-6 mb-6">
                    <motion.div 
                      className={`p-4 rounded-2xl bg-gradient-to-br ${currentCalculator.color} shadow-xl`}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        {currentCalculator.name}
                        <span className="text-primary"> Calculator</span>
                      </h3>
                      <p className="text-muted-foreground text-base">
                        Configure parameters for accurate CO2e emission calculations
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Completion</span>
                      <span className="text-sm font-medium text-foreground">
                        {Math.round((Object.keys(formData).length / currentCalculator.fields.length) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(Object.keys(formData).length / currentCalculator.fields.length) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {currentCalculator.fields.map((field, index) => (
                    <motion.div 
                      key={`${activeCalculator}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <Label htmlFor={field.name} className="text-sm font-semibold text-foreground flex items-center gap-2">
                          {field.label}
                          {formData[field.name] && (
                            <Badge variant="secondary" className="text-xs px-2 py-0">
                              ✓
                            </Badge>
                          )}
                        </Label>
                        {field.showSlider && formData[field.name] && (
                          <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded-lg">
                            {formData[field.name]}
                          </span>
                        )}
                      </div>
                      
                      <div className="relative">
                        {field.type === "select" ? (
                          <Select 
                            value={formData[field.name] || ""} 
                            onValueChange={(value) => setFormData({...formData, [field.name]: value})}
                          >
                            <SelectTrigger className="rounded-xl border-border/50 h-12 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200">
                              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option) => (
                                <SelectItem key={option} value={option} className="capitalize">
                                  {option.replace(/_/g, ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.showSlider ? (
                          <div className="space-y-4">
                            <div className="px-3">
                              <Slider
                                value={[formData[field.name] || field.min || 0]}
                                onValueChange={(value) => setFormData({...formData, [field.name]: value[0]})}
                                max={field.max || 1000}
                                min={field.min || 0}
                                step={field.step || 1}
                                className="w-full"
                              />
                            </div>
                            <Input
                              id={field.name}
                              type={field.type}
                              placeholder={field.placeholder}
                              value={formData[field.name] || ""}
                              className="rounded-xl border-border/50 h-12 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
                              onChange={(e) => setFormData({...formData, [field.name]: Number(e.target.value)})}
                            />
                          </div>
                        ) : (
                          <Input
                            id={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ""}
                            className="rounded-xl border-border/50 h-12 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
                            onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Calculate Button */}
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <Button 
                    onClick={handleCalculate} 
                    disabled={loading}
                    className={`w-full h-16 text-lg font-semibold rounded-2xl bg-gradient-to-r ${currentCalculator.color} hover:opacity-90 text-white border-0 shadow-xl transition-all duration-500 relative overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <Calculator className="mr-3 h-6 w-6" />
                    <span className="relative z-10">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Calculating emissions...
                        </div>
                      ) : (
                        "Calculate CO2e Emissions"
                      )}
                    </span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Results - Enhanced */}
        <div className="xl:col-span-3 space-y-6">
          <AnimatePresence>
            {results ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                className="space-y-6"
              >
                {/* Main Result Card */}
                <div className="bg-gradient-to-br from-card via-card to-secondary/5 rounded-3xl p-8 shadow-2xl border border-border/50 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <Award className="h-6 w-6 text-primary" />
                        <h3 className="text-xl font-bold text-foreground">Results</h3>
                      </div>
                      <div className="flex gap-2">
                        <ExportResults 
                          results={results}
                          calculationType={currentCalculator.name}
                          formData={formData}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddToComparison}
                          className="rounded-xl border-primary/20 hover:bg-primary/10"
                        >
                          Compare
                        </Button>
                      </div>
                    </div>
                    
                    {/* Main Metric */}
                    <div className="text-center mb-8 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
                      <motion.div 
                        className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                      >
                        {results.co2e_kg.toFixed(2)}
                      </motion.div>
                      <div className="text-lg font-semibold text-muted-foreground">kg CO2e</div>
                      <Badge className="mt-3 bg-primary/20 text-primary border-primary/30">
                        {results.methodology} Standard
                      </Badge>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="text-center p-4 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-xl border border-secondary/20">
                        <div className="text-sm text-muted-foreground mb-1">Confidence</div>
                        <div className={`font-bold text-lg capitalize flex items-center justify-center gap-2 ${
                          results.confidence === 'high' ? 'text-green-600' : 
                          results.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            results.confidence === 'high' ? 'bg-green-600' : 
                            results.confidence === 'medium' ? 'bg-yellow-600' : 'bg-red-600'
                          }`} />
                          {results.confidence}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl border border-accent/20">
                        <div className="text-sm text-muted-foreground mb-1">Category</div>
                        <div className="font-bold text-lg text-foreground">
                          {currentCalculator.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scope Breakdown Chart */}
                <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-border/50">
                  <h4 className="font-bold text-foreground mb-6 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Scope Breakdown
                  </h4>
                  <div className="space-y-4">
                    {[
                      { name: "Scope 1 (Direct)", value: results.scope.scope1, color: "from-red-500 to-red-600" },
                      { name: "Scope 2 (Electricity)", value: results.scope.scope2, color: "from-yellow-500 to-yellow-600" },
                      { name: "Scope 3 (Indirect)", value: results.scope.scope3, color: "from-green-500 to-green-600" }
                    ].map((scope, index) => {
                      const percentage = (scope.value / results.co2e_kg) * 100;
                      return (
                        <motion.div
                          key={scope.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.5 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">{scope.name}</span>
                            <span className="text-sm font-bold text-foreground">{scope.value.toFixed(2)} kg</span>
                          </div>
                          <div className="relative h-3 bg-secondary/20 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${scope.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ delay: 0.2 * index, duration: 1, ease: "easeOut" }}
                            />
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Offset Suggestions */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-3xl p-6 border border-green-200/50 dark:border-green-800/50 shadow-lg">
                  <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                    <TreePine className="h-5 w-5" />
                    Carbon Offset Solutions
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="text-center p-4 bg-white/50 dark:bg-green-950/30 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-3xl font-black text-green-600 mb-1">{results.offsetSuggestion.trees}</div>
                      <div className="text-sm text-green-700 dark:text-green-300">trees to plant</div>
                    </motion.div>
                    <motion.div 
                      className="text-center p-4 bg-white/50 dark:bg-green-950/30 rounded-xl"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="text-3xl font-black text-green-600 mb-1">${results.offsetSuggestion.cost_usd}</div>
                      <div className="text-sm text-green-700 dark:text-green-300">offset cost</div>
                    </motion.div>
                  </div>
                </div>

                {/* Comparisons */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-3xl p-6 border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Real-World Equivalents
                  </h4>
                  <div className="space-y-4">
                    <motion.div 
                      className="flex justify-between items-center p-3 bg-white/50 dark:bg-blue-950/30 rounded-xl"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        🚗 Car driving distance
                      </span>
                      <span className="font-bold text-blue-900 dark:text-blue-100">{results.comparison.car_km} km</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between items-center p-3 bg-white/50 dark:bg-blue-950/30 rounded-xl"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        🏠 Home energy usage
                      </span>
                      <span className="font-bold text-blue-900 dark:text-blue-100">{results.comparison.home_days} days</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-12 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 border-dashed"
              >
                <Calculator className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Ready to Calculate</h3>
                <p className="text-sm text-muted-foreground/70">
                  Fill in the parameters and click calculate to see your emission results
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Calculation History */}
          <CalculationHistory 
            onLoadCalculation={handleLoadCalculation}
            onAddToComparison={(record) => setComparisons([...comparisons, record])}
          />
        </div>
      </div>
      
      {/* Comparison View */}
      <ComparisonView 
        comparisons={comparisons}
        onAddToComparison={handleAddToComparison}
        onRemoveFromComparison={(id) => setComparisons(comparisons.filter(c => c.id !== id))}
      />
    </div>
  );
};
