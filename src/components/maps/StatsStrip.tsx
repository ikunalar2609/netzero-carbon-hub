import React from "react";
import { Flame, AlertTriangle, TreePine, TrendingDown, BarChart3 } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
}

interface StatsStripProps {
  stats: StatItem[];
}

const StatCard = React.memo(({ label, value, icon: Icon, accent }: StatItem) => (
  <div className="bg-white rounded-xl border border-gray-200/80 p-3 relative overflow-hidden">
    <div className="absolute -right-3 -top-3 w-14 h-14 rounded-full opacity-[0.05]" style={{ backgroundColor: accent }} />
    <div className="flex items-center justify-between mb-1">
      <span className="text-[8px] font-extrabold tracking-[0.15em] text-gray-400 uppercase">{label}</span>
      <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: `${accent}12` }}>
        <Icon className="h-2.5 w-2.5" style={{ color: accent }} />
      </div>
    </div>
    <span className="text-lg font-extrabold text-gray-900 tracking-tight leading-none">{value}</span>
  </div>
));
StatCard.displayName = "StatCard";

const StatsStrip = React.memo(({ stats }: StatsStripProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
    {stats.map((s) => <StatCard key={s.label} {...s} />)}
  </div>
));
StatsStrip.displayName = "StatsStrip";

export default StatsStrip;
export { Flame, AlertTriangle, TreePine, TrendingDown, BarChart3 };
