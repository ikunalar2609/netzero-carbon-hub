
export interface EmissionsData {
  id: string;
  year: string;
  month?: string;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

export interface CategoryEmission {
  id: string;
  name: string;
  value: number;
  color: string;
  scopeType: 'scope1' | 'scope2' | 'scope3';
}

export interface CategoryComparison {
  id: string;
  category: string;
  current: number;
  previous: number;
  target: number;
}

export interface IntensityData {
  id: string;
  year: string;
  emissions: number;
  revenue: number;
  intensity: number;
}
