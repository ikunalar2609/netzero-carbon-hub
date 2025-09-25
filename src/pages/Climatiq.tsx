import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator,
  Database,
  Code,
  ArrowRight,
  Zap
} from "lucide-react";
import { ClimateDataExplorer } from "@/components/climatiq/ClimateDataExplorer";
import { ApiDocumentation } from "@/components/climatiq/ApiDocumentation";
import { EmissionCalculator } from "@/components/climatiq/EmissionCalculator";

const Climatiq = () => {
  const [activeTab, setActiveTab] = useState("calculator");

  return (
    <div className="min-h-screen bg-background">
      {/* Minimalist Hero Section */}
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
            <div className="inline-flex items-center px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground">
              Carbon Emissions API
            </div>
            
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground">
              Climatiq
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
              Calculate carbon emissions with precision and simplicity
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                size="lg" 
                className="px-8 py-3 h-auto"
                onClick={() => setActiveTab("calculator")}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Start Calculating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="px-8 py-3 h-auto"
                onClick={() => setActiveTab("api-docs")}
              >
                <Code className="mr-2 h-4 w-4" />
                API Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Minimalist Stats */}
      <motion.section
        className="px-6 py-16 border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-light text-foreground">10M+</div>
              <div className="text-sm text-muted-foreground">Calculations processed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-light text-foreground">500+</div>
              <div className="text-sm text-muted-foreground">Emission factors</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-light text-foreground">99.9%</div>
              <div className="text-sm text-muted-foreground">Accuracy rate</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Clean Navigation */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="calculator" className="text-sm">Calculator</TabsTrigger>
              <TabsTrigger value="api-docs" className="text-sm">API Docs</TabsTrigger>
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

            <TabsContent value="api-docs" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ApiDocumentation />
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

      {/* Minimalist Features */}
      <motion.section 
        className="px-6 py-16 border-t border-border bg-muted/30"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-foreground mb-4">
              Built for developers
            </h2>
            <p className="text-muted-foreground">
              Simple, powerful, and ready to integrate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground">Fast & Reliable</h3>
              <p className="text-sm text-muted-foreground">
                Sub-second response times with 99.9% uptime
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground">RESTful API</h3>
              <p className="text-sm text-muted-foreground">
                Clean, intuitive endpoints with comprehensive docs
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground">Rich Data</h3>
              <p className="text-sm text-muted-foreground">
                500+ emission factors from trusted sources
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Climatiq;