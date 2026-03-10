
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm } from "./ProjectForm";
import { toast } from "sonner";
import { createReductionProject, deleteReductionProject, getReductionProjects } from "@/services/appwrite";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Define the ReductionProject type
export interface ReductionProject {
  id: string;
  name: string;
  description: string;
  category: string;
  impact: string;
  reduction: number;
  cost: string;
  timeline: string;
}

export const ReductionProjects = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch projects
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['reductionProjects'],
    queryFn: getReductionProjects,
  });

  // Add project mutation
  const addProjectMutation = useMutation({
    mutationFn: (project: Omit<ReductionProject, "id">) => createReductionProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reductionProjects'] });
      setIsFormOpen(false);
      toast.success("Project added successfully");
    },
    onError: (error) => {
      console.error("Error adding project:", error);
      toast.error("Failed to add project");
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: (id: string) => deleteReductionProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reductionProjects'] });
      toast.success("Project deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    },
  });

  const handleAddProject = (project: Omit<ReductionProject, "id">) => {
    addProjectMutation.mutate(project);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Carbon Reduction Projects</h3>
        <Button onClick={() => setIsFormOpen(true)}>Add Project</Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">Loading projects...</div>
          </CardContent>
        </Card>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No reduction projects added yet</p>
              <Button onClick={() => setIsFormOpen(true)}>Add Your First Project</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Impact</TableHead>
                  <TableHead className="hidden md:table-cell">Reduction (tCO2e)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{project.impact}</TableCell>
                    <TableCell className="hidden md:table-cell">{project.reduction}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteProject(project.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Reduction Project</DialogTitle>
            <DialogDescription>
              Enter the details of your carbon reduction project.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm onSubmit={handleAddProject} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
