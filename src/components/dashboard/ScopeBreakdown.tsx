
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { CategoryEmission } from "@/models/emissions.model";
import { getCategoryEmissions } from "@/services/emissions.service";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const EmissionsByCategory = () => {
  const [scope, setScope] = useState<"scope1" | "scope2" | "scope3">("scope1");
  const [data, setData] = useState<CategoryEmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getCategoryEmissions(scope);
        setData(result);
        setError(null);
      } catch (err) {
        setError("Failed to load category emissions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scope]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Emissions by Category</CardTitle>
        <Tabs defaultValue="scope1" value={scope} onValueChange={(value) => setScope(value as "scope1" | "scope2" | "scope3")} className="h-8">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="scope1" className="text-xs h-8">Scope 1</TabsTrigger>
            <TabsTrigger value="scope2" className="text-xs h-8">Scope 2</TabsTrigger>
            <TabsTrigger value="scope3" className="text-xs h-8">Scope 3</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[280px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="h-[280px] flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, ""]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    border: "none",
                  }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: "20px" }}
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmissionsByCategory;
