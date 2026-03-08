import { ForestData } from "@/utils/parseForestData";

export interface FireData {
  latitude: number;
  longitude: number;
  frp: number;
  acq_date: string;
  satellite: string;
  confidence: string | number;
}

export interface TreeLossFromDB {
  id: string;
  region: string;
  latitude: number;
  longitude: number;
  loss_percentage: number;
  loss_year: string;
  area: string;
  cause: string;
}

export const REGIONS: Record<string, { center: [number, number]; zoom: number }> = {
  all: { center: [0, 20], zoom: 1.5 },
  africa: { center: [20, 0], zoom: 2.5 },
  asia: { center: [100, 30], zoom: 2.5 },
  europe: { center: [15, 50], zoom: 3 },
  "north-america": { center: [-100, 45], zoom: 2.5 },
  "south-america": { center: [-60, -15], zoom: 2.5 },
  oceania: { center: [140, -25], zoom: 3 },
};

export const REGION_OPTIONS = [
  { value: "all", label: "Global" },
  { value: "asia", label: "Asia" },
  { value: "africa", label: "Africa" },
  { value: "europe", label: "Europe" },
  { value: "north-america", label: "N. America" },
  { value: "south-america", label: "S. America" },
  { value: "oceania", label: "Oceania" },
];

export const SATELLITE_OPTIONS = [
  { value: "VIIRS_SNPP_NRT", label: "VIIRS SNPP" },
  { value: "VIIRS_NOAA20_NRT", label: "VIIRS NOAA-20" },
  { value: "MODIS_NRT", label: "MODIS" },
];

export const TIME_OPTIONS = [
  { value: "1", label: "24 hours" },
  { value: "2", label: "48 hours" },
  { value: "7", label: "7 days" },
];

