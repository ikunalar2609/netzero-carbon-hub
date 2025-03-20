
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SummaryMetrics = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Current Reduction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">18.5%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Reduction from 2020 baseline
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Projected Year for Net Zero</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">2040</div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on current trajectory
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Active Reduction Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">12</div>
          <p className="text-xs text-muted-foreground mt-1">
            5 high impact, 7 medium impact
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
