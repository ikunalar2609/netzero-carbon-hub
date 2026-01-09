// import { useState, useEffect, useCallback, useMemo } from "react";
// import { motion } from "framer-motion";
// import { 
//   Flame, 
//   Droplets, 
//   TreePine, 
//   Globe, 
//   MapPin, 
//   Layers, 
//   Clock,
//   Info,
//   Maximize2,
//   Filter,
//   Loader2,
//   Zap,
//   Satellite,
//   TrendingUp,
//   AlertTriangle,
//   RefreshCw
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import HomeHeader from "@/components/home/HomeHeader";
// import { Map, MapMarker, MapControls } from "@/components/ui/map";
// import { toast } from "sonner";

// interface FireData {
//   latitude: number;
//   longitude: number;
//   brightness: number;
//   confidence: string | number;
//   acq_date: string;
//   satellite: string;
//   frp: number;
// }

// interface MapCardProps {
//   title: string;
//   icon: React.ReactNode;
//   source: string;
//   legend: { label: string; color: string }[];
//   children?: React.ReactNode;
//   timeFilter?: boolean;
//   regionFilter?: boolean;
//   onTimeChange?: (time: string) => void;
//   onRegionChange?: (region: string) => void;
//   loading?: boolean;
//   dataCount?: number;
// }

// const MapCard = ({ 
//   title, icon, source, legend, children, 
//   timeFilter, regionFilter, onTimeChange, onRegionChange,
//   loading, dataCount
// }: MapCardProps) => {
//   const [timeRange, setTimeRange] = useState("1");
//   const [region, setRegion] = useState("world");

//   const handleTimeChange = (value: string) => {
//     setTimeRange(value);
//     onTimeChange?.(value);
//   };

//   const handleRegionChange = (value: string) => {
//     setRegion(value);
//     onRegionChange?.(value);
//   };

//   return (
//     <motion.div
//       className="relative bg-[#0a0f1a] rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl group"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       whileHover={{ scale: 1.01, boxShadow: "0 0 40px rgba(34, 197, 94, 0.1)" }}
//     >
//       {/* Header */}
//       <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-[#0a0f1a] via-[#0a0f1a]/80 to-transparent">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="p-2 bg-gray-800/80 rounded-lg backdrop-blur-sm">
//               {icon}
//             </div>
//             <h3 className="text-white font-semibold text-sm">{title}</h3>
//             {loading && <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />}
//             {dataCount !== undefined && !loading && (
//               <Badge variant="outline" className="text-[10px] bg-gray-800/80 border-gray-700 text-gray-300">
//                 {dataCount} points
//               </Badge>
//             )}
//           </div>
          
//           <div className="flex items-center gap-2">
//             {timeFilter && (
//               <Select value={timeRange} onValueChange={handleTimeChange}>
//                 <SelectTrigger className="h-8 w-24 bg-gray-800/80 border-gray-700 text-xs text-gray-300">
//                   <Clock className="h-3 w-3 mr-1" />
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="bg-gray-900 border-gray-700">
//                   <SelectItem value="1">24h</SelectItem>
//                   <SelectItem value="7">7 days</SelectItem>
//                   <SelectItem value="10">10 days</SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
            
//             {regionFilter && (
//               <Select value={region} onValueChange={handleRegionChange}>
//                 <SelectTrigger className="h-8 w-24 bg-gray-800/80 border-gray-700 text-xs text-gray-300">
//                   <Globe className="h-3 w-3 mr-1" />
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="bg-gray-900 border-gray-700">
//                   <SelectItem value="world">Global</SelectItem>
//                   <SelectItem value="-180,-60,180,60">Main Land</SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
            
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
//                   <Maximize2 className="h-4 w-4" />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Expand Map</TooltipContent>
//             </Tooltip>
//           </div>
//         </div>
//       </div>

//       {/* Map Content */}
//       <div className="aspect-[4/3] relative">
//         {children}
//       </div>

