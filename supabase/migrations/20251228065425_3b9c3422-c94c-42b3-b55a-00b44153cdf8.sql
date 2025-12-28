-- Add user_id column to emission_calculations for user ownership tracking
ALTER TABLE public.emission_calculations 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX idx_emission_calculations_user_id ON public.emission_calculations(user_id);

-- Drop existing permissive RLS policies
DROP POLICY IF EXISTS "Anyone can insert calculations" ON public.emission_calculations;
DROP POLICY IF EXISTS "Anyone can view calculations" ON public.emission_calculations;
DROP POLICY IF EXISTS "Anyone can delete calculations" ON public.emission_calculations;

-- Create user-scoped RLS policies for authenticated users
CREATE POLICY "Users can insert own calculations"
ON public.emission_calculations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own calculations"
ON public.emission_calculations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations"
ON public.emission_calculations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own calculations"
ON public.emission_calculations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);