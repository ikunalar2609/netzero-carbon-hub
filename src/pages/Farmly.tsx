import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator,
  FileSpreadsheet,
  Code,
  Database,
  ArrowRight,
  Zap,
  BookOpen
} from "lucide-react";
import { ClimateDataExplorer } from "@/components/farmly/ClimateDataExplorer";
import { EmissionCalculator } from "@/components/farmly/EmissionCalculator";
import { CalculationHistoryTable } from "@/components/farmly/CalculationHistoryTable";
 import { CarbonAccountingTemplate } from "@/components/farmly/CarbonAccountingTemplate";

const Farmly = () => {
  const [activeTab, setActiveTab] = useState("calculator");

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Hero Section */}
      <motion.section 
        className="relative px-6 py-24 md:py-32"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
              Carbon Emissions API
            </span>
            
            <h1 className="text-6xl md:text-8xl font-light tracking-tight text-gray-900">
              Farmly
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Calculate carbon emissions with precision and simplicity
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                size="lg" 
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 h-auto rounded-full"
                onClick={() => setActiveTab("calculator")}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Start Calculating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 h-auto rounded-full"
                asChild
              >
                <Link to="/farmly/docs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Full Documentation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Simple Stats */}
      <motion.section
        className="px-6 py-16 border-t border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-light text-gray-900">10M+</div>
              <div className="text-sm text-gray-600">Calculations processed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-light text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Emission factors</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-light text-gray-900">99.9%</div>
              <div className="text-sm text-gray-600">Accuracy rate</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Simple Navigation */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-4 mb-12 bg-gray-100">
              <TabsTrigger value="calculator" className="text-sm">Calculator</TabsTrigger>
              <TabsTrigger value="template" className="text-sm">CAT</TabsTrigger>
              <TabsTrigger value="history" className="text-sm">History</TabsTrigger>
              <TabsTrigger value="explorer" className="text-sm">Explorer</TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <EmissionCalculator />
              </motion.div>
            </TabsContent>

            <TabsContent value="template" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <CarbonAccountingTemplate />
              </motion.div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <CalculationHistoryTable />
              </motion.div>
            </TabsContent>


            <TabsContent value="explorer" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ClimateDataExplorer />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Simple Features */}
      <motion.section 
        className="px-6 py-16 border-t border-gray-200 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Built for developers
            </h2>
            <p className="text-gray-600">
              Simple, powerful, and ready to integrate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900">Fast & Reliable</h3>
              <p className="text-sm text-gray-600">
                Sub-second response times with 99.9% uptime
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900">RESTful API</h3>
              <p className="text-sm text-gray-600">
                Clean, intuitive endpoints with comprehensive docs
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900">Rich Data</h3>
              <p className="text-sm text-gray-600">
                500+ emission factors from trusted sources
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Farmly;