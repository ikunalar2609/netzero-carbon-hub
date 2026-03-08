import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, TreePine, AlertTriangle, Globe, Satellite, Clock, MapPin, Leaf, TrendingDown, BarChart3, RefreshCw } from "lucide-react";
import { Map, MapMarker, MapControls, MapGeoJSONLayer, MapHeatmapLayer, MapGridOverlay } from "@/components/ui/map";
import {
  parseForestExcel,
  ForestData,
  getForestIntensity,
  formatHectares,
} from "@/utils/parseForestData";
import { useMapData } from "@/hooks/useMapData";

/* -------------------- Types ----------------------- */
interface FireData {
  latitude: number;
  longitude: number;
  frp: number;
  acq_date: string;
  satellite: string;
  confidence: string | number;
}

interface TreeLossData {
  region: string;
  latitude: number;
  longitude: number;
  lossPercentage: number;
  lossYear: string;
  area: string;
  cause: string;
}

/* -------------------- Regions -------------------- */
const regions: Record<
  string,
  { center: [number, number]; zoom: number }
> = {
  all: { center: [0, 20], zoom: 1.5 },
  africa: { center: [20, 0], zoom: 2.5 },
  asia: { center: [100, 30], zoom: 2.5 },
  europe: { center: [15, 50], zoom: 3 },
  "north-america": { center: [-100, 45], zoom: 2.5 },
  "south-america": { center: [-60, -15], zoom: 2.5 },
  oceania: { center: [140, -25], zoom: 3 },
};

