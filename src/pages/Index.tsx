import { Button } from "@/components/ui/button";
import { BarChart3, Target, LineChart, Leaf, Instagram, Twitter, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HomeHeader from "@/components/home/HomeHeader";

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

      {/* Minimalist Features Section */}
      <section className="py-32 px-4 md:px-8 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive carbon management made simple
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Track Emissions</h3>
              <p className="text-gray-600 leading-relaxed">Monitor your farm's carbon footprint with real-time data and insights.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Plan Reductions</h3>
              <p className="text-gray-600 leading-relaxed">Create actionable strategies to reach your net-zero goals.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <LineChart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Measure Progress</h3>
              <p className="text-gray-600 leading-relaxed">Track improvements and stay compliant with sustainability standards.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Minimalist CTA Section */}
      <section className="py-32 px-4 md:px-8 bg-white">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-light text-gray-900 mb-6"
          >
            Ready to get started?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Join sustainable agriculture operations already using FarmlyCarbon
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg h-auto rounded-full"
              onClick={() => navigate("/signup")}
            >
              Start Free Trial
            </Button>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Minimalist Footer */}
      <footer className="py-20 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <Leaf className="h-6 w-6 text-green-400 mr-2" />
                <span className="text-xl font-medium">FarmlyCarbon</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Empowering agricultural operations with comprehensive carbon management tools for a sustainable future.
              </p>
              <Button
                variant="outline"
                className="border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900 rounded-full"
                onClick={() => navigate("/signup")}
              >
                Get Started Today
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-6">Quick Links</h3>
              <div className="space-y-3">
                <a href="/dashboard" className="block text-gray-400 hover:text-white transition-colors">Dashboard</a>
                <a href="https://idlerwritingeveryday.substack.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white transition-colors">
                  Blog
                </a>
                <a href="/login" className="block text-gray-400 hover:text-white transition-colors">Login / Signup</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-6">Connect</h3>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                  <Instagram className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                  <Twitter className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <Linkedin className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-6">
                <p className="text-gray-400 text-sm">i.kunal.ar26@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;