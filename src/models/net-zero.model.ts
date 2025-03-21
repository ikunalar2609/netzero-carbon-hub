
export interface EmissionPathway {
  id: string;
  year: number;
  emissions: number;
  target: number;
  businessAsUsual: number;
}

export interface Milestone {
  id: string;
  year: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface ReductionProject {
  id: string;
  name: string;
  description: string;
  impact: number;
  category: string;
  timeline: string;
  status: 'active' | 'planned' | 'completed';
  cost: number;
}

export interface ScenarioData {
  id: string;
  year: number;
  current: number;
  aggressive: number;
  moderate: number;
}

export interface SummaryMetric {
  id: string;
  title: string;
  value: string;
  description: string;
}
