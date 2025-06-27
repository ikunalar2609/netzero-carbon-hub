
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Eye } from "lucide-react";

export const ClimateDataExplorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  const mockData = [
    {
      id: 1,
      name: "Electricity Grid - United States",
      category: "Energy",
      region: "US",
      factor: 0.4205,
      unit: "kg CO2e/kWh",
      methodology: "AR6",
      source: "EPA eGRID 2021",
      lastUpdated: "2023-01-15"
    },
    {
      id: 2,
      name: "Passenger Car - Gasoline",
      category: "Transportation",
      region: "Global",
      factor: 0.192,
      unit: "kg CO2e/km",
      methodology: "AR5",
      source: "IPCC 2014",
      lastUpdated: "2022-11-20"
    },
    {
      id: 3,
      name: "Natural Gas Combustion",
      category: "Energy",
      region: "Global",
      factor: 2.03,
      unit: "kg CO2e/m³",
      methodology: "AR6",
      source: "IPCC 2021",
      lastUpdated: "2023-03-10"
    },
    {
      id: 4,
      name: "Air Freight - International",
      category: "Transportation",
      region: "Global",
      factor: 1.23,
      unit: "kg CO2e/t·km",
      methodology: "AR6",
      source: "ICAO 2022",
      lastUpdated: "2023-02-28"
    },
    {
      id: 5,
      name: "Cloud Computing - AWS EC2",
      category: "Digital",
      region: "US-East",
      factor: 0.056,
      unit: "kg CO2e/hour",
      methodology: "AR6",
      source: "AWS 2023",
      lastUpdated: "2023-04-15"
    }
  ];

  const filteredData = mockData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesRegion = regionFilter === "all" || item.region.toLowerCase() === regionFilter.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesRegion;
  });

  const categories = ["all", "Energy", "Transportation", "Digital"];
  const regions = ["all", "Global", "US", "EU", "UK"];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4">Data Explorer</h2>
        <p className="text-muted-foreground mb-6">
          Search and explore our comprehensive database of emission factors.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search emission factors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region === "all" ? "All Regions" : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {filteredData.length} emission factors found
          </h3>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{item.name}</h4>
                        <Badge variant="secondary">{item.category}</Badge>
                        <Badge variant="outline">{item.region}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Emission Factor:</span>
                          <div className="font-semibold text-green-600">
                            {item.factor} {item.unit}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Methodology:</span>
                          <div className="font-semibold">{item.methodology}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Source:</span>
                          <div className="font-semibold">{item.source}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Updated:</span>
                          <div className="font-semibold">{item.lastUpdated}</div>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
