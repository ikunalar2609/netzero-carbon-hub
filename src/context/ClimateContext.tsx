import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import { useClimateData, DbEmissionsData, DbReductionLever, DbMilestone, DbCarbonOffset, DbScenario, DbStandardsCompliance } from '@/hooks/useClimateData';

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
  id?: string;
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
  impact: number;
  cost: number;
  enabled: boolean;
}

export interface CarbonOffset {
  id: string;
  projectName: string;
  category: string;
  credits: number;
  pricePerTon: number;
  qualityScore: number;
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
  baselineYear: number;
  targetYear: number;
  selectedScenario: ScenarioType;
  selectedScope: ScopeType;
  historicalEmissions: EmissionsData[];
  currentEmissions: { scope1: number; scope2: number; scope3: number; total: number };
  projectedEmissions: EmissionsData[];
  reductionLevers: ReductionLever[];
  milestones: Milestone[];
  selectedOffsets: CarbonOffset[];
  totalOffsetsApplied: number;
  scenarios: Record<ScenarioType, ScenarioConfig>;
  qualityScore: number;
  verificationLevel: number;
  standardsCompliance: { standard: string; status: 'compliant' | 'partial' | 'non-compliant' }[];
  insights: ClimateInsight[];
  netZeroProjectedYear: number;
  totalReductionPercent: number;
  offsetDependencyRisk: 'low' | 'medium' | 'high';
  auditReadiness: 'ready' | 'partial' | 'not-ready';
  lastUpdated: Date;
  loading: boolean;
  initialized: boolean;
}

interface ClimateContextValue extends ClimateState {
  setSelectedScenario: (scenario: ScenarioType) => void;
  setSelectedScope: (scope: ScopeType) => void;
  setTargetYear: (year: number) => void;
  toggleReductionLever: (leverId: string) => void;
  updateReductionLever: (leverId: string, value: number) => void;
  selectOffset: (offsetId: string, selected: boolean) => void;
  purchaseCredits: (offsetId: string, amount: number) => void;
  addEmissionData: (data: Omit<EmissionsData, 'total'> & { total?: number }) => Promise<void>;
  addMilestoneData: (data: Omit<Milestone, 'id'>) => Promise<void>;
  addOffsetData: (data: Omit<CarbonOffset, 'id'>) => Promise<void>;
  refreshData: () => Promise<void>;
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
  exportCurrentState: () => object;
}

// Transformation functions
const transformEmissions = (dbData: DbEmissionsData[]): EmissionsData[] => {
  return dbData.map(e => ({
    year: e.year,
    scope1: Number(e.scope1),
    scope2: Number(e.scope2),
    scope3: Number(e.scope3),
    total: Number(e.total),
  }));
};

const transformLevers = (dbData: DbReductionLever[]): ReductionLever[] => {
  return dbData.map(l => ({
    id: l.lever_id,
    name: l.name,
    category: l.category as ReductionLever['category'],
    currentValue: Number(l.current_value),
    targetValue: Number(l.target_value),
    impact: Number(l.impact),
    cost: Number(l.cost),
    enabled: l.enabled,
  }));
};

const transformMilestones = (dbData: DbMilestone[]): Milestone[] => {
  return dbData.map(m => ({
    id: m.id,
    year: m.year,
    event: m.event,
    status: m.status as Milestone['status'],
    reductionTarget: Number(m.reduction_target),
    standards: m.standards,
    offsetDependency: Number(m.offset_dependency),
  }));
};

const transformOffsets = (dbData: DbCarbonOffset[]): CarbonOffset[] => {
  return dbData.map(o => ({
    id: o.id,
    projectName: o.project_name,
    category: o.category,
    credits: Number(o.credits),
    pricePerTon: Number(o.price_per_ton),
    qualityScore: Number(o.quality_score),
    vintage: o.vintage,
    selected: o.selected,
  }));
};

