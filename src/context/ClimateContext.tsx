import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

// ========== Types ==========

export type ScenarioType = 'current' | 'aggressive' | 'moderate';
export type ScopeType = 'scope1' | 'scope2' | 'scope3' | 'all';

export interface EmissionsData {
  year: number;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
}

export interface Milestone {
  year: number;
  event: string;
  status: 'completed' | 'inProgress' | 'planned';
  reductionTarget?: number;
  standards?: string[];
  offsetDependency?: number;
}

export interface ReductionLever {
  id: string;
  name: string;
  category: 'renewables' | 'fleet' | 'suppliers' | 'offsets' | 'efficiency';
  currentValue: number;
  targetValue: number;
  impact: number; // tCO2e reduction
  cost: number;
  enabled: boolean;
}

export interface CarbonOffset {
  id: string;
  projectName: string;
  category: string;
  credits: number;
  pricePerTon: number;
  qualityScore: number; // 0-100
  vintage: string;
  selected: boolean;
}

export interface ScenarioConfig {
  name: string;
  netZeroYear: number;
  renewablesTarget: number;
  fleetElectrification: number;
  supplierEngagement: number;
  offsetReliance: number;
  investmentLevel: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
}

export interface ClimateInsight {
  id: string;
  type: 'positive' | 'warning' | 'critical' | 'info';
  message: string;
  metric?: string;
  delta?: number;
  source: string;
  timestamp: Date;
}

export interface DataExplainability {
  formula: string;
  dataSources: string[];
  lastUpdated: Date;
  confidence: number;
}

export interface ClimateState {
  // Core Settings
  baselineYear: number;
  targetYear: number;
  selectedScenario: ScenarioType;
  selectedScope: ScopeType;
  
  // Emissions Data
  historicalEmissions: EmissionsData[];
  currentEmissions: { scope1: number; scope2: number; scope3: number; total: number };
  projectedEmissions: EmissionsData[];
  
  // Reduction Configuration
  reductionLevers: ReductionLever[];
  milestones: Milestone[];
  
  // Carbon Market
  selectedOffsets: CarbonOffset[];
  totalOffsetsApplied: number;
  
  // Scenarios
  scenarios: Record<ScenarioType, ScenarioConfig>;
  
  // Quality & Compliance
  qualityScore: number;
  verificationLevel: number;
  standardsCompliance: { standard: string; status: 'compliant' | 'partial' | 'non-compliant' }[];
  
  // Insights
  insights: ClimateInsight[];
  
  // Calculations
  netZeroProjectedYear: number;
  totalReductionPercent: number;
  offsetDependencyRisk: 'low' | 'medium' | 'high';
  auditReadiness: 'ready' | 'partial' | 'not-ready';
  
  // Data tracking
  lastUpdated: Date;
}

interface ClimateContextValue extends ClimateState {
  // Actions
  setSelectedScenario: (scenario: ScenarioType) => void;
  setSelectedScope: (scope: ScopeType) => void;
  setTargetYear: (year: number) => void;
  toggleReductionLever: (leverId: string) => void;
  updateReductionLever: (leverId: string, value: number) => void;
  selectOffset: (offsetId: string, selected: boolean) => void;
  purchaseCredits: (offsetId: string, amount: number) => void;
  
  // Computed values
  getProjectedNetZeroYear: () => number;
  getScenarioDelta: (fromScenario: ScenarioType, toScenario: ScenarioType) => {
    yearsSaved: number;
    costChange: number;
    emissionsReduced: number;
  };
  getMilestoneImpact: (milestoneYear: number) => {
    standards: string[];
    confidence: number;
    offsetRisk: string;
  };
  getExplainability: (metric: string) => DataExplainability;
  
  // Export
  exportCurrentState: () => object;
}

const defaultReductionLevers: ReductionLever[] = [
  { id: 'renewables', name: 'Renewable Energy', category: 'renewables', currentValue: 72, targetValue: 100, impact: 28000, cost: 2500000, enabled: true },
  { id: 'fleet', name: 'Fleet Electrification', category: 'fleet', currentValue: 50, targetValue: 100, impact: 15000, cost: 1800000, enabled: true },
  { id: 'suppliers', name: 'Supplier Engagement', category: 'suppliers', currentValue: 58, targetValue: 80, impact: 35000, cost: 500000, enabled: true },
  { id: 'efficiency', name: 'Energy Efficiency', category: 'efficiency', currentValue: 65, targetValue: 90, impact: 12000, cost: 800000, enabled: true },
  { id: 'offsets', name: 'Carbon Offsets', category: 'offsets', currentValue: 10, targetValue: 30, impact: 20000, cost: 600000, enabled: false },
];

