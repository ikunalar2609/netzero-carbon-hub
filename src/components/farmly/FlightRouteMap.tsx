import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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

// Get Mapbox token from localStorage or environment
const getMapboxToken = () => {
  return localStorage.getItem("mapbox_token") || "";
};

export const FlightRouteMap = ({ departure, arrival, distanceKm }: FlightRouteMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState(getMapboxToken());
  const [tokenInput, setTokenInput] = useState("");
  const [mapError, setMapError] = useState<string | null>(null);

  const saveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem("mapbox_token", tokenInput.trim());
      setMapboxToken(tokenInput.trim());
      setMapError(null);
    }
  };

  // Generate curved line points between two coordinates
  const generateArcPoints = (start: [number, number], end: [number, number], numPoints = 100): [number, number][] => {
    const points: [number, number][] = [];
    
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      
      // Interpolate longitude (handle wrap-around for international date line)
      let lng = start[0] + (end[0] - start[0]) * t;
      
      // Interpolate latitude with arc
      const lat = start[1] + (end[1] - start[1]) * t;
      
      // Add curvature - higher arc for longer distances
      const distance = Math.sqrt(
        Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2)
      );
      const arcHeight = Math.min(distance * 0.15, 20); // Max 20 degrees arc
      const arcOffset = Math.sin(Math.PI * t) * arcHeight;
      
      points.push([lng, lat + arcOffset]);
    }
    
    return points;
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !departure || !arrival) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      // Calculate center point between airports
      const centerLng = (departure.lon + arrival.lon) / 2;
      const centerLat = (departure.lat + arrival.lat) / 2;

      // Calculate appropriate zoom based on distance
      const distance = Math.sqrt(
        Math.pow(arrival.lon - departure.lon, 2) + 
        Math.pow(arrival.lat - departure.lat, 2)
      );
      const zoom = Math.max(1, Math.min(6, 8 - distance / 15));

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [centerLng, centerLat],
        zoom: zoom,
        pitch: 30,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        "top-right"
      );

      map.current.on("load", () => {
        if (!map.current) return;

        // Generate arc points
        const arcPoints = generateArcPoints(
          [departure.lon, departure.lat],
          [arrival.lon, arrival.lat]
        );

        // Add the flight route line
        map.current.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: arcPoints,
            },
          },
        });

        // Animated dashed line effect
        map.current.addLayer({
          id: "route-line-bg",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#8B5CF6",
            "line-width": 3,
            "line-opacity": 0.3,
          },
        });

        map.current.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#8B5CF6",
            "line-width": 2,
            "line-dasharray": [2, 2],
          },
        });

        // Add departure marker
        const depEl = document.createElement("div");
        depEl.className = "departure-marker";
        depEl.innerHTML = `
          <div style="
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #8B5CF6, #7C3AED);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
            border: 2px solid white;
          ">
            <span style="color: white; font-weight: bold; font-size: 10px;">${departure.iata}</span>
          </div>
        `;

        new mapboxgl.Marker({ element: depEl })
          .setLngLat([departure.lon, departure.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 8px;">
                <strong>${departure.iata}</strong><br/>
                <span style="font-size: 12px; color: #666;">${departure.name}</span>
              </div>`
            )
          )
          .addTo(map.current);

        // Add arrival marker
        const arrEl = document.createElement("div");
        arrEl.className = "arrival-marker";
        arrEl.innerHTML = `
          <div style="
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #10B981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
            border: 2px solid white;
          ">
            <span style="color: white; font-weight: bold; font-size: 10px;">${arrival.iata}</span>
          </div>
        `;

        new mapboxgl.Marker({ element: arrEl })
          .setLngLat([arrival.lon, arrival.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<div style="padding: 8px;">
                <strong>${arrival.iata}</strong><br/>
                <span style="font-size: 12px; color: #666;">${arrival.name}</span>
              </div>`
            )
          )
          .addTo(map.current);

        // Fit bounds to show both airports
        const bounds = new mapboxgl.LngLatBounds()
          .extend([departure.lon, departure.lat])
          .extend([arrival.lon, arrival.lat]);

        map.current.fitBounds(bounds, {
          padding: { top: 60, bottom: 60, left: 60, right: 60 },
          maxZoom: 6,
        });
      });

      map.current.on("error", (e) => {
        console.error("Mapbox error:", e);
        setMapError("Failed to load map. Please check your Mapbox token.");
      });

      setMapError(null);
    } catch (error) {
      console.error("Map initialization error:", error);
      setMapError("Failed to initialize map. Please check your Mapbox token.");
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [departure, arrival, mapboxToken]);

  // Show token input if no token is set
  if (!mapboxToken) {
    return (
      <div className="rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-[#F9FAFB] to-white p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-5 w-5 text-[#8B5CF6]" />
          </div>
          <div>
            <h4 className="font-semibold text-[#1E293B]">Flight Route Map</h4>
            <p className="text-sm text-[#475569]">
              Enter your Mapbox public token to visualize flight routes on an interactive map.
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium text-[#1E293B]">Mapbox Public Token</Label>
            <Input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="pk.eyJ1Ijo..."
              className="mt-1 rounded-xl border-[#E5E7EB] focus:border-[#8B5CF6] focus:ring-[#8B5CF6]"
            />
          </div>
          <div className="flex items-center justify-between">
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#8B5CF6] hover:underline"
            >
              Get your free token from Mapbox →
            </a>
            <Button
              onClick={saveToken}
              disabled={!tokenInput.trim()}
              size="sm"
              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg"
            >
              Save Token
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show placeholder if no airports selected
  if (!departure || !arrival) {
    return (
      <div className="rounded-xl border border-[#E5E7EB] bg-gradient-to-br from-[#8B5CF6]/5 to-[#8B5CF6]/10 p-6 flex flex-col items-center justify-center min-h-[200px]">
        <div className="h-12 w-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center mb-3">
          <MapPin className="h-6 w-6 text-[#8B5CF6]" />
        </div>
        <p className="text-sm text-[#475569] text-center">
          Select departure and arrival airports to view the flight route
        </p>
      </div>
    );
  }

  // Show error state
  if (mapError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">{mapError}</p>
            <button
              onClick={() => {
                localStorage.removeItem("mapbox_token");
                setMapboxToken("");
                setMapError(null);
              }}
              className="text-xs text-red-600 hover:underline mt-1"
            >
              Reset Mapbox token
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-[#E5E7EB] shadow-sm">
      <div ref={mapContainer} className="w-full h-[280px]" />
      {distanceKm && (
        <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#10B981]/10 px-4 py-2 flex items-center justify-center gap-2">
          <span className="text-xs text-[#475569]">Flight Distance:</span>
          <span className="text-sm font-semibold text-[#1E293B]">{distanceKm.toLocaleString()} km</span>
        </div>
      )}
    </div>
  );
};
