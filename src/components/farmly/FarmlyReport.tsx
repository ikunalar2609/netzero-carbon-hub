import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  BarChart3,
  TrendingDown,
  Leaf,
  Calendar,
  Building2,
  Globe,
  Printer,
  Share2,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Info,
  Database,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { type EmissionFactor } from "@/data/emissionFactors";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface FarmlyReportProps {
  factors: EmissionFactor[];
}

interface CalcRecord {
  id: string;
  calculation_type: string;
  input_data: any;
  result_data: any;
  total_emissions: number;
  created_at: string;
}

export const FarmlyReport = ({ factors }: FarmlyReportProps) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [reportPeriod, setReportPeriod] = useState("2024-Q4");
  const [calculations, setCalculations] = useState<CalcRecord[]>([]);
  const [loadingCalcs, setLoadingCalcs] = useState(true);

  // Fetch actual calculation history
  useEffect(() => {
    const fetchCalcs = async () => {
      setLoadingCalcs(true);
      try {
        const { data, error } = await supabase
          .from('emission_calculations')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(500);
        if (!error && data) setCalculations(data);
      } catch {} finally { setLoadingCalcs(false); }
    };
    fetchCalcs();
  }, []);

  // Derived data from factors for report
  const totalEFs = factors.length;
  const avgEF = factors.length > 0 ? (factors.reduce((s, f) => s + f.fe, 0) / factors.length).toFixed(3) : "0";

  // Actual calculation stats
  const totalCalcEmissions = calculations.reduce((s, c) => s + c.total_emissions, 0);
  const calcsByType = calculations.reduce((acc, c) => {
    acc[c.calculation_type] = (acc[c.calculation_type] || 0) + c.total_emissions;
    return acc;
  }, {} as Record<string, number>);

  const calcCountByType = calculations.reduce((acc, c) => {
    acc[c.calculation_type] = (acc[c.calculation_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const scopeBreakdown = factors.reduce((acc, f) => {
    const scope = f.scope.replace("scope", "Scope ");
    acc[scope] = (acc[scope] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryBreakdown = factors.reduce((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceBreakdown = factors.reduce((acc, f) => {
    acc[f.source] = (acc[f.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const regionBreakdown = factors.reduce((acc, f) => {
    acc[f.region] = (acc[f.region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const scopeData = Object.entries(scopeBreakdown).map(([name, value]) => ({ name, value }));
  const categoryData = Object.entries(categoryBreakdown).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const sourceData = Object.entries(sourceBreakdown).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const regionData = Object.entries(regionBreakdown).map(([name, value]) => ({ name, value }));

  // Top emitters
  const topEmitters = [...factors].sort((a, b) => b.fe - a.fe).slice(0, 10);

  // Real calculation type breakdown for pie chart
  const TYPE_COLORS: Record<string, string> = {
    flight: "#8B5CF6", vehicle: "#2563EB", energy: "#10B981", waste: "#F97316", diet: "#F97316",
    sea: "#0EA5E9", industry: "#DC2626", agriculture: "#84CC16", digital: "#06B6D4",
  };
  const calcTypeData = Object.entries(calcsByType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Math.round(value * 100) / 100,
    color: TYPE_COLORS[name] || "#64748B",
  }));

  // Monthly trend from real data
  const monthlyTrend = calculations.reduce((acc, c) => {
    const month = format(new Date(c.created_at), 'MMM yyyy');
    acc[month] = (acc[month] || 0) + c.total_emissions;
    return acc;
  }, {} as Record<string, number>);
  const trendData = Object.entries(monthlyTrend).reverse().slice(-12).map(([month, total]) => ({ month, total: Math.round(total * 100) / 100 }));

  const SCOPE_COLORS = ["#4F46E5", "#0EA5E9", "#F59E0B"];
  const CAT_COLORS = ["#4F46E5", "#0EA5E9", "#10B981", "#F59E0B", "#DC2626", "#8B5CF6", "#EC4899"];

  const handleDownload = () => {
    const csvRows = [
      ["Farmly Carbon Emissions Report", "", "", ""],
      ["Generated", new Date().toISOString(), "", ""],
      ["Period", reportPeriod, "", ""],
      ["Total Calculations", String(calculations.length), "", ""],
      ["Total Emissions", `${totalCalcEmissions.toFixed(2)} kgCO₂e`, "", ""],
      ["Total Emission Factors", String(totalEFs), "", ""],
      ["Average EF Value", avgEF, "", ""],
      ["", "", "", ""],
      ["=== CALCULATION HISTORY ===", "", "", ""],
      ["Type", "Emissions (kgCO₂e)", "Date", "Details"],
      ...calculations.map(c => [c.calculation_type, String(c.total_emissions.toFixed(2)), format(new Date(c.created_at), 'yyyy-MM-dd HH:mm'), JSON.stringify(c.input_data)]),
      ["", "", "", ""],
      ["=== EMISSIONS BY CATEGORY ===", "", "", ""],
      ...Object.entries(calcsByType).map(([k, v]) => [k, `${v.toFixed(2)} kgCO₂e`]),
      ["", "", "", ""],
      ["=== EMISSION FACTORS INVENTORY ===", "", "", ""],
      ["Name", "FE (kgCO₂e)", "Source", "Scope", "Category", "Region", "Perimeter"],
      ...factors.map(f => [f.name, String(f.fe), f.source, f.scope, f.category, f.region, f.perimeter]),
      ["", "", "", ""],
      ["=== MONTHLY TREND ===", "", "", ""],
      ["Month", "Total Emissions (kgCO₂e)"],
      ...trendData.map(d => [d.month, String(d.total)]),
    ];

    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `farmly-report-${reportPeriod}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded successfully");
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };

  return (
    <div ref={reportRef} className="space-y-6 print:space-y-4">
      {/* Report Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#DC2626]" />
            CARBON EMISSIONS REPORT
          </h2>
          <p className="text-[11px] text-gray-400 mt-1">
            Comprehensive analysis of emission factors and carbon footprint data
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <select
            value={reportPeriod}
            onChange={e => setReportPeriod(e.target.value)}
            className="h-8 px-3 text-[11px] font-medium border border-gray-200 rounded-lg bg-white text-gray-700"
          >
            <option value="2024-Q4">Q4 2024</option>
            <option value="2024-Q3">Q3 2024</option>
            <option value="2024-Q2">Q2 2024</option>
            <option value="2024-Q1">Q1 2024</option>
            <option value="2024-FY">FY 2024</option>
          </select>
          <button
            onClick={handlePrint}
            className="h-8 px-3 rounded-lg border border-gray-200 text-[10px] font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-1.5"
          >
            <Printer className="h-3 w-3" />
            PRINT
          </button>
          <button
            onClick={handleDownload}
            className="h-8 px-4 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[10px] font-bold tracking-wide transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Download className="h-3 w-3" />
            DOWNLOAD CSV
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "TOTAL EFs", value: String(totalEFs), icon: Leaf, accent: "from-[#4F46E5]/8 to-[#4F46E5]/3", iconBg: "bg-[#4F46E5]" },
          { label: "AVG EF VALUE", value: `${avgEF} kgCO₂e`, icon: BarChart3, accent: "from-[#0EA5E9]/8 to-[#0EA5E9]/3", iconBg: "bg-[#0EA5E9]" },
          { label: "SOURCES", value: String(Object.keys(sourceBreakdown).length), icon: Globe, accent: "from-[#10B981]/8 to-[#10B981]/3", iconBg: "bg-[#10B981]" },
          { label: "CATEGORIES", value: String(Object.keys(categoryBreakdown).length), icon: Building2, accent: "from-[#F59E0B]/8 to-[#F59E0B]/3", iconBg: "bg-[#F59E0B]" },
          { label: "PERIOD", value: reportPeriod, icon: Calendar, accent: "from-[#8B5CF6]/8 to-[#8B5CF6]/3", iconBg: "bg-[#8B5CF6]" },
        ].map(({ label, value, icon: Icon, accent, iconBg }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${accent} border border-gray-100 rounded-xl p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-6 h-6 rounded-md ${iconBg} flex items-center justify-center`}>
                <Icon className="h-3 w-3 text-white" />
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            </div>
            <span className="text-[16px] font-bold text-gray-900">{value}</span>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1: Scope + Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">SCOPE DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={scopeData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {scopeData.map((_, i) => <Cell key={i} fill={SCOPE_COLORS[i % SCOPE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">CATEGORY BREAKDOWN</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={55} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {categoryData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">EMISSIONS TREND (tCO₂e PER MONTH)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
            <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="scope1" name="Scope 1" stroke="#4F46E5" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="scope2" name="Scope 2" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="scope3" name="Scope 3" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Row 2: Source + Region */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">SOURCE DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">REGIONAL COVERAGE</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={regionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {regionData.map((_, i) => <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Emitters Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" />
            TOP 10 HIGHEST EMISSION FACTORS
          </h3>
          <span className="text-[10px] text-gray-400">Sorted by kgCO₂e value</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-5 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">#</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">FE</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unit</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Source</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Scope</th>
              <th className="px-5 py-2.5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Category</th>
            </tr>
          </thead>
          <tbody>
            {topEmitters.map((f, i) => (
              <motion.tr
                key={f.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-gray-50 hover:bg-[#4F46E5]/[0.02] transition-colors"
              >
                <td className="px-5 py-3 text-[11px] font-semibold text-gray-400">{i + 1}</td>
                <td className="px-5 py-3">
                  <span className="text-[12px] font-medium text-gray-800">
                    <span className="font-semibold text-[#4F46E5]">{f.name.split(" ")[0]}</span>{" "}
                    {f.name.split(" ").slice(1).join(" ")}
                  </span>
                </td>
                <td className="px-5 py-3 text-[12px] font-semibold text-[#DC2626]">{f.fe} kgCO₂e</td>
                <td className="px-5 py-3 text-[11px] text-gray-500">{f.unit}</td>
                <td className="px-5 py-3">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-gray-200 text-gray-600 bg-gray-50">
                    {f.source}
                  </span>
                </td>
                <td className="px-5 py-3 text-[11px] text-gray-500">{f.scope.replace("scope", "Scope ")}</td>
                <td className="px-5 py-3 text-[11px] text-gray-500">{f.category}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Key Finding</span>
          </div>
          <p className="text-[12px] text-blue-700 leading-relaxed">
            Scope 3 emissions represent the largest share of your carbon footprint. Focus on supply chain engagement and logistics optimization for maximum impact.
          </p>
        </div>

        <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-4 w-4 text-emerald-600" />
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Reduction Opportunity</span>
          </div>
          <p className="text-[12px] text-emerald-700 leading-relaxed">
            Switching to renewable energy sources could reduce Scope 2 emissions by up to 80%. Consider Power Purchase Agreements (PPAs) for long-term cost savings.
          </p>
        </div>

        <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Action Required</span>
          </div>
          <p className="text-[12px] text-amber-700 leading-relaxed">
            {topEmitters.length > 0 ? `${topEmitters[0].name} has the highest emission factor at ${topEmitters[0].fe} kgCO₂e. Prioritize alternatives or process improvements.` : "No high-impact factors identified in current dataset."}
          </p>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">METHODOLOGY & COMPLIANCE</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { standard: "GHG Protocol", status: "Aligned", ok: true },
            { standard: "IPCC AR6 GWP", status: "Active", ok: true },
            { standard: "ISO 14064", status: "Compliant", ok: true },
            { standard: "CBAM Regulation", status: "Monitored", ok: true },
            { standard: "SBTi Targets", status: "In Progress", ok: false },
            { standard: "TCFD Reporting", status: "Partial", ok: false },
            { standard: "CDP Disclosure", status: "Planned", ok: false },
            { standard: "EU Taxonomy", status: "Under Review", ok: false },
          ].map(({ standard, status, ok }) => (
            <div key={standard} className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-100 bg-gray-50/50">
              {ok ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              )}
              <div>
                <p className="text-[11px] font-semibold text-gray-700">{standard}</p>
                <p className={`text-[9px] font-medium ${ok ? "text-emerald-600" : "text-amber-600"}`}>{status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Footer */}
      <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-5 flex items-center justify-between print:border-t print:rounded-none">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Farmly Carbon Report</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} • 
            {" "}{totalEFs} emission factors analyzed • Period: {reportPeriod}
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }}
            className="h-7 px-3 rounded-md border border-gray-200 text-[10px] font-semibold text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
          >
            <Share2 className="h-3 w-3" />
            SHARE
          </button>
          <button
            onClick={handleDownload}
            className="h-7 px-3 rounded-md bg-[#DC2626] text-white text-[10px] font-bold tracking-wide hover:bg-[#B91C1C] transition-colors flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            EXPORT
          </button>
        </div>
      </div>
    </div>
  );
};
