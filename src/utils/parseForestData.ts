import * as XLSX from 'xlsx';

export interface ForestData {
  iso: string;
  country: string;
  gfc_extent_ha: number;
  area_ha: number;
  latitude?: number;
  longitude?: number;
}

// Country coordinates for mapping
const countryCoordinates: Record<string, { lat: number; lng: number }> = {
  'ABW': { lat: 12.5211, lng: -69.9683 },
  'AFG': { lat: 33.9391, lng: 67.7100 },
  'AGO': { lat: -11.2027, lng: 17.8739 },
  'ALB': { lat: 41.1533, lng: 20.1683 },
  'AND': { lat: 42.5063, lng: 1.5218 },
  'ARE': { lat: 23.4241, lng: 53.8478 },
  'ARG': { lat: -38.4161, lng: -63.6167 },
  'ARM': { lat: 40.0691, lng: 45.0382 },
  'AUS': { lat: -25.2744, lng: 133.7751 },
  'AUT': { lat: 47.5162, lng: 14.5501 },
  'AZE': { lat: 40.1431, lng: 47.5769 },
  'BDI': { lat: -3.3731, lng: 29.9189 },
  'BEL': { lat: 50.5039, lng: 4.4699 },
  'BEN': { lat: 9.3077, lng: 2.3158 },
  'BFA': { lat: 12.2383, lng: -1.5616 },
  'BGD': { lat: 23.6850, lng: 90.3563 },
  'BGR': { lat: 42.7339, lng: 25.4858 },
  'BHR': { lat: 26.0667, lng: 50.5577 },
  'BHS': { lat: 25.0343, lng: -77.3963 },
  'BIH': { lat: 43.9159, lng: 17.6791 },
  'BLR': { lat: 53.7098, lng: 27.9534 },
  'BLZ': { lat: 17.1899, lng: -88.4976 },
  'BOL': { lat: -16.2902, lng: -63.5887 },
  'BRA': { lat: -14.2350, lng: -51.9253 },
  'BRN': { lat: 4.5353, lng: 114.7277 },
  'BTN': { lat: 27.5142, lng: 90.4336 },
  'BWA': { lat: -22.3285, lng: 24.6849 },
  'CAF': { lat: 6.6111, lng: 20.9394 },
  'CAN': { lat: 56.1304, lng: -106.3468 },
  'CHE': { lat: 46.8182, lng: 8.2275 },
  'CHL': { lat: -35.6751, lng: -71.5430 },
  'CHN': { lat: 35.8617, lng: 104.1954 },
  'CIV': { lat: 7.5400, lng: -5.5471 },
  'CMR': { lat: 7.3697, lng: 12.3547 },
  'COD': { lat: -4.0383, lng: 21.7587 },
  'COG': { lat: -0.2280, lng: 15.8277 },
  'COL': { lat: 4.5709, lng: -74.2973 },
  'COM': { lat: -11.6455, lng: 43.3333 },
  'CPV': { lat: 16.5388, lng: -23.0418 },
  'CRI': { lat: 9.7489, lng: -83.7534 },
  'CUB': { lat: 21.5218, lng: -77.7812 },
  'CYP': { lat: 35.1264, lng: 33.4299 },
  'CZE': { lat: 49.8175, lng: 15.4730 },
  'DEU': { lat: 51.1657, lng: 10.4515 },
  'DJI': { lat: 11.8251, lng: 42.5903 },
  'DNK': { lat: 56.2639, lng: 9.5018 },
  'DOM': { lat: 18.7357, lng: -70.1627 },
  'DZA': { lat: 28.0339, lng: 1.6596 },
  'ECU': { lat: -1.8312, lng: -78.1834 },
  'EGY': { lat: 26.8206, lng: 30.8025 },
  'ERI': { lat: 15.1794, lng: 39.7823 },
  'ESP': { lat: 40.4637, lng: -3.7492 },
  'EST': { lat: 58.5953, lng: 25.0136 },
  'ETH': { lat: 9.1450, lng: 40.4897 },
  'FIN': { lat: 61.9241, lng: 25.7482 },
  'FJI': { lat: -17.7134, lng: 178.0650 },
  'FRA': { lat: 46.2276, lng: 2.2137 },
  'GAB': { lat: -0.8037, lng: 11.6094 },
  'GBR': { lat: 55.3781, lng: -3.4360 },
  'GEO': { lat: 42.3154, lng: 43.3569 },
  'GHA': { lat: 7.9465, lng: -1.0232 },
  'GIN': { lat: 9.9456, lng: -9.6966 },
  'GMB': { lat: 13.4432, lng: -15.3101 },
  'GNB': { lat: 11.8037, lng: -15.1804 },
  'GNQ': { lat: 1.6508, lng: 10.2679 },
  'GRC': { lat: 39.0742, lng: 21.8243 },
  'GTM': { lat: 15.7835, lng: -90.2308 },
  'GUY': { lat: 4.8604, lng: -58.9302 },
  'HND': { lat: 15.2000, lng: -86.2419 },
  'HRV': { lat: 45.1000, lng: 15.2000 },
  'HTI': { lat: 18.9712, lng: -72.2852 },
  'HUN': { lat: 47.1625, lng: 19.5033 },
  'IDN': { lat: -0.7893, lng: 113.9213 },
  'IND': { lat: 20.5937, lng: 78.9629 },
  'IRL': { lat: 53.1424, lng: -7.6921 },
  'IRN': { lat: 32.4279, lng: 53.6880 },
  'IRQ': { lat: 33.2232, lng: 43.6793 },
  'ISL': { lat: 64.9631, lng: -19.0208 },
  'ISR': { lat: 31.0461, lng: 34.8516 },
  'ITA': { lat: 41.8719, lng: 12.5674 },
  'JAM': { lat: 18.1096, lng: -77.2975 },
  'JOR': { lat: 30.5852, lng: 36.2384 },
  'JPN': { lat: 36.2048, lng: 138.2529 },
  'KAZ': { lat: 48.0196, lng: 66.9237 },
  'KEN': { lat: -0.0236, lng: 37.9062 },
  'KGZ': { lat: 41.2044, lng: 74.7661 },
  'KHM': { lat: 12.5657, lng: 104.9910 },
  'KOR': { lat: 35.9078, lng: 127.7669 },
  'KWT': { lat: 29.3117, lng: 47.4818 },
  'LAO': { lat: 19.8563, lng: 102.4955 },
  'LBN': { lat: 33.8547, lng: 35.8623 },
  'LBR': { lat: 6.4281, lng: -9.4295 },
  'LBY': { lat: 26.3351, lng: 17.2283 },
  'LKA': { lat: 7.8731, lng: 80.7718 },
  'LSO': { lat: -29.6100, lng: 28.2336 },
  'LTU': { lat: 55.1694, lng: 23.8813 },
  'LUX': { lat: 49.8153, lng: 6.1296 },
  'LVA': { lat: 56.8796, lng: 24.6032 },
  'MAR': { lat: 31.7917, lng: -7.0926 },
  'MDA': { lat: 47.4116, lng: 28.3699 },
  'MDG': { lat: -18.7669, lng: 46.8691 },
  'MEX': { lat: 23.6345, lng: -102.5528 },
  'MKD': { lat: 41.5124, lng: 21.7453 },
  'MLI': { lat: 17.5707, lng: -3.9962 },
  'MMR': { lat: 21.9162, lng: 95.9560 },
  'MNE': { lat: 42.7087, lng: 19.3744 },
  'MNG': { lat: 46.8625, lng: 103.8467 },
  'MOZ': { lat: -18.6657, lng: 35.5296 },
  'MRT': { lat: 21.0079, lng: -10.9408 },
  'MUS': { lat: -20.3484, lng: 57.5522 },
  'MWI': { lat: -13.2543, lng: 34.3015 },
  'MYS': { lat: 4.2105, lng: 101.9758 },
  'NAM': { lat: -22.9576, lng: 18.4904 },
  'NER': { lat: 17.6078, lng: 8.0817 },
  'NGA': { lat: 9.0820, lng: 8.6753 },
  'NIC': { lat: 12.8654, lng: -85.2072 },
  'NLD': { lat: 52.1326, lng: 5.2913 },
  'NOR': { lat: 60.4720, lng: 8.4689 },
  'NPL': { lat: 28.3949, lng: 84.1240 },
  'NZL': { lat: -40.9006, lng: 174.8860 },
  'OMN': { lat: 21.4735, lng: 55.9754 },
  'PAK': { lat: 30.3753, lng: 69.3451 },
  'PAN': { lat: 8.5380, lng: -80.7821 },
  'PER': { lat: -9.1900, lng: -75.0152 },
  'PHL': { lat: 12.8797, lng: 121.7740 },
  'PNG': { lat: -6.3150, lng: 143.9555 },
  'POL': { lat: 51.9194, lng: 19.1451 },
  'PRI': { lat: 18.2208, lng: -66.5901 },
  'PRK': { lat: 40.3399, lng: 127.5101 },
  'PRT': { lat: 39.3999, lng: -8.2245 },
  'PRY': { lat: -23.4425, lng: -58.4438 },
  'QAT': { lat: 25.3548, lng: 51.1839 },
  'ROU': { lat: 45.9432, lng: 24.9668 },
  'RUS': { lat: 61.5240, lng: 105.3188 },
  'RWA': { lat: -1.9403, lng: 29.8739 },
  'SAU': { lat: 23.8859, lng: 45.0792 },
  'SDN': { lat: 12.8628, lng: 30.2176 },
  'SEN': { lat: 14.4974, lng: -14.4524 },
  'SGP': { lat: 1.3521, lng: 103.8198 },
  'SLE': { lat: 8.4606, lng: -11.7799 },
  'SLV': { lat: 13.7942, lng: -88.8965 },
  'SOM': { lat: 5.1521, lng: 46.1996 },
  'SRB': { lat: 44.0165, lng: 21.0059 },
  'SSD': { lat: 6.8770, lng: 31.3070 },
  'SUR': { lat: 3.9193, lng: -56.0278 },
  'SVK': { lat: 48.6690, lng: 19.6990 },
  'SVN': { lat: 46.1512, lng: 14.9955 },
  'SWE': { lat: 60.1282, lng: 18.6435 },
  'SWZ': { lat: -26.5225, lng: 31.4659 },
  'SYR': { lat: 34.8021, lng: 38.9968 },
  'TCD': { lat: 15.4542, lng: 18.7322 },
  'TGO': { lat: 8.6195, lng: 0.8248 },
  'THA': { lat: 15.8700, lng: 100.9925 },
  'TJK': { lat: 38.8610, lng: 71.2761 },
  'TKM': { lat: 38.9697, lng: 59.5563 },
  'TLS': { lat: -8.8742, lng: 125.7275 },
  'TTO': { lat: 10.6918, lng: -61.2225 },
  'TUN': { lat: 33.8869, lng: 9.5375 },
  'TUR': { lat: 38.9637, lng: 35.2433 },
  'TWN': { lat: 23.6978, lng: 120.9605 },
  'TZA': { lat: -6.3690, lng: 34.8888 },
  'UGA': { lat: 1.3733, lng: 32.2903 },
  'UKR': { lat: 48.3794, lng: 31.1656 },
  'URY': { lat: -32.5228, lng: -55.7658 },
  'USA': { lat: 37.0902, lng: -95.7129 },
  'UZB': { lat: 41.3775, lng: 64.5853 },
  'VEN': { lat: 6.4238, lng: -66.5897 },
  'VNM': { lat: 14.0583, lng: 108.2772 },
  'YEM': { lat: 15.5527, lng: 48.5164 },
  'ZAF': { lat: -30.5595, lng: 22.9375 },
  'ZMB': { lat: -13.1339, lng: 27.8493 },
  'ZWE': { lat: -19.0154, lng: 29.1549 },
};

export async function parseForestExcel(filePath: string): Promise<ForestData[]> {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
    
    const forestData: ForestData[] = jsonData
      .filter((row) => row['iso'] && row['gfc_extent_ha'])
      .map((row) => {
        const iso = String(row['iso'] || '');
        const coords = countryCoordinates[iso] || { lat: 0, lng: 0 };
        
        return {
          iso,
          country: String(row['country'] || iso),
          gfc_extent_ha: Number(row['gfc_extent_ha']) || 0,
          area_ha: Number(row['area_ha']) || 0,
          latitude: coords.lat,
          longitude: coords.lng,
        };
      })
      .filter((d) => d.latitude !== 0 && d.longitude !== 0);

    return forestData;
  } catch (error) {
    console.error('Error parsing forest data:', error);
    return [];
  }
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
