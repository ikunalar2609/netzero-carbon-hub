
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, BarChart3, Target, LineChart, Mail, Instagram, Twitter, Linkedin, BookOpen, Leaf, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CarbonProjectsSection from "@/components/home/CarbonProjectsSection";
import SubstackSection from "@/components/home/SubstackSection";
import GridBackground from "@/components/home/GridBackground";
import GradientDot from "@/components/home/GradientDot";
import HomeHeader from "@/components/home/HomeHeader";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="min-h-screen relative overflow-hidden">
      <HomeHeader />
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 md:px-8">
        <GridBackground 
          gridSize={30} 
          opacity={0.05} 
          backgroundImage="/lovable-uploads/dd603b0b-7384-4900-9033-40bfe0763533.png" 
        />
        {/* Enhanced dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-5" />
        <GradientDot x="10%" y="30%" size={400} color="rgba(0, 200, 0, 0.03)" opacity={0.7} />
        <GradientDot x="80%" y="60%" size={300} color="rgba(255, 255, 255, 0.05)" opacity={0.5} />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl relative z-10 mt-16"
        >
          <motion.div 
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl">FarmlyCarbon</h1>
            </div>
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-6 drop-shadow-lg"
          >
            Your complete platform for agricultural carbon management, emissions tracking, and sustainability planning
          </motion.h2>
          
          <motion.div 
            variants={fadeInUp} 
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/signup")}
                className="shadow-2xl bg-white text-black hover:bg-white/90 font-semibold"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate("/login")}
                className="backdrop-blur-sm bg-white/20 border-white/40 text-white hover:bg-white/30 shadow-xl font-semibold"
              >
                Log In
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8"
        >
          <Button 
            variant="ghost" 
            size="icon"
            className="animate-bounce rounded-full bg-white/30 backdrop-blur-sm shadow-xl text-white hover:bg-white/40"
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ArrowDown />
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 md:px-8 bg-gray-50/80 backdrop-blur-sm">
        <GridBackground gridSize={25} opacity={0.03} />
        <GradientDot x="85%" y="20%" size={250} color="rgba(0, 200, 0, 0.02)" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            Comprehensive Carbon Management
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8" />}
              title="Real-time Dashboard"
              description="Monitor your farm's carbon footprint with intuitive visualizations and actionable insights."
              index={0}
            />
            <FeatureCard 
              icon={<LineChart className="h-8 w-8" />}
              title="Emissions Tracking"
              description="Track scope 1, 2, and 3 emissions across all farm operations with precision and accuracy."
              index={1}
            />
            <FeatureCard 
              icon={<Target className="h-8 w-8" />}
              title="Net Zero Planning"
              description="Create and manage your path to net zero emissions with customizable reduction projects."
              index={2}
            />
          </div>
        </motion.div>
      </section>

      {/* Substack Blog Section */}
      <SubstackSection />

      {/* Carbon Projects Section */}
      <CarbonProjectsSection />

      {/* How It Works Section */}
      <section className="relative py-20 px-4 md:px-8">
        <GridBackground gridSize={35} opacity={0.04} />
        <GradientDot x="15%" y="70%" size={280} color="rgba(0, 200, 0, 0.025)" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
          >
            How It Works
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <WorksStep 
              number="01"
              title="Measure Your Emissions"
              description="Import or input your farm's data to establish a comprehensive baseline of carbon emissions."
              index={0}
            />
            <WorksStep 
              number="02"
              title="Create Reduction Plans"
              description="Develop actionable strategies to reduce emissions based on your specific operation and goals."
              index={1}
            />
            <WorksStep 
              number="03"
              title="Track Your Progress"
              description="Monitor improvements over time and stay compliant with relevant sustainability standards."
              index={2}
            />
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-br from-green-600 via-blue-600 to-purple-700">
        <GridBackground gridSize={20} opacity={0.05} color="#fff" />
        <GradientDot x="75%" y="50%" size={300} color="rgba(255, 255, 255, 0.05)" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Ready to Start Your Sustainability Journey?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-white/80 text-lg mb-8"
          >
            Join thousands of agricultural operations already using FarmlyCarbon to manage their environmental impact.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-gray-800 hover:bg-white/90 shadow-2xl text-lg px-8 py-4 h-auto"
              onClick={() => navigate("/signup")}
            >
              Start Your Free Trial
            </Button>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Enhanced Contact Footer */}
      <footer className="relative py-20 px-4 md:px-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
        <GridBackground gridSize={15} opacity={0.03} color="#fff" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <GradientDot x="20%" y="30%" size={400} color="rgba(0, 200, 0, 0.02)" />
        <GradientDot x="80%" y="70%" size={300} color="rgba(59, 130, 246, 0.02)" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Enhanced Brand Section */}
            <div className="space-y-6">
              <motion.div 
                className="flex items-center mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="mr-3 p-2 rounded-full bg-gradient-to-br from-green-400/20 to-blue-400/20 backdrop-blur-sm"
                >
                  <Leaf className="h-8 w-8 text-green-400" />
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">FarmlyCarbon</h2>
              </motion.div>
              <motion.p 
                className="text-gray-300 leading-relaxed text-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Empowering agricultural operations with comprehensive carbon management tools for a sustainable future. Join the movement towards net-zero emissions.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Button
                  variant="outline"
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-gray-900 transition-all duration-300 bg-transparent backdrop-blur-sm"
                  onClick={() => navigate("/signup")}
                >
                  Get Started Today
                </Button>
              </motion.div>
            </div>
            
            {/* Enhanced Quick Links */}
            <div className="space-y-6">
              <motion.h3 
                className="text-xl font-bold text-white mb-6 relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Quick Links
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-blue-400"></div>
              </motion.h3>
              <motion.div 
                className="space-y-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                <QuickLink 
                  href="/dashboard" 
                  icon={<BarChart3 className="h-5 w-5 mr-3 text-white" />}
                  text="Dashboard"
                />
                <QuickLink 
                  href="https://idlerwritingeveryday.substack.com" 
                  icon={<BookOpen className="h-5 w-5 mr-3 text-white" />}
                  text="Blog"
                  external
                />
                <QuickLink 
                  href="/login" 
                  icon={<Leaf className="h-5 w-5 mr-3 text-white" />}
                  text="Login / Signup"
                />
              </motion.div>
            </div>
            
            {/* Enhanced Connect Section with Improved Social Media */}
            <div className="space-y-6">
              <motion.h3 
                className="text-xl font-bold text-white mb-6 relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Connect With Us
                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-400 to-blue-400"></div>
              </motion.h3>
              
              <TooltipProvider>
                <motion.div 
                  className="space-y-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  <EnhancedContactLink 
                    href="mailto:i.kunal.ar26@gmail.com" 
                    icon={<Mail className="h-5 w-5" />}
                    text="i.kunal.ar26@gmail.com"
                    tooltip="Send us an email"
                  />
                </motion.div>
                
                <div className="pt-6">
                  <motion.p 
                    className="text-sm font-medium text-gray-300 mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    Follow us on social media
                  </motion.p>
                  <motion.div 
                    className="flex space-x-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    <EnhancedSocialIcon 
                      href="https://www.instagram.com/i_kunal_ar26/" 
                      icon={<Instagram className="h-6 w-6" />}
                      label="Instagram"
                      bgColor="from-purple-600 via-pink-600 to-orange-600"
                    />
                    <EnhancedSocialIcon 
                      href="https://x.com/i_kunal_ar26" 
                      icon={<Twitter className="h-6 w-6" />}
                      label="Twitter"
                      bgColor="from-blue-500 to-blue-600"
                    />
                    <EnhancedSocialIcon 
                      href="https://www.linkedin.com/in/kunal-rahangdale-572a7215a/" 
                      icon={<Linkedin className="h-6 w-6" />}
                      label="LinkedIn"
                      bgColor="from-blue-700 to-blue-800"
                    />
                  </motion.div>
                </div>
              </TooltipProvider>
            </div>
          </div>
          
          <motion.div 
            className="mt-16 pt-8 border-t border-gray-700/50 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} FarmlyCarbon. All rights reserved.</p>
            <p className="text-gray-500 text-xs mt-2 md:mt-0">Building a sustainable future, one farm at a time.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

