
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckSquare, CircleDot } from "lucide-react";

interface FrameworkCardProps {
  title: string;
  type: string;
  completeness: number;
  status: "complete" | "in-progress" | "pending";
}

const FrameworkCard = ({ title, type, completeness, status }: FrameworkCardProps) => {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg transition-colors hover:bg-muted/40">
      <div
        className={`shrink-0 w-2 h-14 rounded-full ${
          status === "complete"
            ? "bg-green-500"
            : status === "in-progress"
            ? "bg-amber-500"
            : "bg-gray-300"
        }`}
      />
      <div className="flex-1 space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium leading-none">{title}</h3>
            <Badge
              variant="outline"
              className="mt-1.5 font-normal text-xs whitespace-nowrap"
            >
              {type}
            </Badge>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              status === "complete"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : status === "in-progress"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            {completeness}% Complete
          </span>
        </div>
      </div>
    </div>
  );
};

const ReportingSection = () => (
  <div className="space-y-4">
    <FrameworkCard
      title="GHG Protocol Corporate Standard"
      type="Mandatory"
      completeness={100}
      status="complete"
    />
    <FrameworkCard
      title="TCFD Disclosure"
      type="Voluntary"
      completeness={85}
      status="in-progress"
    />
    <FrameworkCard
      title="CDP Climate Change Questionnaire"
      type="Voluntary"
      completeness={75}
      status="in-progress"
    />
  </div>
);

const ComplianceSection = () => (
  <div className="space-y-4">
    <FrameworkCard
      title="EU CSRD Compliance"
      type="Regulatory"
      completeness={90}
      status="in-progress"
    />
    <FrameworkCard
      title="UK SECR Requirements"
      type="Regulatory"
      completeness={100}
      status="complete"
    />
    <FrameworkCard
      title="California CARB Requirements"
      type="Regulatory"
      completeness={40}
      status="in-progress"
    />
  </div>
);

const StandardsSection = () => (
  <div className="space-y-4">
    <FrameworkCard
      title="ISO 14064-1:2018"
      type="Standard"
      completeness={65}
      status="in-progress"
    />
    <FrameworkCard
      title="ISO 14067:2018"
      type="Standard"
      completeness={30}
      status="pending"
    />
    <FrameworkCard
      title="PAS 2060 Carbon Neutrality"
      type="Standard"
      completeness={45}
      status="in-progress"
    />
  </div>
);

const ImpactFramework = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">
          Frameworks & Compliance
        </CardTitle>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <span>View All</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="pb-4">
        <Tabs defaultValue="reporting" className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="reporting" className="text-xs">
              <CheckSquare className="h-3.5 w-3.5 mr-1" />
              Reporting
            </TabsTrigger>
            <TabsTrigger value="compliance" className="text-xs">
              <CircleDot className="h-3.5 w-3.5 mr-1" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="standards" className="text-xs">
              <CircleDot className="h-3.5 w-3.5 mr-1" />
              Standards
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reporting">
            <ReportingSection />
          </TabsContent>
          <TabsContent value="compliance">
            <ComplianceSection />
          </TabsContent>
          <TabsContent value="standards">
            <StandardsSection />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImpactFramework;