export const FALLBACK_FOREST_DATA: ForestData[] = [
  { iso: 'BRA', country: 'Brazil', gfc_extent_ha: 492000000, area_ha: 851600000, latitude: -14.24, longitude: -51.93 },
  { iso: 'RUS', country: 'Russia', gfc_extent_ha: 815000000, area_ha: 1710000000, latitude: 61.52, longitude: 105.32 },
  { iso: 'CAN', country: 'Canada', gfc_extent_ha: 347000000, area_ha: 998500000, latitude: 56.13, longitude: -106.35 },
  { iso: 'USA', country: 'United States', gfc_extent_ha: 310000000, area_ha: 937300000, latitude: 37.09, longitude: -95.71 },
  { iso: 'CHN', country: 'China', gfc_extent_ha: 208000000, area_ha: 960000000, latitude: 35.86, longitude: 104.20 },
  { iso: 'COD', country: 'DR Congo', gfc_extent_ha: 152000000, area_ha: 234500000, latitude: -4.04, longitude: 21.76 },
  { iso: 'AUS', country: 'Australia', gfc_extent_ha: 134000000, area_ha: 769200000, latitude: -25.27, longitude: 133.78 },
  { iso: 'IDN', country: 'Indonesia', gfc_extent_ha: 91000000, area_ha: 191000000, latitude: -0.79, longitude: 113.92 },
  { iso: 'PER', country: 'Peru', gfc_extent_ha: 72000000, area_ha: 128500000, latitude: -9.19, longitude: -75.02 },
  { iso: 'IND', country: 'India', gfc_extent_ha: 70000000, area_ha: 328700000, latitude: 20.59, longitude: 78.96 },
  { iso: 'MEX', country: 'Mexico', gfc_extent_ha: 66000000, area_ha: 196400000, latitude: 23.63, longitude: -102.55 },
  { iso: 'COL', country: 'Colombia', gfc_extent_ha: 59000000, area_ha: 114200000, latitude: 4.57, longitude: -74.30 },
  { iso: 'ARG', country: 'Argentina', gfc_extent_ha: 29000000, area_ha: 278000000, latitude: -38.42, longitude: -63.62 },
  { iso: 'BOL', country: 'Bolivia', gfc_extent_ha: 50000000, area_ha: 109900000, latitude: -16.29, longitude: -63.59 },
  { iso: 'VEN', country: 'Venezuela', gfc_extent_ha: 47000000, area_ha: 91600000, latitude: 6.42, longitude: -66.59 },
  { iso: 'MYS', country: 'Malaysia', gfc_extent_ha: 22000000, area_ha: 33000000, latitude: 4.21, longitude: 101.98 },
  { iso: 'PNG', country: 'Papua New Guinea', gfc_extent_ha: 33000000, area_ha: 46300000, latitude: -6.31, longitude: 143.96 },
  { iso: 'MMR', country: 'Myanmar', gfc_extent_ha: 29000000, area_ha: 67700000, latitude: 21.92, longitude: 95.96 },
  { iso: 'AGO', country: 'Angola', gfc_extent_ha: 58000000, area_ha: 124700000, latitude: -11.20, longitude: 17.87 },
  { iso: 'MOZ', country: 'Mozambique', gfc_extent_ha: 38000000, area_ha: 80200000, latitude: -18.67, longitude: 35.53 },
  { iso: 'TZA', country: 'Tanzania', gfc_extent_ha: 46000000, area_ha: 94500000, latitude: -6.37, longitude: 34.89 },
  { iso: 'ZMB', country: 'Zambia', gfc_extent_ha: 44000000, area_ha: 75300000, latitude: -13.13, longitude: 27.85 },
  { iso: 'SWE', country: 'Sweden', gfc_extent_ha: 28000000, area_ha: 45000000, latitude: 60.13, longitude: 18.64 },
  { iso: 'FIN', country: 'Finland', gfc_extent_ha: 22000000, area_ha: 33800000, latitude: 61.92, longitude: 25.75 },
  { iso: 'JPN', country: 'Japan', gfc_extent_ha: 25000000, area_ha: 37800000, latitude: 36.20, longitude: 138.25 },
  { iso: 'GAB', country: 'Gabon', gfc_extent_ha: 22000000, area_ha: 26800000, latitude: -0.80, longitude: 11.61 },
  { iso: 'CMR', country: 'Cameroon', gfc_extent_ha: 19000000, area_ha: 47500000, latitude: 7.37, longitude: 12.35 },
  { iso: 'CAF', country: 'Central African Republic', gfc_extent_ha: 22000000, area_ha: 62300000, latitude: 6.61, longitude: 20.94 },
  { iso: 'COG', country: 'Congo', gfc_extent_ha: 22000000, area_ha: 34200000, latitude: -0.23, longitude: 15.83 },
  { iso: 'ECU', country: 'Ecuador', gfc_extent_ha: 12000000, area_ha: 28400000, latitude: -1.83, longitude: -78.18 },
  { iso: 'GUY', country: 'Guyana', gfc_extent_ha: 18000000, area_ha: 21500000, latitude: 4.86, longitude: -58.93 },
  { iso: 'SUR', country: 'Suriname', gfc_extent_ha: 15000000, area_ha: 16400000, latitude: 3.92, longitude: -56.03 },
  { iso: 'LAO', country: 'Laos', gfc_extent_ha: 16000000, area_ha: 23700000, latitude: 19.86, longitude: 102.50 },
  { iso: 'KHM', country: 'Cambodia', gfc_extent_ha: 10000000, area_ha: 18100000, latitude: 12.57, longitude: 104.99 },
  { iso: 'THA', country: 'Thailand', gfc_extent_ha: 16000000, area_ha: 51300000, latitude: 15.87, longitude: 100.99 },
  { iso: 'VNM', country: 'Vietnam', gfc_extent_ha: 14000000, area_ha: 33100000, latitude: 14.06, longitude: 108.28 },
  { iso: 'NOR', country: 'Norway', gfc_extent_ha: 12000000, area_ha: 38500000, latitude: 60.47, longitude: 8.47 },
  { iso: 'DEU', country: 'Germany', gfc_extent_ha: 11000000, area_ha: 35740000, latitude: 51.17, longitude: 10.45 },
  { iso: 'FRA', country: 'France', gfc_extent_ha: 17000000, area_ha: 64000000, latitude: 46.23, longitude: 2.21 },
  { iso: 'ESP', country: 'Spain', gfc_extent_ha: 18000000, area_ha: 50600000, latitude: 40.46, longitude: -3.75 },
];
