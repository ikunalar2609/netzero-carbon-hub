
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const qualityScoreData = [
  { category: "Carbon Accounting", score: 92 },
  { category: "Additionality", score: 88 },
  { category: "Permanence", score: 85 },
  { category: "Co-Benefits", score: 94 },
  { category: "Verification", score: 90 },
  { category: "Overall", score: 90 },
];

export const QualityAssessment = () => {
  return (
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
  );
};
