import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  BookOpen, 
  Calculator, 
  Code, 
  Copy, 
  Database, 
  ExternalLink, 
  FileSpreadsheet,
  FileText, 
  Leaf, 
  Plane, 
  Ship, 
  Trash2,
  Truck, 
  Zap,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

const FarmlyDocs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(searchParams.get("section") || "overview");

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) setActiveSection(section);
  }, [searchParams]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const sections = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "quickstart", label: "Quick Start", icon: Zap },
    { id: "authentication", label: "Authentication", icon: Code },
    { id: "endpoints", label: "API Endpoints", icon: Database },
    { id: "calculations", label: "Calculation Methodology", icon: Calculator },
    { id: "emission-factors", label: "Emission Factors", icon: Leaf },
    { id: "cat", label: "Carbon Accounting", icon: FileSpreadsheet },
    { id: "examples", label: "Code Examples", icon: FileText },
    { id: "errors", label: "Error Handling", icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/farmly">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Farmly
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="text-xl font-semibold text-foreground">FarmlyAPI Documentation</h1>
            <Badge variant="outline" className="text-xs">v2.0</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/farmly-api" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 shrink-0 border-r border-border sticky top-16 h-[calc(100vh-4rem)]">
          <ScrollArea className="h-full py-6 px-4">
            <nav className="space-y-1">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => { setActiveSection(section.id); setSearchParams({ section: section.id }); }}
                >
                  <section.icon className="h-4 w-4 mr-2" />
                  {section.label}
                </Button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-8 py-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === "overview" && <OverviewSection />}
            {activeSection === "quickstart" && <QuickStartSection copyToClipboard={copyToClipboard} />}
            {activeSection === "authentication" && <AuthenticationSection copyToClipboard={copyToClipboard} />}
            {activeSection === "endpoints" && <EndpointsSection copyToClipboard={copyToClipboard} />}
            {activeSection === "calculations" && <CalculationsSection />}
            {activeSection === "emission-factors" && <EmissionFactorsSection />}
            {activeSection === "cat" && <CATSection />}
            {activeSection === "examples" && <ExamplesSection copyToClipboard={copyToClipboard} />}
            {activeSection === "errors" && <ErrorsSection />}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

// Overview Section
const OverviewSection = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-4">Overview</h2>
      <p className="text-lg text-muted-foreground leading-relaxed">
        FarmlyAPI is a comprehensive carbon emissions calculation API that provides accurate, 
        science-backed emission estimates for various activities including flights, freight, 
        energy consumption, and more. Built on IPCC 2006 Guidelines and regularly updated 
        with the latest emission factors.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flight Emissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Calculate CO₂e emissions for flights using aircraft-specific fuel burn rates and 
            radiative forcing multipliers.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5" />
            Freight & Shipping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Estimate emissions for sea, road, and rail freight with support for multiple 
            cargo types and vessel classes.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Energy & Grid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Region-specific electricity emission factors supporting both location-based 
            and market-based accounting.
          </p>
        </CardContent>
      </Card>
    </div>

    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Key Features
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "IPCC 2006 Guidelines compliant",
            "500+ emission factors from trusted sources",
            "Support for GWP AR4, AR5, and AR6 values",
            "Radiative forcing adjustments for aviation",
            "Well-to-Tank (WTT) and Tank-to-Wheel (TTW) calculations",
            "Region-specific grid emission factors",
            "RESTful API with JSON responses",
            "Batch processing support",
            "Comprehensive error handling",
            "99.9% uptime SLA"
          ].map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </div>
);

