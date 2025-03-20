
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight } from "lucide-react";

const GoalsProgress = () => {
  const goals = [
    {
      id: 1,
      name: "Scope 1 & 2 Reduction",
      progress: 55,
      target: "50% by 2030",
      status: "On Track",
    },
    {
      id: 2,
      name: "Renewable Energy",
      progress: 72,
      target: "100% by 2028",
      status: "On Track",
    },
    {
      id: 3,
      name: "Supply Chain Engagement",
      progress: 38,
      target: "80% by 2030",
      status: "At Risk",
    },
    {
      id: 4,
      name: "Carbon Offsetting",
      progress: 15,
      target: "30% by 2025",
      status: "Behind",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Goals Progress</CardTitle>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <span>View All</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">{goal.name}</h4>
                <span 
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: goal.status === "On Track" 
                      ? "#E6F7F1" 
                      : goal.status === "At Risk" 
                        ? "#FFF8E6" 
                        : "#FFDEE2",
                    color: goal.status === "On Track" 
                      ? "#09AB75" 
                      : goal.status === "At Risk" 
                        ? "#FFC745" 
                        : "#EA384C"
                  }}
                >
                  {goal.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={goal.progress} className="h-2" />
                <span className="text-sm font-medium w-10">{goal.progress}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Target: {goal.target}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsProgress;
