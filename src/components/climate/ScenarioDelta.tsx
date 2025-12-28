import { useClimate, ScenarioType } from '@/context/ClimateContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingDown, DollarSign, Calendar, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScenarioDeltaProps {
  fromScenario?: ScenarioType;
  toScenario?: ScenarioType;
  compact?: boolean;
}

export const ScenarioDelta = ({ 
  fromScenario = 'current', 
  toScenario = 'aggressive',
  compact = false 
}: ScenarioDeltaProps) => {
  const { getScenarioDelta, scenarios } = useClimate();
  const delta = getScenarioDelta(fromScenario, toScenario);

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
        <span className="text-sm text-muted-foreground">
          {scenarios[fromScenario].name} → {scenarios[toScenario].name}:
        </span>
        <Badge variant={delta.yearsSaved > 0 ? 'default' : 'secondary'}>
          {delta.yearsSaved > 0 ? '-' : '+'}{Math.abs(delta.yearsSaved)} years
        </Badge>
        <Badge variant={delta.emissionsReduced > 0 ? 'default' : 'destructive'}>
          {delta.emissionsReduced > 0 ? '-' : '+'}{Math.abs(delta.emissionsReduced).toLocaleString()} tCO₂e
        </Badge>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          What Changed?
          <div className="flex items-center gap-2 ml-auto text-sm font-normal">
            <Badge variant="outline">{scenarios[fromScenario].name}</Badge>
            <ArrowRight className="h-4 w-4" />
            <Badge variant="default">{scenarios[toScenario].name}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <motion.div 
            className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-lg"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <Calendar className="h-6 w-6 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {delta.yearsSaved > 0 ? '-' : '+'}{Math.abs(delta.yearsSaved)}
            </div>
            <div className="text-xs text-muted-foreground">Years to Net Zero</div>
          </motion.div>
          
          <motion.div 
            className={`text-center p-4 rounded-lg ${
              delta.costChange > 0 
                ? 'bg-red-50 dark:bg-red-950/30' 
                : 'bg-green-50 dark:bg-green-950/30'
            }`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <DollarSign className={`h-6 w-6 mx-auto mb-2 ${
              delta.costChange > 0 ? 'text-red-600' : 'text-green-600'
            }`} />
            <div className={`text-2xl font-bold ${
              delta.costChange > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {delta.costChange > 0 ? '+' : ''}{(delta.costChange / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-muted-foreground">Investment Change</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Leaf className="h-6 w-6 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {delta.emissionsReduced > 0 ? '-' : '+'}{Math.abs(delta.emissionsReduced / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-muted-foreground">tCO₂e by 2030</div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};