//       {/* Legend */}
//       <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/80 to-transparent">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             {legend.map((item, index) => (
//               <div key={index} className="flex items-center gap-1.5">
//                 <div 
//                   className="w-2.5 h-2.5 rounded-full shadow-lg"
//                   style={{ 
//                     backgroundColor: item.color,
//                     boxShadow: `0 0 8px ${item.color}80`
//                   }}
//                 />
//                 <span className="text-xs text-gray-400">{item.label}</span>
//               </div>
//             ))}
//           </div>
          
//           <div className="flex items-center gap-1 text-[10px] text-gray-500">
//             <Info className="h-3 w-3" />
//             <span>{source}</span>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Fire marker component
// const FireMarker = ({ fire }: { fire: FireData }) => {
//   const getIntensity = () => {
//     if (fire.frp > 50) return "high";
//     if (fire.frp > 20) return "medium";
//     return "low";
//   };

//   const intensity = getIntensity();
//   const colors = {
//     high: "#ef4444",
//     medium: "#f59e0b",
//     low: "#22c55e"
//   };
//   const color = colors[intensity];

//   return (
//     <div className="relative group cursor-pointer">
//       {/* Glow effect */}
//       <div 
//         className="absolute inset-0 rounded-full animate-ping"
//         style={{ 
//           backgroundColor: color,
//           opacity: 0.3,
//           width: '16px',
//           height: '16px',
//           marginLeft: '-4px',
//           marginTop: '-4px'
//         }}
//       />
//       {/* Marker dot */}
//       <div 
//         className="w-2.5 h-2.5 rounded-full border border-white/50"
//         style={{ 
//           backgroundColor: color,
//           boxShadow: `0 0 10px ${color}80`
//         }}
//       />
//       {/* Tooltip */}
//       <div className="absolute left-1/2 -translate-x-1/2 -top-16 bg-gray-900/95 px-3 py-2 rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none border border-gray-700">
//         <div className="font-semibold mb-1">{fire.satellite} Detection</div>
//         <div>Date: {fire.acq_date}</div>
//         <div>FRP: {fire.frp?.toFixed(1)} MW</div>
//         <div>Confidence: {fire.confidence}</div>
//       </div>
//     </div>
//   );
// };

// // Static marker data for non-wildfire maps
// const groundwaterIndiaMarkers = [
//   { lat: 28.6139, lng: 77.2090, intensity: "high" as const, label: "Delhi - Critical" },
//   { lat: 26.8467, lng: 80.9462, intensity: "high" as const, label: "Lucknow - Critical" },
//   { lat: 22.5726, lng: 88.3639, intensity: "medium" as const, label: "Kolkata" },
//   { lat: 19.0760, lng: 72.8777, intensity: "low" as const, label: "Mumbai - Safe" },
//   { lat: 12.9716, lng: 77.5946, intensity: "medium" as const, label: "Bangalore" },
//   { lat: 13.0827, lng: 80.2707, intensity: "low" as const, label: "Chennai" },
//   { lat: 23.0225, lng: 72.5714, intensity: "high" as const, label: "Ahmedabad - Critical" },
//   { lat: 17.3850, lng: 78.4867, intensity: "medium" as const, label: "Hyderabad" },
// ];

// const globalWaterStressMarkers = [
//   { lat: 31.0461, lng: 34.8516, intensity: "high" as const, label: "Middle East" },
//   { lat: 28.3949, lng: 84.1240, intensity: "high" as const, label: "South Asia" },
//   { lat: 35.8617, lng: 104.1954, intensity: "high" as const, label: "Northern China" },
//   { lat: 33.9391, lng: -6.9686, intensity: "medium" as const, label: "North Africa" },
//   { lat: 40.4637, lng: -3.7492, intensity: "medium" as const, label: "Spain" },
//   { lat: -25.2744, lng: 133.7751, intensity: "medium" as const, label: "Australia" },
//   { lat: 37.0902, lng: -95.7129, intensity: "low" as const, label: "Central USA" },
//   { lat: -14.2350, lng: -51.9253, intensity: "low" as const, label: "Brazil" },
// ];

