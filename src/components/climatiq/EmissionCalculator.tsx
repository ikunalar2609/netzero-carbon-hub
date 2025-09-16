
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Zap, Truck, Plane, Cloud, TreePine, Droplets, Factory, Home, Recycle, Wheat, Hammer } from "lucide-react";
import { toast } from "sonner";

export const EmissionCalculator = () => {
  const [activeCalculator, setActiveCalculator] = useState("electricity");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculators = {
    electricity: {
      name: "Electricity",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      fields: [
        { name: "amount", label: "Amount (kWh)", type: "number", placeholder: "1000" },
        { name: "region", label: "Region", type: "select", options: ["US", "EU", "UK", "AU", "Global"] },
        { name: "energy_source", label: "Energy Source", type: "select", options: ["grid", "solar", "wind", "natural_gas", "coal"] }
      ]
    },
    transport: {
      name: "Transportation",
      icon: Truck,
      color: "from-blue-500 to-green-500",
      fields: [
        { name: "mode", label: "Transport Mode", type: "select", options: ["car", "truck", "bus", "train", "motorcycle", "bicycle"] },
        { name: "distance", label: "Distance (km)", type: "number", placeholder: "100" },
        { name: "fuel_type", label: "Fuel Type", type: "select", options: ["gasoline", "diesel", "electric", "hybrid", "hydrogen"] },
        { name: "passengers", label: "Passengers", type: "number", placeholder: "1" }
      ]
    },
    flight: {
      name: "Flight",
      icon: Plane,
      color: "from-purple-500 to-blue-500",
      fields: [
        { name: "origin", label: "Origin", type: "text", placeholder: "LAX" },
        { name: "destination", label: "Destination", type: "text", placeholder: "JFK" },
        { name: "class", label: "Class", type: "select", options: ["economy", "business", "first"] },
        { name: "trip_type", label: "Trip Type", type: "select", options: ["one_way", "round_trip"] }
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

  const [formData, setFormData] = useState<any>({});

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
      setLoading(false);
      toast.success("Calculation completed!");
    }, 1500);
  };

  const currentCalculator = calculators[activeCalculator as keyof typeof calculators];
  const Icon = currentCalculator.icon;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
          Advanced Emission 
          <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-medium"> Calculator</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Calculate CO2e emissions across multiple industries and activities with our comprehensive calculation engine
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calculator Types */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Categories</h3>
          {Object.entries(calculators).map(([key, calc]) => {
            const CalcIcon = calc.icon;
            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={activeCalculator === key ? "default" : "outline"}
                  className={`w-full justify-start h-auto p-4 rounded-2xl transition-all duration-300 ${
                    activeCalculator === key 
                      ? 'bg-gray-900 text-white shadow-lg' 
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => {
                    setActiveCalculator(key);
                    setResults(null);
                    setFormData({});
                  }}
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${calc.color} mr-4 shadow-sm`}>
                    <CalcIcon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{calc.name}</div>
                    <div className={`text-xs ${activeCalculator === key ? 'text-gray-300' : 'text-gray-500'}`}>
                      {calc.fields.length} parameters
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <motion.div
            key={activeCalculator}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentCalculator.color} shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{currentCalculator.name} Calculator</h3>
                    <p className="text-gray-600">Enter the parameters below to calculate CO2e emissions</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {currentCalculator.fields.map((field, index) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
                      {field.label}
                    </Label>
                    {field.type === "select" ? (
                      <Select onValueChange={(value) => setFormData({...formData, [field.name]: value})}>
                        <SelectTrigger className="rounded-xl border-gray-200 h-12">
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
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="rounded-xl border-gray-200 h-12"
                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                      />
                    )}
                  </motion.div>
                ))}
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={handleCalculate} 
                  disabled={loading}
                  className={`w-full h-14 text-lg rounded-2xl bg-gradient-to-r ${currentCalculator.color} hover:opacity-90 text-white border-0 shadow-lg transition-all duration-300`}
                >
                  <Calculator className="mr-3 h-5 w-5" />
                  {loading ? "Calculating emissions..." : "Calculate CO2e Emissions"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Main Result Card */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Emission Results</h3>
                
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {results.co2e_kg.toFixed(2)}
                  </div>
                  <div className="text-lg text-gray-600 mt-2">kg CO2e</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-600">Methodology</div>
                    <div className="font-semibold text-gray-900">{results.methodology}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-600">Confidence</div>
                    <div className={`font-semibold capitalize ${
                      results.confidence === 'high' ? 'text-green-600' : 
                      results.confidence === 'medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {results.confidence}
                    </div>
                  </div>
                </div>
                
                {/* Scope Breakdown */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Scope Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Scope 1 (Direct)</span>
                      <span className="font-medium">{results.scope.scope1.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Scope 2 (Electricity)</span>
                      <span className="font-medium">{results.scope.scope2.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Scope 3 (Indirect)</span>
                      <span className="font-medium">{results.scope.scope3.toFixed(2)} kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offset Suggestions */}
              <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
                <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <TreePine className="h-5 w-5" />
                  Carbon Offset Suggestions
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{results.offsetSuggestion.trees}</div>
                    <div className="text-sm text-green-700">trees to plant</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${results.offsetSuggestion.cost_usd}</div>
                    <div className="text-sm text-green-700">offset cost (USD)</div>
                  </div>
                </div>
              </div>

              {/* Comparisons */}
              <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-4">Equivalent Comparisons</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">🚗 Driving distance equivalent</span>
                    <span className="font-medium text-blue-900">{results.comparison.car_km} km</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">🏠 Home energy usage equivalent</span>
                    <span className="font-medium text-blue-900">{results.comparison.home_days} days</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
