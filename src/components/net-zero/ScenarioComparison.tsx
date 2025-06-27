import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
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
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Net Zero Scenario Comparison
        </CardTitle>
        <CardDescription className="text-gray-600">Compare different decarbonization strategies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={comparePlanData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <defs>
                <linearGradient id="currentGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="aggressiveGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="moderateGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.6} />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 'dataMax + 10']}
              />
              <RechartsTooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="current"
                name="Current Plan"
                stroke="url(#currentGradient)"
                strokeWidth={4}
                dot={{ r: 8, fill: "#1e40af", strokeWidth: 3, stroke: "#ffffff" }}
                activeDot={{ r: 10, fill: "#1e40af", strokeWidth: 3, stroke: "#ffffff" }}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="aggressive"
                name="Aggressive Plan"
                stroke="url(#aggressiveGradient)"
                strokeWidth={4}
                dot={{ r: 8, fill: "#059669", strokeWidth: 3, stroke: "#ffffff" }}
                activeDot={{ r: 10, fill: "#059669", strokeWidth: 3, stroke: "#ffffff" }}
                animationDuration={1500}
              />
              <Line
                type="monotone"
                dataKey="moderate"
                name="Moderate Plan"
                stroke="url(#moderateGradient)"
                strokeWidth={4}
                dot={{ r: 8, fill: "#d97706", strokeWidth: 3, stroke: "#ffffff" }}
                activeDot={{ r: 10, fill: "#d97706", strokeWidth: 3, stroke: "#ffffff" }}
                animationDuration={1500}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="line"
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
