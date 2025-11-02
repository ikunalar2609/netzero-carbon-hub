import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Clock, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CalculationRecord {
  id: string;
  calculationType: string;
  results: any;
  formData: any;
  timestamp: Date;
}

interface CalculationHistoryProps {
  onLoadCalculation: (record: CalculationRecord) => void;
  onAddToComparison: (record: CalculationRecord) => void;
}

export const CalculationHistory = ({ onLoadCalculation, onAddToComparison }: CalculationHistoryProps) => {
  const [history, setHistory] = useState<CalculationRecord[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const saved = localStorage.getItem('farmly-calculation-history');
    if (saved) {
      const parsed = JSON.parse(saved).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setHistory(parsed.sort((a: CalculationRecord, b: CalculationRecord) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      ));
    }
  };

  const saveCalculation = (record: CalculationRecord) => {
    const newHistory = [record, ...history.slice(0, 49)]; // Keep last 50 calculations
    setHistory(newHistory);
    localStorage.setItem('farmly-calculation-history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('farmly-calculation-history');
    toast.success("History cleared");
  };

  // Expose save function to parent
  useEffect(() => {
    (window as any).saveCalculationToHistory = saveCalculation;
    return () => {
      delete (window as any).saveCalculationToHistory;
    };
  }, [history]);

  if (history.length === 0) {
    return (
      <Card className="bg-muted/50 border-border">
        <CardContent className="p-6 text-center">
          <History className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No calculation history yet</p>
          <p className="text-sm text-muted-foreground mt-1">Complete a calculation to see it here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <History className="h-5 w-5" />
            Calculation History ({history.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="text-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {(isExpanded ? history : history.slice(0, 3)).map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-card rounded-xl border border-border hover:shadow-sm transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {record.calculationType}
                  </Badge>
                  <span className="text-lg font-semibold text-foreground">
                    {record.results.co2e_kg.toFixed(2)} kg CO2e
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {record.timestamp.toLocaleString()}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddToComparison(record)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Compare
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onLoadCalculation(record)}
                  className="text-xs"
                >
                  Load
                </Button>
              </div>
            </motion.div>
          ))}
          
          {!isExpanded && history.length > 3 && (
            <Button
              variant="ghost"
              className="w-full text-sm text-muted-foreground"
              onClick={() => setIsExpanded(true)}
            >
              Show {history.length - 3} more calculations
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};