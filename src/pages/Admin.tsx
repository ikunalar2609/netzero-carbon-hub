
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { databases, DATABASE_ID, EMISSIONS_COLLECTION_ID } from "@/lib/appwrite";
import { toast } from "sonner";

const emissionsSchema = z.object({
  year: z.string().min(4, "Year must be in YYYY format"),
  scope1: z.coerce.number().min(0, "Must be a positive number"),
  scope2: z.coerce.number().min(0, "Must be a positive number"),
  scope3: z.coerce.number().min(0, "Must be a positive number"),
});

const Admin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof emissionsSchema>>({
    resolver: zodResolver(emissionsSchema),
    defaultValues: {
      year: "",
      scope1: "",
      scope2: "",
      scope3: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof emissionsSchema>) => {
    setIsSubmitting(true);
    try {
      const total = values.scope1 + values.scope2 + values.scope3;
      
      // Create the document in Appwrite
      await databases.createDocument(
        DATABASE_ID,
        EMISSIONS_COLLECTION_ID,
        "unique()",
        {
          year: values.year,
          scope1: values.scope1,
          scope2: values.scope2,
          scope3: values.scope3,
          total,
        }
      );
      
      toast.success("Emissions data added successfully");
      form.reset();
    } catch (error) {
      console.error("Error adding emissions data:", error);
      toast.error("Failed to add emissions data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your carbon tracking data</p>
      </div>

      <Tabs defaultValue="emissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="emissions">Emissions Data</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="emissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Yearly Emissions</CardTitle>
              <CardDescription>
                Enter yearly emissions data for all scopes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input placeholder="2024" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter the year in YYYY format
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="scope1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scope 1 Emissions (tCO₂e)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="scope2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scope 2 Emissions (tCO₂e)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="scope3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Scope 3 Emissions (tCO₂e)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Emissions Data"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Emissions Data Management</CardTitle>
              <CardDescription>
                View, edit, and delete emissions data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Data management features coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>
                Manage emission categories and subcategories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Category management features coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects Management</CardTitle>
              <CardDescription>
                Manage carbon reduction projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Project management features coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>
                Configure application settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Settings configuration coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
