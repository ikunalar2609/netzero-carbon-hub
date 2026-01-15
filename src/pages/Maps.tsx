import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Map, MapMarker, MapControls, MapGeoJSONLayer, MapHeatmapLayer, MapGridOverlay } from "@/components/ui/map";
import {
  parseForestExcel,
  ForestData,
  getForestIntensity,
  formatHectares,
} from "@/utils/parseForestData";
import { useMapData } from "@/hooks/useMapData";

/* -------------------- Types -------------------- */
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
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2  opacity-0 group-hover:opacity-100 transition
          bg-black/90 text-white
          text-[11px] px-2 py-1 rounded whitespace-nowrap z-50
          shadow-lg">
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Environmental Maps
          </h1>
          <p className="text-sm text-gray-600">
            Fast, minimal, data-first
          </p>
        </div>

        <div className="flex gap-2 text-sm">
          <select
            className="border rounded px-2 py-1"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option value="1">24h</option>
            <option value="2">48h</option>
            <option value="7">7d</option>
          </select>

          <select
            className="border rounded px-2 py-1"
            value={satelliteSource}
            onChange={(e) => setSatelliteSource(e.target.value)}
          >
            <option value="VIIRS_SNPP_NRT">VIIRS SNPP</option>
            <option value="VIIRS_NOAA20_NRT">VIIRS NOAA-20</option>
            <option value="MODIS_NRT">MODIS</option>
          </select>

          <select
            className="border rounded px-2 py-1"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            <option value="all">All</option>
            <option value="asia">Asia</option>
            <option value="africa">Africa</option>
            <option value="europe">Europe</option>
          </select>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 space-y-6 pb-12">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white border rounded p-3">
            <div className="text-xs text-gray-500">Total Fires</div>
            <div className="text-lg font-semibold">
              {fireData.length}
            </div>
          </div>
          <div className="bg-white border rounded p-3">
            <div className="text-xs text-gray-500">High Intensity</div>
            <div className="text-lg font-semibold text-red-600">
              {fireData.filter((f) => f.frp > 50).length}
            </div>
          </div>
          <div className="bg-white border rounded p-3">
            <div className="text-xs text-gray-500">Forest Records</div>
            <div className="text-lg font-semibold text-green-600">
              {forestData.length}
            </div>
          </div>
          <div className="bg-white border rounded p-3">
            <div className="text-xs text-gray-500">Tree Loss Hotspots</div>
            <div className="text-lg font-semibold text-orange-600">
              {treeLossStats.total}
            </div>
          </div>
          <div className="bg-white border rounded p-3">
            <div className="text-xs text-gray-500">Avg Loss Rate</div>
            <div className="text-lg font-semibold text-orange-500">
              {treeLossStats.avgLoss.toFixed(1)}%
            </div>
          </div>
        </section>

        {/* Fire Map */}
        <section className="bg-white border rounded overflow-hidden">
          <div className="p-3 border-b text-sm flex justify-between">
            <span>🔥 Active Wildfires</span>
            <span className="text-gray-500">
              {loadingFires ? "Loading…" : `${fireData.length} points`}
            </span>
          </div>
          <div className="h-80 relative">
            <Map
              center={[0, 20]}
              zoom={1.8}
              theme="dark"
              className="absolute inset-0"
            >
              <MapControls showZoom position="top-right" />
              {fireMarkers}
            </Map>
          </div>
        </section>

        {/* Forest Map */}
        <section className="bg-white border rounded overflow-hidden">
          <div className="p-3 border-b text-sm flex justify-between">
            <span>🌲 Natural Forest Cover</span>
            <span className="text-gray-500">
              {loadingForest ? "Loading…" : `${forestData.length} records`}
            </span>
          </div>
          <div className="h-80 relative">
            <Map
              center={region.center}
              zoom={region.zoom}
              theme="light"
              className="absolute inset-0"
            >
              <MapControls showZoom position="top-right" />
              {forestMarkers}
            </Map>
          </div>
          <div className="p-2 bg-gray-50 border-t flex gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-700"></span> &gt;50M ha</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> &gt;10M ha</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-300"></span> &lt;10M ha</span>
          </div>
        </section>

        {/* Global Forest Change Heatmap - Full Width Satellite Style */}
        <section className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
            <div>
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                🌳 Global Forest Change 2000-2024
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Hansen/UMD/Google/USGS/NASA • Satellite-Based Forest Density Visualization</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-400">
                {treeLossStats.total} hotspots • {treeLossStats.critical} critical
              </span>
            </div>
          </div>
          
          {/* Full-width heatmap container */}
          <div className="relative h-[500px] md:h-[600px] w-full bg-[#0d0d0d]">
            <Map
              center={[0, 20]}
              zoom={1.4}
              theme="dark"
              className="absolute inset-0"
            >
              <MapControls showZoom position="top-right" />
              
              {/* Grid overlay for lat/lon lines */}
              <MapGridOverlay 
                latSpacing={15} 
                lonSpacing={15} 
                color="rgba(255, 255, 255, 0.15)"
                opacity={0.5}
              />
              
              {/* Heatmap layer for forest density */}
              <MapHeatmapLayer
                id="forest-heatmap"
                data={forestData.map(f => ({
                  longitude: f.longitude || 0,
                  latitude: f.latitude || 0,
                  intensity: Math.min(f.gfc_extent_ha / 500000000, 1)
                }))}
                radius={35}
                intensity={1.2}
                colorStops={[
                  { stop: 0, color: "rgba(0, 0, 0, 0)" },
                  { stop: 0.1, color: "#052e16" },
                  { stop: 0.25, color: "#14532d" },
                  { stop: 0.4, color: "#166534" },
                  { stop: 0.55, color: "#15803d" },
                  { stop: 0.7, color: "#22c55e" },
                  { stop: 0.85, color: "#4ade80" },
                  { stop: 1, color: "#86efac" },
                ]}
                opacity={0.9}
              />

              {/* Deforestation hotspots as red/orange heatmap overlay */}
              <MapHeatmapLayer
                id="deforestation-heatmap"
                data={dbTreeLoss.map(d => ({
                  longitude: d.longitude,
                  latitude: d.latitude,
                  intensity: Math.min(d.loss_percentage / 25, 1)
                }))}
                radius={25}
                intensity={0.8}
                colorStops={[
                  { stop: 0, color: "rgba(0, 0, 0, 0)" },
                  { stop: 0.2, color: "rgba(234, 88, 12, 0.4)" },
                  { stop: 0.5, color: "rgba(239, 68, 68, 0.6)" },
                  { stop: 0.8, color: "rgba(220, 38, 38, 0.8)" },
                  { stop: 1, color: "#fca5a5" },
                ]}
                opacity={0.75}
              />

              {/* Tree loss markers for detailed info on hover */}
              {treeLossMarkers}
            </Map>
            
            {/* Coordinate labels overlay */}
            <div className="absolute top-2 left-2 text-[10px] text-gray-500 font-mono pointer-events-none">
              90°N
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] text-gray-500 font-mono pointer-events-none">
              90°S
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-mono pointer-events-none">
              0° (Equator)
            </div>
          </div>
          
          {/* Legend bar */}
          <div className="p-4 bg-[#111] border-t border-gray-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Forest Density:</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ background: '#052e16' }}></span>
                  <span className="w-3 h-3 rounded-sm" style={{ background: '#166534' }}></span>
                  <span className="w-3 h-3 rounded-sm" style={{ background: '#22c55e' }}></span>
                  <span className="w-3 h-3 rounded-sm" style={{ background: '#86efac' }}></span>
                  <span className="text-gray-500 ml-1">Low → High</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Deforestation:</span>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(234, 88, 12, 0.6)' }}></span>
                  <span className="w-3 h-3 rounded-sm" style={{ background: 'rgba(239, 68, 68, 0.7)' }}></span>
                  <span className="w-3 h-3 rounded-sm" style={{ background: '#fca5a5' }}></span>
                  <span className="text-gray-500 ml-1">Moderate → Severe</span>
                </div>
              </div>
            </div>
            {/* <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 border border-white/50"></span> 
                Critical (&gt;20% loss)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500 border border-white/50"></span> 
                High (15-20%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-yellow-500 border border-white/50"></span> 
                Moderate
              </span>
              <span className="ml-2">Period: 2020-2024 • GFC v1.12</span>
            </div> */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5 text-gray-100">
                <span className="w-2 h-2 rounded-full bg-red-600 border border-white/50"></span> 
                Critical (&gt;20% loss)
              </span>

              <span className="flex items-center gap-1.5 text-gray-100">
                <span className="w-2 h-2 rounded-full bg-orange-500 border border-white/50"></span> 
                High (15–20%)
              </span>

              <span className="flex items-center gap-1.5 text-gray-100">
                <span className="w-2 h-2 rounded-full bg-yellow-500 border border-white/50"></span> 
                Moderate
              </span>

              <span className="ml-2 text-gray-500">
                Period: 2020–2024 • GFC v1.12
              </span>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-gray-500 space-y-1">
          <div>NASA FIRMS • Global Forest Watch • Hansen/UMD/Google/USGS/NASA Global Forest Change</div>
          <div className="text-gray">Data sources for scientific and educational purposes</div>
        </footer>
      </main>
    </div>
  );
}
