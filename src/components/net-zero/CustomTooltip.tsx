
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] p-2 border border-white/10 rounded-lg shadow-md">
        <p className="font-medium text-sm text-gray-300">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} tCO₂e`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};
