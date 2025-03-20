
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
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={pathwayData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#09AB75" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#09AB75" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorBAU" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EA384C" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EA384C" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="year" 
            axisLine={false} 
            tickLine={false}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(value) => `${value}`}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="bau"
            name="Business as Usual"
            stroke="#EA384C"
            fill="url(#colorBAU)"
            strokeDasharray="5 5"
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="emissions"
            name="Actual Emissions"
            stroke="#09AB75"
            fill="url(#colorEmissions)"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="target1"
            name="1.5°C Aligned Path"
            stroke="#FFC745"
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
          <Line
            type="monotone"
            dataKey="target2"
            name="Accelerated Net Zero"
            stroke="#4A5B6B"
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
