// Comprehensive emission factor database modeled after Ecodex/CBAM standards

export interface EmissionFactor {
  id: string;
  name: string;
  fe: number;           // Emission factor value
  unit: string;         // kg, kgC, m², m³, unit, etc.
  perimeter: string;    // Gate-to-gate, Cradle-to-gate, etc.
  source: string;       // sustainalize, CBAM, DEFRA, IPCC, etc.
  category: string;     // Energy, Transportation, Industry, Agriculture, etc.
  scope: string;        // scope1, scope2, scope3
  methodology: string;  // GHG Protocol, IPCC AR6, DEFRA 2024, etc.
  region: string;       // Global, Europe, North America, Asia Pacific
  description: string;
  sector: string;
  subSector: string;
  dataType: string;     // Primary, Secondary, Default
  lastUpdated: string;
  isFavorite?: boolean;
  sourceUrl: string;    // Hyperlink to the actual data source
  notes: string;        // Important context, caveats, or usage guidance
}

export interface FarmlyFilters {
  origin: "shared" | "private";
  favoritesOnly: boolean;
  units: string[];
  sources: string[];
  searchQuery: string;
  scope: string[];
  methodology: string[];
  region: string[];
  category: string[];
  sector: string[];
  dataType: string[];
  perimeter: string[];
}

export const defaultFilters: FarmlyFilters = {
  origin: "shared",
  favoritesOnly: false,
  units: [],
  sources: [],
  searchQuery: "",
  scope: [],
  methodology: [],
  region: [],
  category: [],
  sector: [],
  dataType: [],
  perimeter: [],
};

