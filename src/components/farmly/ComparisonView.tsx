import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ComparisonItem {
  id: string;
  calculationType: string;
  results: any;
  formData: any;
  timestamp: Date;
}

interface ComparisonViewProps {
  onAddToComparison: (item: ComparisonItem) => void;
  comparisons: ComparisonItem[];
  onRemoveFromComparison: (id: string) => void;
}

export const ComparisonView = ({ 
  onAddToComparison, 
  comparisons, 
  onRemoveFromComparison 
}: ComparisonViewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (comparisons.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <Card className="bg-background border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ArrowLeftRight className="h-5 w-5" />
              Comparison View ({comparisons.length})
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comparisons.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="h-full bg-card border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            {item.calculationType}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {item.timestamp.toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveFromComparison(item.id)}
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-foreground">
                          {item.results.co2e_kg.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">kg CO2e</div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Methodology:</span>
                          <span className="text-foreground">{item.results.methodology}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Confidence:</span>
                          <Badge 
                            variant={item.results.confidence === 'high' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.results.confidence}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {comparisons.length >= 2 && (
              <div className="mt-6 p-4 bg-muted rounded-xl">
                <h4 className="font-semibold text-foreground mb-3">Comparison Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {Math.max(...comparisons.map(c => c.results.co2e_kg)).toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">Highest (kg CO2e)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {Math.min(...comparisons.map(c => c.results.co2e_kg)).toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">Lowest (kg CO2e)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {(comparisons.reduce((sum, c) => sum + c.results.co2e_kg, 0) / comparisons.length).toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">Average (kg CO2e)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {comparisons.reduce((sum, c) => sum + c.results.co2e_kg, 0).toFixed(2)}
                    </div>
                    <div className="text-muted-foreground">Total (kg CO2e)</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
};