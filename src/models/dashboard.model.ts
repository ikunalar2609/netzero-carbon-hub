
export interface SummaryCard {
  id: string;
  title: string;
  value: string;
  description: string;
  trend: {
    value: number;
    isPositive: boolean;
  };
  icon: string;
}

export interface ReductionStatus {
  id: string;
  title: string;
  status: 'On Track' | 'At Risk' | 'Behind';
  progress: number;
  target: string;
  scope: string;
}

export interface Goal {
  id: string;
  name: string;
  progress: number;
  target: string;
  status: 'On Track' | 'At Risk' | 'Behind';
}