/* -------------------- Fallback Forest Data -------------------- */
const fallbackForestData: ForestData[] = [
  { iso: 'BRA', country: 'Brazil', gfc_extent_ha: 492000000, area_ha: 851600000, latitude: -14.24, longitude: -51.93 },
  { iso: 'RUS', country: 'Russia', gfc_extent_ha: 815000000, area_ha: 1710000000, latitude: 61.52, longitude: 105.32 },
  { iso: 'CAN', country: 'Canada', gfc_extent_ha: 347000000, area_ha: 998500000, latitude: 56.13, longitude: -106.35 },
  { iso: 'USA', country: 'United States', gfc_extent_ha: 310000000, area_ha: 937300000, latitude: 37.09, longitude: -95.71 },
  { iso: 'CHN', country: 'China', gfc_extent_ha: 208000000, area_ha: 960000000, latitude: 35.86, longitude: 104.20 },
  { iso: 'COD', country: 'DR Congo', gfc_extent_ha: 152000000, area_ha: 234500000, latitude: -4.04, longitude: 21.76 },
  { iso: 'AUS', country: 'Australia', gfc_extent_ha: 134000000, area_ha: 769200000, latitude: -25.27, longitude: 133.78 },
  { iso: 'IDN', country: 'Indonesia', gfc_extent_ha: 91000000, area_ha: 191000000, latitude: -0.79, longitude: 113.92 },
  { iso: 'PER', country: 'Peru', gfc_extent_ha: 72000000, area_ha: 128500000, latitude: -9.19, longitude: -75.02 },
  { iso: 'IND', country: 'India', gfc_extent_ha: 70000000, area_ha: 328700000, latitude: 20.59, longitude: 78.96 },
  { iso: 'MEX', country: 'Mexico', gfc_extent_ha: 66000000, area_ha: 196400000, latitude: 23.63, longitude: -102.55 },
  { iso: 'COL', country: 'Colombia', gfc_extent_ha: 59000000, area_ha: 114200000, latitude: 4.57, longitude: -74.30 },
  { iso: 'ARG', country: 'Argentina', gfc_extent_ha: 29000000, area_ha: 278000000, latitude: -38.42, longitude: -63.62 },
  { iso: 'BOL', country: 'Bolivia', gfc_extent_ha: 50000000, area_ha: 109900000, latitude: -16.29, longitude: -63.59 },
  { iso: 'VEN', country: 'Venezuela', gfc_extent_ha: 47000000, area_ha: 91600000, latitude: 6.42, longitude: -66.59 },
  { iso: 'MYS', country: 'Malaysia', gfc_extent_ha: 22000000, area_ha: 33000000, latitude: 4.21, longitude: 101.98 },
  { iso: 'PNG', country: 'Papua New Guinea', gfc_extent_ha: 33000000, area_ha: 46300000, latitude: -6.31, longitude: 143.96 },
  { iso: 'MMR', country: 'Myanmar', gfc_extent_ha: 29000000, area_ha: 67700000, latitude: 21.92, longitude: 95.96 },
  { iso: 'AGO', country: 'Angola', gfc_extent_ha: 58000000, area_ha: 124700000, latitude: -11.20, longitude: 17.87 },
  { iso: 'MOZ', country: 'Mozambique', gfc_extent_ha: 38000000, area_ha: 80200000, latitude: -18.67, longitude: 35.53 },
  { iso: 'TZA', country: 'Tanzania', gfc_extent_ha: 46000000, area_ha: 94500000, latitude: -6.37, longitude: 34.89 },
  { iso: 'ZMB', country: 'Zambia', gfc_extent_ha: 44000000, area_ha: 75300000, latitude: -13.13, longitude: 27.85 },
  { iso: 'SWE', country: 'Sweden', gfc_extent_ha: 28000000, area_ha: 45000000, latitude: 60.13, longitude: 18.64 },
  { iso: 'FIN', country: 'Finland', gfc_extent_ha: 22000000, area_ha: 33800000, latitude: 61.92, longitude: 25.75 },
  { iso: 'JPN', country: 'Japan', gfc_extent_ha: 25000000, area_ha: 37800000, latitude: 36.20, longitude: 138.25 },
  { iso: 'GAB', country: 'Gabon', gfc_extent_ha: 22000000, area_ha: 26800000, latitude: -0.80, longitude: 11.61 },
  { iso: 'CMR', country: 'Cameroon', gfc_extent_ha: 19000000, area_ha: 47500000, latitude: 7.37, longitude: 12.35 },
  { iso: 'CAF', country: 'Central African Republic', gfc_extent_ha: 22000000, area_ha: 62300000, latitude: 6.61, longitude: 20.94 },
  { iso: 'COG', country: 'Congo', gfc_extent_ha: 22000000, area_ha: 34200000, latitude: -0.23, longitude: 15.83 },
  { iso: 'ECU', country: 'Ecuador', gfc_extent_ha: 12000000, area_ha: 28400000, latitude: -1.83, longitude: -78.18 },
  { iso: 'GUY', country: 'Guyana', gfc_extent_ha: 18000000, area_ha: 21500000, latitude: 4.86, longitude: -58.93 },
  { iso: 'SUR', country: 'Suriname', gfc_extent_ha: 15000000, area_ha: 16400000, latitude: 3.92, longitude: -56.03 },
  { iso: 'LAO', country: 'Laos', gfc_extent_ha: 16000000, area_ha: 23700000, latitude: 19.86, longitude: 102.50 },
  { iso: 'KHM', country: 'Cambodia', gfc_extent_ha: 10000000, area_ha: 18100000, latitude: 12.57, longitude: 104.99 },
  { iso: 'THA', country: 'Thailand', gfc_extent_ha: 16000000, area_ha: 51300000, latitude: 15.87, longitude: 100.99 },
  { iso: 'VNM', country: 'Vietnam', gfc_extent_ha: 14000000, area_ha: 33100000, latitude: 14.06, longitude: 108.28 },
  { iso: 'NOR', country: 'Norway', gfc_extent_ha: 12000000, area_ha: 38500000, latitude: 60.47, longitude: 8.47 },
  { iso: 'DEU', country: 'Germany', gfc_extent_ha: 11000000, area_ha: 35740000, latitude: 51.17, longitude: 10.45 },
  { iso: 'FRA', country: 'France', gfc_extent_ha: 17000000, area_ha: 64000000, latitude: 46.23, longitude: 2.21 },
  { iso: 'ESP', country: 'Spain', gfc_extent_ha: 18000000, area_ha: 50600000, latitude: 40.46, longitude: -3.75 },
];

