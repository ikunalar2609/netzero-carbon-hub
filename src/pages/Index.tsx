import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, BarChart3, Target, LineChart, Mail, Instagram, Twitter, Linkedin, BookOpen, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CarbonProjectsSection from "@/components/home/CarbonProjectsSection";
import SubstackSection from "@/components/home/SubstackSection";
import GridBackground from "@/components/home/GridBackground";
import GradientDot from "@/components/home/GradientDot";
import HomeHeader from "@/components/home/HomeHeader";
import FeatureCard from "@/components/common/FeatureCard"; // Importing FeatureCard component
import WorksStep from "@/components/common/WorksStep"; // Importing WorksStep component

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
        {/* Dark overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/30 z-5" />
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
            whileInView={{ opacity: 1, y
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-white/90 text-lg mb-8"
      >
        Start measuring, managing, and mitigating your carbon impact today with FarmlyCarbon.
      </motion.p>
      
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          size="lg" 
          className="bg-white text-black hover:bg-white/90 font-semibold shadow-xl"
          onClick={() => navigate("/signup")}
        >
          Get Started <ArrowRight className="ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  </section>
</div>
