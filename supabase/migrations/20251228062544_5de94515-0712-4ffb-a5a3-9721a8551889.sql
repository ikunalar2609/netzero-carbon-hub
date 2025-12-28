-- Add policy to allow deletion of calculations
CREATE POLICY "Anyone can delete calculations"
ON public.emission_calculations
FOR DELETE
USING (true);