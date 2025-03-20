
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Info, 
  ArrowRight,
  BarChart3,
  CheckSquare,
  CircleDot,
  ExternalLink
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { useState } from "react";

// Import images
import impactMap from "../../../public/lovable-uploads/32501502-067c-46b3-b21c-5163509bf9ee.png";

const carbonImpactCategories = [
  {
    id: "directImpact",
    name: "Project Description",
    subcategories: [
      { name: "Methodology", status: "verified", info: "Uses verified GHG accounting methodology" },
      { name: "Standard/Registry", status: "verified", info: "Follows ISO 14064 standards for GHG inventories" },
      { name: "Third Party Review", status: "pending", info: "Independent verification in progress" },
      { name: "Location Coordinates", status: "verified", info: "Geographic boundaries properly defined and documented" },
    ]
  },
  {
    id: "carbonImpact",
    name: "Carbon Impact",
    subcategories: [
      { name: "Permanence", status: "verfied", info: "Carbon removal will be maintained for 40+ years" },
      { name: "Additionality", status: "verified", info: "Project would not have occurred without carbon financing" },
      { name: "CO2 Equation", status: "verified", info: "Accurate carbon accounting methodology validated" },
      { name: "Baseline", status: "verified", info: "Properly established baseline scenario" },
      { name: "Durability & Reversal Risks", status: "at-risk", info: "Some risk of carbon reversal in certain scenarios" },
      { name: "Mitigation Plan", status: "verified", info: "Comprehensive risk mitigation strategies in place" },
      { name: "Risks", status: "at-risk", info: "Some implementation risks identified" },
      { name: "Leakage", status: "verified", info: "Mechanisms to prevent carbon leakage implemented" },
    ]
  },
  {
    id: "beyondCarbon",
    name: "Beyond Carbon",
    subcategories: [
      { name: "Social", status: "verified", info: "Positive community impact verified" },
      { name: "Environmental", status: "verified", info: "Additional environmental co-benefits documented" },
      { name: "Governance & Policies", status: "pending", info: "Governance framework under review" },
      { name: "Economic", status: "verified", info: "Creates sustainable economic opportunities" },
      { name: "Capacity Building", status: "verified", info: "Local community training and education provided" },
      { name: "Human Rights", status: "verified", info: "Respects and protects human rights" },
      { name: "Welfare", status: "pending", info: "Welfare impact assessment in progress" },
      { name: "Biodiversity", status: "verified", info: "Positive biodiversity impacts documented" },
      { name: "Water & Air", status: "verified", info: "Improves water and air quality" },
      { name: "Soil & Land", status: "verified", info: "Soil health improvements measured" },
      { name: "Energy & Waste", status: "pending", info: "Energy efficiency and waste reduction metrics being developed" },
      { name: "Governance", status: "pending", info: "Governance structure assessment in progress" },
      { name: "Benefit Sharing", status: "verified", info: "Equitable benefit sharing mechanisms in place" },
      { name: "Policies", status: "pending", info: "Policy alignment under review" },
      { name: "Maintenance Management", status: "pending", info: "Long-term maintenance plan being developed" },
    ]
  },
  {
    id: "reportingProcess",
    name: "Reporting Process (MRV)",
    subcategories: [
      { name: "Reporting", status: "verified", info: "Comprehensive reporting framework implemented" },
      { name: "Measuring", status: "verified", info: "Robust measurement methodologies in place" },
      { name: "Verification", status: "pending", info: "Third-party verification process initiated" },
      { name: "Direct Effect", status: "verified", info: "Primary carbon impact properly quantified" },
      { name: "Indirect Effect", status: "at-risk", info: "Secondary effects need additional monitoring" },
    ]
  },
  {
    id: "qualityAssurance",
    name: "Quality Assurance",
    subcategories: [
      { name: "Reputation", status: "verified", info: "Project developer has strong track record" },
      { name: "Compliance", status: "verified", info: "Meets all regulatory requirements" },
      { name: "SDGs", status: "verified", info: "Contributes to multiple UN Sustainable Development Goals" },
      { name: "External Rating", status: "pending", info: "External rating/certification in progress" },
    ]
  }
];

const qualityScoreData = [
  { category: "Carbon Accounting", score: 92 },
  { category: "Additionality", score: 88 },
  { category: "Permanence", score: 85 },
  { category: "Co-Benefits", score: 94 },
  { category: "Verification", score: 90 },
  { category: "Overall", score: 90 },
];

const CarbonImpact = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getStatusColor = (status: string) => {
    switch(status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "at-risk":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "verified":
        return <CheckSquare className="h-3.5 w-3.5" />;
      case "pending":
        return <CircleDot className="h-3.5 w-3.5" />;
      case "at-risk":
        return <Info className="h-3.5 w-3.5" />;
      default:
        return <CircleDot className="h-3.5 w-3.5" />;
    }
  };

  const filteredCategories = selectedCategory === "all" 
    ? carbonImpactCategories 
    : carbonImpactCategories.filter(cat => cat.id === selectedCategory);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carbon Impact Assessment</h1>
          <p className="text-muted-foreground">Comprehensive evaluation of your carbon reduction initiatives</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <ExternalLink className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

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

      <Tabs defaultValue="framework" className="space-y-4">
        <TabsList>
          <TabsTrigger value="framework">Assessment Framework</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="compliance">Standards & Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="framework" className="space-y-4">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Carbon Impact Framework</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full">
                <img 
                  src={impactMap} 
                  alt="Carbon Impact Framework" 
                  className="w-full object-contain"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col space-y-2">
            <div className="bg-white border rounded-lg p-2">
              <div className="flex space-x-1 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300">
                <Button 
                  variant={selectedCategory === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="whitespace-nowrap"
                >
                  All Categories
                </Button>
                {carbonImpactCategories.map(category => (
                  <Button 
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredCategories.map(category => (
                <Card key={category.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {category.subcategories.map((subcat, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{subcat.name}</span>
                            <HoverCard>
                              <HoverCardTrigger>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                <p className="text-sm">{subcat.info}</p>
                              </HoverCardContent>
                            </HoverCard>
                          </div>
                          <Badge variant="outline" className={`flex items-center gap-1 ${getStatusColor(subcat.status)}`}>
                            {getStatusIcon(subcat.status)}
                            <span>
                              {subcat.status === "verified" 
                                ? "Verified" 
                                : subcat.status === "pending" 
                                  ? "Pending" 
                                  : "At Risk"}
                            </span>
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {qualityScoreData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.category}</span>
                        {item.category === "Overall" && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            High Quality
                          </Badge>
                        )}
                      </div>
                      <span className="font-bold">{item.score}/100</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div
                          style={{ width: `${item.score}%` }}
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                            item.score > 90
                              ? "bg-green-500"
                              : item.score > 75
                              ? "bg-blue-500"
                              : item.score > 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Key Quality Strengths</h3>
                  <ul className="space-y-1 list-disc pl-5">
                    <li>Strong additionality evidence with clear baseline</li>
                    <li>Comprehensive co-benefits with measurable impact</li>
                    <li>Rigorous third-party verification process</li>
                    <li>Well-documented carbon accounting methodology</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-red-800">Areas for Improvement</h3>
                  <ul className="space-y-1 list-disc pl-5 text-red-700">
                    <li>Enhance permanence with additional monitoring</li>
                    <li>Improve risk mitigation strategies for identified risks</li>
                    <li>Complete verification for pending assessment categories</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarbonImpact;
