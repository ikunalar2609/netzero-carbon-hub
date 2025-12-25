import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plane, 
  Car, 
  Zap, 
  Trash2, 
  RefreshCw, 
  Download,
  Calendar,
  Filter
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EmissionCalculation {
  id: string;
  calculation_type: string;
  input_data: any;
  result_data: any;
  total_emissions: number;
  created_at: string;
}

export const CalculationHistoryTable = () => {
  const [calculations, setCalculations] = useState<EmissionCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");

  const fetchCalculations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('emission_calculations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (filterType !== "all") {
        query = query.eq('calculation_type', filterType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching calculations:', error);
        toast.error('Failed to load calculation history');
        return;
      }

      setCalculations(data || []);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to load calculation history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalculations();
  }, [filterType]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-4 w-4" />;
      case 'vehicle':
        return <Car className="h-4 w-4" />;
      case 'energy':
        return <Zap className="h-4 w-4" />;
      case 'diet':
        return <Trash2 className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'flight':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'vehicle':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'energy':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'diet':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const formatInputData = (type: string, data: Record<string, any>) => {
    switch (type) {
      case 'flight':
        return `${data.departureIata || 'N/A'} → ${data.arrivalIata || 'N/A'} (${data.passengers || 1} pax)`;
      case 'vehicle':
        return `${data.distance || 0} km | ${data.vehicle || data.fuelType || 'N/A'}`;
      case 'energy':
        return `${data.electricity || 0} kWh | ${data.gridType || 'mixed'}`;
      case 'diet':
        return `${data.amount || 0} kg | ${data.disposal || 'N/A'}`;
      default:
        return JSON.stringify(data).slice(0, 50) + '...';
    }
  };

  const exportToCSV = () => {
    if (calculations.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['ID', 'Type', 'Input Details', 'Emissions (kg CO₂e)', 'Date'];
    const rows = calculations.map(calc => [
      calc.id,
      calc.calculation_type,
      formatInputData(calc.calculation_type, calc.input_data),
      calc.total_emissions.toFixed(2),
      format(new Date(calc.created_at), 'yyyy-MM-dd HH:mm')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `emission_calculations_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    toast.success('CSV exported successfully');
  };

  const totalEmissions = calculations.reduce((sum, calc) => sum + calc.total_emissions, 0);
  const avgEmissions = calculations.length > 0 ? totalEmissions / calculations.length : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          <div className="relative">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Calculations</div>
            <div className="text-3xl font-bold text-gray-900">{calculations.length}</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
          <div className="relative">
            <div className="text-sm font-medium text-gray-500 mb-1">Total Emissions</div>
            <div className="text-3xl font-bold text-gray-900">{totalEmissions.toFixed(1)} <span className="text-lg text-gray-500">kg</span></div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/70 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
          <div className="relative">
            <div className="text-sm font-medium text-gray-500 mb-1">Avg. per Calculation</div>
            <div className="text-3xl font-bold text-gray-900">{avgEmissions.toFixed(1)} <span className="text-lg text-gray-500">kg</span></div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="diet">Diet/Waste</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchCalculations}
            className="rounded-xl"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
            className="rounded-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="rounded-2xl border-0 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
        <CardHeader className="bg-gray-50/50 border-b">
          <CardTitle className="text-lg font-semibold text-gray-900">Calculation History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : calculations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No calculations yet</p>
              <p className="text-sm">Start calculating emissions to see your history here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Details</TableHead>
                    <TableHead className="font-semibold text-right">Emissions</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calculations.map((calc, index) => (
                    <motion.tr
                      key={calc.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell>
                        <Badge className={`${getTypeBadgeColor(calc.calculation_type)} gap-1.5`}>
                          {getTypeIcon(calc.calculation_type)}
                          {calc.calculation_type.charAt(0).toUpperCase() + calc.calculation_type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">
                        {formatInputData(calc.calculation_type, calc.input_data)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-gray-900">{calc.total_emissions.toFixed(2)}</span>
                        <span className="text-gray-500 ml-1">kg CO₂e</span>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {format(new Date(calc.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
