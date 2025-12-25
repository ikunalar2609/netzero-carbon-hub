-- Create a table for storing emission calculations
CREATE TABLE public.emission_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  calculation_type TEXT NOT NULL CHECK (calculation_type IN ('flight', 'vehicle', 'energy', 'diet')),
  input_data JSONB NOT NULL,
  result_data JSONB NOT NULL,
  total_emissions NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.emission_calculations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert calculations (public calculator)
CREATE POLICY "Anyone can insert calculations" 
ON public.emission_calculations 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to view calculations
CREATE POLICY "Anyone can view calculations" 
ON public.emission_calculations 
FOR SELECT 
USING (true);

-- Create index for faster queries by type and date
CREATE INDEX idx_emission_calculations_type ON public.emission_calculations(calculation_type);
CREATE INDEX idx_emission_calculations_created_at ON public.emission_calculations(created_at DESC);