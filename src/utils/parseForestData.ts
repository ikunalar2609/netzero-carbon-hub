export interface ForestData {
  iso: string;
  country: string;
  gfc_extent_ha: number;
  area_ha: number;
  latitude?: number;
  longitude?: number;
}

type ForestWorkerResponse =
  | { ok: true; data: ForestData[] }
  | { ok: false; error: string };

const cache: { data: ForestData[] | null; timestamp: number } = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12h

const LS_KEY_PREFIX = "natural_forest_cover_cache:v1:";

function readLocalStorageCache(key: string): { timestamp: number; data: ForestData[] } | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timestamp: number; data: ForestData[] };
    if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeLocalStorageCache(key: string, value: { timestamp: number; data: ForestData[] }) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Loads Natural Forest Cover data without blocking the UI thread.
 * - Parses the Excel inside a Web Worker (xlsx stays out of main bundle)
 * - Caches results in-memory
 */
export async function loadNaturalForestCoverData(
  filePath: string,
  opts?: { maxRecords?: number; forceRefresh?: boolean }
): Promise<ForestData[]> {
  const now = Date.now();
  const maxRecords = opts?.maxRecords;
  const forceRefresh = Boolean(opts?.forceRefresh);

  const lsKey = `${LS_KEY_PREFIX}${filePath}`;

  if (!forceRefresh) {
    const ls = readLocalStorageCache(lsKey);
    if (ls && now - ls.timestamp < CACHE_DURATION_MS) {
      cache.data = ls.data;
      cache.timestamp = ls.timestamp;
      return maxRecords ? ls.data.slice(0, maxRecords) : ls.data;
    }
  }

  if (!forceRefresh && cache.data && now - cache.timestamp < CACHE_DURATION_MS) {
    return maxRecords ? cache.data.slice(0, maxRecords) : cache.data;
  }

  try {
    const worker = new Worker(
      new URL("../workers/forestData.worker.ts", import.meta.url),
      { type: "module" }
    );

    const result = await new Promise<ForestWorkerResponse>((resolve) => {
      const timeout = window.setTimeout(() => {
        resolve({ ok: false, error: "Forest parsing timed out" });
      }, 15000);

      worker.onmessage = (evt: MessageEvent<ForestWorkerResponse>) => {
        window.clearTimeout(timeout);
        resolve(evt.data);
      };
      worker.onerror = (e) => {
        window.clearTimeout(timeout);
        resolve({ ok: false, error: e.message || "Worker failed" });
      };

      worker.postMessage({ filePath, maxRecords });
    });

    worker.terminate();

    if (result.ok === false) {
      console.warn("Natural forest data load failed:", result.error);
      return [];
    }

    // Store full (worker already applied maxRecords if provided)
    cache.data = result.data;
    cache.timestamp = now;
    writeLocalStorageCache(lsKey, { timestamp: now, data: result.data });
    return result.data;
  } catch (error) {
    console.error("Natural forest data load error:", error);
    return [];
  }
}

// Backwards-compatible export (Maps.tsx currently imports this)
export async function parseForestExcel(filePath: string): Promise<ForestData[]> {
  // Keep marker counts reasonable for performance
  return loadNaturalForestCoverData(filePath, { maxRecords: 500 });
}

export function getForestIntensity(extentHa: number): 'high' | 'medium' | 'low' {
  if (extentHa > 50000000) return 'high';
  if (extentHa > 10000000) return 'medium';
  return 'low';
}

export function formatHectares(ha: number): string {
  if (ha >= 1000000) return `${(ha / 1000000).toFixed(1)}M ha`;
  if (ha >= 1000) return `${(ha / 1000).toFixed(1)}K ha`;
  return `${ha.toFixed(0)} ha`;
}
