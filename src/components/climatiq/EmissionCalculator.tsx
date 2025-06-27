
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Zap, Truck, Plane, Cloud } from "lucide-react";
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
        { name: "region", label: "Region", type: "select", options: ["US", "EU", "UK", "AU", "Global"] }
      ]
    },
    transport: {
      name: "Transportation",
      icon: Truck,
      color: "from-blue-500 to-green-500",
      fields: [
        { name: "mode", label: "Transport Mode", type: "select", options: ["car", "truck", "bus", "train"] },
        { name: "distance", label: "Distance (km)", type: "number", placeholder: "100" },
        { name: "fuel_type", label: "Fuel Type", type: "select", options: ["gasoline", "diesel", "electric", "hybrid"] }
      ]
    },
    flight: {
      name: "Flight",
      icon: Plane,
      color: "from-purple-500 to-blue-500",
      fields: [
        { name: "origin", label: "Origin", type: "text", placeholder: "LAX" },
        { name: "destination", label: "Destination", type: "text", placeholder: "JFK" },
        { name: "class", label: "Class", type: "select", options: ["economy", "business", "first"] }
      ]
    },
    cloud: {
      name: "Cloud Computing",
      icon: Cloud,
      color: "from-indigo-500 to-purple-500",
      fields: [
        { name: "provider", label: "Provider", type: "select", options: ["AWS", "Azure", "GCP", "Other"] },
        { name: "service", label: "Service Type", type: "select", options: ["compute", "storage", "network", "database"] },
        { name: "usage_hours", label: "Usage Hours", type: "number", placeholder: "720" }
      ]
    }
  };

  const [formData, setFormData] = useState<any>({});

  const handleCalculate = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        co2e_kg: Math.random() * 500 + 50,
        methodology: "AR6",
        confidence: "high",
        breakdown: {
          direct: Math.random() * 200 + 20,
          indirect: Math.random() * 300 + 30
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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4">Emission Calculator</h2>
        <p className="text-muted-foreground mb-6">
          Calculate CO2e emissions for various activities using our interactive calculator.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calculator Types */}
        <div className="space-y-3">
          {Object.entries(calculators).map(([key, calc]) => {
            const CalcIcon = calc.icon;
            return (
              <Button
                key={key}
                variant={activeCalculator === key ? "default" : "outline"}
                className="w-full justify-start h-auto p-4"
                onClick={() => setActiveCalculator(key)}
              >
                <div className={`p-2 rounded-full bg-gradient-to-r ${calc.color} mr-3`}>
                  <CalcIcon className="h-4 w-4 text-white" />
                </div>
                {calc.name}
              </Button>
            );
          })}
        </div>

        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`p-2 rounded-full bg-gradient-to-r ${currentCalculator.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                {currentCalculator.name} Calculator
              </CardTitle>
              <CardDescription>
                Enter the details below to calculate CO2e emissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentCalculator.fields.map((field, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {field.type === "select" ? (
                    <Select onValueChange={(value) => setFormData({...formData, [field.name]: value})}>
                      <SelectTrigger>
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
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                    />
                  )}
                </div>
              ))}
              
              <Button 
                onClick={handleCalculate} 
                disabled={loading}
                className="w-full"
              >
                <Calculator className="mr-2 h-4 w-4" />
                {loading ? "Calculating..." : "Calculate Emissions"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {results.co2e_kg.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">kg CO2e</div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Methodology:</span>
                      <span className="font-semibold">{results.methodology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <span className="font-semibold capitalize">{results.confidence}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-sm font-semibold mb-2">Breakdown:</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Direct emissions:</span>
                        <span>{results.breakdown.direct.toFixed(2)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Indirect emissions:</span>
                        <span>{results.breakdown.indirect.toFixed(2)} kg</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
