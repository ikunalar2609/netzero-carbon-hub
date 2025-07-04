
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, Play } from "lucide-react";
import { toast } from "sonner";

export const ApiDocumentation = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("basic-estimate");

  const endpoints = {
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
          Comprehensive documentation for all Climatiq API endpoints with examples and code snippets.
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

url = "https://api.climatiq.io${currentEndpoint.url}"
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
                        <code>{`const response = await fetch('https://api.climatiq.io${currentEndpoint.url}', {
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
