
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Scope 1",
    total: 32.5,
    color: "#09AB75",
  },
  {
    name: "Scope 2",
    total: 45.8,
    color: "#FFC745",
  },
  {
    name: "Scope 3",
    total: 78.2,
    color: "#4A5B6B",
  },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-sm">{payload[0].payload.name}</p>
        <p className="text-brand-green-600 text-sm font-semibold">{`${payload[0].value} tCO₂e`}</p>
      </div>
    );
  }

  return null;
};

const ScopeBreakdown = () => {
  const getTotal = () => {
    return data.reduce((acc, curr) => acc + curr.total, 0).toFixed(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Emissions Breakdown</CardTitle>
        <CardDescription>
          Total emissions: {getTotal()} tCO₂e
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
              barSize={40}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f5' }} />
              <Bar
                dataKey="total"
                radius={[4, 4, 0, 0]}
                fill="#09AB75"
                label={{ 
                  position: 'top', 
                  fontSize: 12,
                  formatter: (value: number) => `${value}`,
                  fill: '#666'
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScopeBreakdown;
