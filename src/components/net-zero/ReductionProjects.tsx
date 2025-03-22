
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  ArrowRight, 
  Zap, 
  Truck, 
  Factory, 
  ShoppingBag, 
  Recycle,
  Pencil,
  Trash,
  Plus
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectForm, ProjectFormValues } from "./ProjectForm";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialProjectsData = [
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
    description: "Transition to 100% renewable energy sources across all operations.",
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
    description: "Replace fossil-fuel vehicles with electric alternatives.",
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
    description: "Implement energy efficiency measures across manufacturing facilities.",
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
    description: "Source materials and services from low-carbon suppliers.",
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
    description: "Redesign packaging to be fully recyclable or compostable.",
  },
];

// Map categories to icons
const categoryIcons = {
  "Energy": Zap,
  "Transportation": Truck,
  "Operations": Factory,
  "Supply Chain": ShoppingBag,
  "Waste": Recycle,
};

export const ReductionProjects = () => {
  const [projectsData, setProjectsData] = useState(initialProjectsData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);

  const handleAddProject = (values: ProjectFormValues) => {
    const newProject = {
      id: Date.now(),
      ...values,
      status: "Planning",
      progress: 0,
      icon: categoryIcons[values.category as keyof typeof categoryIcons] || Target,
    };
    
    setProjectsData((prev) => [...prev, newProject]);
    setIsAddDialogOpen(false);
  };

  const handleEditProject = (values: ProjectFormValues) => {
    if (!editingProject) return;
    
    setProjectsData((prev) => 
      prev.map((project) => 
        project.id === editingProject.id ? {
          ...project,
          ...values,
          icon: categoryIcons[values.category as keyof typeof categoryIcons] || project.icon,
        } : project
      )
    );
    
    setEditingProject(null);
  };

  const handleDeleteProject = () => {
    if (deleteProjectId === null) return;
    
    setProjectsData((prev) => 
      prev.filter((project) => project.id !== deleteProjectId)
    );
    
    setDeleteProjectId(null);
    toast.success("Project deleted");
  };

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
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className={`${
                    project.status === "In Progress" ? "bg-green-100 text-green-700" :
                    project.status === "Planning" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {project.status}
                  </Badge>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                          <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setEditingProject(project)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => setDeleteProjectId(project.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
      
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Card className="flex flex-col justify-center items-center p-6 border-dashed h-full cursor-pointer hover:bg-muted/50 transition-colors">
            <Plus className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Add New Project</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Define a new emissions reduction initiative or offset project
            </p>
            <Button>Add Project</Button>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] p-0">
          <ProjectForm
            onSubmit={handleAddProject}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="sm:max-w-[600px] p-0">
          {editingProject && (
            <ProjectForm
              onSubmit={handleEditProject}
              onCancel={() => setEditingProject(null)}
              defaultValues={{
                name: editingProject.name,
                category: editingProject.category,
                impact: editingProject.impact,
                reduction: editingProject.reduction,
                cost: editingProject.cost,
                timeline: editingProject.timeline,
                description: editingProject.description || "",
              }}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteProjectId !== null} 
        onOpenChange={(open) => !open && setDeleteProjectId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
