
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const ScenarioCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <span>Current Plan</span>
            <Badge className="ml-2 bg-brand-green text-white">Active</Badge>
          </CardTitle>
          <CardDescription>Business-focused balanced approach</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Net Zero Target</p>
                <p className="text-sm font-medium">2040</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Investment Required</p>
                <p className="text-sm font-medium">$$ (Medium)</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Risk Level</p>
                <p className="text-sm font-medium">Medium</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Key Strategies</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>80% renewable energy by 2030</li>
                <li>Full fleet electrification by 2032</li>
                <li>Supply chain engagement program</li>
                <li>Carbon offsets for residual emissions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aggressive Plan</CardTitle>
          <CardDescription>Accelerated carbon reduction path</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Net Zero Target</p>
                <p className="text-sm font-medium">2035</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Investment Required</p>
                <p className="text-sm font-medium">$$$ (High)</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Risk Level</p>
                <p className="text-sm font-medium">High</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Key Strategies</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>100% renewable energy by 2027</li>
                <li>Full fleet electrification by 2026</li>
                <li>Mandatory supplier emissions targets</li>
                <li>Significant process redesign</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Moderate Plan</CardTitle>
          <CardDescription>Conservative approach with lower risk</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm">Net Zero Target</p>
                <p className="text-sm font-medium">2045</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Investment Required</p>
                <p className="text-sm font-medium">$ (Low)</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Risk Level</p>
                <p className="text-sm font-medium">Low</p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Key Strategies</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>60% renewable energy by 2035</li>
                <li>Gradual fleet electrification</li>
                <li>Voluntary supplier program</li>
                <li>Higher reliance on carbon offsets</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
