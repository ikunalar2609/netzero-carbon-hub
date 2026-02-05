 import * as XLSX from "xlsx";
 
 interface ForestData {
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
 
 // Country coordinates for mapping
 const countryCoordinates: Record<string, { lat: number; lng: number }> = {
   BRA: { lat: -14.235, lng: -51.9253 },
   RUS: { lat: 61.524, lng: 105.3188 },
   CAN: { lat: 56.1304, lng: -106.3468 },
   USA: { lat: 37.0902, lng: -95.7129 },
   CHN: { lat: 35.8617, lng: 104.1954 },
   AUS: { lat: -25.2744, lng: 133.7751 },
   COD: { lat: -4.0383, lng: 21.7587 },
   IDN: { lat: -0.7893, lng: 113.9213 },
   PER: { lat: -9.19, lng: -75.0152 },
   IND: { lat: 20.5937, lng: 78.9629 },
   MEX: { lat: 23.6345, lng: -102.5528 },
   COL: { lat: 4.5709, lng: -74.2973 },
   AGO: { lat: -11.2027, lng: 17.8739 },
   BOL: { lat: -16.2902, lng: -63.5887 },
   VEN: { lat: 6.4238, lng: -66.5897 },
   MYS: { lat: 4.2105, lng: 101.9758 },
   PNG: { lat: -6.315, lng: 143.9555 },
   MMR: { lat: 21.9162, lng: 95.956 },
   TZA: { lat: -6.369, lng: 34.8888 },
   ZMB: { lat: -13.1339, lng: 27.8493 },
   MOZ: { lat: -18.6657, lng: 35.5296 },
   SWE: { lat: 60.1282, lng: 18.6435 },
   FIN: { lat: 61.9241, lng: 25.7482 },
   JPN: { lat: 36.2048, lng: 138.2529 },
   NOR: { lat: 60.472, lng: 8.4689 },
   GAB: { lat: -0.8037, lng: 11.6094 },
   COG: { lat: -0.228, lng: 15.8277 },
   CMR: { lat: 7.3697, lng: 12.3547 },
   CAF: { lat: 6.6111, lng: 20.9394 },
   GUY: { lat: 4.8604, lng: -58.9302 },
   SUR: { lat: 3.9193, lng: -56.0278 },
   LAO: { lat: 19.8563, lng: 102.4955 },
   THA: { lat: 15.87, lng: 100.9925 },
   VNM: { lat: 14.0583, lng: 108.2772 },
   PHL: { lat: 12.8797, lng: 121.774 },
   NZL: { lat: -40.9006, lng: 174.886 },
   CHL: { lat: -35.6751, lng: -71.543 },
   ARG: { lat: -38.4161, lng: -63.6167 },
   ECU: { lat: -1.8312, lng: -78.1834 },
   FRA: { lat: 46.2276, lng: 2.2137 },
   DEU: { lat: 51.1657, lng: 10.4515 },
   ESP: { lat: 40.4637, lng: -3.7492 },
   GBR: { lat: 55.3781, lng: -3.436 },
   ITA: { lat: 41.8719, lng: 12.5674 },
   POL: { lat: 51.9194, lng: 19.1451 },
   UKR: { lat: 48.3794, lng: 31.1656 },
   TUR: { lat: 38.9637, lng: 35.2433 },
   IRN: { lat: 32.4279, lng: 53.688 },
   PAK: { lat: 30.3753, lng: 69.3451 },
   BGD: { lat: 23.685, lng: 90.3563 },
   NGA: { lat: 9.082, lng: 8.6753 },
   ETH: { lat: 9.145, lng: 40.4897 },
   KEN: { lat: -0.0236, lng: 37.9062 },
   ZAF: { lat: -30.5595, lng: 22.9375 },
   EGY: { lat: 26.8206, lng: 30.8025 },
   MAR: { lat: 31.7917, lng: -7.0926 },
   DZA: { lat: 28.0339, lng: 1.6596 },
   LBY: { lat: 26.3351, lng: 17.2283 },
   SDN: { lat: 12.8628, lng: 30.2176 },
   KAZ: { lat: 48.0196, lng: 66.9237 },
   MNG: { lat: 46.8625, lng: 103.8467 },
   AFG: { lat: 33.9391, lng: 67.71 },
   NPL: { lat: 28.3949, lng: 84.124 },
   BTN: { lat: 27.5142, lng: 90.4336 },
   LKA: { lat: 7.8731, lng: 80.7718 },
   KHM: { lat: 12.5657, lng: 104.991 },
   PRY: { lat: -23.4425, lng: -58.4438 },
   URY: { lat: -32.5228, lng: -55.7658 },
   CRI: { lat: 9.7489, lng: -83.7534 },
   PAN: { lat: 8.538, lng: -80.7821 },
   NIC: { lat: 12.8654, lng: -85.2072 },
   HND: { lat: 15.2, lng: -86.2419 },
   GTM: { lat: 15.7835, lng: -90.2308 },
   BLZ: { lat: 17.1899, lng: -88.4976 },
   CUB: { lat: 21.5218, lng: -77.7812 },
   HTI: { lat: 18.9712, lng: -72.2852 },
   DOM: { lat: 18.7357, lng: -70.1627 },
   JAM: { lat: 18.1096, lng: -77.2975 },
   TTO: { lat: 10.6918, lng: -61.2225 },
 };
 
 self.onmessage = async (evt: MessageEvent<{ filePath: string; maxRecords?: number }>) => {
   const { filePath, maxRecords } = evt.data;
 
   try {
     const response = await fetch(filePath);
     if (!response.ok) {
       self.postMessage({ ok: false, error: `Failed to fetch file: ${response.status}` } as ForestWorkerResponse);
       return;
     }
 
     const arrayBuffer = await response.arrayBuffer();
     const workbook = XLSX.read(arrayBuffer, { type: "array" });
     const sheetName = workbook.SheetNames[0];
     const sheet = workbook.Sheets[sheetName];
     const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
 
     const forestData: ForestData[] = rawData
       .map((row) => {
         const iso = String(row["iso"] ?? row["ISO"] ?? row["country_code"] ?? "").toUpperCase();
         const country = String(row["country"] ?? row["Country"] ?? row["name"] ?? "");
         const gfc_extent_ha = Number(row["gfc_extent_ha"] ?? row["forest_area"] ?? row["extent"] ?? 0);
         const area_ha = Number(row["area_ha"] ?? row["total_area"] ?? row["area"] ?? 0);
 
         const coords = countryCoordinates[iso];
 
         return {
           iso,
           country,
           gfc_extent_ha,
           area_ha,
           latitude: coords?.lat,
           longitude: coords?.lng,
         };
       })
       .filter((d) => d.iso && d.gfc_extent_ha > 0 && d.latitude !== undefined)
       .sort((a, b) => b.gfc_extent_ha - a.gfc_extent_ha);
 
     const limited = maxRecords ? forestData.slice(0, maxRecords) : forestData;
 
     self.postMessage({ ok: true, data: limited } as ForestWorkerResponse);
   } catch (error) {
     self.postMessage({
       ok: false,
       error: error instanceof Error ? error.message : "Unknown error",
     } as ForestWorkerResponse);
   }
 };