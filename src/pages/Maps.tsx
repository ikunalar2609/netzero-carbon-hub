import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* -------------------- Mock Data Utilities -------------------- */
const formatHectares = (hectares) => {
  if (hectares >= 1000000) return `${(hectares / 1000000).toFixed(1)}M ha`;
  if (hectares >= 1000) return `${(hectares / 1000).toFixed(1)}K ha`;
  return `${hectares} ha`;
};

const getForestIntensity = (hectares) => {
  if (hectares > 50000000) return "high";
  if (hectares > 10000000) return "medium";
  return "low";
};

/* -------------------- Mock Data -------------------- */
const mockFireData = Array.from({ length: 150 }, (_, i) => ({
  latitude: (Math.random() - 0.5) * 180,
  longitude: (Math.random() - 0.5) * 360,
  frp: Math.random() * 100,
  acq_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  satellite: ["VIIRS", "MODIS", "NOAA-20"][Math.floor(Math.random() * 3)],
  confidence: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
}));

const mockForestData = [
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
];

const mockTreeLossData = Array.from({ length: 40 }, (_, i) => ({
  id: `loss-${i}`,
  region: ["Amazon Basin", "Congo Basin", "Southeast Asia", "Boreal Forest", "Central America"][Math.floor(Math.random() * 5)],
  latitude: (Math.random() - 0.3) * 100,
  longitude: (Math.random() - 0.5) * 200,
  loss_percentage: 5 + Math.random() * 25,
  loss_year: `${2018 + Math.floor(Math.random() * 6)}-${2019 + Math.floor(Math.random() * 6)}`,
  area: `${(10 + Math.random() * 90).toFixed(1)}K km²`,
  cause: ["Agriculture", "Logging", "Fire", "Urban Expansion", "Mining"][Math.floor(Math.random() * 5)],
}));

/* -------------------- Components -------------------- */
const FireMarker = ({ fire }) => {
  const color = 
    fire.frp > 50 ? "bg-red-500/90" : 
    fire.frp > 20 ? "bg-yellow-400/90" : "bg-emerald-400/90";

  return (
    <div className="relative group cursor-pointer">
      <div className={`w-2.5 h-2.5 rounded-full border-2 border-white/20 ${color} shadow-lg transform transition-all duration-200 hover:scale-150 hover:z-50`}>
        <div className="absolute inset-0 rounded-full bg-current opacity-30 animate-ping"></div>
      </div>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 origin-bottom">
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-white/10 whitespace-nowrap max-w-xs">
          <div className="font-bold flex items-center">
            <span className="w-2 h-2 rounded-full bg-current mr-2" style={{ backgroundColor: color.replace('/90', '') }}></span>
            {fire.satellite} • {fire.confidence}
          </div>
          <div className="mt-1 text-gray-300">
            <div>FRP: {fire.frp.toFixed(1)} MW</div>
            <div>Detected: {fire.acq_date}</div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gradient-to-b from-gray-900 to-gray-800 border-l border-b border-white/10"></div>
      </div>
    </div>
  );
};

const ForestMarker = ({ forest }) => {
  const intensity = getForestIntensity(forest.gfc_extent_ha);
  const color = 
    intensity === "high" ? "bg-emerald-700/90" : 
    intensity === "medium" ? "bg-emerald-500/90" : "bg-emerald-300/90";

  return (
    <div className="relative group cursor-pointer">
      <div className={`w-3 h-3 rounded-full border-2 border-white/30 ${color} shadow-lg transform transition-all duration-200 hover:scale-150 hover:z-50`}>
        <div className="absolute inset-0 rounded-full bg-current opacity-20 animate-pulse"></div>
      </div>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 origin-bottom">
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-white/10 whitespace-nowrap max-w-xs">
          <div className="font-bold flex items-center">
            <span className="w-2 h-2 rounded-full bg-current mr-2" style={{ backgroundColor: color.replace('/90', '') }}></span>
            {forest.country}
          </div>
          <div className="mt-1 text-gray-300">
            Forest Cover: {formatHectares(forest.gfc_extent_ha)}
          </div>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gradient-to-b from-gray-900 to-gray-800 border-l border-b border-white/10"></div>
      </div>
    </div>
  );
};

