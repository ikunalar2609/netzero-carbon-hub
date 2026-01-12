import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ForestCoverRegion {
  id: string;
  name: string;
  coverage: number;
  region: string;
  area_km2: number;
  coordinates: number[][][];
}

interface TreeLossHotspot {
  id: string;
  region: string;
  latitude: number;
  longitude: number;
  loss_percentage: number;
  loss_year: string;
  area: string;
  cause: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const dataType = url.searchParams.get("type") || "all";
    const regionFilter = url.searchParams.get("region");

    const response: {
      forestCover?: GeoJSON.FeatureCollection;
      treeLoss?: TreeLossHotspot[];
    } = {};

    // Fetch forest cover GeoJSON
    if (dataType === "all" || dataType === "forest") {
      let query = supabase.from("forest_cover_regions").select("*");
      
      if (regionFilter && regionFilter !== "all") {
        query = query.ilike("region", `%${regionFilter}%`);
      }

      const { data: forestData, error: forestError } = await query;

      if (forestError) {
        console.error("Forest cover fetch error:", forestError);
        throw forestError;
      }

      // Convert to GeoJSON FeatureCollection
      const features = (forestData || []).map((item: ForestCoverRegion) => ({
        type: "Feature" as const,
        properties: {
          name: item.name,
          coverage: item.coverage,
          region: item.region,
          area_km2: item.area_km2,
        },
        geometry: {
          type: "Polygon" as const,
          coordinates: item.coordinates,
        },
      }));

      response.forestCover = {
        type: "FeatureCollection",
        features,
      };
    }

    // Fetch tree loss hotspots
    if (dataType === "all" || dataType === "treeloss") {
      let query = supabase
        .from("tree_loss_hotspots")
        .select("*")
        .order("loss_percentage", { ascending: false });

      if (regionFilter && regionFilter !== "all") {
        query = query.ilike("region", `%${regionFilter}%`);
      }

      const { data: treeLossData, error: treeLossError } = await query;

      if (treeLossError) {
        console.error("Tree loss fetch error:", treeLossError);
        throw treeLossError;
      }

      response.treeLoss = treeLossData || [];
    }

    console.log(`Map data fetched: ${response.forestCover?.features?.length || 0} forest regions, ${response.treeLoss?.length || 0} tree loss hotspots`);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Map data error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch map data" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