// const forestLossMarkers = [
//   { lat: -3.4653, lng: -62.2159, intensity: "high" as const, label: "Amazon Deforestation" },
//   { lat: 0.7893, lng: 113.9213, intensity: "high" as const, label: "Borneo" },
//   { lat: -0.0236, lng: 37.9062, intensity: "medium" as const, label: "East Africa" },
//   { lat: 5.1521, lng: -2.9248, intensity: "medium" as const, label: "West Africa" },
//   { lat: 64.2008, lng: -152.4937, intensity: "low" as const, label: "Alaska" },
//   { lat: 60.4720, lng: 8.4689, intensity: "low" as const, label: "Scandinavia" },
//   { lat: -6.3690, lng: 34.8888, intensity: "medium" as const, label: "Tanzania" },
//   { lat: 15.8700, lng: 100.9925, intensity: "high" as const, label: "Southeast Asia" },
// ];

// // Static marker component
// const StaticMarker = ({ intensity, label }: { intensity: "high" | "medium" | "low"; label: string }) => {
//   const colors = {
//     high: "#ef4444",
//     medium: "#f59e0b",
//     low: "#22c55e"
//   };
//   const color = colors[intensity];

//   return (
//     <div className="relative group cursor-pointer">
//       <div 
//         className="absolute inset-0 rounded-full animate-ping"
//         style={{ 
//           backgroundColor: color,
//           opacity: 0.3,
//           width: '16px',
//           height: '16px',
//           marginLeft: '-4px',
//           marginTop: '-4px'
//         }}
//       />
//       <div 
//         className="w-3 h-3 rounded-full border border-white/50"
//         style={{ 
//           backgroundColor: color,
//           boxShadow: `0 0 10px ${color}80`
//         }}
//       />
//       <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-gray-900/95 px-2 py-1 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
//         {label}
//       </div>
//     </div>
//   );
// };

// const Maps = () => {
//   const [fireData, setFireData] = useState<FireData[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [days, setDays] = useState("1");
//   const [satelliteSource, setSatelliteSource] = useState("VIIRS_SNPP_NRT");
//   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
//   const [totalFireCount, setTotalFireCount] = useState(0);

//   // Fire statistics
//   const fireStats = useMemo(() => {
//     if (!fireData.length) return null;
//     const highIntensity = fireData.filter(f => f.frp > 50).length;
//     const mediumIntensity = fireData.filter(f => f.frp > 20 && f.frp <= 50).length;
//     const lowIntensity = fireData.filter(f => f.frp <= 20).length;
//     const avgFrp = fireData.reduce((sum, f) => sum + (f.frp || 0), 0) / fireData.length;
//     const maxFrp = Math.max(...fireData.map(f => f.frp || 0));
    
//     return { highIntensity, mediumIntensity, lowIntensity, avgFrp, maxFrp };
//   }, [fireData]);

//   const fetchFireData = useCallback(async (daysParam: string, source: string) => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://iokkwxjkvzgstkkbwnoa.supabase.co/functions/v1/nasa-firms?days=${daysParam}&source=${source}&area=world`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error: ${response.status}`);
//       }

//       const result = await response.json();
      
//       if (result.fires) {
//         setFireData(result.fires);
//         setTotalFireCount(result.count || result.fires.length);
//         setLastUpdated(new Date());
//         toast.success(`Loaded ${result.count || result.fires.length} active fires`);
//       }
//     } catch (error) {
//       console.error('Error fetching fire data:', error);
//       toast.error('Failed to load live fire data');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchFireData(days, satelliteSource);
//   }, [days, satelliteSource, fetchFireData]);

