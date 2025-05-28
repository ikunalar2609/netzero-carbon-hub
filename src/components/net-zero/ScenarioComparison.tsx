
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTooltip } from "./CustomTooltip";

const comparePlanData = [
  { year: 2020, current: 100, aggressive: 100, moderate: 100 },
  { year: 2025, current: 76, aggressive: 52, moderate: 65 },
  { year: 2030, current: 52, aggressive: 20, moderate: 40 },
  { year: 2035, current: 33, aggressive: 6, moderate: 20 },
  { year: 2040, current: 14, aggressive: 0, moderate: 5 },
  { year: 2045, current: 0, aggressive: 0, moderate: 0 },
];

export const ScenarioComparison = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Zero Scenario Comparison</CardTitle>
        <CardDescription>Compare different decarbonization strategies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={comparePlanData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e7ff" />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280' }}
                tickFormatter={(value) => `${value}%`}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="current"
                name="Current Plan"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 6, fill: "#3b82f6" }}
                activeDot={{ r: 8, fill: "#3b82f6" }}
              />
              <Line
                type="monotone"
                dataKey="aggressive"
                name="Aggressive Plan"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 6, fill: "#10b981" }}
                activeDot={{ r: 8, fill: "#10b981" }}
              />
              <Line
                type="monotone"
                dataKey="moderate"
                name="Moderate Plan"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 6, fill: "#f59e0b" }}
                activeDot={{ r: 8, fill: "#f59e0b" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
