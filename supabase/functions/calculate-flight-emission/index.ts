import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// IPCC 2006 Guidelines emission factor for Jet A fuel (kg CO₂ per kg fuel)
const EMISSION_FACTOR = 3.16;

// Radiative Forcing multiplier to account for non-CO₂ effects (IPCC)
const RADIATIVE_FORCING = 1.9;

// Aircraft fuel burn rates (kg fuel per km)
// Source: ICAO Aircraft Engine Emissions Databank & industry averages
const FUEL_BURN_RATES: Record<string, number> = {
  'A320': 2.7,
  'B737': 2.8,
  'B777': 5.8,
  'A350': 5.6,
  'E175': 1.8,
  'DEFAULT': 3.0,
};

/**
 * Helper function to estimate fuel consumption based on aircraft type and distance
 * @param aircraftType - ICAO aircraft type code
 * @param distanceKm - Flight distance in kilometers
 * @returns Estimated fuel consumption in kg
 */
function estimateFuelConsumption(aircraftType: string, distanceKm: number): number {
  const burnRate = FUEL_BURN_RATES[aircraftType.toUpperCase()] || FUEL_BURN_RATES['DEFAULT'];
  return distanceKm * burnRate;
}

/**
 * Calculate total CO₂e emissions for a flight
 * Formula: E_total = F × EF × RF
 * Where:
 * - F = fuel consumed (kg)
 * - EF = emission factor (3.16 kg CO₂/kg fuel)
 * - RF = radiative forcing multiplier (1.9)
 */
function calculateTotalEmissions(fuelConsumedKg: number): number {
  return fuelConsumedKg * EMISSION_FACTOR * RADIATIVE_FORCING;
}

/**
 * Calculate per-passenger emissions accounting for cargo weight
 * Formula: E_per_passenger = E_total / (passengers + cargoWeightKg/100)
 */
function calculatePerPassengerEmissions(
  totalEmissions: number,
  passengers: number,
  cargoWeightKg: number
): number {
  const effectivePassengers = passengers + (cargoWeightKg / 100);
  return totalEmissions / effectivePassengers;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { aircraftType, distanceKm, passengers, cargoWeightKg, fuelUsedKg } = body;

    // Input validation
    if (!aircraftType || typeof aircraftType !== 'string') {
      return new Response(
        JSON.stringify({ error: 'aircraftType is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!distanceKm || typeof distanceKm !== 'number' || distanceKm <= 0) {
      return new Response(
        JSON.stringify({ error: 'distanceKm is required and must be a positive number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!passengers || typeof passengers !== 'number' || passengers <= 0) {
      return new Response(
        JSON.stringify({ error: 'passengers is required and must be a positive number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cargo = cargoWeightKg || 0;
    if (typeof cargo !== 'number' || cargo < 0) {
      return new Response(
        JSON.stringify({ error: 'cargoWeightKg must be a non-negative number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 1: Calculate or use provided fuel consumption
    const fuelConsumed = fuelUsedKg || estimateFuelConsumption(aircraftType, distanceKm);
    
    console.log(`Flight calculation: ${aircraftType}, ${distanceKm}km, ${passengers} passengers, ${cargo}kg cargo`);
    console.log(`Fuel consumed: ${fuelConsumed.toFixed(2)}kg`);

    // Step 2: Calculate total emissions (including radiative forcing)
    const totalEmissions = calculateTotalEmissions(fuelConsumed);
    console.log(`Total emissions: ${totalEmissions.toFixed(2)}kg CO₂e`);

    // Step 3: Calculate per-passenger emissions
    const perPassengerEmissions = calculatePerPassengerEmissions(totalEmissions, passengers, cargo);
    console.log(`Per-passenger emissions: ${perPassengerEmissions.toFixed(2)}kg CO₂e`);

    // Step 4: Return response with rounded values
    const response = {
      aircraftType,
      distanceKm,
      fuelConsumedKg: Math.round(fuelConsumed * 100) / 100,
      totalEmissionKgCO2e: Math.round(totalEmissions * 100) / 100,
      emissionPerPassengerKgCO2e: Math.round(perPassengerEmissions * 100) / 100,
      calculationDetails: {
        emissionFactor: EMISSION_FACTOR,
        radiativeForcingMultiplier: RADIATIVE_FORCING,
        fuelBurnRateUsed: FUEL_BURN_RATES[aircraftType.toUpperCase()] || FUEL_BURN_RATES['DEFAULT'],
        passengers,
        cargoWeightKg: cargo,
      }
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in calculate-flight-emission:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
