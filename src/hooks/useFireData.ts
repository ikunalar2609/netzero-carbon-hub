import { useState, useEffect, useCallback, useRef } from "react";
import type { FireData } from "@/components/maps/constants";

const FIRE_CACHE: { data: FireData[]; key: string; ts: number } = { data: [], key: "", ts: 0 };
const CACHE_TTL = 3 * 60 * 1000; // 3 min

export function useFireData(days: string, satelliteSource: string) {
  const [fireData, setFireData] = useState<FireData[]>(FIRE_CACHE.data);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchFires = useCallback(async () => {
    const key = `${days}-${satelliteSource}`;
    if (FIRE_CACHE.key === key && Date.now() - FIRE_CACHE.ts < CACHE_TTL) {
      setFireData(FIRE_CACHE.data);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    try {
      const res = await fetch(
        `https://iokkwxjkvzgstkkbwnoa.supabase.co/functions/v1/nasa-firms?days=${days}&source=${satelliteSource}&area=world&limit=5000`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error("API failed");
      const json = await res.json();
      const fires = (json.fires || []).slice(0, 2000) as FireData[];
      FIRE_CACHE.data = fires;
      FIRE_CACHE.key = key;
      FIRE_CACHE.ts = Date.now();
      setFireData(fires);
    } catch (e: any) {
      if (e.name !== "AbortError") setFireData([]);
    } finally {
      setLoading(false);
    }
  }, [days, satelliteSource]);

  useEffect(() => {
    fetchFires();
    return () => abortRef.current?.abort();
  }, [fetchFires]);

  return { fireData, loading };
}
