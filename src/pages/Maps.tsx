import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Flame, 
  Droplets, 
  TreePine, 
  Globe, 
  MapPin, 
  Layers, 
  Clock,
  Info,
  Maximize2,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Map, MapControls, MapMarker } from "@/components/ui/map";
import HomeHeader from "@/components/home/HomeHeader";

// Marker data type
interface MarkerData {
  lat: number;
  lng: number;
  intensity: "high" | "medium" | "low";
  label?: string;
}

// Intensity colors
const intensityColors = {
  high: "#ef4444",
  medium: "#f59e0b", 
  low: "#22c55e"
};

// Custom Marker Component with glow effect
const GlowingMarker = ({ intensity, label }: { intensity: "high" | "medium" | "low"; label?: string }) => {
  const color = intensityColors[intensity];
  
  return (
    <div className="relative group cursor-pointer">
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full animate-ping"
        style={{ 
          backgroundColor: color,
          opacity: 0.4,
          width: '20px',
          height: '20px',
          marginLeft: '-4px',
          marginTop: '-4px'
        }}
      />
      {/* Marker dot */}
      <div 
        className="w-3 h-3 rounded-full border-2 border-white/50 shadow-lg relative z-10"
        style={{ 
          backgroundColor: color,
          boxShadow: `0 0 15px ${color}80, 0 0 30px ${color}40`
        }}
      />
      {/* Label tooltip */}
      {label && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-900/90 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20">
          {label}
        </div>
      )}
    </div>
  );
};

// Map Card Component
interface MapCardProps {
  title: string;
  icon: React.ReactNode;
  source: string;
  legend: { label: string; color: string }[];
  markers: MarkerData[];
  center?: [number, number];
  zoom?: number;
  timeFilter?: boolean;
  regionFilter?: boolean;
}

