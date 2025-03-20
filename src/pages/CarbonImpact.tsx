
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";

// Import refactored components
import { SummaryMetrics } from "@/components/carbon-impact/SummaryMetrics";
import { FrameworkMap } from "@/components/carbon-impact/FrameworkMap";
import { CategorySelector } from "@/components/carbon-impact/CategorySelector";
import { QualityAssessment } from "@/components/carbon-impact/QualityAssessment";
import { StandardsCompliance } from "@/components/carbon-impact/StandardsCompliance";

const CarbonImpact = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carbon Impact Assessment</h1>
          <p className="text-muted-foreground">Comprehensive evaluation of your carbon reduction initiatives</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <ExternalLink className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      <SummaryMetrics />

      <Tabs defaultValue="framework" className="space-y-4">
        <TabsList>
          <TabsTrigger value="framework">Assessment Framework</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="compliance">Standards & Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="framework" className="space-y-4">
          <FrameworkMap />
          <CategorySelector />
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <QualityAssessment />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <StandardsCompliance />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarbonImpact;
