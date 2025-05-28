
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";

const pathwayData = [
  { year: 2020, emissions: 168, bau: 168, target1: 168, target2: 168 },
  { year: 2021, emissions: 161, bau: 170, target1: 160, target2: 150 },
  { year: 2022, emissions: 154, bau: 172, target1: 152, target2: 133 },
  { year: 2023, emissions: 146, bau: 175, target1: 144, target2: 117 },
  { year: 2024, emissions: 137, bau: 177, target1: 136, target2: 102 },
  { year: 2025, emissions: null, bau: 180, target1: 128, target2: 88 },
  { year: 2026, emissions: null, bau: 182, target1: 120, target2: 75 },
  { year: 2027, emissions: null, bau: 185, target1: 112, target2: 63 },
  { year: 2028, emissions: null, bau: 187, target1: 104, target2: 52 },
  { year: 2029, emissions: null, bau: 190, target1: 96, target2: 42 },
  { year: 2030, emissions: null, bau: 192, target1: 88, target2: 33 },
  { year: 2035, emissions: null, bau: 205, target1: 56, target2: 10 },
  { year: 2040, emissions: null, bau: 220, target1: 24, target2: 0 },
];

export const EmissionsPathwayChart = () => {
  return (
    <div className="h-[450px] bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={pathwayData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <defs>
            <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e40af" stopOpacity={0.9} />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="colorBAU" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#ef4444" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#fca5a5" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="target1Gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="target2Gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#8b5cf6" />
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
            tickFormatter={(value) => `${value}`}
            domain={[0, 'dataMax + 20']}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="bau"
            name="Business as Usual"
            stroke="#dc2626"
            strokeWidth={3}
            fill="url(#colorBAU)"
            strokeDasharray="8 4"
            activeDot={false}
            animationDuration={1500}
          />
          <Area
            type="monotone"
            dataKey="emissions"
            name="Actual Emissions"
            stroke="#1e40af"
            strokeWidth={4}
            fill="url(#colorEmissions)"
            activeDot={{ r: 8, strokeWidth: 3, stroke: "#ffffff" }}
            animationDuration={1500}
            animationDelay={300}
          />
          <Line
            type="monotone"
            dataKey="target1"
            name="1.5°C Aligned Path"
            stroke="url(#target1Gradient)"
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 8, strokeWidth: 3, stroke: "#ffffff" }}
            animationDuration={1500}
            animationDelay={600}
          />
          <Line
            type="monotone"
            dataKey="target2"
            name="Accelerated Net Zero"
            stroke="url(#target2Gradient)"
            strokeWidth={4}
            dot={false}
            activeDot={{ r: 8, strokeWidth: 3, stroke: "#ffffff" }}
            animationDuration={1500}
            animationDelay={900}
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
  );
};
