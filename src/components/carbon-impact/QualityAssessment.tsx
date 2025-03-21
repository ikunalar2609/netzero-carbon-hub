
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { QualityScore } from "@/models/carbon-impact.model";
import { getQualityScores } from "@/services/carbon-impact.service";

export const QualityAssessment = () => {
  const [qualityScores, setQualityScores] = useState<QualityScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQualityScores = async () => {
      try {
        const data = await getQualityScores();
        setQualityScores(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load quality scores");
        setLoading(false);
      }
    };

    fetchQualityScores();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quality Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quality Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Find the overall score
  const overallScore = qualityScores.find(score => score.category === "Overall")?.score || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {qualityScores.map((item, index) => (
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
