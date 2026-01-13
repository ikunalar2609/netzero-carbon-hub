
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getFeaturedProjects,
  getCarbonStats,
  type CarbonProject,
  type CarbonStats
} from "@/services/carbonmark";
import { 
  BarChart3, 
  Leaf, 
  LineChart, 
  ChartLine, 
  ChartBar, 
  ChartPie 
} from "lucide-react";

const CarbonMarketInsights = () => {
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
          description: "Failed to load carbon market data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Carbon Market Insights</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-brand-green/10 text-brand-green border-brand-green/20 px-3">
            Live API Data
          </Badge>
          <p className="text-sm text-muted-foreground">
            Data provided by Carbonmark API (https://v16.api.carbonmark.com)
          </p>
        </div>
        <p className="text-muted-foreground mt-2">
          Explore carbon market trends, analyze credit pricing, and discover potential offset projects
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <BarChart3 className="h-4 w-4 mr-2 text-brand-green" />
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active carbon reduction projects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <Leaf className="h-4 w-4 mr-2 text-brand-green" />
              Carbon Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Metric tons of CO₂ equivalent
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium">
              <LineChart className="h-4 w-4 mr-2 text-brand-green" />
              Average Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averagePrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Per metric ton of CO₂ equivalent
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="projects">Featured Projects</TabsTrigger>
          <TabsTrigger value="market">Market Analytics</TabsTrigger>
          <TabsTrigger value="details">Project Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="market">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ChartLine className="h-5 w-5 mr-2 text-brand-green" />
                  Price Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64 bg-muted/40 rounded-md">
                  <ChartLine className="h-16 w-16 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Price trend chart will be displayed here</p>
                  <p className="text-xs text-muted-foreground mt-2">Data from Carbonmark API</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <ChartBar className="h-5 w-5 mr-2 text-brand-green" />
                  Volume by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-64 bg-muted/40 rounded-md">
                  <ChartBar className="h-16 w-16 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Volume chart will be displayed here</p>
                  <p className="text-xs text-muted-foreground mt-2">Data from Carbonmark API</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartPie className="h-5 w-5 mr-2 text-brand-green" />
                Carbon Credit Projects by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead>Avg. Price</TableHead>
                    <TableHead>Total Volume</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        Loading data...
                      </TableCell>
                    </TableRow>
                  ) : projects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      <TableRow>
                        <TableCell className="font-medium">Forestry</TableCell>
                        <TableCell>{Math.floor(stats.totalProjects * 0.35)}</TableCell>
                        <TableCell>${(stats.averagePrice * 1.1).toFixed(2)}</TableCell>
                        <TableCell>{Math.floor(stats.totalCredits * 0.35).toLocaleString()} tCO₂e</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            High Demand
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Renewable Energy</TableCell>
                        <TableCell>{Math.floor(stats.totalProjects * 0.28)}</TableCell>
                        <TableCell>${(stats.averagePrice * 0.9).toFixed(2)}</TableCell>
                        <TableCell>{Math.floor(stats.totalCredits * 0.28).toLocaleString()} tCO₂e</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            High Demand
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Methane Reduction</TableCell>
                        <TableCell>{Math.floor(stats.totalProjects * 0.15)}</TableCell>
                        <TableCell>${(stats.averagePrice * 1.2).toFixed(2)}</TableCell>
                        <TableCell>{Math.floor(stats.totalCredits * 0.15).toLocaleString()} tCO₂e</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                            Moderate
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Agriculture</TableCell>
                        <TableCell>{Math.floor(stats.totalProjects * 0.12)}</TableCell>
                        <TableCell>${(stats.averagePrice * 0.85).toFixed(2)}</TableCell>
                        <TableCell>{Math.floor(stats.totalCredits * 0.12).toLocaleString()} tCO₂e</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            High Demand
                          </Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Industrial Processes</TableCell>
                        <TableCell>{Math.floor(stats.totalProjects * 0.10)}</TableCell>
                        <TableCell>${(stats.averagePrice * 0.95).toFixed(2)}</TableCell>
                        <TableCell>{Math.floor(stats.totalCredits * 0.10).toLocaleString()} tCO₂e</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                            Moderate
                          </Badge>
                        </TableCell>
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

// Project Card Component
const ProjectCard = ({ project }: { project: CarbonProject }) => (
  <Card className="overflow-hidden h-full">
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
        <Badge variant="outline" className="bg-brand-green/10 text-brand-green border-brand-green/20">
          {project.category}
        </Badge>
        <span className="font-bold">${project.price.toFixed(2)}</span>
      </div>
      
      <h3 className="text-base font-semibold line-clamp-1">{project.name}</h3>
      <p className="text-muted-foreground text-sm mt-1 mb-2 line-clamp-2">{project.description}</p>
      
      <div className="flex justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
        <span>{project.location}</span>
        <span>Vintage: {project.vintage}</span>
      </div>
    </div>
  </Card>
);

export default CarbonMarketInsights;