/* -------------------- Tree Loss Data Type for DB -------------------- */
interface TreeLossFromDB {
  id: string;
  region: string;
  latitude: number;
  longitude: number;
  loss_percentage: number;
  loss_year: string;
  area: string;
  cause: string;
}

/* -------------------- Markers -------------------- */
const FireMarker = ({ fire }: { fire: FireData }) => {
  const color =
    fire.frp > 50
      ? "bg-red-500"
      : fire.frp > 20
      ? "bg-yellow-400"
      : "bg-green-400";

  return (
    <div className="relative group">
      <div
        className={`w-3 h-3 rounded-full border border-white/30 ${color}`}
      />
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-[11px] px-3 py-2 rounded-md whitespace-nowrap z-[9999] shadow-xl border border-white/20">
        <div className="font-medium">{fire.satellite}</div>
        <div>
          {fire.acq_date} • FRP {fire.frp.toFixed(1)} MW
        </div>
      </div>
    </div>
  );
};

const ForestMarker = ({ forest }: { forest: ForestData }) => {
  const intensity = getForestIntensity(forest.gfc_extent_ha);
  const color =
    intensity === "high"
      ? "bg-green-700"
      : intensity === "medium"
      ? "bg-green-500"
      : "bg-green-300";

  return (
    <div className="relative group">
      <div
        className={`w-3 h-3 rounded-full border border-white/20 ${color}`}
      />
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white text-gray-800 text-[11px] px-2 py-1 rounded shadow whitespace-nowrap z-50">
        <div className="font-medium">{forest.country}</div>
        <div>{formatHectares(forest.gfc_extent_ha)}</div>
      </div>
    </div>
  );
};

