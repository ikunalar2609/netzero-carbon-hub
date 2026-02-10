
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
    <Card className="bg-[#141414] border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-white">Goals Progress</CardTitle>
        <Button variant="outline" size="sm" className="h-8 gap-1 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">
          <span>View All</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-200">{goal.name}</h4>
                <span 
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: goal.status === "On Track" 
                      ? "rgba(16, 185, 129, 0.15)" 
                      : goal.status === "At Risk" 
                        ? "rgba(245, 158, 11, 0.15)" 
                        : "rgba(239, 68, 68, 0.15)",
                    color: goal.status === "On Track" 
                      ? "#10b981" 
                      : goal.status === "At Risk" 
                        ? "#f59e0b" 
                        : "#ef4444"
                  }}
                >
                  {goal.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${goal.progress}%`,
                      background: goal.status === "On Track" 
                        ? "linear-gradient(90deg, #10b981, #34d399)" 
                        : goal.status === "At Risk" 
                          ? "linear-gradient(90deg, #f59e0b, #fbbf24)" 
                          : "linear-gradient(90deg, #ef4444, #f87171)"
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-10 text-gray-300">{goal.progress}%</span>
              </div>
              <p className="text-xs text-gray-500">Target: {goal.target}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsProgress;
