
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', scope1: 120, scope2: 80, scope3: 200 },
  { month: 'Feb', scope1: 115, scope2: 85, scope3: 190 },
  { month: 'Mar', scope1: 110, scope2: 90, scope3: 180 },
  { month: 'Apr', scope1: 105, scope2: 88, scope3: 175 },
  { month: 'May', scope1: 100, scope2: 85, scope3: 170 },
  { month: 'Jun', scope1: 95, scope2: 82, scope3: 165 },
];

const EmissionsChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScope1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorScope2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorScope3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis 
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
            dataKey="scope1" 
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#colorScope1)"
            name="Scope 1"
            activeDot={{ 
              r: 6, 
              strokeWidth: 2,
              stroke: "#3B82F6"
            }}
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="scope2" 
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#colorScope2)"
            name="Scope 2"
            activeDot={{ 
              r: 6, 
              strokeWidth: 2,
              stroke: "#10B981"
            }}
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="scope3" 
            stroke="#F59E0B"
            strokeWidth={2}
            fill="url(#colorScope3)"
            name="Scope 3"
            activeDot={{ 
              r: 6, 
              strokeWidth: 2,
              stroke: "#F59E0B"
            }}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionsChart;