const TreeLossMarkerDB = ({ data }: { data: TreeLossFromDB }) => {
  const intensity = data.loss_percentage > 20 ? "critical" : data.loss_percentage > 15 ? "high" : "moderate";
  const colorMap = {
    critical: "bg-red-600",
    high: "bg-orange-500",
    moderate: "bg-yellow-500"
  };
  const sizeMap = {
    critical: "w-4 h-4",
    high: "w-3.5 h-3.5",
    moderate: "w-3 h-3"
  };

  return (
    <div className="relative group">
      {intensity === "critical" && (
        <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-40" style={{ width: 20, height: 20, marginLeft: -2, marginTop: -2 }} />
      )}
      <div
        className={`${sizeMap[intensity]} rounded-full border-2 border-white/80 ${colorMap[intensity]} shadow-lg`}
        style={{ boxShadow: intensity === "critical" ? "0 0 12px rgba(239, 68, 68, 0.6)" : "0 0 8px rgba(0,0,0,0.3)" }}
      />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-[11px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50 border border-gray-700">
        <div className="font-semibold text-orange-400 mb-1">{data.region}</div>
        <div className="text-gray-300">Loss: <span className="text-white font-medium">{data.loss_percentage}%</span></div>
        <div className="text-gray-300">Period: <span className="text-white">{data.loss_year}</span></div>
        <div className="text-gray-300">Area: <span className="text-white">{data.area}</span></div>
        <div className="text-gray-300">Cause: <span className="text-yellow-400">{data.cause}</span></div>
      </div>
    </div>
  );
};

/* -------------------- Main Component -------------------- */
export default function MapsMinimal() {
  const navigate = useNavigate();
  const [activeMapTab, setActiveMapTab] = useState<"wildfire" | "forest" | "treeloss">("wildfire");
  const [fireData, setFireData] = useState<FireData[]>([]);
  const [forestData, setForestData] = useState<ForestData[]>([]);
  const [loadingFires, setLoadingFires] = useState(false);
  const [loadingForest, setLoadingForest] = useState(false);

  const [days, setDays] = useState("1");
  const [satelliteSource, setSatelliteSource] =
    useState("VIIRS_SNPP_NRT");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const lastFetchRef = useRef(0);

  // Lazy-loaded map data from database
  const { forestCover: dbForestCover, treeLoss: dbTreeLoss, loading: loadingMapData } = useMapData();

  /* -------------------- Fire Fetch (Optimized) -------------------- */
  const fetchFireData = useCallback(async (d: string, src: string) => {
    if (Date.now() - lastFetchRef.current < 2000) return;
    lastFetchRef.current = Date.now();

    const controller = new AbortController();
    setLoadingFires(true);

    try {
      const res = await fetch(
        `https://iokkwxjkvzgstkkbwnoa.supabase.co/functions/v1/nasa-firms?days=${d}&source=${src}&area=world&limit=5000`,
        { signal: controller.signal }
      );

      if (!res.ok) throw new Error("API failed");

      const json = await res.json();
      const fires = (json.fires || []).slice(0, 3000); // HARD CAP
      setFireData(fires);
    } catch (e: any) {
      if (e.name !== "AbortError") {
        console.error("Fire fetch failed", e);
        setFireData([]);
      }
    } finally {
      setLoadingFires(false);
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    fetchFireData(days, satelliteSource);
  }, [days, satelliteSource, fetchFireData]);

  /* -------------------- Forest Load with Fallback -------------------- */
  useEffect(() => {
    const loadForest = async () => {
      setLoadingForest(true);
      try {
        const data = await parseForestExcel("/data/global_forest_data.xlsx");
        const cleaned = (data || []).filter((d) => d.latitude && d.longitude);
        if (cleaned.length > 0) {
          setForestData(cleaned);
        } else {
          // Use fallback data if Excel parsing fails or returns empty
          setForestData(fallbackForestData);
        }
      } catch (e) {
        console.error("Forest load failed, using fallback:", e);
        setForestData(fallbackForestData);
      } finally {
        setLoadingForest(false);
      }
    };
    loadForest();
  }, []);

  /* -------------------- Memoized Markers -------------------- */
  const fireMarkers = useMemo(
    () =>
      fireData.map((f, i) => (
        <MapMarker
          key={i}
          longitude={f.longitude}
          latitude={f.latitude}
        >
          <FireMarker fire={f} />
        </MapMarker>
      )),
    [fireData]
  );

  const forestMarkers = useMemo(
    () =>
      forestData.map((f, i) => (
        <MapMarker
          key={i}
          longitude={f.longitude!}
          latitude={f.latitude!}
        >
          <ForestMarker forest={f} />
        </MapMarker>
      )),
    [forestData]
  );

  const treeLossMarkers = useMemo(
    () =>
      dbTreeLoss.map((d, i) => (
        <MapMarker
          key={d.id || i}
          longitude={d.longitude}
          latitude={d.latitude}
        >
          <TreeLossMarkerDB data={d} />
        </MapMarker>
      )),
    [dbTreeLoss]
  );

  // Stats for tree loss
  const treeLossStats = useMemo(() => {
    const critical = dbTreeLoss.filter(d => d.loss_percentage > 20).length;
    const high = dbTreeLoss.filter(d => d.loss_percentage > 15 && d.loss_percentage <= 20).length;
    const avgLoss = dbTreeLoss.length > 0 
      ? dbTreeLoss.reduce((sum, d) => sum + d.loss_percentage, 0) / dbTreeLoss.length 
      : 0;
    return { critical, high, avgLoss, total: dbTreeLoss.length };
  }, [dbTreeLoss]);

  const region = regions[selectedRegion] || regions.all;

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-[#EEF2FF] text-gray-900">
      {/* ── Indigo Top Navigation ── */}
      <header className="bg-[#4338CA] shadow-lg">
        <div className="max-w-[1400px] mx-auto px-5 h-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1.5 text-indigo-200 hover:text-white transition-colors text-[11px] font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              HOME
            </button>
            <div className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-300" />
              <span className="text-[14px] font-extrabold text-white tracking-tight">
                Environmental Maps
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filters */}
            <select
              className="h-7 px-2 text-[10px] font-bold bg-white/10 border border-white/20 rounded-md text-white backdrop-blur-sm"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            >
              <option value="1" className="text-gray-900">24 hours</option>
              <option value="2" className="text-gray-900">48 hours</option>
              <option value="7" className="text-gray-900">7 days</option>
            </select>
            <select
              className="h-7 px-2 text-[10px] font-bold bg-white/10 border border-white/20 rounded-md text-white backdrop-blur-sm"
              value={satelliteSource}
              onChange={(e) => setSatelliteSource(e.target.value)}
            >
              <option value="VIIRS_SNPP_NRT" className="text-gray-900">VIIRS SNPP</option>
              <option value="VIIRS_NOAA20_NRT" className="text-gray-900">VIIRS NOAA-20</option>
              <option value="MODIS_NRT" className="text-gray-900">MODIS</option>
            </select>
            <select
              className="h-7 px-2 text-[10px] font-bold bg-white/10 border border-white/20 rounded-md text-white backdrop-blur-sm"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="all" className="text-gray-900">Global</option>
              <option value="asia" className="text-gray-900">Asia</option>
              <option value="africa" className="text-gray-900">Africa</option>
              <option value="europe" className="text-gray-900">Europe</option>
              <option value="north-america" className="text-gray-900">N. America</option>
              <option value="south-america" className="text-gray-900">S. America</option>
              <option value="oceania" className="text-gray-900">Oceania</option>
            </select>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-[1400px] mx-auto px-5 py-5 space-y-4">
        {/* Summary Metric Strip */}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { label: "TOTAL FIRES", value: String(fireData.length), icon: Flame, accent: "#DC2626", gradient: "from-[#DC2626]/8 to-[#DC2626]/2", iconBg: "bg-[#DC2626]/10" },
            { label: "HIGH INTENSITY", value: String(fireData.filter((f) => f.frp > 50).length), icon: AlertTriangle, accent: "#F97316", gradient: "from-[#F97316]/8 to-[#F97316]/2", iconBg: "bg-[#F97316]/10" },
            { label: "FOREST RECORDS", value: String(forestData.length), icon: TreePine, accent: "#10B981", gradient: "from-[#10B981]/8 to-[#10B981]/2", iconBg: "bg-[#10B981]/10" },
            { label: "LOSS HOTSPOTS", value: String(treeLossStats.total), icon: TrendingDown, accent: "#8B5CF6", gradient: "from-[#8B5CF6]/8 to-[#8B5CF6]/2", iconBg: "bg-[#8B5CF6]/10" },
            { label: "AVG LOSS RATE", value: `${treeLossStats.avgLoss.toFixed(1)}%`, icon: BarChart3, accent: "#0EA5E9", gradient: "from-[#0EA5E9]/8 to-[#0EA5E9]/2", iconBg: "bg-[#0EA5E9]/10" },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} border border-gray-200/60 rounded-xl p-3 cursor-default`}
              >
                <div className="absolute -right-2 -top-2 w-12 h-12 rounded-full opacity-[0.07]" style={{ backgroundColor: card.accent }} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] font-extrabold tracking-[0.15em] text-gray-400 uppercase">{card.label}</span>
                    <div className={`w-6 h-6 rounded-md ${card.iconBg} flex items-center justify-center`}>
                      <Icon className="h-3 w-3" style={{ color: card.accent }} />
                    </div>
                  </div>
                  <span className="text-xl font-extrabold text-gray-900 tracking-tight leading-none">{card.value}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Card with Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab bar */}
          <div className="px-4 pt-3 pb-0 flex items-center gap-2 border-b border-gray-100 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {[
              { id: "wildfire" as const, label: "WILDFIRE", icon: Flame, color: "bg-[#DC2626] text-white" },
              { id: "forest" as const, label: "FOREST COVER", icon: TreePine, color: "bg-[#10B981] text-white" },
              { id: "treeloss" as const, label: "TREE LOSS", icon: AlertTriangle, color: "bg-[#F97316] text-white" },
            ].map((tab) => {
              const isActive = activeMapTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMapTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold tracking-wide rounded-t-lg transition-all whitespace-nowrap ${
                    isActive ? `${tab.color} shadow-sm` : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}

            <div className="flex-1" />
            <div className="flex items-center gap-1.5 pb-2">
              <span className="text-[9px] font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1">
                <Satellite className="h-3 w-3" />
                {loadingFires || loadingForest || loadingMapData ? (
                  <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3 animate-spin" /> Loading…</span>
                ) : "Live Data"}
              </span>
            </div>
          </div>

          {/* Map Content */}
          <div className="relative">
            {activeMapTab === "wildfire" && (
              <div>
                <div className="h-[480px] relative">
                  <Map
                    center={[0, 20]}
                    zoom={1.8}
                    theme="dark"
                    className="absolute inset-0"
                  >
                    <MapControls showZoom position="top-right" />
                    {fireMarkers}
                  </Map>
                  {/* Overlay info */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <Flame className="h-3 w-3 text-red-400" />
                    <span className="font-bold">{fireData.length}</span> active fires •
                    <span className="text-red-400 font-bold">{fireData.filter((f) => f.frp > 50).length}</span> high intensity
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center gap-5 text-[10px] text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> FRP &gt; 50 MW</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" /> FRP 20-50 MW</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" /> FRP &lt; 20 MW</span>
                  <span className="ml-auto text-[9px] text-gray-300">Source: NASA FIRMS</span>
                </div>
              </div>
            )}

            {activeMapTab === "forest" && (
              <div>
                <div className="h-[480px] relative">
                  <Map
                    center={region.center}
                    zoom={region.zoom}
                    theme="light"
                    className="absolute inset-0"
                  >
                    <MapControls showZoom position="top-right" />
                    {forestMarkers}
                  </Map>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-2">
                    <TreePine className="h-3 w-3 text-green-600" />
                    <span className="font-bold">{forestData.length}</span> countries tracked
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center gap-5 text-[10px] text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-700" /> &gt; 50M ha</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> &gt; 10M ha</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-300" /> &lt; 10M ha</span>
                  <span className="ml-auto text-[9px] text-gray-300">Source: Global Forest Watch</span>
                </div>
              </div>
            )}

            {activeMapTab === "treeloss" && (
              <div>
                <div className="h-[480px] relative">
                  <Map
                    center={[0, 20]}
                    zoom={1.5}
                    theme="dark"
                    className="absolute inset-0"
                  >
                    <MapControls showZoom position="top-right" />
                    {treeLossMarkers}
                  </Map>
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-orange-400" />
                    <span className="font-bold">{treeLossStats.total}</span> hotspots •
                    <span className="text-red-400 font-bold">{treeLossStats.critical}</span> critical
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center gap-5 text-[10px] text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600" /> Critical (&gt;20%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> High (15-20%)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Moderate (&lt;15%)</span>
                  <span className="ml-auto text-[9px] text-gray-300">Source: Hansen/UMD/Google/USGS/NASA</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/60 border border-gray-200/60 rounded-xl px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">FarmlyCarbon Environmental Intelligence</p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              NASA FIRMS • Global Forest Watch • Hansen/UMD/Google/USGS/NASA Global Forest Change 2000-2024
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-gray-300">
            <Clock className="h-3 w-3" />
            Real-time satellite data
          </div>
        </div>
      </main>
    </div>
  );
}




// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   Map,
//   MapMarker,
//   MapControls,
//   MapHeatmapLayer,
//   MapGridOverlay,
// } from "@/components/ui/map";
// import {
//   parseForestExcel,
//   ForestData,
//   getForestIntensity,
//   formatHectares,
// } from "@/utils/parseForestData";
// import { useMapData } from "@/hooks/useMapData";

// /* -------------------- Types -------------------- */
// interface FireData {
//   latitude: number;
//   longitude: number;
//   frp: number;
//   acq_date: string;
//   satellite: string;
//   confidence: string | number;
// }

// interface TreeLossFromDB {
//   id: string;
//   region: string;
//   latitude: number;
//   longitude: number;
//   loss_percentage: number;
//   loss_year: string;
//   area: string;
//   cause: string;
// }

// /* -------------------- Regions -------------------- */
// const regions: Record<string, { center: [number, number]; zoom: number }> = {
//   all: { center: [0, 20], zoom: 1.5 },
//   africa: { center: [20, 0], zoom: 2.5 },
//   asia: { center: [100, 30], zoom: 2.5 },
//   europe: { center: [15, 50], zoom: 3 },
// };

// /* -------------------- Markers -------------------- */
// const TreeLossMarkerDB = ({ data }: { data: TreeLossFromDB }) => {
//   const intensity =
//     data.loss_percentage > 20
//       ? "critical"
//       : data.loss_percentage > 15
//       ? "high"
//       : "moderate";

//   const colorMap = {
//     critical: "bg-red-600",
//     high: "bg-orange-500",
//     moderate: "bg-yellow-500",
//   };

//   return (
//     <div className="relative group">
//       <div
//         className={`w-3.5 h-3.5 rounded-full border-2 border-white ${colorMap[intensity]} shadow-lg`}
//       />
//       <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-[11px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50">
//         <div className="font-semibold text-orange-400 mb-1">
//           {data.region}
//         </div>
//         <div>Loss: {data.loss_percentage}%</div>
//         <div>Period: {data.loss_year}</div>
//         <div>Area: {data.area}</div>
//         <div className="text-yellow-400">Cause: {data.cause}</div>
//       </div>
//     </div>
//   );
// };

// /* -------------------- Main Component -------------------- */
// export default function MapsMinimal() {
//   const [forestData, setForestData] = useState<ForestData[]>([]);
//   const [selectedRegion, setSelectedRegion] = useState("all");

//   const { treeLoss: dbTreeLoss } = useMapData();

//   /* -------------------- Load Forest Data -------------------- */
//   useEffect(() => {
//     const loadForest = async () => {
//       try {
//         const data = await parseForestExcel(
//           "/data/global_forest_data.xlsx"
//         );
//         setForestData(data || []);
//       } catch {
//         setForestData([]);
//       }
//     };
//     loadForest();
//   }, []);

//   /* -------------------- Memoized Markers -------------------- */
//   const treeLossMarkers = useMemo(
//     () =>
//       dbTreeLoss.map((d) => (
//         <MapMarker
//           key={d.id}
//           longitude={d.longitude}
//           latitude={d.latitude}
//         >
//           <TreeLossMarkerDB data={d} />
//         </MapMarker>
//       )),
//     [dbTreeLoss]
//   );

//   const region = regions[selectedRegion] || regions.all;

//   /* -------------------- UI -------------------- */
//   return (
//     <section className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-800 flex justify-between items-center">
//         <div>
//           <h2 className="text-white font-semibold text-lg">
//             🌍 Global Forest Change (2000–2024)
//           </h2>
//           <p className="text-xs text-gray-400">
//             Satellite-based forest density, loss & geographic reference grid
//           </p>
//         </div>

//         <select
//           className="bg-gray-900 text-gray-200 border border-gray-700 text-xs px-2 py-1 rounded"
//           value={selectedRegion}
//           onChange={(e) => setSelectedRegion(e.target.value)}
//         >
//           <option value="all">Global</option>
//           <option value="asia">Asia</option>
//           <option value="africa">Africa</option>
//           <option value="europe">Europe</option>
//         </select>
//       </div>

//       {/* Map */}
//       <div className="relative h-[600px] w-full bg-black">
//         <Map
//           center={region.center}
//           zoom={region.zoom}
//           theme="dark"
//           className="absolute inset-0"
//         >
//           <MapControls showZoom position="top-right" />

//           {/* GRID OVERLAY */}
//           <MapGridOverlay
//             latSpacing={15}
//             lonSpacing={15}
//             color="rgba(255,255,255,0.15)"
//             opacity={0.6}
//           />

//           {/* Forest Density Heatmap */}
//           <MapHeatmapLayer
//             id="forest-density"
//             data={forestData.map((f) => ({
//               longitude: f.longitude || 0,
//               latitude: f.latitude || 0,
//               intensity: Math.min(f.gfc_extent_ha / 500000000, 1),
//             }))}
//             radius={35}
//             intensity={1.1}
//             colorStops={[
//               { stop: 0, color: "rgba(0,0,0,0)" },
//               { stop: 0.2, color: "#052e16" },
//               { stop: 0.4, color: "#166534" },
//               { stop: 0.6, color: "#22c55e" },
//               { stop: 1, color: "#86efac" },
//             ]}
//             opacity={0.9}
//           />

//           {/* Deforestation Heatmap */}
//           <MapHeatmapLayer
//             id="deforestation"
//             data={dbTreeLoss.map((d) => ({
//               longitude: d.longitude,
//               latitude: d.latitude,
//               intensity: Math.min(d.loss_percentage / 25, 1),
//             }))}
//             radius={25}
//             intensity={0.8}
//             colorStops={[
//               { stop: 0, color: "rgba(0,0,0,0)" },
//               { stop: 0.3, color: "rgba(234,88,12,0.5)" },
//               { stop: 0.6, color: "rgba(239,68,68,0.7)" },
//               { stop: 1, color: "#fca5a5" },
//             ]}
//             opacity={0.75}
//           />

//           {treeLossMarkers}
//         </Map>

//         {/* Grid Overlay Label */}
//         <div className="absolute top-3 left-3 bg-black/60 text-gray-300 text-[11px] px-3 py-1.5 rounded border border-gray-700">
//           Geographic Reference Grid • 15° × 15°
//         </div>
//       </div>

//       {/* LEGENDS */}
//       <div className="p-4 bg-[#111] border-t border-gray-800 flex flex-col md:flex-row gap-6 text-xs text-gray-400">
//         {/* Forest Density */}
//         <div className="flex items-center gap-2">
//           <span>Forest Density:</span>
//           <span className="w-3 h-3 bg-[#052e16]" />
//           <span className="w-3 h-3 bg-[#166534]" />
//           <span className="w-3 h-3 bg-[#22c55e]" />
//           <span className="w-3 h-3 bg-[#86efac]" />
//           <span className="ml-1">Low → High</span>
//         </div>

//         {/* Deforestation */}
//         <div className="flex items-center gap-2">
//           <span>Deforestation:</span>
//           <span className="w-3 h-3 bg-orange-500" />
//           <span className="w-3 h-3 bg-red-500" />
//           <span className="w-3 h-3 bg-red-300" />
//           <span className="ml-1">Moderate → Severe</span>
//         </div>

//         {/* Grid Overlay Info */}
//         <div className="flex items-center gap-2">
//           <span>Grid Overlay:</span>
//           <span className="text-gray-500">
//             Latitude / Longitude reference used for satellite indexing,
//             climate models & Earth observation
//           </span>
//         </div>
//       </div>
//     </section>
//   );
// }
