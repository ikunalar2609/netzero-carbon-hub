import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClimate } from "@/context/ClimateContext";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryProps {
  title: string;
  status: string;
  progress: number;
  target: string;
  scope: string;
}

const Category = ({ title, status, progress, target, scope }: CategoryProps) => {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <h4 className="font-medium">{title}</h4>
          <Badge variant="outline" className="text-xs py-0 h-5">
            {scope}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{target}</p>
      </div>
      <div className="flex items-center space-x-3">
        <div className="w-32 bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(progress, 100)}%`,
              backgroundColor:
                status === "On Track" ? "#09AB75" : status === "At Risk" ? "#FFC745" : "#EA384C",
            }}
          ></div>
        </div>
        <span
          className="text-sm font-medium min-w-[70px] text-right"
          style={{
            color:
              status === "On Track" ? "#09AB75" : status === "At Risk" ? "#FFC745" : "#EA384C",
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

const ReductionStatus = () => {
  const { reductionLevers, loading } = useClimate();

  // Map reduction levers to status categories
  const categories = reductionLevers.map(lever => {
    const progress = lever.targetValue > 0 
      ? (lever.currentValue / lever.targetValue) * 100 
      : 0;
    
    let status = "On Track";
    if (progress < 50) status = "Behind";
    else if (progress < 75) status = "At Risk";

    const scopeMap: Record<string, string> = {
      fleet: "Scope 1",
      renewables: "Scope 2",
      suppliers: "Scope 3",
      efficiency: "Scope 2",
      offsets: "Scope 3",
    };

    return {
      title: lever.name,
      status: lever.enabled ? status : "Disabled",
      progress,
      target: `Target: ${lever.targetValue}% by 2030`,
      scope: scopeMap[lever.category] || "All",
    };
  }).filter(c => c.status !== "Disabled").slice(0, 4);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Reduction Status</CardTitle>
        </CardHeader>
        <CardContent className="px-6 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center justify-between py-3">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Reduction Status</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        {categories.length > 0 ? (
          categories.map((cat, idx) => (
            <Category key={idx} {...cat} />
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4">
            No reduction levers configured. Add data to see progress.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ReductionStatus;