//   const handleTimeChange = (time: string) => {
//     setDays(time);
//   };

//   const handleSatelliteChange = (source: string) => {
//     setSatelliteSource(source);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
//       <HomeHeader />
      
//       <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
//         {/* Page Header */}
//         <motion.div 
//           className="mb-10"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl border border-green-500/30">
//               <Globe className="h-8 w-8 text-green-400" />
//             </div>
//             <div>
//               <h1 className="text-3xl md:text-4xl font-bold text-white">Environmental Maps</h1>
//               <p className="text-gray-400 mt-1">Real-time climate, water, and forest monitoring dashboards</p>
//             </div>
//           </div>
          
//           {/* Quick Actions */}
//           <div className="flex flex-wrap items-center gap-3 mt-6">
//             <Button 
//               variant="outline" 
//               size="sm"
//               className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
//               onClick={() => fetchFireData(days, satelliteSource)}
//               disabled={loading}
//             >
//               <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
//               Refresh Data
//             </Button>
//             <Button 
//               variant="outline" 
//               size="sm"
//               className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
//             >
//               <Layers className="h-4 w-4 mr-2" />
//               Toggle Layers
//             </Button>
//             <Button 
//               variant="outline" 
//               size="sm"
//               className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               Filters
//             </Button>
            
//             <div className="flex gap-2 ml-auto">
//               <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
//                 <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
//                 Live Data
//               </Badge>
//               <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700">
//                 {lastUpdated ? `Updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
//               </Badge>
//             </div>
//           </div>
//         </motion.div>

//         {/* Fire Statistics Panel */}
//         {fireStats && (
//           <motion.div 
//             className="mb-6 grid grid-cols-2 md:grid-cols-5 gap-3"
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
//               <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
//                 <Flame className="h-3.5 w-3.5 text-orange-400" />
//                 Total Active Fires
//               </div>
//               <div className="text-2xl font-bold text-white">{totalFireCount.toLocaleString()}</div>
//             </div>
//             <div className="bg-gray-900/60 border border-red-900/30 rounded-xl p-4">
//               <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
//                 <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
//                 High Intensity
//               </div>
//               <div className="text-2xl font-bold text-red-400">{fireStats.highIntensity}</div>
//             </div>
//             <div className="bg-gray-900/60 border border-amber-900/30 rounded-xl p-4">
//               <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
//                 <Zap className="h-3.5 w-3.5 text-amber-400" />
//                 Medium Intensity
//               </div>
//               <div className="text-2xl font-bold text-amber-400">{fireStats.mediumIntensity}</div>
//             </div>
//             <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
//               <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
//                 <TrendingUp className="h-3.5 w-3.5 text-cyan-400" />
//                 Avg FRP (MW)
//               </div>
//               <div className="text-2xl font-bold text-cyan-400">{fireStats.avgFrp.toFixed(1)}</div>
//             </div>
//             <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
//               <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
//                 <Flame className="h-3.5 w-3.5 text-red-500" />
//                 Max FRP (MW)
//               </div>
//               <div className="text-2xl font-bold text-red-500">{fireStats.maxFrp.toFixed(1)}</div>
//             </div>
//           </motion.div>
//         )}

//         {/* Map Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Wildfire Activity Map - Live Data - Full Width */}
//           <div className="lg:col-span-2">
//             <motion.div
//               className="relative bg-[#0a0f1a] rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               {/* Header */}
//               <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-[#0a0f1a] via-[#0a0f1a]/90 to-transparent">
//                 <div className="flex items-center justify-between flex-wrap gap-3">
//                   <div className="flex items-center gap-2">
//                     <div className="p-2 bg-orange-500/20 rounded-lg backdrop-blur-sm border border-orange-500/30">
//                       <Flame className="h-5 w-5 text-orange-400" />
//                     </div>
//                     <div>
//                       <h3 className="text-white font-semibold">Active Wildfire Detection</h3>
//                       <p className="text-xs text-gray-400">Live NASA FIRMS satellite data</p>
//                     </div>
//                     {loading && <Loader2 className="h-4 w-4 text-orange-400 animate-spin" />}
//                   </div>
                  
