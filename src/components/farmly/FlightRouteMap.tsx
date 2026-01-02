import { useMemo, useRef } from "react";
import { MapPin, Plane } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Map, MapControls, MapMarker, MapRoute } from "@/components/ui/map";
import maplibregl from "maplibre-gl";

interface FlightRouteMapProps {
  departure?: {
    iata: string;
    name: string;
    lat: number;
    lon: number;
  };
  arrival?: {
    iata: string;
    name: string;
    lat: number;
    lon: number;
  };
  distanceKm?: number;
}

export const FlightRouteMap = ({ departure, arrival, distanceKm }: FlightRouteMapProps) => {
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Calculate center and zoom based on airports
  const { center, zoom } = useMemo(() => {
    if (!departure || !arrival) {
      return { center: [0, 20] as [number, number], zoom: 1.5 };
    }

    const centerLng = (departure.lon + arrival.lon) / 2;
    const centerLat = (departure.lat + arrival.lat) / 2;

    // Calculate appropriate zoom based on distance
    const distance = Math.sqrt(
      Math.pow(arrival.lon - departure.lon, 2) +
        Math.pow(arrival.lat - departure.lat, 2)
    );
    const calculatedZoom = Math.max(1, Math.min(6, 8 - distance / 15));

    return {
      center: [centerLng, centerLat] as [number, number],
      zoom: calculatedZoom,
    };
  }, [departure, arrival]);

  // Route coordinates
  const routeCoordinates = useMemo(() => {
    if (!departure || !arrival) return [];
    return [
      [departure.lon, departure.lat] as [number, number],
      [arrival.lon, arrival.lat] as [number, number],
    ];
  }, [departure, arrival]);

  // Fit bounds when map loads or airports change
  const handleMapLoad = (map: maplibregl.Map) => {
    mapRef.current = map;
    
    if (departure && arrival) {
      const bounds = new maplibregl.LngLatBounds()
        .extend([departure.lon, departure.lat])
        .extend([arrival.lon, arrival.lat]);

      map.fitBounds(bounds, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
        maxZoom: 6,
        duration: 1000,
      });
    }
  };

  // Show placeholder if no airports selected
  if (!departure || !arrival) {
    return (
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-primary/10 p-6 flex flex-col items-center justify-center min-h-[200px]">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Select departure and arrival airports to view the flight route
        </p>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border-border shadow-sm p-0">
      <div className="w-full h-[280px] relative">
        <Map
          center={center}
          zoom={zoom}
          pitch={20}
          theme="light"
          onMapLoad={handleMapLoad}
          className="w-full h-full"
        >
          <MapControls position="top-right" showZoom showCompass />

          {/* Flight Route - Curved Arc */}
          <MapRoute
            coordinates={routeCoordinates}
            color="#8B5CF6"
            width={3}
            opacity={0.8}
            curved
          />

          {/* Departure Marker */}
          <MapMarker longitude={departure.lon} latitude={departure.lat}>
            <div className="relative group cursor-pointer">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                style={{
                  background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                }}
              >
                <span className="text-white font-bold text-xs">
                  {departure.iata}
                </span>
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white rounded-lg shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="font-semibold text-foreground">{departure.iata}</div>
                <div className="text-muted-foreground">{departure.name}</div>
              </div>
            </div>
          </MapMarker>

          {/* Arrival Marker */}
          <MapMarker longitude={arrival.lon} latitude={arrival.lat}>
            <div className="relative group cursor-pointer">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                style={{
                  background: "linear-gradient(135deg, #10B981, #059669)",
                }}
              >
                <span className="text-white font-bold text-xs">
                  {arrival.iata}
                </span>
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white rounded-lg shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="font-semibold text-foreground">{arrival.iata}</div>
                <div className="text-muted-foreground">{arrival.name}</div>
              </div>
            </div>
          </MapMarker>

          {/* Plane icon on the route */}
          <MapMarker
            longitude={(departure.lon + arrival.lon) / 2}
            latitude={(departure.lat + arrival.lat) / 2 + Math.min(Math.sqrt(
              Math.pow(arrival.lon - departure.lon, 2) +
              Math.pow(arrival.lat - departure.lat, 2)
            ) * 0.15, 15) * 0.7}
          >
            <div className="bg-white rounded-full p-1.5 shadow-md">
              <Plane className="h-4 w-4 text-primary transform -rotate-45" />
            </div>
          </MapMarker>
        </Map>
      </div>

      {/* Distance info bar */}
      {distanceKm && (
        <div className="bg-gradient-to-r from-primary/10 to-green-500/10 px-4 py-2 flex items-center justify-center gap-2 border-t border-border">
          <Plane className="h-4 w-4 text-primary" />
          <span className="text-xs text-muted-foreground">Flight Distance:</span>
          <span className="text-sm font-semibold text-foreground">
            {distanceKm.toLocaleString()} km
          </span>
        </div>
      )}
    </Card>
  );
};
