import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Major airports database with coordinates
const AIRPORTS: Record<string, { name: string; city: string; country: string; lat: number; lon: number }> = {
  // North America
  "JFK": { name: "John F. Kennedy International", city: "New York", country: "USA", lat: 40.6413, lon: -73.7781 },
  "LAX": { name: "Los Angeles International", city: "Los Angeles", country: "USA", lat: 33.9425, lon: -118.4081 },
  "ORD": { name: "O'Hare International", city: "Chicago", country: "USA", lat: 41.9742, lon: -87.9073 },
  "ATL": { name: "Hartsfield-Jackson Atlanta International", city: "Atlanta", country: "USA", lat: 33.6407, lon: -84.4277 },
  "DFW": { name: "Dallas/Fort Worth International", city: "Dallas", country: "USA", lat: 32.8998, lon: -97.0403 },
  "DEN": { name: "Denver International", city: "Denver", country: "USA", lat: 39.8561, lon: -104.6737 },
  "SFO": { name: "San Francisco International", city: "San Francisco", country: "USA", lat: 37.6213, lon: -122.3790 },
  "SEA": { name: "Seattle-Tacoma International", city: "Seattle", country: "USA", lat: 47.4502, lon: -122.3088 },
  "MIA": { name: "Miami International", city: "Miami", country: "USA", lat: 25.7959, lon: -80.2870 },
  "BOS": { name: "Boston Logan International", city: "Boston", country: "USA", lat: 42.3656, lon: -71.0096 },
  "EWR": { name: "Newark Liberty International", city: "Newark", country: "USA", lat: 40.6895, lon: -74.1745 },
  "IAD": { name: "Washington Dulles International", city: "Washington", country: "USA", lat: 38.9531, lon: -77.4565 },
  "PHX": { name: "Phoenix Sky Harbor International", city: "Phoenix", country: "USA", lat: 33.4373, lon: -112.0078 },
  "LAS": { name: "Harry Reid International", city: "Las Vegas", country: "USA", lat: 36.0840, lon: -115.1537 },
  "MCO": { name: "Orlando International", city: "Orlando", country: "USA", lat: 28.4312, lon: -81.3081 },
  "YYZ": { name: "Toronto Pearson International", city: "Toronto", country: "Canada", lat: 43.6777, lon: -79.6248 },
  "YVR": { name: "Vancouver International", city: "Vancouver", country: "Canada", lat: 49.1967, lon: -123.1815 },
  "YUL": { name: "Montréal-Trudeau International", city: "Montreal", country: "Canada", lat: 45.4706, lon: -73.7408 },
  "MEX": { name: "Mexico City International", city: "Mexico City", country: "Mexico", lat: 19.4363, lon: -99.0721 },
  
  // Europe
  "LHR": { name: "London Heathrow", city: "London", country: "UK", lat: 51.4700, lon: -0.4543 },
  "LGW": { name: "London Gatwick", city: "London", country: "UK", lat: 51.1537, lon: -0.1821 },
  "CDG": { name: "Charles de Gaulle", city: "Paris", country: "France", lat: 49.0097, lon: 2.5479 },
  "ORY": { name: "Paris Orly", city: "Paris", country: "France", lat: 48.7262, lon: 2.3652 },
  "FRA": { name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", lat: 50.0379, lon: 8.5622 },
  "MUC": { name: "Munich Airport", city: "Munich", country: "Germany", lat: 48.3537, lon: 11.7750 },
  "AMS": { name: "Amsterdam Schiphol", city: "Amsterdam", country: "Netherlands", lat: 52.3105, lon: 4.7683 },
  "MAD": { name: "Adolfo Suárez Madrid–Barajas", city: "Madrid", country: "Spain", lat: 40.4983, lon: -3.5676 },
  "BCN": { name: "Barcelona–El Prat", city: "Barcelona", country: "Spain", lat: 41.2974, lon: 2.0833 },
  "FCO": { name: "Leonardo da Vinci–Fiumicino", city: "Rome", country: "Italy", lat: 41.8003, lon: 12.2389 },
  "MXP": { name: "Milan Malpensa", city: "Milan", country: "Italy", lat: 45.6306, lon: 8.7281 },
  "ZRH": { name: "Zurich Airport", city: "Zurich", country: "Switzerland", lat: 47.4647, lon: 8.5492 },
  "VIE": { name: "Vienna International", city: "Vienna", country: "Austria", lat: 48.1103, lon: 16.5697 },
  "CPH": { name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark", lat: 55.6180, lon: 12.6508 },
  "OSL": { name: "Oslo Gardermoen", city: "Oslo", country: "Norway", lat: 60.1976, lon: 11.1004 },
  "ARN": { name: "Stockholm Arlanda", city: "Stockholm", country: "Sweden", lat: 59.6498, lon: 17.9238 },
  "HEL": { name: "Helsinki-Vantaa", city: "Helsinki", country: "Finland", lat: 60.3172, lon: 24.9633 },
  "DUB": { name: "Dublin Airport", city: "Dublin", country: "Ireland", lat: 53.4264, lon: -6.2499 },
  "LIS": { name: "Lisbon Portela", city: "Lisbon", country: "Portugal", lat: 38.7756, lon: -9.1354 },
  "BRU": { name: "Brussels Airport", city: "Brussels", country: "Belgium", lat: 50.9014, lon: 4.4844 },
  "IST": { name: "Istanbul Airport", city: "Istanbul", country: "Turkey", lat: 41.2753, lon: 28.7519 },
  "SVO": { name: "Sheremetyevo International", city: "Moscow", country: "Russia", lat: 55.9726, lon: 37.4146 },
  "DME": { name: "Domodedovo International", city: "Moscow", country: "Russia", lat: 55.4088, lon: 37.9063 },
  
  // Asia
  "DXB": { name: "Dubai International", city: "Dubai", country: "UAE", lat: 25.2532, lon: 55.3657 },
  "AUH": { name: "Abu Dhabi International", city: "Abu Dhabi", country: "UAE", lat: 24.4330, lon: 54.6511 },
  "DOH": { name: "Hamad International", city: "Doha", country: "Qatar", lat: 25.2609, lon: 51.6138 },
  "SIN": { name: "Singapore Changi", city: "Singapore", country: "Singapore", lat: 1.3644, lon: 103.9915 },
  "HKG": { name: "Hong Kong International", city: "Hong Kong", country: "China", lat: 22.3080, lon: 113.9185 },
  "PVG": { name: "Shanghai Pudong International", city: "Shanghai", country: "China", lat: 31.1443, lon: 121.8083 },
  "PEK": { name: "Beijing Capital International", city: "Beijing", country: "China", lat: 40.0799, lon: 116.6031 },
  "PKX": { name: "Beijing Daxing International", city: "Beijing", country: "China", lat: 39.5098, lon: 116.4105 },
  "CAN": { name: "Guangzhou Baiyun International", city: "Guangzhou", country: "China", lat: 23.3924, lon: 113.2988 },
  "NRT": { name: "Narita International", city: "Tokyo", country: "Japan", lat: 35.7720, lon: 140.3929 },
  "HND": { name: "Tokyo Haneda", city: "Tokyo", country: "Japan", lat: 35.5494, lon: 139.7798 },
  "KIX": { name: "Kansai International", city: "Osaka", country: "Japan", lat: 34.4347, lon: 135.2441 },
  "ICN": { name: "Incheon International", city: "Seoul", country: "South Korea", lat: 37.4602, lon: 126.4407 },
  "BKK": { name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand", lat: 13.6900, lon: 100.7501 },
  "KUL": { name: "Kuala Lumpur International", city: "Kuala Lumpur", country: "Malaysia", lat: 2.7456, lon: 101.7099 },
  "CGK": { name: "Soekarno-Hatta International", city: "Jakarta", country: "Indonesia", lat: -6.1256, lon: 106.6559 },
  "DEL": { name: "Indira Gandhi International", city: "New Delhi", country: "India", lat: 28.5562, lon: 77.1000 },
  "BOM": { name: "Chhatrapati Shivaji Maharaj International", city: "Mumbai", country: "India", lat: 19.0896, lon: 72.8656 },
  "BLR": { name: "Kempegowda International", city: "Bangalore", country: "India", lat: 13.1986, lon: 77.7066 },
  "MAA": { name: "Chennai International", city: "Chennai", country: "India", lat: 12.9941, lon: 80.1709 },
  "HYD": { name: "Rajiv Gandhi International", city: "Hyderabad", country: "India", lat: 17.2403, lon: 78.4294 },
  "CCU": { name: "Netaji Subhas Chandra Bose International", city: "Kolkata", country: "India", lat: 22.6520, lon: 88.4463 },
  "MNL": { name: "Ninoy Aquino International", city: "Manila", country: "Philippines", lat: 14.5086, lon: 121.0194 },
  "TPE": { name: "Taiwan Taoyuan International", city: "Taipei", country: "Taiwan", lat: 25.0797, lon: 121.2342 },
  "HAN": { name: "Noi Bai International", city: "Hanoi", country: "Vietnam", lat: 21.2187, lon: 105.8040 },
  "SGN": { name: "Tan Son Nhat International", city: "Ho Chi Minh City", country: "Vietnam", lat: 10.8188, lon: 106.6520 },
  
  // Oceania
  "SYD": { name: "Sydney Kingsford Smith", city: "Sydney", country: "Australia", lat: -33.9399, lon: 151.1753 },
  "MEL": { name: "Melbourne Airport", city: "Melbourne", country: "Australia", lat: -37.6690, lon: 144.8410 },
  "BNE": { name: "Brisbane Airport", city: "Brisbane", country: "Australia", lat: -27.3942, lon: 153.1218 },
  "PER": { name: "Perth Airport", city: "Perth", country: "Australia", lat: -31.9403, lon: 115.9672 },
  "AKL": { name: "Auckland Airport", city: "Auckland", country: "New Zealand", lat: -37.0082, lon: 174.7850 },
  
  // South America
  "GRU": { name: "São Paulo/Guarulhos International", city: "São Paulo", country: "Brazil", lat: -23.4356, lon: -46.4731 },
  "GIG": { name: "Rio de Janeiro/Galeão International", city: "Rio de Janeiro", country: "Brazil", lat: -22.8099, lon: -43.2506 },
  "EZE": { name: "Ministro Pistarini International", city: "Buenos Aires", country: "Argentina", lat: -34.8222, lon: -58.5358 },
  "SCL": { name: "Arturo Merino Benítez International", city: "Santiago", country: "Chile", lat: -33.3930, lon: -70.7858 },
  "BOG": { name: "El Dorado International", city: "Bogotá", country: "Colombia", lat: 4.7016, lon: -74.1469 },
  "LIM": { name: "Jorge Chávez International", city: "Lima", country: "Peru", lat: -12.0219, lon: -77.1143 },
  
  // Africa
  "JNB": { name: "O.R. Tambo International", city: "Johannesburg", country: "South Africa", lat: -26.1392, lon: 28.2460 },
  "CPT": { name: "Cape Town International", city: "Cape Town", country: "South Africa", lat: -33.9715, lon: 18.6021 },
  "CAI": { name: "Cairo International", city: "Cairo", country: "Egypt", lat: 30.1219, lon: 31.4056 },
  "NBO": { name: "Jomo Kenyatta International", city: "Nairobi", country: "Kenya", lat: -1.3192, lon: 36.9278 },
  "LOS": { name: "Murtala Muhammed International", city: "Lagos", country: "Nigeria", lat: 6.5774, lon: 3.3212 },
  "ADD": { name: "Addis Ababa Bole International", city: "Addis Ababa", country: "Ethiopia", lat: 8.9779, lon: 38.7993 },
  "CMN": { name: "Mohammed V International", city: "Casablanca", country: "Morocco", lat: 33.3675, lon: -7.5898 },
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

// Get airport data from built-in database
function getAirportData(iataCode: string): {
  name: string;
  iata: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
} | null {
  const code = iataCode.toUpperCase().trim();
  const airport = AIRPORTS[code];
  
  if (!airport) {
    return null;
  }
  
  return {
    name: airport.name,
    iata: code,
    city: airport.city,
    country: airport.country,
    latitude: airport.lat,
    longitude: airport.lon
  };
}

// Get list of supported airports
function getSupportedAirports(): string[] {
  return Object.keys(AIRPORTS).sort();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { departureIata, arrivalIata, passengers = 1, includeRF = false, listAirports = false } = await req.json();
    
    // Return list of supported airports if requested
    if (listAirports) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          airports: getSupportedAirports(),
          count: getSupportedAirports().length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate input
    if (!departureIata || !arrivalIata) {
      return new Response(
        JSON.stringify({ error: 'Both departure and arrival IATA codes are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing flight: ${departureIata} → ${arrivalIata}`);
    
    // Get airport data from built-in database
    const departureAirport = getAirportData(departureIata);
    const arrivalAirport = getAirportData(arrivalIata);
    
    if (!departureAirport) {
      const supported = getSupportedAirports();
      return new Response(
        JSON.stringify({ 
          error: `Departure airport not found: ${departureIata}. Supported airports: ${supported.slice(0, 20).join(', ')}...`,
          supportedAirports: supported
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!arrivalAirport) {
      const supported = getSupportedAirports();
      return new Response(
        JSON.stringify({ 
          error: `Arrival airport not found: ${arrivalIata}. Supported airports: ${supported.slice(0, 20).join(', ')}...`,
          supportedAirports: supported
        }),
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
          city: departureAirport.city,
          country: departureAirport.country,
          coordinates: {
            latitude: departureAirport.latitude,
            longitude: departureAirport.longitude
          }
        },
        arrival: {
          name: arrivalAirport.name,
          iata: arrivalAirport.iata,
          city: arrivalAirport.city,
          country: arrivalAirport.country,
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