//                   <div className="flex items-center gap-2 flex-wrap">
//                     {/* Time Filter */}
//                     <Select value={days} onValueChange={handleTimeChange}>
//                       <SelectTrigger className="h-8 w-28 bg-gray-800/80 border-gray-700 text-xs text-gray-300">
//                         <Clock className="h-3 w-3 mr-1" />
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent className="bg-gray-900 border-gray-700">
//                         <SelectItem value="1">Last 24h</SelectItem>
//                         <SelectItem value="2">Last 48h</SelectItem>
//                         <SelectItem value="7">Last 7 days</SelectItem>
//                         <SelectItem value="10">Last 10 days</SelectItem>
//                       </SelectContent>
//                     </Select>
                    
//                     {/* Satellite Source Filter */}
//                     <Select value={satelliteSource} onValueChange={handleSatelliteChange}>
//                       <SelectTrigger className="h-8 w-36 bg-gray-800/80 border-gray-700 text-xs text-gray-300">
//                         <Satellite className="h-3 w-3 mr-1" />
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent className="bg-gray-900 border-gray-700">
//                         <SelectItem value="VIIRS_SNPP_NRT">VIIRS SNPP</SelectItem>
//                         <SelectItem value="VIIRS_NOAA20_NRT">VIIRS NOAA-20</SelectItem>
//                         <SelectItem value="MODIS_NRT">MODIS Terra/Aqua</SelectItem>
//                         <SelectItem value="LANDSAT_NRT">Landsat</SelectItem>
//                       </SelectContent>
//                     </Select>
                    
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
//                           <Maximize2 className="h-4 w-4" />
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent>Expand Map</TooltipContent>
//                     </Tooltip>
//                   </div>
//                 </div>
//               </div>

//               {/* Map */}
//               <div className="aspect-[21/9] relative">
//                 <Map 
//                   center={[0, 20]} 
//                   zoom={1.8} 
//                   theme="dark"
//                   className="absolute inset-0"
//                 >
//                   <MapControls position="top-right" showZoom showCompass={false} />
//                   {fireData.map((fire, index) => (
//                     <MapMarker
//                       key={`fire-${index}`}
//                       longitude={fire.longitude}
//                       latitude={fire.latitude}
//                     >
//                       <FireMarker fire={fire} />
//                     </MapMarker>
//                   ))}
//                 </Map>
//               </div>

//               {/* Legend */}
//               <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/90 to-transparent">
//                 <div className="flex items-center justify-between flex-wrap gap-2">
//                   <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-1.5">
//                       <div className="w-3 h-3 rounded-full bg-red-500" style={{ boxShadow: '0 0 8px #ef444480' }} />
//                       <span className="text-xs text-gray-400">High FRP (&gt;50 MW)</span>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <div className="w-3 h-3 rounded-full bg-amber-500" style={{ boxShadow: '0 0 8px #f59e0b80' }} />
//                       <span className="text-xs text-gray-400">Medium (20-50 MW)</span>
//                     </div>
//                     <div className="flex items-center gap-1.5">
//                       <div className="w-3 h-3 rounded-full bg-green-500" style={{ boxShadow: '0 0 8px #22c55e80' }} />
//                       <span className="text-xs text-gray-400">Low (&lt;20 MW)</span>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-2 text-[10px] text-gray-500">
//                     <Satellite className="h-3 w-3" />
//                     <span>Source: NASA FIRMS • {satelliteSource.replace('_NRT', '').replace('_', ' ')}</span>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Groundwater Levels - India */}
//           <MapCard
//             title="Groundwater Levels – India"
//             icon={<Droplets className="h-5 w-5 text-blue-400" />}
//             source="India-WRIS / CGWB"
//             legend={[
//               { label: "Critical", color: "#ef4444" },
//               { label: "Semi-Critical", color: "#f59e0b" },
//               { label: "Safe", color: "#22c55e" }
//             ]}
//             timeFilter
//           >
//             <Map 
//               center={[78, 22]} 
//               zoom={4} 
//               theme="dark"
//               className="absolute inset-0"
//             >
//               <MapControls position="top-right" showZoom showCompass={false} />
//               {groundwaterIndiaMarkers.map((marker, index) => (
//                 <MapMarker
//                   key={`gw-india-${index}`}
//                   longitude={marker.lng}
//                   latitude={marker.lat}
//                 >
//                   <StaticMarker intensity={marker.intensity} label={marker.label} />
//                 </MapMarker>
//               ))}
//             </Map>
//           </MapCard>

