import { useState, useEffect } from "react";
import { parseForestExcel, ForestData } from "@/utils/parseForestData";
import { FALLBACK_FOREST_DATA } from "@/components/maps/constants";

let forestCache: ForestData[] | null = null;

export function useForestData() {
  const [forestData, setForestData] = useState<ForestData[]>(forestCache || FALLBACK_FOREST_DATA);
  const [loading, setLoading] = useState(!forestCache);

  useEffect(() => {
    if (forestCache) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const data = await parseForestExcel("/data/global_forest_data.xlsx");
        const cleaned = (data || []).filter((d) => d.latitude && d.longitude);
        const result = cleaned.length > 0 ? cleaned : FALLBACK_FOREST_DATA;
        forestCache = result;
        if (!cancelled) setForestData(result);
      } catch {
        if (!cancelled) setForestData(FALLBACK_FOREST_DATA);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { forestData, loading };
}
