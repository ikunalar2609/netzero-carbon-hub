
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createStandard, getStandards, deleteStandard } from "@/services/appwrite";

// Define the StandardCompliance type
export interface StandardCompliance {
  id: string;
  title: string;
  description: string;
  status: string;
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.string(),
});

export const StandardsCompliance = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
    },
  });

  // Fetch standards
  const { data: standards = [], isLoading } = useQuery({
    queryKey: ['standards'],
    queryFn: getStandards,
  });

  // Add standard mutation
  const addStandardMutation = useMutation({
    mutationFn: (standard: Omit<StandardCompliance, "id">) => createStandard(standard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standards'] });
      setIsFormOpen(false);
      form.reset();
      toast.success("Standard added successfully");
    },
    onError: (error) => {
      console.error("Error adding standard:", error);
      toast.error("Failed to add standard");
    },
  });

  // Delete standard mutation
  const deleteStandardMutation = useMutation({
    mutationFn: (id: string) => deleteStandard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['standards'] });
      toast.success("Standard deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting standard:", error);
      toast.error("Failed to delete standard");
    },
  });

  const handleAddStandard = (data: z.infer<typeof formSchema>) => {
    addStandardMutation.mutate(data);
  };

  const handleDeleteStandard = (id: string) => {
    if (window.confirm("Are you sure you want to delete this standard?")) {
      deleteStandardMutation.mutate(id);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "non-compliant":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Standards & Compliance</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsFormOpen(true)}>
            Add Standard
          </Button>
          <Button className="text-white">
            Generate Compliance Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading standards...</div>
      ) : standards.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No compliance standards added yet</p>
              <Button onClick={() => setIsFormOpen(true)}>Add Your First Standard</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {standards.map((standard) => (
            <Card key={standard.id}>
              <CardHeader className="flex flex-row justify-between items-start space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(standard.status)}
                    {standard.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {standard.status === "compliant"
                      ? "Fully compliant"
                      : standard.status === "non-compliant"
                      ? "Action required"
                      : "Under review"}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDeleteStandard(standard.id)}
                >
                  Delete
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{standard.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Compliance Standard</DialogTitle>
            <DialogDescription>
              Add a new standard or regulation that applies to your organization.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddStandard)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. GHG Protocol Scope 3" />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the requirements of this standard"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="compliant">Compliant</SelectItem>
                        <SelectItem value="non-compliant">Non-compliant</SelectItem>
                        <SelectItem value="pending">Pending Review</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Standard</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
