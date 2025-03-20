
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3 } from "lucide-react";

export const StandardsCompliance = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Standards & Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">GHG Protocol Alignment</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Project follows the GHG Protocol Corporate Standard for emissions accounting.
              </p>
              <Badge className="bg-green-100 text-green-800 border-green-200">Fully Compliant</Badge>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">ISO 14064 Compliance</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Follows ISO 14064 standards for greenhouse gas accounting and verification.
              </p>
              <Badge className="bg-green-100 text-green-800 border-green-200">Certified</Badge>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Science Based Targets</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Reduction targets aligned with Science Based Targets initiative (SBTi).
              </p>
              <Badge className="bg-green-100 text-green-800 border-green-200">Validated</Badge>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold">Gold Standard</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Project meets Gold Standard certification requirements for carbon projects.
              </p>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Verification</Badge>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">UN Sustainable Development Goals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                SDG 7: Affordable Clean Energy
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                SDG 9: Industry & Infrastructure
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                SDG 11: Sustainable Cities
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                SDG 12: Responsible Consumption
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                SDG 13: Climate Action
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                SDG 15: Life on Land
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 justify-start">
                SDG 17: Partnerships for Goals
              </Badge>
            </div>
          </div>

          <Button className="w-full flex gap-1">
            <span>Generate Compliance Report</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