const MapCard = ({ title, icon, source, legend, markers, center = [0, 20], zoom = 1.5, timeFilter, regionFilter }: MapCardProps) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [region, setRegion] = useState("global");

  return (
    <motion.div
      className="relative bg-[#0a0f1a] rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01, boxShadow: "0 0 40px rgba(34, 197, 94, 0.1)" }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-[#0a0f1a] via-[#0a0f1a]/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-800/80 rounded-lg backdrop-blur-sm">
              {icon}
            </div>
            <h3 className="text-white font-semibold text-sm">{title}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {timeFilter && (
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="h-8 w-24 bg-gray-800/80 border-gray-700 text-xs text-gray-300">
                  <Clock className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {regionFilter && (
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="h-8 w-24 bg-gray-800/80 border-gray-700 text-xs text-gray-300">
                  <Globe className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700">
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Expand Map</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Map Content */}
      <div className="aspect-[4/3] relative">
        <Map
          center={center}
          zoom={zoom}
          theme="dark"
          interactive={true}
          className="w-full h-full"
        >
          <MapControls position="bottom-left" showZoom={true} showCompass={false} />
          {markers.map((marker, index) => (
            <MapMarker
              key={index}
              longitude={marker.lng}
              latitude={marker.lat}
            >
              <GlowingMarker intensity={marker.intensity} label={marker.label} />
            </MapMarker>
          ))}
        </Map>
      </div>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {legend.map((item, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <div 
                  className="w-2.5 h-2.5 rounded-full shadow-lg"
                  style={{ 
                    backgroundColor: item.color,
                    boxShadow: `0 0 8px ${item.color}80`
                  }}
                />
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Info className="h-3 w-3" />
            <span>{source}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Maps = () => {
  const [locateMe, setLocateMe] = useState(false);

  // Sample data for different maps
  const wildfireMarkers = [
    { lat: 37.7749, lng: -122.4194, intensity: "high" as const, label: "California Fires" },
    { lat: 36.7783, lng: -119.4179, intensity: "high" as const, label: "Central Valley" },
    { lat: 34.0522, lng: -118.2437, intensity: "medium" as const, label: "Los Angeles" },
    { lat: -33.8688, lng: 151.2093, intensity: "high" as const, label: "Australia" },
    { lat: 55.7558, lng: 37.6173, intensity: "low" as const, label: "Russia" },
    { lat: 28.6139, lng: 77.2090, intensity: "medium" as const, label: "Delhi, India" },
    { lat: 51.5074, lng: -0.1278, intensity: "low" as const, label: "London" },
    { lat: -23.5505, lng: -46.6333, intensity: "high" as const, label: "São Paulo" },
  ];

  const groundwaterIndiaMarkers = [
    { lat: 28.6139, lng: 77.2090, intensity: "high" as const, label: "Delhi - Critical" },
    { lat: 26.8467, lng: 80.9462, intensity: "high" as const, label: "Lucknow - Critical" },
    { lat: 22.5726, lng: 88.3639, intensity: "medium" as const, label: "Kolkata" },
    { lat: 19.0760, lng: 72.8777, intensity: "low" as const, label: "Mumbai - Safe" },
    { lat: 12.9716, lng: 77.5946, intensity: "medium" as const, label: "Bangalore" },
    { lat: 13.0827, lng: 80.2707, intensity: "low" as const, label: "Chennai" },
    { lat: 23.0225, lng: 72.5714, intensity: "high" as const, label: "Ahmedabad - Critical" },
    { lat: 17.3850, lng: 78.4867, intensity: "medium" as const, label: "Hyderabad" },
  ];

  const globalWaterStressMarkers = [
    { lat: 31.0461, lng: 34.8516, intensity: "high" as const, label: "Middle East" },
    { lat: 28.3949, lng: 84.1240, intensity: "high" as const, label: "South Asia" },
    { lat: 35.8617, lng: 104.1954, intensity: "high" as const, label: "Northern China" },
    { lat: 33.9391, lng: -6.9686, intensity: "medium" as const, label: "North Africa" },
    { lat: 40.4637, lng: -3.7492, intensity: "medium" as const, label: "Spain" },
    { lat: -25.2744, lng: 133.7751, intensity: "medium" as const, label: "Australia" },
    { lat: 37.0902, lng: -95.7129, intensity: "low" as const, label: "Central USA" },
    { lat: -14.2350, lng: -51.9253, intensity: "low" as const, label: "Brazil" },
  ];

  const forestLossMarkers = [
    { lat: -3.4653, lng: -62.2159, intensity: "high" as const, label: "Amazon Deforestation" },
    { lat: 0.7893, lng: 113.9213, intensity: "high" as const, label: "Borneo" },
    { lat: -0.0236, lng: 37.9062, intensity: "medium" as const, label: "East Africa" },
    { lat: 5.1521, lng: -2.9248, intensity: "medium" as const, label: "West Africa" },
    { lat: 64.2008, lng: -152.4937, intensity: "low" as const, label: "Alaska" },
    { lat: 60.4720, lng: 8.4689, intensity: "low" as const, label: "Scandinavia" },
    { lat: -6.3690, lng: 34.8888, intensity: "medium" as const, label: "Tanzania" },
    { lat: 15.8700, lng: 100.9925, intensity: "high" as const, label: "Southeast Asia" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <HomeHeader />
      
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl border border-green-500/30">
              <Globe className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Environmental Maps</h1>
              <p className="text-gray-400 mt-1">Real-time climate, water, and forest monitoring dashboards</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setLocateMe(!locateMe)}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Locate Me
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Layers className="h-4 w-4 mr-2" />
              Toggle Layers
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <div className="flex gap-2 ml-auto">
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                Live Data
              </Badge>
              <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700">
                Last updated: 2 min ago
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wildfire Activity Map */}
          <MapCard
            title="Wildfire Activity"
            icon={<Flame className="h-5 w-5 text-orange-400" />}
            source="NASA FIRMS"
            legend={[
              { label: "High", color: "#ef4444" },
              { label: "Medium", color: "#f59e0b" },
              { label: "Low", color: "#22c55e" }
            ]}
            markers={wildfireMarkers}
            center={[0, 20]}
            zoom={1.5}
            timeFilter
            regionFilter
          />

          {/* Groundwater Levels - India */}
          <MapCard
            title="Groundwater Levels – India"
            icon={<Droplets className="h-5 w-5 text-blue-400" />}
            source="India-WRIS / CGWB"
            legend={[
              { label: "Critical", color: "#ef4444" },
              { label: "Semi-Critical", color: "#f59e0b" },
              { label: "Safe", color: "#22c55e" }
            ]}
            markers={groundwaterIndiaMarkers}
            center={[78.9629, 22.5937]}
            zoom={4}
            timeFilter
          />

          {/* Global Groundwater Stress */}
          <MapCard
            title="Global Water Stress"
            icon={<Globe className="h-5 w-5 text-cyan-400" />}
            source="UN IGRAC GGIS"
            legend={[
              { label: "High Stress", color: "#ef4444" },
              { label: "Medium Stress", color: "#f59e0b" },
              { label: "Low Stress", color: "#22c55e" }
            ]}
            markers={globalWaterStressMarkers}
            center={[0, 20]}
            zoom={1.5}
            regionFilter
          />

          {/* Forest Cover & Tree Loss */}
          <MapCard
            title="Forest Cover & Tree Loss Alerts"
            icon={<TreePine className="h-5 w-5 text-green-400" />}
            source="Global Forest Watch"
            legend={[
              { label: "Severe Loss", color: "#ef4444" },
              { label: "Moderate", color: "#f59e0b" },
              { label: "Stable", color: "#22c55e" }
            ]}
            markers={forestLossMarkers}
            center={[-20, 0]}
            zoom={1.5}
            timeFilter
            regionFilter
          />
        </div>

        {/* Data Sources Section */}
        <motion.div 
          className="mt-12 p-6 bg-gray-900/50 rounded-2xl border border-gray-800/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-gray-400" />
            Data Sources & Methodology
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-sm font-medium text-white">Wildfire Data</span>
              </div>
              <p className="text-xs text-gray-400">NASA FIRMS API - MODIS & VIIRS satellite fire detection with confidence levels</p>
            </div>
            <div className="p-4 bg-gray-800/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-white">India Groundwater</span>
              </div>
              <p className="text-xs text-gray-400">India-WRIS, NWIC & CGWB - District-level seasonal monitoring data</p>
            </div>
            <div className="p-4 bg-gray-800/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">Global Water Stress</span>
              </div>
              <p className="text-xs text-gray-400">UN IGRAC GGIS - Aquifer boundaries and stress indicators</p>
            </div>
            <div className="p-4 bg-gray-800/30 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TreePine className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-white">Forest Watch</span>
              </div>
              <p className="text-xs text-gray-400">Global Forest Watch - GLAD-S2 alerts and annual change data</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© CARTO, © OpenStreetMap contributors • Data refreshed every 15 minutes</p>
        </div>
      </footer>
    </div>
  );
};

export default Maps;