//           {/* Global Groundwater Stress */}
//           <MapCard
//             title="Global Water Stress"
//             icon={<Globe className="h-5 w-5 text-cyan-400" />}
//             source="UN IGRAC GGIS"
//             legend={[
//               { label: "High Stress", color: "#ef4444" },
//               { label: "Medium Stress", color: "#f59e0b" },
//               { label: "Low Stress", color: "#22c55e" }
//             ]}
//             regionFilter
//           >
//             <Map 
//               center={[30, 20]} 
//               zoom={1.5} 
//               theme="dark"
//               className="absolute inset-0"
//             >
//               <MapControls position="top-right" showZoom showCompass={false} />
//               {globalWaterStressMarkers.map((marker, index) => (
//                 <MapMarker
//                   key={`water-stress-${index}`}
//                   longitude={marker.lng}
//                   latitude={marker.lat}
//                 >
//                   <StaticMarker intensity={marker.intensity} label={marker.label} />
//                 </MapMarker>
//               ))}
//             </Map>
//           </MapCard>

//           {/* Forest Cover & Tree Loss */}
//           <MapCard
//             title="Forest Cover & Tree Loss Alerts"
//             icon={<TreePine className="h-5 w-5 text-green-400" />}
//             source="Global Forest Watch"
//             legend={[
//               { label: "Severe Loss", color: "#ef4444" },
//               { label: "Moderate", color: "#f59e0b" },
//               { label: "Stable", color: "#22c55e" }
//             ]}
//             timeFilter
//             regionFilter
//           >
//             <Map 
//               center={[-20, 0]} 
//               zoom={1.5} 
//               theme="dark"
//               className="absolute inset-0"
//             >
//               <MapControls position="top-right" showZoom showCompass={false} />
//               {forestLossMarkers.map((marker, index) => (
//                 <MapMarker
//                   key={`forest-${index}`}
//                   longitude={marker.lng}
//                   latitude={marker.lat}
//                 >
//                   <StaticMarker intensity={marker.intensity} label={marker.label} />
//                 </MapMarker>
//               ))}
//             </Map>
//           </MapCard>
//         </div>