const transformScenarios = (dbData: DbScenario[]): Record<ScenarioType, ScenarioConfig> => {
  const result: Record<ScenarioType, ScenarioConfig> = {
    current: { name: 'Current Plan', netZeroYear: 2040, renewablesTarget: 80, fleetElectrification: 100, supplierEngagement: 75, offsetReliance: 15, investmentLevel: 'medium', riskLevel: 'medium' },
    aggressive: { name: 'Aggressive Plan', netZeroYear: 2035, renewablesTarget: 100, fleetElectrification: 100, supplierEngagement: 90, offsetReliance: 25, investmentLevel: 'high', riskLevel: 'high' },
    moderate: { name: 'Moderate Plan', netZeroYear: 2045, renewablesTarget: 60, fleetElectrification: 80, supplierEngagement: 60, offsetReliance: 35, investmentLevel: 'low', riskLevel: 'low' },
  };
  
  dbData.forEach(s => {
    if (s.scenario_type in result) {
      result[s.scenario_type as ScenarioType] = {
        name: s.name,
        netZeroYear: s.net_zero_year,
        renewablesTarget: Number(s.renewables_target),
        fleetElectrification: Number(s.fleet_electrification),
        supplierEngagement: Number(s.supplier_engagement),
        offsetReliance: Number(s.offset_reliance),
        investmentLevel: s.investment_level as ScenarioConfig['investmentLevel'],
        riskLevel: s.risk_level as ScenarioConfig['riskLevel'],
      };
    }
  });
  
  return result;
};

const transformCompliance = (dbData: DbStandardsCompliance[]): { standard: string; status: 'compliant' | 'partial' | 'non-compliant' }[] => {
  return dbData.map(c => ({
    standard: c.standard,
    status: c.status as 'compliant' | 'partial' | 'non-compliant',
  }));
};

const ClimateContext = createContext<ClimateContextValue | undefined>(undefined);

