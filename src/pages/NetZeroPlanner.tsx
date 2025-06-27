
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Target, TrendingDown, Zap, Leaf, Factory, Truck, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import { SummaryMetrics } from "@/components/net-zero/SummaryMetrics";
import { MilestonesTimeline } from "@/components/net-zero/MilestonesTimeline";
import { ReductionProjects } from "@/components/net-zero/ReductionProjects";
import { EmissionsPathwayChart } from "@/components/net-zero/EmissionsPathwayChart";
import { ScenarioCards } from "@/components/net-zero/ScenarioCards";
import { StandardsCompliance } from "@/components/net-zero/StandardsCompliance";
import { ScenarioComparison } from "@/components/net-zero/ScenarioComparison";

const NetZeroPlanner = () => {
  const [selectedScenario, setSelectedScenario] = useState("moderate");
  const [targetYear, setTargetYear] = useState(2050);

  const scenarios = {
    conservative: { name: "Conservative", reduction: 45, cost: "Low", timeline: "Extended" },
    moderate: { name: "Moderate", reduction: 65, cost: "Medium", timeline: "Standard" },
    aggressive: { name: "Aggressive", reduction: 85, cost: "High", timeline: "Accelerated" }
  };

  const currentProgress = 23;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Net Zero Planner</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your pathway to carbon neutrality
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            <Target className="h-4 w-4 mr-2" />
            Target: {targetYear}
          </Badge>
        </div>
      </motion.div>

      <SummaryMetrics />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <EmissionsPathwayChart />
            <MilestonesTimeline />
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <ScenarioCards />
          <ScenarioComparison />
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          <ReductionProjects />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <StandardsCompliance />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NetZeroPlanner;
