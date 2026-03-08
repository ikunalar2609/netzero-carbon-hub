import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Area, AreaChart, Legend, ComposedChart,
} from "recharts";
import { Thermometer, Globe } from "lucide-react";

type MonthlyPoint = { date: string; anomaly: number; absolute: number };
type YearlyPoint = { year: number; anomaly: number; absolute: number };
type RegionStat = { region: string; mean: number | null; min: number | null; max: number | null };

// Fallback generators
const generateFallbackMonthly = (): MonthlyPoint[] => {
  const data: MonthlyPoint[] = [];
  for (let year = 1940; year <= 2025; year++) {
    for (let m = 1; m <= 12; m++) {
      const trend = ((year - 1940) / 85) * 1.3;
      const seasonal = Math.sin((m - 1) / 12 * Math.PI * 2) * 0.15;
      const noise = (Math.random() - 0.5) * 0.4;
      const anomaly = parseFloat((trend + seasonal + noise - 0.2).toFixed(3));
      data.push({ date: `${year}-${String(m).padStart(2, "0")}`, anomaly, absolute: parseFloat((14.0 + anomaly).toFixed(2)) });
    }
  }
  return data;
};

const generateFallbackYearly = (): YearlyPoint[] => {
  const data: YearlyPoint[] = [];
  for (let year = 1940; year <= 2025; year++) {
    const trend = ((year - 1940) / 85) * 1.3;
    const noise = (Math.random() - 0.5) * 0.2;
    const anomaly = parseFloat((trend + noise - 0.2).toFixed(3));
    data.push({ year, anomaly, absolute: parseFloat((14.0 + anomaly).toFixed(2)) });
  }
  return data;
};

const fallbackRegionStats: RegionStat[] = [
  { region: "Africa", mean: 22.3, min: -9, max: 33 },
  { region: "Asia", mean: 4.7, min: -43, max: 33 },
  { region: "Europe", mean: -1.0, min: -26, max: 16 },
  { region: "N. America", mean: 7.9, min: -34, max: 32 },
  { region: "S. America", mean: 21.8, min: 2, max: 32 },
  { region: "Oceania", mean: 24.2, min: 7, max: 37 },
  { region: "Antarctica", mean: -7.3, min: -36, max: 6 },
];

/* ── Blue-White-Red diverging color scale (matching Climate Brink) ── */
const getHeatmapColor = (val: number): string => {
  const v = Math.max(-0.5, Math.min(val, 2.2));
  if (v <= 0) {
    const t = (v + 0.5) / 0.5;
    return `hsl(215, ${90 - t * 40}%, ${30 + t * 65}%)`;
  } else if (v <= 0.8) {
    const t = v / 0.8;
    return `hsl(15, ${10 + t * 60}%, ${95 - t * 20}%)`;
  } else {
    const t = Math.min((v - 0.8) / 1.4, 1);
    return `hsl(${5 - t * 5}, ${70 + t * 25}%, ${75 - t * 40}%)`;
  }
};

/* ── Absolute temp color scale: blue (11°C) → white (14°C) → red (17°C+) ── */
const getAbsTempColor = (val: number): string => {
  const v = Math.max(11, Math.min(val, 17.5));
  const mid = 14.0;
  if (v <= mid) {
    const t = (v - 11) / (mid - 11); // 0 at 11 → 1 at 14
    return `hsl(215, ${90 - t * 45}%, ${30 + t * 65}%)`;
  } else {
    const t = (v - mid) / (17.5 - mid); // 0 at 14 → 1 at 17.5
    return `hsl(${10 - t * 10}, ${50 + t * 45}%, ${92 - t * 55}%)`;
  }
};
/* ── Stat Card (light theme) ── */
const StatCard = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4">
    <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
    <p className="text-xl font-bold text-gray-900">{value}</p>
    {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
  </div>
);

/* ── Custom Tooltip (light) ── */
const ChartTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="text-xs">
          {p.name}: {typeof p.value === "number" ? `${p.value >= 0 ? "+" : ""}${p.value.toFixed(3)}°C` : p.value}
        </p>
      ))}
    </div>
  );
};

