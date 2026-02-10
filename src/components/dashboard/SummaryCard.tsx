
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: LucideIcon;
  className?: string;
}

const SummaryCard = ({
  title,
  value,
  description,
  trend,
  icon: Icon,
  className,
}: SummaryCardProps) => {
  return (
    <Card className={cn("overflow-hidden transition-all duration-200 hover:shadow-lg bg-[#141414] border-white/10", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-emerald-500" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {(description || trend) && (
          <div className="flex items-center mt-1">
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium mr-2",
                  trend.isPositive ? "text-emerald-400" : "text-red-400"
                )}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
            {description && (
              <p className="text-xs text-gray-500">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
