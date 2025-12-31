import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
  FileText, 
  Leaf, 
  Plane, 
  Ship, 
  Truck, 
  Zap,
  Info,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

const FarmlyDocs = () => {
  const [activeSection, setActiveSection] = useState("overview");

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
                  onClick={() => setActiveSection(section.id)}
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
        Detailed explanation of the scientific methodologies used in FarmlyAPI calculations.
      </p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Flight Emissions Calculation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Formula</h4>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            <p>Total Emissions (kg CO₂e) = Fuel Consumed (kg) × Emission Factor × Radiative Forcing Multiplier</p>
            <p className="mt-2 text-muted-foreground">
              Per Passenger = Total Emissions × (Passenger Weight Factor / Total Load Factor)
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Key Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium">Emission Factor (IPCC)</p>
              <p className="text-2xl font-bold text-primary">3.16 kg CO₂/kg fuel</p>
              <p className="text-xs text-muted-foreground mt-1">IPCC 2006 Guidelines for Jet A fuel</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium">Radiative Forcing Multiplier</p>
              <p className="text-2xl font-bold text-primary">1.9×</p>
              <p className="text-xs text-muted-foreground mt-1">Accounts for non-CO₂ effects (contrails, NOx, etc.)</p>
            </div>
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
                  <td className="py-2 font-mono">E175</td>
                  <td className="py-2">Regional</td>
                  <td className="py-2">1.8 kg/km</td>
                  <td className="py-2">70-80 pax</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Why Radiative Forcing?</h4>
          <p className="text-sm text-blue-700/80 dark:text-blue-300/80">
            Aircraft emissions at altitude have additional climate impacts beyond CO₂ alone. 
            The 1.9× multiplier (recommended by IPCC) accounts for contrails, water vapor, 
            and NOx emissions that contribute to warming but aren't captured in CO₂ measurements alone.
          </p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="h-5 w-5" />
          Freight Emissions Calculation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Formula</h4>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            <p>Emissions (kg CO₂e) = Weight (tonnes) × Distance (km) × Emission Factor (kg CO₂e/tonne-km)</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Modal Emission Factors</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Transport Mode</th>
                  <th className="text-left py-2">Emission Factor</th>
                  <th className="text-left py-2">Source</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Air Freight</td>
                  <td className="py-2 font-mono">0.602 kg CO₂e/tonne-km</td>
                  <td className="py-2 text-muted-foreground">DEFRA 2024</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Road (HGV)</td>
                  <td className="py-2 font-mono">0.089 kg CO₂e/tonne-km</td>
                  <td className="py-2 text-muted-foreground">DEFRA 2024</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Sea (Container)</td>
                  <td className="py-2 font-mono">0.016 kg CO₂e/tonne-km</td>
                  <td className="py-2 text-muted-foreground">IMO 2020</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Rail</td>
                  <td className="py-2 font-mono">0.028 kg CO₂e/tonne-km</td>
                  <td className="py-2 text-muted-foreground">DEFRA 2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Energy Emissions Calculation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold mb-2">Electricity (Scope 2)</h4>
          <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-2">
            <p><strong>Location-based:</strong> Consumption (kWh) × Regional Grid Factor</p>
            <p><strong>Market-based:</strong> Consumption (kWh) × Supplier/REC Factor</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Sample Grid Emission Factors (2024)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { region: "US Average", factor: "0.371" },
              { region: "EU Average", factor: "0.233" },
              { region: "UK", factor: "0.207" },
              { region: "Germany", factor: "0.338" },
              { region: "France", factor: "0.052" },
              { region: "China", factor: "0.555" },
              { region: "India", factor: "0.708" },
              { region: "Australia", factor: "0.656" },
            ].map((item, i) => (
              <div key={i} className="p-3 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground">{item.region}</p>
                <p className="font-mono font-semibold">{item.factor}</p>
                <p className="text-xs text-muted-foreground">kg CO₂e/kWh</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Global Warming Potentials (GWP)</CardTitle>
        <CardDescription>
          FarmlyAPI supports multiple IPCC Assessment Report values for converting GHGs to CO₂ equivalents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Gas</th>
                <th className="text-left py-2">AR4 (2007)</th>
                <th className="text-left py-2">AR5 (2014)</th>
                <th className="text-left py-2">AR6 (2021)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">CO₂</td>
                <td className="py-2 font-mono">1</td>
                <td className="py-2 font-mono">1</td>
                <td className="py-2 font-mono">1</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">CH₄ (Methane)</td>
                <td className="py-2 font-mono">25</td>
                <td className="py-2 font-mono">28</td>
                <td className="py-2 font-mono">27.9</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">N₂O (Nitrous Oxide)</td>
                <td className="py-2 font-mono">298</td>
                <td className="py-2 font-mono">265</td>
                <td className="py-2 font-mono">273</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">HFCs (avg)</td>
                <td className="py-2 font-mono">1,430</td>
                <td className="py-2 font-mono">1,300</td>
                <td className="py-2 font-mono">1,526</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">SF₆</td>
                <td className="py-2 font-mono">22,800</td>
                <td className="py-2 font-mono">23,500</td>
                <td className="py-2 font-mono">24,300</td>
              </tr>
            </tbody>
          </table>
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

export default FarmlyDocs;
