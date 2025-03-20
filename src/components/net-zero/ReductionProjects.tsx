
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, ArrowRight, Zap, Truck, Factory, ShoppingBag, Recycle } from "lucide-react";

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

export const ReductionProjects = () => {
  return (
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
  );
};
