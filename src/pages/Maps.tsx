import React, { useMemo } from "react";
import { Flame, TreePine, AlertTriangle, Globe, MapPin, Leaf, TrendingDown, BarChart3, Satellite } from "lucide-react";
import { Map, MapMarker, MapControls, MapHeatmapLayer, MapGridOverlay } from "@/components/ui/map";
import { useMapData } from "@/hooks/useMapData";
import { useFireData } from "@/hooks/useFireData";
import { useForestData } from "@/hooks/useForestData";
import { REGIONS } from "@/components/maps/constants";
import { FireMarker, ForestMarker, TreeLossMarker } from "@/components/maps/MapMarkers";
import MapCard from "@/components/maps/MapCard";
import MapsHeader from "@/components/maps/MapsHeader";
import StatsStrip from "@/components/maps/StatsStrip";
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
    { label: "FOREST RECORDS", value: String(forestData.length), icon: TreePine, accent: "#10B981" },
    { label: "LOSS HOTSPOTS", value: String(treeLossStats.total), icon: TrendingDown, accent: "#8B5CF6" },
    { label: "CRITICAL ZONES", value: String(treeLossStats.critical), icon: AlertTriangle, accent: "#DC2626" },
    { label: "AVG LOSS RATE", value: `${treeLossStats.avgLoss.toFixed(1)}%`, icon: BarChart3, accent: "#0EA5E9" },
  ], [fireData.length, highIntensityCount, forestData.length, treeLossStats]);

  // Memoized marker arrays
  const fireMarkers = useMemo(() => fireData.map((f, i) => (
    <MapMarker key={i} longitude={f.longitude} latitude={f.latitude}><FireMarker fire={f} /></MapMarker>
  )), [fireData]);

  const forestMarkers = useMemo(() => forestData.map((f, i) => (
    <MapMarker key={i} longitude={f.longitude!} latitude={f.latitude!}><ForestMarker forest={f} /></MapMarker>
  )), [forestData]);

  const treeLossMarkers = useMemo(() => dbTreeLoss.map((d, i) => (
    <MapMarker key={d.id || i} longitude={d.longitude} latitude={d.latitude}><TreeLossMarker data={d} /></MapMarker>
  )), [dbTreeLoss]);

  // Memoized heatmap data
  const forestHeatmapData = useMemo(() =>
    forestData.map(f => ({ longitude: f.longitude || 0, latitude: f.latitude || 0, intensity: Math.min(f.gfc_extent_ha / 500000000, 1) })),
    [forestData]
  );

  const lossHeatmapData = useMemo(() =>
    dbTreeLoss.map(d => ({ longitude: d.longitude, latitude: d.latitude, intensity: Math.min(d.loss_percentage / 25, 1) })),
    [dbTreeLoss]
  );

  return (
    <div className="min-h-screen bg-[#EEF2FF]">
      <MapsHeader
        days={days} setDays={setDays}
        satelliteSource={satelliteSource} setSatelliteSource={setSatelliteSource}
        selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion}
        isLoading={isLoading}
      />

      <main className="max-w-[1600px] mx-auto px-5 py-5 space-y-5">
        <StatsStrip stats={stats} />

        {/* Maps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 z-10">
                <Flame className="h-3 w-3 text-red-400" />
                <span className="font-bold">{fireData.length}</span> fires •
                <span className="text-red-400 font-bold">{highIntensityCount}</span> high
              </div>
            }
          >
            <Map center={region.center} zoom={region.zoom} theme="dark" className="absolute inset-0">
              <MapControls showZoom position="top-right" />
              {fireMarkers}
            </Map>
          </MapCard>

          {/* Forest Cover */}
          <MapCard
            title="Natural Forest Cover"
            subtitle="Global forest extent by country"
            icon={<TreePine className="h-4 w-4" style={{ color: "#10B981" }} />}
            accentColor="#10B981"
            badge={`${forestData.length} countries`}
            badgeColor="#10B981"
            source="Global Forest Watch"
            legend={<>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-700" /> &gt; 50M ha</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> &gt; 10M ha</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-300" /> &lt; 10M ha</span>
            </>}
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

          {/* Composite Heatmap */}
          <MapCard
            title="Forest Density & Loss Overlay"
            subtitle="Combined heatmap visualization"
            icon={<Globe className="h-4 w-4" style={{ color: "#8B5CF6" }} />}
            accentColor="#8B5CF6"
            badge="COMPOSITE"
            badgeColor="#8B5CF6"
            source="Multiple sources"
            legend={<>
              <span className="flex items-center gap-1">
                <span className="w-6 h-2 rounded-sm" style={{ background: "linear-gradient(to right, #052e16, #22c55e, #86efac)" }} /> Forest density
              </span>
              <span className="flex items-center gap-1">
                <span className="w-6 h-2 rounded-sm" style={{ background: "linear-gradient(to right, #ea580c80, #ef4444, #fca5a5)" }} /> Deforestation
              </span>
            </>}
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
                data={forestHeatmapData}
                radius={35} intensity={1.1}
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
                data={lossHeatmapData}
                radius={25} intensity={0.8}
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
      </main>
    </div>
  );
}
