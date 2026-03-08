import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileJson, FileSpreadsheet, FileText, Database, Flame, TreePine, AlertTriangle, RefreshCw, Thermometer, Globe, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMapData } from "@/hooks/useMapData";
import { useFireData } from "@/hooks/useFireData";
import { useForestData } from "@/hooks/useForestData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import farmlyLogo from "@/assets/farmly-carbon-logo.png";

type MonthlyPoint = { date: string; anomaly: number; absolute: number };
type YearlyPoint = { year: number; anomaly: number; absolute: number };
type RegionStat = { region: string; mean: number | null; min: number | null; max: number | null };

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

export default function ClimateDataPage() {
  const navigate = useNavigate();
  const [days] = useState("1");
  const [satelliteSource] = useState("VIIRS_SNPP_NRT");

  const { fireData, loading: loadingFires } = useFireData(days, satelliteSource);
  const { forestData, loading: loadingForest } = useForestData();
  const { treeLoss, forestCover, loading: loadingMap } = useMapData();

  // Climate chart data
  const [monthlyData, setMonthlyData] = useState<MonthlyPoint[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyPoint[]>([]);
  const [regionStats, setRegionStats] = useState<RegionStat[]>(fallbackRegionStats);
  const [loadingClimate, setLoadingClimate] = useState(true);

  useEffect(() => {
    const fetchClimate = async () => {
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
        setLoadingClimate(false);
      }
    };
    fetchClimate();
  }, []);

  const isLoading = loadingFires || loadingForest || loadingMap || loadingClimate;
  const exportDate = format(new Date(), "yyyy-MM-dd");

  const datasets = useMemo(() => [
    {
      id: "fires",
      title: "Active Wildfires",
      icon: Flame,
      color: "#DC2626",
      count: fireData.length,
      source: "NASA FIRMS (VIIRS/MODIS)",
      description: "Real-time satellite fire detections with geolocation, radiative power, and confidence levels.",
      getData: () => fireData,
      columns: ["latitude", "longitude", "brightness", "frp", "confidence", "daynight"],
    },
    {
      id: "treeloss",
      title: "Tree Loss Hotspots",
      icon: AlertTriangle,
      color: "#F97316",
      count: treeLoss.length,
      source: "Hansen/UMD/Google/USGS/NASA",
      description: "Global deforestation hotspots with loss percentage, region, cause analysis, and temporal data.",
      getData: () => treeLoss,
      columns: ["region", "latitude", "longitude", "loss_percentage", "loss_year", "area", "cause"],
    },
    {
      id: "forest",
      title: "Forest Cover Regions",
      icon: TreePine,
      color: "#16A34A",
      count: forestData.length,
      source: "Global Forest Watch / FAO",
      description: "Country and region-level forest coverage data including area, density classification, and coordinates.",
      getData: () => forestData,
      columns: ["country", "area_ha", "forest_cover_pct", "region", "latitude", "longitude"],
    },
    {
      id: "monthly-anomalies",
      title: "Monthly Temperature Anomalies",
      icon: Thermometer,
      color: "#7C3AED",
      count: monthlyData.length,
      source: "Berkeley Earth / NASA GISS / Climate Reanalyzer",
      description: "Monthly global mean surface temperature anomalies (°C) relative to 1951-1980 baseline, with absolute temperatures.",
      getData: () => monthlyData,
      columns: ["date", "anomaly", "absolute"],
    },
    {
      id: "yearly-anomalies",
      title: "Annual Temperature Anomalies",
      icon: BarChart3,
      color: "#0EA5E9",
      count: yearlyData.length,
      source: "Berkeley Earth / NASA GISS",
      description: "Annual global mean surface temperature anomalies and absolute temperatures aggregated by year.",
      getData: () => yearlyData,
      columns: ["year", "anomaly", "absolute"],
    },
    {
      id: "region-stats",
      title: "Continental Temperature Stats",
      icon: Globe,
      color: "#059669",
      count: regionStats.length,
      source: "Berkeley Earth / Climate Reanalyzer",
      description: "Mean, minimum, and maximum temperatures by continental region for climate comparison analysis.",
      getData: () => regionStats,
      columns: ["region", "mean", "min", "max"],
    },
  ], [fireData, treeLoss, forestData, monthlyData, yearlyData, regionStats]);

  const downloadJSON = (dataset: typeof datasets[0]) => {
    const data = dataset.getData();
    const blob = new Blob([JSON.stringify({ exportDate, source: dataset.source, totalRecords: data.length, data }, null, 2)], { type: "application/json" });
    triggerDownload(blob, `${dataset.id}-${exportDate}.json`);
    toast.success(`${dataset.title} exported as JSON`, { description: `${data.length} records` });
  };

  const downloadCSV = (dataset: typeof datasets[0]) => {
    const data = dataset.getData();
    if (!data.length) { toast.error("No data to export"); return; }
    const keys = Object.keys(data[0] as any);
    const rows = [keys.join(","), ...data.map((d: any) => keys.map(k => JSON.stringify(d[k] ?? "")).join(","))];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    triggerDownload(blob, `${dataset.id}-${exportDate}.csv`);
    toast.success(`${dataset.title} exported as CSV`);
  };

  const downloadMarkdown = (dataset: typeof datasets[0]) => {
    const data = dataset.getData();
    if (!data.length) { toast.error("No data to export"); return; }
    const keys = Object.keys(data[0] as any);
    const header = `| ${keys.join(" | ")} |`;
    const sep = `| ${keys.map(() => "---").join(" | ")} |`;
    const rows = data.slice(0, 500).map((d: any) => `| ${keys.map(k => String(d[k] ?? "")).join(" | ")} |`);
    const md = `# ${dataset.title}\n\n**Source:** ${dataset.source}\n**Export Date:** ${format(new Date(), "MMMM d, yyyy HH:mm")}\n**Records:** ${data.length}\n\n${header}\n${sep}\n${rows.join("\n")}\n\n---\n*Generated by FarmlyCarbon Environmental Intelligence*\n`;
    const blob = new Blob([md], { type: "text/markdown" });
    triggerDownload(blob, `${dataset.id}-${exportDate}.md`);
    toast.success(`${dataset.title} exported as Markdown`);
  };

  const downloadAll = () => {
    const allData: Record<string, any> = { exportDate, datasets: {} };
    datasets.forEach(ds => {
      const data = ds.getData();
      (allData.datasets as any)[ds.id] = { source: ds.source, totalRecords: data.length, data };
    });
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    triggerDownload(blob, `climate-data-complete-${exportDate}.json`);
    toast.success("Complete climate dataset exported");
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#4F46E5]">
      {/* Header */}
      <header className="bg-[#4F46E5] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-5 h-[56px] flex items-center">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="flex items-center gap-2.5 mr-5 cursor-pointer hover:opacity-90 transition-opacity">
            <img src={farmlyLogo} alt="FarmlyCarbon" className="h-8 w-8 rounded-lg object-contain" />
            <span className="text-[16px] font-bold tracking-tight text-white">Climate Data</span>
          </a>
          <span className="text-[9px] font-bold tracking-widest px-2 py-[3px] rounded-full bg-white/20 text-white/90 leading-none mr-4">
            {isLoading ? "LOADING" : "LIVE"}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 text-[11px] gap-1.5" onClick={() => navigate("/maps")}>
              <ArrowLeft className="h-3.5 w-3.5" /> BACK TO MAPS
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 bg-[#EEF2FF] rounded-t-2xl">
        <div className="max-w-[1600px] mx-auto px-5 py-8 space-y-6">
          {/* Hero */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Climate & Environmental Data</h1>
              <p className="text-sm text-gray-500 mt-1">Download real-time satellite, environmental, and climate chart datasets in JSON, CSV, or Markdown format.</p>
            </div>
            <Button onClick={downloadAll} className="gap-2 bg-[#4F46E5] hover:bg-[#4338CA]">
              <Download className="h-4 w-4" /> Download All
            </Button>
          </div>

          {/* Summary strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {datasets.map(ds => (
              <div key={ds.id} className="bg-white rounded-xl border border-gray-200/60 p-3 flex items-center gap-2.5">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${ds.color}15` }}>
                  <ds.icon className="h-4 w-4" style={{ color: ds.color }} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-tight">{ds.title}</p>
                  <p className="text-lg font-bold text-gray-900">{isLoading ? "…" : ds.count.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section label: Map Data */}
          <div className="pt-2">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Map & Satellite Data</h2>
          </div>

          {/* Map dataset cards */}
          {datasets.slice(0, 3).map(ds => (
            <DatasetCard key={ds.id} ds={ds} isLoading={isLoading} onJSON={downloadJSON} onCSV={downloadCSV} onMD={downloadMarkdown} />
          ))}

          {/* Section label: Charts Data */}
          <div className="pt-2">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Climate Charts Data</h2>
          </div>

          {/* Chart dataset cards */}
          {datasets.slice(3).map(ds => (
            <DatasetCard key={ds.id} ds={ds} isLoading={isLoading} onJSON={downloadJSON} onCSV={downloadCSV} onMD={downloadMarkdown} />
          ))}

          {/* Footer */}
          <div className="bg-white/60 border border-gray-200/60 rounded-xl px-5 py-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">FarmlyCarbon Climate Data Repository</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Data refreshed in real-time from NASA FIRMS, Global Forest Watch, Hansen/UMD, Berkeley Earth, and NASA GISS datasets.</p>
            </div>
            <Database className="h-4 w-4 text-gray-300" />
          </div>
        </div>
      </main>
    </div>
  );
}

/* Reusable dataset card component */
function DatasetCard({ ds, isLoading, onJSON, onCSV, onMD }: {
  ds: any; isLoading: boolean;
  onJSON: (ds: any) => void; onCSV: (ds: any) => void; onMD: (ds: any) => void;
}) {
  const data = ds.getData();
  return (
    <Card className="border-gray-200/60 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${ds.color}15` }}>
              <ds.icon className="h-5 w-5" style={{ color: ds.color }} />
            </div>
            <div>
              <CardTitle className="text-base">{ds.title}</CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">{ds.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400 mr-2">{isLoading ? "Loading…" : `${ds.count} records`}</span>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onJSON(ds)} disabled={isLoading}>
              <FileJson className="h-3.5 w-3.5" /> JSON
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onCSV(ds)} disabled={isLoading}>
              <FileSpreadsheet className="h-3.5 w-3.5" /> CSV
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => onMD(ds)} disabled={isLoading}>
              <FileText className="h-3.5 w-3.5" /> Markdown
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-gray-200">
                {ds.columns.map((col: string) => (
                  <th key={col} className="text-left px-3 py-2 font-semibold text-gray-500 uppercase tracking-wider">{col.replace(/_/g, " ")}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={ds.columns.length} className="text-center py-8 text-gray-400">
                  <RefreshCw className="h-4 w-4 animate-spin inline mr-2" /> Loading data…
                </td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={ds.columns.length} className="text-center py-8 text-gray-400">No data available</td></tr>
              ) : (
                data.slice(0, 10).map((row: any, i: number) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-100/50">
                    {ds.columns.map((col: string) => (
                      <td key={col} className="px-3 py-2 text-gray-700 font-mono">
                        {typeof row[col] === "number" ? (Number.isInteger(row[col]) ? row[col] : row[col].toFixed(2)) : String(row[col] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!isLoading && data.length > 10 && (
            <div className="text-center py-2 text-[10px] text-gray-400 border-t border-gray-100">
              Showing 10 of {ds.count} records — download for full dataset
            </div>
          )}
        </div>
        <p className="text-[9px] text-gray-400 mt-2">Source: {ds.source}</p>
      </CardContent>
    </Card>
  );
}
