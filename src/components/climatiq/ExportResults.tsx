import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface ExportResultsProps {
  results: any;
  calculationType: string;
  formData: any;
}

export const ExportResults = ({ results, calculationType, formData }: ExportResultsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const exportToCsv = () => {
    if (!results) return;
    
    const csvData = [
      ['Calculation Type', calculationType],
      ['CO2e Emissions (kg)', results.co2e_kg],
      ['Methodology', results.methodology],
      ['Confidence Level', results.confidence],
      ['Scope 1 (kg)', results.scope?.scope1],
      ['Scope 2 (kg)', results.scope?.scope2],
      ['Scope 3 (kg)', results.scope?.scope3],
      ['Trees to Plant', results.offsetSuggestion?.trees],
      ['Offset Cost (USD)', results.offsetSuggestion?.cost_usd],
      ['Car Km Equivalent', results.comparison?.car_km],
      ['Home Days Equivalent', results.comparison?.home_days],
      ['Timestamp', new Date().toISOString()]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emission-calculation-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success("Results exported as CSV");
    setIsOpen(false);
  };

  const exportToJson = () => {
    if (!results) return;
    
    const exportData = {
      calculationType,
      formData,
      results,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emission-calculation-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success("Results exported as JSON");
    setIsOpen(false);
  };

  if (!results) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="outline" className="rounded-xl">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={exportToCsv}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export as CSV
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={exportToJson}
          >
            <Code className="h-4 w-4 mr-2" />
            Export as JSON
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};