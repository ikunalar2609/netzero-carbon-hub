-- Create table for forest cover GeoJSON data
CREATE TABLE public.forest_cover_regions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  coverage INTEGER NOT NULL DEFAULT 0,
  region TEXT NOT NULL,
  area_km2 INTEGER NOT NULL DEFAULT 0,
  coordinates JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for tree loss hotspots
CREATE TABLE public.tree_loss_hotspots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  loss_percentage DOUBLE PRECISION NOT NULL,
  loss_year TEXT NOT NULL,
  area TEXT NOT NULL,
  cause TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable public read access for both tables (no auth required for map data)
ALTER TABLE public.forest_cover_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tree_loss_hotspots ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Anyone can read forest cover regions" 
ON public.forest_cover_regions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can read tree loss hotspots" 
ON public.tree_loss_hotspots 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_forest_cover_region ON public.forest_cover_regions(region);
CREATE INDEX idx_tree_loss_region ON public.tree_loss_hotspots(region);
CREATE INDEX idx_tree_loss_percentage ON public.tree_loss_hotspots(loss_percentage DESC);