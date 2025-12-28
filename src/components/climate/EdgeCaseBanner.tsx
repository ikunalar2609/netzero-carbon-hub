import { useClimate } from '@/context/ClimateContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Database, TrendingUp, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const EdgeCaseBanner = () => {
  const { 
    currentEmissions, 
    historicalEmissions, 
    offsetDependencyRisk, 
    qualityScore,
    totalOffsetsApplied,
    selectedScenario,
    scenarios
  } = useClimate();

  const warnings: { type: 'default' | 'destructive'; icon: React.ReactNode; title: string; message: string }[] = [];

  // Emissions increase detection
  const lastYear = historicalEmissions[historicalEmissions.length - 2];
  const currentYear = historicalEmissions[historicalEmissions.length - 1];
  if (currentYear && lastYear && currentYear.total > lastYear.total) {
    warnings.push({
      type: 'destructive',
      icon: <TrendingUp className="h-4 w-4" />,
      title: 'Emissions Increase Detected',
      message: `Emissions increased by ${((currentYear.total - lastYear.total) / lastYear.total * 100).toFixed(1)}% from ${lastYear.year} to ${currentYear.year}. Review reduction initiatives.`,
    });
  }

  // Offset overuse
  if (offsetDependencyRisk === 'high' || totalOffsetsApplied > 25000) {
    warnings.push({
      type: 'destructive',
      icon: <Shield className="h-4 w-4" />,
      title: 'Net Zero Integrity Risk',
      message: 'High reliance on carbon offsets may compromise Net Zero claim integrity. SBTi recommends limiting offsets to residual emissions only.',
    });
  }

  // Low quality score
  if (qualityScore < 70) {
    warnings.push({
      type: 'default',
      icon: <Database className="h-4 w-4" />,
      title: 'Data Quality Concern',
      message: `Quality score of ${qualityScore}/100 indicates potential data gaps. Consider improving verification and documentation.`,
    });
  }

  // Aggressive scenario offset risk
  if (selectedScenario === 'aggressive' && scenarios.aggressive.offsetReliance > 20) {
    warnings.push({
      type: 'default',
      icon: <AlertTriangle className="h-4 w-4" />,
      title: 'Aggressive Plan Offset Risk',
      message: 'Aggressive timeline increases offset dependency. Ensure offset quality and permanence for credible claims.',
    });
  }

  if (warnings.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="space-y-3">
        {warnings.map((warning, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: index * 0.1 }}
          >
            <Alert variant={warning.type}>
              {warning.icon}
              <AlertTitle>{warning.title}</AlertTitle>
              <AlertDescription>{warning.message}</AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};
