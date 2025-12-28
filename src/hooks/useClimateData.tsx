import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

// Types matching the database schema
export interface DbEmissionsData {
  id: string;
  user_id: string;
  year: number;
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  is_projected: boolean;
}

export interface DbReductionLever {
  id: string;
  user_id: string;
  lever_id: string;
  name: string;
  category: string;
  current_value: number;
  target_value: number;
  impact: number;
  cost: number;
  enabled: boolean;
}

export interface DbMilestone {
  id: string;
  user_id: string;
  year: number;
  event: string;
  status: string;
  reduction_target: number;
  standards: string[];
  offset_dependency: number;
}

export interface DbCarbonOffset {
  id: string;
  user_id: string;
  project_name: string;
  category: string;
  credits: number;
  price_per_ton: number;
  quality_score: number;
  vintage: string;
  selected: boolean;
}

export interface DbScenario {
  id: string;
  user_id: string;
  scenario_type: string;
  name: string;
  net_zero_year: number;
  renewables_target: number;
  fleet_electrification: number;
  supplier_engagement: number;
  offset_reliance: number;
  investment_level: string;
  risk_level: string;
}

export interface DbClimateSettings {
  id: string;
  user_id: string;
  baseline_year: number;
  target_year: number;
  selected_scenario: string;
  selected_scope: string;
}

export interface DbStandardsCompliance {
  id: string;
  user_id: string;
  standard: string;
  status: string;
}

// Default data for new users
const defaultEmissionsData = [
  { year: 2020, scope1: 35000, scope2: 48000, scope3: 85000, total: 168000, is_projected: false },
  { year: 2021, scope1: 34000, scope2: 45000, scope3: 82000, total: 161000, is_projected: false },
  { year: 2022, scope1: 32000, scope2: 42000, scope3: 80000, total: 154000, is_projected: false },
  { year: 2023, scope1: 30000, scope2: 38000, scope3: 78000, total: 146000, is_projected: false },
  { year: 2024, scope1: 28000, scope2: 34000, scope3: 75000, total: 137000, is_projected: false },
];

const defaultReductionLevers = [
  { lever_id: 'renewables', name: 'Renewable Energy', category: 'renewables', current_value: 72, target_value: 100, impact: 28000, cost: 2500000, enabled: true },
  { lever_id: 'fleet', name: 'Fleet Electrification', category: 'fleet', current_value: 50, target_value: 100, impact: 15000, cost: 1800000, enabled: true },
  { lever_id: 'suppliers', name: 'Supplier Engagement', category: 'suppliers', current_value: 58, target_value: 80, impact: 35000, cost: 500000, enabled: true },
  { lever_id: 'efficiency', name: 'Energy Efficiency', category: 'efficiency', current_value: 65, target_value: 90, impact: 12000, cost: 800000, enabled: true },
  { lever_id: 'offsets', name: 'Carbon Offsets', category: 'offsets', current_value: 10, target_value: 30, impact: 20000, cost: 600000, enabled: false },
];

const defaultMilestones = [
  { year: 2020, event: 'Baseline Assessment', status: 'completed', reduction_target: 0, standards: ['GHG Protocol'], offset_dependency: 0 },
  { year: 2022, event: '25% Renewable Energy', status: 'completed', reduction_target: 10, standards: ['GHG Protocol', 'ISO 14064'], offset_dependency: 0 },
  { year: 2023, event: '50% Electric Fleet', status: 'completed', reduction_target: 15, standards: ['SBTi'], offset_dependency: 5 },
  { year: 2024, event: '75% Supplier Engagement', status: 'inProgress', reduction_target: 20, standards: ['GHG Protocol', 'CDP'], offset_dependency: 8 },
  { year: 2025, event: '30% Emissions Reduction', status: 'planned', reduction_target: 30, standards: ['SBTi', 'ISO 14064'], offset_dependency: 10 },
  { year: 2030, event: '80% Emissions Reduction', status: 'planned', reduction_target: 80, standards: ['SBTi', 'Net Zero Standard'], offset_dependency: 18 },
  { year: 2040, event: 'Net Zero Achievement', status: 'planned', reduction_target: 100, standards: ['Net Zero Standard', 'SBTi'], offset_dependency: 5 },
];

const defaultScenarios = [
  { scenario_type: 'current', name: 'Current Plan', net_zero_year: 2040, renewables_target: 80, fleet_electrification: 100, supplier_engagement: 75, offset_reliance: 15, investment_level: 'medium', risk_level: 'medium' },
  { scenario_type: 'aggressive', name: 'Aggressive Plan', net_zero_year: 2035, renewables_target: 100, fleet_electrification: 100, supplier_engagement: 90, offset_reliance: 25, investment_level: 'high', risk_level: 'high' },
  { scenario_type: 'moderate', name: 'Moderate Plan', net_zero_year: 2045, renewables_target: 60, fleet_electrification: 80, supplier_engagement: 60, offset_reliance: 35, investment_level: 'low', risk_level: 'low' },
];

