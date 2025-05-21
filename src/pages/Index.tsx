
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, BarChart3, Target, LineChart, Mail, Instagram, Twitter, Linkedin, BookOpen, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CarbonProjectsSection from "@/components/home/CarbonProjectsSection";
import SubstackSection from "@/components/home/SubstackSection";
import GridBackground from "@/components/home/GridBackground";
import GradientDot from "@/components/home/GradientDot";

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
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 md:px-8">
        <GridBackground gridSize={30} opacity={0.05} />
        <GradientDot x="10%" y="30%" size={400} color="rgba(0, 200, 0, 0.03)" />
        <GradientDot x="80%" y="60%" size={300} color="rgba(0, 0, 0, 0.025)" />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl relative z-10"
        >
          <motion.div 
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/lovable-uploads/2dd40c72-8b51-4483-b562-5b4b5bb78f7c.png" 
                alt="FarmlyCarbon Logo" 
                className="h-16 w-auto mr-2" 
              />
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">FarmlyCarbon</h1>
            </div>
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground mb-6"
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
                className="shadow-md"
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
                className="backdrop-blur-sm bg-white/50 border-gray-300"
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
            className="animate-bounce rounded-full bg-white/50 backdrop-blur-sm shadow-sm"
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
      <section className="relative py-20 px-4 md:px-8 bg-primary">
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
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
              onClick={() => navigate("/signup")}
            >
              Start Your Free Trial
            </Button>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Contact Footer */}
      <footer className="relative py-12 px-4 md:px-8 bg-white text-black">
        <GridBackground gridSize={15} opacity={0.02} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <motion.div 
                className="flex items-center mb-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Leaf className="h-8 w-8 mr-2 text-primary" />
                <h2 className="text-2xl font-bold">FarmlyCarbon</h2>
              </motion.div>
              <motion.p 
                className="text-gray-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Your complete platform for agricultural carbon management, emissions tracking, and sustainability planning.
              </motion.p>
            </div>
            
            <div>
              <motion.h3 
                className="text-xl font-semibold mb-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Contact Us
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
                  icon={<Mail className="h-5 w-5 mr-3" />}
                  text="i.kunal.ar26@gmail.com"
                />
                
                <ContactLink 
                  href="https://www.instagram.com/i_kunal_ar26/" 
                  icon={<Instagram className="h-5 w-5 mr-3" />}
                  text="i_kunal_ar26"
                />
                
                <ContactLink 
                  href="https://x.com/i_kunal_ar26" 
                  icon={<Twitter className="h-5 w-5 mr-3" />}
                  text="i_kunal_ar26"
                />
                
                <ContactLink 
                  href="https://www.linkedin.com/in/kunal-rahangdale-572a7215a/" 
                  icon={<Linkedin className="h-5 w-5 mr-3" />}
                  text="Kunal Rahangdale"
                />
              </motion.div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} FarmlyCarbon. All rights reserved.</p>
          </div>
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
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 backdrop-blur-sm relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-90 z-0"></div>
    <div className="relative z-10">
      <div className="mb-4 text-primary">{icon}</div>
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
    className="flex flex-col items-center text-center"
  >
    <motion.div 
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="text-4xl font-bold text-primary/20 mb-4"
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
    className="flex items-center text-gray-700 hover:text-primary transition-colors"
    variants={{
      hidden: { opacity: 0, x: -10 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    }}
    whileHover={{ x: 5 }}
    whileTap={{ scale: 0.98 }}
  >
    {icon}
    <span>{text}</span>
  </motion.a>
);

export default Index;
