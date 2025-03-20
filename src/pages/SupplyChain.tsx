
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Search, Filter, ArrowUpRight, Globe, Building, TrendingDown } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SupplyChain = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supply Chain</h1>
          <p className="text-muted-foreground">Monitor and optimize your supply chain emissions</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="search" 
              placeholder="Search suppliers..." 
              className="pl-9 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full md:w-[200px]" 
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Supply Chain Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">75,428</div>
            <p className="text-xs text-muted-foreground mt-1">
              tCO₂e (58% of total emissions)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engaged Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">↑ 12%</span> from previous year
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Supply Chain Hotspots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">
              High-impact areas identified
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="hotspots">Carbon Hotspots</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Carbon Map</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-[400px] bg-[#f8f9fa] rounded-b-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <GitBranch className="h-16 w-16 text-muted-foreground opacity-20" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                  <h3 className="text-lg font-medium mb-2">Interactive Supply Chain Map</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                    This interactive visualization will show your entire supply chain with carbon hotspots,
                    supplier locations, and transportation routes.
                  </p>
                  <Button>View Full Map</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Emissions by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Raw Materials</span>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Badge variant="outline" className="cursor-help">
                              32%
                            </Badge>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-semibold">Raw Materials</h4>
                              <p className="text-sm">
                                Includes extraction, processing, and transportation of raw materials used in your products.
                              </p>
                              <div className="pt-2">
                                <p className="text-xs text-muted-foreground">Top contributors:</p>
                                <ul className="text-xs list-disc pl-4 pt-1 space-y-1">
                                  <li>Metal extraction (45%)</li>
                                  <li>Plastic production (32%)</li>
                                  <li>Chemical processing (23%)</li>
                                </ul>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <span className="text-sm font-semibold">24,137 tCO₂e</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Manufacturing</span>
                        <Badge variant="outline">27%</Badge>
                      </div>
                      <span className="text-sm font-semibold">20,366 tCO₂e</span>
                    </div>
                    <Progress value={27} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Logistics & Transport</span>
                        <Badge variant="outline">18%</Badge>
                      </div>
                      <span className="text-sm font-semibold">13,577 tCO₂e</span>
                    </div>
                    <Progress value={18} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Packaging</span>
                        <Badge variant="outline">15%</Badge>
                      </div>
                      <span className="text-sm font-semibold">11,314 tCO₂e</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Services & Others</span>
                        <Badge variant="outline">8%</Badge>
                      </div>
                      <span className="text-sm font-semibold">6,034 tCO₂e</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Initiatives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/50">
                    <div className="bg-brand-green rounded-full p-2 text-white">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Supplier Engagement Program</h4>
                      <p className="text-sm text-muted-foreground">
                        78% of suppliers engaged, target 85% by 2025
                      </p>
                      <Progress value={78} className="h-1.5 mt-2" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/50">
                    <div className="bg-brand-yellow rounded-full p-2 text-white">
                      <Building className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Low-Carbon Materials</h4>
                      <p className="text-sm text-muted-foreground">
                        45% low-carbon alternatives, target 60% by 2026
                      </p>
                      <Progress value={45} className="h-1.5 mt-2" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/50">
                    <div className="bg-brand-gray rounded-full p-2 text-white">
                      <TrendingDown className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Transport Optimization</h4>
                      <p className="text-sm text-muted-foreground">
                        32% emissions reduction, target 50% by 2027
                      </p>
                      <Progress value={32} className="h-1.5 mt-2" />
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-2 gap-1">
                    <span>View All Initiatives</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Carbon Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Emissions (tCO₂e)</TableHead>
                    <TableHead>% of Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">EcoMaterials Inc.</TableCell>
                    <TableCell>Raw Materials</TableCell>
                    <TableCell>8,542</TableCell>
                    <TableCell>11.3%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        On Track
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Global Manufacturing</TableCell>
                    <TableCell>Manufacturing</TableCell>
                    <TableCell>12,358</TableCell>
                    <TableCell>16.4%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                        At Risk
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">FastLogistics</TableCell>
                    <TableCell>Logistics</TableCell>
                    <TableCell>7,245</TableCell>
                    <TableCell>9.6%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        On Track
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">PackPro Solutions</TableCell>
                    <TableCell>Packaging</TableCell>
                    <TableCell>5,823</TableCell>
                    <TableCell>7.7%</TableCell>
                    <TableCell>
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                        Behind
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">GreenTech Components</TableCell>
                    <TableCell>Components</TableCell>
                    <TableCell>4,678</TableCell>
                    <TableCell>6.2%</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        On Track
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex justify-center mt-4">
                <Button variant="outline">Load More</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotspots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Hotspots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-500 rounded-full p-2 text-white mt-1">
                      <TrendingDown className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-800">Aluminum Processing</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        High-energy consumption in aluminum processing accounts for 18% of your supply chain emissions.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-700">
                          18% of Supply Chain Emissions
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-700">
                          High Risk
                        </Badge>
                        <Badge variant="outline" className="bg-green-100 border-green-300 text-green-700">
                          Mitigation Plan Available
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <Button size="sm" variant="outline" className="gap-1 mr-2">
                          View Details
                        </Button>
                        <Button size="sm">
                          Mitigation Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-500 rounded-full p-2 text-white mt-1">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-800">Air Freight</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Air freight transportation from SE Asia accounts for 12% of your supply chain emissions despite representing only 5% of shipments.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-red-100 border-red-300 text-red-700">
                          12% of Supply Chain Emissions
                        </Badge>
                        <Badge variant="outline" className="bg-red-100 border-red-300 text-red-700">
                          Critical Risk
                        </Badge>
                        <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-700">
                          Mitigation In Progress
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <Button size="sm" variant="outline" className="gap-1 mr-2">
                          View Details
                        </Button>
                        <Button size="sm">
                          Mitigation Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-orange-200 bg-orange-50">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-500 rounded-full p-2 text-white mt-1">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800">Plastics Production</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Petroleum-based plastics in packaging and components represent 9% of your supply chain emissions.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-orange-100 border-orange-300 text-orange-700">
                          9% of Supply Chain Emissions
                        </Badge>
                        <Badge variant="outline" className="bg-orange-100 border-orange-300 text-orange-700">
                          Medium Risk
                        </Badge>
                        <Badge variant="outline" className="bg-green-100 border-green-300 text-green-700">
                          Alternatives Identified
                        </Badge>
                      </div>
                      <div className="mt-4">
                        <Button size="sm" variant="outline" className="gap-1 mr-2">
                          View Details
                        </Button>
                        <Button size="sm">
                          Mitigation Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  View All 8 Hotspots
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplyChain;
