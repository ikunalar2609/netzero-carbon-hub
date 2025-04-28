import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Leaf,
  Factory,
  Wind,
  Lightbulb,
  BarChart3,
  Cpu,
  Plus,
  Edit,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define the structure for a project
type ProjectType = {
  id: number;
  name: string;
  status: string;
  progress: number;
  icon: React.ComponentType;
  description: string;
  targetReduction: number;
  startDate: string;
  endDate: string;
  team: string;
};

export const ReductionProjects = () => {
  const [projects, setProjects] = useState<ProjectType[]>([
    {
      id: 1,
      name: 'Solar Panel Installation',
      status: 'active',
      progress: 75,
      icon: Leaf,
      description: 'Installing solar panels to reduce electricity emissions.',
      targetReduction: 5000,
      startDate: '2023-01-15',
      endDate: '2023-12-31',
      team: 'Sustainability Team',
    },
    {
      id: 2,
      name: 'Factory Equipment Upgrade',
      status: 'completed',
      progress: 100,
      icon: Factory,
      description: 'Upgrading factory equipment for better energy efficiency.',
      targetReduction: 8000,
      startDate: '2022-06-01',
      endDate: '2023-05-31',
      team: 'Engineering Team',
    },
    {
      id: 3,
      name: 'Wind Turbine Deployment',
      status: 'planning',
      progress: 20,
      icon: Wind,
      description: 'Deploying wind turbines to generate renewable energy.',
      targetReduction: 12000,
      startDate: '2024-03-01',
      endDate: '2025-12-31',
      team: 'Renewable Energy Division',
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState<Omit<ProjectType, 'id'>>({
    name: '',
    status: 'planning',
    progress: 0,
    icon: Leaf,
    description: '',
    targetReduction: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    team: '',
  });
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editedProject, setEditedProject] = useState<ProjectType | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Omit<ProjectType, 'id'>) => {
    setNewProject({ ...newProject, [field]: e.target.value });
  };

  const handleAddProject = (newProject: Omit<ProjectType, 'id'>) => {
    const randomIcons = [Leaf, Factory, Wind, Lightbulb, BarChart3, Cpu];
    const randomIcon = randomIcons[Math.floor(Math.random() * randomIcons.length)];
    const newProjectWithId: ProjectType = {
      id: Date.now(),
      ...newProject,
      icon: randomIcon,
    };
    setProjects([...projects, newProjectWithId]);
    setIsAdding(false);
    setNewProject({
      name: '',
      status: 'planning',
      progress: 0,
      icon: Leaf,
      description: '',
      targetReduction: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      team: '',
    });
  };

  const handleAddRandomProject = () => {
    const randomStatuses = ['active', 'planning', 'completed', 'on-hold'];
    const randomStatus = randomStatuses[Math.floor(Math.random() * randomStatuses.length)];
    const randomProgress = Math.floor(Math.random() * 100);
    const randomIcons = [Leaf, Factory, Wind, Lightbulb, BarChart3, Cpu];
    const randomIcon = randomIcons[Math.floor(Math.random() * randomIcons.length)];
    
    const newProject = {
      id: Date.now(),
      name: `New Project ${Date.now().toString().slice(-4)}`, // Add required name property
      status: randomStatus,
      progress: randomProgress,
      icon: randomIcon,
      description: 'A new project to reduce carbon emissions',
      targetReduction: Math.floor(Math.random() * 10000) + 1000,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 1000*60*60*24*365).toISOString().split('T')[0],
      team: 'Sustainability Team',
    };
    
    setProjects([...projects, newProject]);
  };

  const handleEditClick = (project: ProjectType) => {
    setEditingProjectId(project.id);
    setEditedProject(project);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof ProjectType) => {
    if (editedProject) {
      setEditedProject({ ...editedProject, [field]: e.target.value });
    }
  };

  const handleSaveClick = () => {
    if (editedProject) {
      const updatedProjects = projects.map(project =>
        project.id === editedProject.id ? editedProject : project
      );
      setProjects(updatedProjects);
      setEditingProjectId(null);
      setEditedProject(null);
    }
  };

  const handleCancelClick = () => {
    setEditingProjectId(null);
    setEditedProject(null);
  };

  const handleRemoveProject = (projectId: number) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Reduction Projects</CardTitle>
        <CardDescription>
          Track and manage your carbon reduction initiatives.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Target Reduction</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  {editingProjectId === project.id ? (
                    <Input
                      type="text"
                      value={editedProject?.name || ''}
                      onChange={(e) => handleEditInputChange(e, 'name')}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <project.icon className="h-4 w-4" />
                        <AvatarFallback>ICON</AvatarFallback>
                      </Avatar>
                      <span>{project.name}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {editingProjectId === project.id ? (
                    <Input
                      type="text"
                      value={editedProject?.status || ''}
                      onChange={(e) => handleEditInputChange(e, 'status')}
                    />
                  ) : (
                    <Badge
                      variant="secondary"
                      className={cn(
                        project.status === 'active' && 'bg-green-500 text-white',
                        project.status === 'planning' && 'bg-blue-500 text-white',
                        project.status === 'completed' && 'bg-gray-500 text-white',
                        project.status === 'on-hold' && 'bg-yellow-500 text-white'
                      )}
                    >
                      {project.status}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingProjectId === project.id ? (
                    <Input
                      type="number"
                      value={editedProject?.progress?.toString() || ''}
                      onChange={(e) => handleEditInputChange(e, 'progress')}
                    />
                  ) : (
                    <>
                      <Progress value={project.progress} />
                      <span className="text-xs">{project.progress}%</span>
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {editingProjectId === project.id ? (
                    <Input
                      type="number"
                      value={editedProject?.targetReduction?.toString() || ''}
                      onChange={(e) => handleEditInputChange(e, 'targetReduction')}
                    />
                  ) : (
                    `${project.targetReduction} tonnes CO₂e`
                  )}
                </TableCell>
                <TableCell>
                  {editingProjectId === project.id ? (
                    <Input
                      type="date"
                      value={editedProject?.startDate || ''}
                      onChange={(e) => handleEditInputChange(e, 'startDate')}
                    />
                  ) : (
                    project.startDate
                  )}
                </TableCell>
                <TableCell>
                  {editingProjectId === project.id ? (
                    <Input
                      type="date"
                      value={editedProject?.endDate || ''}
                      onChange={(e) => handleEditInputChange(e, 'endDate')}
                    />
                  ) : (
                    project.endDate
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingProjectId === project.id ? (
                    <div className="space-x-2">
                      <Button variant="ghost" size="sm" onClick={handleSaveClick}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleCancelClick}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(project)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveProject(project.id)}>
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="secondary" onClick={handleAddRandomProject}>Add Random Project</Button>
        {!isAdding && (
          <Button className="mt-4" onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
        )}
        {isAdding && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Project Name</Label>
              <Input
                type="text"
                id="name"
                value={newProject.name}
                onChange={(e) => handleInputChange(e, 'name')}
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                type="text"
                id="status"
                value={newProject.status}
                onChange={(e) => handleInputChange(e, 'status')}
              />
            </div>
            <div>
              <Label htmlFor="progress">Progress</Label>
              <Input
                type="number"
                id="progress"
                value={newProject.progress.toString()}
                onChange={(e) => handleInputChange(e, 'progress')}
              />
            </div>
            <div>
              <Label htmlFor="targetReduction">Target Reduction</Label>
              <Input
                type="number"
                id="targetReduction"
                value={newProject.targetReduction.toString()}
                onChange={(e) => handleInputChange(e, 'targetReduction')}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="date"
                id="startDate"
                value={newProject.startDate}
                onChange={(e) => handleInputChange(e, 'startDate')}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="date"
                id="endDate"
                value={newProject.endDate}
                onChange={(e) => handleInputChange(e, 'endDate')}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => handleInputChange(e, 'description')}
              />
            </div>
            <div className="col-span-2 flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleAddProject(newProject)}>Add Project</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
