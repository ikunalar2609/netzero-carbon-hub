import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const yearlyData = [
  { year: "2023", target: 125, actual: 122 },
  { year: "2024", target: 110, actual: 103 },
  { year: "2025", target: 95, actual: null },
  { year: "2026", target: 80, actual: null },
  { year: "2027", target: 65, actual: null },
  { year: "2028", target: 50, actual: null },
  { year: "2029", target: 35, actual: null },
  { year: "2030", target: 20, actual: null },
];

const quarterlyData = [
  { quarter: "Q1 2023", target: 130, actual: 127 },
  { quarter: "Q2 2023", target: 128, actual: 125 },
  { quarter: "Q3 2023", target: 126, actual: 123 },
  { quarter: "Q4 2023", target: 125, actual: 122 },
  { quarter: "Q1 2024", target: 120, actual: 115 },
  { quarter: "Q2 2024", target: 115, actual: 108 },
  { quarter: "Q3 2024", target: 112, actual: 103 },
  { quarter: "Q4 2024", target: 110, actual: null },
];

const monthlyData = [
  { month: "Jan", target: 127, actual: 128 },
  { month: "Feb", target: 126, actual: 126 },
  { month: "Mar", target: 126, actual: 124 },
  { month: "Apr", target: 125, actual: 123 },
  { month: "May", target: 125, actual: 122 },
  { month: "Jun", target: 124, actual: 121 },
  { month: "Jul", target: 124, actual: 120 },
  { month: "Aug", target: 123, actual: 118 },
  { month: "Sep", target: 123, actual: 115 },
  { month: "Oct", target: 122, actual: 112 },
  { month: "Nov", target: 122, actual: 108 },
  { month: "Dec", target: 121, actual: 103 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-xl backdrop-blur-sm">
        <p className="font-semibold text-sm text-gray-700 mb-2">{label}</p>
        <div className="space-y-2">
          {payload.map((entry) => (
            entry.value !== null && (
              <div key={entry.name} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full mr-3 shadow-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <p className="text-sm font-medium">
                  {entry.name}: <span className="font-bold text-gray-900">{entry.value}</span> tCO₂e
                </p>
              </div>
            )
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const EmissionsChart = () => {
  const [period, setPeriod] = useState("yearly");

  const data = period === "yearly" 
    ? yearlyData 
    : period === "quarterly" 
      ? quarterlyData 
      : monthlyData;

  const xKey = period === "yearly" 
    ? "year" 
    : period === "quarterly" 
      ? "quarter" 
      : "month";

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Net Zero Tracker
        </CardTitle>
        <Tabs defaultValue="yearly" value={period} onValueChange={setPeriod} className="h-8">
          <TabsList className="grid grid-cols-3 h-8 w-auto bg-gray-100">
            <TabsTrigger value="monthly" className="text-xs h-8 font-medium">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly" className="text-xs h-8 font-medium">Quarterly</TabsTrigger>
            <TabsTrigger value="yearly" className="text-xs h-8 font-medium">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <defs>
                <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#fcd34d" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e40af" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey={xKey} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} 
                domain={[0, 'dataMax + 20']}
                tickFormatter={(value) => `${value}`}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#d97706"
                strokeWidth={4}
                fill="url(#targetGradient)"
                name="Target"
                activeDot={{ r: 8, strokeWidth: 3, stroke: "#ffffff" }}
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#1e40af"
                strokeWidth={4}
                fill="url(#actualGradient)"
                name="Actual"
                activeDot={{ r: 8, strokeWidth: 3, stroke: "#ffffff" }}
                animationDuration={1500}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmissionsChart;
