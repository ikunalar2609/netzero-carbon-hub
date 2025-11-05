import { Button } from "@/components/ui/button";
import { Leaf, Instagram, Twitter, Linkedin, ArrowRight, Code2, Database, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HomeHeader from "@/components/home/HomeHeader";
import SubstackSection from "@/components/home/SubstackSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ToolsShowcase } from "@/components/home/ToolsShowcase";
import farmlyApiIllustration from "@/assets/farmly-api-illustration.png";
import nasaLogo from "@/assets/logos/nasa-logo.svg";
import ipccLogo from "@/assets/logos/ipcc-logo.png";
import noaaLogo from "@/assets/logos/noaa-logo.png";
import sbtiLogo from "@/assets/logos/sbti-logo.png";
import oxfordLogo from "@/assets/logos/oxford-logo.png";
import carbonIntegrityLogo from "@/assets/logos/carbon-integrity-logo.png";
import wwfLogo from "@/assets/logos/wwf-logo.png";
import goldStandardLogo from "@/assets/logos/gold-standard-logo.png";

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
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 py-20" style={{
        background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--color-bg-subtle)) 50%, hsl(var(--background)) 100%)'
      }}>
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
            <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold tracking-wide shadow-sm" style={{
              backgroundImage: 'var(--gradient-badge)',
              color: 'hsl(var(--color-badge-success-text))'
            }}>
              Agricultural Carbon Platform
            </span>
            <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl font-light text-gray-900 tracking-tight">
              Farmly<span className="bg-clip-text text-transparent" style={{
                backgroundImage: 'var(--gradient-hero-text)'
              }}>Carbon</span>
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
              className="text-white px-10 py-6 text-lg h-auto rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              style={{
                backgroundImage: 'var(--gradient-cta)',
                boxShadow: 'var(--shadow-glow-green)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundImage = 'var(--gradient-cta-hover)';
                e.currentTarget.style.boxShadow = '0 12px 50px -10px hsl(var(--glow-primary) / 0.65)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundImage = 'var(--gradient-cta)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow-green)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get Started
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/login")}
              className="border-2 text-gray-700 hover:bg-gray-50 px-10 py-6 text-lg h-auto rounded-full font-semibold transition-all duration-300"
              style={{
                borderColor: 'hsl(var(--brand-green) / 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'hsl(var(--brand-green) / 0.6)';
                e.currentTarget.style.backgroundColor = 'hsl(var(--brand-green) / 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'hsl(var(--brand-green) / 0.3)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
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
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--brand-green))' }}></div>
              <span>1.2M+ tCO₂e tracked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--brand-emerald))' }}></div>
              <span>235+ verified projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--brand-teal))' }}></div>
              <span>Net‑zero planning</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Modern Features Section */}
      <FeaturesSection />

      {/* Tools Showcase - Dashboard & API */}
      <ToolsShowcase />

      {/* Farmly API Section */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden" style={{
        background: 'var(--gradient-subtle)'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold tracking-wide mb-4 shadow-sm" style={{
                  backgroundImage: 'var(--gradient-badge)',
                  color: 'hsl(var(--color-badge-success-text))'
                }}>
                  Developer Tools
                </span>
                <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                  Powerful <span className="font-medium" style={{ color: 'hsl(var(--brand-green))' }}>Farmly API</span>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Integrate accurate carbon calculations directly into your applications with our RESTful API
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{
                    backgroundColor: 'hsl(var(--color-badge-success))'
                  }}>
                    <Code2 className="h-6 w-6" style={{ color: 'hsl(var(--brand-green))' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Easy Integration</h3>
                    <p className="text-gray-600">Simple REST endpoints with comprehensive documentation for quick implementation</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{
                    backgroundColor: 'hsl(var(--color-badge-info))'
                  }}>
                    <Database className="h-6 w-6" style={{ color: 'hsl(var(--brand-emerald))' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Rich Climate Data</h3>
                    <p className="text-gray-600">Access verified data from leading scientific organizations worldwide</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center" style={{
                    backgroundColor: 'hsl(var(--color-badge-accent))'
                  }}>
                    <Zap className="h-6 w-6" style={{ color: 'hsl(var(--brand-teal))' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Fast & Reliable</h3>
                    <p className="text-gray-600">99.9% uptime with lightning-fast response times for production workloads</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
              <Button 
                size="lg" 
                onClick={() => navigate("/farmly")}
                className="text-white px-8 py-4 text-lg h-auto rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 group"
                style={{
                  backgroundImage: 'linear-gradient(135deg, hsl(220 26% 14%) 0%, hsl(142 45% 12%) 100%)',
                  boxShadow: '0 8px 24px -8px hsl(220 26% 8% / 0.5)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 32px -8px hsl(220 26% 8% / 0.7)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px -8px hsl(220 26% 8% / 0.5)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Explore API Documentation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              </motion.div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500" style={{
                boxShadow: 'var(--shadow-elevation-high)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-elevation-high)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <img 
                  src={farmlyApiIllustration} 
                  alt="Farmly API integration visualization showing connected farm data and analytics" 
                  className="w-full h-auto"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full blur-3xl" style={{
                background: 'radial-gradient(circle, hsl(var(--glow-primary) / 0.5) 0%, transparent 70%)'
              }}></div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 rounded-full blur-3xl" style={{
                background: 'radial-gradient(circle, hsl(var(--glow-emerald) / 0.45) 0%, transparent 70%)'
              }}></div>
            </motion.div>
          </div>

          {/* Sources Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <p className="text-sm font-medium text-gray-500 mb-8 uppercase tracking-wide">
              Data Powered By
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img 
                  src={nasaLogo} 
                  alt="NASA - National Aeronautics and Space Administration" 
                  className="h-16 w-auto object-contain"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img 
                  src={ipccLogo} 
                  alt="IPCC - Intergovernmental Panel on Climate Change" 
                  className="h-16 w-auto object-contain"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img 
                  src={noaaLogo} 
                  alt="NOAA - National Oceanic and Atmospheric Administration" 
                  className="h-16 w-auto object-contain"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Section */}
      <SubstackSection />

      {/* Climate Standards Section */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                Invest in carbon credits backed by{" "}
                <span className="font-medium" style={{ color: 'hsl(var(--brand-green))' }}>
                  science, not intuition
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Base your climate strategy on credible science, not guesswork. Align your carbon offsetting with robust standards that fit your company's unique goals, budget, and marketing needs.
              </p>
            </motion.div>

            {/* Right: Logo Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-8"
            >
              {/* IPCC */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:bg-gray-50"
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={ipccLogo} 
                    alt="IPCC 1.5°C aligned" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center" style={{ color: 'hsl(var(--brand-emerald))' }}>
                  IPCC 1.5°C
                </span>
              </motion.div>

              {/* SBTi */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:bg-gray-50"
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={sbtiLogo} 
                    alt="SBTi Net Zero" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center text-gray-700">
                  SBTi Net Zero
                </span>
              </motion.div>

              {/* Oxford */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:bg-gray-50"
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={oxfordLogo} 
                    alt="Oxford Principles" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center text-gray-700">
                  Oxford Principles
                </span>
              </motion.div>

              {/* Carbon Integrity */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:bg-gray-50"
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={carbonIntegrityLogo} 
                    alt="Carbon Integrity" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center" style={{ color: 'hsl(45 93% 47%)' }}>
                  Carbon Integrity
                </span>
              </motion.div>

              {/* WWF */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:bg-gray-50"
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={wwfLogo} 
                    alt="WWF" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center text-gray-700">
                  WWF
                </span>
              </motion.div>

              {/* Gold Standard */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:bg-gray-50"
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={goldStandardLogo} 
                    alt="Gold Standard" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center text-gray-700">
                  Gold Standard
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calendar Booking Section */}
      <section className="relative py-24 overflow-hidden" style={{
        background: 'var(--gradient-subtle)'
      }}>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--glow-primary) / 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(var(--glow-emerald) / 0.15) 0%, transparent 50%)'
        }} />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent" style={{
              backgroundImage: 'var(--gradient-hero-text)'
            }}>
              Let's Connect
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
              Got something exciting in mind? Whether it's about ideas, collaborations, or just a good conversation — I'd love to connect.
            </p>
            <p className="text-base text-muted-foreground">
              Pick a time that works best for you below — it's quick, easy, and right here on the page.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 blur-3xl rounded-3xl" style={{
              backgroundImage: 'linear-gradient(135deg, hsl(var(--glow-primary) / 0.12) 0%, hsl(var(--glow-emerald) / 0.12) 100%)'
            }} />
            <div className="relative bg-card/60 backdrop-blur-sm p-4 rounded-2xl border shadow-2xl" style={{
              borderColor: 'hsl(var(--brand-green) / 0.15)',
              boxShadow: 'var(--shadow-elevation-high)'
            }}>
              <iframe 
                src="https://cal.com/kunal-rahangdale-8dbab0/30min?overlayCalendar=true" 
                width="100%" 
                height="700" 
                style={{ border: 'none', borderRadius: '16px' }}
                allow="fullscreen"
                title="Schedule a meeting"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden" style={{
        background: 'var(--gradient-dark)'
      }}>
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, hsl(var(--glow-primary)) 0%, hsl(var(--glow-emerald)) 100%)'
          }}
        />
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, hsl(var(--glow-emerald)) 0%, hsl(var(--glow-teal)) 100%)'
          }}
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
            className="text-4xl md:text-6xl font-light text-white mb-6 leading-tight"
          >
            Ready to transform your 
            <span className="bg-clip-text text-transparent font-semibold" style={{
              backgroundImage: 'linear-gradient(135deg, hsl(var(--brand-green-light)) 0%, hsl(var(--brand-teal) / 1.1) 100%)'
            }}> carbon footprint?</span>
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
                className="text-white px-10 py-6 text-lg h-auto rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 group"
                onClick={() => navigate("/signup")}
                style={{
                  backgroundImage: 'linear-gradient(135deg, hsl(var(--brand-green-light)) 0%, hsl(var(--brand-teal) / 1.1) 100%)',
                  boxShadow: '0 8px 30px -8px hsl(var(--brand-green-light) / 0.5)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 40px -8px hsl(var(--brand-green-light) / 0.7)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 30px -8px hsl(var(--brand-green-light) / 0.5)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
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
                <Leaf className="h-8 w-8 mr-3" style={{ color: 'hsl(var(--brand-green-light))' }} />
                <span className="text-2xl font-semibold">FarmlyCarbon</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
                Empowering agricultural operations worldwide with comprehensive carbon management tools for a sustainable and profitable future.
              </p>
               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  className="text-white rounded-full px-6 py-3 border-0 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate("/signup")}
                  style={{
                    backgroundImage: 'var(--gradient-primary)',
                    boxShadow: '0 4px 14px 0 hsl(var(--glow-primary) / 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-glow-green)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 14px 0 hsl(var(--glow-primary) / 0.3)';
                  }}
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
