import React, { useMemo, useCallback } from "react";
import { Flame, AlertTriangle, TrendingDown, BarChart3, Satellite } from "lucide-react";
import { Map, MapMarker, MapControls } from "@/components/ui/map";
import { useMapData } from "@/hooks/useMapData";
import { useFireData } from "@/hooks/useFireData";
import { useForestData } from "@/hooks/useForestData";
import { REGIONS } from "@/components/maps/constants";
import { FireMarker, TreeLossMarker } from "@/components/maps/MapMarkers";
import MapCard from "@/components/maps/MapCard";
import MapsHeader from "@/components/maps/MapsHeader";
import StatsStrip from "@/components/maps/StatsStrip";
import ClimateDashboard from "@/components/maps/ClimateDashboard";
import { useState } from "react";

/* -------------------- Main Component -------------------- */
export default function MapsPage() {
  const [days, setDays] = useState("1");
  const [satelliteSource, setSatelliteSource] = useState("VIIRS_SNPP_NRT");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Data hooks with built-in caching
  const { fireData, loading: loadingFires } = useFireData(days, satelliteSource);
  const { forestData, loading: loadingForest } = useForestData();
  const { treeLoss: dbTreeLoss, loading: loadingMapData } = useMapData();

  const isLoading = loadingFires || loadingForest || loadingMapData;
  const region = REGIONS[selectedRegion] || REGIONS.all;

  // Memoized computed stats
  const highIntensityCount = useMemo(() => fireData.filter(f => f.frp > 50).length, [fireData]);

  const treeLossStats = useMemo(() => {
    const critical = dbTreeLoss.filter(d => d.loss_percentage > 20).length;
    const avgLoss = dbTreeLoss.length > 0
      ? dbTreeLoss.reduce((sum, d) => sum + d.loss_percentage, 0) / dbTreeLoss.length
      : 0;
    return { critical, avgLoss, total: dbTreeLoss.length };
  }, [dbTreeLoss]);

  const stats = useMemo(() => [
    { label: "ACTIVE FIRES", value: String(fireData.length), icon: Flame, accent: "#DC2626" },
    { label: "HIGH INTENSITY", value: String(highIntensityCount), icon: AlertTriangle, accent: "#F97316" },
    { label: "LOSS HOTSPOTS", value: String(treeLossStats.total), icon: TrendingDown, accent: "#8B5CF6" },
    { label: "CRITICAL ZONES", value: String(treeLossStats.critical), icon: AlertTriangle, accent: "#DC2626" },
    { label: "AVG LOSS RATE", value: `${treeLossStats.avgLoss.toFixed(1)}%`, icon: BarChart3, accent: "#0EA5E9" },
  ], [fireData.length, highIntensityCount, treeLossStats]);

  // Memoized marker arrays
  const fireMarkers = useMemo(() => fireData.map((f, i) => (
    <MapMarker key={i} longitude={f.longitude} latitude={f.latitude}><FireMarker fire={f} /></MapMarker>
  )), [fireData]);

  const treeLossMarkers = useMemo(() => dbTreeLoss.map((d, i) => (
    <MapMarker key={d.id || i} longitude={d.longitude} latitude={d.latitude}><TreeLossMarker data={d} /></MapMarker>
  )), [dbTreeLoss]);

  return (
    <div className="min-h-screen flex flex-col bg-[#4F46E5]">
      <MapsHeader
        days={days} setDays={setDays}
        satelliteSource={satelliteSource} setSatelliteSource={setSatelliteSource}
        selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion}
        isLoading={isLoading}
        onNavClick={(item) => {
          const targets: Record<string, string> = {
            "MAPS": "section-maps",
            "CHARTS": "section-charts",
            "CLIMATE DATA": "section-charts",
            "DOCS": "",
          };
          const id = targets[item];
          if (id) {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
          } else if (item === "DOCS") {
            window.open("/farmly/docs", "_blank");
          }
        }}
      />

      <main className="flex-1 bg-[#EEF2FF] rounded-t-2xl">
        <div className="max-w-[1600px] mx-auto px-5 py-5 space-y-5">
        <StatsStrip stats={stats} />

        {/* Maps Grid */}
        <div id="section-maps" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Wildfire */}
          <MapCard
            title="Wildfire Activity"
            subtitle="Real-time NASA FIRMS satellite detection"
            icon={<Flame className="h-4 w-4" style={{ color: "#DC2626" }} />}
            accentColor="#DC2626"
            badge={`${fireData.length} active`}
            badgeColor="#DC2626"
            source="NASA FIRMS"
            legend={<>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> FRP &gt; 50 MW</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> FRP 20-50</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> FRP &lt; 20</span>
            </>}
            overlay={
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] px-2.5 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5 z-10">
                <Flame className="h-3 w-3 text-red-500" />
                <span className="font-bold">{fireData.length}</span> fires •
                <span className="text-red-500 font-bold">{highIntensityCount}</span> high
              </div>
            }
          >
            <Map center={region.center} zoom={region.zoom} theme="light" className="absolute inset-0">
              <MapControls showZoom position="top-right" />
              {fireMarkers}
            </Map>
          </MapCard>

          {/* Deforestation Hotspots */}
          <MapCard
            title="Deforestation Hotspots"
            subtitle="Tree cover loss 2000-2024"
            icon={<AlertTriangle className="h-4 w-4" style={{ color: "#F97316" }} />}
            accentColor="#F97316"
            badge={`${treeLossStats.critical} critical`}
            badgeColor="#DC2626"
            source="Hansen/UMD/Google/USGS/NASA"
            legend={<>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-600" /> Critical (&gt;20%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" /> High (15-20%)</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Moderate</span>
            </>}
            overlay={
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] px-2.5 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5 z-10">
                <AlertTriangle className="h-3 w-3 text-orange-500" />
                <span className="font-bold">{treeLossStats.total}</span> hotspots •
                <span className="text-red-500 font-bold">{treeLossStats.critical}</span> critical
              </div>
            }
          >
            <Map center={[0, 10]} zoom={1.5} theme="light" className="absolute inset-0">
              <MapControls showZoom position="top-right" />
              {treeLossMarkers}
            </Map>
          </MapCard>
        </div>

        {/* Climate Temperature Dashboard */}
        <ClimateDashboard />

        {/* Footer */}
        <div className="bg-white/60 border border-gray-200/60 rounded-xl px-5 py-3 flex items-center justify-between">
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
        </div>
        </div>
      </main>
    </div>
  );
}
