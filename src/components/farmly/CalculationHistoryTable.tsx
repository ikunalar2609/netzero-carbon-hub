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
  Filter,
  X,
  Factory,
  Leaf,
  Lightbulb,
  Ship,
  Recycle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface EmissionCalculation {
  id: string;
  calculation_type: string;
  input_data: any;
  result_data: any;
  total_emissions: number;
  created_at: string;
  user_id: string | null;
}

export const CalculationHistoryTable = () => {
  const [calculations, setCalculations] = useState<EmissionCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

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

      if (dateFrom) {
        query = query.gte('created_at', dateFrom.toISOString());
      }

      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte('created_at', endOfDay.toISOString());
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
  }, [filterType, dateFrom, dateTo]);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('emission_calculations')
        .delete()
        .eq('id', deleteId);

      if (error) {
        console.error('Error deleting calculation:', error);
        toast.error('Failed to delete calculation');
        return;
      }

      setCalculations(prev => prev.filter(calc => calc.id !== deleteId));
      toast.success('Calculation deleted successfully');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to delete calculation');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const clearDateFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-4 w-4" />;
      case 'vehicle': return <Car className="h-4 w-4" />;
      case 'energy': return <Zap className="h-4 w-4" />;
      case 'waste': case 'diet': return <Recycle className="h-4 w-4" />;
      case 'sea': return <Ship className="h-4 w-4" />;
      case 'industry': return <Factory className="h-4 w-4" />;
      case 'agriculture': return <Leaf className="h-4 w-4" />;
      case 'digital': return <Lightbulb className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'flight': return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'vehicle': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'energy': return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'waste': case 'diet': return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      case 'sea': return 'bg-cyan-100 text-cyan-700 hover:bg-cyan-100';
      case 'industry': return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'agriculture': return 'bg-lime-100 text-lime-700 hover:bg-lime-100';
      case 'digital': return 'bg-teal-100 text-teal-700 hover:bg-teal-100';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'diet': return 'Waste';
      case 'sea': return 'Sea Freight';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
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
      case 'waste': case 'diet':
        return `${data.amount || 0} kg | ${data.disposal || 'N/A'}`;
      case 'sea':
        return `${data.originPort || 'N/A'} → ${data.destinationPort || 'N/A'} | ${data.weight || 0}t`;
      case 'industry':
        return `${(data.product || '').replace(/-/g, ' ')} | ${data.quantity || 0} ${data.unit || 'units'}`;
      case 'agriculture':
        return `${(data.activity || '').replace(/-/g, ' ')} | ${data.quantity || 0} ${data.unit || 'units'}`;
      case 'digital':
        return `${(data.activity || '').replace(/-/g, ' ')} | ${data.quantity || 0} ${data.unit || 'units'}`;
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
    <div className="space-y-4">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Calculation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this calculation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "TOTAL CALCULATIONS", value: calculations.length.toString(), accent: "#4F46E5" },
          { label: "TOTAL EMISSIONS", value: `${totalEmissions.toFixed(1)}`, unit: "kg CO₂e", accent: "#10B981" },
          { label: "AVG PER CALC", value: `${avgEmissions.toFixed(1)}`, unit: "kg CO₂e", accent: "#8B5CF6" },
        ].map((card) => (
          <div key={card.label} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">{card.label}</span>
            <div className="text-xl font-bold text-gray-900 leading-none mt-1">
              {card.value}
              {card.unit && <span className="text-[11px] font-medium text-gray-400 ml-1">{card.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[120px] h-8 rounded-md border-gray-200 text-[11px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="diet">Waste</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn("h-8 rounded-md text-[11px] border-gray-200", !dateFrom && "text-gray-400")}>
                  <Calendar className="mr-1.5 h-3 w-3" />
                  {dateFrom ? format(dateFrom, "MMM dd") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>
            <span className="text-[10px] text-gray-300">–</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className={cn("h-8 rounded-md text-[11px] border-gray-200", !dateTo && "text-gray-400")}>
                  <Calendar className="mr-1.5 h-3 w-3" />
                  {dateTo ? format(dateTo, "MMM dd") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className={cn("p-3 pointer-events-auto")} />
              </PopoverContent>
            </Popover>
            {(dateFrom || dateTo) && (
              <button onClick={clearDateFilters} className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors">
                <X className="h-3 w-3 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={fetchCalculations} className="h-8 px-3 rounded-md border border-gray-200 text-[10px] font-bold tracking-wide text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
            <RefreshCw className="h-3 w-3" /> REFRESH
          </button>
          <button onClick={exportToCSV} className="h-8 px-3 rounded-md border border-gray-200 text-[10px] font-bold tracking-wide text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
            <Download className="h-3 w-3" /> EXPORT CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-5 w-5 animate-spin text-gray-300" />
          </div>
        ) : calculations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Calendar className="h-8 w-8 mb-3 text-gray-300" />
            <p className="text-[12px] font-semibold text-gray-500">No calculations yet</p>
            <p className="text-[11px]">Use the Calculator tab to create your first calculation</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-500 py-2.5">Type</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-500 py-2.5">Details</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-500 py-2.5 text-right">Emissions</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-500 py-2.5">Date</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-500 py-2.5 w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calculations.map((calc, index) => (
                  <motion.tr
                    key={calc.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell className="py-2.5">
                      <Badge className={`${getTypeBadgeColor(calc.calculation_type)} gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md`}>
                        {getTypeIcon(calc.calculation_type)}
                        {calc.calculation_type.charAt(0).toUpperCase() + calc.calculation_type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-gray-600 py-2.5">
                      {formatInputData(calc.calculation_type, calc.input_data)}
                    </TableCell>
                    <TableCell className="text-right py-2.5">
                      <span className="font-semibold text-[12px] text-gray-900">{calc.total_emissions.toFixed(2)}</span>
                      <span className="text-[10px] text-gray-400 ml-1">kg</span>
                    </TableCell>
                    <TableCell className="text-[11px] text-gray-500 py-2.5">
                      {format(new Date(calc.created_at), 'MMM dd, HH:mm')}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <button
                        onClick={() => setDeleteId(calc.id)}
                        className="h-7 w-7 rounded-md flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};