
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Leaf, BarChart3 } from "lucide-react";
import { getFeaturedProjects, getCarbonStats, type CarbonProject, type CarbonStats } from "@/services/carbonmark";
import GridBackground from "./GridBackground";
import GradientDot from "./GradientDot";

const CarbonProjectsSection = () => {
  const [projects, setProjects] = useState<CarbonProject[]>([]);
  const [stats, setStats] = useState<CarbonStats>({
    totalProjects: 0,
    totalCredits: 0,
    averagePrice: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // We'll use dummy data for now since the API endpoint might not be fully functional
        // In a real scenario, you would use the actual API response
        
        // Uncomment these lines to use the actual API when it's available:
        // const projectsData = await getFeaturedProjects();
        // const statsData = await getCarbonStats();
        // setProjects(projectsData);
        // setStats(statsData);
        
        // For now, using sample data
        setProjects([
          {
            id: "1",
            name: "Reforestation Project",
            description: "Large-scale forest restoration in degraded areas",
            price: 15.75,
            category: "Forestry",
            location: "Brazil",
            vintage: "2023",
            imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1000"
          },
          {
            id: "2",
            name: "Solar Farm Initiative",
            description: "Converting farmland to solar energy production",
            price: 22.30,
            category: "Renewable Energy",
            location: "India",
            vintage: "2024",
            imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1000"
          },
          {
            id: "3",
            name: "Methane Capture",
            description: "Agricultural waste methane capture and utilization",
            price: 18.45,
            category: "Methane Reduction",
            location: "United States",
            vintage: "2023",
            imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1000"
          }
        ]);
        
        setStats({
          totalProjects: 235,
          totalCredits: 1250000,
          averagePrice: 19.85
        });
      } catch (error) {
        console.error("Error fetching carbon data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <section className="relative py-20 px-4 md:px-8 bg-gray-50/80 backdrop-blur-sm">
      <GridBackground gridSize={20} opacity={0.03} />
      <GradientDot x="5%" y="90%" size={300} color="rgba(0, 200, 0, 0.03)" />
      <GradientDot x="95%" y="30%" size={350} color="rgba(0, 0, 0, 0.02)" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Carbon Credit Projects</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
          Explore verified carbon credit projects that are making a real impact on our planet's future.
        </p>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatsCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Total Projects"
            value={stats.totalProjects.toLocaleString()}
            description="Active carbon reduction projects"
          />
          <StatsCard
            icon={<LineChart className="h-8 w-8" />}
            title="Carbon Credits"
            value={stats.totalCredits.toLocaleString()}
            description="Metric tons of CO₂ equivalent"
          />
          <StatsCard
            icon={<Leaf className="h-8 w-8" />}
            title="Average Price"
            value={`$${stats.averagePrice.toFixed(2)}`}
            description="Per metric ton of CO₂ equivalent"
          />
        </div>
        
        {/* Projects Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

// Stats Card Component
const StatsCard = ({ icon, title, value, description }: { 
  icon: React.ReactNode, 
  title: string, 
  value: string, 
  description: string 
}) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center backdrop-blur-sm relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 opacity-90 z-0"></div>
    <div className="relative z-10">
      <div className="mb-4 text-primary flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </motion.div>
);

// Project Card Component
const ProjectCard = ({ project }: { project: CarbonProject }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-0 rounded-xl shadow-sm border border-gray-100 overflow-hidden backdrop-blur-sm relative"
  >
    <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/5 to-white/10 z-0"></div>
    <div className="h-48 overflow-hidden">
      {project.imageUrl && (
        <img 
          src={project.imageUrl} 
          alt={project.name} 
          className="w-full h-full object-cover"
        />
      )}
    </div>
    <div className="p-6 relative z-10">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
          {project.category}
        </span>
        <span className="font-bold">${project.price.toFixed(2)}</span>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
      <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Location: {project.location}</span>
        <span>Vintage: {project.vintage}</span>
      </div>
    </div>
  </motion.div>
);

export default CarbonProjectsSection;
