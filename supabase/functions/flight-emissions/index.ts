import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Major airports database with coordinates (200+ airports worldwide)
const AIRPORTS: Record<string, { name: string; city: string; country: string; lat: number; lon: number }> = {
  // North America - USA
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
  "DCA": { name: "Ronald Reagan Washington National", city: "Washington", country: "USA", lat: 38.8512, lon: -77.0402 },
  "PHX": { name: "Phoenix Sky Harbor International", city: "Phoenix", country: "USA", lat: 33.4373, lon: -112.0078 },
  "LAS": { name: "Harry Reid International", city: "Las Vegas", country: "USA", lat: 36.0840, lon: -115.1537 },
  "MCO": { name: "Orlando International", city: "Orlando", country: "USA", lat: 28.4312, lon: -81.3081 },
  "CLT": { name: "Charlotte Douglas International", city: "Charlotte", country: "USA", lat: 35.2140, lon: -80.9431 },
  "IAH": { name: "George Bush Intercontinental", city: "Houston", country: "USA", lat: 29.9902, lon: -95.3368 },
  "HOU": { name: "William P. Hobby", city: "Houston", country: "USA", lat: 29.6454, lon: -95.2789 },
  "MSP": { name: "Minneapolis-Saint Paul International", city: "Minneapolis", country: "USA", lat: 44.8820, lon: -93.2218 },
  "DTW": { name: "Detroit Metropolitan Wayne County", city: "Detroit", country: "USA", lat: 42.2124, lon: -83.3534 },
  "PHL": { name: "Philadelphia International", city: "Philadelphia", country: "USA", lat: 39.8719, lon: -75.2411 },
  "SAN": { name: "San Diego International", city: "San Diego", country: "USA", lat: 32.7336, lon: -117.1897 },
  "TPA": { name: "Tampa International", city: "Tampa", country: "USA", lat: 27.9755, lon: -82.5332 },
  "PDX": { name: "Portland International", city: "Portland", country: "USA", lat: 45.5887, lon: -122.5975 },
  "SLC": { name: "Salt Lake City International", city: "Salt Lake City", country: "USA", lat: 40.7884, lon: -111.9778 },
  "BWI": { name: "Baltimore/Washington International", city: "Baltimore", country: "USA", lat: 39.1754, lon: -76.6683 },
  "AUS": { name: "Austin-Bergstrom International", city: "Austin", country: "USA", lat: 30.1975, lon: -97.6664 },
  "RDU": { name: "Raleigh-Durham International", city: "Raleigh", country: "USA", lat: 35.8776, lon: -78.7875 },
  "HNL": { name: "Daniel K. Inouye International", city: "Honolulu", country: "USA", lat: 21.3187, lon: -157.9225 },
  "OGG": { name: "Kahului Airport", city: "Maui", country: "USA", lat: 20.8986, lon: -156.4305 },
  "ANC": { name: "Ted Stevens Anchorage International", city: "Anchorage", country: "USA", lat: 61.1743, lon: -149.9962 },
  "SJC": { name: "San Jose International", city: "San Jose", country: "USA", lat: 37.3626, lon: -121.9291 },
  "OAK": { name: "Oakland International", city: "Oakland", country: "USA", lat: 37.7213, lon: -122.2208 },
  "SMF": { name: "Sacramento International", city: "Sacramento", country: "USA", lat: 38.6954, lon: -121.5908 },
  "MCI": { name: "Kansas City International", city: "Kansas City", country: "USA", lat: 39.2976, lon: -94.7139 },
  "STL": { name: "St. Louis Lambert International", city: "St. Louis", country: "USA", lat: 38.7487, lon: -90.3700 },
  "IND": { name: "Indianapolis International", city: "Indianapolis", country: "USA", lat: 39.7173, lon: -86.2944 },
  "CMH": { name: "John Glenn Columbus International", city: "Columbus", country: "USA", lat: 39.9980, lon: -82.8919 },
  "CLE": { name: "Cleveland Hopkins International", city: "Cleveland", country: "USA", lat: 41.4117, lon: -81.8498 },
  "PIT": { name: "Pittsburgh International", city: "Pittsburgh", country: "USA", lat: 40.4915, lon: -80.2329 },
  "CVG": { name: "Cincinnati/Northern Kentucky International", city: "Cincinnati", country: "USA", lat: 39.0488, lon: -84.6678 },
  "BNA": { name: "Nashville International", city: "Nashville", country: "USA", lat: 36.1245, lon: -86.6782 },
  "MKE": { name: "Milwaukee Mitchell International", city: "Milwaukee", country: "USA", lat: 42.9472, lon: -87.8966 },
  "MSY": { name: "Louis Armstrong New Orleans International", city: "New Orleans", country: "USA", lat: 29.9934, lon: -90.2580 },
  "JAX": { name: "Jacksonville International", city: "Jacksonville", country: "USA", lat: 30.4941, lon: -81.6879 },
  "RSW": { name: "Southwest Florida International", city: "Fort Myers", country: "USA", lat: 26.5362, lon: -81.7552 },
  "PBI": { name: "Palm Beach International", city: "West Palm Beach", country: "USA", lat: 26.6832, lon: -80.0956 },
  "FLL": { name: "Fort Lauderdale-Hollywood International", city: "Fort Lauderdale", country: "USA", lat: 26.0726, lon: -80.1527 },
  "SNA": { name: "John Wayne Airport", city: "Orange County", country: "USA", lat: 33.6757, lon: -117.8682 },
  "BUR": { name: "Hollywood Burbank Airport", city: "Burbank", country: "USA", lat: 34.2005, lon: -118.3585 },
  "ONT": { name: "Ontario International", city: "Ontario", country: "USA", lat: 34.0560, lon: -117.6012 },
  
  // North America - Canada
  "YYZ": { name: "Toronto Pearson International", city: "Toronto", country: "Canada", lat: 43.6777, lon: -79.6248 },
  "YVR": { name: "Vancouver International", city: "Vancouver", country: "Canada", lat: 49.1967, lon: -123.1815 },
  "YUL": { name: "Montréal-Trudeau International", city: "Montreal", country: "Canada", lat: 45.4706, lon: -73.7408 },
  "YYC": { name: "Calgary International", city: "Calgary", country: "Canada", lat: 51.1215, lon: -114.0076 },
  "YEG": { name: "Edmonton International", city: "Edmonton", country: "Canada", lat: 53.3097, lon: -113.5797 },
  "YOW": { name: "Ottawa Macdonald-Cartier International", city: "Ottawa", country: "Canada", lat: 45.3225, lon: -75.6692 },
  "YWG": { name: "Winnipeg James Armstrong Richardson International", city: "Winnipeg", country: "Canada", lat: 49.9100, lon: -97.2399 },
  "YHZ": { name: "Halifax Stanfield International", city: "Halifax", country: "Canada", lat: 44.8808, lon: -63.5086 },
  "YQB": { name: "Québec City Jean Lesage International", city: "Quebec City", country: "Canada", lat: 46.7911, lon: -71.3933 },
  "YXE": { name: "Saskatoon John G. Diefenbaker International", city: "Saskatoon", country: "Canada", lat: 52.1708, lon: -106.6997 },
  "YQR": { name: "Regina International", city: "Regina", country: "Canada", lat: 50.4319, lon: -104.6658 },
  "YYJ": { name: "Victoria International", city: "Victoria", country: "Canada", lat: 48.6469, lon: -123.4258 },
  "YKF": { name: "Region of Waterloo International", city: "Kitchener", country: "Canada", lat: 43.4608, lon: -80.3786 },
  
  // North America - Mexico & Central America
  "MEX": { name: "Mexico City International", city: "Mexico City", country: "Mexico", lat: 19.4363, lon: -99.0721 },
  "CUN": { name: "Cancún International", city: "Cancún", country: "Mexico", lat: 21.0365, lon: -86.8771 },
  "GDL": { name: "Guadalajara International", city: "Guadalajara", country: "Mexico", lat: 20.5218, lon: -103.3111 },
  "MTY": { name: "Monterrey International", city: "Monterrey", country: "Mexico", lat: 25.7785, lon: -100.1069 },
  "TIJ": { name: "Tijuana International", city: "Tijuana", country: "Mexico", lat: 32.5411, lon: -116.9700 },
  "SJD": { name: "Los Cabos International", city: "San José del Cabo", country: "Mexico", lat: 23.1518, lon: -109.7215 },
  "PVR": { name: "Gustavo Díaz Ordaz International", city: "Puerto Vallarta", country: "Mexico", lat: 20.6801, lon: -105.2544 },
  "PTY": { name: "Tocumen International", city: "Panama City", country: "Panama", lat: 9.0714, lon: -79.3835 },
  "SJO": { name: "Juan Santamaría International", city: "San José", country: "Costa Rica", lat: 9.9939, lon: -84.2088 },
  "SAL": { name: "Monseñor Óscar Arnulfo Romero International", city: "San Salvador", country: "El Salvador", lat: 13.4409, lon: -89.0557 },
  "GUA": { name: "La Aurora International", city: "Guatemala City", country: "Guatemala", lat: 14.5833, lon: -90.5275 },
  
  // Caribbean
  "SJU": { name: "Luis Muñoz Marín International", city: "San Juan", country: "Puerto Rico", lat: 18.4394, lon: -66.0018 },
  "NAS": { name: "Lynden Pindling International", city: "Nassau", country: "Bahamas", lat: 25.0390, lon: -77.4662 },
  "MBJ": { name: "Sangster International", city: "Montego Bay", country: "Jamaica", lat: 18.5037, lon: -77.9134 },
  "KIN": { name: "Norman Manley International", city: "Kingston", country: "Jamaica", lat: 17.9357, lon: -76.7875 },
  "PUJ": { name: "Punta Cana International", city: "Punta Cana", country: "Dominican Republic", lat: 18.5674, lon: -68.3634 },
  "SDQ": { name: "Las Américas International", city: "Santo Domingo", country: "Dominican Republic", lat: 18.4297, lon: -69.6689 },
  "HAV": { name: "José Martí International", city: "Havana", country: "Cuba", lat: 22.9892, lon: -82.4091 },
  "AUA": { name: "Queen Beatrix International", city: "Oranjestad", country: "Aruba", lat: 12.5014, lon: -70.0152 },
  "CUR": { name: "Hato International", city: "Willemstad", country: "Curaçao", lat: 12.1889, lon: -68.9598 },
  "SXM": { name: "Princess Juliana International", city: "Philipsburg", country: "Sint Maarten", lat: 18.0410, lon: -63.1089 },
  "BGI": { name: "Grantley Adams International", city: "Bridgetown", country: "Barbados", lat: 13.0746, lon: -59.4925 },
  "POS": { name: "Piarco International", city: "Port of Spain", country: "Trinidad and Tobago", lat: 10.5954, lon: -61.3372 },
  
  // Europe - UK & Ireland
  "LHR": { name: "London Heathrow", city: "London", country: "UK", lat: 51.4700, lon: -0.4543 },
  "LGW": { name: "London Gatwick", city: "London", country: "UK", lat: 51.1537, lon: -0.1821 },
  "STN": { name: "London Stansted", city: "London", country: "UK", lat: 51.8850, lon: 0.2350 },
  "LTN": { name: "London Luton", city: "London", country: "UK", lat: 51.8747, lon: -0.3683 },
  "LCY": { name: "London City", city: "London", country: "UK", lat: 51.5053, lon: 0.0553 },
  "MAN": { name: "Manchester Airport", city: "Manchester", country: "UK", lat: 53.3537, lon: -2.2750 },
  "BHX": { name: "Birmingham Airport", city: "Birmingham", country: "UK", lat: 52.4539, lon: -1.7480 },
  "EDI": { name: "Edinburgh Airport", city: "Edinburgh", country: "UK", lat: 55.9500, lon: -3.3725 },
  "GLA": { name: "Glasgow Airport", city: "Glasgow", country: "UK", lat: 55.8719, lon: -4.4331 },
  "BRS": { name: "Bristol Airport", city: "Bristol", country: "UK", lat: 51.3827, lon: -2.7190 },
  "NCL": { name: "Newcastle Airport", city: "Newcastle", country: "UK", lat: 55.0375, lon: -1.6917 },
  "LPL": { name: "Liverpool John Lennon Airport", city: "Liverpool", country: "UK", lat: 53.3336, lon: -2.8497 },
  "BFS": { name: "Belfast International", city: "Belfast", country: "UK", lat: 54.6575, lon: -6.2158 },
  "DUB": { name: "Dublin Airport", city: "Dublin", country: "Ireland", lat: 53.4264, lon: -6.2499 },
  "SNN": { name: "Shannon Airport", city: "Shannon", country: "Ireland", lat: 52.7020, lon: -8.9248 },
  "ORK": { name: "Cork Airport", city: "Cork", country: "Ireland", lat: 51.8413, lon: -8.4911 },
  
  // Europe - France
  "CDG": { name: "Charles de Gaulle", city: "Paris", country: "France", lat: 49.0097, lon: 2.5479 },
  "ORY": { name: "Paris Orly", city: "Paris", country: "France", lat: 48.7262, lon: 2.3652 },
  "NCE": { name: "Nice Côte d'Azur", city: "Nice", country: "France", lat: 43.6584, lon: 7.2159 },
  "LYS": { name: "Lyon-Saint Exupéry", city: "Lyon", country: "France", lat: 45.7256, lon: 5.0811 },
  "MRS": { name: "Marseille Provence", city: "Marseille", country: "France", lat: 43.4393, lon: 5.2214 },
  "TLS": { name: "Toulouse-Blagnac", city: "Toulouse", country: "France", lat: 43.6291, lon: 1.3638 },
  "BOD": { name: "Bordeaux-Mérignac", city: "Bordeaux", country: "France", lat: 44.8283, lon: -0.7156 },
  "NTE": { name: "Nantes Atlantique", city: "Nantes", country: "France", lat: 47.1532, lon: -1.6107 },
  
  // Europe - Germany
  "FRA": { name: "Frankfurt Airport", city: "Frankfurt", country: "Germany", lat: 50.0379, lon: 8.5622 },
  "MUC": { name: "Munich Airport", city: "Munich", country: "Germany", lat: 48.3537, lon: 11.7750 },
  "BER": { name: "Berlin Brandenburg", city: "Berlin", country: "Germany", lat: 52.3667, lon: 13.5033 },
  "DUS": { name: "Düsseldorf Airport", city: "Düsseldorf", country: "Germany", lat: 51.2895, lon: 6.7668 },
  "HAM": { name: "Hamburg Airport", city: "Hamburg", country: "Germany", lat: 53.6304, lon: 9.9882 },
  "CGN": { name: "Cologne Bonn Airport", city: "Cologne", country: "Germany", lat: 50.8659, lon: 7.1427 },
  "STR": { name: "Stuttgart Airport", city: "Stuttgart", country: "Germany", lat: 48.6899, lon: 9.2220 },
  "HAJ": { name: "Hannover Airport", city: "Hannover", country: "Germany", lat: 52.4611, lon: 9.6850 },
  "NUE": { name: "Nuremberg Airport", city: "Nuremberg", country: "Germany", lat: 49.4987, lon: 11.0669 },
  "LEJ": { name: "Leipzig/Halle Airport", city: "Leipzig", country: "Germany", lat: 51.4324, lon: 12.2416 },
  
  // Europe - Spain & Portugal
  "MAD": { name: "Adolfo Suárez Madrid–Barajas", city: "Madrid", country: "Spain", lat: 40.4983, lon: -3.5676 },
  "BCN": { name: "Barcelona–El Prat", city: "Barcelona", country: "Spain", lat: 41.2974, lon: 2.0833 },
  "PMI": { name: "Palma de Mallorca", city: "Palma", country: "Spain", lat: 39.5517, lon: 2.7388 },
  "AGP": { name: "Málaga-Costa del Sol", city: "Málaga", country: "Spain", lat: 36.6749, lon: -4.4991 },
  "ALC": { name: "Alicante-Elche", city: "Alicante", country: "Spain", lat: 38.2822, lon: -0.5582 },
  "VLC": { name: "Valencia Airport", city: "Valencia", country: "Spain", lat: 39.4893, lon: -0.4816 },
  "SVQ": { name: "Seville Airport", city: "Seville", country: "Spain", lat: 37.4180, lon: -5.8932 },
  "BIO": { name: "Bilbao Airport", city: "Bilbao", country: "Spain", lat: 43.3011, lon: -2.9106 },
  "TFS": { name: "Tenerife South", city: "Tenerife", country: "Spain", lat: 28.0445, lon: -16.5725 },
  "LPA": { name: "Gran Canaria", city: "Las Palmas", country: "Spain", lat: 27.9319, lon: -15.3866 },
  "IBZ": { name: "Ibiza Airport", city: "Ibiza", country: "Spain", lat: 38.8729, lon: 1.3731 },
  "LIS": { name: "Lisbon Portela", city: "Lisbon", country: "Portugal", lat: 38.7756, lon: -9.1354 },
  "OPO": { name: "Porto Airport", city: "Porto", country: "Portugal", lat: 41.2481, lon: -8.6814 },
  "FAO": { name: "Faro Airport", city: "Faro", country: "Portugal", lat: 37.0144, lon: -7.9659 },
  "FNC": { name: "Madeira Airport", city: "Funchal", country: "Portugal", lat: 32.6979, lon: -16.7745 },
  
  // Europe - Italy
  "FCO": { name: "Leonardo da Vinci–Fiumicino", city: "Rome", country: "Italy", lat: 41.8003, lon: 12.2389 },
  "MXP": { name: "Milan Malpensa", city: "Milan", country: "Italy", lat: 45.6306, lon: 8.7281 },
  "LIN": { name: "Milan Linate", city: "Milan", country: "Italy", lat: 45.4492, lon: 9.2783 },
  "BGY": { name: "Milan Bergamo", city: "Bergamo", country: "Italy", lat: 45.6739, lon: 9.7042 },
  "VCE": { name: "Venice Marco Polo", city: "Venice", country: "Italy", lat: 45.5053, lon: 12.3519 },
  "NAP": { name: "Naples International", city: "Naples", country: "Italy", lat: 40.8860, lon: 14.2908 },
  "BLQ": { name: "Bologna Guglielmo Marconi", city: "Bologna", country: "Italy", lat: 44.5354, lon: 11.2887 },
  "FLR": { name: "Florence Airport", city: "Florence", country: "Italy", lat: 43.8100, lon: 11.2051 },
  "PSA": { name: "Pisa International", city: "Pisa", country: "Italy", lat: 43.6839, lon: 10.3927 },
  "TRN": { name: "Turin Airport", city: "Turin", country: "Italy", lat: 45.2008, lon: 7.6496 },
  "CTA": { name: "Catania-Fontanarossa", city: "Catania", country: "Italy", lat: 37.4668, lon: 15.0664 },
  "PMO": { name: "Palermo Airport", city: "Palermo", country: "Italy", lat: 38.1760, lon: 13.0910 },
  
  // Europe - Netherlands, Belgium, Switzerland
  "AMS": { name: "Amsterdam Schiphol", city: "Amsterdam", country: "Netherlands", lat: 52.3105, lon: 4.7683 },
  "RTM": { name: "Rotterdam The Hague", city: "Rotterdam", country: "Netherlands", lat: 51.9569, lon: 4.4372 },
  "EIN": { name: "Eindhoven Airport", city: "Eindhoven", country: "Netherlands", lat: 51.4501, lon: 5.3743 },
  "BRU": { name: "Brussels Airport", city: "Brussels", country: "Belgium", lat: 50.9014, lon: 4.4844 },
  "CRL": { name: "Brussels South Charleroi", city: "Charleroi", country: "Belgium", lat: 50.4592, lon: 4.4538 },
  "ZRH": { name: "Zurich Airport", city: "Zurich", country: "Switzerland", lat: 47.4647, lon: 8.5492 },
  "GVA": { name: "Geneva Airport", city: "Geneva", country: "Switzerland", lat: 46.2370, lon: 6.1092 },
  "BSL": { name: "EuroAirport Basel Mulhouse Freiburg", city: "Basel", country: "Switzerland", lat: 47.5990, lon: 7.5291 },
  
  // Europe - Nordic
  "CPH": { name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark", lat: 55.6180, lon: 12.6508 },
  "OSL": { name: "Oslo Gardermoen", city: "Oslo", country: "Norway", lat: 60.1976, lon: 11.1004 },
  "BGO": { name: "Bergen Airport Flesland", city: "Bergen", country: "Norway", lat: 60.2934, lon: 5.2181 },
  "TRD": { name: "Trondheim Airport Værnes", city: "Trondheim", country: "Norway", lat: 63.4578, lon: 10.9240 },
  "ARN": { name: "Stockholm Arlanda", city: "Stockholm", country: "Sweden", lat: 59.6498, lon: 17.9238 },
  "GOT": { name: "Gothenburg Landvetter", city: "Gothenburg", country: "Sweden", lat: 57.6628, lon: 12.2798 },
  "HEL": { name: "Helsinki-Vantaa", city: "Helsinki", country: "Finland", lat: 60.3172, lon: 24.9633 },
  "KEF": { name: "Keflavík International", city: "Reykjavik", country: "Iceland", lat: 63.9850, lon: -22.6056 },
  
  // Europe - Central & Eastern
  "VIE": { name: "Vienna International", city: "Vienna", country: "Austria", lat: 48.1103, lon: 16.5697 },
  "SZG": { name: "Salzburg Airport", city: "Salzburg", country: "Austria", lat: 47.7933, lon: 13.0043 },
  "INN": { name: "Innsbruck Airport", city: "Innsbruck", country: "Austria", lat: 47.2602, lon: 11.3440 },
  "PRG": { name: "Václav Havel Airport Prague", city: "Prague", country: "Czech Republic", lat: 50.1008, lon: 14.2632 },
  "WAW": { name: "Warsaw Chopin", city: "Warsaw", country: "Poland", lat: 52.1657, lon: 20.9671 },
  "KRK": { name: "John Paul II International", city: "Krakow", country: "Poland", lat: 50.0777, lon: 19.7848 },
  "GDN": { name: "Gdańsk Lech Wałęsa", city: "Gdansk", country: "Poland", lat: 54.3776, lon: 18.4662 },
  "BUD": { name: "Budapest Ferenc Liszt", city: "Budapest", country: "Hungary", lat: 47.4298, lon: 19.2611 },
  "OTP": { name: "Henri Coandă International", city: "Bucharest", country: "Romania", lat: 44.5711, lon: 26.0850 },
  "SOF": { name: "Sofia Airport", city: "Sofia", country: "Bulgaria", lat: 42.6952, lon: 23.4062 },
  "ATH": { name: "Athens International", city: "Athens", country: "Greece", lat: 37.9364, lon: 23.9445 },
  "SKG": { name: "Thessaloniki Airport", city: "Thessaloniki", country: "Greece", lat: 40.5197, lon: 22.9709 },
  "HER": { name: "Heraklion International", city: "Heraklion", country: "Greece", lat: 35.3397, lon: 25.1803 },
  "JTR": { name: "Santorini Airport", city: "Santorini", country: "Greece", lat: 36.3992, lon: 25.4793 },
  "MLA": { name: "Malta International", city: "Luqa", country: "Malta", lat: 35.8575, lon: 14.4775 },
  "LCA": { name: "Larnaca International", city: "Larnaca", country: "Cyprus", lat: 34.8754, lon: 33.6249 },
  
  // Europe - Turkey & Russia
  "IST": { name: "Istanbul Airport", city: "Istanbul", country: "Turkey", lat: 41.2753, lon: 28.7519 },
  "SAW": { name: "Istanbul Sabiha Gökçen", city: "Istanbul", country: "Turkey", lat: 40.8986, lon: 29.3092 },
  "AYT": { name: "Antalya Airport", city: "Antalya", country: "Turkey", lat: 36.8987, lon: 30.8005 },
  "ESB": { name: "Ankara Esenboğa", city: "Ankara", country: "Turkey", lat: 40.1281, lon: 32.9951 },
  "ADB": { name: "Adnan Menderes", city: "Izmir", country: "Turkey", lat: 38.2924, lon: 27.1570 },
  "SVO": { name: "Sheremetyevo International", city: "Moscow", country: "Russia", lat: 55.9726, lon: 37.4146 },
  "DME": { name: "Domodedovo International", city: "Moscow", country: "Russia", lat: 55.4088, lon: 37.9063 },
  "VKO": { name: "Vnukovo International", city: "Moscow", country: "Russia", lat: 55.5915, lon: 37.2615 },
  "LED": { name: "Pulkovo Airport", city: "Saint Petersburg", country: "Russia", lat: 59.8003, lon: 30.2625 },
  
  // Asia - Middle East
  "DXB": { name: "Dubai International", city: "Dubai", country: "UAE", lat: 25.2532, lon: 55.3657 },
  "AUH": { name: "Abu Dhabi International", city: "Abu Dhabi", country: "UAE", lat: 24.4330, lon: 54.6511 },
  "DWC": { name: "Al Maktoum International", city: "Dubai", country: "UAE", lat: 24.8964, lon: 55.1614 },
  "SHJ": { name: "Sharjah International", city: "Sharjah", country: "UAE", lat: 25.3286, lon: 55.5172 },
  "DOH": { name: "Hamad International", city: "Doha", country: "Qatar", lat: 25.2609, lon: 51.6138 },
  "BAH": { name: "Bahrain International", city: "Manama", country: "Bahrain", lat: 26.2708, lon: 50.6336 },
  "KWI": { name: "Kuwait International", city: "Kuwait City", country: "Kuwait", lat: 29.2266, lon: 47.9689 },
  "MCT": { name: "Muscat International", city: "Muscat", country: "Oman", lat: 23.5933, lon: 58.2844 },
  "RUH": { name: "King Khalid International", city: "Riyadh", country: "Saudi Arabia", lat: 24.9576, lon: 46.6988 },
  "JED": { name: "King Abdulaziz International", city: "Jeddah", country: "Saudi Arabia", lat: 21.6796, lon: 39.1565 },
  "DMM": { name: "King Fahd International", city: "Dammam", country: "Saudi Arabia", lat: 26.4712, lon: 49.7979 },
  "AMM": { name: "Queen Alia International", city: "Amman", country: "Jordan", lat: 31.7226, lon: 35.9932 },
  "TLV": { name: "Ben Gurion Airport", city: "Tel Aviv", country: "Israel", lat: 32.0055, lon: 34.8854 },
  "BEY": { name: "Rafic Hariri International", city: "Beirut", country: "Lebanon", lat: 33.8209, lon: 35.4884 },
  
  // Asia - South Asia
  "DEL": { name: "Indira Gandhi International", city: "New Delhi", country: "India", lat: 28.5562, lon: 77.1000 },
  "BOM": { name: "Chhatrapati Shivaji Maharaj International", city: "Mumbai", country: "India", lat: 19.0896, lon: 72.8656 },
  "BLR": { name: "Kempegowda International", city: "Bangalore", country: "India", lat: 13.1986, lon: 77.7066 },
  "MAA": { name: "Chennai International", city: "Chennai", country: "India", lat: 12.9941, lon: 80.1709 },
  "HYD": { name: "Rajiv Gandhi International", city: "Hyderabad", country: "India", lat: 17.2403, lon: 78.4294 },
  "CCU": { name: "Netaji Subhas Chandra Bose International", city: "Kolkata", country: "India", lat: 22.6520, lon: 88.4463 },
  "COK": { name: "Cochin International", city: "Kochi", country: "India", lat: 10.1520, lon: 76.4019 },
  "AMD": { name: "Sardar Vallabhbhai Patel International", city: "Ahmedabad", country: "India", lat: 23.0772, lon: 72.6347 },
  "PNQ": { name: "Pune Airport", city: "Pune", country: "India", lat: 18.5821, lon: 73.9197 },
  "GOI": { name: "Goa International", city: "Goa", country: "India", lat: 15.3808, lon: 73.8314 },
  "JAI": { name: "Jaipur International", city: "Jaipur", country: "India", lat: 26.8242, lon: 75.8122 },
  "LKO": { name: "Chaudhary Charan Singh International", city: "Lucknow", country: "India", lat: 26.7606, lon: 80.8893 },
  "CMB": { name: "Bandaranaike International", city: "Colombo", country: "Sri Lanka", lat: 7.1808, lon: 79.8841 },
  "DAC": { name: "Hazrat Shahjalal International", city: "Dhaka", country: "Bangladesh", lat: 23.8433, lon: 90.3978 },
  "KTM": { name: "Tribhuvan International", city: "Kathmandu", country: "Nepal", lat: 27.6966, lon: 85.3591 },
  "ISB": { name: "Islamabad International", city: "Islamabad", country: "Pakistan", lat: 33.5605, lon: 72.8526 },
  "KHI": { name: "Jinnah International", city: "Karachi", country: "Pakistan", lat: 24.9065, lon: 67.1609 },
  "LHE": { name: "Allama Iqbal International", city: "Lahore", country: "Pakistan", lat: 31.5216, lon: 74.4036 },
  "MLE": { name: "Velana International", city: "Malé", country: "Maldives", lat: 4.1918, lon: 73.5290 },
  
  // Asia - Southeast Asia
  "SIN": { name: "Singapore Changi", city: "Singapore", country: "Singapore", lat: 1.3644, lon: 103.9915 },
  "BKK": { name: "Suvarnabhumi Airport", city: "Bangkok", country: "Thailand", lat: 13.6900, lon: 100.7501 },
  "DMK": { name: "Don Mueang International", city: "Bangkok", country: "Thailand", lat: 13.9126, lon: 100.6068 },
  "HKT": { name: "Phuket International", city: "Phuket", country: "Thailand", lat: 8.1132, lon: 98.3169 },
  "CNX": { name: "Chiang Mai International", city: "Chiang Mai", country: "Thailand", lat: 18.7668, lon: 98.9625 },
  "KUL": { name: "Kuala Lumpur International", city: "Kuala Lumpur", country: "Malaysia", lat: 2.7456, lon: 101.7099 },
  "PEN": { name: "Penang International", city: "Penang", country: "Malaysia", lat: 5.2972, lon: 100.2767 },
  "BKI": { name: "Kota Kinabalu International", city: "Kota Kinabalu", country: "Malaysia", lat: 5.9372, lon: 116.0511 },
  "KCH": { name: "Kuching International", city: "Kuching", country: "Malaysia", lat: 1.4847, lon: 110.3472 },
  "LGK": { name: "Langkawi International", city: "Langkawi", country: "Malaysia", lat: 6.3297, lon: 99.7286 },
  "CGK": { name: "Soekarno-Hatta International", city: "Jakarta", country: "Indonesia", lat: -6.1256, lon: 106.6559 },
  "DPS": { name: "Ngurah Rai International", city: "Bali", country: "Indonesia", lat: -8.7482, lon: 115.1672 },
  "SUB": { name: "Juanda International", city: "Surabaya", country: "Indonesia", lat: -7.3798, lon: 112.7875 },
  "MNL": { name: "Ninoy Aquino International", city: "Manila", country: "Philippines", lat: 14.5086, lon: 121.0194 },
  "CEB": { name: "Mactan-Cebu International", city: "Cebu", country: "Philippines", lat: 10.3075, lon: 123.9794 },
  "HAN": { name: "Noi Bai International", city: "Hanoi", country: "Vietnam", lat: 21.2187, lon: 105.8040 },
  "SGN": { name: "Tan Son Nhat International", city: "Ho Chi Minh City", country: "Vietnam", lat: 10.8188, lon: 106.6520 },
  "DAD": { name: "Da Nang International", city: "Da Nang", country: "Vietnam", lat: 16.0439, lon: 108.1994 },
  "RGN": { name: "Yangon International", city: "Yangon", country: "Myanmar", lat: 16.9073, lon: 96.1332 },
  "PNH": { name: "Phnom Penh International", city: "Phnom Penh", country: "Cambodia", lat: 11.5466, lon: 104.8441 },
  "REP": { name: "Siem Reap International", city: "Siem Reap", country: "Cambodia", lat: 13.4107, lon: 103.8128 },
  
  // Asia - East Asia
  "HKG": { name: "Hong Kong International", city: "Hong Kong", country: "China", lat: 22.3080, lon: 113.9185 },
  "PVG": { name: "Shanghai Pudong International", city: "Shanghai", country: "China", lat: 31.1443, lon: 121.8083 },
  "SHA": { name: "Shanghai Hongqiao International", city: "Shanghai", country: "China", lat: 31.1979, lon: 121.3363 },
  "PEK": { name: "Beijing Capital International", city: "Beijing", country: "China", lat: 40.0799, lon: 116.6031 },
  "PKX": { name: "Beijing Daxing International", city: "Beijing", country: "China", lat: 39.5098, lon: 116.4105 },
  "CAN": { name: "Guangzhou Baiyun International", city: "Guangzhou", country: "China", lat: 23.3924, lon: 113.2988 },
  "SZX": { name: "Shenzhen Bao'an International", city: "Shenzhen", country: "China", lat: 22.6393, lon: 113.8107 },
  "CTU": { name: "Chengdu Shuangliu International", city: "Chengdu", country: "China", lat: 30.5785, lon: 103.9471 },
  "CKG": { name: "Chongqing Jiangbei International", city: "Chongqing", country: "China", lat: 29.7192, lon: 106.6417 },
  "XIY": { name: "Xi'an Xianyang International", city: "Xi'an", country: "China", lat: 34.4471, lon: 108.7516 },
  "HGH": { name: "Hangzhou Xiaoshan International", city: "Hangzhou", country: "China", lat: 30.2295, lon: 120.4344 },
  "NKG": { name: "Nanjing Lukou International", city: "Nanjing", country: "China", lat: 31.7420, lon: 118.8620 },
  "TAO": { name: "Qingdao Jiaodong International", city: "Qingdao", country: "China", lat: 36.2661, lon: 120.3749 },
  "KMG": { name: "Kunming Changshui International", city: "Kunming", country: "China", lat: 25.1019, lon: 102.9291 },
  "WUH": { name: "Wuhan Tianhe International", city: "Wuhan", country: "China", lat: 30.7838, lon: 114.2081 },
  "MFM": { name: "Macau International", city: "Macau", country: "China", lat: 22.1496, lon: 113.5915 },
  "NRT": { name: "Narita International", city: "Tokyo", country: "Japan", lat: 35.7720, lon: 140.3929 },
  "HND": { name: "Tokyo Haneda", city: "Tokyo", country: "Japan", lat: 35.5494, lon: 139.7798 },
  "KIX": { name: "Kansai International", city: "Osaka", country: "Japan", lat: 34.4347, lon: 135.2441 },
  "ITM": { name: "Osaka Itami", city: "Osaka", country: "Japan", lat: 34.7855, lon: 135.4380 },
  "NGO": { name: "Chubu Centrair International", city: "Nagoya", country: "Japan", lat: 34.8584, lon: 136.8054 },
  "FUK": { name: "Fukuoka Airport", city: "Fukuoka", country: "Japan", lat: 33.5859, lon: 130.4511 },
  "CTS": { name: "New Chitose Airport", city: "Sapporo", country: "Japan", lat: 42.7752, lon: 141.6924 },
  "OKA": { name: "Naha Airport", city: "Okinawa", country: "Japan", lat: 26.1958, lon: 127.6459 },
  "ICN": { name: "Incheon International", city: "Seoul", country: "South Korea", lat: 37.4602, lon: 126.4407 },
  "GMP": { name: "Gimpo International", city: "Seoul", country: "South Korea", lat: 37.5583, lon: 126.7906 },
  "PUS": { name: "Gimhae International", city: "Busan", country: "South Korea", lat: 35.1795, lon: 128.9383 },
  "CJU": { name: "Jeju International", city: "Jeju", country: "South Korea", lat: 33.5113, lon: 126.4929 },
  "TPE": { name: "Taiwan Taoyuan International", city: "Taipei", country: "Taiwan", lat: 25.0797, lon: 121.2342 },
  "TSA": { name: "Taipei Songshan", city: "Taipei", country: "Taiwan", lat: 25.0694, lon: 121.5525 },
  "KHH": { name: "Kaohsiung International", city: "Kaohsiung", country: "Taiwan", lat: 22.5771, lon: 120.3500 },
  "ULN": { name: "Chinggis Khaan International", city: "Ulaanbaatar", country: "Mongolia", lat: 47.8431, lon: 106.7667 },
  
  // Oceania
  "SYD": { name: "Sydney Kingsford Smith", city: "Sydney", country: "Australia", lat: -33.9399, lon: 151.1753 },
  "MEL": { name: "Melbourne Airport", city: "Melbourne", country: "Australia", lat: -37.6690, lon: 144.8410 },
  "BNE": { name: "Brisbane Airport", city: "Brisbane", country: "Australia", lat: -27.3942, lon: 153.1218 },
  "PER": { name: "Perth Airport", city: "Perth", country: "Australia", lat: -31.9403, lon: 115.9672 },
  "ADL": { name: "Adelaide Airport", city: "Adelaide", country: "Australia", lat: -34.9450, lon: 138.5306 },
  "CNS": { name: "Cairns Airport", city: "Cairns", country: "Australia", lat: -16.8858, lon: 145.7552 },
  "OOL": { name: "Gold Coast Airport", city: "Gold Coast", country: "Australia", lat: -28.1644, lon: 153.5047 },
  "CBR": { name: "Canberra Airport", city: "Canberra", country: "Australia", lat: -35.3069, lon: 149.1950 },
  "HBA": { name: "Hobart Airport", city: "Hobart", country: "Australia", lat: -42.8361, lon: 147.5103 },
  "DRW": { name: "Darwin International", city: "Darwin", country: "Australia", lat: -12.4147, lon: 130.8769 },
  "AKL": { name: "Auckland Airport", city: "Auckland", country: "New Zealand", lat: -37.0082, lon: 174.7850 },
  "WLG": { name: "Wellington Airport", city: "Wellington", country: "New Zealand", lat: -41.3272, lon: 174.8053 },
  "CHC": { name: "Christchurch Airport", city: "Christchurch", country: "New Zealand", lat: -43.4894, lon: 172.5322 },
  "ZQN": { name: "Queenstown Airport", city: "Queenstown", country: "New Zealand", lat: -45.0211, lon: 168.7392 },
  "NAN": { name: "Nadi International", city: "Nadi", country: "Fiji", lat: -17.7554, lon: 177.4431 },
  "PPT": { name: "Faa'a International", city: "Papeete", country: "French Polynesia", lat: -17.5537, lon: -149.6064 },
  "NOU": { name: "La Tontouta International", city: "Nouméa", country: "New Caledonia", lat: -22.0146, lon: 166.2128 },
  
  // South America
  "GRU": { name: "São Paulo/Guarulhos International", city: "São Paulo", country: "Brazil", lat: -23.4356, lon: -46.4731 },
  "GIG": { name: "Rio de Janeiro/Galeão International", city: "Rio de Janeiro", country: "Brazil", lat: -22.8099, lon: -43.2506 },
  "BSB": { name: "Brasília International", city: "Brasília", country: "Brazil", lat: -15.8711, lon: -47.9186 },
  "CNF": { name: "Tancredo Neves International", city: "Belo Horizonte", country: "Brazil", lat: -19.6244, lon: -43.9719 },
  "SSA": { name: "Deputado Luís Eduardo Magalhães International", city: "Salvador", country: "Brazil", lat: -12.9086, lon: -38.3225 },
  "REC": { name: "Recife/Guararapes International", city: "Recife", country: "Brazil", lat: -8.1264, lon: -34.9236 },
  "FOR": { name: "Pinto Martins International", city: "Fortaleza", country: "Brazil", lat: -3.7761, lon: -38.5326 },
  "POA": { name: "Salgado Filho International", city: "Porto Alegre", country: "Brazil", lat: -29.9944, lon: -51.1714 },
  "CWB": { name: "Afonso Pena International", city: "Curitiba", country: "Brazil", lat: -25.5285, lon: -49.1758 },
  "FLN": { name: "Hercílio Luz International", city: "Florianópolis", country: "Brazil", lat: -27.6703, lon: -48.5525 },
  "EZE": { name: "Ministro Pistarini International", city: "Buenos Aires", country: "Argentina", lat: -34.8222, lon: -58.5358 },
  "AEP": { name: "Aeroparque Jorge Newbery", city: "Buenos Aires", country: "Argentina", lat: -34.5592, lon: -58.4156 },
  "COR": { name: "Ingeniero Ambrosio Taravella International", city: "Córdoba", country: "Argentina", lat: -31.3236, lon: -64.2078 },
  "MDZ": { name: "El Plumerillo International", city: "Mendoza", country: "Argentina", lat: -32.8317, lon: -68.7928 },
  "BRC": { name: "San Carlos de Bariloche Airport", city: "Bariloche", country: "Argentina", lat: -41.1512, lon: -71.1575 },
  "IGR": { name: "Cataratas del Iguazú International", city: "Puerto Iguazú", country: "Argentina", lat: -25.7373, lon: -54.4734 },
  "SCL": { name: "Arturo Merino Benítez International", city: "Santiago", country: "Chile", lat: -33.3930, lon: -70.7858 },
  "LIM": { name: "Jorge Chávez International", city: "Lima", country: "Peru", lat: -12.0219, lon: -77.1143 },
  "CUZ": { name: "Alejandro Velasco Astete International", city: "Cusco", country: "Peru", lat: -13.5358, lon: -71.9389 },
  "BOG": { name: "El Dorado International", city: "Bogotá", country: "Colombia", lat: 4.7016, lon: -74.1469 },
  "MDE": { name: "José María Córdova International", city: "Medellín", country: "Colombia", lat: 6.1645, lon: -75.4231 },
  "CTG": { name: "Rafael Núñez International", city: "Cartagena", country: "Colombia", lat: 10.4424, lon: -75.5130 },
  "UIO": { name: "Mariscal Sucre International", city: "Quito", country: "Ecuador", lat: -0.1292, lon: -78.3575 },
  "GYE": { name: "José Joaquín de Olmedo International", city: "Guayaquil", country: "Ecuador", lat: -2.1574, lon: -79.8837 },
  "CCS": { name: "Simón Bolívar International", city: "Caracas", country: "Venezuela", lat: 10.6012, lon: -66.9913 },
  "LPB": { name: "El Alto International", city: "La Paz", country: "Bolivia", lat: -16.5133, lon: -68.1922 },
  "VVI": { name: "Viru Viru International", city: "Santa Cruz", country: "Bolivia", lat: -17.6448, lon: -63.1354 },
  "ASU": { name: "Silvio Pettirossi International", city: "Asunción", country: "Paraguay", lat: -25.2400, lon: -57.5200 },
  "MVD": { name: "Carrasco International", city: "Montevideo", country: "Uruguay", lat: -34.8384, lon: -56.0308 },
  
  // Africa
  "JNB": { name: "O.R. Tambo International", city: "Johannesburg", country: "South Africa", lat: -26.1392, lon: 28.2460 },
  "CPT": { name: "Cape Town International", city: "Cape Town", country: "South Africa", lat: -33.9715, lon: 18.6021 },
  "DUR": { name: "King Shaka International", city: "Durban", country: "South Africa", lat: -29.6144, lon: 31.1197 },
  "CAI": { name: "Cairo International", city: "Cairo", country: "Egypt", lat: 30.1219, lon: 31.4056 },
  "HRG": { name: "Hurghada International", city: "Hurghada", country: "Egypt", lat: 27.1783, lon: 33.7994 },
  "SSH": { name: "Sharm el-Sheikh International", city: "Sharm el-Sheikh", country: "Egypt", lat: 27.9773, lon: 34.3950 },
  "LXR": { name: "Luxor International", city: "Luxor", country: "Egypt", lat: 25.6711, lon: 32.7066 },
  "CMN": { name: "Mohammed V International", city: "Casablanca", country: "Morocco", lat: 33.3675, lon: -7.5898 },
  "RAK": { name: "Marrakech Menara", city: "Marrakech", country: "Morocco", lat: 31.6069, lon: -8.0363 },
  "TNG": { name: "Tangier Ibn Battouta", city: "Tangier", country: "Morocco", lat: 35.7269, lon: -5.9169 },
  "ALG": { name: "Houari Boumediene", city: "Algiers", country: "Algeria", lat: 36.6910, lon: 3.2154 },
  "TUN": { name: "Tunis-Carthage International", city: "Tunis", country: "Tunisia", lat: 36.8510, lon: 10.2272 },
  "NBO": { name: "Jomo Kenyatta International", city: "Nairobi", country: "Kenya", lat: -1.3192, lon: 36.9278 },
  "MBA": { name: "Moi International", city: "Mombasa", country: "Kenya", lat: -4.0348, lon: 39.5942 },
  "DAR": { name: "Julius Nyerere International", city: "Dar es Salaam", country: "Tanzania", lat: -6.8781, lon: 39.2026 },
  "ZNZ": { name: "Abeid Amani Karume International", city: "Zanzibar", country: "Tanzania", lat: -6.2220, lon: 39.2245 },
  "JRO": { name: "Kilimanjaro International", city: "Kilimanjaro", country: "Tanzania", lat: -3.4294, lon: 37.0745 },
  "EBB": { name: "Entebbe International", city: "Entebbe", country: "Uganda", lat: 0.0424, lon: 32.4435 },
  "ADD": { name: "Addis Ababa Bole International", city: "Addis Ababa", country: "Ethiopia", lat: 8.9779, lon: 38.7993 },
  "ACC": { name: "Kotoka International", city: "Accra", country: "Ghana", lat: 5.6052, lon: -0.1668 },
  "LOS": { name: "Murtala Muhammed International", city: "Lagos", country: "Nigeria", lat: 6.5774, lon: 3.3212 },
  "ABV": { name: "Nnamdi Azikiwe International", city: "Abuja", country: "Nigeria", lat: 9.0065, lon: 7.2632 },
  "DSS": { name: "Blaise Diagne International", city: "Dakar", country: "Senegal", lat: 14.6700, lon: -17.0733 },
  "ABJ": { name: "Félix-Houphouët-Boigny International", city: "Abidjan", country: "Ivory Coast", lat: 5.2614, lon: -3.9263 },
  "TNR": { name: "Ivato International", city: "Antananarivo", country: "Madagascar", lat: -18.7969, lon: 47.4789 },
  "MRU": { name: "Sir Seewoosagur Ramgoolam International", city: "Port Louis", country: "Mauritius", lat: -20.4302, lon: 57.6836 },
  "SEZ": { name: "Seychelles International", city: "Mahé", country: "Seychelles", lat: -4.6743, lon: 55.5218 },
  "WDH": { name: "Hosea Kutako International", city: "Windhoek", country: "Namibia", lat: -22.4799, lon: 17.4709 },
  "VFA": { name: "Victoria Falls Airport", city: "Victoria Falls", country: "Zimbabwe", lat: -18.0959, lon: 25.8390 },
  "HRE": { name: "Robert Gabriel Mugabe International", city: "Harare", country: "Zimbabwe", lat: -17.9318, lon: 31.0928 },
  "LUN": { name: "Kenneth Kaunda International", city: "Lusaka", country: "Zambia", lat: -15.3308, lon: 28.4526 },
  "LLW": { name: "Lilongwe International", city: "Lilongwe", country: "Malawi", lat: -13.7894, lon: 33.7811 },
  "MPM": { name: "Maputo International", city: "Maputo", country: "Mozambique", lat: -25.9208, lon: 32.5726 },
  "LAD": { name: "Quatro de Fevereiro International", city: "Luanda", country: "Angola", lat: -8.8584, lon: 13.2312 },
  "FIH": { name: "N'djili International", city: "Kinshasa", country: "DR Congo", lat: -4.3858, lon: 15.4446 },
  "KGL": { name: "Kigali International", city: "Kigali", country: "Rwanda", lat: -1.9686, lon: 30.1395 },
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

// Get list of supported airports with full data
function getSupportedAirports(): { iata: string; name: string; city: string; country: string }[] {
  return Object.entries(AIRPORTS)
    .map(([iata, data]) => ({
      iata,
      name: data.name,
      city: data.city,
      country: data.country
    }))
    .sort((a, b) => a.city.localeCompare(b.city));
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
      const airports = getSupportedAirports();
      return new Response(
        JSON.stringify({ 
          success: true, 
          airports,
          count: airports.length
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
