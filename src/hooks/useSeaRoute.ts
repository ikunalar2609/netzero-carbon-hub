import { useCallback, useMemo } from 'react';
import PathFinder from 'geojson-path-finder';
import * as turfMeta from '@turf/meta';
import * as turfHelpers from '@turf/helpers';
import length from '@turf/length';
import rhumbDistance from '@turf/rhumb-distance';
import pointToLineDistance from '@turf/point-to-line-distance';
import marnetData from '@/data/marnet_densified.json';

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

// Snap a point to the nearest vertex on the maritime network
function snapToNetwork(
  point: GeoJSON.Feature<GeoJSON.Point>,
  marnet: GeoJSON.FeatureCollection<GeoJSON.LineString>
): GeoJSON.Feature<GeoJSON.Point> {
  let nearestLineIndex = 0;
  let minDistance = Infinity;

  // Find the nearest line segment
  turfMeta.featureEach(marnet, (feature, ftIndex) => {
    try {
      const dist = pointToLineDistance(point, feature as GeoJSON.Feature<GeoJSON.LineString>, { units: 'kilometers' });
      if (dist < minDistance) {
        minDistance = dist;
        nearestLineIndex = ftIndex;
      }
    } catch (e) {
      // Skip invalid features
    }
  });

  // Find the nearest vertex on that line
  let nearestVertexDist: number | null = null;
  let nearestCoord: [number, number] | null = null;

  turfMeta.coordEach(marnet.features[nearestLineIndex], (currentCoord) => {
    const distToVertex = rhumbDistance(point, turfHelpers.point(currentCoord as [number, number]));
    
    if (nearestVertexDist === null || distToVertex < nearestVertexDist) {
      nearestVertexDist = distToVertex;
      nearestCoord = currentCoord as [number, number];
    }
  });

  return turfHelpers.point(nearestCoord || [0, 0]);
}

export function useSeaRoute() {
  // Initialize the path finder once with the maritime network
  const pathFinder = useMemo(() => {
    try {
      return new PathFinder(marnetData as GeoJSON.FeatureCollection<GeoJSON.LineString>);
    } catch (err) {
      console.error('Failed to initialize PathFinder:', err);
      return null;
    }
  }, []);

  const calculateRoute = useCallback((
    origin: { lon: number; lat: number; name?: string },
    destination: { lon: number; lat: number; name?: string }
  ): SeaRouteResult | null => {
    if (!pathFinder) {
      console.warn('PathFinder not initialized');
      return null;
    }

    try {
      // Create GeoJSON Point features
      const originPoint = turfHelpers.point([origin.lon, origin.lat], { name: origin.name || "Origin" });
      const destinationPoint = turfHelpers.point([destination.lon, destination.lat], { name: destination.name || "Destination" });

      // Snap points to the maritime network
      const snappedOrigin = snapToNetwork(originPoint, marnetData as GeoJSON.FeatureCollection<GeoJSON.LineString>);
      const snappedDestination = snapToNetwork(destinationPoint, marnetData as GeoJSON.FeatureCollection<GeoJSON.LineString>);

      // Find the path
      const path = pathFinder.findPath(snappedOrigin, snappedDestination);

      if (!path || !path.path || path.path.length === 0) {
        console.warn('No maritime route found between the specified locations');
        return null;
      }

      // Create a LineString from the path
      const lineString = turfHelpers.lineString(path.path);
      
      // Calculate distance in kilometers
      const distanceKm = length(lineString, { units: 'kilometers' });

      const coordinates = path.path as [number, number][];
      
      console.log(`Sea route computed: ${coordinates.length} points, ${distanceKm.toFixed(2)} km`);

      // Detect key waypoints (straits, canals)
      const waypoints = detectKeyWaypoints(coordinates);

      return {
        distance: Math.round(distanceKm * 100) / 100,
        geometry: coordinates,
        waypoints,
      };
    } catch (err) {
      console.error('Error calculating sea route:', err);
      return null;
    }
  }, [pathFinder]);

  return { calculateRoute };
}
