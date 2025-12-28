-- Climate Dashboard Data Tables

-- 1. Climate Settings - User preferences and configuration
CREATE TABLE public.climate_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  baseline_year INTEGER NOT NULL DEFAULT 2020,
  target_year INTEGER NOT NULL DEFAULT 2040,
  selected_scenario TEXT NOT NULL DEFAULT 'current',
  selected_scope TEXT NOT NULL DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- 2. Emissions Data - Historical and current emissions
CREATE TABLE public.emissions_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  scope1 NUMERIC NOT NULL DEFAULT 0,
  scope2 NUMERIC NOT NULL DEFAULT 0,
  scope3 NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  is_projected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, year, is_projected)
);

-- 3. Reduction Levers - Actions to reduce emissions
CREATE TABLE public.reduction_levers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lever_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  current_value NUMERIC NOT NULL DEFAULT 0,
  target_value NUMERIC NOT NULL DEFAULT 100,
  impact NUMERIC NOT NULL DEFAULT 0,
  cost NUMERIC NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lever_id)
);

-- 4. Milestones - Net Zero milestones
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  event TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  reduction_target NUMERIC DEFAULT 0,
  standards TEXT[] DEFAULT '{}',
  offset_dependency NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Carbon Offsets - Offset projects
CREATE TABLE public.carbon_offsets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  category TEXT NOT NULL,
  credits NUMERIC NOT NULL DEFAULT 0,
  price_per_ton NUMERIC NOT NULL DEFAULT 0,
  quality_score NUMERIC NOT NULL DEFAULT 0,
  vintage TEXT,
  selected BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Scenarios - Different reduction scenarios
CREATE TABLE public.scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_type TEXT NOT NULL,
  name TEXT NOT NULL,
  net_zero_year INTEGER NOT NULL,
  renewables_target NUMERIC NOT NULL DEFAULT 0,
  fleet_electrification NUMERIC NOT NULL DEFAULT 0,
  supplier_engagement NUMERIC NOT NULL DEFAULT 0,
  offset_reliance NUMERIC NOT NULL DEFAULT 0,
  investment_level TEXT NOT NULL DEFAULT 'medium',
  risk_level TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scenario_type)
);

-- 7. Standards Compliance - Compliance tracking
CREATE TABLE public.standards_compliance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  standard TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'non-compliant',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, standard)
);

-- Enable RLS on all tables
ALTER TABLE public.climate_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emissions_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reduction_levers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_offsets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standards_compliance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for climate_settings
CREATE POLICY "Users can view own settings" ON public.climate_settings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON public.climate_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.climate_settings FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own settings" ON public.climate_settings FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for emissions_data
CREATE POLICY "Users can view own emissions" ON public.emissions_data FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emissions" ON public.emissions_data FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own emissions" ON public.emissions_data FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own emissions" ON public.emissions_data FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for reduction_levers
CREATE POLICY "Users can view own levers" ON public.reduction_levers FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own levers" ON public.reduction_levers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own levers" ON public.reduction_levers FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own levers" ON public.reduction_levers FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for milestones
CREATE POLICY "Users can view own milestones" ON public.milestones FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own milestones" ON public.milestones FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own milestones" ON public.milestones FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own milestones" ON public.milestones FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for carbon_offsets
CREATE POLICY "Users can view own offsets" ON public.carbon_offsets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own offsets" ON public.carbon_offsets FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own offsets" ON public.carbon_offsets FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own offsets" ON public.carbon_offsets FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for scenarios
CREATE POLICY "Users can view own scenarios" ON public.scenarios FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scenarios" ON public.scenarios FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scenarios" ON public.scenarios FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scenarios" ON public.scenarios FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for standards_compliance
CREATE POLICY "Users can view own compliance" ON public.standards_compliance FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own compliance" ON public.standards_compliance FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own compliance" ON public.standards_compliance FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own compliance" ON public.standards_compliance FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_emissions_data_user_year ON public.emissions_data(user_id, year);
CREATE INDEX idx_reduction_levers_user ON public.reduction_levers(user_id);
CREATE INDEX idx_milestones_user ON public.milestones(user_id);
CREATE INDEX idx_carbon_offsets_user ON public.carbon_offsets(user_id);
CREATE INDEX idx_scenarios_user ON public.scenarios(user_id);

-- Update trigger function for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_climate_settings_updated_at BEFORE UPDATE ON public.climate_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_emissions_data_updated_at BEFORE UPDATE ON public.emissions_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reduction_levers_updated_at BEFORE UPDATE ON public.reduction_levers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_carbon_offsets_updated_at BEFORE UPDATE ON public.carbon_offsets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON public.scenarios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_standards_compliance_updated_at BEFORE UPDATE ON public.standards_compliance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();