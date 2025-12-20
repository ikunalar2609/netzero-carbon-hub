import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Emission factors (DEFRA/ICAO) - kgCO₂ per passenger-km
const EMISSION_FACTORS = {
  shortHaul: 0.158,   // < 1500 km
  mediumHaul: 0.151,  // 1500-4000 km
  longHaul: 0.146     // > 4000 km
};

// Radiative forcing multiplier for non-CO₂ effects
const RF_MULTIPLIER = 1.9;

// Haversine formula to calculate great-circle distance
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get emission factor based on distance
function getEmissionFactor(distanceKm: number): { factor: number; category: string } {
  if (distanceKm < 1500) {
    return { factor: EMISSION_FACTORS.shortHaul, category: 'Short-haul' };
  } else if (distanceKm < 4000) {
    return { factor: EMISSION_FACTORS.mediumHaul, category: 'Medium-haul' };
  } else {
    return { factor: EMISSION_FACTORS.longHaul, category: 'Long-haul' };
  }
}

// Fetch airport data from Aviationstack API
async function fetchAirportData(iataCode: string, apiKey: string): Promise<{
  name: string;
  iata: string;
  icao: string;
  latitude: number;
  longitude: number;
} | null> {
  try {
    const url = `http://api.aviationstack.com/v1/airports?access_key=${apiKey}&search=${iataCode}`;
    console.log(`Fetching airport data for: ${iataCode}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`Aviationstack response for ${iataCode}:`, JSON.stringify(data).slice(0, 500));
    
    if (data.error) {
      console.error('Aviationstack API error:', data.error);
      return null;
    }
    
    if (!data.data || data.data.length === 0) {
      console.error(`No airport found for IATA code: ${iataCode}`);
      return null;
    }
    
    // Find exact match for IATA code
    const airport = data.data.find((a: any) => 
      a.iata_code?.toUpperCase() === iataCode.toUpperCase()
    ) || data.data[0];
    
    return {
      name: airport.airport_name || airport.name,
      iata: airport.iata_code,
      icao: airport.icao_code,
      latitude: parseFloat(airport.latitude),
      longitude: parseFloat(airport.longitude)
    };
  } catch (error) {
    console.error(`Error fetching airport data for ${iataCode}:`, error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { departureIata, arrivalIata, passengers = 1, includeRF = false } = await req.json();
    
    // Validate input
    if (!departureIata || !arrivalIata) {
      return new Response(
        JSON.stringify({ error: 'Both departure and arrival IATA codes are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const apiKey = Deno.env.get('AVIATIONSTACK_API_KEY');
    if (!apiKey) {
      console.error('AVIATIONSTACK_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing flight: ${departureIata} → ${arrivalIata}`);
    
    // Fetch airport data for both airports
    const [departureAirport, arrivalAirport] = await Promise.all([
      fetchAirportData(departureIata.toUpperCase(), apiKey),
      fetchAirportData(arrivalIata.toUpperCase(), apiKey)
    ]);
    
    if (!departureAirport) {
      return new Response(
        JSON.stringify({ error: `Departure airport not found: ${departureIata}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!arrivalAirport) {
      return new Response(
        JSON.stringify({ error: `Arrival airport not found: ${arrivalIata}` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Calculate distance using Haversine formula
    const distanceKm = calculateDistance(
      departureAirport.latitude,
      departureAirport.longitude,
      arrivalAirport.latitude,
      arrivalAirport.longitude
    );
    
    // Get emission factor based on distance
    const { factor, category } = getEmissionFactor(distanceKm);
    
    // Calculate CO₂ emissions per passenger
    const co2PerPassenger = distanceKm * factor;
    const totalCo2 = co2PerPassenger * passengers;
    
    // Calculate CO₂e with radiative forcing if enabled
    const co2ePerPassenger = includeRF ? co2PerPassenger * RF_MULTIPLIER : null;
    const totalCo2e = includeRF ? totalCo2 * RF_MULTIPLIER : null;
    
    console.log(`Calculated emissions: ${totalCo2.toFixed(2)} kg CO₂ for ${distanceKm.toFixed(0)} km`);
    
    const result = {
      success: true,
      route: {
        departure: {
          name: departureAirport.name,
          iata: departureAirport.iata,
          icao: departureAirport.icao,
          coordinates: {
            latitude: departureAirport.latitude,
            longitude: departureAirport.longitude
          }
        },
        arrival: {
          name: arrivalAirport.name,
          iata: arrivalAirport.iata,
          icao: arrivalAirport.icao,
          coordinates: {
            latitude: arrivalAirport.latitude,
            longitude: arrivalAirport.longitude
          }
        }
      },
      distance: {
        km: Math.round(distanceKm),
        miles: Math.round(distanceKm * 0.621371)
      },
      emissions: {
        category,
        emissionFactor: factor,
        co2PerPassenger: Math.round(co2PerPassenger * 100) / 100,
        totalCo2: Math.round(totalCo2 * 100) / 100,
        passengers,
        ...(includeRF && {
          rfMultiplier: RF_MULTIPLIER,
          co2ePerPassenger: Math.round(co2ePerPassenger! * 100) / 100,
          totalCo2e: Math.round(totalCo2e! * 100) / 100
        })
      },
      methodology: {
        distanceCalculation: 'Haversine formula (great-circle distance)',
        emissionFactors: 'DEFRA/ICAO standards',
        rfExplanation: includeRF 
          ? 'Includes non-CO₂ effects (contrails, NOx, water vapor) using 1.9x radiative forcing multiplier'
          : 'CO₂ only - toggle "Include non-CO₂ effects" for total climate impact'
      }
    };
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in flight-emissions function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