// Enhanced Feature Card Component
const FeatureCard = ({ icon, title, description, index = 0 }: { icon: React.ReactNode, title: string, description: string, index?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-90 z-0"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
    <div className="relative z-10">
      <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

// Enhanced How It Works Step Component
const WorksStep = ({ number, title, description, index = 0 }: { number: string, title: string, description: string, index?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    viewport={{ once: true }}
    className="flex flex-col items-center text-center group"
  >
    <motion.div 
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4 group-hover:from-green-500 group-hover:to-blue-500 transition-all duration-300"
    >
      {number}
    </motion.div>
    <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

// Enhanced Contact Link Component
const EnhancedContactLink = ({ href, icon, text, tooltip }: { href: string, icon: React.ReactNode, text: string, tooltip: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <motion.a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center text-white hover:text-green-400 transition-all duration-300 group"
        variants={{
          hidden: { opacity: 0, x: -10 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
        }}
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="mr-3 p-3 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm group-hover:from-green-500/20 group-hover:to-blue-500/20 transition-all duration-300 border border-gray-700/50 group-hover:border-green-400/30">
          <div className="text-white group-hover:text-green-400 transition-colors duration-300">
            {icon}
          </div>
        </div>
        <span className="font-medium text-white">{text}</span>
        <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 text-white" />
      </motion.a>
    </TooltipTrigger>
    <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

// Enhanced Quick Link Component
const QuickLink = ({ href, icon, text, external = false }: { href: string, icon: React.ReactNode, text: string, external?: boolean }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    }}
    whileHover={{ x: 5 }}
  >
    {external ? (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center text-white hover:text-green-400 transition-all duration-300 group py-2"
      >
        <div className="p-2 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-700/50 mr-3 group-hover:from-green-500/20 group-hover:to-blue-500/20 transition-all duration-300">
          <div className="text-white group-hover:text-green-400 transition-colors duration-300">
            {icon}
          </div>
        </div>
        <span className="font-medium text-white">{text}</span>
        <ExternalLink className="h-4 w-4 ml-auto opacity-80 group-hover:opacity-100 transition-opacity text-white" />
      </a>
    ) : (
      <a 
        href={href} 
        className="flex items-center text-white hover:text-green-400 transition-all duration-300 group py-2"
      >
        <div className="p-2 rounded-lg bg-gradient-to-br from-gray-800/50 to-gray-700/50 mr-3 group-hover:from-green-500/20 group-hover:to-blue-500/20 transition-all duration-300">
          <div className="text-white group-hover:text-green-400 transition-colors duration-300">
            {icon}
          </div>
        </div>
        <span className="font-medium text-white">{text}</span>
      </a>
    )}
  </motion.div>
);

// Enhanced Social Icon Component
const EnhancedSocialIcon = ({ href, icon, label, bgColor }: { href: string, icon: React.ReactNode, label: string, bgColor: string }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative p-4 rounded-full bg-gradient-to-br ${bgColor} text-white shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden`}
        variants={{
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
        }}
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative z-10 group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
      </motion.a>
    </TooltipTrigger>
    <TooltipContent side="top" className="bg-gray-800 text-white border-gray-700">
      <p>Follow us on {label}</p>
    </TooltipContent>
  </Tooltip>
);

export default Index;
