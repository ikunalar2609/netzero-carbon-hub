
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, BarChart3, Filter, Download, Upload, Plus 
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const yearlyData = [
  { year: "2020", scope1: 35, scope2: 48, scope3: 85, total: 168 },
  { year: "2021", scope1: 34, scope2: 45, scope3: 82, total: 161 },
  { year: "2022", scope1: 32, scope2: 42, scope3: 80, total: 154 },
  { year: "2023", scope1: 30, scope2: 38, scope3: 78, total: 146 },
  { year: "2024", scope1: 28, scope2: 34, scope3: 75, total: 137 },
];

const monthlyData = [
  { month: "Jan", scope1: 3.2, scope2: 4.1, scope3: 6.8, total: 14.1 },
  { month: "Feb", scope1: 3.0, scope2: 3.8, scope3: 6.5, total: 13.3 },
  { month: "Mar", scope1: 3.1, scope2: 3.5, scope3: 6.7, total: 13.3 },
  { month: "Apr", scope1: 2.9, scope2: 3.4, scope3: 6.4, total: 12.7 },
  { month: "May", scope1: 2.7, scope2: 3.3, scope3: 6.2, total: 12.2 },
  { month: "Jun", scope1: 2.8, scope2: 3.1, scope3: 6.3, total: 12.2 },
  { month: "Jul", scope1: 2.6, scope2: 2.9, scope3: 6.1, total: 11.6 },
  { month: "Aug", scope1: 2.5, scope2: 2.8, scope3: 6.0, total: 11.3 },
  { month: "Sep", scope1: 2.3, scope2: 2.6, scope3: 5.8, total: 10.7 },
  { month: "Oct", scope1: 2.2, scope2: 2.5, scope3: 5.7, total: 10.4 },
  { month: "Nov", scope1: 2.0, scope2: 2.3, scope3: 5.5, total: 9.8 },
  { month: "Dec", scope1: 1.8, scope2: 2.1, scope3: 5.2, total: 9.1 },
];

const comparisonData = [
  { category: "Energy", current: 48, previous: 58, target: 40 },
  { category: "Transportation", current: 32, previous: 37, target: 25 },
  { category: "Manufacturing", current: 28, previous: 30, target: 22 },
  { category: "Procurement", current: 35, previous: 42, target: 30 },
  { category: "Waste", current: 15, previous: 18, target: 10 },
];

const intensityData = [
  { year: "2020", emissions: 168, revenue: 85, intensity: 1.98 },
  { year: "2021", emissions: 161, revenue: 90, intensity: 1.79 },
  { year: "2022", emissions: 154, revenue: 98, intensity: 1.57 },
  { year: "2023", emissions: 146, revenue: 105, intensity: 1.39 },
  { year: "2024", emissions: 137, revenue: 112, intensity: 1.22 },
];

const EmissionsTracker = () => {
  const [timeframe, setTimeframe] = useState("yearly");

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emissions Tracker</h1>
          <p className="text-muted-foreground">Monitor and analyze your emissions data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button size="sm" className="gap-1">
            <Upload className="h-4 w-4" />
            <span>Import Data</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview" className="flex gap-1">
              <BarChart className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>Detailed Analysis</span>
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Metrics</span>
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Emissions (tCO₂e)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">137,423</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">↓ 6.2%</span> from previous year
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Year-to-Date Reduction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">-18.2%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  vs. 2020 baseline
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Carbon Intensity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1.22</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">↓ 12.2%</span> tCO₂e per $M revenue
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Emissions Trend</CardTitle>
                  <CardDescription>
                    Track emissions across all scopes
                  </CardDescription>
                </div>
                <Tabs 
                  defaultValue="yearly" 
                  value={timeframe} 
                  onValueChange={setTimeframe}
                >
                  <TabsList>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeframe === "yearly" ? yearlyData : monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="scope1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#09AB75" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#09AB75" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="scope2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFC745" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#FFC745" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="scope3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4A5B6B" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4A5B6B" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey={timeframe === "yearly" ? "year" : "month"} 
                      axisLine={false} 
                      tickLine={false}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tickFormatter={(value) => `${value}`}
                    />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <Tooltip 
                      formatter={(value) => [`${value} tCO₂e`, ""]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="scope1" 
                      stackId="1"
                      stroke="#09AB75" 
                      fill="url(#scope1)" 
                      name="Scope 1"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="scope2" 
                      stackId="1"
                      stroke="#FFC745" 
                      fill="url(#scope2)" 
                      name="Scope 2"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="scope3" 
                      stackId="1"
                      stroke="#4A5B6B" 
                      fill="url(#scope3)" 
                      name="Scope 3"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Category Comparison</CardTitle>
                <CardDescription>
                  Compare current vs. previous period and targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={comparisonData}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid stroke="#f5f5f5" vertical={false} />
                      <XAxis 
                        dataKey="category" 
                        scale="band" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="previous" name="Previous Period" fill="#AFBBC3" radius={[4, 4, 0, 0]} barSize={20} />
                      <Bar dataKey="current" name="Current Period" fill="#09AB75" radius={[4, 4, 0, 0]} barSize={20} />
                      <Line
                        type="monotone"
                        dataKey="target"
                        name="Target"
                        stroke="#FFC745"
                        strokeWidth={2}
                        dot={{ r: 5 }}
                        activeDot={{ r: 8 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Intensity</CardTitle>
                <CardDescription>
                  Emissions per $M revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={intensityData}
                      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                      <CartesianGrid stroke="#f5f5f5" vertical={false} />
                      <XAxis 
                        dataKey="year" 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        yAxisId="left"
                        axisLine={false} 
                        tickLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        axisLine={false} 
                        tickLine={false}
                        domain={[0, 2.5]}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        yAxisId="left"
                        dataKey="emissions" 
                        name="Total Emissions (tCO₂e)" 
                        fill="#09AB75" 
                        radius={[4, 4, 0, 0]} 
                        barSize={30} 
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="intensity"
                        name="Carbon Intensity"
                        stroke="#FFC745"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis Coming Soon</CardTitle>
              <CardDescription>
                This section will contain detailed emissions analysis by source, location, and more.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Detailed Analysis</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Coming soon. This feature will provide in-depth analysis of your emissions 
                  data, allowing you to drill down into specific categories and sources.
                </p>
                <Button className="mt-4">Request Early Access</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmissionsTracker;