//         {/* Data Sources Section */}
//         <motion.div 
//           className="mt-12 p-6 bg-gray-900/50 rounded-2xl border border-gray-800/50"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         >
//           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//             <Info className="h-5 w-5 text-gray-400" />
//             Data Sources & Methodology
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             <div className="p-4 bg-gray-800/30 rounded-xl">
//               <div className="flex items-center gap-2 mb-2">
//                 <Flame className="h-4 w-4 text-orange-400" />
//                 <span className="text-sm font-medium text-white">Wildfire Data</span>
//               </div>
//               <p className="text-xs text-gray-400">NASA FIRMS API - Live VIIRS satellite fire detection with Fire Radiative Power (FRP)</p>
//             </div>
//             <div className="p-4 bg-gray-800/30 rounded-xl">
//               <div className="flex items-center gap-2 mb-2">
//                 <Droplets className="h-4 w-4 text-blue-400" />
//                 <span className="text-sm font-medium text-white">India Groundwater</span>
//               </div>
//               <p className="text-xs text-gray-400">India-WRIS & Central Ground Water Board - District-level groundwater depth data</p>
//             </div>
//             <div className="p-4 bg-gray-800/30 rounded-xl">
//               <div className="flex items-center gap-2 mb-2">
//                 <Globe className="h-4 w-4 text-cyan-400" />
//                 <span className="text-sm font-medium text-white">Global Water Stress</span>
//               </div>
//               <p className="text-xs text-gray-400">UN IGRAC Global Groundwater Information System - Aquifer stress indicators</p>
//             </div>
//             <div className="p-4 bg-gray-800/30 rounded-xl">
//               <div className="flex items-center gap-2 mb-2">
//                 <TreePine className="h-4 w-4 text-green-400" />
//                 <span className="text-sm font-medium text-white">Forest Cover</span>
//               </div>
//               <p className="text-xs text-gray-400">Global Forest Watch - GLAD-S2 tree cover loss alerts and annual change data</p>
//             </div>
//           </div>
//         </motion.div>
//       </main>
//     </div>
//   );
// };

// export default Maps;
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Droplets,
  TreePine,
  Globe,
  Layers,
  Clock,
  Info,
  Maximize2,
  Filter,
  Loader2,
  Zap,
  Satellite,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
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

import HomeHeader from "@/components/home/HomeHeader";
import { Map, MapMarker, MapControls } from "@/components/ui/map";
import { toast } from "sonner";

/* -------------------- Types -------------------- */

interface FireData {
  latitude: number;
  longitude: number;
  brightness: number;
  confidence: string | number;
  acq_date: string;
  satellite: string;
  frp: number;
}

/* -------------------- Fire Marker -------------------- */