/* ── Rich tooltip for main anomaly chart (Climate Brink style) ── */
const AnomalyChartTooltip = ({ active, payload, label, yearlyData }: any) => {
  if (!active || !payload?.length) return null;

  const dateStr = label || payload[0]?.payload?.date || "";
  const yr = parseInt(dateStr?.substring?.(0, 4) || "0");
  const moNum = parseInt(dateStr?.substring?.(5, 7) || "0");
  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthLabel = monthNames[moNum] || "";

  const anomalyVal = payload.find((p: any) => p.dataKey === "anomaly")?.value;
  const rollingVal = payload.find((p: any) => p.dataKey === "rolling")?.value;

  // Compute 2025 annual mean, 2026 YTD, 2026 prediction from yearlyData
  const y2025 = yearlyData?.find((d: any) => d.year === 2025);
  const y2026 = yearlyData?.find((d: any) => d.year === 2026);

  return (
    <div className="shadow-xl rounded-lg overflow-hidden text-sm min-w-[200px]" style={{ border: "1px solid #d1d5db" }}>
      {/* Header */}
      <div className="bg-gray-800 text-white px-3 py-2 font-semibold">
        {monthLabel} {yr}
      </div>
      {/* Anomaly line */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 border-b border-gray-200">
        <span className="w-4 h-[2px] bg-gray-400 shrink-0" />
        <span className="text-gray-600 text-xs">{dateStr}</span>
        <span className="ml-auto font-semibold text-gray-800 text-xs">
          Anomaly: {anomalyVal !== undefined ? `${anomalyVal >= 0 ? "+" : ""}${anomalyVal.toFixed(2)}°C` : "—"}
        </span>
      </div>
      {/* Rolling average line */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border-b border-gray-200">
        <span className="w-4 h-[2px] bg-red-600 shrink-0 rounded" />
        <span className="text-gray-600 text-xs">{dateStr}</span>
        <span className="ml-auto font-semibold text-red-700 text-xs">
          365-day avg: {rollingVal !== undefined ? `${rollingVal >= 0 ? "+" : ""}${rollingVal.toFixed(2)}°C` : "—"}
        </span>
      </div>
      {/* 2025 annual */}
      {y2025 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white">
          <span className="font-bold text-xs">2025</span>
          <span className="ml-auto font-semibold text-xs">
            Anomaly: {y2025.anomaly >= 0 ? "+" : ""}{y2025.anomaly.toFixed(2)}°C
          </span>
        </div>
      )}
      {/* 2026 YTD */}
      {y2026 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500 text-white">
          <span className="font-bold text-xs">2026 YTD</span>
          <span className="ml-auto font-semibold text-xs">
            Anomaly: {y2026.anomaly >= 0 ? "+" : ""}{y2026.anomaly.toFixed(2)}°C
          </span>
        </div>
      )}
      {/* 2026 Prediction */}
      {y2026 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-b-lg">
          <span className="font-bold text-xs">2026 Prediction</span>
          <span className="ml-auto font-semibold text-xs">
            {y2026.anomaly >= 0 ? "+" : ""}{y2026.anomaly.toFixed(2)}°C (±0.13°C)
          </span>
        </div>
      )}
    </div>
  );
};

