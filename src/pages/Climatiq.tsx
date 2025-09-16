
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
  Building,
  Star
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 py-20 bg-gradient-to-br from-green-50/30 to-blue-50/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-5xl mx-auto space-y-8">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
              Carbon Emissions API Platform
            </span>
            <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 tracking-tight">
              Climatiq<span className="text-green-600"> API</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Simplify environmental footprint calculations with accurate CO2e estimates through our comprehensive API platform
          </motion.p>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg h-auto rounded-full"
              onClick={() => setActiveTab("api-docs")}
            >
              <Code className="mr-2 h-5 w-5" />
              API Documentation
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg h-auto rounded-full"
              onClick={() => setActiveTab("explorer")}
            >
              <Database className="mr-2 h-5 w-5" />
              Data Explorer
            </Button>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="pt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>10M+ calculations processed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>500+ emission factors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Real-time accuracy</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Navigation Tabs */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="api-docs">API Docs</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="explorer">Data Explorer</TabsTrigger>
            <TabsTrigger value="expansion">Project Expansion</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-16">
            {/* API Endpoints Grid */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="py-8"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                  Comprehensive 
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-medium"> API Endpoints</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Access powerful emission calculation endpoints for every aspect of your carbon footprint analysis
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {apiEndpoints.map((endpoint, index) => {
                  const Icon = endpoint.icon;
                  return (
                    <motion.div
                      key={endpoint.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="group"
                    >
                      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                        <div className="text-center">
                          <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r ${endpoint.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-4">{endpoint.name}</h3>
                          <p className="text-gray-600 leading-relaxed text-sm">
                            {endpoint.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="py-8"
            >
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Comprehensive Guides</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        In-depth endpoint usage guides
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        CO2e calculation methods (AR4, AR5, AR6)
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Private emission factors upload
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        Python integration snippets
                      </li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Database className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Data Explorer</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        Search emission factor database
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        Interactive visualization tools
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        Filter and sorting options
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        Demo applications
                      </li>
                    </ul>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Code className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Developer Tools</h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        RESTful API architecture
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        Multi-language code snippets
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        Scalable and secure endpoints
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        Real-time emission calculations
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </div>
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

          <TabsContent value="expansion" className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  CO2 Emissions Calculator - Project Expansion Plan
                </h2>
                <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                  Comprehensive roadmap for expanding the CO2 emissions API + Calculator with new features, 
                  enhanced calculations, improved UI/UX, and advanced user experience capabilities.
                </p>
              </div>

              {/* Priority Matrix */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Badge className="bg-green-500">Priority Matrix</Badge>
                    Feature Development Roadmap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-green-600 text-lg">🚀 Quick Wins (1-4 weeks)</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Interactive sliders for input fields</li>
                        <li>• Dark mode toggle implementation</li>
                        <li>• Unit conversion support (kWh ↔ MWh, km ↔ miles)</li>
                        <li>• Inline tooltips and methodology explanations</li>
                        <li>• Save/export results (CSV, JSON)</li>
                        <li>• Region auto-detection from browser/IP</li>
                        <li>• Side-by-side comparison view</li>
                        <li>• Local storage for calculation history</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-blue-600 text-lg">🎯 Medium-term (1-3 months)</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Dashboard with interactive charts (pie, bar, line)</li>
                        <li>• Batch calculation endpoint</li>
                        <li>• Scope 1/2/3 classification in results</li>
                        <li>• Per capita emissions calculator</li>
                        <li>• Agriculture & waste calculation endpoints</li>
                        <li>• Construction & supply chain emissions</li>
                        <li>• Uncertainty ranges & confidence intervals</li>
                        <li>• PDF report generation</li>
                        <li>• Emission reduction suggestions</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-purple-600 text-lg mb-3">🔮 Long-term Vision (3-6 months)</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <li>• Custom emission factors upload</li>
                      <li>• Lifecycle emissions (production + use + disposal)</li>
                      <li>• Multi-step scenario calculations</li>
                      <li>• User authentication & cloud storage</li>
                      <li>• Personalized monthly/annual reports</li>
                      <li>• Gamification with badges & achievements</li>
                      <li>• Carbon offset calculation & recommendations</li>
                      <li>• Comparative analysis reports</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* API Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Code className="h-6 w-6 text-blue-600" />
                    Enhanced API Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-green-600 mb-2">New Calculation Endpoints</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Agriculture emissions (livestock, crops, fertilizers)</li>
                        <li>• Waste management (landfill, incineration, recycling)</li>
                        <li>• Construction (materials, equipment, labor)</li>
                        <li>• Supply chain & logistics</li>
                        <li>• Industrial processes</li>
                        <li>• Water usage & treatment</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-blue-600 mb-2">Advanced Calculations</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Batch processing endpoint</li>
                        <li>• Custom emission factors API</li>
                        <li>• Uncertainty & confidence intervals</li>
                        <li>• Comparative analysis engine</li>
                        <li>• Unit conversion service</li>
                        <li>• Scenario modeling API</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-purple-600 mb-2">Data Models</h4>
                      <ul className="text-sm space-y-1">
                        <li>• EmissionResult with scope classification</li>
                        <li>• UncertaintyRange with min/max/confidence</li>
                        <li>• LifecycleEmission with phase breakdown</li>
                        <li>• ComparisonReport with scenarios</li>
                        <li>• CustomFactor with user validation</li>
                        <li>• BatchCalculation with queue status</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* UI/UX Improvements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Globe className="h-6 w-6 text-green-600" />
                    UI/UX Enhancements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Dashboard & Visualization</h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-3 bg-blue-50 rounded">
                          <strong>Emissions Dashboard:</strong> Interactive pie charts for category breakdown, 
                          line charts for trends, bar charts for comparisons
                        </div>
                        <div className="p-3 bg-green-50 rounded">
                          <strong>Comparison View:</strong> Side-by-side analysis (EV vs gasoline, 
                          renewable vs fossil energy, flight vs train)
                        </div>
                        <div className="p-3 bg-purple-50 rounded">
                          <strong>Interactive Controls:</strong> Range sliders for quantities, 
                          date pickers for periods, toggle switches for options
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">User Experience</h4>
                      <div className="space-y-2 text-sm">
                        <div className="p-3 bg-orange-50 rounded">
                          <strong>Smart Suggestions:</strong> Auto-complete for locations, 
                          intelligent defaults, contextual recommendations
                        </div>
                        <div className="p-3 bg-red-50 rounded">
                          <strong>Export & Sharing:</strong> PDF reports with charts, 
                          CSV data export, shareable calculation links
                        </div>
                        <div className="p-3 bg-teal-50 rounded">
                          <strong>Accessibility:</strong> Screen reader support, 
                          keyboard navigation, color-blind friendly palettes
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Implementation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Database className="h-6 w-6 text-purple-600" />
                    Technical Architecture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Backend APIs</h4>
                      <div className="bg-gray-50 p-4 rounded text-sm font-mono">
                        <div className="mb-2"><span className="text-green-600">POST</span> /api/v2/calculate/batch</div>
                        <div className="mb-2"><span className="text-blue-600">GET</span> /api/v2/factors/custom</div>
                        <div className="mb-2"><span className="text-purple-600">POST</span> /api/v2/compare/scenarios</div>
                        <div className="mb-2"><span className="text-orange-600">GET</span> /api/v2/reports/generate</div>
                        <div className="mb-2"><span className="text-red-600">POST</span> /api/v2/lifecycle/analyze</div>
                        <div><span className="text-teal-600">GET</span> /api/v2/offsets/calculate</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Frontend Components</h4>
                      <div className="space-y-2 text-sm">
                        <div>• EmissionsDashboard.tsx - Main analytics view</div>
                        <div>• ComparisonTool.tsx - Side-by-side analysis</div>
                        <div>• CalculatorWizard.tsx - Multi-step calculator</div>
                        <div>• ReportGenerator.tsx - PDF/CSV export</div>
                        <div>• HistoryTracker.tsx - Calculation history</div>
                        <div>• OffsetCalculator.tsx - Carbon offset recommendations</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gamification & User Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Star className="h-6 w-6 text-yellow-500" />
                    Gamification & Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                      <h4 className="font-semibold text-green-700 mb-2">Achievement System</h4>
                      <ul className="text-sm space-y-1">
                        <li>🌱 First Calculation - Calculate your first emission</li>
                        <li>🚀 Power User - 50+ calculations completed</li>
                        <li>🌍 Global Citizen - Calculate emissions in 10+ countries</li>
                        <li>⚡ Energy Saver - Reduce electricity emissions by 20%</li>
                        <li>🚗 Transport Hero - Compare 5+ transport methods</li>
                        <li>📊 Data Analyst - Export 10+ reports</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                      <h4 className="font-semibold text-blue-700 mb-2">Progress Tracking</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Monthly carbon footprint trends</li>
                        <li>• Personal reduction targets</li>
                        <li>• Peer comparison (anonymous)</li>
                        <li>• Streak counters for regular usage</li>
                        <li>• Impact visualization (trees saved)</li>
                        <li>• Improvement suggestions based on data</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                      <h4 className="font-semibold text-purple-700 mb-2">Social Features</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Share reduction achievements</li>
                        <li>• Team challenges for organizations</li>
                        <li>• Leaderboards (opt-in)</li>
                        <li>• Carbon footprint pledges</li>
                        <li>• Community best practices</li>
                        <li>• Success story sharing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Implementation Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">🎯 Implementation Roadmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold">Phase 1: Foundation (Weeks 1-4)</h4>
                      <p className="text-sm text-gray-600">Dark mode, sliders, tooltips, basic export, comparison view</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold">Phase 2: Enhancement (Weeks 5-12)</h4>
                      <p className="text-sm text-gray-600">Dashboard, new endpoints, batch processing, scope classification</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold">Phase 3: Advanced (Weeks 13-20)</h4>
                      <p className="text-sm text-gray-600">Custom factors, lifecycle analysis, gamification, advanced reports</p>
                    </div>
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-semibold">Phase 4: Scale (Weeks 21-24)</h4>
                      <p className="text-sm text-gray-600">Social features, enterprise integrations, API optimization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Climatiq;