export const emissionFactors: EmissionFactor[] = [
  // Steel & Metal products
  { id: "ef-001", name: "Steel alloy - bars rods hot-rolled coils", fe: 2.0, unit: "kg", perimeter: "Gate-to-gate", source: "CBAM", category: "Industry", scope: "scope1", methodology: "GHG Protocol", region: "Europe", description: "Producer's scope 1 and 2 emissions for steel bars/rods production", sector: "Metalworking", subSector: "Metal and metal products", dataType: "Primary", lastUpdated: "2024-01-15" },
  { id: "ef-002", name: "Steel other alloy - wire", fe: 2.6, unit: "kg", perimeter: "Gate-to-gate", source: "CBAM", category: "Industry", scope: "scope1", methodology: "GHG Protocol", region: "Europe", description: "Wire production from steel alloys", sector: "Metalworking", subSector: "Metal and metal products", dataType: "Primary", lastUpdated: "2024-01-15" },
  { id: "ef-003", name: "Steel other alloy - wire (cold drawn)", fe: 2.0, unit: "kg", perimeter: "Gate-to-gate", source: "CBAM", category: "Industry", scope: "scope1", methodology: "GHG Protocol", region: "Europe", description: "Cold drawn wire production from steel alloys", sector: "Metalworking", subSector: "Metal and metal products", dataType: "Primary", lastUpdated: "2024-01-15" },
  { id: "ef-004", name: "Aluminium ingots - primary smelting", fe: 8.6, unit: "kg", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Industry", scope: "scope1", methodology: "IPCC AR6", region: "Global", description: "Primary aluminium smelting including electrolysis", sector: "Metalworking", subSector: "Metal and metal products", dataType: "Secondary", lastUpdated: "2023-11-20" },
  { id: "ef-005", name: "Copper cathode - electrolytic refining", fe: 3.5, unit: "kg", perimeter: "Gate-to-gate", source: "sustainalize", category: "Industry", scope: "scope2", methodology: "GHG Protocol", region: "Global", description: "Electrolytic copper refining process", sector: "Metalworking", subSector: "Metal and metal products", dataType: "Secondary", lastUpdated: "2023-10-05" },

  // Energy
  { id: "ef-006", name: "Electricity Grid - United States average", fe: 0.386, unit: "kgC", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Energy", scope: "scope2", methodology: "IPCC AR6", region: "North America", description: "US average electricity grid emission factor", sector: "Energy", subSector: "Electricity generation", dataType: "Primary", lastUpdated: "2024-02-01" },
  { id: "ef-007", name: "Electricity Grid - EU-27 average", fe: 0.295, unit: "kgC", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Energy", scope: "scope2", methodology: "IPCC AR6", region: "Europe", description: "EU-27 average electricity grid emission factor", sector: "Energy", subSector: "Electricity generation", dataType: "Primary", lastUpdated: "2024-02-01" },
  { id: "ef-008", name: "Electricity Grid - United Kingdom", fe: 0.193, unit: "kgC", perimeter: "Cradle-to-gate", source: "DEFRA", category: "Energy", scope: "scope2", methodology: "DEFRA 2024", region: "Europe", description: "UK electricity grid emission factor", sector: "Energy", subSector: "Electricity generation", dataType: "Primary", lastUpdated: "2024-03-10" },
  { id: "ef-009", name: "Natural Gas Combustion - boiler", fe: 2.03, unit: "m³", perimeter: "Gate-to-gate", source: "sustainalize", category: "Energy", scope: "scope1", methodology: "IPCC AR6", region: "Global", description: "Natural gas combustion in industrial boilers", sector: "Energy", subSector: "Fuel combustion", dataType: "Primary", lastUpdated: "2023-12-15" },
  { id: "ef-010", name: "Diesel fuel - stationary combustion", fe: 2.68, unit: "unit", perimeter: "Gate-to-gate", source: "DEFRA", category: "Energy", scope: "scope1", methodology: "DEFRA 2024", region: "Europe", description: "Diesel fuel combustion in stationary equipment (per litre)", sector: "Energy", subSector: "Fuel combustion", dataType: "Primary", lastUpdated: "2024-03-10" },

  // Transportation
  { id: "ef-011", name: "Passenger Car - Gasoline medium", fe: 0.192, unit: "kg", perimeter: "Well-to-wheel", source: "sustainalize", category: "Transportation", scope: "scope1", methodology: "IPCC AR6", region: "Global", description: "Medium gasoline passenger car per km", sector: "Transport", subSector: "Road transport", dataType: "Secondary", lastUpdated: "2023-09-20" },
  { id: "ef-012", name: "Heavy Goods Vehicle - diesel >33t", fe: 0.885, unit: "kg", perimeter: "Well-to-wheel", source: "DEFRA", category: "Transportation", scope: "scope3", methodology: "DEFRA 2024", region: "Europe", description: "HGV diesel over 33 tonnes per km", sector: "Transport", subSector: "Road transport", dataType: "Primary", lastUpdated: "2024-03-10" },
  { id: "ef-013", name: "Air Freight - International long-haul", fe: 1.23, unit: "kg", perimeter: "Well-to-wheel", source: "sustainalize", category: "Transportation", scope: "scope3", methodology: "ICAO", region: "Global", description: "International air freight per tonne-km", sector: "Transport", subSector: "Air transport", dataType: "Secondary", lastUpdated: "2023-08-15" },
  { id: "ef-014", name: "Maritime Freight - Container ship", fe: 0.015, unit: "kg", perimeter: "Well-to-wheel", source: "sustainalize", category: "Transportation", scope: "scope3", methodology: "IMO", region: "Global", description: "Container ship freight per tonne-km", sector: "Transport", subSector: "Sea transport", dataType: "Secondary", lastUpdated: "2023-07-01" },
  { id: "ef-015", name: "Rail Freight - Electric locomotive", fe: 0.028, unit: "kg", perimeter: "Well-to-wheel", source: "sustainalize", category: "Transportation", scope: "scope3", methodology: "GHG Protocol", region: "Europe", description: "Electric rail freight per tonne-km", sector: "Transport", subSector: "Rail transport", dataType: "Secondary", lastUpdated: "2023-06-15" },

  // Cement & Construction
  { id: "ef-016", name: "Portland Cement - CEM I", fe: 0.87, unit: "kg", perimeter: "Cradle-to-gate", source: "CBAM", category: "Industry", scope: "scope1", methodology: "GHG Protocol", region: "Europe", description: "Portland cement CEM I production", sector: "Construction", subSector: "Cement and concrete", dataType: "Primary", lastUpdated: "2024-01-20" },
  { id: "ef-017", name: "Concrete - C30/37 ready-mix", fe: 0.132, unit: "kg", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Industry", scope: "scope1", methodology: "GHG Protocol", region: "Europe", description: "Ready-mix concrete C30/37 class", sector: "Construction", subSector: "Cement and concrete", dataType: "Secondary", lastUpdated: "2023-11-10" },

  // Agriculture
  { id: "ef-018", name: "Nitrogen fertilizer - ammonium nitrate", fe: 6.8, unit: "kg", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Agriculture", scope: "scope3", methodology: "IPCC AR6", region: "Global", description: "Ammonium nitrate fertilizer production", sector: "Agriculture", subSector: "Fertilizers", dataType: "Secondary", lastUpdated: "2023-05-20" },
  { id: "ef-019", name: "Rice cultivation - flooded paddy", fe: 1.3, unit: "m²", perimeter: "Gate-to-gate", source: "sustainalize", category: "Agriculture", scope: "scope1", methodology: "IPCC AR6", region: "Asia Pacific", description: "Methane emissions from flooded rice paddies per m²", sector: "Agriculture", subSector: "Crop production", dataType: "Primary", lastUpdated: "2023-04-10" },

  // Chemicals
  { id: "ef-020", name: "Polyethylene - HDPE granules", fe: 1.89, unit: "kg", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Industry", scope: "scope3", methodology: "GHG Protocol", region: "Global", description: "HDPE plastic granules production", sector: "Chemicals", subSector: "Plastics", dataType: "Secondary", lastUpdated: "2023-10-30" },
  { id: "ef-021", name: "Polypropylene - injection grade", fe: 1.63, unit: "kg", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Industry", scope: "scope3", methodology: "GHG Protocol", region: "Europe", description: "Polypropylene injection moulding grade production", sector: "Chemicals", subSector: "Plastics", dataType: "Secondary", lastUpdated: "2023-09-15" },

  // Waste
  { id: "ef-022", name: "Municipal waste - landfill", fe: 0.587, unit: "kg", perimeter: "Gate-to-gate", source: "DEFRA", category: "Waste", scope: "scope3", methodology: "DEFRA 2024", region: "Europe", description: "Municipal solid waste disposed to landfill", sector: "Waste", subSector: "Landfill", dataType: "Primary", lastUpdated: "2024-03-10" },
  { id: "ef-023", name: "Wastewater treatment - industrial", fe: 0.23, unit: "m³", perimeter: "Gate-to-gate", source: "sustainalize", category: "Waste", scope: "scope1", methodology: "IPCC AR6", region: "Global", description: "Industrial wastewater treatment per m³", sector: "Waste", subSector: "Wastewater", dataType: "Secondary", lastUpdated: "2023-08-20" },

  // Digital
  { id: "ef-024", name: "Cloud Computing - AWS EC2 instance", fe: 0.056, unit: "unit", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Digital", scope: "scope3", methodology: "GHG Protocol", region: "North America", description: "AWS EC2 compute instance per hour", sector: "Digital", subSector: "Cloud services", dataType: "Secondary", lastUpdated: "2023-12-01" },
  { id: "ef-025", name: "Data Centre - PUE 1.2 average", fe: 0.42, unit: "kgC", perimeter: "Gate-to-gate", source: "sustainalize", category: "Digital", scope: "scope2", methodology: "GHG Protocol", region: "Global", description: "Data centre electricity consumption per kWh (PUE=1.2)", sector: "Digital", subSector: "Data centres", dataType: "Secondary", lastUpdated: "2023-11-15" },

  // Additional factors
  { id: "ef-026", name: "Glass bottles - clear soda lime", fe: 0.85, unit: "kg", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Industry", scope: "scope3", methodology: "GHG Protocol", region: "Europe", description: "Clear soda lime glass bottle production", sector: "Manufacturing", subSector: "Glass", dataType: "Secondary", lastUpdated: "2023-07-25" },
  { id: "ef-027", name: "Paper - uncoated wood-free", fe: 1.09, unit: "kg", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Industry", scope: "scope3", methodology: "GHG Protocol", region: "Europe", description: "Uncoated wood-free paper production", sector: "Manufacturing", subSector: "Paper and pulp", dataType: "Secondary", lastUpdated: "2023-06-10" },
  { id: "ef-028", name: "Hydrogen - grey (SMR)", fe: 9.3, unit: "kg", perimeter: "Cradle-to-gate", source: "CBAM", category: "Energy", scope: "scope1", methodology: "IPCC AR6", region: "Global", description: "Grey hydrogen via steam methane reforming", sector: "Energy", subSector: "Hydrogen production", dataType: "Primary", lastUpdated: "2024-01-05" },
  { id: "ef-029", name: "Electricity Grid - India average", fe: 0.708, unit: "kgC", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Energy", scope: "scope2", methodology: "IPCC AR6", region: "Asia Pacific", description: "India average electricity grid emission factor", sector: "Energy", subSector: "Electricity generation", dataType: "Primary", lastUpdated: "2024-01-10" },
  { id: "ef-030", name: "Electricity Grid - China average", fe: 0.555, unit: "kgC", perimeter: "Cradle-to-gate", source: "sustainalize", category: "Energy", scope: "scope2", methodology: "IPCC AR6", region: "Asia Pacific", description: "China average electricity grid emission factor", sector: "Energy", subSector: "Electricity generation", dataType: "Primary", lastUpdated: "2024-01-10" },

  // ═══ NEW SOURCES: EPA, ecoinvent, ICAO, IMO, GLEC ═══

  // EPA factors
  { id: "ef-031", name: "Gasoline - mobile combustion", fe: 2.31, unit: "unit", perimeter: "Well-to-wheel", source: "EPA", category: "Energy", scope: "scope1", methodology: "EPA GHG Inventory", region: "North America", description: "Gasoline mobile combustion per gallon (US EPA)", sector: "Energy", subSector: "Fuel combustion", dataType: "Primary", lastUpdated: "2024-04-01" },
  { id: "ef-032", name: "Propane - stationary combustion", fe: 1.54, unit: "unit", perimeter: "Gate-to-gate", source: "EPA", category: "Energy", scope: "scope1", methodology: "EPA GHG Inventory", region: "North America", description: "Propane stationary combustion per gallon", sector: "Energy", subSector: "Fuel combustion", dataType: "Primary", lastUpdated: "2024-04-01" },
  { id: "ef-033", name: "Electricity Grid - ERCOT (Texas)", fe: 0.397, unit: "kgC", perimeter: "Cradle-to-gate", source: "EPA", category: "Energy", scope: "scope2", methodology: "EPA eGRID", region: "North America", description: "ERCOT regional grid electricity factor", sector: "Energy", subSector: "Electricity generation", dataType: "Primary", lastUpdated: "2024-03-15" },
  { id: "ef-034", name: "Refrigerant R-410A - leakage", fe: 2088.0, unit: "kg", perimeter: "Gate-to-gate", source: "EPA", category: "Industry", scope: "scope1", methodology: "EPA GHG Inventory", region: "Global", description: "Fugitive emissions from R-410A refrigerant", sector: "HVAC", subSector: "Refrigerants", dataType: "Primary", lastUpdated: "2024-02-20" },

  // ecoinvent factors
  { id: "ef-035", name: "Lithium-ion battery - NMC production", fe: 73.0, unit: "kg", perimeter: "Cradle-to-gate", source: "ecoinvent", category: "Industry", scope: "scope3", methodology: "ISO 14044", region: "Global", description: "NMC lithium-ion battery cell production per kWh capacity", sector: "Manufacturing", subSector: "Electronics", dataType: "Primary", lastUpdated: "2024-01-30" },
  { id: "ef-036", name: "Cotton textile - woven fabric", fe: 5.2, unit: "kg", perimeter: "Cradle-to-gate", source: "ecoinvent", category: "Industry", scope: "scope3", methodology: "ISO 14044", region: "Asia Pacific", description: "Cotton woven fabric production", sector: "Manufacturing", subSector: "Textiles", dataType: "Primary", lastUpdated: "2023-12-10" },
  { id: "ef-037", name: "Soybean - cultivation and harvest", fe: 0.35, unit: "kg", perimeter: "Cradle-to-gate", source: "ecoinvent", category: "Agriculture", scope: "scope1", methodology: "ISO 14044", region: "South America", description: "Soybean cultivation including land use change", sector: "Agriculture", subSector: "Crop production", dataType: "Primary", lastUpdated: "2023-11-01" },
  { id: "ef-038", name: "Photovoltaic panel - monocrystalline", fe: 40.0, unit: "m²", perimeter: "Cradle-to-gate", source: "ecoinvent", category: "Energy", scope: "scope3", methodology: "ISO 14044", region: "Asia Pacific", description: "Monocrystalline PV panel manufacturing per m²", sector: "Energy", subSector: "Renewable equipment", dataType: "Primary", lastUpdated: "2024-02-15" },
  { id: "ef-039", name: "Tap water - treatment and supply", fe: 0.000344, unit: "m³", perimeter: "Cradle-to-gate", source: "ecoinvent", category: "Waste", scope: "scope3", methodology: "ISO 14044", region: "Europe", description: "Municipal tap water treatment per m³", sector: "Utilities", subSector: "Water", dataType: "Primary", lastUpdated: "2023-09-01" },

  // ICAO factors
  { id: "ef-040", name: "Passenger Flight - domestic short-haul", fe: 0.255, unit: "kg", perimeter: "Well-to-wheel", source: "ICAO", category: "Transportation", scope: "scope3", methodology: "ICAO", region: "Global", description: "Domestic passenger flight per pax-km (economy)", sector: "Transport", subSector: "Air transport", dataType: "Primary", lastUpdated: "2024-03-01" },
  { id: "ef-041", name: "Passenger Flight - international long-haul", fe: 0.148, unit: "kg", perimeter: "Well-to-wheel", source: "ICAO", category: "Transportation", scope: "scope3", methodology: "ICAO", region: "Global", description: "Long-haul international passenger flight per pax-km (economy)", sector: "Transport", subSector: "Air transport", dataType: "Primary", lastUpdated: "2024-03-01" },
  { id: "ef-042", name: "Passenger Flight - medium-haul", fe: 0.187, unit: "kg", perimeter: "Well-to-wheel", source: "ICAO", category: "Transportation", scope: "scope3", methodology: "ICAO", region: "Global", description: "Medium-haul passenger flight per pax-km (economy)", sector: "Transport", subSector: "Air transport", dataType: "Primary", lastUpdated: "2024-03-01" },

  // IMO factors
  { id: "ef-043", name: "Bulk Carrier - Handysize", fe: 0.0078, unit: "kg", perimeter: "Well-to-wheel", source: "IMO", category: "Transportation", scope: "scope3", methodology: "IMO", region: "Global", description: "Handysize bulk carrier per tonne-km", sector: "Transport", subSector: "Sea transport", dataType: "Primary", lastUpdated: "2024-02-01" },
  { id: "ef-044", name: "Tanker - Suezmax crude oil", fe: 0.005, unit: "kg", perimeter: "Well-to-wheel", source: "IMO", category: "Transportation", scope: "scope3", methodology: "IMO", region: "Global", description: "Suezmax crude oil tanker per tonne-km", sector: "Transport", subSector: "Sea transport", dataType: "Primary", lastUpdated: "2024-02-01" },
  { id: "ef-045", name: "RoRo vessel - vehicle carrier", fe: 0.032, unit: "kg", perimeter: "Well-to-wheel", source: "IMO", category: "Transportation", scope: "scope3", methodology: "IMO", region: "Global", description: "Roll-on/roll-off vehicle carrier per tonne-km", sector: "Transport", subSector: "Sea transport", dataType: "Primary", lastUpdated: "2024-02-01" },

  // GLEC factors
  { id: "ef-046", name: "Road Freight - LTL Europe", fe: 0.062, unit: "kg", perimeter: "Well-to-wheel", source: "GLEC", category: "Transportation", scope: "scope3", methodology: "GLEC Framework", region: "Europe", description: "Less-than-truckload road freight per tonne-km (EU average)", sector: "Transport", subSector: "Road transport", dataType: "Primary", lastUpdated: "2024-01-15" },
  { id: "ef-047", name: "Road Freight - FTL North America", fe: 0.071, unit: "kg", perimeter: "Well-to-wheel", source: "GLEC", category: "Transportation", scope: "scope3", methodology: "GLEC Framework", region: "North America", description: "Full truckload road freight per tonne-km (NA average)", sector: "Transport", subSector: "Road transport", dataType: "Primary", lastUpdated: "2024-01-15" },
  { id: "ef-048", name: "Intermodal - rail+truck Europe", fe: 0.029, unit: "kg", perimeter: "Well-to-wheel", source: "GLEC", category: "Transportation", scope: "scope3", methodology: "GLEC Framework", region: "Europe", description: "Intermodal rail + last-mile truck per tonne-km", sector: "Transport", subSector: "Intermodal", dataType: "Primary", lastUpdated: "2024-01-15" },
  { id: "ef-049", name: "Air Freight - belly cargo", fe: 0.602, unit: "kg", perimeter: "Well-to-wheel", source: "GLEC", category: "Transportation", scope: "scope3", methodology: "GLEC Framework", region: "Global", description: "Air freight belly cargo per tonne-km", sector: "Transport", subSector: "Air transport", dataType: "Secondary", lastUpdated: "2024-01-15" },

  // Additional ecoinvent & EPA
  { id: "ef-050", name: "Beef cattle - enteric fermentation", fe: 27.0, unit: "kg", perimeter: "Gate-to-gate", source: "ecoinvent", category: "Agriculture", scope: "scope1", methodology: "IPCC AR6", region: "Global", description: "Enteric fermentation methane from beef cattle per head per year", sector: "Agriculture", subSector: "Livestock", dataType: "Primary", lastUpdated: "2024-01-20" },
  { id: "ef-051", name: "Electricity Grid - California", fe: 0.225, unit: "kgC", perimeter: "Cradle-to-gate", source: "EPA", category: "Energy", scope: "scope2", methodology: "EPA eGRID", region: "North America", description: "CAMX (California) electricity grid factor", sector: "Energy", subSector: "Electricity generation", dataType: "Primary", lastUpdated: "2024-03-15" },
  { id: "ef-052", name: "Electricity Grid - Japan average", fe: 0.471, unit: "kgC", perimeter: "Cradle-to-gate", source: "IPCC", category: "Energy", scope: "scope2", methodology: "IPCC AR6", region: "Asia Pacific", description: "Japan average electricity grid emission factor", sector: "Energy", subSector: "Electricity generation", dataType: "Primary", lastUpdated: "2024-01-10" },
  { id: "ef-053", name: "Electricity Grid - Brazil average", fe: 0.074, unit: "kgC", perimeter: "Cradle-to-gate", source: "IPCC", category: "Energy", scope: "scope2", methodology: "IPCC AR6", region: "South America", description: "Brazil average electricity grid (high hydro share)", sector: "Energy", subSector: "Electricity generation", dataType: "Primary", lastUpdated: "2024-01-10" },
  { id: "ef-054", name: "LNG - liquefaction and transport", fe: 3.2, unit: "unit", perimeter: "Cradle-to-gate", source: "GLEC", category: "Energy", scope: "scope3", methodology: "GLEC Framework", region: "Global", description: "Liquefied natural gas upstream including transport per tonne", sector: "Energy", subSector: "Fuel combustion", dataType: "Secondary", lastUpdated: "2024-02-01" },
  { id: "ef-055", name: "Waste incineration - mixed MSW", fe: 0.33, unit: "kg", perimeter: "Gate-to-gate", source: "EPA", category: "Waste", scope: "scope1", methodology: "EPA GHG Inventory", region: "North America", description: "Municipal solid waste incineration with energy recovery", sector: "Waste", subSector: "Incineration", dataType: "Primary", lastUpdated: "2024-04-01" },
];

// Get unique values for filter options
export const getFilterOptions = () => {
  const units = [...new Set(emissionFactors.map(ef => ef.unit))];
  const sources = [...new Set(emissionFactors.map(ef => ef.source))];
  const scopes = [...new Set(emissionFactors.map(ef => ef.scope))];
  const methodologies = [...new Set(emissionFactors.map(ef => ef.methodology))];
  const regions = [...new Set(emissionFactors.map(ef => ef.region))];
  const categories = [...new Set(emissionFactors.map(ef => ef.category))];
  const sectors = [...new Set(emissionFactors.map(ef => ef.sector))];
  const dataTypes = [...new Set(emissionFactors.map(ef => ef.dataType))];
  const perimeters = [...new Set(emissionFactors.map(ef => ef.perimeter))];

  const unitCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const sectorCounts: Record<string, number> = {};
  const dataTypeCounts: Record<string, number> = {};
  const perimeterCounts: Record<string, number> = {};

  emissionFactors.forEach(ef => {
    unitCounts[ef.unit] = (unitCounts[ef.unit] || 0) + 1;
    sourceCounts[ef.source] = (sourceCounts[ef.source] || 0) + 1;
    categoryCounts[ef.category] = (categoryCounts[ef.category] || 0) + 1;
    sectorCounts[ef.sector] = (sectorCounts[ef.sector] || 0) + 1;
    dataTypeCounts[ef.dataType] = (dataTypeCounts[ef.dataType] || 0) + 1;
    perimeterCounts[ef.perimeter] = (perimeterCounts[ef.perimeter] || 0) + 1;
  });

  return { units, sources, scopes, methodologies, regions, categories, sectors, dataTypes, perimeters, unitCounts, sourceCounts, categoryCounts, sectorCounts, dataTypeCounts, perimeterCounts };
};

// Apply filters to emission factors
export const applyFilters = (factors: EmissionFactor[], filters: FarmlyFilters): EmissionFactor[] => {
  return factors.filter(ef => {
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matchesSearch = ef.name.toLowerCase().includes(q) ||
        ef.category.toLowerCase().includes(q) ||
        ef.sector.toLowerCase().includes(q) ||
        ef.description.toLowerCase().includes(q) ||
        ef.source.toLowerCase().includes(q) ||
        ef.perimeter.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }
    if (filters.favoritesOnly && !ef.isFavorite) return false;
    if (filters.units.length > 0 && !filters.units.includes(ef.unit)) return false;
    if (filters.sources.length > 0 && !filters.sources.includes(ef.source)) return false;
    if (filters.scope.length > 0 && !filters.scope.includes(ef.scope)) return false;
    if (filters.methodology.length > 0 && !filters.methodology.includes(ef.methodology)) return false;
    if (filters.region.length > 0 && !filters.region.includes(ef.region)) return false;
    if (filters.category.length > 0 && !filters.category.includes(ef.category)) return false;
    if (filters.sector.length > 0 && !filters.sector.includes(ef.sector)) return false;
    if (filters.dataType.length > 0 && !filters.dataType.includes(ef.dataType)) return false;
    if (filters.perimeter.length > 0 && !filters.perimeter.includes(ef.perimeter)) return false;
    return true;
  });
};