export const ClimateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    loading,
    initialized,
    settings,
    emissionsData,
    reductionLevers: dbLevers,
    milestones: dbMilestones,
    offsets: dbOffsets,
    scenarios: dbScenarios,
    compliance: dbCompliance,
    fetchAllData,
    updateSettings,
    updateLever,
    updateOffset,
    addEmission,
    addMilestone,
    addOffset,
  } = useClimateData();

  const [localState, setLocalState] = useState<{
    projectedEmissions: EmissionsData[];
    insights: ClimateInsight[];
    totalOffsetsApplied: number;
    qualityScore: number;
    offsetDependencyRisk: 'low' | 'medium' | 'high';
  }>({
    projectedEmissions: [] as EmissionsData[],
    insights: [] as ClimateInsight[],
    totalOffsetsApplied: 0,
    qualityScore: 90,
    offsetDependencyRisk: 'low',
  });

  // Transform database data to app format
  const historicalEmissions = useMemo(() => 
    transformEmissions(emissionsData.filter(e => !e.is_projected)), 
    [emissionsData]
  );
  
  const reductionLevers = useMemo(() => transformLevers(dbLevers), [dbLevers]);
  const milestones = useMemo(() => transformMilestones(dbMilestones), [dbMilestones]);
  const selectedOffsets = useMemo(() => transformOffsets(dbOffsets), [dbOffsets]);
  const scenarios = useMemo(() => transformScenarios(dbScenarios), [dbScenarios]);
  const standardsCompliance = useMemo(() => transformCompliance(dbCompliance), [dbCompliance]);

  const currentEmissions = useMemo(() => {
    const latestYear = historicalEmissions.reduce((max, e) => e.year > max.year ? e : max, historicalEmissions[0] || { year: 0, scope1: 0, scope2: 0, scope3: 0, total: 0 });
    return {
      scope1: latestYear?.scope1 || 0,
      scope2: latestYear?.scope2 || 0,
      scope3: latestYear?.scope3 || 0,
      total: latestYear?.total || 0,
    };
  }, [historicalEmissions]);

  const baselineYear = settings?.baseline_year || 2020;
  const targetYear = settings?.target_year || 2040;
  const selectedScenario = (settings?.selected_scenario || 'current') as ScenarioType;
  const selectedScope = (settings?.selected_scope || 'all') as ScopeType;

  // Calculate derived values
  const baselineEmissions = useMemo(() => {
    const baseline = historicalEmissions.find(e => e.year === baselineYear);
    return baseline?.total || 168000;
  }, [historicalEmissions, baselineYear]);

  const totalReductionPercent = useMemo(() => {
    if (baselineEmissions === 0) return 0;
    return ((baselineEmissions - currentEmissions.total) / baselineEmissions) * 100;
  }, [baselineEmissions, currentEmissions.total]);

  const netZeroProjectedYear = scenarios[selectedScenario]?.netZeroYear || 2040;

  // Generate insights
  const generateInsights = useCallback((): ClimateInsight[] => {
    const insights: ClimateInsight[] = [];
    const config = scenarios[selectedScenario];
    
    if (!config) return insights;

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

    const scope3Ratio = currentEmissions.total > 0 ? currentEmissions.scope3 / currentEmissions.total : 0;
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

    if (config.offsetReliance > 20) {
      insights.push({
        id: '3',
        type: 'warning',
        message: `${selectedScenario === 'aggressive' ? 'Aggressive' : 'Current'} plan has ${config.offsetReliance}% offset reliance - consider increasing direct reductions`,
        metric: 'Offset Dependency',
        source: 'Risk Assessment',
        timestamp: new Date(),
      });
    }

    return insights;
  }, [scenarios, selectedScenario, currentEmissions]);

  const insights = useMemo(() => generateInsights(), [generateInsights]);

  // Actions
  const setSelectedScenario = useCallback((scenario: ScenarioType) => {
    updateSettings({ selected_scenario: scenario });
  }, [updateSettings]);

  const setSelectedScope = useCallback((scope: ScopeType) => {
    updateSettings({ selected_scope: scope });
  }, [updateSettings]);

  const setTargetYear = useCallback((year: number) => {
    updateSettings({ target_year: year });
  }, [updateSettings]);

  const toggleReductionLever = useCallback((leverId: string) => {
    const lever = reductionLevers.find(l => l.id === leverId);
    if (lever) {
      updateLever(leverId, { enabled: !lever.enabled });
    }
  }, [reductionLevers, updateLever]);

  const updateReductionLeverValue = useCallback((leverId: string, value: number) => {
    updateLever(leverId, { current_value: value });
  }, [updateLever]);

  const selectOffset = useCallback((offsetId: string, selected: boolean) => {
    updateOffset(offsetId, { selected });
  }, [updateOffset]);

  const purchaseCredits = useCallback((offsetId: string, amount: number) => {
    const offset = selectedOffsets.find(o => o.id === offsetId);
    if (offset) {
      updateOffset(offsetId, { credits: offset.credits + amount, selected: true });
    }
  }, [selectedOffsets, updateOffset]);

  const addEmissionData = useCallback(async (data: Omit<EmissionsData, 'total'> & { total?: number }) => {
    const total = data.total ?? (data.scope1 + data.scope2 + data.scope3);
    await addEmission({
      year: data.year,
      scope1: data.scope1,
      scope2: data.scope2,
      scope3: data.scope3,
      total,
      is_projected: false,
    });
  }, [addEmission]);

  const addMilestoneData = useCallback(async (data: Omit<Milestone, 'id'>) => {
    await addMilestone({
      year: data.year,
      event: data.event,
      status: data.status,
      reduction_target: data.reductionTarget || 0,
      standards: data.standards || [],
      offset_dependency: data.offsetDependency || 0,
    });
  }, [addMilestone]);

  const addOffsetData = useCallback(async (data: Omit<CarbonOffset, 'id'>) => {
    await addOffset({
      project_name: data.projectName,
      category: data.category,
      credits: data.credits,
      price_per_ton: data.pricePerTon,
      quality_score: data.qualityScore,
      vintage: data.vintage,
      selected: data.selected,
    });
  }, [addOffset]);

  const refreshData = useCallback(async () => {
    await fetchAllData();
  }, [fetchAllData]);

  // Computed value getters
  const getProjectedNetZeroYear = useCallback(() => {
    return scenarios[selectedScenario]?.netZeroYear || 2040;
  }, [scenarios, selectedScenario]);

  const getScenarioDelta = useCallback((fromScenario: ScenarioType, toScenario: ScenarioType) => {
    const from = scenarios[fromScenario];
    const to = scenarios[toScenario];
    
    if (!from || !to) return { yearsSaved: 0, costChange: 0, emissionsReduced: 0 };
    
    const yearsSaved = from.netZeroYear - to.netZeroYear;
    const costMultiplier = { low: 1, medium: 2, high: 3 };
    const costChange = (costMultiplier[to.investmentLevel] - costMultiplier[from.investmentLevel]) * 1000000;
    const emissionsReduced = yearsSaved * 5000;
    
    return { yearsSaved, costChange, emissionsReduced };
  }, [scenarios]);

  const getMilestoneImpact = useCallback((milestoneYear: number) => {
    const milestone = milestones.find(m => m.year === milestoneYear);
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
  }, [milestones]);

  const getExplainability = useCallback((metric: string): DataExplainability => {
    const now = new Date();
    const explanations: Record<string, DataExplainability> = {
      'totalEmissions': {
        formula: 'Scope 1 + Scope 2 + Scope 3 = Total Emissions',
        dataSources: ['Internal Operations Data', 'Utility Bills', 'Supply Chain Reports'],
        lastUpdated: now,
        confidence: 95,
      },
      'netZeroYear': {
        formula: 'Current Year + (Residual Emissions / Annual Reduction Rate)',
        dataSources: ['Emissions Trajectory Model', 'Reduction Project Pipeline'],
        lastUpdated: now,
        confidence: 85,
      },
      'qualityScore': {
        formula: '(Carbon Accounting × 0.25) + (Additionality × 0.25) + (Permanence × 0.2) + (Verification × 0.3)',
        dataSources: ['Third-party Verification', 'Internal Audit', 'Registry Data'],
        lastUpdated: now,
        confidence: 90,
      },
    };
    
    return explanations[metric] || {
      formula: 'Calculated from multiple data inputs',
      dataSources: ['Various Sources'],
      lastUpdated: now,
      confidence: 80,
    };
  }, []);

  const exportCurrentState = useCallback(() => {
    return {
      exportDate: new Date().toISOString(),
      scenario: selectedScenario,
      scopeFilter: selectedScope,
      targetYear,
      currentEmissions,
      netZeroProjectedYear,
      milestones: milestones.filter(m => m.status !== 'completed'),
      selectedOffsets: selectedOffsets.filter(o => o.selected),
      qualityScore: localState.qualityScore,
      insights,
      standardsCompliance,
    };
  }, [selectedScenario, selectedScope, targetYear, currentEmissions, netZeroProjectedYear, milestones, selectedOffsets, localState.qualityScore, insights, standardsCompliance]);

  // Calculate total offsets
  useEffect(() => {
    const totalApplied = selectedOffsets.filter(o => o.selected).reduce((sum, o) => sum + o.credits, 0);
    const selectedOffsetsFiltered = selectedOffsets.filter(o => o.selected);
    const avgQuality = selectedOffsetsFiltered.length > 0
      ? selectedOffsetsFiltered.reduce((sum, o) => sum + o.qualityScore, 0) / selectedOffsetsFiltered.length
      : 100;

    setLocalState(prev => ({
      ...prev,
      totalOffsetsApplied: totalApplied,
      qualityScore: Math.round(90 * (avgQuality / 100)),
      offsetDependencyRisk: totalApplied > 20000 ? 'high' : totalApplied > 10000 ? 'medium' : 'low',
    }));
  }, [selectedOffsets]);

  const value = useMemo<ClimateContextValue>(() => ({
    loading,
    initialized,
    baselineYear,
    targetYear,
    selectedScenario,
    selectedScope,
    historicalEmissions,
    currentEmissions,
    projectedEmissions: localState.projectedEmissions,
    reductionLevers,
    milestones,
    selectedOffsets,
    totalOffsetsApplied: localState.totalOffsetsApplied,
    scenarios,
    qualityScore: localState.qualityScore,
    verificationLevel: 3,
    standardsCompliance,
    insights,
    netZeroProjectedYear,
    totalReductionPercent,
    offsetDependencyRisk: localState.offsetDependencyRisk,
    auditReadiness: 'ready',
    lastUpdated: new Date(),
    // Actions
    setSelectedScenario,
    setSelectedScope,
    setTargetYear,
    toggleReductionLever,
    updateReductionLever: updateReductionLeverValue,
    selectOffset,
    purchaseCredits,
    addEmissionData,
    addMilestoneData,
    addOffsetData,
    refreshData,
    getProjectedNetZeroYear,
    getScenarioDelta,
    getMilestoneImpact,
    getExplainability,
    exportCurrentState,
  }), [
    loading, initialized, baselineYear, targetYear, selectedScenario, selectedScope,
    historicalEmissions, currentEmissions, localState, reductionLevers, milestones,
    selectedOffsets, scenarios, standardsCompliance, insights, netZeroProjectedYear,
    totalReductionPercent, setSelectedScenario, setSelectedScope, setTargetYear,
    toggleReductionLever, updateReductionLeverValue, selectOffset, purchaseCredits,
    addEmissionData, addMilestoneData, addOffsetData, refreshData,
    getProjectedNetZeroYear, getScenarioDelta, getMilestoneImpact, getExplainability,
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