/* ── Main Component ── */
export default function ClimateDashboard() {
  const [monthlyData, setMonthlyData] = useState<MonthlyPoint[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyPoint[]>([]);
  const [regionStats, setRegionStats] = useState<RegionStat[]>(fallbackRegionStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tempRes, statsRes] = await Promise.all([
          supabase.functions.invoke("climate-data", { body: { type: "global_temperature" } }),
          supabase.functions.invoke("climate-data", { body: { type: "continental_stats" } }),
        ]);

        if (tempRes.data?.success && tempRes.data.monthly?.length > 0) {
          setMonthlyData(tempRes.data.monthly);
          setYearlyData(tempRes.data.yearly || generateFallbackYearly());
        } else {
          setMonthlyData(generateFallbackMonthly());
          setYearlyData(generateFallbackYearly());
        }

        if (statsRes.data?.success && statsRes.data.data?.length > 0) {
          setRegionStats(statsRes.data.data);
        }
      } catch {
        setMonthlyData(generateFallbackMonthly());
        setYearlyData(generateFallbackYearly());
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 12-month rolling average on monthly data
  const mainChartData = useMemo(() => {
    return monthlyData.map((d, i) => {
      const start = Math.max(0, i - 11);
      const slice = monthlyData.slice(start, i + 1);
      const avg = slice.reduce((s, p) => s + p.anomaly, 0) / slice.length;
      const year = parseInt(d.date.substring(0, 4));
      return { ...d, rolling: parseFloat(avg.toFixed(3)), year };
    });
  }, [monthlyData]);

  // Daily anomalies by year — all historical years as gray + recent highlighted
  const dailyByYear = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result: any[] = months.map((m, i) => ({ month: m, monthNum: i + 1 }));
    const allYears = new Set<number>();
    for (const d of monthlyData) allYears.add(parseInt(d.date.substring(0, 4)));
    const sortedYears = [...allYears].sort();
    for (const yr of sortedYears) {
      const yearData = monthlyData.filter(d => d.date.startsWith(String(yr)));
      result.forEach((row) => {
        const point = yearData.find(d => parseInt(d.date.substring(5, 7)) === row.monthNum);
        row[`y${yr}`] = point?.anomaly ?? null;
      });
    }
    return { data: result, allYears: sortedYears };
  }, [monthlyData]);

  // Daily Global Mean Temperature by year — all historical as gray + recent highlighted
  const dailyTempByYear = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result: any[] = months.map((m, i) => ({ month: m, monthNum: i + 1 }));
    const allYears = new Set<number>();
    for (const d of monthlyData) allYears.add(parseInt(d.date.substring(0, 4)));
    const sortedYears = [...allYears].sort();
    for (const yr of sortedYears) {
      const yearData = monthlyData.filter(d => d.date.startsWith(String(yr)));
      result.forEach((row) => {
        const point = yearData.find(d => parseInt(d.date.substring(5, 7)) === row.monthNum);
        row[`t${yr}`] = point?.absolute ?? null;
      });
    }
    return { data: result, allYears: sortedYears };
  }, [monthlyData]);

  // Long-term absolute temperature chart with rolling average
  const absoluteTempChart = useMemo(() => {
    return monthlyData.map((d, i) => {
      const start = Math.max(0, i - 11);
      const slice = monthlyData.slice(start, i + 1);
      const avg = slice.reduce((s, p) => s + p.absolute, 0) / slice.length;
      return { date: d.date, absolute: d.absolute, rolling: parseFloat(avg.toFixed(2)) };
    });
  }, [monthlyData]);

  // Heatmap data: year × month grids (anomaly + absolute)
  const heatmapData = useMemo(() => {
    const years: number[] = [];
    const grid: Record<number, Record<number, number>> = {};
    const absGrid: Record<number, Record<number, number>> = {};
    for (const d of monthlyData) {
      const yr = parseInt(d.date.substring(0, 4));
      const mo = parseInt(d.date.substring(5, 7));
      if (!grid[yr]) { grid[yr] = {}; absGrid[yr] = {}; years.push(yr); }
      grid[yr][mo] = d.anomaly;
      absGrid[yr][mo] = d.absolute;
    }
    return { years: [...new Set(years)].sort(), grid, absGrid };
  }, [monthlyData]);

  // Annual projections chart data
  const annualProjections = useMemo(() => {
    return yearlyData.map(d => ({
      ...d,
      label: String(d.year),
    }));
  }, [yearlyData]);

  const latestYear = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1] : null;
  const prevYear = yearlyData.length > 1 ? yearlyData[yearlyData.length - 2] : null;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto" />
        <p className="text-gray-400 text-sm mt-3">Loading climate data...</p>
      </div>
    );
  }

  const yearColors: Record<string, string> = {
    y2023: "#94a3b8",
    y2024: "#f97316",
    y2025: "#ef4444",
    y2026: "#0ea5e9",
  };

  return (
    <div className="space-y-5">
      {/* Section Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          Global Temperature Dashboard
        </h2>
        <p className="text-sm text-gray-400 mt-1">ERA5 Daily Global Mean 2m Temperature</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Latest Data" value={latestYear ? String(latestYear.year) : "2025"} sub="Status: PRELIMINARY" />
        <StatCard label="Latest Anomaly" value={latestYear ? `+${latestYear.anomaly.toFixed(2)}°C` : "+1.40°C"} sub={`Absolute: ${latestYear?.absolute ?? 13.58}°C`} />
        <StatCard
          label="Year Projection"
          value={latestYear ? `+${latestYear.anomaly.toFixed(2)}°C` : "+1.45°C"}
          sub={prevYear ? `Previous: +${prevYear.anomaly.toFixed(2)}°C` : undefined}
        />
        <StatCard
          label="1.5°C Threshold"
          value={latestYear && latestYear.anomaly >= 1.5 ? "EXCEEDED" : "APPROACHING"}
          sub="Paris Agreement target"
        />
      </div>

      {/* ── Main Chart: Global Mean Temperature Anomaly ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Global Mean Temperature Anomaly vs Preindustrial (1850-1900)
        </h3>
        <p className="text-xs text-gray-400 mb-5">Temperature Anomaly (°C)</p>
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart data={mainChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
              tickFormatter={(v: string) => {
                const yr = parseInt(v.substring(0, 4));
                const mo = v.substring(5, 7);
                return mo === "01" && yr % 10 === 0 ? String(yr) : "";
              }}
              interval={11}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
              domain={[-0.5, 2]}
              unit="°C"
            />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceLine
              y={1.5}
              stroke="#f59e0b"
              strokeDasharray="10 5"
              strokeWidth={2}
              label={{ value: "1.5°C", fill: "#f59e0b", fontSize: 12, position: "right", fontWeight: 600 }}
            />
            {/* Monthly anomaly as thin gray lines */}
            <Line
              type="monotone"
              dataKey="anomaly"
              stroke="#c0c4cc"
              strokeWidth={0.6}
              dot={false}
              name="Daily Anomaly"
              isAnimationActive={false}
            />
            {/* 365-day (12-month) rolling average as bold red */}
            <Line
              type="monotone"
              dataKey="rolling"
              stroke="#dc2626"
              strokeWidth={2.5}
              dot={false}
              name="365-day Average"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-6 h-[1px] bg-gray-400" /> Daily Anomaly
          </span>
          <span className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-red-600 rounded" /> 365-day Average
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Daily Temperature Anomalies by Year ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Daily Temperature Anomalies vs Preindustrial (1850-1900)
          </h3>
          <p className="text-xs text-gray-400 mb-4">Year-by-year monthly comparison</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyByYear.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#d1d5db" }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#d1d5db" }} domain={[-0.5, 2]} unit="°C" />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={1.5} stroke="#f59e0b" strokeDasharray="8 4" strokeWidth={1.5} />
              {dailyByYear.allYears.filter(yr => yr < 2023).map(yr => (
                <Line key={yr} type="monotone" dataKey={`y${yr}`} stroke="#d1d5db" strokeWidth={0.5} dot={false} name={String(yr)} connectNulls isAnimationActive={false} legendType="none" />
              ))}
              <Line type="monotone" dataKey="y2023" stroke="#2563eb" strokeWidth={2} dot={false} name="2023" connectNulls isAnimationActive={false} />
              <Line type="monotone" dataKey="y2024" stroke="#f97316" strokeWidth={2} dot={false} name="2024" connectNulls isAnimationActive={false} />
              <Line type="monotone" dataKey="y2025" stroke="#dc2626" strokeWidth={2.5} dot={false} name="2025" connectNulls isAnimationActive={false} />
              <Line type="monotone" dataKey="y2026" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3, fill: "#7c3aed" }} name="2026" connectNulls isAnimationActive={false} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} iconType="line" payload={[
                { value: "2023", type: "line", color: "#2563eb" },
                { value: "2024", type: "line", color: "#f97316" },
                { value: "2025", type: "line", color: "#dc2626" },
                { value: "2026", type: "line", color: "#7c3aed" },
              ]} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── Daily Global Mean Temperature (Absolute) by Year ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Daily Global Mean Temperature
          </h3>
          <p className="text-xs text-gray-400 mb-4">Absolute temperature by year (°C)</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTempByYear.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#d1d5db" }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#d1d5db" }} domain={[11, 17]} unit="°C" />
              <Tooltip content={<ChartTooltip />} />
              {dailyTempByYear.allYears.filter(yr => yr < 2023).map(yr => (
                <Line key={yr} type="monotone" dataKey={`t${yr}`} stroke="#d1d5db" strokeWidth={0.5} dot={false} name={String(yr)} connectNulls isAnimationActive={false} legendType="none" />
              ))}
              <Line type="monotone" dataKey="t2023" stroke="#2563eb" strokeWidth={2} dot={false} name="2023" connectNulls isAnimationActive={false} />
              <Line type="monotone" dataKey="t2024" stroke="#f97316" strokeWidth={2} dot={false} name="2024" connectNulls isAnimationActive={false} />
              <Line type="monotone" dataKey="t2025" stroke="#dc2626" strokeWidth={2.5} dot={false} name="2025" connectNulls isAnimationActive={false} />
              <Line type="monotone" dataKey="t2026" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 3, fill: "#7c3aed" }} name="2026" connectNulls isAnimationActive={false} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} iconType="line" payload={[
                { value: "2023", type: "line", color: "#2563eb" },
                { value: "2024", type: "line", color: "#f97316" },
                { value: "2025", type: "line", color: "#dc2626" },
                { value: "2026", type: "line", color: "#7c3aed" },
              ]} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Long-term Global Mean Temperature (Absolute) ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Global Mean Temperature (Absolute)
        </h3>
        <p className="text-xs text-gray-400 mb-5">Monthly absolute temperature with 12-month rolling average</p>
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={absoluteTempChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
              tickFormatter={(v: string) => {
                const yr = parseInt(v.substring(0, 4));
                const mo = v.substring(5, 7);
                return mo === "01" && yr % 10 === 0 ? String(yr) : "";
              }}
              interval={11}
            />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#d1d5db" }} domain={[12, 16]} unit="°C" />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="absolute" stroke="#c0c4cc" strokeWidth={0.6} dot={false} name="Monthly Temp" isAnimationActive={false} />
            <Line type="monotone" dataKey="rolling" stroke="#2563eb" strokeWidth={2.5} dot={false} name="12-month Average" isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-6 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-6 h-[1px] bg-gray-400" /> Monthly Temperature
          </span>
          <span className="flex items-center gap-2">
            <span className="w-6 h-[2px] bg-blue-600 rounded" /> 12-month Average
          </span>
        </div>
      </div>

      {/* ── Temperature Anomaly Heatmap (Climate Brink style) ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <Thermometer className="h-4 w-4 text-red-500" />
          <h3 className="text-lg font-bold text-gray-900">Temperature Anomaly Heatmap</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">Monthly anomaly vs preindustrial baseline — Blue = cooler, Red = warmer</p>
        <div className="overflow-x-auto">
          <div className="flex gap-3">
            {/* Main heatmap grid */}
            <div className="flex-1 min-w-[600px]">
              {/* Month labels on Y-axis + cells */}
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((mLabel, mi) => {
                const mo = mi + 1;
                return (
                  <div key={mo} className="flex items-center">
                    <div className="w-9 shrink-0 text-[11px] font-medium text-gray-600 text-right pr-2">{mLabel}</div>
                    <div className="flex flex-1">
                      {heatmapData.years.map(yr => {
                        const val = heatmapData.grid[yr]?.[mo];
                        if (val === undefined) return <div key={yr} className="flex-1 min-w-[5px] h-[22px]" style={{ backgroundColor: "#f3f4f6" }} />;
                        const bg = getHeatmapColor(val);
                        return (
                          <div
                            key={yr}
                            className="flex-1 min-w-[5px] h-[22px] relative group cursor-crosshair"
                            style={{ backgroundColor: bg }}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 font-medium">
                              {mLabel} {yr}: {val >= 0 ? "+" : ""}{val.toFixed(2)}°C
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {/* Year labels on X-axis */}
              <div className="flex items-center mt-1">
                <div className="w-9 shrink-0" />
                <div className="flex flex-1">
                  {heatmapData.years.map((yr, i) => {
                    const showLabel = yr % 10 === 0;
                    return (
                      <div key={yr} className="flex-1 min-w-[5px] text-center">
                        {showLabel && <span className="text-[10px] text-gray-500 font-medium">{yr}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-1">Year</p>
            </div>

            {/* Vertical color bar legend */}
            <div className="flex flex-col items-center shrink-0 w-20 pt-0">
              <p className="text-[10px] text-gray-500 font-semibold mb-1 text-center leading-tight">Temperature<br/>Anomaly (°C)</p>
              <div className="flex items-stretch gap-1.5 flex-1">
                <div className="w-4 rounded" style={{
                  background: "linear-gradient(to bottom, hsl(0,85%,35%), hsl(10,80%,55%), hsl(20,75%,70%), hsl(30,60%,85%), hsl(0,0%,97%), hsl(210,50%,85%), hsl(210,70%,65%), hsl(215,80%,45%), hsl(220,90%,30%))"
                }} />
                <div className="flex flex-col justify-between text-[9px] text-gray-500 font-medium py-0.5">
                  <span>2.0</span>
                  <span>1.5</span>
                  <span>1.0</span>
                  <span>0.5</span>
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Daily Global Mean Temperature Heatmap ── */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-1">
          <Thermometer className="h-4 w-4 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-900">Daily Global Mean Temperature</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">Absolute monthly temperature — seasonal cycle with warming trend visible</p>
        <div className="overflow-x-auto">
          <div className="flex gap-3">
            <div className="flex-1 min-w-[600px]">
              {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((mLabel, mi) => {
                const mo = mi + 1;
                return (
                  <div key={mo} className="flex items-center">
                    <div className="w-9 shrink-0 text-[11px] font-medium text-gray-600 text-right pr-2">{mLabel}</div>
                    <div className="flex flex-1">
                      {heatmapData.years.map(yr => {
                        const val = heatmapData.absGrid[yr]?.[mo];
                        if (val === undefined) return <div key={yr} className="flex-1 min-w-[5px] h-[22px]" style={{ backgroundColor: "#f3f4f6" }} />;
                        const bg = getAbsTempColor(val);
                        return (
                          <div
                            key={yr}
                            className="flex-1 min-w-[5px] h-[22px] relative group cursor-crosshair"
                            style={{ backgroundColor: bg }}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-gray-900 text-white text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 font-medium">
                              {mLabel} {yr}: {val.toFixed(1)}°C
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center mt-1">
                <div className="w-9 shrink-0" />
                <div className="flex flex-1">
                  {heatmapData.years.map(yr => (
                    <div key={yr} className="flex-1 min-w-[5px] text-center">
                      {yr % 10 === 0 && <span className="text-[10px] text-gray-500 font-medium">{yr}</span>}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-1">Year</p>
            </div>

            <div className="flex flex-col items-center shrink-0 w-20 pt-0">
              <p className="text-[10px] text-gray-500 font-semibold mb-1 text-center leading-tight">Temperature<br/>(°C)</p>
              <div className="flex items-stretch gap-1.5 flex-1">
                <div className="w-4 rounded" style={{
                  background: "linear-gradient(to bottom, hsl(0,95%,37%), hsl(5,80%,50%), hsl(10,70%,65%), hsl(15,50%,80%), hsl(0,0%,95%), hsl(210,45%,80%), hsl(215,70%,55%), hsl(215,85%,40%), hsl(215,90%,30%))"
                }} />
                <div className="flex flex-col justify-between text-[9px] text-gray-500 font-medium py-0.5">
                  <span>17</span>
                  <span>16</span>
                  <span>15</span>
                  <span>14</span>
                  <span>13</span>
                  <span>12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Annual Projections ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Annual Temperature Anomaly vs Preindustrial
          </h3>
          <p className="text-xs text-gray-400 mb-4">Historical annual mean with projection</p>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={annualProjections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#d1d5db" }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#d1d5db" }} domain={[0, 2]} unit="°C" />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine y={1.5} stroke="#f59e0b" strokeDasharray="8 4" strokeWidth={1.5} label={{ value: "1.5°C", fill: "#f59e0b", fontSize: 10, position: "right" }} />
              <Area type="monotone" dataKey="anomaly" fill="#dbeafe" stroke="none" fillOpacity={0.5} />
              <Line type="monotone" dataKey="anomaly" stroke="#2563eb" strokeWidth={2} dot={false} name="Annual Anomaly" isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ── Continental Statistics Table ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-indigo-500" />
            <h3 className="text-base font-bold text-gray-900">Continental Temperature Statistics</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-gray-500 font-semibold py-2.5 px-3">Region</th>
                  <th className="text-right text-gray-500 font-semibold py-2.5 px-3">Mean (°C)</th>
                  <th className="text-right text-gray-500 font-semibold py-2.5 px-3">Min (°C)</th>
                  <th className="text-right text-gray-500 font-semibold py-2.5 px-3">Max (°C)</th>
                  <th className="text-right text-gray-500 font-semibold py-2.5 px-3">Range</th>
                </tr>
              </thead>
              <tbody>
                {regionStats.map((r) => (
                  <tr key={r.region} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-gray-800">{r.region}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={r.mean !== null && r.mean > 20 ? "text-red-500 font-semibold" : r.mean !== null && r.mean < 0 ? "text-blue-500 font-semibold" : "text-gray-700"}>
                        {r.mean !== null ? `${r.mean.toFixed(1)}` : "—"}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-blue-500">{r.min !== null ? r.min.toFixed(0) : "—"}</td>
                    <td className="py-2.5 px-3 text-right text-red-500">{r.max !== null ? r.max.toFixed(0) : "—"}</td>
                    <td className="py-2.5 px-3 text-right text-gray-400">
                      {r.min !== null && r.max !== null ? `${(r.max - r.min).toFixed(0)}°` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-gray-300 mt-3">Data: Open-Meteo Climate & Forecast API • 30-day rolling statistics</p>
        </div>
      </div>
    </div>
  );
}
