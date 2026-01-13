import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TreeLossHotspot {
  id: string;
  region: string;
  latitude: number;
  longitude: number;
  loss_percentage: number;
  loss_year: string;
  area: string;
  cause: string;
}

interface MapDataResponse {
  forestCover: GeoJSON.FeatureCollection | null;
  treeLoss: TreeLossHotspot[];
  loading: boolean;
  error: string | null;
}

// Fallback data when DB is empty
const fallbackTreeLoss: TreeLossHotspot[] = [
  { id: "1", region: "Brazilian Amazon", latitude: -3.47, longitude: -62.22, loss_percentage: 18.5, loss_year: "2020-2024", area: "Amazonas State", cause: "Agriculture & Cattle" },
  { id: "2", region: "Borneo (Kalimantan)", latitude: 0.79, longitude: 113.92, loss_percentage: 28.6, loss_year: "2020-2024", area: "Indonesian Borneo", cause: "Oil Palm Plantations" },
  { id: "3", region: "Sumatra", latitude: -0.59, longitude: 101.34, loss_percentage: 31.2, loss_year: "2020-2024", area: "Riau Province", cause: "Pulp & Palm Oil" },
  { id: "4", region: "DR Congo Basin", latitude: -0.02, longitude: 21.76, loss_percentage: 13.9, loss_year: "2020-2024", area: "Équateur Province", cause: "Subsistence Agriculture" },
  { id: "5", region: "Siberia", latitude: 64.25, longitude: 100.25, loss_percentage: 12.8, loss_year: "2020-2024", area: "Krasnoyarsk Krai", cause: "Wildfires" },
];

// In-memory cache to avoid repeated fetches
const cache: {
  forestCover: GeoJSON.FeatureCollection | null;
  treeLoss: TreeLossHotspot[];
  timestamp: number;
} = {
  forestCover: null,
  treeLoss: [],
  timestamp: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useMapData(regionFilter?: string): MapDataResponse {
  const [forestCover, setForestCover] = useState<GeoJSON.FeatureCollection | null>(cache.forestCover);
  const [treeLoss, setTreeLoss] = useState<TreeLossHotspot[]>(cache.treeLoss);
  const [loading, setLoading] = useState(!cache.forestCover);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchData = useCallback(async () => {
    // Check cache first
    const now = Date.now();
    if (cache.forestCover && cache.treeLoss.length > 0 && now - cache.timestamp < CACHE_DURATION) {
      setForestCover(cache.forestCover);
      setTreeLoss(cache.treeLoss);
      setLoading(false);
      return;
    }

    // Prevent duplicate fetches
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      // Fetch both datasets in parallel directly from Supabase
      const [forestResult, treeLossResult] = await Promise.all([
        supabase.from("forest_cover_regions").select("*"),
        supabase.from("tree_loss_hotspots").select("*").order("loss_percentage", { ascending: false }),
      ]);

      if (forestResult.error) throw forestResult.error;
      if (treeLossResult.error) throw treeLossResult.error;

      // Convert forest data to GeoJSON
      const features = (forestResult.data || []).map((item) => ({
        type: "Feature" as const,
        properties: {
          name: item.name,
          coverage: item.coverage,
          region: item.region,
          area_km2: item.area_km2,
        },
        geometry: {
          type: "Polygon" as const,
          coordinates: item.coordinates as number[][][],
        },
      }));

      const geoJSON: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features,
      };

      // Update cache
      cache.forestCover = geoJSON;
      cache.treeLoss = treeLossResult.data && treeLossResult.data.length > 0 
        ? treeLossResult.data 
        : fallbackTreeLoss;
      cache.timestamp = now;

      setForestCover(geoJSON);
      setTreeLoss(cache.treeLoss);
    } catch (err: any) {
      console.error("Map data fetch error:", err);
      setError(err.message || "Failed to load map data");
      // Use fallback on error
      setTreeLoss(fallbackTreeLoss);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter by region if provided (client-side filtering for responsiveness)
  const filteredTreeLoss = regionFilter && regionFilter !== "all"
    ? treeLoss.filter((item) => item.region.toLowerCase().includes(regionFilter.toLowerCase()))
    : treeLoss;

  return {
    forestCover,
    treeLoss: filteredTreeLoss,
    loading,
    error,
  };
}

// Preload function to warm the cache
export async function preloadMapData(): Promise<void> {
  if (cache.forestCover && cache.treeLoss.length > 0) return;

  try {
    const [forestResult, treeLossResult] = await Promise.all([
      supabase.from("forest_cover_regions").select("*"),
      supabase.from("tree_loss_hotspots").select("*").order("loss_percentage", { ascending: false }),
    ]);

    if (!forestResult.error && forestResult.data) {
      const features = forestResult.data.map((item) => ({
        type: "Feature" as const,
        properties: {
          name: item.name,
          coverage: item.coverage,
          region: item.region,
          area_km2: item.area_km2,
        },
        geometry: {
          type: "Polygon" as const,
          coordinates: item.coordinates as number[][][],
        },
      }));

      cache.forestCover = { type: "FeatureCollection", features };
    }

    if (!treeLossResult.error && treeLossResult.data) {
      cache.treeLoss = treeLossResult.data;
    }

    cache.timestamp = Date.now();
  } catch (err) {
    console.error("Preload error:", err);
  }
}