const defaultMilestones: Milestone[] = [
  { year: 2020, event: 'Baseline Assessment', status: 'completed', reductionTarget: 0, standards: ['GHG Protocol'], offsetDependency: 0 },
  { year: 2022, event: '25% Renewable Energy', status: 'completed', reductionTarget: 10, standards: ['GHG Protocol', 'ISO 14064'], offsetDependency: 0 },
  { year: 2023, event: '50% Electric Fleet', status: 'completed', reductionTarget: 15, standards: ['SBTi'], offsetDependency: 5 },
  { year: 2024, event: '75% Supplier Engagement', status: 'inProgress', reductionTarget: 20, standards: ['GHG Protocol', 'CDP'], offsetDependency: 8 },
  { year: 2025, event: '30% Emissions Reduction', status: 'planned', reductionTarget: 30, standards: ['SBTi', 'ISO 14064'], offsetDependency: 10 },
  { year: 2026, event: '45% Renewable Energy', status: 'planned', reductionTarget: 35, standards: ['RE100'], offsetDependency: 12 },
  { year: 2028, event: '60% Emissions Reduction', status: 'planned', reductionTarget: 60, standards: ['SBTi', 'Paris Agreement'], offsetDependency: 15 },
  { year: 2030, event: '80% Emissions Reduction', status: 'planned', reductionTarget: 80, standards: ['SBTi', 'Net Zero Standard'], offsetDependency: 18 },
  { year: 2035, event: '95% Emissions Reduction', status: 'planned', reductionTarget: 95, standards: ['Net Zero Standard'], offsetDependency: 20 },
  { year: 2040, event: 'Net Zero Achievement', status: 'planned', reductionTarget: 100, standards: ['Net Zero Standard', 'SBTi'], offsetDependency: 5 },
];

const defaultScenarios: Record<ScenarioType, ScenarioConfig> = {
  current: {
    name: 'Current Plan',
    netZeroYear: 2040,
    renewablesTarget: 80,
    fleetElectrification: 100,
    supplierEngagement: 75,
    offsetReliance: 15,
    investmentLevel: 'medium',
    riskLevel: 'medium',
  },
  aggressive: {
    name: 'Aggressive Plan',
    netZeroYear: 2035,
    renewablesTarget: 100,
    fleetElectrification: 100,
    supplierEngagement: 90,
    offsetReliance: 25,
    investmentLevel: 'high',
    riskLevel: 'high',
  },
  moderate: {
    name: 'Moderate Plan',
    netZeroYear: 2045,
    renewablesTarget: 60,
    fleetElectrification: 80,
    supplierEngagement: 60,
    offsetReliance: 35,
    investmentLevel: 'low',
    riskLevel: 'low',
  },
};

const defaultHistoricalEmissions: EmissionsData[] = [
  { year: 2020, scope1: 35000, scope2: 48000, scope3: 85000, total: 168000 },
  { year: 2021, scope1: 34000, scope2: 45000, scope3: 82000, total: 161000 },
  { year: 2022, scope1: 32000, scope2: 42000, scope3: 80000, total: 154000 },
  { year: 2023, scope1: 30000, scope2: 38000, scope3: 78000, total: 146000 },
  { year: 2024, scope1: 28000, scope2: 34000, scope3: 75000, total: 137000 },
];

const defaultOffsets: CarbonOffset[] = [
  { id: '1', projectName: 'Reforestation Project', category: 'Forestry', credits: 5000, pricePerTon: 15.75, qualityScore: 85, vintage: '2023', selected: false },
  { id: '2', projectName: 'Solar Farm Initiative', category: 'Renewable Energy', credits: 3000, pricePerTon: 22.30, qualityScore: 92, vintage: '2024', selected: false },
  { id: '3', projectName: 'Methane Capture', category: 'Methane Reduction', credits: 4000, pricePerTon: 18.45, qualityScore: 78, vintage: '2023', selected: false },
];

const ClimateContext = createContext<ClimateContextValue | undefined>(undefined);

