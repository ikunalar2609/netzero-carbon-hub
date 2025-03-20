
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
            className="h-2.5 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor:
                status === "On Track" ? "#09AB75" : status === "At Risk" ? "#FFC745" : "#EA384C",
            }}
          ></div>
        </div>
        <span
          className="text-sm font-medium"
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Reduction Status</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <Category
          title="Transition to Electric Fleet"
          status="On Track"
          progress={78}
          target="Target: -15% by 2025"
          scope="Scope 1"
        />
        <Category
          title="Renewable Energy Implementation"
          status="On Track"
          progress={65}
          target="Target: 80% by 2026"
          scope="Scope 2"
        />
        <Category
          title="Sustainable Procurement"
          status="At Risk"
          progress={45}
          target="Target: -30% by 2027"
          scope="Scope 3"
        />
        <Category
          title="Waste Reduction"
          status="Behind"
          progress={25}
          target="Target: -40% by 2025"
          scope="Scope 3"
        />
      </CardContent>
    </Card>
  );
};

export default ReductionStatus;
