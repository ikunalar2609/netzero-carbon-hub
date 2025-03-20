
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SummaryMetrics = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Overall Quality Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">90/100</div>
          <p className="text-xs text-muted-foreground mt-1">
            High quality carbon impact
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">Level 3</div>
          <p className="text-xs text-muted-foreground mt-1">
            Third-party verified
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Impact Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">42</div>
          <p className="text-xs text-muted-foreground mt-1">
            Assessment criteria analyzed
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
