
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const milestoneData = [
  { year: 2020, event: "Baseline Assessment", status: "completed" },
  { year: 2022, event: "25% Renewable Energy", status: "completed" },
  { year: 2023, event: "50% Electric Fleet", status: "completed" },
  { year: 2024, event: "75% Supplier Engagement", status: "inProgress" },
  { year: 2025, event: "30% Emissions Reduction", status: "planned" },
  { year: 2026, event: "45% Renewable Energy", status: "planned" },
  { year: 2028, event: "60% Emissions Reduction", status: "planned" },
  { year: 2030, event: "80% Emissions Reduction", status: "planned" },
  { year: 2035, event: "95% Emissions Reduction", status: "planned" },
  { year: 2040, event: "Net Zero Achievement", status: "planned" },
];

export const MilestonesTimeline = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Zero Milestones</CardTitle>
      </CardHeader>
      <CardContent className="px-0 py-0">
        <div className="relative">
          <div className="absolute left-1/2 top-0 h-full w-px bg-border transform -translate-x-1/2" />
          <div className="relative z-10">
            {milestoneData.map((milestone, index) => (
              <div key={index} className="flex items-center mb-8 last:mb-0">
                <div className="flex-1 text-right pr-10">
                  <span className="inline-block font-bold">{milestone.year}</span>
                </div>
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    milestone.status === "completed" 
                      ? "bg-brand-green-500 text-white" 
                      : milestone.status === "inProgress" 
                        ? "bg-brand-yellow-500 text-white" 
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {milestone.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-current" />
                  )}
                </div>
                <div className="flex-1 pl-10">
                  <p className="font-medium">{milestone.event}</p>
                  <p className="text-sm text-muted-foreground">
                    {milestone.status === "completed" 
                      ? "Completed" 
                      : milestone.status === "inProgress" 
                        ? "In Progress" 
                        : "Planned"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
