import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TreeLossHotspot {
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
      cache.treeLoss = treeLossResult.data || [];
      cache.timestamp = now;

      setForestCover(geoJSON);
      setTreeLoss(treeLossResult.data || []);
    } catch (err: any) {
      console.error("Map data fetch error:", err);
      setError(err.message || "Failed to load map data");
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
