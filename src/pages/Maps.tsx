import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, TreePine, AlertTriangle, Globe, Satellite, Clock, MapPin, Leaf, TrendingDown, BarChart3, RefreshCw, Search, Filter, Download, Maximize2 } from "lucide-react";
import { Map, MapMarker, MapControls, MapGeoJSONLayer, MapHeatmapLayer, MapGridOverlay } from "@/components/ui/map";
import {
  parseForestExcel,
  ForestData,
  getForestIntensity,
  formatHectares,
} from "@/utils/parseForestData";
import { useMapData } from "@/hooks/useMapData";
import { motion } from "framer-motion";

/* -------------------- Types ----------------------- */
interface FireData {
  latitude: number;
  longitude: number;
  frp: number;
  acq_date: string;
  satellite: string;
  confidence: string | number;
}

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

/* -------------------- Regions -------------------- */
const regions: Record<string, { center: [number, number]; zoom: number }> = {
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

/* -------------------- Markers -------------------- */
const FireMarker = ({ fire }: { fire: FireData }) => {
  const color = fire.frp > 50 ? "bg-red-500" : fire.frp > 20 ? "bg-yellow-400" : "bg-green-400";
  return (
    <div className="relative group">
      <div className={`w-2.5 h-2.5 rounded-full border border-white/30 ${color}`} />
      <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-md whitespace-nowrap z-[9999] shadow-xl border border-white/20">
        <div className="font-medium">{fire.satellite}</div>
        <div>{fire.acq_date} • FRP {fire.frp.toFixed(1)} MW</div>
      </div>
    </div>
  );
};

const ForestMarker = ({ forest }: { forest: ForestData }) => {
  const intensity = getForestIntensity(forest.gfc_extent_ha);
  const color = intensity === "high" ? "bg-green-700" : intensity === "medium" ? "bg-green-500" : "bg-green-300";
  return (
    <div className="relative group">
      <div className={`w-2.5 h-2.5 rounded-full border border-white/20 ${color}`} />
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white text-gray-800 text-[10px] px-2 py-1 rounded shadow whitespace-nowrap z-50">
        <div className="font-medium">{forest.country}</div>
        <div>{formatHectares(forest.gfc_extent_ha)}</div>
      </div>
    </div>
  );
};

const TreeLossMarkerDB = ({ data }: { data: TreeLossFromDB }) => {
  const intensity = data.loss_percentage > 20 ? "critical" : data.loss_percentage > 15 ? "high" : "moderate";
  const colorMap = { critical: "bg-red-600", high: "bg-orange-500", moderate: "bg-yellow-500" };
  const sizeMap = { critical: "w-3.5 h-3.5", high: "w-3 h-3", moderate: "w-2.5 h-2.5" };

  return (
    <div className="relative group">
      {intensity === "critical" && (
        <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-40" style={{ width: 18, height: 18, marginLeft: -2, marginTop: -2 }} />
      )}
      <div
        className={`${sizeMap[intensity]} rounded-full border-2 border-white/80 ${colorMap[intensity]} shadow-lg`}
        style={{ boxShadow: intensity === "critical" ? "0 0 12px rgba(239, 68, 68, 0.6)" : "0 0 8px rgba(0,0,0,0.3)" }}
      />
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50 border border-gray-700">
        <div className="font-semibold text-orange-400 mb-0.5">{data.region}</div>
        <div className="text-gray-300">Loss: <span className="text-white font-medium">{data.loss_percentage}%</span></div>
        <div className="text-gray-300">Period: <span className="text-white">{data.loss_year}</span></div>
        <div className="text-gray-300">Cause: <span className="text-yellow-400">{data.cause}</span></div>
      </div>
    </div>
  );
};

/* -------------------- Map Card Wrapper -------------------- */
interface MapCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentColor: string;
  badge?: string;
  badgeColor?: string;
  legend: React.ReactNode;
  source: string;
  children: React.ReactNode;
  overlay?: React.ReactNode;
  delay?: number;
}

