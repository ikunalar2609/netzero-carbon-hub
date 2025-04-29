
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, Plus, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  StandardCompliance,
  getStandardsCompliance,
  createStandardCompliance,
  updateStandardCompliance,
  deleteStandardCompliance 
} from "@/services/appwrite";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const standardSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  status: z.string().min(1, "Status is required"),
});

type StandardFormValues = z.infer<typeof standardSchema>;

export const StandardsCompliance = () => {
  const [standards, setStandards] = useState<StandardCompliance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStandard, setCurrentStandard] = useState<StandardCompliance | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<StandardFormValues>({
    resolver: zodResolver(standardSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
    },
  });

  useEffect(() => {
    fetchStandards();
  }, []);

  useEffect(() => {
    if (currentStandard && isEditing) {
      form.reset({
        title: currentStandard.title,
        description: currentStandard.description,
        status: currentStandard.status,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        status: "",
      });
    }
  }, [currentStandard, isEditing, form]);

  const fetchStandards = async () => {
    try {
      setLoading(true);
      const data = await getStandardsCompliance();
      
      // If no data exists in Appwrite yet, use sample data
      if (data.length === 0) {
        const sampleStandards = [
          {
            id: "1",
            title: "GHG Protocol Alignment",
            description: "Project follows the GHG Protocol Corporate Standard for emissions accounting.",
            status: "Fully Compliant",
          },
          {
            id: "2",
            title: "ISO 14064 Compliance",
            description: "Follows ISO 14064 standards for greenhouse gas accounting and verification.",
            status: "Certified",
          },
          {
            id: "3",
            title: "Science Based Targets",
            description: "Reduction targets aligned with Science Based Targets initiative (SBTi).",
            status: "Validated",
          },
          {
            id: "4",
            title: "Gold Standard",
            description: "Project meets Gold Standard certification requirements for carbon projects.",
            status: "Pending Verification",
          }
        ];
        setStandards(sampleStandards);
      } else {
        setStandards(data);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching standards:", err);
      setError("Failed to load standards. Please try again later.");
      toast.error("Failed to load standards");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStandard = () => {
    setCurrentStandard(null);
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditStandard = (standard: StandardCompliance) => {
    setCurrentStandard(standard);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteStandard = async (id: string) => {
    try {
      await deleteStandardCompliance(id);
      setStandards(standards.filter(standard => standard.id !== id));
      toast.success("Standard deleted successfully");
    } catch (err) {
      console.error("Error deleting standard:", err);
      toast.error("Failed to delete standard");
    }
  };

  const onSubmit = async (values: StandardFormValues) => {
    try {
      if (isEditing && currentStandard) {
        const updated = await updateStandardCompliance(currentStandard.id, values);
        setStandards(standards.map(s => s.id === currentStandard.id ? { ...s, ...values } : s));
        toast.success("Standard updated successfully");
      } else {
        const newStandard = await createStandardCompliance(values);
        setStandards([...standards, newStandard as unknown as StandardCompliance]);
        toast.success("Standard added successfully");
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error saving standard:", err);
      toast.error(isEditing ? "Failed to update standard" : "Failed to add standard");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fully Compliant":
      case "Certified":
      case "Validated":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending Verification":
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Not Compliant":
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Standards & Compliance</CardTitle>
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
          <CardTitle>Standards & Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchStandards}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Standards & Compliance</CardTitle>
          <Button size="sm" onClick={handleAddStandard} className="gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Standard</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {standards.map((standard) => (
                <div key={standard.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">{standard.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {standard.description}
                  </p>
                  <Badge className={getStatusColor(standard.status)}>{standard.status}</Badge>
                  
                  <div className="flex justify-end mt-3 pt-2 border-t">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm text-black hover:text-gray-600"
                      onClick={() => handleEditStandard(standard)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">UN Sustainable Development Goals</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                  SDG 7: Affordable Clean Energy
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                  SDG 9: Industry & Infrastructure
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                  SDG 11: Sustainable Cities
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                  SDG 12: Responsible Consumption
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                  SDG 13: Climate Action
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                  SDG 15: Life on Land
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                  SDG 17: Partnerships for Goals
                </Badge>
              </div>
            </div>

            <Button className="w-full flex gap-1 text-white">
              <span>Generate Compliance Report</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Standard" : "Add New Standard"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update compliance standard details" : "Add a new compliance standard to track"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ISO 14001 Compliance" {...field} />
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
                        placeholder="Brief description of the standard" 
                        className="resize-none"
                        {...field} 
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fully Compliant">Fully Compliant</SelectItem>
                        <SelectItem value="Certified">Certified</SelectItem>
                        <SelectItem value="Validated">Validated</SelectItem>
                        <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Not Compliant">Not Compliant</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditing ? "Update" : "Add Standard"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};
