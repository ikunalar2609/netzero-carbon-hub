
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { year: 2020, baseline: 1000, withProjects: 1000, netZeroTarget: 1000 },
  { year: 2025, baseline: 1100, withProjects: 950, netZeroTarget: 750 },
  { year: 2030, baseline: 1200, withProjects: 800, netZeroTarget: 500 },
  { year: 2035, baseline: 1300, withProjects: 600, netZeroTarget: 250 },
  { year: 2040, baseline: 1400, withProjects: 400, netZeroTarget: 100 },
  { year: 2045, baseline: 1500, withProjects: 200, netZeroTarget: 50 },
  { year: 2050, baseline: 1600, withProjects: 0, netZeroTarget: 0 },
];

const EmissionsPathwayChart = () => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorBaseline" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="year" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'CO₂ Emissions (tCO₂e)', angle: -90, position: 'insideLeft' }}
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
          <Area 
            type="monotone" 
            dataKey="baseline" 
            name="Business as Usual"
            stroke="#EF4444"
            strokeWidth={2}
            fill="url(#colorBaseline)"
            activeDot={{ 
              r: 6, 
              strokeWidth: 2,
              stroke: "#EF4444"
            }}
            animationDuration={1500}
          />
          <Line 
            type="monotone" 
            dataKey="withProjects" 
            name="With Reduction Projects"
            stroke="#10B981"
            strokeWidth={3}
            dot={false}
            activeDot={{ 
              r: 6, 
              strokeWidth: 2,
              stroke: "#10B981"
            }}
            animationDuration={1500}
          />
          <Line 
            type="monotone" 
            dataKey="netZeroTarget" 
            name="Net Zero Target"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={false}
            activeDot={{ 
              r: 6, 
              strokeWidth: 2,
              stroke: "#3B82F6"
            }}
            animationDuration={1500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionsPathwayChart;
