
export interface Subcategory {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'at-risk';
  info: string;
}

export interface ImpactCategory {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface QualityScore {
  id: string;
  category: string;
  score: number;
}