export const ClimateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ClimateState>({
    baselineYear: 2020,
    targetYear: 2040,
    selectedScenario: 'current',
    selectedScope: 'all',
    historicalEmissions: defaultHistoricalEmissions,
    currentEmissions: { scope1: 28000, scope2: 34000, scope3: 75000, total: 137000 },
    projectedEmissions: [],
    reductionLevers: defaultReductionLevers,
    milestones: defaultMilestones,
    selectedOffsets: defaultOffsets,
    totalOffsetsApplied: 0,
    scenarios: defaultScenarios,
    qualityScore: 90,
    verificationLevel: 3,
    standardsCompliance: [
      { standard: 'GHG Protocol', status: 'compliant' },
      { standard: 'SBTi', status: 'compliant' },
      { standard: 'ISO 14064', status: 'partial' },
      { standard: 'CDP', status: 'compliant' },
    ],
    insights: [],
    netZeroProjectedYear: 2040,
    totalReductionPercent: 18.5,
    offsetDependencyRisk: 'low',
    auditReadiness: 'ready',
    lastUpdated: new Date(),
  });

  // Calculate projected emissions based on scenario
  const calculateProjections = useCallback((scenario: ScenarioType) => {
    const config = state.scenarios[scenario];
    const baseline = state.historicalEmissions[0].total;
    const current = state.currentEmissions.total;
    const yearsToNetZero = config.netZeroYear - 2024;
    const annualReduction = current / yearsToNetZero;
    
    const projections: EmissionsData[] = [];
    for (let year = 2025; year <= config.netZeroYear; year++) {
      const yearsFromNow = year - 2024;
      const reductionFactor = 1 - (yearsFromNow / yearsToNetZero);
      const total = Math.max(0, current * reductionFactor);
      projections.push({
        year,
        scope1: total * 0.2,
        scope2: total * 0.25,
        scope3: total * 0.55,
        total,
      });
    }
    return projections;
  }, [state.scenarios, state.historicalEmissions, state.currentEmissions]);

  // Generate insights based on current state
  const generateInsights = useCallback((): ClimateInsight[] => {
    const insights: ClimateInsight[] = [];
    const config = state.scenarios[state.selectedScenario];
    
    // Net Zero progress insight
    const yearsAhead = 2050 - config.netZeroYear;
    if (yearsAhead > 0) {
      insights.push({
        id: '1',
        type: 'positive',
        message: `You are ${yearsAhead} years ahead of the global 2050 Net Zero target`,
        metric: 'Net Zero Timeline',
        delta: yearsAhead,
        source: 'Trajectory Analysis',
        timestamp: new Date(),
      });
    }

    // Scope 3 warning
    const scope3Ratio = state.currentEmissions.scope3 / state.currentEmissions.total;
    if (scope3Ratio > 0.5) {
      insights.push({
        id: '2',
        type: 'warning',
        message: `Scope 3 represents ${Math.round(scope3Ratio * 100)}% of emissions - this is your biggest reduction opportunity`,
        metric: 'Scope 3 Emissions',
        source: 'Emissions Analysis',
        timestamp: new Date(),
      });
    }

    // Offset risk
    if (config.offsetReliance > 20) {
      insights.push({
        id: '3',
        type: 'warning',
        message: `${state.selectedScenario === 'aggressive' ? 'Aggressive' : 'Current'} plan has ${config.offsetReliance}% offset reliance - consider increasing direct reductions`,
        metric: 'Offset Dependency',
        source: 'Risk Assessment',
        timestamp: new Date(),
      });
    }

    // Scenario comparison
    if (state.selectedScenario !== 'aggressive') {
      const currentConfig = state.scenarios[state.selectedScenario];
      const aggressiveConfig = state.scenarios.aggressive;
      const yearsSaved = currentConfig.netZeroYear - aggressiveConfig.netZeroYear;
      insights.push({
        id: '4',
        type: 'info',
        message: `Switching to Aggressive plan would achieve Net Zero ${yearsSaved} years earlier`,
        metric: 'Scenario Comparison',
        delta: yearsSaved,
        source: 'Scenario Engine',
        timestamp: new Date(),
      });
    }

    // Audit readiness
    const compliantCount = state.standardsCompliance.filter(s => s.status === 'compliant').length;
    if (compliantCount >= 3) {
      insights.push({
        id: '5',
        type: 'positive',
        message: 'Your Net Zero claim is audit-ready with strong standards compliance',
        metric: 'Audit Readiness',
        source: 'Compliance Check',
        timestamp: new Date(),
      });
    }

    return insights;
  }, [state.currentEmissions, state.scenarios, state.selectedScenario, state.standardsCompliance]);

  // Update milestones based on scenario
  const updateMilestonesForScenario = useCallback((scenario: ScenarioType): Milestone[] => {
    const config = state.scenarios[scenario];
    const baseYear = 2024;
    const netZeroYear = config.netZeroYear;
    const totalYears = netZeroYear - baseYear;
    
    return state.milestones.map(milestone => {
      if (milestone.status === 'completed') return milestone;
      
      // Adjust year based on scenario acceleration
      const yearOffset = milestone.year - 2024;
      const adjustedOffset = scenario === 'aggressive' 
        ? Math.floor(yearOffset * 0.7)
        : scenario === 'moderate' 
          ? Math.floor(yearOffset * 1.3)
          : yearOffset;
      
      const newYear = Math.min(2024 + adjustedOffset, netZeroYear);
      
      // Adjust offset dependency based on scenario
      const offsetMultiplier = scenario === 'aggressive' ? 1.5 : scenario === 'moderate' ? 2 : 1;
      
      return {
        ...milestone,
        year: milestone.year <= 2024 ? milestone.year : newYear,
        offsetDependency: Math.round((milestone.offsetDependency || 0) * offsetMultiplier),
      };
    });
  }, [state.milestones, state.scenarios]);

  // Actions
  const setSelectedScenario = useCallback((scenario: ScenarioType) => {
    setState(prev => {
      const newMilestones = updateMilestonesForScenario(scenario);
      const newProjections = calculateProjections(scenario);
      return {
        ...prev,
        selectedScenario: scenario,
        milestones: newMilestones,
        projectedEmissions: newProjections,
        netZeroProjectedYear: prev.scenarios[scenario].netZeroYear,
        insights: generateInsights(),
        lastUpdated: new Date(),
      };
    });
  }, [updateMilestonesForScenario, calculateProjections, generateInsights]);

  const setSelectedScope = useCallback((scope: ScopeType) => {
    setState(prev => ({
      ...prev,
      selectedScope: scope,
      lastUpdated: new Date(),
    }));
  }, []);

  const setTargetYear = useCallback((year: number) => {
    setState(prev => ({
      ...prev,
      targetYear: year,
      lastUpdated: new Date(),
    }));
  }, []);

  const toggleReductionLever = useCallback((leverId: string) => {
    setState(prev => {
      const newLevers = prev.reductionLevers.map(lever =>
        lever.id === leverId ? { ...lever, enabled: !lever.enabled } : lever
      );
      return {
        ...prev,
        reductionLevers: newLevers,
        lastUpdated: new Date(),
      };
    });
  }, []);

  const updateReductionLever = useCallback((leverId: string, value: number) => {
    setState(prev => {
      const newLevers = prev.reductionLevers.map(lever =>
        lever.id === leverId ? { ...lever, currentValue: value } : lever
      );
      return {
        ...prev,
        reductionLevers: newLevers,
        lastUpdated: new Date(),
      };
    });
  }, []);

  const selectOffset = useCallback((offsetId: string, selected: boolean) => {
    setState(prev => {
      const newOffsets = prev.selectedOffsets.map(offset =>
        offset.id === offsetId ? { ...offset, selected } : offset
      );
      const totalApplied = newOffsets.filter(o => o.selected).reduce((sum, o) => sum + o.credits, 0);
      
      // Calculate new quality score impact
      const selectedOffsets = newOffsets.filter(o => o.selected);
      const avgQuality = selectedOffsets.length > 0
        ? selectedOffsets.reduce((sum, o) => sum + o.qualityScore, 0) / selectedOffsets.length
        : 100;
      
      return {
        ...prev,
        selectedOffsets: newOffsets,
        totalOffsetsApplied: totalApplied,
        offsetDependencyRisk: totalApplied > 20000 ? 'high' : totalApplied > 10000 ? 'medium' : 'low',
        qualityScore: Math.round(90 * (avgQuality / 100)),
        lastUpdated: new Date(),
      };
    });
  }, []);

  const purchaseCredits = useCallback((offsetId: string, amount: number) => {
    setState(prev => {
      const newOffsets = prev.selectedOffsets.map(offset =>
        offset.id === offsetId ? { ...offset, credits: offset.credits + amount, selected: true } : offset
      );
      const totalApplied = newOffsets.filter(o => o.selected).reduce((sum, o) => sum + o.credits, 0);
      
      // Update current emissions (reduce residual)
      const reduction = Math.min(amount, prev.currentEmissions.total);
      
      return {
        ...prev,
        selectedOffsets: newOffsets,
        totalOffsetsApplied: totalApplied,
        currentEmissions: {
          ...prev.currentEmissions,
          total: prev.currentEmissions.total - reduction * 0.8, // Quality-weighted reduction
        },
        lastUpdated: new Date(),
      };
    });
  }, []);

  // Computed values
  const getProjectedNetZeroYear = useCallback(() => {
    return state.scenarios[state.selectedScenario].netZeroYear;
  }, [state.scenarios, state.selectedScenario]);

  const getScenarioDelta = useCallback((fromScenario: ScenarioType, toScenario: ScenarioType) => {
    const from = state.scenarios[fromScenario];
    const to = state.scenarios[toScenario];
    
    const yearsSaved = from.netZeroYear - to.netZeroYear;
    const costMultiplier = { low: 1, medium: 2, high: 3 };
    const costChange = (costMultiplier[to.investmentLevel] - costMultiplier[from.investmentLevel]) * 1000000;
    const emissionsReduced = yearsSaved * 5000; // Rough estimate
    
    return { yearsSaved, costChange, emissionsReduced };
  }, [state.scenarios]);

  const getMilestoneImpact = useCallback((milestoneYear: number) => {
    const milestone = state.milestones.find(m => m.year === milestoneYear);
    if (!milestone) {
      return { standards: [], confidence: 0, offsetRisk: 'unknown' };
    }
    
    const offsetRisk = (milestone.offsetDependency || 0) > 15 
      ? 'High offset dependency - consider alternatives'
      : (milestone.offsetDependency || 0) > 8 
        ? 'Moderate offset use - acceptable'
        : 'Low offset reliance - strong position';
    
    return {
      standards: milestone.standards || [],
      confidence: 100 - (milestone.offsetDependency || 0) * 2,
      offsetRisk,
    };
  }, [state.milestones]);

  const getExplainability = useCallback((metric: string): DataExplainability => {
    const explanations: Record<string, DataExplainability> = {
      'totalEmissions': {
        formula: 'Scope 1 + Scope 2 + Scope 3 = Total Emissions',
        dataSources: ['Internal Operations Data', 'Utility Bills', 'Supply Chain Reports'],
        lastUpdated: state.lastUpdated,
        confidence: 95,
      },
      'netZeroYear': {
        formula: 'Current Year + (Residual Emissions / Annual Reduction Rate)',
        dataSources: ['Emissions Trajectory Model', 'Reduction Project Pipeline'],
        lastUpdated: state.lastUpdated,
        confidence: 85,
      },
      'qualityScore': {
        formula: '(Carbon Accounting × 0.25) + (Additionality × 0.25) + (Permanence × 0.2) + (Verification × 0.3)',
        dataSources: ['Third-party Verification', 'Internal Audit', 'Registry Data'],
        lastUpdated: state.lastUpdated,
        confidence: 90,
      },
    };
    
    return explanations[metric] || {
      formula: 'Calculated from multiple data inputs',
      dataSources: ['Various Sources'],
      lastUpdated: state.lastUpdated,
      confidence: 80,
    };
  }, [state.lastUpdated]);

  const exportCurrentState = useCallback(() => {
    return {
      exportDate: new Date().toISOString(),
      scenario: state.selectedScenario,
      scopeFilter: state.selectedScope,
      targetYear: state.targetYear,
      currentEmissions: state.currentEmissions,
      netZeroProjectedYear: state.netZeroProjectedYear,
      milestones: state.milestones.filter(m => m.status !== 'completed'),
      selectedOffsets: state.selectedOffsets.filter(o => o.selected),
      qualityScore: state.qualityScore,
      insights: state.insights,
      standardsCompliance: state.standardsCompliance,
    };
  }, [state]);

  const value = useMemo<ClimateContextValue>(() => ({
    ...state,
    insights: generateInsights(),
    setSelectedScenario,
    setSelectedScope,
    setTargetYear,
    toggleReductionLever,
    updateReductionLever,
    selectOffset,
    purchaseCredits,
    getProjectedNetZeroYear,
    getScenarioDelta,
    getMilestoneImpact,
    getExplainability,
    exportCurrentState,
  }), [
    state,
    generateInsights,
    setSelectedScenario,
    setSelectedScope,
    setTargetYear,
    toggleReductionLever,
    updateReductionLever,
    selectOffset,
    purchaseCredits,
    getProjectedNetZeroYear,
    getScenarioDelta,
    getMilestoneImpact,
    getExplainability,
    exportCurrentState,
  ]);

  return (
    <ClimateContext.Provider value={value}>
      {children}
    </ClimateContext.Provider>
  );
};

export const useClimate = () => {
  const context = useContext(ClimateContext);
  if (!context) {
    throw new Error('useClimate must be used within a ClimateProvider');
  }
  return context;
};
