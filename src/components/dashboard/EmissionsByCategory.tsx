
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useState } from "react";

const SCOPE1_DATA = [
  { name: "Stationary Combustion", value: 35, color: "#09AB75" },
  { name: "Mobile Combustion", value: 25, color: "#33BF8E" },
  { name: "Process Emissions", value: 20, color: "#66CFAA" },
  { name: "Fugitive Emissions", value: 20, color: "#99DFC7" },
];

const SCOPE2_DATA = [
  { name: "Electricity", value: 50, color: "#FFC745" },
  { name: "Steam", value: 20, color: "#FFD666" },
  { name: "Heating", value: 15, color: "#FFE499" },
  { name: "Cooling", value: 15, color: "#FFF1CC" },
];

const SCOPE3_DATA = [
  { name: "Purchased Goods", value: 30, color: "#4A5B6B" },
  { name: "Business Travel", value: 15, color: "#5F7787" },
  { name: "Employee Commuting", value: 10, color: "#8799A5" },
  { name: "Waste", value: 15, color: "#AFBBC3" },
  { name: "Transportation", value: 30, color: "#D7DDE1" },
];

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
  const [scope, setScope] = useState("scope1");

  const data = scope === "scope1" 
    ? SCOPE1_DATA 
    : scope === "scope2" 
      ? SCOPE2_DATA 
      : SCOPE3_DATA;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Emissions by Category</CardTitle>
        <Tabs defaultValue="scope1" value={scope} onValueChange={setScope} className="h-8">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="scope1" className="text-xs h-8">Scope 1</TabsTrigger>
            <TabsTrigger value="scope2" className="text-xs h-8">Scope 2</TabsTrigger>
            <TabsTrigger value="scope3" className="text-xs h-8">Scope 3</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default EmissionsByCategory;
