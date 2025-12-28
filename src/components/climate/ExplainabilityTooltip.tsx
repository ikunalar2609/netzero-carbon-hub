import { useClimate } from '@/context/ClimateContext';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Info, Database, Clock, Percent } from 'lucide-react';
import { format } from 'date-fns';
import { ReactNode } from 'react';

interface ExplainabilityTooltipProps {
  metricKey: string;
  children: ReactNode;
  showIcon?: boolean;
}

export const ExplainabilityTooltip = ({ 
  metricKey, 
  children, 
  showIcon = true 
}: ExplainabilityTooltipProps) => {
  const { getExplainability } = useClimate();
  const explanation = getExplainability(metricKey);

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <span className="cursor-help inline-flex items-center gap-1">
          {children}
          {showIcon && (
            <Info className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">How this is calculated</span>
            <Badge variant="outline" className="text-xs">
              <Percent className="h-3 w-3 mr-1" />
              {explanation.confidence}% confidence
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="p-2 bg-muted rounded-md">
              <code className="text-xs">{explanation.formula}</code>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Database className="h-3 w-3" />
                Data Sources
              </div>
              <ul className="text-xs space-y-1">
                {explanation.dataSources.map((source, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {source}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
              <Clock className="h-3 w-3" />
              Last updated: {format(explanation.lastUpdated, 'MMM d, yyyy HH:mm')}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
