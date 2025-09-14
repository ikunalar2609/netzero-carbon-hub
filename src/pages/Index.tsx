import { Button } from "@/components/ui/button";
import { BarChart3, Target, LineChart, Leaf, Instagram, Twitter, Linkedin, ArrowRight, CheckCircle, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HomeHeader from "@/components/home/HomeHeader";
import SubstackSection from "@/components/home/SubstackSection";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />
      
      {/* Minimalist Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 py-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div 
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
              Agricultural Carbon Platform
            </span>
            <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 tracking-tight">
              Farmly<span className="text-green-600">Carbon</span>
            </h1>
          </motion.div>
          
          <motion.p 
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Simple, powerful carbon management for sustainable agriculture
          </motion.p>
          
          <motion.div 
            variants={fadeInUp} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Button 
              size="lg" 
              onClick={() => navigate("/signup")}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg h-auto rounded-full"
            >
              Get Started
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/login")}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg h-auto rounded-full"
            >
              Sign In
            </Button>
          </motion.div>

          {/* Minimalist Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>1.2M+ tCO₂e tracked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>235+ verified projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Net‑zero planning</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Modern Features Section */}
      <section className="py-24 px-4 md:px-8 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 to-white"></div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
              Everything you need to
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-medium"> succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive carbon management platform designed for modern agriculture operations
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Track Emissions</h3>
                <p className="text-gray-600 leading-relaxed text-center">Monitor your farm's carbon footprint with real-time data analytics and actionable insights for immediate impact.</p>
                <div className="mt-6 flex justify-center">
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Real-time monitoring</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Plan Reductions</h3>
                <p className="text-gray-600 leading-relaxed text-center">Create science-based, actionable strategies to reach your net-zero goals with our intelligent planning tools.</p>
                <div className="mt-6 flex justify-center">
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">AI-powered insights</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <LineChart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Measure Progress</h3>
                <p className="text-gray-600 leading-relaxed text-center">Track improvements and maintain compliance with global sustainability standards and reporting frameworks.</p>
                <div className="mt-6 flex justify-center">
                  <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">Compliance ready</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Blog Section */}
      <SubstackSection />

      {/* Modern CTA Section */}
      <section className="py-24 px-4 md:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-3xl"
        />
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-light text-white mb-6"
          >
            Ready to transform your 
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-medium"> carbon footprint?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join leading agricultural operations worldwide who trust FarmlyCarbon 
            to drive their sustainability initiatives and unlock new revenue streams
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-10 py-4 text-lg h-auto rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 group border-0"
                onClick={() => navigate("/signup")}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-10 py-4 text-lg h-auto rounded-full backdrop-blur-sm transition-all duration-300"
                onClick={() => window.open('https://calendly.com/your-link', '_blank')}
              >
                Book a Demo
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-400 mb-4">Trusted by industry leaders</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-white font-medium">Enterprise Ready</div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="text-white font-medium">SOC 2 Compliant</div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="text-white font-medium">99.9% Uptime</div>
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Modern Footer */}
      <footer className="py-16 px-4 md:px-8 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-gray-950"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <Leaf className="h-8 w-8 text-green-400 mr-3" />
                <span className="text-2xl font-semibold">FarmlyCarbon</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
                Empowering agricultural operations worldwide with comprehensive carbon management tools for a sustainable and profitable future.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full px-6 py-3 border-0"
                  onClick={() => navigate("/signup")}
                >
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Platform</h3>
              <div className="space-y-4">
                <a href="/dashboard" className="block text-gray-400 hover:text-green-400 transition-colors">Dashboard</a>
                <a href="/carbon-impact" className="block text-gray-400 hover:text-green-400 transition-colors">Carbon Impact</a>
                <a href="/net-zero-planner" className="block text-gray-400 hover:text-green-400 transition-colors">Net Zero Planner</a>
                <a href="/supply-chain" className="block text-gray-400 hover:text-green-400 transition-colors">Supply Chain</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
              <div className="space-y-4">
                <a href="https://idlerwritingeveryday.substack.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-green-400 transition-colors">
                  Blog
                </a>
                <a href="/login" className="block text-gray-400 hover:text-green-400 transition-colors">Login</a>
                <a href="/signup" className="block text-gray-400 hover:text-green-400 transition-colors">Sign Up</a>
              </div>
              
              <div className="mt-8">
                <h4 className="text-sm font-semibold mb-4 text-white">Connect With Us</h4>
                <div className="flex space-x-4">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-pink-500/25 transition-all cursor-pointer">
                      <Instagram className="h-5 w-5" />
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/25 transition-all cursor-pointer">
                      <Twitter className="h-5 w-5" />
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-blue-600/25 transition-all cursor-pointer">
                      <Linkedin className="h-5 w-5" />
                    </div>
                  </motion.div>
                </div>
                <div className="mt-6">
                  <p className="text-gray-500 text-sm">i.kunal.ar26@gmail.com</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2024 FarmlyCarbon. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;