import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FIRMSData {
  latitude: number;
  longitude: number;
  brightness: number;
  scan: number;
  track: number;
  acq_date: string;
  acq_time: string;
  satellite: string;
  confidence: string | number;
  version: string;
  bright_t31: number;
  frp: number;
  daynight: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('NASA_FIRMS_API_KEY');
    
    if (!apiKey) {
      console.error('NASA_FIRMS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'NASA FIRMS API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const days = url.searchParams.get('days') || '1';
    const source = url.searchParams.get('source') || 'VIIRS_SNPP_NRT';
    const area = url.searchParams.get('area') || 'world';

    console.log(`Fetching FIRMS data: source=${source}, days=${days}, area=${area}`);

    // NASA FIRMS API endpoint for CSV data
    // Format: https://firms.modaps.eosdis.nasa.gov/api/area/csv/{API_KEY}/{source}/{area}/{days}
    const firmsUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/${source}/${area}/${days}`;
    
    console.log(`Calling NASA FIRMS API...`);
    
    const response = await fetch(firmsUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`FIRMS API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `FIRMS API error: ${response.status}`, details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const csvText = await response.text();
    console.log(`Received ${csvText.length} bytes of CSV data`);

    // Parse CSV
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      console.log('No fire data found');
      return new Response(
        JSON.stringify({ fires: [], count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const headers = lines[0].split(',');
    const fires: FIRMSData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= headers.length) {
        const fire: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          const value = values[index];
          // Parse numeric fields
          if (['latitude', 'longitude', 'brightness', 'scan', 'track', 'bright_t31', 'frp'].includes(header)) {
            fire[header] = parseFloat(value) || 0;
          } else {
            fire[header] = value;
          }
        });
        fires.push(fire as unknown as FIRMSData);
      }
    }

    console.log(`Parsed ${fires.length} fire records`);

    // Limit response size for performance (take first 500 most intense fires)
    const sortedFires = fires
      .filter(f => f.latitude && f.longitude)
      .sort((a, b) => (b.frp || 0) - (a.frp || 0))
      .slice(0, 500);

    return new Response(
      JSON.stringify({ 
        fires: sortedFires, 
        count: fires.length,
        limited: fires.length > 500 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching FIRMS data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch fire data', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
