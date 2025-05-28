
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, BarChart3, Target, LineChart, Mail, Instagram, Twitter, Linkedin, BookOpen, Leaf, MapPin, Phone, Globe, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CarbonProjectsSection from "@/components/home/CarbonProjectsSection";
import SubstackSection from "@/components/home/SubstackSection";
import GridBackground from "@/components/home/GridBackground";
import GradientDot from "@/components/home/GradientDot";
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 z-5" />
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
            className="text-xl md:text-2xl text-white/95 mb-6 drop-shadow-lg font-medium"
          >
            Your complete platform for agricultural carbon management, emissions tracking, and sustainability planning
          </motion.h2>
          
          <motion.div 
            variants={fadeInUp} 
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                onClick={() => navigate("/signup")}
                className="shadow-2xl bg-white text-black hover:bg-white/90 font-semibold px-8 py-4 text-lg"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate("/login")}
                className="backdrop-blur-sm bg-white/20 border-white/40 text-white hover:bg-white/30 shadow-xl font-semibold px-8 py-4 text-lg"
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
            className="animate-bounce rounded-full bg-white/30 backdrop-blur-sm shadow-xl text-white hover:bg-white/40 h-12 w-12"
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ArrowDown className="h-6 w-6" />
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
      <section className="relative py-20 px-4 md:px-8 bg-gradient-to-br from-primary via-primary/90 to-primary/80">
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
            className="text-white/90 text-lg mb-8 font-medium"
          >
            Join thousands of agricultural operations already using FarmlyCarbon to manage their environmental impact.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-lg px-8 py-4 text-lg font-semibold"
              onClick={() => navigate("/signup")}
            >
              Start Your Free Trial
            </Button>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Enhanced Contact Footer */}
      <footer className="relative py-16 px-4 md:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <GridBackground gridSize={15} opacity={0.02} color="#fff" />
        <GradientDot x="20%" y="30%" size={400} color="rgba(255, 255, 255, 0.02)" />
        <GradientDot x="80%" y="70%" size={300} color="rgba(0, 200, 0, 0.03)" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <motion.div 
                className="flex items-center mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="relative mr-3">
                  <Leaf className="h-10 w-10 text-primary" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  FarmlyCarbon
                </h2>
              </motion.div>
              <motion.p 
                className="text-gray-300 mb-8 text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Your complete platform for agricultural carbon management, emissions tracking, and sustainability planning. 
                Empowering farmers to build a sustainable future through innovative technology and data-driven insights.
              </motion.p>
              
              {/* Social Media Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className="text-lg font-semibold mb-4 text-white">Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    { href: "https://www.instagram.com/i_kunal_ar26/", icon: Instagram, label: "Instagram" },
                    { href: "https://x.com/i_kunal_ar26", icon: Twitter, label: "Twitter" },
                    { href: "https://www.linkedin.com/in/kunal-rahangdale-572a7215a/", icon: Linkedin, label: "LinkedIn" },
                    { href: "https://idlerwritingeveryday.substack.com", icon: BookOpen, label: "Blog" }
                  ].map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="p-3 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border border-gray-600 group-hover:border-primary/50 transition-all duration-300 shadow-lg group-hover:shadow-primary/20">
                        <social.icon className="h-6 w-6 text-gray-300 group-hover:text-primary transition-colors duration-300" />
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {social.label}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Contact Information */}
            <div>
              <motion.h3 
                className="text-xl font-semibold mb-6 text-white"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Contact Info
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
                <ContactLink 
                  href="mailto:i.kunal.ar26@gmail.com" 
                  icon={<Mail className="h-5 w-5 mr-3 text-primary" />}
                  text="i.kunal.ar26@gmail.com"
                />
                
                <ContactInfo 
                  icon={<MapPin className="h-5 w-5 mr-3 text-primary" />}
                  text="Global Agricultural Solutions"
                />
                
                <ContactInfo 
                  icon={<Globe className="h-5 w-5 mr-3 text-primary" />}
                  text="Available Worldwide"
                />
              </motion.div>
            </div>

            {/* Quick Links */}
            <div>
              <motion.h3 
                className="text-xl font-semibold mb-6 text-white"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Quick Links
              </motion.h3>
              <motion.div 
                className="space-y-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.3
                    }
                  }
                }}
              >
                {[
                  { href: "/dashboard", text: "Dashboard", external: false },
                  { href: "/login", text: "Login", external: false },
                  { href: "/signup", text: "Sign Up", external: false },
                  { href: "https://idlerwritingeveryday.substack.com", text: "Blog", external: true }
                ].map((link) => (
                  <motion.div
                    key={link.text}
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                    }}
                  >
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-300 hover:text-primary transition-colors duration-300 group"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{link.text}</span>
                        <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    ) : (
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-primary transition-colors duration-300 hover:translate-x-1 transform inline-block"
                      >
                        {link.text}
                      </a>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
          
          {/* Footer Bottom */}
          <motion.div 
            className="mt-12 pt-8 border-t border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-center md:text-left">
                &copy; {new Date().getFullYear()} FarmlyCarbon. All rights reserved. Building a sustainable future through technology.
              </p>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors duration-300">Terms of Service</a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, index = 0 }: { icon: React.ReactNode, title: string, description: string, index?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    viewport={{ once: true }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 backdrop-blur-sm relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-90 z-0"></div>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

// How It Works Step Component
const WorksStep = ({ number, title, description, index = 0 }: { number: string, title: string, description: string, index?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    viewport={{ once: true }}
    className="flex flex-col items-center text-center group"
  >
    <motion.div 
      whileHover={{ scale: 1.1, rotateY: 15 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="text-5xl font-bold text-primary/20 mb-4 group-hover:text-primary/40 transition-colors duration-300"
    >
      {number}
    </motion.div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

// Contact Link Component
const ContactLink = ({ href, icon, text }: { href: string, icon: React.ReactNode, text: string }) => (
  <motion.a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="flex items-center text-gray-300 hover:text-primary transition-all duration-300 group"
    variants={{
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    }}
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.98 }}
  >
    {icon}
    <span className="group-hover:underline">{text}</span>
  </motion.a>
);

// Contact Info Component
const ContactInfo = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <motion.div 
    className="flex items-center text-gray-300"
    variants={{
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    }}
  >
    {icon}
    <span>{text}</span>
  </motion.div>
);

export default Index;