const TreeLossMarker = ({ data }) => {
  const intensity = data.loss_percentage > 20 ? "critical" : data.loss_percentage > 15 ? "high" : "moderate";
  const colorMap = {
    critical: "bg-rose-600/90",
    high: "bg-orange-500/90",
    moderate: "bg-amber-400/90"
  };
  const sizeMap = {
    critical: "w-4 h-4",
    high: "w-3 h-3",
    moderate: "w-2.5 h-2.5"
  };

  return (
    <div className="relative group cursor-pointer">
      {intensity === "critical" && (
        <div className="absolute inset-0 rounded-full animate-ping bg-rose-500/30"></div>
      )}
      <div className={`${sizeMap[intensity]} rounded-full border-2 border-white/80 ${colorMap[intensity]} shadow-lg transform transition-all duration-200 hover:scale-150 hover:z-50`}>
        {intensity === "critical" && (
          <div className="absolute inset-0 rounded-full border-2 border-rose-400/50 animate-pulse"></div>
        )}
      </div>
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100 origin-bottom">
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white text-xs px-3 py-2 rounded-xl shadow-lg border border-white/10 whitespace-nowrap max-w-xs">
          <div className="font-bold text-orange-300">{data.region}</div>
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300">
            <div>Loss:</div>
            <div className="font-medium text-white">{data.loss_percentage.toFixed(1)}%</div>
            <div>Period:</div>
            <div className="font-medium">{data.loss_year}</div>
            <div>Area:</div>
            <div className="font-medium">{data.area}</div>
            <div>Cause:</div>
            <div className="font-medium text-amber-300">{data.cause}</div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gradient-to-b from-gray-900 to-gray-800 border-l border-b border-white/10"></div>
      </div>
    </div>
  );
};

