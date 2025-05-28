
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { year: 2024, conservative: 1000, moderate: 1000, aggressive: 1000 },
  { year: 2026, conservative: 950, moderate: 900, aggressive: 800 },
  { year: 2028, conservative: 900, moderate: 750, aggressive: 600 },
  { year: 2030, conservative: 850, moderate: 600, aggressive: 400 },
  { year: 2032, conservative: 800, moderate: 450, aggressive: 250 },
  { year: 2034, conservative: 750, moderate: 300, aggressive: 100 },
  { year: 2036, conservative: 700, moderate: 200, aggressive: 50 },
  { year: 2038, conservative: 650, moderate: 100, aggressive: 0 },
  { year: 2040, conservative: 600, moderate: 50, aggressive: 0 },
  { year: 2042, conservative: 550, moderate: 0, aggressive: 0 },
  { year: 2044, conservative: 500, moderate: 0, aggressive: 0 },
  { year: 2046, conservative: 450, moderate: 0, aggressive: 0 },
  { year: 2048, conservative: 400, moderate: 0, aggressive: 0 },
  { year: 2050, conservative: 350, moderate: 0, aggressive: 0 },
];

const ScenarioComparison = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Scenario Comparison</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="year" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Emissions (tCO₂e)', angle: -90, position: 'insideLeft' }}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="conservative" 
              name="Conservative Scenario"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ 
                r: 4, 
                fill: "#F59E0B",
                strokeWidth: 2,
                stroke: "#F59E0B"
              }}
              activeDot={{ 
                r: 6, 
                fill: "#F59E0B",
                strokeWidth: 2,
                stroke: "#F59E0B"
              }}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="moderate" 
              name="Moderate Scenario"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ 
                r: 4, 
                fill: "#3B82F6",
                strokeWidth: 2,
                stroke: "#3B82F6"
              }}
              activeDot={{ 
                r: 6, 
                fill: "#3B82F6",
                strokeWidth: 2,
                stroke: "#3B82F6"
              }}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="aggressive" 
              name="Aggressive Scenario"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ 
                r: 4, 
                fill: "#10B981",
                strokeWidth: 2,
                stroke: "#10B981"
              }}
              activeDot={{ 
                r: 6, 
                fill: "#10B981",
                strokeWidth: 2,
                stroke: "#10B981"
              }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScenarioComparison;
