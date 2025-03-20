
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Building, 
  Truck, 
  Factory, 
  ShoppingBag, 
  Recycle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const pathwayData = [
  { year: 2020, emissions: 168, bau: 168, target1: 168, target2: 168 },
  { year: 2021, emissions: 161, bau: 170, target1: 160, target2: 150 },
  { year: 2022, emissions: 154, bau: 172, target1: 152, target2: 133 },
  { year: 2023, emissions: 146, bau: 175, target1: 144, target2: 117 },
  { year: 2024, emissions: 137, bau: 177, target1: 136, target2: 102 },
  { year: 2025, emissions: null, bau: 180, target1: 128, target2: 88 },
  { year: 2026, emissions: null, bau: 182, target1: 120, target2: 75 },
  { year: 2027, emissions: null, bau: 185, target1: 112, target2: 63 },
  { year: 2028, emissions: null, bau: 187, target1: 104, target2: 52 },
  { year: 2029, emissions: null, bau: 190, target1: 96, target2: 42 },
  { year: 2030, emissions: null, bau: 192, target1: 88, target2: 33 },
  { year: 2035, emissions: null, bau: 205, target1: 56, target2: 10 },
  { year: 2040, emissions: null, bau: 220, target1: 24, target2: 0 },
];

const milestoneData = [
  { year: 2020, event: "Baseline Assessment", status: "completed" },
  { year: 2022, event: "25% Renewable Energy", status: "completed" },
  { year: 2023, event: "50% Electric Fleet", status: "completed" },
  { year: 2024, event: "75% Supplier Engagement", status: "inProgress" },
  { year: 2025, event: "30% Emissions Reduction", status: "planned" },
  { year: 2026, event: "45% Renewable Energy", status: "planned" },
  { year: 2028, event: "60% Emissions Reduction", status: "planned" },
  { year: 2030, event: "80% Emissions Reduction", status: "planned" },
  { year: 2035, event: "95% Emissions Reduction", status: "planned" },
  { year: 2040, event: "Net Zero Achievement", status: "planned" },
];

const projectsData = [
  {
    id: 1,
    name: "Renewable Energy Transition",
    category: "Energy",
    impact: "High",
    reduction: 34500,
    cost: "$$",
    timeline: "2024-2026",
    status: "In Progress",
    progress: 65,
    icon: Zap,
  },
  {
    id: 2,
    name: "Fleet Electrification",
    category: "Transportation",
    impact: "High",
    reduction: 21300,
    cost: "$$$",
    timeline: "2023-2027",
    status: "In Progress",
    progress: 50,
    icon: Truck,
  },
  {
    id: 3,
    name: "Factory Energy Efficiency",
    category: "Operations",
    impact: "Medium",
    reduction: 15800,
    cost: "$$",
    timeline: "2024-2025",
    status: "Planning",
    progress: 25,
    icon: Factory,
  },
  {
    id: 4,
    name: "Sustainable Procurement",
    category: "Supply Chain",
    impact: "High",
    reduction: 42600,
    cost: "$$",
    timeline: "2024-2028",
    status: "In Progress",
    progress: 35,
    icon: ShoppingBag,
  },
  {
    id: 5,
    name: "Circular Packaging Initiative",
    category: "Waste",
    impact: "Medium",
    reduction: 12500,
    cost: "$",
    timeline: "2024-2026",
    status: "Planning",
    progress: 15,
    icon: Recycle,
  },
];

const comparePlanData = [
  { year: 2020, current: 100, aggressive: 100, moderate: 100 },
  { year: 2025, current: 76, aggressive: 52, moderate: 65 },
  { year: 2030, current: 52, aggressive: 20, moderate: 40 },
  { year: 2035, current: 33, aggressive: 6, moderate: 20 },
  { year: 2040, current: 14, aggressive: 0, moderate: 5 },
  { year: 2045, current: 0, aggressive: 0, moderate: 0 },
];

