import { Button } from "@/components/ui/button";
import { Leaf, Instagram, Twitter, Linkedin, ArrowRight, Code2, Database, Zap, Sprout, TreeDeciduous, Flower2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HomeHeader from "@/components/home/HomeHeader";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ToolsShowcase } from "@/components/home/ToolsShowcase";
import farmlyApiVideo from "@/assets/farmly-api-video.webm";
import farmHeroBg from "@/assets/farm-hero-bg.jpg";
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
      
      {/* Hero Section with Farm Background */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 md:px-8 py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${farmHeroBg})` }}
        />
        
        {/* Floating Leaf Decorations */}
        <motion.div
          initial={{ opacity: 0, y: -20, rotate: -15 }}
          animate={{ opacity: 0.6, y: 0, rotate: 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-32 left-10 md:left-20 text-green-500/40"
        >
          <Leaf className="w-12 h-12 md:w-16 md:h-16" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20, rotate: 15 }}
          animate={{ opacity: 0.5, y: 0, rotate: -10 }}
          transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-48 right-10 md:right-24 text-green-600/30"
        >
          <Sprout className="w-10 h-10 md:w-14 md:h-14" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, rotate: 10 }}
          animate={{ opacity: 0.4, rotate: -5 }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-40 left-16 md:left-32 text-green-500/30"
        >
          <TreeDeciduous className="w-14 h-14 md:w-20 md:h-20" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2, delay: 0.3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-32 right-20 md:right-40 text-green-400/30"
        >
          <Flower2 className="w-8 h-8 md:w-12 md:h-12" />
        </motion.div>
        
        {/* No overlay - full background visibility */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto space-y-8"
        >
          <motion.div 
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold tracking-wide bg-white/80 text-green-700 shadow-sm">
              Agricultural Carbon Platform
            </span>
            <h1 className="font-playfair text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-gray-900">
              Farmly<span className="text-green-600">Carbon</span>
            </h1>
          </motion.div>
          
          <motion.p 
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed text-gray-700"
          >
            Simple, powerful carbon management for sustainable agriculture
          </motion.p>
          
          <motion.div 
            variants={fadeInUp} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center pt-6"
          >
            <Button 
              size="default" 
              onClick={() => navigate("/signup")}
              className="text-white px-6 py-2.5 text-sm h-auto rounded-full font-semibold transition-all duration-300 border-0"
              style={{
                backgroundImage: 'var(--gradient-cta)',
                boxShadow: 'var(--shadow-md)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundImage = 'var(--gradient-cta-hover)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundImage = 'var(--gradient-cta)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Get Started
            </Button>
            
            <Button 
              variant="outline" 
              size="default" 
              onClick={() => navigate("/login")}
              className="border px-6 py-2.5 text-sm h-auto rounded-full font-semibold transition-all duration-300 bg-white/90"
              style={{
                borderColor: 'hsl(var(--text-primary) / 0.15)',
                color: 'hsl(var(--text-primary))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'hsl(var(--brand-primary))';
                e.currentTarget.style.backgroundColor = 'hsl(var(--bg-subtle))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'hsl(var(--brand-primary) / 0.3)';
                e.currentTarget.style.backgroundColor = 'white';
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
            className="pt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm"
            style={{ color: 'hsl(var(--text-muted))' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--brand-primary))' }}></div>
              <span>1.2M+ tCO₂e tracked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--brand-secondary))' }}></div>
              <span>235+ verified projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'hsl(var(--brand-accent))' }}></div>
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
        {/* Decorative Leaves */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.15 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="absolute top-10 right-10 text-green-500"
        >
          <Leaf className="w-24 h-24 rotate-45" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="absolute bottom-10 left-10 text-green-600"
        >
          <Sprout className="w-20 h-20 -rotate-12" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto relative z-10">
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
                <span className="inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold tracking-wide mb-4" style={{
                  background: 'hsl(var(--badge-secondary-bg))',
                  color: 'hsl(var(--badge-secondary-text))',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  Developer Tools
                </span>
                <h2 className="text-4xl md:text-5xl font-light mb-4" style={{ color: 'hsl(var(--text-primary))' }}>
                  Powerful <span className="font-medium" style={{ color: 'hsl(var(--brand-primary))' }}>Farmly API</span>
                </h2>
                <p className="text-xl leading-relaxed" style={{ color: 'hsl(var(--text-secondary))' }}>
                  Integrate accurate carbon calculations directly into your applications with our RESTful API
                </p>
              </motion.div>

              {/* Minimal Icon Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center gap-8 py-6"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-700">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-800">Fast</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-700">
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-800">RESTful</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-700">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-800">Rich Data</span>
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
                className="text-white px-8 py-4 text-lg h-auto rounded-full font-semibold transition-all duration-300 border-0 group"
                style={{
                  backgroundImage: 'var(--gradient-dark)',
                  boxShadow: 'var(--shadow-md)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
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
              <div className="relative rounded-2xl overflow-hidden transition-all duration-500" style={{
                boxShadow: 'var(--shadow-lg)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <video 
                  src={farmlyApiVideo} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
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
            <p className="text-sm font-medium mb-8 uppercase tracking-wide" style={{ color: 'hsl(var(--text-muted))' }}>
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


      {/* Climate Standards Section */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden">
        {/* Decorative Corner Leaves */}
        <div className="absolute top-8 right-8 text-green-200/30">
          <Leaf className="w-16 h-16 rotate-45" />
        </div>
        <div className="absolute bottom-8 left-8 text-green-300/20">
          <Flower2 className="w-12 h-12 -rotate-12" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-light leading-tight" style={{ color: 'hsl(var(--text-primary))' }}>
                Invest in carbon credits backed by{" "}
                <span className="font-medium" style={{ color: 'hsl(var(--brand-primary))' }}>
                  science, not intuition
                </span>
              </h2>
              <p className="text-xl leading-relaxed" style={{ color: 'hsl(var(--text-secondary))' }}>
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
                 className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--bg-subtle))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={ipccLogo} 
                    alt="IPCC 1.5°C aligned" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center" style={{ color: 'hsl(var(--brand-primary))' }}>
                  IPCC 1.5°C
                </span>
              </motion.div>

              {/* SBTi */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                 className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--bg-subtle))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={sbtiLogo} 
                    alt="SBTi Net Zero" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center" style={{ color: 'hsl(var(--text-secondary))' }}>
                  SBTi Net Zero
                </span>
              </motion.div>

              {/* Oxford */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                 className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--bg-subtle))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={oxfordLogo} 
                    alt="Oxford Principles" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center" style={{ color: 'hsl(var(--text-secondary))' }}>
                  Oxford Principles
                </span>
              </motion.div>

              {/* Carbon Integrity */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                 className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--bg-subtle))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={carbonIntegrityLogo} 
                    alt="Carbon Integrity" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center" style={{ color: 'hsl(var(--brand-accent))' }}>
                  Carbon Integrity
                </span>
              </motion.div>

              {/* WWF */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                 className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--bg-subtle))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={wwfLogo} 
                    alt="WWF" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center" style={{ color: 'hsl(var(--text-secondary))' }}>
                  WWF
                </span>
              </motion.div>

              {/* Gold Standard */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                 className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all duration-300"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--bg-subtle))'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="w-20 h-20 flex items-center justify-center">
                  <img 
                    src={goldStandardLogo} 
                    alt="Gold Standard" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-center" style={{ color: 'hsl(var(--brand-secondary))' }}>
                  Gold Standard
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calendar Booking Section */}
      <section className="relative py-24 overflow-hidden" style={{
        background: 'hsl(var(--bg-subtle))'
      }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--glow-primary) / 0.12) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(var(--glow-secondary) / 0.12) 0%, transparent 50%)'
        }} />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{
              color: 'hsl(var(--brand-primary))'
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
              backgroundImage: 'linear-gradient(135deg, hsl(var(--glow-primary) / 0.08) 0%, hsl(var(--glow-secondary) / 0.08) 100%)'
            }} />
            <div className="relative bg-card/60 backdrop-blur-sm p-4 rounded-2xl border shadow-2xl" style={{
              borderColor: 'hsl(var(--brand-primary) / 0.15)',
              boxShadow: 'var(--shadow-lg)'
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
        backgroundImage: 'linear-gradient(135deg, hsl(var(--brand-primary)) 0%, hsl(var(--brand-primary-light)) 100%)'
      }}>
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        
        {/* Floating Leaf Accents */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 0.2, y: 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          viewport={{ once: true }}
          className="absolute top-16 left-16 text-white/20"
        >
          <Leaf className="w-16 h-16 rotate-12" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 0.15, y: 0 }}
          transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
          viewport={{ once: true }}
          className="absolute bottom-16 right-16 text-white/15"
        >
          <TreeDeciduous className="w-20 h-20 -rotate-12" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          transition={{ duration: 2, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          viewport={{ once: true }}
          className="absolute top-1/2 right-32 text-white/10"
        >
          <Sprout className="w-12 h-12" />
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, hsl(var(--brand-accent)) 0%, transparent 70%)'
          }}
        />
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.08 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="absolute bottom-20 left-20 w-80 h-80 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, hsl(var(--brand-secondary)) 0%, transparent 70%)'
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
            <span className="font-semibold text-white"> carbon footprint?</span>
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
                className="px-10 py-6 text-lg h-auto rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 group"
                onClick={() => navigate("/signup")}
                style={{
                  backgroundColor: 'white',
                  color: 'hsl(var(--brand-primary))',
                  boxShadow: '0 8px 30px -8px rgba(255, 255, 255, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'hsl(var(--bg-subtle))';
                  e.currentTarget.style.boxShadow = '0 12px 40px -8px rgba(255, 255, 255, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.boxShadow = '0 8px 30px -8px rgba(255, 255, 255, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
      <footer className="py-16 px-4 md:px-8 text-white relative overflow-hidden bg-green-900">
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
            <div className="flex items-center mb-6">
                <Leaf className="h-8 w-8 mr-3" style={{ color: 'hsl(var(--brand-accent))' }} />
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
                    backgroundColor: 'hsl(var(--brand-primary))',
                    boxShadow: '0 4px 14px 0 hsl(var(--glow-primary) / 0.25)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--brand-primary-dark))';
                    e.currentTarget.style.boxShadow = '0 6px 20px 0 hsl(var(--glow-primary) / 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--brand-primary))';
                    e.currentTarget.style.boxShadow = '0 4px 14px 0 hsl(var(--glow-primary) / 0.25)';
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
                <a href="/dashboard" className="block text-gray-400 hover:text-[hsl(var(--brand-accent))] transition-colors">Dashboard</a>
                <a href="/carbon-impact" className="block text-gray-400 hover:text-[hsl(var(--brand-accent))] transition-colors">Carbon Impact</a>
                <a href="/net-zero-planner" className="block text-gray-400 hover:text-[hsl(var(--brand-accent))] transition-colors">Net Zero Planner</a>
                <a href="/supply-chain" className="block text-gray-400 hover:text-[hsl(var(--brand-accent))] transition-colors">Supply Chain</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
              <div className="space-y-4">
                <a href="https://idlerwritingeveryday.substack.com" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-[hsl(var(--brand-accent))] transition-colors">
                  Blog
                </a>
                <a href="/login" className="block text-gray-400 hover:text-[hsl(var(--brand-accent))] transition-colors">Login</a>
                <a href="/signup" className="block text-gray-400 hover:text-[hsl(var(--brand-accent))] transition-colors">Sign Up</a>
              </div>
              
              <div className="mt-8">
                <h4 className="text-sm font-semibold mb-4 text-white">Connect With Us</h4>
                <div className="flex space-x-4">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-green-500/25 transition-all cursor-pointer">
                      <Instagram className="h-5 w-5" />
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-green-500/25 transition-all cursor-pointer">
                      <Twitter className="h-5 w-5" />
                    </div>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-green-600/25 transition-all cursor-pointer">
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
          
          <div className="border-t border-green-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2024 FarmlyCarbon. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-[hsl(var(--brand-accent))] text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-[hsl(var(--brand-accent))] text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-[hsl(var(--brand-accent))] text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