const MapCard = ({ title, subtitle, icon, accentColor, badge, badgeColor, legend, source, children, overlay, delay = 0 }: MapCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col"
  >
    {/* Card Header */}
    <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accentColor}12` }}>
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-bold text-gray-900 tracking-tight">{title}</h3>
            {badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${badgeColor || accentColor}15`, color: badgeColor || accentColor }}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-[10px] text-gray-400 font-medium">{subtitle}</p>
        </div>
      </div>
    </div>

    {/* Map */}
    <div className="relative flex-1 min-h-[340px]">
      {children}
      {overlay}
    </div>

    {/* Legend Footer */}
    <div className="px-4 py-2 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-4 text-[9px] text-gray-500 font-medium">
        {legend}
      </div>
      <span className="text-[8px] text-gray-300 font-medium tracking-wide">{source}</span>
    </div>
  </motion.div>
);

/* -------------------- Main Component -------------------- */
export default function MapsPage() {
  const navigate = useNavigate();
  const [fireData, setFireData] = useState<FireData[]>([]);
  const [forestData, setForestData] = useState<ForestData[]>([]);
  const [loadingFires, setLoadingFires] = useState(false);
  const [loadingForest, setLoadingForest] = useState(false);

  const [days, setDays] = useState("1");
  const [satelliteSource, setSatelliteSource] = useState("VIIRS_SNPP_NRT");
  const [selectedRegion, setSelectedRegion] = useState("all");

  const lastFetchRef = useRef(0);
  const { forestCover: dbForestCover, treeLoss: dbTreeLoss, loading: loadingMapData } = useMapData();

  const isLoading = loadingFires || loadingForest || loadingMapData;

  /* -------------------- Fire Fetch -------------------- */
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
      setFireData((json.fires || []).slice(0, 3000));
    } catch (e: any) {
      if (e.name !== "AbortError") setFireData([]);
    } finally {
      setLoadingFires(false);
    }
    return () => controller.abort();
  }, []);

  useEffect(() => { fetchFireData(days, satelliteSource); }, [days, satelliteSource, fetchFireData]);

  /* -------------------- Forest Load -------------------- */
  useEffect(() => {
    const loadForest = async () => {
      setLoadingForest(true);
      try {
        const data = await parseForestExcel("/data/global_forest_data.xlsx");
        const cleaned = (data || []).filter((d) => d.latitude && d.longitude);
        setForestData(cleaned.length > 0 ? cleaned : fallbackForestData);
      } catch {
        setForestData(fallbackForestData);
      } finally {
        setLoadingForest(false);
      }
    };
    loadForest();
  }, []);

  /* -------------------- Memoized Markers -------------------- */
  const fireMarkers = useMemo(() => fireData.map((f, i) => (
    <MapMarker key={i} longitude={f.longitude} latitude={f.latitude}><FireMarker fire={f} /></MapMarker>
  )), [fireData]);

  const forestMarkers = useMemo(() => forestData.map((f, i) => (
    <MapMarker key={i} longitude={f.longitude!} latitude={f.latitude!}><ForestMarker forest={f} /></MapMarker>
  )), [forestData]);

  const treeLossMarkers = useMemo(() => dbTreeLoss.map((d, i) => (
    <MapMarker key={d.id || i} longitude={d.longitude} latitude={d.latitude}><TreeLossMarkerDB data={d} /></MapMarker>
  )), [dbTreeLoss]);

  const treeLossStats = useMemo(() => {
    const critical = dbTreeLoss.filter(d => d.loss_percentage > 20).length;
    const high = dbTreeLoss.filter(d => d.loss_percentage > 15 && d.loss_percentage <= 20).length;
    const avgLoss = dbTreeLoss.length > 0 ? dbTreeLoss.reduce((sum, d) => sum + d.loss_percentage, 0) / dbTreeLoss.length : 0;
    return { critical, high, avgLoss, total: dbTreeLoss.length };
  }, [dbTreeLoss]);

  const region = regions[selectedRegion] || regions.all;

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      {/* ── Indigo Top Bar ── */}
      <header className="bg-[#4338CA] shadow-lg sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-5 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-indigo-200 hover:text-white transition-colors text-[11px] font-semibold"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              HOME
            </button>
            <div className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-300" />
              <span className="text-[14px] font-extrabold text-white tracking-tight">Environmental Maps</span>
            </div>
            {isLoading && (
              <span className="flex items-center gap-1 text-[10px] text-indigo-200 ml-3">
                <RefreshCw className="h-3 w-3 animate-spin" /> Syncing satellite data…
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select className="h-7 px-2 text-[10px] font-bold bg-white/10 border border-white/20 rounded-md text-white backdrop-blur-sm" value={days} onChange={(e) => setDays(e.target.value)}>
              <option value="1" className="text-gray-900">24 hours</option>
              <option value="2" className="text-gray-900">48 hours</option>
              <option value="7" className="text-gray-900">7 days</option>
            </select>
            <select className="h-7 px-2 text-[10px] font-bold bg-white/10 border border-white/20 rounded-md text-white backdrop-blur-sm" value={satelliteSource} onChange={(e) => setSatelliteSource(e.target.value)}>
              <option value="VIIRS_SNPP_NRT" className="text-gray-900">VIIRS SNPP</option>
              <option value="VIIRS_NOAA20_NRT" className="text-gray-900">VIIRS NOAA-20</option>
              <option value="MODIS_NRT" className="text-gray-900">MODIS</option>
            </select>
            <select className="h-7 px-2 text-[10px] font-bold bg-white/10 border border-white/20 rounded-md text-white backdrop-blur-sm" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
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

      <main className="max-w-[1600px] mx-auto px-5 py-5 space-y-5">
        {/* ── Summary Strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { label: "ACTIVE FIRES", value: String(fireData.length), icon: Flame, accent: "#DC2626" },
            { label: "HIGH INTENSITY", value: String(fireData.filter(f => f.frp > 50).length), icon: AlertTriangle, accent: "#F97316" },
            { label: "FOREST RECORDS", value: String(forestData.length), icon: TreePine, accent: "#10B981" },
            { label: "LOSS HOTSPOTS", value: String(treeLossStats.total), icon: TrendingDown, accent: "#8B5CF6" },
            { label: "CRITICAL ZONES", value: String(treeLossStats.critical), icon: AlertTriangle, accent: "#DC2626" },
            { label: "AVG LOSS RATE", value: `${treeLossStats.avgLoss.toFixed(1)}%`, icon: BarChart3, accent: "#0EA5E9" },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-gray-200/80 p-3 relative overflow-hidden"
              >
                <div className="absolute -right-3 -top-3 w-14 h-14 rounded-full opacity-[0.05]" style={{ backgroundColor: card.accent }} />
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-extrabold tracking-[0.15em] text-gray-400 uppercase">{card.label}</span>
                  <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: `${card.accent}12` }}>
                    <Icon className="h-2.5 w-2.5" style={{ color: card.accent }} />
                  </div>
                </div>
                <span className="text-lg font-extrabold text-gray-900 tracking-tight leading-none">{card.value}</span>
              </motion.div>
            );
          })}
        </div>

        {/* ── All Maps Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Wildfire Map - Full Width */}
          <MapCard
            title="Wildfire Activity"
            subtitle="Real-time NASA FIRMS satellite detection"
            icon={<Flame className="h-4 w-4" style={{ color: "#DC2626" }} />}
            accentColor="#DC2626"
            badge={`${fireData.length} active`}
            badgeColor="#DC2626"
            source="NASA FIRMS"
            delay={0.1}
            legend={
              <>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> FRP &gt; 50 MW</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> FRP 20-50</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> FRP &lt; 20</span>
              </>
            }
            overlay={
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 z-10">
                <Flame className="h-3 w-3 text-red-400" />
                <span className="font-bold">{fireData.length}</span> fires •
                <span className="text-red-400 font-bold">{fireData.filter(f => f.frp > 50).length}</span> high
              </div>
            }
          >
            <Map center={region.center} zoom={region.zoom} theme="dark" className="absolute inset-0">
              <MapControls showZoom position="top-right" />
              {fireMarkers}
            </Map>
          </MapCard>

          {/* Forest Cover Map */}
          <MapCard
            title="Natural Forest Cover"
            subtitle="Global forest extent by country"
            icon={<TreePine className="h-4 w-4" style={{ color: "#10B981" }} />}
            accentColor="#10B981"
            badge={`${forestData.length} countries`}
            badgeColor="#10B981"
            source="Global Forest Watch"
            delay={0.2}
            legend={
              <>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-700" /> &gt; 50M ha</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> &gt; 10M ha</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-300" /> &lt; 10M ha</span>
              </>
            }
            overlay={
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] px-2.5 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5 z-10">
                <Leaf className="h-3 w-3 text-green-600" />
                <span className="font-bold">{forestData.length}</span> countries tracked
              </div>
            }
          >
            <Map center={region.center} zoom={region.zoom} theme="light" className="absolute inset-0">
              <MapControls showZoom position="top-right" />
              {forestMarkers}
            </Map>
          </MapCard>

          {/* Tree Loss Map - Full Width */}
          <MapCard
            title="Deforestation Hotspots"
            subtitle="Tree cover loss 2000-2024"
            icon={<AlertTriangle className="h-4 w-4" style={{ color: "#F97316" }} />}
            accentColor="#F97316"
            badge={`${treeLossStats.critical} critical`}
            badgeColor="#DC2626"
            source="Hansen/UMD/Google/USGS/NASA"
            delay={0.3}
            legend={
              <>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600" /> Critical (&gt;20%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> High (15-20%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Moderate</span>
              </>
            }
            overlay={
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 z-10">
                <AlertTriangle className="h-3 w-3 text-orange-400" />
                <span className="font-bold">{treeLossStats.total}</span> hotspots •
                <span className="text-red-400 font-bold">{treeLossStats.critical}</span> critical
              </div>
            }
          >
            <Map center={[0, 10]} zoom={1.5} theme="dark" className="absolute inset-0">
              <MapControls showZoom position="top-right" />
              {treeLossMarkers}
            </Map>
          </MapCard>

          {/* Forest + Tree Loss Combined Heatmap */}
          <MapCard
            title="Forest Density & Loss Overlay"
            subtitle="Combined heatmap visualization"
            icon={<Globe className="h-4 w-4" style={{ color: "#8B5CF6" }} />}
            accentColor="#8B5CF6"
            badge="COMPOSITE"
            badgeColor="#8B5CF6"
            source="Multiple sources"
            delay={0.4}
            legend={
              <>
                <span className="flex items-center gap-1">
                  <span className="w-6 h-2 rounded-sm" style={{ background: "linear-gradient(to right, #052e16, #22c55e, #86efac)" }} /> Forest density
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-6 h-2 rounded-sm" style={{ background: "linear-gradient(to right, #ea580c80, #ef4444, #fca5a5)" }} /> Deforestation
                </span>
              </>
            }
            overlay={
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 z-10">
                <MapPin className="h-3 w-3 text-purple-400" />
                Grid 15° × 15° • Composite view
              </div>
            }
          >
            <Map center={region.center} zoom={region.zoom} theme="dark" className="absolute inset-0">
              <MapControls showZoom position="top-right" />
              <MapGridOverlay latSpacing={15} lonSpacing={15} color="rgba(255,255,255,0.12)" opacity={0.5} />
              <MapHeatmapLayer
                id="forest-density-combined"
                data={forestData.map(f => ({ longitude: f.longitude || 0, latitude: f.latitude || 0, intensity: Math.min(f.gfc_extent_ha / 500000000, 1) }))}
                radius={35}
                intensity={1.1}
                colorStops={[
                  { stop: 0, color: "rgba(0,0,0,0)" },
                  { stop: 0.2, color: "#052e16" },
                  { stop: 0.4, color: "#166534" },
                  { stop: 0.6, color: "#22c55e" },
                  { stop: 1, color: "#86efac" },
                ]}
                opacity={0.9}
              />
              <MapHeatmapLayer
                id="deforestation-combined"
                data={dbTreeLoss.map(d => ({ longitude: d.longitude, latitude: d.latitude, intensity: Math.min(d.loss_percentage / 25, 1) }))}
                radius={25}
                intensity={0.8}
                colorStops={[
                  { stop: 0, color: "rgba(0,0,0,0)" },
                  { stop: 0.3, color: "rgba(234,88,12,0.5)" },
                  { stop: 0.6, color: "rgba(239,68,68,0.7)" },
                  { stop: 1, color: "#fca5a5" },
                ]}
                opacity={0.75}
              />
              {treeLossMarkers}
            </Map>
          </MapCard>
        </div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white/60 border border-gray-200/60 rounded-xl px-5 py-3 flex items-center justify-between"
        >
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">FarmlyCarbon Environmental Intelligence</p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              NASA FIRMS • Global Forest Watch • Hansen/UMD/Google/USGS/NASA Global Forest Change 2000-2024
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-gray-300">
            <Satellite className="h-3 w-3" />
            Real-time satellite data
          </div>
        </motion.div>
      </main>
    </div>
  );
}
