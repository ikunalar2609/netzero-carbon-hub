import { useClimate } from '@/context/ClimateContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Info, TrendingUp, Lightbulb, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const InsightEngine = () => {
  const { insights } = useClimate();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const visibleInsights = insights.filter(i => !dismissedIds.includes(i.id));

  const getIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800';
      case 'critical':
        return 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800';
      default:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800';
    }
  };

  if (visibleInsights.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Climate Intelligence Insights
          <Badge variant="secondary" className="ml-auto">
            {visibleInsights.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {visibleInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getBgColor(insight.type)} relative`}
            >
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={() => setDismissedIds([...dismissedIds, insight.id])}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="flex items-start gap-3 pr-6">
                {getIcon(insight.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{insight.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {insight.metric && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {insight.metric}
                      </span>
                    )}
                    <span>{insight.source}</span>
                  </div>
                </div>
                {insight.delta !== undefined && (
                  <Badge 
                    variant={insight.delta > 0 ? 'default' : 'destructive'}
                    className="shrink-0"
                  >
                    {insight.delta > 0 ? '+' : ''}{insight.delta}
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
