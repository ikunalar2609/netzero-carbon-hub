import SummaryCard from "@/components/dashboard/SummaryCard";
import EmissionsChart from "@/components/dashboard/EmissionsChart";
import EmissionsByCategory from "@/components/dashboard/EmissionsByCategory";
import ScopeBreakdown from "@/components/dashboard/ScopeBreakdown";
import ReductionStatus from "@/components/dashboard/ReductionStatus";
import GoalsProgress from "@/components/dashboard/GoalsProgress";
import CarbonProjectsSection from "@/components/dashboard/CarbonProjectsSection";
import DataEntryForm from "@/components/dashboard/DataEntryForm";
import { InsightEngine } from "@/components/climate/InsightEngine";
import { EdgeCaseBanner } from "@/components/climate/EdgeCaseBanner";
import { SmartExport } from "@/components/climate/SmartExport";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useClimate } from "@/context/ClimateContext";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingDown, 
  Factory, 
  Leaf, 
  Globe,
  ArrowRight,
} from "lucide-react";

const Dashboard = () => {
  const { currentEmissions, totalReductionPercent, reductionLevers, loading } = useClimate();
  
  const renewablesLever = reductionLevers.find(l => l.id === 'renewables');
  const suppliersLever = reductionLevers.find(l => l.id === 'suppliers');

  if (loading) {
    return (
      <div className="space-y-6 animate-slide-up">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
          <p className="text-muted-foreground">Track your carbon reduction progress and reach your FarmlyCarbon goals</p>
        </div>
        <SmartExport />
      </div>
      
      <EdgeCaseBanner />
      <InsightEngine />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Decarbonization Status"
          value={`-${totalReductionPercent.toFixed(1)}%`}
          description="Reduction since 2020"
          trend={{ value: 8, isPositive: true }}
          icon={TrendingDown}
        />
        <SummaryCard
          title="Emissions Reduced"
          value={(168000 - currentEmissions.total).toLocaleString()}
          description="metric tonnes CO₂e"
          trend={{ value: 12, isPositive: true }}
          icon={Factory}
        />
        <SummaryCard
          title="Renewable Energy"
          value={`${renewablesLever?.currentValue || 72}%`}
          description="of total energy consumption"
          trend={{ value: 15, isPositive: true }}
          icon={Leaf}
        />
        <SummaryCard
          title="Sustainable Procurement"
          value={`${suppliersLever?.currentValue || 58}%`}
          description="of suppliers with carbon goals"
          trend={{ value: 5, isPositive: true }}
          icon={Globe}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <EmissionsChart />
        <div className="grid gap-4">
          <EmissionsByCategory />
          <ScopeBreakdown />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReductionStatus />
        <GoalsProgress />
      </div>

      {/* Data Entry Form */}
      <DataEntryForm />
      
      {/* Carbon Market Insights Section - API Data */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Carbon Market Insights</h2>
          <Link to="/dashboard/carbon-market">
            <Button variant="outline" size="sm" className="gap-1">
              View Full Market Section
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Live data from Carbonmark API (https://v16.api.carbonmark.com)
        </p>
      </div>
      <CarbonProjectsSection />
    </div>
  );
};

export default Dashboard;
