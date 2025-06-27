
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Cloud, 
  Plane, 
  Truck, 
  Zap, 
  ShoppingCart, 
  Search,
  Database,
  Code,
  FileText,
  Calculator,
  Globe,
  Factory,
  Ship,
  Train,
  Building
} from "lucide-react";
import { ClimateDataExplorer } from "@/components/climatiq/ClimateDataExplorer";
import { ApiDocumentation } from "@/components/climatiq/ApiDocumentation";
import { EmissionCalculator } from "@/components/climatiq/EmissionCalculator";

const Climatiq = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const apiEndpoints = [
    {
      name: "Basic Estimate",
      description: "Calculate total estimated emissions for specific activities",
      icon: Calculator,
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Intermodal Freight",
      description: "Estimate emissions for shipping across air, sea, and road",
      icon: Truck,
      color: "from-green-500 to-green-600"
    },
    {
      name: "Cloud Computing",
      description: "Calculate carbon footprint of cloud resources",
      icon: Cloud,
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Travel",
      description: "Estimate emissions from car, airplane, train, and hotel travel",
      icon: Plane,
      color: "from-orange-500 to-orange-600"
    },
    {
      name: "Procurement",
      description: "Automate emission calculations for purchases",
      icon: ShoppingCart,
      color: "from-red-500 to-red-600"
    },
    {
      name: "Energy",
      description: "Estimate emissions from purchased/consumed energy types",
      icon: Zap,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      name: "Classification",
      description: "Calculate emissions based on industry-specific schemes",
      icon: Factory,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      name: "CBAM",
      description: "Calculate carbon emissions for EU imports under CBAM regulation",
      icon: Globe,
      color: "from-teal-500 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Climatiq API
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Simplify environmental footprint calculations with accurate CO2e estimates through our comprehensive API
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              <Code className="mr-2 h-5 w-5" />
              API Documentation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Database className="mr-2 h-5 w-5" />
              Data Explorer
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="api-docs">API Docs</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="explorer">Data Explorer</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* API Endpoints Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                API Endpoints
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {apiEndpoints.map((endpoint, index) => {
                  const Icon = endpoint.icon;
                  return (
                    <motion.div
                      key={endpoint.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <CardHeader className="text-center">
                          <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${endpoint.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="text-lg">{endpoint.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-center">
                            {endpoint.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Comprehensive Guides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• In-depth endpoint usage guides</li>
                    <li>• CO2e calculation methods (AR4, AR5, AR6)</li>
                    <li>• Private emission factors upload</li>
                    <li>• Python integration snippets</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-600" />
                    Data Explorer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Search emission factor database</li>
                    <li>• Interactive visualization tools</li>
                    <li>• Filter and sorting options</li>
                    <li>• Demo applications</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-600" />
                    Developer Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• RESTful API architecture</li>
                    <li>• Multi-language code snippets</li>
                    <li>• Scalable and secure endpoints</li>
                    <li>• Real-time emission calculations</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.section>
          </TabsContent>

          <TabsContent value="api-docs">
            <ApiDocumentation />
          </TabsContent>

          <TabsContent value="calculator">
            <EmissionCalculator />
          </TabsContent>

          <TabsContent value="explorer">
            <ClimateDataExplorer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Climatiq;
