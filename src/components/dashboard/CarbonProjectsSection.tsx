
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, BarChart3, LineChart } from "lucide-react";
import { getFeaturedProjects, getCarbonStats, type CarbonProject, type CarbonStats } from "@/services/carbonmark";

const CarbonProjectsSection = () => {
  const [projects, setProjects] = useState<CarbonProject[]>([]);
  const [stats, setStats] = useState<CarbonStats>({
    totalProjects: 0,
    totalCredits: 0,
    averagePrice: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const projectsData = await getFeaturedProjects();
        const statsData = await getCarbonStats();
        setProjects(projectsData);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching carbon data:", error);
        toast({
          title: "Error",
          description: "Failed to load carbon projects data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight text-white">Carbon Market Insights</h2>
      <p className="text-gray-500 mb-4">
        Track carbon market trends and discover potential carbon credit projects
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-[#141414] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-gray-400">
              <BarChart3 className="h-4 w-4 mr-2 text-emerald-500" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalProjects.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Active carbon reduction projects</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#141414] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-gray-400">
              <Leaf className="h-4 w-4 mr-2 text-emerald-500" />
              Carbon Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalCredits.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Metric tons of CO₂ equivalent</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#141414] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-gray-400">
              <LineChart className="h-4 w-4 mr-2 text-emerald-500" />
              Average Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats.averagePrice.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Per metric ton of CO₂ equivalent</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="mb-4 bg-white/5 border border-white/10">
          <TabsTrigger value="projects" className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white">Featured Projects</TabsTrigger>
          <TabsTrigger value="details" className="text-gray-400 data-[state=active]:bg-white/10 data-[state=active]:text-white">Market Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="details">
          <Card className="bg-[#141414] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Carbon Credit Projects by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-gray-400">Category</TableHead>
                    <TableHead className="text-gray-400">Projects</TableHead>
                    <TableHead className="text-gray-400">Avg. Price</TableHead>
                    <TableHead className="text-gray-400">Total Volume</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow className="border-white/10">
                      <TableCell colSpan={5} className="text-center py-10 text-gray-500">Loading data...</TableCell>
                    </TableRow>
                  ) : projects.length === 0 ? (
                    <TableRow className="border-white/10">
                      <TableCell colSpan={5} className="text-center py-10 text-gray-500">No data available</TableCell>
                    </TableRow>
                  ) : (
                    <>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-gray-200">Forestry</TableCell>
                        <TableCell className="text-gray-300">{Math.floor(stats.totalProjects * 0.35)}</TableCell>
                        <TableCell className="text-gray-300">${(stats.averagePrice * 1.1).toFixed(2)}</TableCell>
                        <TableCell className="text-gray-300">{Math.floor(stats.totalCredits * 0.35).toLocaleString()} tCO₂e</TableCell>
                        <TableCell><Badge className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20 border-0">High Demand</Badge></TableCell>
                      </TableRow>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-gray-200">Renewable Energy</TableCell>
                        <TableCell className="text-gray-300">{Math.floor(stats.totalProjects * 0.28)}</TableCell>
                        <TableCell className="text-gray-300">${(stats.averagePrice * 0.9).toFixed(2)}</TableCell>
                        <TableCell className="text-gray-300">{Math.floor(stats.totalCredits * 0.28).toLocaleString()} tCO₂e</TableCell>
                        <TableCell><Badge className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20 border-0">High Demand</Badge></TableCell>
                      </TableRow>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-gray-200">Methane Reduction</TableCell>
                        <TableCell className="text-gray-300">{Math.floor(stats.totalProjects * 0.15)}</TableCell>
                        <TableCell className="text-gray-300">${(stats.averagePrice * 1.2).toFixed(2)}</TableCell>
                        <TableCell className="text-gray-300">{Math.floor(stats.totalCredits * 0.15).toLocaleString()} tCO₂e</TableCell>
                        <TableCell><Badge className="bg-amber-500/15 text-amber-400 hover:bg-amber-500/20 border-0">Moderate</Badge></TableCell>
                      </TableRow>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-gray-200">Agriculture</TableCell>
                        <TableCell className="text-gray-300">{Math.floor(stats.totalProjects * 0.12)}</TableCell>
                        <TableCell className="text-gray-300">${(stats.averagePrice * 0.85).toFixed(2)}</TableCell>
                        <TableCell className="text-gray-300">{Math.floor(stats.totalCredits * 0.12).toLocaleString()} tCO₂e</TableCell>
                        <TableCell><Badge className="bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/20 border-0">High Demand</Badge></TableCell>
                      </TableRow>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium text-gray-200">Industrial Processes</TableCell>
                        <TableCell className="text-gray-300">{Math.floor(stats.totalProjects * 0.10)}</TableCell>
                        <TableCell className="text-gray-300">${(stats.averagePrice * 0.95).toFixed(2)}</TableCell>
                        <TableCell className="text-gray-300">{Math.floor(stats.totalCredits * 0.10).toLocaleString()} tCO₂e</TableCell>
                        <TableCell><Badge className="bg-amber-500/15 text-amber-400 hover:bg-amber-500/20 border-0">Moderate</Badge></TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ProjectCard = ({ project }: { project: CarbonProject }) => (
  <Card className="overflow-hidden h-full bg-[#141414] border-white/10 hover:border-white/20 transition-all">
    <div className="h-40 overflow-hidden">
      {project.imageUrl && (
        <img 
          src={project.imageUrl} 
          alt={project.name} 
          className="w-full h-full object-cover"
        />
      )}
    </div>
    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          {project.category}
        </Badge>
        <span className="font-bold text-white">${project.price.toFixed(2)}</span>
      </div>
      
      <h3 className="text-base font-semibold line-clamp-1 text-gray-200">{project.name}</h3>
      <p className="text-gray-500 text-sm mt-1 mb-2 line-clamp-2">{project.description}</p>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-white/5">
        <span>{project.location}</span>
        <span>Vintage: {project.vintage}</span>
      </div>
    </div>
  </Card>
);

export default CarbonProjectsSection;
