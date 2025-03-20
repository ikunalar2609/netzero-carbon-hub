
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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

export const ImpactFramework = () => {
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
    <>
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
    </>
  );
};
