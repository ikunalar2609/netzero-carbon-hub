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
    <div className="min-h-screen bg-gradient-to-br from-background via-climatiq-bg-subtle to-background">
      {/* Modern Hero Section with Gradient Background */}
      <motion.section 
        className="relative px-6 py-24 md:py-32 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-climatiq-primary/20 rounded-full blur-3xl animate-pulse-gentle" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-climatiq-accent/20 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '1s' }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-5 py-2 bg-climatiq-primary/10 border border-climatiq-primary/20 rounded-full text-sm font-medium text-climatiq-primary backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Zap className="h-4 w-4" />
              Carbon Emissions API
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-br from-foreground via-climatiq-primary to-climatiq-accent bg-clip-text text-transparent">
              Climatiq
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade carbon emission calculations with precision, speed, and simplicity
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button 
                size="lg" 
                className="group px-8 py-6 h-auto text-base font-semibold shadow-elevation-medium hover:shadow-glow-blue transition-all duration-300"
                onClick={() => setActiveTab("calculator")}
              >
                <Calculator className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Start Calculating
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="px-8 py-6 h-auto text-base font-semibold border-2 hover:bg-accent/50 hover:border-climatiq-primary/50 transition-all duration-300"
                onClick={() => setActiveTab("api-docs")}
              >
                <Code className="mr-2 h-5 w-5" />
                API Documentation
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Modern Stats Section */}
      <motion.section
        className="px-6 py-20 border-t border-border/50"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="relative p-8 bg-gradient-to-br from-climatiq-primary/10 to-transparent border border-climatiq-primary/20 rounded-2xl group hover:shadow-glow-blue transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="text-5xl font-bold bg-gradient-to-br from-climatiq-primary to-climatiq-secondary bg-clip-text text-transparent mb-2">10M+</div>
              <div className="text-base text-muted-foreground font-medium">Calculations processed</div>
              <div className="absolute top-4 right-4 w-12 h-12 bg-climatiq-primary/10 rounded-full flex items-center justify-center">
                <Database className="h-6 w-6 text-climatiq-primary" />
              </div>
            </motion.div>
            
            <motion.div 
              className="relative p-8 bg-gradient-to-br from-climatiq-accent/10 to-transparent border border-climatiq-accent/20 rounded-2xl group hover:shadow-glow-cyan transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="text-5xl font-bold bg-gradient-to-br from-climatiq-accent to-climatiq-primary bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-base text-muted-foreground font-medium">Emission factors</div>
              <div className="absolute top-4 right-4 w-12 h-12 bg-climatiq-accent/10 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-climatiq-accent" />
              </div>
            </motion.div>
            
            <motion.div 
              className="relative p-8 bg-gradient-to-br from-climatiq-secondary/10 to-transparent border border-climatiq-secondary/20 rounded-2xl group hover:shadow-glow-purple transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              <div className="text-5xl font-bold bg-gradient-to-br from-climatiq-secondary to-climatiq-accent bg-clip-text text-transparent mb-2">99.9%</div>
              <div className="text-base text-muted-foreground font-medium">Accuracy rate</div>
              <div className="absolute top-4 right-4 w-12 h-12 bg-climatiq-secondary/10 rounded-full flex items-center justify-center">
                <Calculator className="h-6 w-6 text-climatiq-secondary" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Modern Tab Navigation */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-16 h-14 p-1 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-xl">
              <TabsTrigger value="calculator" className="text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-elevation-medium rounded-lg transition-all duration-300">Calculator</TabsTrigger>
              <TabsTrigger value="api-docs" className="text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-elevation-medium rounded-lg transition-all duration-300">API Docs</TabsTrigger>
              <TabsTrigger value="explorer" className="text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-elevation-medium rounded-lg transition-all duration-300">Explorer</TabsTrigger>
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

      {/* Modern Features Section */}
      <motion.section 
        className="px-6 py-24 border-t border-border/50 bg-gradient-to-b from-transparent via-climatiq-bg-subtle/50 to-transparent relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Built for developers
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Simple, powerful, and ready to integrate into your workflow
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="group relative p-8 bg-card border border-border/50 rounded-2xl hover:border-climatiq-primary/50 transition-all duration-300 hover:shadow-elevation-high"
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-climatiq-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-climatiq-primary/20 to-climatiq-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-climatiq-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-center">Fast & Reliable</h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Sub-second response times with 99.9% uptime guarantee
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="group relative p-8 bg-card border border-border/50 rounded-2xl hover:border-climatiq-accent/50 transition-all duration-300 hover:shadow-elevation-high"
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-climatiq-accent/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-climatiq-accent/20 to-climatiq-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Code className="h-8 w-8 text-climatiq-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-center">RESTful API</h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  Clean, intuitive endpoints with comprehensive documentation
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="group relative p-8 bg-card border border-border/50 rounded-2xl hover:border-climatiq-secondary/50 transition-all duration-300 hover:shadow-elevation-high"
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-climatiq-secondary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-climatiq-secondary/20 to-climatiq-secondary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Database className="h-8 w-8 text-climatiq-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 text-center">Rich Data</h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  500+ emission factors from trusted scientific sources
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Climatiq;