const FireMarker = ({ fire }: { fire: FireData }) => {
  const intensity =
    fire.frp > 50 ? "high" : fire.frp > 20 ? "medium" : "low";

  const colorMap = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
  };

  const size =
    intensity === "high" ? 14 : intensity === "medium" ? 10 : 7;

  return (
    <div className="relative group">
      {intensity === "high" && (
        <div
          className="absolute rounded-full animate-ping opacity-30"
          style={{
            width: size + 6,
            height: size + 6,
            backgroundColor: colorMap[intensity],
          }}
        />
      )}

      <div
        className="rounded-full border border-white/40"
        style={{
          width: size,
          height: size,
          backgroundColor: colorMap[intensity],
          boxShadow: `0 0 12px ${colorMap[intensity]}80`,
        }}
      />

      <div className="absolute left-1/2 -translate-x-1/2 -top-16 opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
        <div className="bg-black/90 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white shadow-xl">
              <div className="font-semibold mb-1 text-white">
                {fire.satellite} Detection
              </div>

              <div className="text-white/90">
                Date: {fire.acq_date}
              </div>

              <div className="text-white/90">
                FRP: {fire.frp.toFixed(1)} MW
              </div>

              <div className="text-white/90">
                Confidence: {fire.confidence}
              </div>
            </div>
            <div className="font-semibold mb-1">{fire.satellite}</div>
          <div>Date: {fire.acq_date}</div>
          <div>FRP: {fire.frp.toFixed(1)} MW</div>
          <div>Confidence: {fire.confidence}</div>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Main Component -------------------- */

const Maps = () => {
  const [fireData, setFireData] = useState<FireData[]>([]);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState("1");
  const [satelliteSource, setSatelliteSource] =
    useState("VIIRS_SNPP_NRT");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [totalFireCount, setTotalFireCount] = useState(0);

  const lastFetchRef = useRef(0);

  /* -------------------- Stats -------------------- */

  const fireStats = useMemo(() => {
    if (!fireData.length) return null;

    const high = fireData.filter((f) => f.frp > 50).length;
    const medium = fireData.filter(
      (f) => f.frp > 20 && f.frp <= 50
    ).length;
    const avg =
      fireData.reduce((s, f) => s + (f.frp || 0), 0) /
      fireData.length;
    const max = Math.max(...fireData.map((f) => f.frp || 0));

    return { high, medium, avg, max };
  }, [fireData]);

  /* -------------------- Fetch -------------------- */

  const fetchFireData = useCallback(
    async (d: string, src: string) => {
      if (Date.now() - lastFetchRef.current < 5000) return;
      lastFetchRef.current = Date.now();

      setLoading(true);
      try {
        const res = await fetch(
          `https://iokkwxjkvzgstkkbwnoa.supabase.co/functions/v1/nasa-firms?days=${d}&source=${src}&area=world`
        );

        const data = await res.json();
        setFireData(data.fires || []);
        setTotalFireCount(data.count || data.fires?.length || 0);
        setLastUpdated(new Date());

        toast.success("Wildfire data updated");
      } catch {
        toast.error("Failed to fetch wildfire data");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchFireData(days, satelliteSource);
  }, [days, satelliteSource, fetchFireData]);

  /* -------------------- Memoized Markers -------------------- */

  const fireMarkers = useMemo(
    () =>
      fireData.map((fire, i) => (
        <MapMarker
          key={i}
          longitude={fire.longitude}
          latitude={fire.latitude}
        >
          <FireMarker fire={fire} />
        </MapMarker>
      )),
    [fireData]
  );

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05070d] via-[#080c16] to-black">
      <HomeHeader />

      <main className="pt-24 max-w-7xl mx-auto px-4 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Environmental Intelligence Maps
          </h1>
          <p className="text-gray-400">
            Live satellite-based monitoring of global climate risks
          </p>

          <div className="flex items-center gap-3 mt-6">
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchFireData(days, satelliteSource)}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>

            <Badge variant="outline" className="text-green-400">
              ● Live Data
            </Badge>

            {lastUpdated && (
              <span className="text-xs text-gray-500">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        {fireStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total Fires",
                value: totalFireCount,
                icon: Flame,
                color: "text-orange-400",
              },
              {
                label: "High Intensity",
                value: fireStats.high,
                icon: AlertTriangle,
                color: "text-red-400",
              },
              {
                label: "Avg FRP",
                value: fireStats.avg.toFixed(1),
                icon: TrendingUp,
                color: "text-cyan-400",
              },
              {
                label: "Max FRP",
                value: fireStats.max.toFixed(1),
                icon: Flame,
                color: "text-red-500",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur"
              >
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                  {s.label}
                </div>
                <div className={`text-2xl font-bold ${s.color}`}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hero Map */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="absolute inset-x-0 top-0 z-20 bg-black/50 backdrop-blur-xl p-4 flex justify-between">
            <div>
              <h3 className="text-white font-semibold">
                Active Wildfires
              </h3>
              <p className="text-xs text-gray-400">
                NASA FIRMS • {satelliteSource.replace("_NRT", "")}
              </p>
            </div>

            <div className="flex gap-2">
              <Select value={days} onValueChange={setDays}>
                <SelectTrigger className="h-8 w-28 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">24h</SelectItem>
                  <SelectItem value="2">48h</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={satelliteSource}
                onValueChange={setSatelliteSource}
              >
                <SelectTrigger className="h-8 w-40 text-xs">
                  <Satellite className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIIRS_SNPP_NRT">
                    VIIRS SNPP
                  </SelectItem>
                  <SelectItem value="VIIRS_NOAA20_NRT">
                    VIIRS NOAA-20
                  </SelectItem>
                  <SelectItem value="MODIS_NRT">
                    MODIS
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
              <Loader2 className="h-10 w-10 text-orange-400 animate-spin" />
            </div>
          )}

          <div className="aspect-[21/9] relative">
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
        </motion.div>
      </main>
    </div>
  );
};

export default Maps;