const NetZeroPlanner = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Net Zero Planner</h1>
          <p className="text-muted-foreground">Plan and track your path to net zero emissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            <span>Adjust Timeline</span>
          </Button>
          <Button size="sm">
            Update Plan
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18.5%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Reduction from 2020 baseline
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projected Year for Net Zero</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2040</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on current trajectory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Reduction Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              5 high impact, 7 medium impact
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pathway" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pathway">Net Zero Pathway</TabsTrigger>
          <TabsTrigger value="projects">Reduction Projects</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="pathway" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emissions Reduction Pathway</CardTitle>
              <CardDescription>
                Tracking progress toward net zero by 2040
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={pathwayData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#09AB75" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#09AB75" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorBAU" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EA384C" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#EA384C" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} tCO₂e`, ""]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="bau"
                      name="Business as Usual"
                      stroke="#EA384C"
                      fill="url(#colorBAU)"
                      strokeDasharray="5 5"
                      activeDot={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="emissions"
                      name="Actual Emissions"
                      stroke="#09AB75"
                      fill="url(#colorEmissions)"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target1"
                      name="1.5°C Aligned Path"
                      stroke="#FFC745"
                      strokeWidth={2}
                      dot={false}
                      activeDot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="target2"
                      name="Accelerated Net Zero"
                      stroke="#4A5B6B"
                      strokeWidth={2}
                      dot={false}
                      activeDot={false}
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Net Zero Milestones</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <div className="relative">
                <div className="absolute left-1/2 top-0 h-full w-px bg-border transform -translate-x-1/2" />
                <div className="relative z-10">
                  {milestoneData.map((milestone, index) => (
                    <div key={index} className="flex items-center mb-8 last:mb-0">
                      <div className="flex-1 text-right pr-10">
                        <span className="inline-block font-bold">{milestone.year}</span>
                      </div>
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          milestone.status === "completed" 
                            ? "bg-brand-green-500 text-white" 
                            : milestone.status === "inProgress" 
                              ? "bg-brand-yellow-500 text-white" 
                              : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {milestone.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-current" />
                        )}
                      </div>
                      <div className="flex-1 pl-10">
                        <p className="font-medium">{milestone.event}</p>
                        <p className="text-sm text-muted-foreground">
                          {milestone.status === "completed" 
                            ? "Completed" 
                            : milestone.status === "inProgress" 
                              ? "In Progress" 
                              : "Planned"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectsData.map((project) => {
              const Icon = project.icon;
              return (
                <Card key={project.id} className="transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${
                          project.category === "Energy" ? "bg-amber-100" :
                          project.category === "Transportation" ? "bg-blue-100" :
                          project.category === "Operations" ? "bg-purple-100" :
                          project.category === "Supply Chain" ? "bg-green-100" :
                          "bg-red-100"
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            project.category === "Energy" ? "text-amber-500" :
                            project.category === "Transportation" ? "text-blue-500" :
                            project.category === "Operations" ? "text-purple-500" :
                            project.category === "Supply Chain" ? "text-green-500" :
                            "text-red-500"
                          }`} />
                        </div>
                        <CardTitle className="text-base font-semibold">{project.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className={`${
                        project.status === "In Progress" ? "bg-green-100 text-green-700" :
                        project.status === "Planning" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <p className="font-medium">{project.category}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Impact</p>
                          <p className="font-medium">{project.impact}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Timeline</p>
                          <p className="font-medium">{project.timeline}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cost</p>
                          <p className="font-medium">{project.cost}</p>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm font-medium">Progress</p>
                          <p className="text-sm font-medium">{project.progress}%</p>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      
                      <div className="bg-muted p-2 rounded-md text-center">
                        <p className="text-xs text-muted-foreground">Expected Reduction</p>
                        <p className="font-bold">{project.reduction.toLocaleString()} tCO₂e</p>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        <span>View Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <Card className="flex flex-col justify-center items-center p-6 border-dashed h-full">
              <Target className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Add New Project</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Define a new emissions reduction initiative or offset project
              </p>
              <Button>Add Project</Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Net Zero Scenario Comparison</CardTitle>
              <CardDescription>Compare different decarbonization strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={comparePlanData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="year" 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="current"
                      name="Current Plan"
                      stroke="#09AB75"
                      strokeWidth={2}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="aggressive"
                      name="Aggressive Plan"
                      stroke="#FFC745"
                      strokeWidth={2}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="moderate"
                      name="Moderate Plan"
                      stroke="#4A5B6B"
                      strokeWidth={2}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span>Current Plan</span>
                  <Badge className="ml-2 bg-brand-green text-white">Active</Badge>
                </CardTitle>
                <CardDescription>Business-focused balanced approach</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">Net Zero Target</p>
                      <p className="text-sm font-medium">2040</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Investment Required</p>
                      <p className="text-sm font-medium">$$ (Medium)</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Risk Level</p>
                      <p className="text-sm font-medium">Medium</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Key Strategies</p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>80% renewable energy by 2030</li>
                      <li>Full fleet electrification by 2032</li>
                      <li>Supply chain engagement program</li>
                      <li>Carbon offsets for residual emissions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aggressive Plan</CardTitle>
                <CardDescription>Accelerated carbon reduction path</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">Net Zero Target</p>
                      <p className="text-sm font-medium">2035</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Investment Required</p>
                      <p className="text-sm font-medium">$$$ (High)</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Risk Level</p>
                      <p className="text-sm font-medium">High</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Key Strategies</p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>100% renewable energy by 2027</li>
                      <li>Full fleet electrification by 2026</li>
                      <li>Mandatory supplier emissions targets</li>
                      <li>Significant process redesign</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Moderate Plan</CardTitle>
                <CardDescription>Conservative approach with lower risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">Net Zero Target</p>
                      <p className="text-sm font-medium">2045</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Investment Required</p>
                      <p className="text-sm font-medium">$ (Low)</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Risk Level</p>
                      <p className="text-sm font-medium">Low</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Key Strategies</p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>60% renewable energy by 2035</li>
                      <li>Gradual fleet electrification</li>
                      <li>Voluntary supplier program</li>
                      <li>Higher reliance on carbon offsets</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="w-full max-w-md">Create Custom Scenario</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Define a custom decarbonization pathway with your own targets and strategies</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetZeroPlanner;
