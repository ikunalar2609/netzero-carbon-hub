
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  category: z.string({
    required_error: "Please select a category",
  }),
  impact: z.string({
    required_error: "Please select an impact level",
  }),
  reduction: z.coerce.number().positive({ message: "Must be a positive number" }),
  cost: z.string({
    required_error: "Please select a cost level",
  }),
  timeline: z.string().min(3, { message: "Timeline is required" }),
  description: z.string().optional(),
});

const categories = [
  "Energy",
  "Transportation",
  "Operations",
  "Supply Chain",
  "Waste",
];

const impactLevels = ["Low", "Medium", "High"];
const costLevels = ["$", "$$", "$$$"];

export type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  onSubmit: (values: ProjectFormValues) => void;
  onCancel: () => void;
  defaultValues?: Partial<ProjectFormValues>;
  isEditing?: boolean;
}

export const ProjectForm = ({ 
  onSubmit, 
  onCancel, 
  defaultValues = {}, 
  isEditing = false 
}: ProjectFormProps) => {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      impact: "",
      reduction: 0,
      cost: "",
      timeline: "",
      description: "",
      ...defaultValues,
    },
  });

  const handleSubmit = (values: ProjectFormValues) => {
    onSubmit(values);
    toast.success(isEditing ? "Project updated" : "Project added");
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{isEditing ? "Edit Project" : "Add New Project"}</h2>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="impact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Impact Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select impact" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {impactLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="reduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Reduction (tCO₂e)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter reduction amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cost" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {costLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeline</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 2024-2026" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter project description" 
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">{isEditing ? "Update Project" : "Add Project"}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