const defaultOffsets = [
  { project_name: 'Reforestation Project', category: 'Forestry', credits: 5000, price_per_ton: 15.75, quality_score: 85, vintage: '2023', selected: false },
  { project_name: 'Solar Farm Initiative', category: 'Renewable Energy', credits: 3000, price_per_ton: 22.30, quality_score: 92, vintage: '2024', selected: false },
  { project_name: 'Methane Capture', category: 'Methane Reduction', credits: 4000, price_per_ton: 18.45, quality_score: 78, vintage: '2023', selected: false },
];

const defaultCompliance = [
  { standard: 'GHG Protocol', status: 'compliant' },
  { standard: 'SBTi', status: 'compliant' },
  { standard: 'ISO 14064', status: 'partial' },
  { standard: 'CDP', status: 'compliant' },
];

export const useClimateData = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Data states
  const [settings, setSettings] = useState<DbClimateSettings | null>(null);
  const [emissionsData, setEmissionsData] = useState<DbEmissionsData[]>([]);
  const [reductionLevers, setReductionLevers] = useState<DbReductionLever[]>([]);
  const [milestones, setMilestones] = useState<DbMilestone[]>([]);
  const [offsets, setOffsets] = useState<DbCarbonOffset[]>([]);
  const [scenarios, setScenarios] = useState<DbScenario[]>([]);
  const [compliance, setCompliance] = useState<DbStandardsCompliance[]>([]);

  // Initialize default data for new user
  const initializeUserData = useCallback(async (userId: string) => {
    try {
      // Create settings
      await supabase.from('climate_settings').insert({
        user_id: userId,
        baseline_year: 2020,
        target_year: 2040,
        selected_scenario: 'current',
        selected_scope: 'all',
      });

      // Create emissions data
      for (const emission of defaultEmissionsData) {
        await supabase.from('emissions_data').insert({
          user_id: userId,
          ...emission,
        });
      }

      // Create reduction levers
      for (const lever of defaultReductionLevers) {
        await supabase.from('reduction_levers').insert({
          user_id: userId,
          ...lever,
        });
      }

      // Create milestones
      for (const milestone of defaultMilestones) {
        await supabase.from('milestones').insert({
          user_id: userId,
          ...milestone,
        });
      }

      // Create scenarios
      for (const scenario of defaultScenarios) {
        await supabase.from('scenarios').insert({
          user_id: userId,
          ...scenario,
        });
      }

      // Create offsets
      for (const offset of defaultOffsets) {
        await supabase.from('carbon_offsets').insert({
          user_id: userId,
          ...offset,
        });
      }

      // Create compliance
      for (const comp of defaultCompliance) {
        await supabase.from('standards_compliance').insert({
          user_id: userId,
          ...comp,
        });
      }

      return true;
    } catch (error) {
      console.error('Error initializing user data:', error);
      return false;
    }
  }, []);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Fetch settings
      const { data: settingsData } = await supabase
        .from('climate_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // If no settings, initialize default data
      if (!settingsData) {
        await initializeUserData(user.id);
        // Refetch after initialization
        const { data: newSettings } = await supabase
          .from('climate_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        setSettings(newSettings);
      } else {
        setSettings(settingsData);
      }

      // Fetch emissions
      const { data: emissions } = await supabase
        .from('emissions_data')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: true });
      setEmissionsData(emissions || []);

      // Fetch levers
      const { data: levers } = await supabase
        .from('reduction_levers')
        .select('*')
        .eq('user_id', user.id);
      setReductionLevers(levers || []);

      // Fetch milestones
      const { data: milestonesData } = await supabase
        .from('milestones')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: true });
      setMilestones(milestonesData || []);

      // Fetch scenarios
      const { data: scenariosData } = await supabase
        .from('scenarios')
        .select('*')
        .eq('user_id', user.id);
      setScenarios(scenariosData || []);

      // Fetch offsets
      const { data: offsetsData } = await supabase
        .from('carbon_offsets')
        .select('*')
        .eq('user_id', user.id);
      setOffsets(offsetsData || []);

      // Fetch compliance
      const { data: complianceData } = await supabase
        .from('standards_compliance')
        .select('*')
        .eq('user_id', user.id);
      setCompliance(complianceData || []);

      setInitialized(true);
    } catch (error) {
      console.error('Error fetching climate data:', error);
      toast.error('Failed to load climate data');
    } finally {
      setLoading(false);
    }
  }, [user?.id, initializeUserData]);

  // Update functions
  const updateSettings = useCallback(async (updates: Partial<DbClimateSettings>) => {
    if (!user?.id || !settings) return;
    
    const { error } = await supabase
      .from('climate_settings')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      toast.error('Failed to update settings');
      return;
    }
    
    setSettings(prev => prev ? { ...prev, ...updates } : null);
  }, [user?.id, settings]);

  const updateEmission = useCallback(async (year: number, updates: Partial<DbEmissionsData>) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('emissions_data')
      .update(updates)
      .eq('user_id', user.id)
      .eq('year', year);

    if (error) {
      toast.error('Failed to update emissions');
      return;
    }
    
    setEmissionsData(prev => prev.map(e => e.year === year ? { ...e, ...updates } : e));
  }, [user?.id]);

  const addEmission = useCallback(async (data: Omit<DbEmissionsData, 'id' | 'user_id'>) => {
    if (!user?.id) return;
    
    const { data: newData, error } = await supabase
      .from('emissions_data')
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add emission data');
      return;
    }
    
    setEmissionsData(prev => [...prev, newData].sort((a, b) => a.year - b.year));
    toast.success('Emission data added');
  }, [user?.id]);

  const updateLever = useCallback(async (leverId: string, updates: Partial<DbReductionLever>) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('reduction_levers')
      .update(updates)
      .eq('user_id', user.id)
      .eq('lever_id', leverId);

    if (error) {
      toast.error('Failed to update lever');
      return;
    }
    
    setReductionLevers(prev => prev.map(l => l.lever_id === leverId ? { ...l, ...updates } : l));
  }, [user?.id]);

  const updateMilestone = useCallback(async (milestoneId: string, updates: Partial<DbMilestone>) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('milestones')
      .update(updates)
      .eq('id', milestoneId);

    if (error) {
      toast.error('Failed to update milestone');
      return;
    }
    
    setMilestones(prev => prev.map(m => m.id === milestoneId ? { ...m, ...updates } : m));
  }, [user?.id]);

  const addMilestone = useCallback(async (data: Omit<DbMilestone, 'id' | 'user_id'>) => {
    if (!user?.id) return;
    
    const { data: newData, error } = await supabase
      .from('milestones')
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add milestone');
      return;
    }
    
    setMilestones(prev => [...prev, newData].sort((a, b) => a.year - b.year));
    toast.success('Milestone added');
  }, [user?.id]);

  const updateOffset = useCallback(async (offsetId: string, updates: Partial<DbCarbonOffset>) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('carbon_offsets')
      .update(updates)
      .eq('id', offsetId);

    if (error) {
      toast.error('Failed to update offset');
      return;
    }
    
    setOffsets(prev => prev.map(o => o.id === offsetId ? { ...o, ...updates } : o));
  }, [user?.id]);

  const addOffset = useCallback(async (data: Omit<DbCarbonOffset, 'id' | 'user_id'>) => {
    if (!user?.id) return;
    
    const { data: newData, error } = await supabase
      .from('carbon_offsets')
      .insert({ ...data, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add offset');
      return;
    }
    
    setOffsets(prev => [...prev, newData]);
    toast.success('Carbon offset added');
  }, [user?.id]);

  const updateScenario = useCallback(async (scenarioType: string, updates: Partial<DbScenario>) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('scenarios')
      .update(updates)
      .eq('user_id', user.id)
      .eq('scenario_type', scenarioType);

    if (error) {
      toast.error('Failed to update scenario');
      return;
    }
    
    setScenarios(prev => prev.map(s => s.scenario_type === scenarioType ? { ...s, ...updates } : s));
  }, [user?.id]);

  const updateCompliance = useCallback(async (standard: string, status: string) => {
    if (!user?.id) return;
    
    const { error } = await supabase
      .from('standards_compliance')
      .update({ status })
      .eq('user_id', user.id)
      .eq('standard', standard);

    if (error) {
      toast.error('Failed to update compliance');
      return;
    }
    
    setCompliance(prev => prev.map(c => c.standard === standard ? { ...c, status } : c));
  }, [user?.id]);

  // Fetch data when user changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id, fetchAllData]);

  return {
    loading,
    initialized,
    settings,
    emissionsData,
    reductionLevers,
    milestones,
    offsets,
    scenarios,
    compliance,
    // Actions
    fetchAllData,
    updateSettings,
    updateEmission,
    addEmission,
    updateLever,
    updateMilestone,
    addMilestone,
    updateOffset,
    addOffset,
    updateScenario,
    updateCompliance,
  };
};