const WorldMapVisualization = ({ markers, theme = "dark", title, stats }) => {
  const mapGradient = theme === "dark" 
    ? "from-[#0c0e15] via-[#121826] to-[#0a0e17]"
    : "from-emerald-50 to-blue-50";
  
  const globeColor = theme === "dark" 
    ? "text-cyan-400/20" 
    : "text-emerald-300/30";
  
  const gridColor = theme === "dark" 
    ? "stroke-gray-700/50" 
    : "stroke-emerald-200/50";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2">{title}</span>
          <span className="text-xs font-normal bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {stats}
          </span>
        </h3>
        <div className="flex space-x-2">
          <button className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="relative h-[500px] bg-gradient-to-br overflow-hidden">
        {/* Animated background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${mapGradient} animate-gradient-shift`}></div>
        
        {/* Decorative globe */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg className={`h-[400px] w-[400px] ${globeColor}`} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M10 100 Q100 170 190 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M10 100 Q100 30 190 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M100 10 Q170 100 100 190" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M100 10 Q30 100 100 190" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        
        {/* Grid lines */}
        <svg className="absolute inset-0" xmlns="http://www.w3.org/2000/svg">
          <g className={gridColor}>
            {[...Array(10)].map((_, i) => (
              <line 
                key={`lat-${i}`} 
                x1="0%" 
                y1={`${i * 10}%`} 
                x2="100%" 
                y2={`${i * 10}%`} 
                stroke="currentColor" 
                strokeWidth="0.3" 
                strokeDasharray="2,2"
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <line 
                key={`lon-${i}`} 
                x1={`${i * 10}%`} 
                y1="0%" 
                x2={`${i * 10}%`} 
                y2="100%" 
                stroke="currentColor" 
                strokeWidth="0.3" 
                strokeDasharray="2,2"
              />
            ))}
          </g>
        </svg>
        
        {/* Markers container */}
        <div className="absolute inset-0">
          {markers}
        </div>
        
        {/* Map controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
          <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex space-x-2">
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414L6.586 9 2.293 4.707a1 1 0 010-1.414L6.586 8 10.586 4a1 1 0 111.414 1.414L8.414 9l4.293 4.293A1 1 0 0112 13v-6z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg p-3">
          <div className="text-xs font-medium text-gray-700 mb-1.5">Legend</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5"></div>
              <span className="text-xs text-gray-600">High Intensity</span>
            </div>
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-1.5"></div>
              <span className="text-xs text-gray-600">Medium</span>
            </div>
            <div className="flex items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mr-1.5"></div>
              <span className="text-xs text-gray-600">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, trend, color }) => {
  const trendColor = trend > 0 ? "text-emerald-500" : "text-rose-500";
  const iconColor = color || "text-blue-500";
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
          {trend !== undefined && (
            <div className="mt-1 flex items-center">
              <svg className={`w-4 h-4 ${trendColor} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {trend > 0 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                )}
              </svg>
              <span className={`text-sm font-medium ${trendColor}`}>
                {Math.abs(trend)}% {trend > 0 ? "increase" : "decrease"} vs last period
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${iconColor.replace('text', 'bg')}/10`}>
          <div className={`w-6 h-6 ${iconColor}`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function EnvironmentalDashboard() {
  const [activeTab, setActiveTab] = useState("fire");
  const [timeRange, setTimeRange] = useState("7d");
  const [region, setRegion] = useState("global");
  
  // Simulate loading states
  const [loadingFire, setLoadingFire] = useState(true);
  const [loadingForest, setLoadingForest] = useState(true);
  const [loadingLoss, setLoadingLoss] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingFire(false);
      setLoadingForest(false);
      setLoadingLoss(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Prepare markers with loading states
  const fireMarkers = useMemo(() => 
    loadingFire ? [] : mockFireData.map((fire, i) => (
      <div 
        key={`fire-${i}`} 
        className="absolute"
        style={{
          left: `${50 + (fire.longitude / 360) * 45}%`,
          top: `${50 - (fire.latitude / 180) * 40}%`,
        }}
      >
        <FireMarker fire={fire} />
      </div>
    )), [loadingFire]
  );
  
  const forestMarkers = useMemo(() => 
    loadingForest ? [] : mockForestData.map((forest, i) => (
      <div 
        key={`forest-${i}`} 
        className="absolute"
        style={{
          left: `${50 + (forest.longitude / 360) * 45}%`,
          top: `${50 - (forest.latitude / 180) * 40}%`,
        }}
      >
        <ForestMarker forest={forest} />
      </div>
    )), [loadingForest]
  );
  
  const lossMarkers = useMemo(() => 
    loadingLoss ? [] : mockTreeLossData.map((data, i) => (
      <div 
        key={`loss-${i}`} 
        className="absolute"
        style={{
          left: `${50 + (data.longitude / 360) * 45}%`,
          top: `${50 - (data.latitude / 180) * 40}%`,
        }}
      >
        <TreeLossMarker data={data} />
      </div>
    )), [loadingLoss]
  );
  
  // Stats calculations
  const fireStats = useMemo(() => {
    if (loadingFire) return { total: 0, highIntensity: 0, avgFRP: 0 };
    return {
      total: mockFireData.length,
      highIntensity: mockFireData.filter(f => f.frp > 50).length,
      avgFRP: (mockFireData.reduce((sum, f) => sum + f.frp, 0) / mockFireData.length).toFixed(1)
    };
  }, [loadingFire]);
  
  const forestStats = useMemo(() => {
    if (loadingForest) return { total: 0, highCoverage: 0, avgCoverage: 0 };
    return {
      total: mockForestData.length,
      highCoverage: mockForestData.filter(f => f.gfc_extent_ha > 50000000).length,
      avgCoverage: formatHectares(mockForestData.reduce((sum, f) => sum + f.gfc_extent_ha, 0) / mockForestData.length)
    };
  }, [loadingForest]);
  
  const lossStats = useMemo(() => {
    if (loadingLoss) return { total: 0, critical: 0, avgLoss: 0 };
    return {
      total: mockTreeLossData.length,
      critical: mockTreeLossData.filter(d => d.loss_percentage > 20).length,
      avgLoss: (mockTreeLossData.reduce((sum, d) => sum + d.loss_percentage, 0) / mockTreeLossData.length).toFixed(1)
    };
  }, [loadingLoss]);
  
  // Chart data
  const fireTrendData = useMemo(() => [
    { date: 'Jan', fires: 1200, intensity: 45 },
    { date: 'Feb', fires: 1500, intensity: 52 },
    { date: 'Mar', fires: 1800, intensity: 58 },
    { date: 'Apr', fires: 2200, intensity: 65 },
    { date: 'May', fires: 2500, intensity: 70 },
    { date: 'Jun', fires: 2800, intensity: 75 },
  ], []);
  
  const lossTrendData = useMemo(() => [
    { year: '2019', loss: 12.5, coverage: 85 },
    { year: '2020', loss: 14.2, coverage: 83 },
    { year: '2021', loss: 15.8, coverage: 81 },
    { year: '2022', loss: 17.3, coverage: 79 },
    { year: '2023', loss: 19.1, coverage: 76 },
    { year: '2024', loss: 21.5, coverage: 74 },
  ], []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EcoVision</h1>
                <p className="text-sm text-gray-500">Global Environmental Monitoring Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="1y">Last year</option>
              </select>
              
              <select 
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="global">Global View</option>
                <option value="amazon">Amazon Basin</option>
                <option value="congo">Congo Basin</option>
                <option value="boreal">Boreal Forests</option>
                <option value="se-asia">Southeast Asia</option>
              </select>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl shadow-md hover:from-blue-700 hover:to-cyan-600 transition-all duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4.94-9.767a1 1 0 011.497.382L10.43 9.98l2.54-1.815a1 1 0 111.218 1.706l-3 2.143a1 1 0 01-1.218 0l-3-2.143a1 1 0 01.382-1.497z" clipRule="evenodd" />
                </svg>
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Active Wildfires" 
            value={loadingFire ? "..." : fireStats.total.toLocaleString()} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            }
            trend={12.5}
            color="text-rose-500"
          />
          <StatsCard 
            title="High Intensity Fires" 
            value={loadingFire ? "..." : fireStats.highIntensity} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            }
            trend={8.3}
            color="text-orange-500"
          />
          <StatsCard 
            title="Avg Fire Radiative Power" 
            value={loadingFire ? "..." : `${fireStats.avgFRP} MW`} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            trend={-3.2}
            color="text-yellow-500"
          />
          <StatsCard 
            title="Critical Deforestation Zones" 
            value={loadingLoss ? "..." : lossStats.critical} 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            trend={15.7}
            color="text-rose-600"
          />
        </div>
        
        {/* Map Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "fire", label: "🔥 Active Wildfires", icon: "🔥" },
                { id: "forest", label: "🌲 Forest Coverage", icon: "🌲" },
                { id: "loss", label: "🌳 Deforestation Hotspots", icon: "🌳" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Map Visualizations */}
        <div className="space-y-8 mb-12">
          {activeTab === "fire" && (
            <WorldMapVisualization
              markers={fireMarkers}
              theme="dark"
              title="🔥 Active Wildfires"
              stats={`${fireStats.total} active fires • Avg FRP: ${fireStats.avgFRP} MW`}
            />
          )}
          
          {activeTab === "forest" && (
            <WorldMapVisualization
              markers={forestMarkers}
              theme="light"
              title="🌲 Global Forest Coverage"
              stats={`${forestStats.total} regions • Avg coverage: ${forestStats.avgCoverage}`}
            />
          )}
          
          {activeTab === "loss" && (
            <WorldMapVisualization
              markers={lossMarkers}
              theme="dark"
              title="🌳 Deforestation Hotspots (2000-2024)"
              stats={`${lossStats.total} hotspots • Avg loss: ${lossStats.avgLoss}%`}
            />
          )}
        </div>
        
        {/* Data Trends Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">🔥 Wildfire Activity Trend</h3>
              <p className="text-sm text-gray-500 mt-1">Fire incidents and intensity over the past 6 months</p>
            </div>
            <div className="h-80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fireTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis yAxisId="left" stroke="#888" />
                  <YAxis yAxisId="right" orientation="right" stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="fires" 
                    name="Fire Incidents" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="intensity" 
                    name="Avg Intensity (FRP)" 
                    stroke="#f59e0b" 
                    strokeWidth={3} 
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">🌳 Forest Loss vs Coverage</h3>
              <p className="text-sm text-gray-500 mt-1">Annual deforestation rates and remaining forest coverage (2019-2024)</p>
            </div>
            <div className="h-80 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lossTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" stroke="#888" />
                  <YAxis yAxisId="left" stroke="#888" domain={[0, 25]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888" domain={[70, 90]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="loss" 
                    name="Forest Loss (%)" 
                    fill="#ef4444" 
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="coverage" 
                    name="Forest Coverage (%)" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Data Sources */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 p-6 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <div className="flex items-center space-x-2 text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.003 3.003 0 00.675-2.229 3.001 3.001 0 00-2.229.675l-1.524-1.524a8.01 8.01 0 012.754-.668 8.01 8.01 0 012.754.668zm-8-2a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">NASA FIRMS</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.003 3.003 0 00.675-2.229 3.001 3.001 0 00-2.229.675l-1.524-1.524a8.01 8.01 0 012.754-.668 8.01 8.01 0 012.754.668zm-8-2a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Global Forest Watch</span>
            </div>
            <div className="flex items-center space-x-2 text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.003 3.003 0 00.675-2.229 3.001 3.001 0 00-2.229.675l-1.524-1.524a8.01 8.01 0 012.754-.668 8.01 8.01 0 012.754.668zm-8-2a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">UMD/Google/USGS/NASA</span>
            </div>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Data sources for scientific research and environmental monitoring. Updated daily with satellite observations.
          </p>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>© 2026 EcoVision Environmental Monitoring Platform. All rights reserved.</p>
          <p className="mt-1">Data sources: NASA FIRMS, Global Forest Watch, Hansen/UMD/Google/USGS/NASA Global Forest Change</p>
        </div>
      </footer>
    </div>
  );
}



// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
//  import { Link } from "react-router-dom";
//  import { ArrowLeft } from "lucide-react";
// import { Map, MapMarker, MapControls, MapGeoJSONLayer, MapHeatmapLayer, MapGridOverlay } from "@/components/ui/map";
// import {
//   parseForestExcel,
//   ForestData,
//   getForestIntensity,
//   formatHectares,
// } from "@/utils/parseForestData";
// import { useMapData } from "@/hooks/useMapData";

// /* -------------------- Types -------------------------- */
// interface FireData {
//   latitude: number;
//   longitude: number;
//   frp: number;
//   acq_date: string;
//   satellite: string;
//   confidence: string | number;
// }

// interface TreeLossData {
//   region: string;
//   latitude: number;
//   longitude: number;
//   lossPercentage: number;
//   lossYear: string;
//   area: string;
//   cause: string;
// }

// /* -------------------- Regions -------------------- */
// const regions: Record<
//   string,
//   { center: [number, number]; zoom: number }
// > = {
//   all: { center: [0, 20], zoom: 1.5 },
//   africa: { center: [20, 0], zoom: 2.5 },
//   asia: { center: [100, 30], zoom: 2.5 },
//   europe: { center: [15, 50], zoom: 3 },
//   "north-america": { center: [-100, 45], zoom: 2.5 },
//   "south-america": { center: [-60, -15], zoom: 2.5 },
//   oceania: { center: [140, -25], zoom: 3 },
// };

// /* -------------------- Fallback Forest Data -------------------- */
// const fallbackForestData: ForestData[] = [
//   { iso: 'BRA', country: 'Brazil', gfc_extent_ha: 492000000, area_ha: 851600000, latitude: -14.24, longitude: -51.93 },
//   { iso: 'RUS', country: 'Russia', gfc_extent_ha: 815000000, area_ha: 1710000000, latitude: 61.52, longitude: 105.32 },
//   { iso: 'CAN', country: 'Canada', gfc_extent_ha: 347000000, area_ha: 998500000, latitude: 56.13, longitude: -106.35 },
//   { iso: 'USA', country: 'United States', gfc_extent_ha: 310000000, area_ha: 937300000, latitude: 37.09, longitude: -95.71 },
//   { iso: 'CHN', country: 'China', gfc_extent_ha: 208000000, area_ha: 960000000, latitude: 35.86, longitude: 104.20 },
//   { iso: 'COD', country: 'DR Congo', gfc_extent_ha: 152000000, area_ha: 234500000, latitude: -4.04, longitude: 21.76 },
//   { iso: 'AUS', country: 'Australia', gfc_extent_ha: 134000000, area_ha: 769200000, latitude: -25.27, longitude: 133.78 },
//   { iso: 'IDN', country: 'Indonesia', gfc_extent_ha: 91000000, area_ha: 191000000, latitude: -0.79, longitude: 113.92 },
//   { iso: 'PER', country: 'Peru', gfc_extent_ha: 72000000, area_ha: 128500000, latitude: -9.19, longitude: -75.02 },
//   { iso: 'IND', country: 'India', gfc_extent_ha: 70000000, area_ha: 328700000, latitude: 20.59, longitude: 78.96 },
//   { iso: 'MEX', country: 'Mexico', gfc_extent_ha: 66000000, area_ha: 196400000, latitude: 23.63, longitude: -102.55 },
//   { iso: 'COL', country: 'Colombia', gfc_extent_ha: 59000000, area_ha: 114200000, latitude: 4.57, longitude: -74.30 },
//   { iso: 'ARG', country: 'Argentina', gfc_extent_ha: 29000000, area_ha: 278000000, latitude: -38.42, longitude: -63.62 },
//   { iso: 'BOL', country: 'Bolivia', gfc_extent_ha: 50000000, area_ha: 109900000, latitude: -16.29, longitude: -63.59 },
//   { iso: 'VEN', country: 'Venezuela', gfc_extent_ha: 47000000, area_ha: 91600000, latitude: 6.42, longitude: -66.59 },
//   { iso: 'MYS', country: 'Malaysia', gfc_extent_ha: 22000000, area_ha: 33000000, latitude: 4.21, longitude: 101.98 },
//   { iso: 'PNG', country: 'Papua New Guinea', gfc_extent_ha: 33000000, area_ha: 46300000, latitude: -6.31, longitude: 143.96 },
//   { iso: 'MMR', country: 'Myanmar', gfc_extent_ha: 29000000, area_ha: 67700000, latitude: 21.92, longitude: 95.96 },
//   { iso: 'AGO', country: 'Angola', gfc_extent_ha: 58000000, area_ha: 124700000, latitude: -11.20, longitude: 17.87 },
//   { iso: 'MOZ', country: 'Mozambique', gfc_extent_ha: 38000000, area_ha: 80200000, latitude: -18.67, longitude: 35.53 },
//   { iso: 'TZA', country: 'Tanzania', gfc_extent_ha: 46000000, area_ha: 94500000, latitude: -6.37, longitude: 34.89 },
//   { iso: 'ZMB', country: 'Zambia', gfc_extent_ha: 44000000, area_ha: 75300000, latitude: -13.13, longitude: 27.85 },
//   { iso: 'SWE', country: 'Sweden', gfc_extent_ha: 28000000, area_ha: 45000000, latitude: 60.13, longitude: 18.64 },
//   { iso: 'FIN', country: 'Finland', gfc_extent_ha: 22000000, area_ha: 33800000, latitude: 61.92, longitude: 25.75 },
//   { iso: 'JPN', country: 'Japan', gfc_extent_ha: 25000000, area_ha: 37800000, latitude: 36.20, longitude: 138.25 },
//   { iso: 'GAB', country: 'Gabon', gfc_extent_ha: 22000000, area_ha: 26800000, latitude: -0.80, longitude: 11.61 },
//   { iso: 'CMR', country: 'Cameroon', gfc_extent_ha: 19000000, area_ha: 47500000, latitude: 7.37, longitude: 12.35 },
//   { iso: 'CAF', country: 'Central African Republic', gfc_extent_ha: 22000000, area_ha: 62300000, latitude: 6.61, longitude: 20.94 },
//   { iso: 'COG', country: 'Congo', gfc_extent_ha: 22000000, area_ha: 34200000, latitude: -0.23, longitude: 15.83 },
//   { iso: 'ECU', country: 'Ecuador', gfc_extent_ha: 12000000, area_ha: 28400000, latitude: -1.83, longitude: -78.18 },
//   { iso: 'GUY', country: 'Guyana', gfc_extent_ha: 18000000, area_ha: 21500000, latitude: 4.86, longitude: -58.93 },
//   { iso: 'SUR', country: 'Suriname', gfc_extent_ha: 15000000, area_ha: 16400000, latitude: 3.92, longitude: -56.03 },
//   { iso: 'LAO', country: 'Laos', gfc_extent_ha: 16000000, area_ha: 23700000, latitude: 19.86, longitude: 102.50 },
//   { iso: 'KHM', country: 'Cambodia', gfc_extent_ha: 10000000, area_ha: 18100000, latitude: 12.57, longitude: 104.99 },
//   { iso: 'THA', country: 'Thailand', gfc_extent_ha: 16000000, area_ha: 51300000, latitude: 15.87, longitude: 100.99 },
//   { iso: 'VNM', country: 'Vietnam', gfc_extent_ha: 14000000, area_ha: 33100000, latitude: 14.06, longitude: 108.28 },
//   { iso: 'NOR', country: 'Norway', gfc_extent_ha: 12000000, area_ha: 38500000, latitude: 60.47, longitude: 8.47 },
//   { iso: 'DEU', country: 'Germany', gfc_extent_ha: 11000000, area_ha: 35740000, latitude: 51.17, longitude: 10.45 },
//   { iso: 'FRA', country: 'France', gfc_extent_ha: 17000000, area_ha: 64000000, latitude: 46.23, longitude: 2.21 },
//   { iso: 'ESP', country: 'Spain', gfc_extent_ha: 18000000, area_ha: 50600000, latitude: 40.46, longitude: -3.75 },
// ];

// /* -------------------- Tree Loss Data Type for DB -------------------- */
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

// /* -------------------- Markers -------------------- */
// const FireMarker = ({ fire }: { fire: FireData }) => {
//   const color =
//     fire.frp > 50
//       ? "bg-red-500"
//       : fire.frp > 20
//       ? "bg-yellow-400"
//       : "bg-green-400";

//   return (
//     <div className="relative group">
//       <div
//         className={`w-3 h-3 rounded-full border border-white/30 ${color}`}
//       />
//       <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-[11px] px-3 py-2 rounded-md whitespace-nowrap z-[9999] shadow-xl border border-white/20">
//         <div className="font-medium">{fire.satellite}</div>
//         <div>
//           {fire.acq_date} • FRP {fire.frp.toFixed(1)} MW
//         </div>
//       </div>
//     </div>
//   );
// };

// const ForestMarker = ({ forest }: { forest: ForestData }) => {
//   const intensity = getForestIntensity(forest.gfc_extent_ha);
//   const color =
//     intensity === "high"
//       ? "bg-green-700"
//       : intensity === "medium"
//       ? "bg-green-500"
//       : "bg-green-300";

//   return (
//     <div className="relative group">
//       <div
//         className={`w-3 h-3 rounded-full border border-white/20 ${color}`}
//       />
//       <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-white text-gray-800 text-[11px] px-2 py-1 rounded shadow whitespace-nowrap z-50">
//         <div className="font-medium">{forest.country}</div>
//         <div>{formatHectares(forest.gfc_extent_ha)}</div>
//       </div>
//     </div>
//   );
// };

// const TreeLossMarkerDB = ({ data }: { data: TreeLossFromDB }) => {
//   const intensity = data.loss_percentage > 20 ? "critical" : data.loss_percentage > 15 ? "high" : "moderate";
//   const colorMap = {
//     critical: "bg-red-600",
//     high: "bg-orange-500",
//     moderate: "bg-yellow-500"
//   };
//   const sizeMap = {
//     critical: "w-4 h-4",
//     high: "w-3.5 h-3.5",
//     moderate: "w-3 h-3"
//   };

//   return (
//     <div className="relative group">
//       {intensity === "critical" && (
//         <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-40" style={{ width: 20, height: 20, marginLeft: -2, marginTop: -2 }} />
//       )}
//       <div
//         className={`${sizeMap[intensity]} rounded-full border-2 border-white/80 ${colorMap[intensity]} shadow-lg`}
//         style={{ boxShadow: intensity === "critical" ? "0 0 12px rgba(239, 68, 68, 0.6)" : "0 0 8px rgba(0,0,0,0.3)" }}
//       />
//       <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-900 text-white text-[11px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50 border border-gray-700">
//         <div className="font-semibold text-orange-400 mb-1">{data.region}</div>
//         <div className="text-gray-300">Loss: <span className="text-white font-medium">{data.loss_percentage}%</span></div>
//         <div className="text-gray-300">Period: <span className="text-white">{data.loss_year}</span></div>
//         <div className="text-gray-300">Area: <span className="text-white">{data.area}</span></div>
//         <div className="text-gray-300">Cause: <span className="text-yellow-400">{data.cause}</span></div>
//       </div>
//     </div>
//   );
// };

// /* -------------------- Main Component -------------------- */
// export default function MapsMinimal() {
//   const [fireData, setFireData] = useState<FireData[]>([]);
//   const [forestData, setForestData] = useState<ForestData[]>([]);
//   const [loadingFires, setLoadingFires] = useState(false);
//   const [loadingForest, setLoadingForest] = useState(false);

//   const [days, setDays] = useState("1");
//   const [satelliteSource, setSatelliteSource] =
//     useState("VIIRS_SNPP_NRT");
//   const [selectedRegion, setSelectedRegion] = useState("all");

//   const lastFetchRef = useRef(0);

//   // Lazy-loaded map data from database
//   const { forestCover: dbForestCover, treeLoss: dbTreeLoss, loading: loadingMapData } = useMapData();

//   /* -------------------- Fire Fetch (Optimized) -------------------- */
//   const fetchFireData = useCallback(async (d: string, src: string) => {
//     if (Date.now() - lastFetchRef.current < 2000) return;
//     lastFetchRef.current = Date.now();

//     const controller = new AbortController();
//     setLoadingFires(true);

//     try {
//       const res = await fetch(
//         `https://iokkwxjkvzgstkkbwnoa.supabase.co/functions/v1/nasa-firms?days=${d}&source=${src}&area=world&limit=5000`,
//         { signal: controller.signal }
//       );

//       if (!res.ok) throw new Error("API failed");

//       const json = await res.json();
//       const fires = (json.fires || []).slice(0, 3000); // HARD CAP
//       setFireData(fires);
//     } catch (e: any) {
//       if (e.name !== "AbortError") {
//         console.error("Fire fetch failed", e);
//         setFireData([]);
//       }
//     } finally {
//       setLoadingFires(false);
//     }

//     return () => controller.abort();
//   }, []);

//   useEffect(() => {
//     fetchFireData(days, satelliteSource);
//   }, [days, satelliteSource, fetchFireData]);

//   /* -------------------- Forest Load with Fallback -------------------- */
//   useEffect(() => {
//     const loadForest = async () => {
//       setLoadingForest(true);
//       try {
//         const data = await parseForestExcel("/data/global_forest_data.xlsx");
//         const cleaned = (data || []).filter((d) => d.latitude && d.longitude);
//         if (cleaned.length > 0) {
//           setForestData(cleaned);
//         } else {
//           // Use fallback data if Excel parsing fails or returns empty
//           setForestData(fallbackForestData);
//         }
//       } catch (e) {
//         console.error("Forest load failed, using fallback:", e);
//         setForestData(fallbackForestData);
//       } finally {
//         setLoadingForest(false);
//       }
//     };
//     loadForest();
//   }, []);

//   /* -------------------- Memoized Markers -------------------- */
//   const fireMarkers = useMemo(
//     () =>
//       fireData.map((f, i) => (
//         <MapMarker
//           key={i}
//           longitude={f.longitude}
//           latitude={f.latitude}
//         >
//           <FireMarker fire={f} />
//         </MapMarker>
//       )),
//     [fireData]
//   );

//   const forestMarkers = useMemo(
//     () =>
//       forestData.map((f, i) => (
//         <MapMarker
//           key={i}
//           longitude={f.longitude!}
//           latitude={f.latitude!}
//         >
//           <ForestMarker forest={f} />
//         </MapMarker>
//       )),
//     [forestData]
//   );

//   const treeLossMarkers = useMemo(
//     () =>
//       dbTreeLoss.map((d, i) => (
//         <MapMarker
//           key={d.id || i}
//           longitude={d.longitude}
//           latitude={d.latitude}
//         >
//           <TreeLossMarkerDB data={d} />
//         </MapMarker>
//       )),
//     [dbTreeLoss]
//   );

//   // Stats for tree loss
//   const treeLossStats = useMemo(() => {
//     const critical = dbTreeLoss.filter(d => d.loss_percentage > 20).length;
//     const high = dbTreeLoss.filter(d => d.loss_percentage > 15 && d.loss_percentage <= 20).length;
//     const avgLoss = dbTreeLoss.length > 0 
//       ? dbTreeLoss.reduce((sum, d) => sum + d.loss_percentage, 0) / dbTreeLoss.length 
//       : 0;
//     return { critical, high, avgLoss, total: dbTreeLoss.length };
//   }, [dbTreeLoss]);

//   const region = regions[selectedRegion] || regions.all;

//   /* -------------------- UI -------------------- */
//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       <header className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center border-b border-gray-200 mb-6">
//         <div className="flex items-center gap-4">
//           <Link
//             to="/"
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span className="text-sm font-medium">Home</span>
//           </Link>
//           <div className="h-6 w-px bg-gray-300" />
//         <div>
//           <h1 className="text-2xl font-semibold">
//             Environmental Maps
//           </h1>
//           <p className="text-sm text-gray-600">
//             Wildfire, Natural Forest Cover, Global Forest Change 2000-2024
//           </p>
//         </div>
//         </div>

//         <div className="flex gap-2 text-sm">
//           <select
//             className="border rounded px-2 py-1"
//             value={days}
//             onChange={(e) => setDays(e.target.value)}
//           >
//             <option value="1">24h</option>
//             <option value="2">48h</option>
//             <option value="7">7d</option>
//           </select>

//           <select
//             className="border rounded px-2 py-1"
//             value={satelliteSource}
//             onChange={(e) => setSatelliteSource(e.target.value)}
//           >
//             <option value="VIIRS_SNPP_NRT">VIIRS SNPP</option>
//             <option value="VIIRS_NOAA20_NRT">VIIRS NOAA-20</option>
//             <option value="MODIS_NRT">MODIS</option>
//           </select>

//           <select
//             className="border rounded px-2 py-1"
//             value={selectedRegion}
//             onChange={(e) => setSelectedRegion(e.target.value)}
//           >
//             <option value="all">All</option>
//             <option value="asia">Asia</option>
//             <option value="africa">Africa</option>
//             <option value="europe">Europe</option>
//           </select>
//         </div>
//       </header>

//       <main className="max-w-6xl mx-auto px-4 space-y-6 pb-12">
//         {/* Stats */}
//         <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
//           <div className="bg-white border rounded p-3">
//             <div className="text-xs text-gray-500">Total Fires</div>
//             <div className="text-lg font-semibold">
//               {fireData.length}
//             </div>
//           </div>
//           <div className="bg-white border rounded p-3">
//             <div className="text-xs text-gray-500">High Intensity</div>
//             <div className="text-lg font-semibold text-red-600">
//               {fireData.filter((f) => f.frp > 50).length}
//             </div>
//           </div>
//           <div className="bg-white border rounded p-3">
//             <div className="text-xs text-gray-500">Forest Records</div>
//             <div className="text-lg font-semibold text-green-600">
//               {forestData.length}
//             </div>
//           </div>
//           <div className="bg-white border rounded p-3">
//             <div className="text-xs text-gray-500">Tree Loss Hotspots</div>
//             <div className="text-lg font-semibold text-orange-600">
//               {treeLossStats.total}
//             </div>
//           </div>
//           <div className="bg-white border rounded p-3">
//             <div className="text-xs text-gray-500">Avg Loss Rate</div>
//             <div className="text-lg font-semibold text-orange-500">
//               {treeLossStats.avgLoss.toFixed(1)}%
//             </div>
//           </div>
//         </section>

//         {/* Fire Map */}
//         <section className="bg-white border rounded overflow-hidden">
//           <div className="p-3 border-b text-sm flex justify-between">
//             <span>🔥 Active Wildfires</span>
//             <span className="text-gray-500">
//               {loadingFires ? "Loading…" : `${fireData.length} points`}
//             </span>
//           </div>
//           <div className="h-80 relative">
//             <Map
//               center={[0, 20]}
//               zoom={1.8}
//               theme="dark"
//               className="absolute inset-0"
//             >
//               <MapControls showZoom position="top-right" />
//               {fireMarkers}
//             </Map>
//           </div>
//         </section>

//         {/* Forest Map */}
//         <section className="bg-white border rounded overflow-hidden">
//           <div className="p-3 border-b text-sm flex justify-between">
//             <span>🌲 Natural Forest Cover</span>
//             <span className="text-gray-500">
//               {loadingForest ? "Loading…" : `${forestData.length} records`}
//             </span>
//           </div>
//           <div className="h-80 relative">
//             <Map
//               center={region.center}
//               zoom={region.zoom}
//               theme="light"
//               className="absolute inset-0"
//             >
//               <MapControls showZoom position="top-right" />
//               {forestMarkers}
//             </Map>
//           </div>
//           <div className="p-2 bg-gray-50 border-t flex gap-4 text-xs text-gray-600">
//             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-700"></span> &gt;50M ha</span>
//             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> &gt;10M ha</span>
//             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-300"></span> &lt;10M ha</span>
//           </div>
//         </section>

//         {/* Global Forest Change - Simple */}
//         <section className="bg-white border rounded overflow-hidden">
//           <div className="p-3 border-b text-sm flex justify-between items-center">
//             <span>🌳 Global Forest Change 2000-2024</span>
//             <span className="text-gray-500">
//               {loadingMapData ? "Loading…" : `${treeLossStats.total} hotspots`}
//             </span>
//           </div>
//           <div className="h-80 relative">
//             <Map
//               center={[0, 20]}
//               zoom={1.5}
//               theme="dark"
//               className="absolute inset-0"
//             >
//               <MapControls showZoom position="top-right" />
//               {treeLossMarkers}
//             </Map>
//           </div>
//           <div className="p-2 bg-gray-50 border-t flex items-center justify-center gap-4 text-xs text-gray-600">
//             <span className="flex items-center gap-1">
//               <span className="w-2 h-2 rounded-full bg-red-600"></span> Critical
//             </span>
//             <span className="flex items-center gap-1">
//               <span className="w-2 h-2 rounded-full bg-orange-500"></span> High
//             </span>
//             <span className="flex items-center gap-1">
//               <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Moderate
//             </span>
//           </div>
//         </section>

//         <footer className="text-center text-xs text-black space-y-1">
//           <div>NASA FIRMS • Global Forest Watch • Hansen/UMD/Google/USGS/NASA Global Forest Change</div>
//           <div className="text-black">Data sources for scientific and educational purposes</div>
//         </footer>
//       </main>
//     </div>
//   );
// }




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