// Quick Start Section
const QuickStartSection = ({ copyToClipboard }: { copyToClipboard: (text: string) => void }) => {
  const curlExample = `curl -X POST https://api.farmly.io/v1/calculate-flight-emission \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "aircraftType": "A320",
    "distanceKm": 1200,
    "passengers": 150
  }'`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Quick Start</h2>
        <p className="text-lg text-muted-foreground">
          Get started with FarmlyAPI in minutes. Follow these steps to make your first API call.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Get Your API Key</CardTitle>
            <CardDescription>Sign up and generate your API key from the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create an account at <code className="bg-muted px-2 py-1 rounded">farmly.io/signup</code> and 
              navigate to the API Keys section in your dashboard to generate a new key.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Make Your First Request</CardTitle>
            <CardDescription>Use cURL or your preferred HTTP client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{curlExample}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(curlExample)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Parse the Response</CardTitle>
            <CardDescription>Handle the JSON response in your application</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              <code>{`{
  "aircraftType": "A320",
  "distanceKm": 1200,
  "fuelConsumedKg": 3240,
  "totalEmissionKgCO2e": 19481.76,
  "emissionPerPassengerKgCO2e": 129.88,
  "calculationDetails": {
    "emissionFactor": 3.16,
    "radiativeForcingMultiplier": 1.9,
    "fuelBurnRateUsed": 2.7
  }
}`}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Authentication Section
const AuthenticationSection = ({ copyToClipboard }: { copyToClipboard: (text: string) => void }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-4">Authentication</h2>
      <p className="text-lg text-muted-foreground">
        FarmlyAPI uses Bearer token authentication. Include your API key in the Authorization header.
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Authorization Header</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <pre className="bg-muted p-4 rounded-lg text-sm">
            <code>Authorization: Bearer YOUR_API_KEY</code>
          </pre>
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard("Authorization: Bearer YOUR_API_KEY")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            <strong>Security Note:</strong> Never expose your API key in client-side code. 
            Always make API calls from your server-side application.
          </p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Rate Limits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">1,000</div>
              <div className="text-sm text-muted-foreground">Requests/hour (Free)</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">10,000</div>
              <div className="text-sm text-muted-foreground">Requests/hour (Pro)</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">Unlimited</div>
              <div className="text-sm text-muted-foreground">Enterprise</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Endpoints Section
const EndpointsSection = ({ copyToClipboard }: { copyToClipboard: (text: string) => void }) => {
  const endpoints = [
    {
      name: "Calculate Flight Emission",
      method: "POST",
      path: "/v1/calculate-flight-emission",
      description: "Calculate CO₂e emissions for a flight based on aircraft type, distance, and passengers.",
      parameters: [
        { name: "aircraftType", type: "string", required: true, desc: "Aircraft type code (A320, B737, B777, A350, E175)" },
        { name: "distanceKm", type: "number", required: true, desc: "Flight distance in kilometers" },
        { name: "passengers", type: "number", required: true, desc: "Number of passengers" },
        { name: "cargoWeightKg", type: "number", required: false, desc: "Cargo weight in kg (default: 0)" },
        { name: "fuelUsedKg", type: "number", required: false, desc: "Actual fuel consumed (will be estimated if not provided)" },
      ],
      example: {
        request: `{
  "aircraftType": "A320",
  "distanceKm": 1200,
  "passengers": 150,
  "cargoWeightKg": 2000
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
    {
      name: "Search Airports",
      method: "GET",
      path: "/v1/airports",
      description: "Search airports by IATA/ICAO code, name, or city.",
      parameters: [
        { name: "query", type: "string", required: true, desc: "Search term" },
        { name: "limit", type: "number", required: false, desc: "Max results (default: 10)" },
        { name: "country", type: "string", required: false, desc: "Filter by country code" },
      ],
      example: {
        request: "GET /v1/airports?query=JFK&limit=5",
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
    {
      name: "Calculate Freight Emissions",
      method: "POST",
      path: "/v1/freight",
      description: "Calculate emissions for shipping across air, sea, and road.",
      parameters: [
        { name: "transport_mode", type: "string", required: true, desc: "Mode of transport (air, sea, road, rail)" },
        { name: "weight", type: "number", required: true, desc: "Weight in kg" },
        { name: "distance", type: "number", required: true, desc: "Distance in km" },
        { name: "vessel_type", type: "string", required: false, desc: "Type of vessel/vehicle" },
      ],
      example: {
        request: `{
  "transport_mode": "sea",
  "weight": 10000,
  "distance": 8000,
  "vessel_type": "container"
}`,
        response: `{
  "co2e_kg": 156.8,
  "transport_mode": "sea",
  "weight": 10000,
  "distance": 8000,
  "emission_factor": 0.00196,
  "methodology": "IMO 2020"
}`
      }
    },
    {
      name: "Calculate Energy Emissions",
      method: "POST",
      path: "/v1/energy",
      description: "Calculate emissions from electricity and fuel consumption.",
      parameters: [
        { name: "energy_type", type: "string", required: true, desc: "Type: electricity, natural_gas, diesel, etc." },
        { name: "amount", type: "number", required: true, desc: "Amount consumed" },
        { name: "unit", type: "string", required: true, desc: "Unit: kWh, MJ, liters, therms" },
        { name: "region", type: "string", required: false, desc: "Region/grid for electricity" },
        { name: "accounting", type: "string", required: false, desc: "location_based or market_based" },
      ],
      example: {
        request: `{
  "energy_type": "electricity",
  "amount": 1000,
  "unit": "kWh",
  "region": "US-CAL",
  "accounting": "location_based"
}`,
        response: `{
  "co2e_kg": 247.8,
  "energy_type": "electricity",
  "amount": 1000,
  "unit": "kWh",
  "region": "US-CAL",
  "emission_factor": 0.2478,
  "grid_mix": {
    "renewable": 0.44,
    "natural_gas": 0.38,
    "other": 0.18
  }
}`
      }
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-4">API Endpoints</h2>
        <p className="text-lg text-muted-foreground">
          Complete reference for all FarmlyAPI endpoints with parameters and examples.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Base URL: <code className="bg-muted px-2 py-1 rounded">https://api.farmly.io</code>
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {endpoints.map((endpoint, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Badge variant={endpoint.method === "GET" ? "secondary" : "default"}>
                  {endpoint.method}
                </Badge>
                <span className="font-mono text-sm">{endpoint.path}</span>
                <span className="text-muted-foreground text-sm ml-2">{endpoint.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
              <p className="text-muted-foreground">{endpoint.description}</p>

              <div>
                <h4 className="font-semibold mb-3">Parameters</h4>
                <div className="space-y-2">
                  {endpoint.parameters.map((param, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-muted/50 rounded">
                      <code className="font-mono text-sm font-semibold whitespace-nowrap">{param.name}</code>
                      <Badge variant="outline" className="text-xs">{param.type}</Badge>
                      <Badge variant={param.required ? "destructive" : "secondary"} className="text-xs">
                        {param.required ? "Required" : "Optional"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{param.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Request</h4>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(endpoint.example.request)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    <code>{endpoint.example.request}</code>
                  </pre>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Response</h4>
                    <Button size="sm" variant="ghost" onClick={() => copyToClipboard(endpoint.example.response)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    <code>{endpoint.example.response}</code>
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

// Calculations Section
const CalculationsSection = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-4">Calculation Methodology</h2>
      <p className="text-lg text-muted-foreground">
        Detailed explanation of the scientific methodologies used in FarmlyAPI calculations, 
        following international standards including IPCC 2006 Guidelines, DEFRA 2024, ICAO, IMO, and GLEC Framework.
      </p>
    </div>

    {/* Flight Emissions */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Flight Emissions Calculation
        </CardTitle>
        <CardDescription>
          Based on ICAO Carbon Calculator methodology and DEFRA 2024 emission factors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Distance Calculation</h4>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
            <p className="text-muted-foreground mb-2">Using Haversine Formula for great-circle distance:</p>
            <p>a = sin²(Δφ/2) + cos(φ₁) × cos(φ₂) × sin²(Δλ/2)</p>
            <p>c = 2 × atan2(√a, √(1−a))</p>
            <p>Distance = R × c (where R = 6,371 km)</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Emissions Formulas</h4>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-4">
            <div>
              <p className="text-muted-foreground mb-1">Method 1: Distance-based (DEFRA)</p>
              <p>CO₂e = Distance (km) × Passengers × Distance Factor (kg CO₂/pax-km)</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Method 2: Fuel-based (ICAO)</p>
              <p>Total CO₂e = Fuel (kg) × Emission Factor × Radiative Forcing</p>
              <p>Per Passenger = Total CO₂e × (Pax Weight Factor / Total Load)</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Distance-Based Emission Factors (DEFRA 2024)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Flight Type</th>
                  <th className="text-left py-2">Distance Range</th>
                  <th className="text-left py-2">Economy Class</th>
                  <th className="text-left py-2">Business Class</th>
                  <th className="text-left py-2">First Class</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Short-haul</td>
                  <td className="py-2">&lt; 3,700 km</td>
                  <td className="py-2 font-mono">0.158 kg CO₂/pax-km</td>
                  <td className="py-2 font-mono">0.237 kg CO₂/pax-km</td>
                  <td className="py-2 font-mono">0.237 kg CO₂/pax-km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Medium-haul</td>
                  <td className="py-2">3,700 - 5,500 km</td>
                  <td className="py-2 font-mono">0.151 kg CO₂/pax-km</td>
                  <td className="py-2 font-mono">0.227 kg CO₂/pax-km</td>
                  <td className="py-2 font-mono">0.302 kg CO₂/pax-km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Long-haul</td>
                  <td className="py-2">&gt; 5,500 km</td>
                  <td className="py-2 font-mono">0.146 kg CO₂/pax-km</td>
                  <td className="py-2 font-mono">0.424 kg CO₂/pax-km</td>
                  <td className="py-2 font-mono">0.584 kg CO₂/pax-km</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Aircraft Fuel Burn Rates</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Aircraft Type</th>
                  <th className="text-left py-2">Category</th>
                  <th className="text-left py-2">Fuel Burn Rate</th>
                  <th className="text-left py-2">Typical Capacity</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-mono">A320</td>
                  <td className="py-2">Narrow-body</td>
                  <td className="py-2">2.7 kg/km</td>
                  <td className="py-2">150-180 pax</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">B737</td>
                  <td className="py-2">Narrow-body</td>
                  <td className="py-2">2.5 kg/km</td>
                  <td className="py-2">130-180 pax</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">B777</td>
                  <td className="py-2">Wide-body</td>
                  <td className="py-2">7.8 kg/km</td>
                  <td className="py-2">300-400 pax</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">A350</td>
                  <td className="py-2">Wide-body</td>
                  <td className="py-2">6.2 kg/km</td>
                  <td className="py-2">300-350 pax</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">B787</td>
                  <td className="py-2">Wide-body</td>
                  <td className="py-2">5.8 kg/km</td>
                  <td className="py-2">240-330 pax</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">A380</td>
                  <td className="py-2">Super Jumbo</td>
                  <td className="py-2">12.0 kg/km</td>
                  <td className="py-2">525-853 pax</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-mono">E175</td>
                  <td className="py-2">Regional</td>
                  <td className="py-2">1.8 kg/km</td>
                  <td className="py-2">70-80 pax</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Jet A Emission Factor (IPCC)</p>
            <p className="text-2xl font-bold text-primary">3.16 kg CO₂/kg fuel</p>
            <p className="text-xs text-muted-foreground mt-1">IPCC 2006 Guidelines for Jet A fuel</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Radiative Forcing Multiplier</p>
            <p className="text-2xl font-bold text-primary">1.9×</p>
            <p className="text-xs text-muted-foreground mt-1">Accounts for non-CO₂ effects at altitude</p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Why Radiative Forcing?</h4>
          <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
            Aircraft emissions at altitude have additional climate impacts beyond CO₂ alone. 
            The 1.9× multiplier (recommended by IPCC) accounts for contrails, water vapor, 
            and NOx emissions that contribute to warming. This is optional but recommended for 
            comprehensive climate impact assessment.
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Sea Freight Emissions */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="h-5 w-5" />
          Sea Freight Emissions Calculation
        </CardTitle>
        <CardDescription>
          Based on IMO GHG Studies, GLEC Framework, and GHG Protocol Scope 3 Category 4
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Distance Calculation</h4>
          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p className="text-muted-foreground">
              Sea routes are calculated using real maritime shipping lane networks, not straight-line distances. 
              Our routing engine uses the MARNET densified network with 5000+ waypoints to compute accurate paths 
              that follow established shipping lanes.
            </p>
            <div className="mt-3 p-3 bg-background/50 rounded border">
              <p className="font-mono text-xs">
                Route = PathFinder(origin, destination, maritimeNetwork)<br/>
                Distance = Σ segmentLengths(routeGeometry)
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Primary Calculation Method: Tonne-Kilometre</h4>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
            <p className="text-muted-foreground mb-2">Following GLEC Framework and GHG Protocol:</p>
            <p>CO₂e (kg) = Cargo Weight (tonnes) × Distance (km) × Emission Factor (kg CO₂e/tkm)</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Ship Type Emission Factors (IMO 2020 / DEFRA 2024)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Ship Type</th>
                  <th className="text-left py-2">Size Category</th>
                  <th className="text-left py-2">Emission Factor</th>
                  <th className="text-left py-2">Unit</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Container Ship</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.016</td>
                  <td className="py-2 text-muted-foreground">kg CO₂e/tonne-km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Container Ship</td>
                  <td className="py-2">&gt;8000 TEU</td>
                  <td className="py-2 font-mono">0.008</td>
                  <td className="py-2 text-muted-foreground">kg CO₂e/tonne-km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Container Ship</td>
                  <td className="py-2">&lt;1000 TEU</td>
                  <td className="py-2 font-mono">0.028</td>
                  <td className="py-2 text-muted-foreground">kg CO₂e/tonne-km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Bulk Carrier</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.003</td>
                  <td className="py-2 text-muted-foreground">kg CO₂e/tonne-km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Tanker (Crude)</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.005</td>
                  <td className="py-2 text-muted-foreground">kg CO₂e/tonne-km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Tanker (Product)</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.009</td>
                  <td className="py-2 text-muted-foreground">kg CO₂e/tonne-km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">RoRo Ferry</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.060</td>
                  <td className="py-2 text-muted-foreground">kg CO₂e/tonne-km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">General Cargo</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.012</td>
                  <td className="py-2 text-muted-foreground">kg CO₂e/tonne-km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Refrigerated Cargo</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.018</td>
                  <td className="py-2 text-muted-foreground">kg CO₂e/tonne-km</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">LNG Carrier</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.011</td>
                  <td className="py-2 text-muted-foreground">kg CO₂e/tonne-km</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Alternative Method: Fuel-Based (Tier 2/3)</h4>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
            <p className="text-muted-foreground mb-2">When actual fuel consumption is known:</p>
            <p>CO₂ (kg) = Fuel Consumed (kg) × 3.114</p>
            <p className="mt-2">CH₄ (kg CO₂e) = Fuel (kg) × 0.00006 × 27.9 (GWP)</p>
            <p>N₂O (kg CO₂e) = Fuel (kg) × 0.00018 × 273 (GWP)</p>
            <p className="mt-2 pt-2 border-t">Total CO₂e = CO₂ + CH₄ (CO₂e) + N₂O (CO₂e)</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Marine Fuel Emission Factors</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Fuel Type</th>
                  <th className="text-left py-2">CO₂ (kg/kg fuel)</th>
                  <th className="text-left py-2">CH₄ (g/kg fuel)</th>
                  <th className="text-left py-2">N₂O (g/kg fuel)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">HFO (Heavy Fuel Oil)</td>
                  <td className="py-2 font-mono">3.114</td>
                  <td className="py-2 font-mono">0.06</td>
                  <td className="py-2 font-mono">0.18</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">MGO (Marine Gas Oil)</td>
                  <td className="py-2 font-mono">3.206</td>
                  <td className="py-2 font-mono">0.06</td>
                  <td className="py-2 font-mono">0.18</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">LNG</td>
                  <td className="py-2 font-mono">2.750</td>
                  <td className="py-2 font-mono">6.90</td>
                  <td className="py-2 font-mono">0.11</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">VLSFO</td>
                  <td className="py-2 font-mono">3.151</td>
                  <td className="py-2 font-mono">0.06</td>
                  <td className="py-2 font-mono">0.18</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Key Maritime Passages Detected</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "Suez Canal", "Panama Canal", "Strait of Malacca", "Strait of Gibraltar",
              "Strait of Hormuz", "Bab el-Mandeb", "Singapore Strait", "English Channel",
              "Cape of Good Hope", "Cape Horn", "Bosphorus", "Taiwan Strait",
              "Torres Strait", "Mozambique Channel", "Korea Strait", "Bering Strait"
            ].map((passage, i) => (
              <div key={i} className="px-3 py-2 bg-muted rounded text-sm text-center">
                {passage}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Route Comparison Feature</h4>
          <p className="text-sm text-green-700/80 dark:text-green-300/80">
            Our API supports comparing alternative routes (e.g., Suez vs Cape of Good Hope, Panama vs Cape Horn) 
            to help logistics planners optimize for emissions, cost, or transit time. Route comparisons include 
            distance differentials, estimated transit times, and CO₂e impact analysis.
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Vehicle Emissions */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Vehicle & Road Transport Emissions
        </CardTitle>
        <CardDescription>
          Based on DEFRA 2024 conversion factors and EPA emission standards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Calculation Methods</h4>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-4">
            <div>
              <p className="text-muted-foreground mb-1">Method 1: Fuel-based</p>
              <p>CO₂e (kg) = Fuel Consumed (L) × Fuel Emission Factor (kg CO₂e/L)</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Method 2: Distance-based</p>
              <p>CO₂e (kg) = Distance (km) × Vehicle Factor (kg CO₂e/km)</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Method 3: Freight (tonne-km)</p>
              <p>CO₂e (kg) = Weight (tonnes) × Distance (km) × Freight Factor</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Fuel Emission Factors (DEFRA 2024)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Fuel Type</th>
                  <th className="text-left py-2">CO₂ (kg/L)</th>
                  <th className="text-left py-2">CH₄ (g/L)</th>
                  <th className="text-left py-2">N₂O (g/L)</th>
                  <th className="text-left py-2">Total CO₂e (kg/L)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Petrol (Gasoline)</td>
                  <td className="py-2 font-mono">2.315</td>
                  <td className="py-2 font-mono">0.50</td>
                  <td className="py-2 font-mono">0.22</td>
                  <td className="py-2 font-mono">2.392</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Diesel</td>
                  <td className="py-2 font-mono">2.669</td>
                  <td className="py-2 font-mono">0.06</td>
                  <td className="py-2 font-mono">0.13</td>
                  <td className="py-2 font-mono">2.706</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">LPG</td>
                  <td className="py-2 font-mono">1.560</td>
                  <td className="py-2 font-mono">0.68</td>
                  <td className="py-2 font-mono">0.02</td>
                  <td className="py-2 font-mono">1.584</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">CNG</td>
                  <td className="py-2 font-mono">2.540</td>
                  <td className="py-2 font-mono">3.30</td>
                  <td className="py-2 font-mono">0.01</td>
                  <td className="py-2 font-mono">2.635</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Biodiesel (B20)</td>
                  <td className="py-2 font-mono">2.135</td>
                  <td className="py-2 font-mono">0.06</td>
                  <td className="py-2 font-mono">0.13</td>
                  <td className="py-2 font-mono">2.172</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">E10 Petrol</td>
                  <td className="py-2 font-mono">2.084</td>
                  <td className="py-2 font-mono">0.50</td>
                  <td className="py-2 font-mono">0.22</td>
                  <td className="py-2 font-mono">2.161</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Vehicle Type Emission Factors</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Vehicle Type</th>
                  <th className="text-left py-2">Size/Engine</th>
                  <th className="text-left py-2">kg CO₂e/km</th>
                  <th className="text-left py-2">kg CO₂e/mile</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Small Car</td>
                  <td className="py-2">&lt;1.4L</td>
                  <td className="py-2 font-mono">0.154</td>
                  <td className="py-2 font-mono">0.248</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Medium Car</td>
                  <td className="py-2">1.4-2.0L</td>
                  <td className="py-2 font-mono">0.192</td>
                  <td className="py-2 font-mono">0.309</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Large Car</td>
                  <td className="py-2">&gt;2.0L</td>
                  <td className="py-2 font-mono">0.282</td>
                  <td className="py-2 font-mono">0.454</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Hybrid</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.120</td>
                  <td className="py-2 font-mono">0.193</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Electric (BEV)</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.053</td>
                  <td className="py-2 font-mono">0.085</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Motorcycle</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.114</td>
                  <td className="py-2 font-mono">0.183</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Van</td>
                  <td className="py-2">&lt;3.5t</td>
                  <td className="py-2 font-mono">0.249</td>
                  <td className="py-2 font-mono">0.401</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">HGV Rigid</td>
                  <td className="py-2">7.5-17t</td>
                  <td className="py-2 font-mono">0.518</td>
                  <td className="py-2 font-mono">0.834</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">HGV Articulated</td>
                  <td className="py-2">&gt;33t</td>
                  <td className="py-2 font-mono">0.929</td>
                  <td className="py-2 font-mono">1.495</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Freight Transport Factors (Road)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Vehicle Type</th>
                  <th className="text-left py-2">Load Factor</th>
                  <th className="text-left py-2">kg CO₂e/tonne-km</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">HGV (all diesel)</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.089</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">HGV Articulated</td>
                  <td className="py-2">50% laden</td>
                  <td className="py-2 font-mono">0.053</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">HGV Articulated</td>
                  <td className="py-2">100% laden</td>
                  <td className="py-2 font-mono">0.038</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Van</td>
                  <td className="py-2">Average</td>
                  <td className="py-2 font-mono">0.583</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Energy Emissions */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Energy Emissions Calculation
        </CardTitle>
        <CardDescription>
          Based on GHG Protocol Scope 2 Guidance and regional grid factors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Electricity Emissions (Scope 2)</h4>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-3">
            <div>
              <p className="text-muted-foreground mb-1">Location-based method:</p>
              <p>CO₂e (kg) = Consumption (kWh) × Regional Grid Factor (kg CO₂e/kWh)</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Market-based method:</p>
              <p>CO₂e (kg) = Consumption (kWh) × Supplier Factor (kg CO₂e/kWh)</p>
              <p className="text-xs text-muted-foreground mt-1">Note: RECs/GOs can reduce market-based emissions to zero</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Global Grid Emission Factors (2024)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { region: "US Average", factor: "0.371", trend: "↓" },
              { region: "EU Average", factor: "0.233", trend: "↓" },
              { region: "UK", factor: "0.207", trend: "↓" },
              { region: "Germany", factor: "0.338", trend: "↓" },
              { region: "France", factor: "0.052", trend: "→" },
              { region: "China", factor: "0.555", trend: "↓" },
              { region: "India", factor: "0.708", trend: "↓" },
              { region: "Australia", factor: "0.656", trend: "↓" },
              { region: "Japan", factor: "0.457", trend: "↓" },
              { region: "Brazil", factor: "0.074", trend: "→" },
              { region: "Canada", factor: "0.120", trend: "→" },
              { region: "South Africa", factor: "0.928", trend: "↓" },
            ].map((item, i) => (
              <div key={i} className="p-3 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground">{item.region}</p>
                <p className="font-mono font-semibold">{item.factor}</p>
                <p className="text-xs text-muted-foreground">kg CO₂e/kWh {item.trend}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Natural Gas & Heating Fuels (Scope 1)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Fuel Type</th>
                  <th className="text-left py-2">Unit</th>
                  <th className="text-left py-2">CO₂ (kg)</th>
                  <th className="text-left py-2">CH₄ (g)</th>
                  <th className="text-left py-2">N₂O (g)</th>
                  <th className="text-left py-2">Total CO₂e (kg)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Natural Gas</td>
                  <td className="py-2">kWh</td>
                  <td className="py-2 font-mono">0.183</td>
                  <td className="py-2 font-mono">0.05</td>
                  <td className="py-2 font-mono">0.01</td>
                  <td className="py-2 font-mono">0.187</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Natural Gas</td>
                  <td className="py-2">m³</td>
                  <td className="py-2 font-mono">2.021</td>
                  <td className="py-2 font-mono">0.55</td>
                  <td className="py-2 font-mono">0.11</td>
                  <td className="py-2 font-mono">2.067</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Heating Oil</td>
                  <td className="py-2">L</td>
                  <td className="py-2 font-mono">2.540</td>
                  <td className="py-2 font-mono">0.13</td>
                  <td className="py-2 font-mono">0.01</td>
                  <td className="py-2 font-mono">2.547</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Coal (Industrial)</td>
                  <td className="py-2">kg</td>
                  <td className="py-2 font-mono">2.883</td>
                  <td className="py-2 font-mono">0.55</td>
                  <td className="py-2 font-mono">0.14</td>
                  <td className="py-2 font-mono">2.937</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Wood Pellets</td>
                  <td className="py-2">kg</td>
                  <td className="py-2 font-mono">0.047</td>
                  <td className="py-2 font-mono">0.93</td>
                  <td className="py-2 font-mono">0.47</td>
                  <td className="py-2 font-mono">0.201</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Renewable Energy Certificates (RECs)</h4>
          <p className="text-sm text-amber-700/80 dark:text-amber-300/80">
            When calculating market-based emissions, verified RECs or Guarantees of Origin (GOs) can be applied 
            to reduce Scope 2 emissions. The API supports specifying REC coverage percentage to calculate 
            net emissions after renewable energy procurement.
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Waste Emissions */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Waste Emissions Calculation
        </CardTitle>
        <CardDescription>
          Based on EPA WARM model and DEFRA waste disposal factors
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Calculation Formula</h4>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            <p>CO₂e (kg) = Waste Weight (tonnes) × Emission Factor (kg CO₂e/tonne)</p>
            <p className="text-muted-foreground mt-2 text-xs">
              Factors vary by waste type and disposal method (landfill, incineration, recycling, composting)
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Waste Disposal Emission Factors</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Waste Type</th>
                  <th className="text-left py-2">Landfill</th>
                  <th className="text-left py-2">Incineration</th>
                  <th className="text-left py-2">Recycling</th>
                  <th className="text-left py-2">Composting</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 font-medium">Mixed MSW</td>
                  <td className="py-2 font-mono">446</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">-</td>
                  <td className="py-2 font-mono">-</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Paper/Cardboard</td>
                  <td className="py-2 font-mono">1,042</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">-469</td>
                  <td className="py-2 font-mono">-</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Food Waste</td>
                  <td className="py-2 font-mono">578</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">-</td>
                  <td className="py-2 font-mono">-8</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Garden Waste</td>
                  <td className="py-2 font-mono">578</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">-</td>
                  <td className="py-2 font-mono">-8</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Plastics (Mixed)</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">-1,390</td>
                  <td className="py-2 font-mono">-</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Glass</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">-315</td>
                  <td className="py-2 font-mono">-</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Metals (Mixed)</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">-4,231</td>
                  <td className="py-2 font-mono">-</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Textiles</td>
                  <td className="py-2 font-mono">445</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">-3,169</td>
                  <td className="py-2 font-mono">-</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Electronics (WEEE)</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">-1,000</td>
                  <td className="py-2 font-mono">-</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 font-medium">Construction Waste</td>
                  <td className="py-2 font-mono">21</td>
                  <td className="py-2 font-mono">-</td>
                  <td className="py-2 font-mono">-57</td>
                  <td className="py-2 font-mono">-</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * All values in kg CO₂e/tonne. Negative values indicate avoided emissions from recycling/composting.
          </p>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Circular Economy Benefits</h4>
          <p className="text-sm text-purple-700/80 dark:text-purple-300/80">
            Recycling and composting often result in negative net emissions (avoided emissions) by replacing 
            virgin material production. The API calculates both gross emissions and net emissions after 
            accounting for material recovery benefits.
          </p>
        </div>
      </CardContent>
    </Card>

    {/* GWP Values */}
    <Card>
      <CardHeader>
        <CardTitle>Global Warming Potentials (GWP)</CardTitle>
        <CardDescription>
          FarmlyAPI supports multiple IPCC Assessment Report values for converting GHGs to CO₂ equivalents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Gas</th>
                <th className="text-left py-2">AR4 (2007)</th>
                <th className="text-left py-2">AR5 (2014)</th>
                <th className="text-left py-2 bg-primary/10">AR6 (2021) ✓</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">CO₂</td>
                <td className="py-2 font-mono">1</td>
                <td className="py-2 font-mono">1</td>
                <td className="py-2 font-mono bg-primary/10">1</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">CH₄ (Methane)</td>
                <td className="py-2 font-mono">25</td>
                <td className="py-2 font-mono">28</td>
                <td className="py-2 font-mono bg-primary/10">27.9</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">N₂O (Nitrous Oxide)</td>
                <td className="py-2 font-mono">298</td>
                <td className="py-2 font-mono">265</td>
                <td className="py-2 font-mono bg-primary/10">273</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">HFC-134a</td>
                <td className="py-2 font-mono">1,430</td>
                <td className="py-2 font-mono">1,300</td>
                <td className="py-2 font-mono bg-primary/10">1,526</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">SF₆</td>
                <td className="py-2 font-mono">22,800</td>
                <td className="py-2 font-mono">23,500</td>
                <td className="py-2 font-mono bg-primary/10">24,300</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">NF₃</td>
                <td className="py-2 font-mono">17,200</td>
                <td className="py-2 font-mono">16,100</td>
                <td className="py-2 font-mono bg-primary/10">17,400</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          ✓ AR6 (2021) values are used by default as per latest IPCC guidance. 
          API supports specifying alternative GWP scenarios for regulatory compliance.
        </p>
      </CardContent>
    </Card>

    {/* Standards Compliance */}
    <Card>
      <CardHeader>
        <CardTitle>Standards & Frameworks Compliance</CardTitle>
        <CardDescription>
          FarmlyAPI calculations align with major international emissions accounting standards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "GHG Protocol", desc: "Corporate Standard, Scope 3 Standard", type: "Framework" },
            { name: "IPCC 2006 Guidelines", desc: "Tier 1, 2, and 3 methods", type: "Methodology" },
            { name: "ISO 14064", desc: "GHG inventories and verification", type: "Standard" },
            { name: "DEFRA 2024", desc: "UK Government conversion factors", type: "Data Source" },
            { name: "EPA eGRID", desc: "US regional electricity factors", type: "Data Source" },
            { name: "IEA", desc: "Global electricity emission factors", type: "Data Source" },
            { name: "IMO GHG Studies", desc: "Maritime emission methodologies", type: "Methodology" },
            { name: "GLEC Framework", desc: "Logistics emissions calculation", type: "Framework" },
            { name: "ICAO", desc: "Aviation emissions methodology", type: "Methodology" },
            { name: "SBTi", desc: "Science-based target setting", type: "Framework" },
          ].map((item, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold">{item.name}</p>
                <span className="text-xs bg-muted px-2 py-0.5 rounded">{item.type}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// Emission Factors Section
const EmissionFactorsSection = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-4">Emission Factors</h2>
      <p className="text-lg text-muted-foreground">
        FarmlyAPI uses emission factors from authoritative sources, regularly updated to reflect the latest science.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              { name: "IPCC 2006 Guidelines", desc: "Aviation, stationary combustion" },
              { name: "DEFRA/BEIS 2024", desc: "UK and global emission factors" },
              { name: "EPA eGRID 2023", desc: "US electricity grid factors" },
              { name: "IEA 2023", desc: "International electricity factors" },
              { name: "IMO 2020", desc: "Maritime shipping factors" },
              { name: "ICAO CORSIA", desc: "Aviation methodology" },
            ].map((source, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">{source.name}</p>
                  <p className="text-sm text-muted-foreground">{source.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>Grid emission factors</span>
              <Badge>Quarterly</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>Fuel emission factors</span>
              <Badge>Annually</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>Transport factors</span>
              <Badge>Annually</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>GWP values</span>
              <Badge variant="secondary">Per IPCC AR</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Fuel Emission Factors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Fuel Type</th>
                <th className="text-left py-2">kg CO₂/unit</th>
                <th className="text-left py-2">kg CH₄/unit</th>
                <th className="text-left py-2">kg N₂O/unit</th>
                <th className="text-left py-2">Total CO₂e</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Jet A (per kg)</td>
                <td className="py-2 font-mono">3.16</td>
                <td className="py-2 font-mono">0.00005</td>
                <td className="py-2 font-mono">0.00010</td>
                <td className="py-2 font-mono">3.19</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Diesel (per liter)</td>
                <td className="py-2 font-mono">2.68</td>
                <td className="py-2 font-mono">0.00039</td>
                <td className="py-2 font-mono">0.00024</td>
                <td className="py-2 font-mono">2.75</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Petrol (per liter)</td>
                <td className="py-2 font-mono">2.31</td>
                <td className="py-2 font-mono">0.00086</td>
                <td className="py-2 font-mono">0.00026</td>
                <td className="py-2 font-mono">2.39</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Natural Gas (per kWh)</td>
                <td className="py-2 font-mono">0.184</td>
                <td className="py-2 font-mono">0.00002</td>
                <td className="py-2 font-mono">0.00001</td>
                <td className="py-2 font-mono">0.185</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">LPG (per liter)</td>
                <td className="py-2 font-mono">1.51</td>
                <td className="py-2 font-mono">0.00068</td>
                <td className="py-2 font-mono">0.00011</td>
                <td className="py-2 font-mono">1.56</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Examples Section
const ExamplesSection = ({ copyToClipboard }: { copyToClipboard: (text: string) => void }) => {
  const pythonExample = `import requests

API_KEY = "your_api_key_here"
BASE_URL = "https://api.farmly.io/v1"

def calculate_flight_emission(aircraft_type, distance_km, passengers):
    """Calculate flight emissions using FarmlyAPI"""
    response = requests.post(
        f"{BASE_URL}/calculate-flight-emission",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "aircraftType": aircraft_type,
            "distanceKm": distance_km,
            "passengers": passengers
        }
    )
    return response.json()

# Example usage
result = calculate_flight_emission("A320", 1200, 150)
print(f"Total emissions: {result['totalEmissionKgCO2e']} kg CO₂e")
print(f"Per passenger: {result['emissionPerPassengerKgCO2e']} kg CO₂e")`;

  const jsExample = `const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://api.farmly.io/v1';

async function calculateFlightEmission(aircraftType, distanceKm, passengers) {
  const response = await fetch(\`\${BASE_URL}/calculate-flight-emission\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      aircraftType,
      distanceKm,
      passengers
    })
  });
  
  return response.json();
}

// Example usage
const result = await calculateFlightEmission('A320', 1200, 150);
console.log(\`Total emissions: \${result.totalEmissionKgCO2e} kg CO₂e\`);
console.log(\`Per passenger: \${result.emissionPerPassengerKgCO2e} kg CO₂e\`);`;

  const reactExample = `import { useState } from 'react';

function FlightEmissionCalculator() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateEmissions = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('/api/emissions/flight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aircraftType: formData.get('aircraft'),
          distanceKm: Number(formData.get('distance')),
          passengers: Number(formData.get('passengers'))
        })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={calculateEmissions}>
        <select name="aircraft">
          <option value="A320">Airbus A320</option>
          <option value="B737">Boeing 737</option>
          <option value="B777">Boeing 777</option>
        </select>
        <input name="distance" type="number" placeholder="Distance (km)" />
        <input name="passengers" type="number" placeholder="Passengers" />
        <button type="submit" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate'}
        </button>
      </form>
      
      {result && (
        <div>
          <p>Total: {result.totalEmissionKgCO2e} kg CO₂e</p>
          <p>Per Passenger: {result.emissionPerPassengerKgCO2e} kg CO₂e</p>
        </div>
      )}
    </div>
  );
}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Code Examples</h2>
        <p className="text-lg text-muted-foreground">
          Ready-to-use code examples in popular languages and frameworks.
        </p>
      </div>

      <Tabs defaultValue="python" className="w-full">
        <TabsList>
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          <TabsTrigger value="react">React</TabsTrigger>
        </TabsList>

        <TabsContent value="python" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Python Example</CardTitle>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(pythonExample)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{pythonExample}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="javascript" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>JavaScript Example</CardTitle>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(jsExample)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{jsExample}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="react" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>React Component Example</CardTitle>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(reactExample)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{reactExample}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Errors Section
const ErrorsSection = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-4">Error Handling</h2>
      <p className="text-lg text-muted-foreground">
        FarmlyAPI uses standard HTTP status codes and returns detailed error messages.
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>HTTP Status Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[
            { code: "200", status: "OK", desc: "Request successful" },
            { code: "400", status: "Bad Request", desc: "Invalid parameters or request body" },
            { code: "401", status: "Unauthorized", desc: "Missing or invalid API key" },
            { code: "403", status: "Forbidden", desc: "API key doesn't have access to this resource" },
            { code: "404", status: "Not Found", desc: "Endpoint or resource not found" },
            { code: "422", status: "Unprocessable Entity", desc: "Valid syntax but semantic errors" },
            { code: "429", status: "Too Many Requests", desc: "Rate limit exceeded" },
            { code: "500", status: "Internal Server Error", desc: "Server-side error" },
          ].map((error, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <Badge variant={error.code.startsWith("2") ? "default" : error.code.startsWith("4") ? "secondary" : "destructive"}>
                {error.code}
              </Badge>
              <span className="font-medium w-40">{error.status}</span>
              <span className="text-muted-foreground">{error.desc}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Error Response Format</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
          <code>{`{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "The 'distanceKm' parameter must be a positive number",
    "param": "distanceKm",
    "type": "validation_error"
  },
  "request_id": "req_abc123xyz"
}`}</code>
        </pre>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Common Error Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Code</th>
                <th className="text-left py-2">Description</th>
                <th className="text-left py-2">Resolution</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-mono">INVALID_PARAMETER</td>
                <td className="py-2">Parameter has invalid value</td>
                <td className="py-2 text-muted-foreground">Check parameter types and ranges</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-mono">MISSING_PARAMETER</td>
                <td className="py-2">Required parameter not provided</td>
                <td className="py-2 text-muted-foreground">Include all required parameters</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-mono">INVALID_API_KEY</td>
                <td className="py-2">API key is malformed or revoked</td>
                <td className="py-2 text-muted-foreground">Verify your API key is correct</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-mono">RATE_LIMIT_EXCEEDED</td>
                <td className="py-2">Too many requests</td>
                <td className="py-2 text-muted-foreground">Wait before retrying or upgrade plan</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-mono">UNSUPPORTED_AIRCRAFT</td>
                <td className="py-2">Aircraft type not in database</td>
                <td className="py-2 text-muted-foreground">Use supported aircraft codes</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-mono">AIRPORT_NOT_FOUND</td>
                <td className="py-2">Airport code doesn't exist</td>
                <td className="py-2 text-muted-foreground">Verify IATA/ICAO code</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Carbon Accounting Template Section
const CATSection = () => (
  <div className="space-y-8">
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-4">Carbon Accounting Template (CAT)</h2>
      <p className="text-lg text-muted-foreground leading-relaxed">
        The Carbon Accounting Template is a standardized digital format for recording, tracking, and reporting 
        project-based carbon credits. Based on BeZero Carbon's CAT v1.0, it provides a structured framework 
        for both forecast (ex ante) and verified (ex post) carbon accounting.
      </p>
    </div>

    <Card className="bg-emerald-50/50 border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
          Getting Started
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>Access the Carbon Accounting Template from the <strong>Template</strong> tab on the Farmly dashboard. The template is organized into the following sections:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li><strong>Section 1.1: Project Information</strong> — Core project metadata</li>
          <li><strong>Table 1.2: Project Entities</strong> — Stakeholder details</li>
          <li><strong>Table 1.3: Documentation Links</strong> — Supporting documents</li>
          <li><strong>Table 2.1: Forecast Issuance (Ex Ante)</strong> — Projected carbon credits</li>
          <li><strong>Table 2.2: Ex Post Issuance</strong> — Verified carbon credits</li>
        </ol>
      </CardContent>
    </Card>

    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Section 1.1: Project Information</h3>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Record the basic identifiers and timeline of your carbon project as registered under the relevant standard body.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium">Field</th>
                  <th className="text-left p-2 font-medium">Description</th>
                  <th className="text-left p-2 font-medium">Example</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">1.1.1 Project Name</td><td className="p-2">Official project name as registered</td><td className="p-2">Amazon REDD+ Project</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">1.1.2 Project Country</td><td className="p-2">ISO-3 country code(s)</td><td className="p-2">BRA</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">1.1.3 Standard Body</td><td className="p-2">Accrediting standard body</td><td className="p-2">Verra (VCS)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">1.1.4 Project Code</td><td className="p-2">Registry project identifier</td><td className="p-2">VCS-1234</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">1.1.5 Project Start Date</td><td className="p-2">Date project activities commenced</td><td className="p-2">2020-01-15</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">1.1.6 Crediting Period Start</td><td className="p-2">First date project can claim credits</td><td className="p-2">2020-06-01</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">1.1.7 Crediting Period End</td><td className="p-2">Last date project can claim credits</td><td className="p-2">2050-05-31</td></tr>
                <tr><td className="p-2 font-mono text-xs">1.1.8 Commitment Period</td><td className="p-2">Duration ensuring permanence of credits</td><td className="p-2">30 years</td></tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Table 1.2: Project Entities</h3>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Record all stakeholders involved in the project. Each entity should include their role, legal name, and contact details.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium">Field</th>
                  <th className="text-left p-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">Role</td><td className="p-2">Project Owner, Developer/Proponent, Auditor/VVB, Validation Body, Verification Body</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">Legal Name</td><td className="p-2">Registered legal name of the entity</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">Contact Person</td><td className="p-2">Primary contact individual</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">Address</td><td className="p-2">Registered business address</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">Telephone</td><td className="p-2">Contact phone number</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">Email</td><td className="p-2">Contact email address</td></tr>
                <tr><td className="p-2 font-mono text-xs">Website URL</td><td className="p-2">Entity's website or registry profile URL</td></tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Table 1.3: Documentation Links</h3>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Link to all publicly available project documentation. Supported document types include:
          </p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            {["Project Design Document (PDD)", "Validation Report", "Verification Report", "Monitoring Report", "Non-Permanence Risk Assessment", "Cancellation Certificate"].map((doc, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {doc}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>

    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Table 2.1: Forecast Issuance (Ex Ante)</h3>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Record forecast (projected) carbon credit issuance per vintage year. Data is sourced from the project description, 
            validation report, and non-permanence risk assessment. All values are in <strong>tCO₂e</strong> (tonnes of CO₂ equivalent).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-emerald-50/50">
                  <th className="text-left p-2 font-medium">Column</th>
                  <th className="text-left p-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.1.1 Crediting Period</td><td className="p-2">Sequential crediting period number</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.1.2 Vintage Year</td><td className="p-2">Calendar year the credits correspond to</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.1.3 Baseline Changes</td><td className="p-2">Change in carbon stocks under the baseline scenario (tCO₂e)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.1.4 Project Stock Changes</td><td className="p-2">Actual/projected change in project carbon stocks (tCO₂e)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.1.5 Assumed Leakage</td><td className="p-2">Estimated emissions displaced outside the project boundary (tCO₂e)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.1.6 Risk Buffer Allocation</td><td className="p-2">Credits allocated to the buffer pool for non-permanence risk (tCO₂e)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.1.7 Risk Buffer Release</td><td className="p-2">Credits released from the buffer pool (tCO₂e)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.1.8 Paid Risk Buffer</td><td className="p-2">Buffer credits that have been compensated (tCO₂e)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.1.9 Deducted Credits</td><td className="p-2">Credits deducted for other adjustments (tCO₂e)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs bg-emerald-50">2.1.10 Forecast Issuance</td><td className="p-2 bg-emerald-50"><strong>Net forecast credits to be issued (tCO₂e)</strong></td></tr>
                <tr><td className="p-2 font-mono text-xs">2.1.11 Methodology</td><td className="p-2">Applied methodology (e.g., VM0007, VM0009)</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-muted/50 border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              <strong>Formula:</strong> Forecast Issuance = Baseline Changes − Project Stock Changes − Leakage − Buffer Allocation + Buffer Release − Paid Buffer − Deducted Credits
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Table 2.2: Ex Post Issuance</h3>
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Record verified (actual) carbon credit issuance per vintage year. Data is sourced from monitoring reports 
            and verification reports. Includes additional fields for georeferencing and responsible parties.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-blue-50/50">
                  <th className="text-left p-2 font-medium">Column</th>
                  <th className="text-left p-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.2.1–2.2.9</td><td className="p-2">Same structure as Ex Ante (Period, Vintage, Baseline, Project, Leakage, Buffers, Deductions)</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs bg-blue-50">2.2.10 Ex Post Issuance</td><td className="p-2 bg-blue-50"><strong>Net verified credits issued (tCO₂e)</strong></td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.2.11 Issuance Validation</td><td className="p-2">Validation/verification status</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.2.12 Georef Source</td><td className="p-2">URL to georeferenced project boundary or map data</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.2.13 Project Owner</td><td className="p-2">Auto-populated from Table 1.2 entities</td></tr>
                <tr className="border-b border-border/50"><td className="p-2 font-mono text-xs">2.2.14 Project Developer</td><td className="p-2">Auto-populated from Table 1.2 entities</td></tr>
                <tr><td className="p-2 font-mono text-xs">2.2.15 Project Auditor</td><td className="p-2">Auto-populated from Table 1.2 entities</td></tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-foreground">Saving & Exporting</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Save Template</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Click <strong>Save Template</strong> to store your current data locally. Saved templates appear in the "Saved Templates" section where you can:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Preview the full template in a dialog</li>
              <li>Load and edit a saved template</li>
              <li>Delete templates you no longer need</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Export to CSV</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Click <strong>Export CSV</strong> to download a structured CSV file containing all sections. The export follows the standardized CAT format and includes:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>All project metadata and entity details</li>
              <li>Ex Ante and Ex Post tables with totals</li>
              <li>Documentation links</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>

    <Card className="bg-muted/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Best Practices
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {[
            "All data should be sourced from publicly available project documentation",
            "Use ISO-3 country codes (e.g., BRA, IDN, COD) for the Project Country field",
            "Ensure the crediting period start and end dates align with registry records",
            "Risk buffer allocations should match the non-permanence risk assessment report",
            "Save templates frequently to avoid data loss during extended editing sessions",
            "Use the Preview feature to verify data accuracy before exporting to CSV",
            "Ex Post records should be updated only after verification reports are finalized",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default FarmlyDocs;
