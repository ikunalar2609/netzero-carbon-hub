import { useCallback } from 'react';
import searoute from 'searoute-js';

interface SeaRouteResult {
  distance: number;
  geometry: [number, number][];
  waypoints: string[];
}

// Define key maritime passages with bounding boxes
const MARITIME_PASSAGES = [
  { name: 'Suez Canal', bbox: [32.0, 29.5, 34.0, 31.5] },
  { name: 'Panama Canal', bbox: [-80.0, 8.5, -79.0, 9.5] },
  { name: 'Strait of Gibraltar', bbox: [-6.5, 35.5, -5.0, 36.5] },
  { name: 'Strait of Malacca', bbox: [99.0, 1.0, 104.0, 4.0] },
  { name: 'Strait of Hormuz', bbox: [55.0, 25.5, 57.0, 27.0] },
  { name: 'Bab el-Mandeb', bbox: [43.0, 12.0, 44.0, 13.0] },
  { name: 'English Channel', bbox: [-5.0, 49.0, 2.0, 51.5] },
  { name: 'Cape of Good Hope', bbox: [18.0, -35.0, 20.0, -33.0] },
  { name: 'Singapore Strait', bbox: [103.5, 1.0, 104.5, 1.5] },
];

function detectKeyWaypoints(coordinates: [number, number][]): string[] {
  const waypoints: string[] = [];

  for (const passage of MARITIME_PASSAGES) {
    for (const coord of coordinates) {
      const [lon, lat] = coord;
      if (lon >= passage.bbox[0] && lon <= passage.bbox[2] &&
          lat >= passage.bbox[1] && lat <= passage.bbox[3]) {
        if (!waypoints.includes(passage.name)) {
          waypoints.push(passage.name);
        }
        break;
      }
    }
  }

  return waypoints;
}

export function useSeaRoute() {
  const calculateRoute = useCallback((
    origin: { lon: number; lat: number; name?: string },
    destination: { lon: number; lat: number; name?: string }
  ): SeaRouteResult | null => {
    try {
      // Create GeoJSON Point features for searoute-js
      const originPoint = {
        type: "Feature" as const,
        properties: { name: origin.name || "Origin" },
        geometry: {
          type: "Point" as const,
          coordinates: [origin.lon, origin.lat]
        }
      };

      const destinationPoint = {
        type: "Feature" as const,
        properties: { name: destination.name || "Destination" },
        geometry: {
          type: "Point" as const,
          coordinates: [destination.lon, destination.lat]
        }
      };

      // Compute the sea route using searoute-js (returns kilometers)
      const route = searoute(originPoint, destinationPoint, 'km');

      if (!route || !route.geometry) {
        console.warn('No maritime route found between the specified locations');
        return null;
      }

      // Extract route information
      const coordinates = route.geometry.coordinates as [number, number][];
      const distance = route.properties?.length || 0;

      console.log(`Sea route computed: ${coordinates.length} points, ${distance.toFixed(2)} km`);

      // Detect key waypoints (straits, canals)
      const waypoints = detectKeyWaypoints(coordinates);

      return {
        distance: Math.round(distance * 100) / 100,
        geometry: coordinates,
        waypoints,
      };
    } catch (err) {
      console.error('Error calculating sea route:', err);
      return null;
    }
  }, []);

  return { calculateRoute };
}
