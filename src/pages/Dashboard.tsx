
import SummaryCard from "@/components/dashboard/SummaryCard";
import EmissionsChart from "@/components/dashboard/EmissionsChart";
import EmissionsByCategory from "@/components/dashboard/EmissionsByCategory";
import ScopeBreakdown from "@/components/dashboard/ScopeBreakdown";
import ReductionStatus from "@/components/dashboard/ReductionStatus";
import GoalsProgress from "@/components/dashboard/GoalsProgress";
import CarbonProjectsSection from "@/components/dashboard/CarbonProjectsSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  TrendingDown, 
  Factory, 
  Leaf, 
  Globe,
  ArrowRight
} from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
      <p className="text-muted-foreground">Track your carbon reduction progress and reach your FarmlyCarbon goals</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Decarbonization Status"
          value="-33%"
          description="Reduction since 2020"
          trend={{ value: 8, isPositive: true }}
          icon={TrendingDown}
        />
        <SummaryCard
          title="Emissions Reduced"
          value="122,658"
          description="metric tonnes CO₂e"
          trend={{ value: 12, isPositive: true }}
          icon={Factory}
        />
        <SummaryCard
          title="Renewable Energy"
          value="72%"
          description="of total energy consumption"
          trend={{ value: 15, isPositive: true }}
          icon={Leaf}
        />
        <SummaryCard
          title="Sustainable Procurement"
          value="58%"
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
      
      {/* Carbon Projects Section with API data */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Carbon Market Insights</h2>
          <Link to="/dashboard/carbon-market">
            <Button variant="outline" size="sm" className="gap-1">
              View Full Details
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
