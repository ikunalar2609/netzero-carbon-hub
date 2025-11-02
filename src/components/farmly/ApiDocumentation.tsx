
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Play } from "lucide-react";
import { toast } from "sonner";

export const ApiDocumentation = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("flight-emission-tracker");

  const endpoints = {
    "flight-emission-tracker": {
      name: "Flight Emission Tracker",
      method: "POST",
      url: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-flight-emission`,
      description: "Calculate CO₂e emissions for flights using IPCC 2006 Guidelines. Estimates fuel consumption based on aircraft type and applies radiative forcing multiplier (1.9) for non-CO₂ effects.",
      parameters: [
        { name: "aircraftType", type: "string", required: true, description: "Aircraft type code (A320, B737, B777, A350, E175)" },
        { name: "distanceKm", type: "number", required: true, description: "Flight distance in kilometers" },
        { name: "passengers", type: "number", required: true, description: "Number of passengers on the flight" },
        { name: "cargoWeightKg", type: "number", required: false, description: "Cargo weight in kilograms (default: 0)" },
        { name: "fuelUsedKg", type: "number", required: false, description: "Actual fuel consumed in kg (will be estimated if not provided)" }
      ],
      example: {
        request: `{
  "aircraftType": "A320",
  "distanceKm": 1200,
  "passengers": 150,
  "cargoWeightKg": 2000,
  "fuelUsedKg": null
}`,
        response: `{
  "aircraftType": "A320",
  "distanceKm": 1200,
  "fuelConsumedKg": 3240,
  "totalEmissionKgCO2e": 19481.76,
  "emissionPerPassengerKgCO2e": 125.47,
  "calculationDetails": {
    "emissionFactor": 3.16,
    "radiativeForcingMultiplier": 1.9,
    "fuelBurnRateUsed": 2.7,
    "passengers": 150,
    "cargoWeightKg": 2000
  }
}`
      }
    },
    "basic-estimate": {
      name: "Basic Estimate",
      method: "POST",
      url: "/api/estimate",
      description: "Calculate total estimated emissions for a specific activity",
      parameters: [
        { name: "activity_type", type: "string", required: true, description: "Type of activity (e.g., 'electricity', 'transport')" },
        { name: "amount", type: "number", required: true, description: "Amount of activity" },
        { name: "unit", type: "string", required: true, description: "Unit of measurement" },
        { name: "region", type: "string", required: false, description: "Geographic region" }
      ],
      example: {
        request: `{
  "activity_type": "electricity",
  "amount": 1000,
  "unit": "kWh",
  "region": "US"
}`,
        response: `{
  "co2e_kg": 420.5,
  "activity_type": "electricity",
  "amount": 1000,
  "unit": "kWh",
  "region": "US",
  "emission_factor": 0.4205
}`
      }
    },
    "flight-search": {
      name: "Search Airports",
      method: "GET",
      url: "/api/airports",
      description: "Search airports by IATA/ICAO code, name, or city",
      parameters: [
        { name: "query", type: "string", required: true, description: "Search term (IATA/ICAO code, name, or city)" },
        { name: "limit", type: "number", required: false, description: "Maximum number of results (default: 10)" },
        { name: "country", type: "string", required: false, description: "Filter by country code" }
      ],
      example: {
        request: `GET /api/airports?query=JFK&limit=5`,
        response: `{
  "airports": [
    {
      "iata": "JFK",
      "icao": "KJFK",
      "name": "John F Kennedy International Airport",
      "city": "New York",
      "country": "United States",
      "latitude": 40.6413,
      "longitude": -73.7781
    }
  ],
  "total": 1
}`
      }
    },
    "flight-distance": {
      name: "Airport Distance",
      method: "GET",
      url: "/api/airports/distance",
      description: "Calculate great-circle distance between two airports",
      parameters: [
        { name: "from", type: "string", required: true, description: "Origin airport IATA code" },
        { name: "to", type: "string", required: true, description: "Destination airport IATA code" },
        { name: "units", type: "string", required: false, description: "Distance units (km, miles) - default: km" }
      ],
      example: {
        request: `GET /api/airports/distance?from=LAX&to=JFK&units=km`,
        response: `{
  "from": {
    "iata": "LAX",
    "name": "Los Angeles International Airport",
    "city": "Los Angeles"
  },
  "to": {
    "iata": "JFK", 
    "name": "John F Kennedy International Airport",
    "city": "New York"
  },
  "distance_km": 3944,
  "distance_miles": 2451
}`
      }
    },
    "flight-emissions": {
      name: "Flight Emissions",
      method: "POST",
      url: "/api/emissions/flight",
      description: "Calculate CO₂ emissions for a specific flight",
      parameters: [
        { name: "from", type: "string", required: true, description: "Origin airport IATA code" },
        { name: "to", type: "string", required: true, description: "Destination airport IATA code" },
        { name: "passengers", type: "number", required: false, description: "Number of passengers (default: 1)" },
        { name: "cabin_class", type: "string", required: false, description: "Cabin class (economy, business, first)" },
        { name: "aircraft_type", type: "string", required: false, description: "Aircraft type (narrow-body, wide-body)" },
        { name: "methodology", type: "string", required: false, description: "Calculation methodology (AR4, AR5, AR6)" }
      ],
      example: {
        request: `{
  "from": "LAX",
  "to": "JFK",
  "passengers": 1,
  "cabin_class": "economy",
  "aircraft_type": "narrow-body",
  "methodology": "AR5"
}`,
        response: `{
  "from": "LAX",
  "to": "JFK",
  "distance_km": 3944,
  "passengers": 1,
  "cabin_class": "economy",
  "emissions_kgCO2e": 1058.4,
  "emissions_per_passenger": 1058.4,
  "methodology": "AR5",
  "emission_factor": 0.268,
  "class_multiplier": 1.0
}`
      }
    },
    "flight-batch": {
      name: "Batch Flight Emissions",
      method: "POST", 
      url: "/api/emissions/flight/batch",
      description: "Calculate emissions for multiple flights in one request",
      parameters: [
        { name: "flights", type: "array", required: true, description: "Array of flight objects" },
        { name: "methodology", type: "string", required: false, description: "Default methodology for all flights" },
        { name: "include_offset", type: "boolean", required: false, description: "Include carbon offset calculations" }
      ],
      example: {
        request: `{
  "flights": [
    {
      "from": "LAX",
      "to": "JFK", 
      "passengers": 2,
      "cabin_class": "economy"
    },
    {
      "from": "JFK",
      "to": "LHR",
      "passengers": 1,
      "cabin_class": "business"
    }
  ],
  "methodology": "AR5",
  "include_offset": true
}`,
        response: `{
  "flights": [
    {
      "from": "LAX",
      "to": "JFK",
      "emissions_kgCO2e": 2116.8,
      "passengers": 2
    },
    {
      "from": "JFK", 
      "to": "LHR",
      "emissions_kgCO2e": 1876.5,
      "passengers": 1
    }
  ],
  "total_emissions_kgCO2e": 3993.3,
  "offset_required": {
    "trees_to_plant": 181,
    "carbon_credits_tonnes": 3.99,
    "cost_usd": 79.87
  }
}`
      }
    },
    "freight": {
      name: "Intermodal Freight",
      method: "POST",
      url: "/api/freight",
      description: "Estimate emissions for shipping across air, sea, and road",
      parameters: [
        { name: "transport_mode", type: "string", required: true, description: "Mode of transport (air, sea, road)" },
        { name: "weight", type: "number", required: true, description: "Weight in kg" },
        { name: "distance", type: "number", required: true, description: "Distance in km" },
        { name: "origin", type: "string", required: false, description: "Origin location" },
        { name: "destination", type: "string", required: false, description: "Destination location" }
      ],
      example: {
        request: `{
  "transport_mode": "sea",
  "weight": 10000,
  "distance": 8000,
  "origin": "Shanghai",
  "destination": "Los Angeles"
}`,
        response: `{
  "co2e_kg": 156.8,
  "transport_mode": "sea",
  "weight": 10000,
  "distance": 8000,
  "emission_factor": 0.00196
}`
      }
    },
    "cloud": {
      name: "Cloud Computing",
      method: "POST",
      url: "/api/cloud",
      description: "Calculate carbon footprint of cloud resources",
      parameters: [
        { name: "provider", type: "string", required: true, description: "Cloud provider (AWS, Azure, GCP)" },
        { name: "service_type", type: "string", required: true, description: "Type of service (compute, storage, network)" },
        { name: "usage_hours", type: "number", required: true, description: "Usage time in hours" },
        { name: "region", type: "string", required: true, description: "Cloud region" }
      ],
      example: {
        request: `{
  "provider": "AWS",
  "service_type": "compute",
  "usage_hours": 720,
  "region": "us-east-1"
}`,
        response: `{
  "co2e_kg": 45.6,
  "provider": "AWS",
  "service_type": "compute",
  "usage_hours": 720,
  "region": "us-east-1"
}`
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const currentEndpoint = endpoints[selectedEndpoint as keyof typeof endpoints];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-foreground">API Documentation</h2>
        <p className="text-muted-foreground mb-6">
          Comprehensive documentation for all Farmly API endpoints with examples and code snippets.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Endpoint List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(endpoints).map(([key, endpoint]) => (
              <Button
                key={key}
                variant={selectedEndpoint === key ? "default" : "ghost"}
                className={`w-full justify-start ${
                  selectedEndpoint === key 
                    ? "bg-black text-white hover:bg-gray-800" 
                    : "text-black hover:text-gray-600"
                }`}
                onClick={() => setSelectedEndpoint(key)}
              >
                <Badge 
                  variant="outline" 
                  className={`mr-2 text-xs ${
                    selectedEndpoint === key 
                      ? "border-white text-white" 
                      : "border-gray-400 text-gray-700"
                  }`}
                >
                  {endpoint.method}
                </Badge>
                <span className="text-left">{selectedEndpoint === key ? "text-white" : "text-black"}</span>
                {endpoint.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Endpoint Details */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Badge variant="outline" className="border-gray-400 text-gray-700">
                    {currentEndpoint.method}
                  </Badge>
                  {currentEndpoint.name}
                </CardTitle>
                <Button size="sm" variant="outline" className="text-gray-900 border-gray-300">
                  <Play className="h-4 w-4 mr-2" />
                  Try it
                </Button>
              </div>
              <CardDescription className="text-gray-600">{currentEndpoint.description}</CardDescription>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-900">
                {currentEndpoint.url}
              </code>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="parameters" className="w-full">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="parameters" className="text-gray-900">Parameters</TabsTrigger>
                  <TabsTrigger value="example" className="text-gray-900">Example</TabsTrigger>
                  <TabsTrigger value="code" className="text-gray-900">Code Snippets</TabsTrigger>
                </TabsList>
                
                <TabsContent value="parameters" className="space-y-4">
                  <div className="space-y-3">
                    {currentEndpoint.parameters.map((param, index) => (
                      <div key={index} className="border border-gray-200 rounded p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="font-mono font-semibold text-gray-900">{param.name}</code>
                          <Badge variant={param.required ? "destructive" : "secondary"}>
                            {param.required ? "Required" : "Optional"}
                          </Badge>
                          <Badge variant="outline" className="border-gray-400 text-gray-700">{param.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="example" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Request</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-900 border-gray-300"
                          onClick={() => copyToClipboard(currentEndpoint.example.request)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto text-gray-900">
                        <code>{currentEndpoint.example.request}</code>
                      </pre>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Response</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-900 border-gray-300"
                          onClick={() => copyToClipboard(currentEndpoint.example.response)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto text-gray-900">
                        <code>{currentEndpoint.example.response}</code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Python</h4>
                        <Button size="sm" variant="outline" className="text-gray-900 border-gray-300">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto text-gray-900">
                        <code>{`import requests

url = "https://api.farmly.io${currentEndpoint.url}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = ${currentEndpoint.example.request}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result)`}</code>
                      </pre>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">JavaScript</h4>
                        <Button size="sm" variant="outline" className="text-gray-900 border-gray-300">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto text-gray-900">
                        <code>{`const response = await fetch('https://api.farmly.io${currentEndpoint.url}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(${currentEndpoint.example.request})
});

const result = await response.json();
console.log(result);`}</code>
                      </pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
