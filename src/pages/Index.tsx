
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, Leaf, BarChart3, Target, LineChart, Mail, Instagram, Twitter, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 md:px-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="max-w-4xl"
        >
          <motion.div variants={fadeInUp}>
            <div className="flex items-center justify-center mb-6">
              <Leaf className="h-12 w-12 mr-2" />
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">FarmlyCarbon</h1>
            </div>
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-muted-foreground mb-6"
          >
            Your complete platform for agricultural carbon management, emissions tracking, and sustainability planning
          </motion.h2>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")}>
              Get Started <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
              Log In
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8"
        >
          <Button 
            variant="ghost" 
            size="icon"
            className="animate-bounce"
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ArrowDown />
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-8 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Comprehensive Carbon Management</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart3 className="h-8 w-8" />}
              title="Real-time Dashboard"
              description="Monitor your farm's carbon footprint with intuitive visualizations and actionable insights."
            />
            <FeatureCard 
              icon={<LineChart className="h-8 w-8" />}
              title="Emissions Tracking"
              description="Track scope 1, 2, and 3 emissions across all farm operations with precision and accuracy."
            />
            <FeatureCard 
              icon={<Target className="h-8 w-8" />}
              title="Net Zero Planning"
              description="Create and manage your path to net zero emissions with customizable reduction projects."
            />
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <WorksStep 
              number="01"
              title="Measure Your Emissions"
              description="Import or input your farm's data to establish a comprehensive baseline of carbon emissions."
            />
            <WorksStep 
              number="02"
              title="Create Reduction Plans"
              description="Develop actionable strategies to reduce emissions based on your specific operation and goals."
            />
            <WorksStep 
              number="03"
              title="Track Your Progress"
              description="Monitor improvements over time and stay compliant with relevant sustainability standards."
            />
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 md:px-8 bg-primary">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Sustainability Journey?</h2>
          <p className="text-white/80 text-lg mb-8">Join thousands of agricultural operations already using FarmlyCarbon to manage their environmental impact.</p>
          
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/signup")}
          >
            Start Your Free Trial
          </Button>
        </motion.div>
      </section>
      
      {/* Contact Footer */}
      <footer className="py-12 px-4 md:px-8 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <Leaf className="h-8 w-8 mr-2 text-primary" />
                <h2 className="text-2xl font-bold">FarmlyCarbon</h2>
              </div>
              <p className="text-gray-700 mb-6">
                Your complete platform for agricultural carbon management, emissions tracking, and sustainability planning.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
              <div className="space-y-4">
                <a 
                  href="mailto:i.kunal.ar26@gmail.com" 
                  className="flex items-center text-gray-700 hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5 mr-3" />
                  <span>i.kunal.ar26@gmail.com</span>
                </a>
                
                <a 
                  href="https://www.instagram.com/i_kunal_ar26/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-gray-700 hover:text-primary transition-colors"
                >
                  <Instagram className="h-5 w-5 mr-3" />
                  <span>i_kunal_ar26</span>
                </a>
                
                <a 
                  href="https://x.com/i_kunal_ar26" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-gray-700 hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5 mr-3" />
                  <span>i_kunal_ar26</span>
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/kunal-rahangdale-572a7215a/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-gray-700 hover:text-primary transition-colors"
                >
                  <Linkedin className="h-5 w-5 mr-3" />
                  <span>Kunal Rahangdale</span>
                </a>
              </div>
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
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
  >
    <div className="mb-4 text-primary">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

// How It Works Step Component
const WorksStep = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <motion.div className="flex flex-col items-center text-center">
    <div className="text-4xl font-bold text-primary/20 mb-4">{number}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </motion.div>
);

export default Index;
