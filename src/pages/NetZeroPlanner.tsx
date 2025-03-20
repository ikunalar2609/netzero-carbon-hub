
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ArrowRight } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Import refactored components
import { SummaryMetrics } from "@/components/net-zero/SummaryMetrics";
import { EmissionsPathwayChart } from "@/components/net-zero/EmissionsPathwayChart";
import { MilestonesTimeline } from "@/components/net-zero/MilestonesTimeline";
import { ReductionProjects } from "@/components/net-zero/ReductionProjects";
import { ScenarioComparison } from "@/components/net-zero/ScenarioComparison";
import { ScenarioCards } from "@/components/net-zero/ScenarioCards";

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

      <SummaryMetrics />

      <Tabs defaultValue="pathway" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pathway">Net Zero Pathway</TabsTrigger>
          <TabsTrigger value="projects">Reduction Projects</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="pathway" className="space-y-4">
          <EmissionsPathwayChart />
          <MilestonesTimeline />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <ReductionProjects />
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <ScenarioComparison />
          <ScenarioCards />
          
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
