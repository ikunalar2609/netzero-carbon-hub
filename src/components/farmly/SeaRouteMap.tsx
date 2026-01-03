import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Anchor, Ship, Navigation } from "lucide-react";
import { Map, MapControls, MapMarker, MapRoute } from "@/components/ui/map";
import type { Port } from "./PortSearch";

interface SeaRouteMapProps {
  origin?: Port;
  destination?: Port;
  distanceKm?: number;
  routeGeometry?: [number, number][];
  waypoints?: string[];
  transshipmentHubs?: Port[];
}

export const SeaRouteMap = ({ 
  origin, 
  destination, 
  distanceKm, 
  routeGeometry,
  waypoints = [],
  transshipmentHubs = [] 
}: SeaRouteMapProps) => {
  // Calculate map center and zoom based on route
  const { center, zoom } = useMemo(() => {
    if (origin && destination) {
      const centerLat = (origin.lat + destination.lat) / 2;
      const centerLon = (origin.lon + destination.lon) / 2;
      
      // Calculate distance for zoom level
      const latDiff = Math.abs(origin.lat - destination.lat);
      const lonDiff = Math.abs(origin.lon - destination.lon);
      const maxDiff = Math.max(latDiff, lonDiff);
      
      let zoomLevel = 2;
      if (maxDiff < 5) zoomLevel = 6;
      else if (maxDiff < 15) zoomLevel = 4;
      else if (maxDiff < 40) zoomLevel = 3;
      else if (maxDiff < 80) zoomLevel = 2;
      else zoomLevel = 1;
      
      return { center: [centerLon, centerLat] as [number, number], zoom: zoomLevel };
    }
    return { center: [20, 20] as [number, number], zoom: 1.5 };
  }, [origin, destination]);

  // Use API route geometry if available, otherwise generate simple curved path
  const routeCoordinates = useMemo(() => {
    // If we have real route geometry from the API, use it
    if (routeGeometry && routeGeometry.length > 0) {
      return routeGeometry;
    }
    
    // Fallback: generate simple path through origin, hubs, destination
    if (!origin || !destination) return [];
    
    const points: [number, number][] = [[origin.lon, origin.lat]];
    
    // Add transshipment hubs in order
    transshipmentHubs.forEach(hub => {
      points.push([hub.lon, hub.lat]);
    });
    
    points.push([destination.lon, destination.lat]);
    
    return points;
  }, [origin, destination, routeGeometry, transshipmentHubs]);

  // Calculate midpoint for ship icon (use route midpoint if available)
  const shipPosition = useMemo(() => {
    if (routeCoordinates.length > 2) {
      // Use actual midpoint of the route
      const midIndex = Math.floor(routeCoordinates.length / 2);
      return {
        lon: routeCoordinates[midIndex][0],
        lat: routeCoordinates[midIndex][1],
      };
    }
    if (!origin || !destination) return null;
    return {
      lon: (origin.lon + destination.lon) / 2,
      lat: (origin.lat + destination.lat) / 2,
    };
  }, [origin, destination, routeCoordinates]);

  // Determine if we're showing a real route or fallback
  const hasRealRoute = routeGeometry && routeGeometry.length > 0;

  if (!origin || !destination) {
    return (
      <Card className="h-[280px] flex items-center justify-center bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] border-[#BAE6FD]">
        <div className="text-center text-[#475569]">
          <Ship className="h-12 w-12 mx-auto mb-2 text-[#0EA5E9]/40" />
          <p className="text-sm">Select origin and destination ports to see the sea route</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-[#BAE6FD]">
      <div className="h-[320px] relative">
        <Map
          center={center}
          zoom={zoom}
          theme="light"
          className="w-full h-full"
        >
          <MapControls showZoom showCompass={false} showFullscreen={false} />
          
          {/* Sea route polyline - use real geometry if available */}
          {routeCoordinates.length > 0 && (
            <MapRoute
              coordinates={routeCoordinates}
              color="#0EA5E9"
              width={hasRealRoute ? 3 : 2}
              dashArray={hasRealRoute ? undefined : [2, 1]}
              curved={!hasRealRoute} // Only curve fallback routes
            />
          )}
          
          {/* Origin port marker */}
          <MapMarker
            longitude={origin.lon}
            latitude={origin.lat}
          >
            <div className="relative group cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-[#10B981] border-2 border-white shadow-lg flex items-center justify-center">
                <Anchor className="h-4 w-4 text-white" />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E293B] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {origin.city} ({origin.code})
              </div>
            </div>
          </MapMarker>
          
          {/* Transshipment hub markers */}
          {transshipmentHubs.map((hub, index) => (
            <MapMarker
              key={hub.code}
              longitude={hub.lon}
              latitude={hub.lat}
            >
              <div className="relative group cursor-pointer">
                <div className="h-6 w-6 rounded-full bg-[#F59E0B] border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E293B] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  Hub: {hub.city}
                </div>
              </div>
            </MapMarker>
          ))}
          
          {/* Ship icon in the middle of route */}
          {shipPosition && (
            <MapMarker
              longitude={shipPosition.lon}
              latitude={shipPosition.lat}
            >
              <div className="h-10 w-10 rounded-full bg-white border-2 border-[#0EA5E9] shadow-lg flex items-center justify-center animate-pulse">
                <Ship className="h-5 w-5 text-[#0EA5E9]" />
              </div>
            </MapMarker>
          )}
          
          {/* Destination port marker */}
          <MapMarker
            longitude={destination.lon}
            latitude={destination.lat}
          >
            <div className="relative group cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-[#EF4444] border-2 border-white shadow-lg flex items-center justify-center">
                <Anchor className="h-4 w-4 text-white" />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E293B] text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {destination.city} ({destination.code})
              </div>
            </div>
          </MapMarker>
        </Map>
        
        {/* Route info overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-[#BAE6FD]">
          <div className="flex flex-col gap-1">
            {/* Route header */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                  <span className="text-[#475569]">{origin.code}</span>
                </div>
                <Ship className="h-4 w-4 text-[#0EA5E9]" />
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <span className="text-[#475569]">{destination.code}</span>
                </div>
              </div>
              {distanceKm && (
                <span className="font-semibold text-[#1E293B]">{distanceKm.toLocaleString()} km</span>
              )}
            </div>
            
            {/* Waypoints info */}
            {waypoints.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-[#475569]">
                <Navigation className="h-3 w-3" />
                <span>via {waypoints.join(' → ')}</span>
              </div>
            )}
            
            {/* Route quality indicator */}
            <div className="flex items-center gap-1 text-xs">
              {hasRealRoute ? (
                <span className="text-[#10B981] flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  Real maritime route
                </span>
              ) : (
                <span className="text-[#F59E0B] flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  Estimated route (calculate for real path)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
