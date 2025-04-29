
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Plus, Filter, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ProjectForm, ProjectFormValues } from "@/components/net-zero/ProjectForm";
import { toast } from "sonner";
import {
  ReductionProject,
  getReductionProjects,
  createReductionProject,
  updateReductionProject,
  deleteReductionProject
} from "@/services/appwrite";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ReductionProjects() {
  const [projects, setProjects] = useState<ReductionProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ReductionProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getReductionProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects. Please try again later.");
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setCurrentProject(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: ReductionProject) => {
    setCurrentProject(project);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteReductionProject(id);
      setProjects(projects.filter(project => project.id !== id));
      toast.success("Project deleted successfully");
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error("Failed to delete project");
    }
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    try {
      if (isEditing && currentProject) {
        const updated = await updateReductionProject(currentProject.id, values);
        setProjects(projects.map(p => p.id === currentProject.id ? { ...p, ...values } : p));
      } else {
        const newProject = await createReductionProject(values);
        setProjects([...projects, newProject as unknown as ReductionProject]);
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error saving project:", err);
      toast.error(isEditing ? "Failed to update project" : "Failed to add project");
    }
  };

  const getCostSymbol = (cost: string) => {
    return cost === "$$$" ? "High" : cost === "$$" ? "Medium" : "Low";
  };

  const getImpactColor = (impact: string) => {
    return impact === "High" ? "text-green-600" : impact === "Medium" ? "text-yellow-600" : "text-blue-600";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reduction Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reduction Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchProjects}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reduction Projects</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button size="sm" onClick={handleAddProject} className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Project</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No projects found. Start by adding a new project.</p>
                <Button onClick={handleAddProject} className="mt-4 gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Project</span>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <BarChart3 className={`h-5 w-5 ${getImpactColor(project.impact)}`} />
                        <h3 className="font-semibold">{project.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditProject(project)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{project.category}</Badge>
                      <Badge 
                        className={
                          project.impact === "High" 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : project.impact === "Medium" 
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-blue-100 text-blue-800 border-blue-200"
                        }
                      >
                        {project.impact} Impact
                      </Badge>
                      <Badge variant="outline">{getCostSymbol(project.cost)}</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {project.description || `${project.name} aims to reduce carbon emissions through sustainable practices.`}
                    </p>
                    
                    <div className="flex justify-between items-center mt-4 pt-3 border-t">
                      <div>
                        <p className="text-sm font-medium">Timeline: <span className="text-muted-foreground">{project.timeline}</span></p>
                        <p className="text-sm font-medium">Est. Reduction: <span className="text-green-600">{project.reduction.toLocaleString()} tCO₂e</span></p>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1 text-black">
                        <span>Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button className="w-full flex gap-1 text-white">
              <span>Generate Projects Report</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <ProjectForm
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            defaultValues={currentProject || undefined}
            isEditing={isEditing}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
