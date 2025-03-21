
import { useEffect, useState } from "react";
import SummaryCard from "@/components/dashboard/SummaryCard";
import EmissionsChart from "@/components/dashboard/EmissionsChart";
import EmissionsByCategory from "@/components/dashboard/EmissionsByCategory";
import ScopeBreakdown from "@/components/dashboard/ScopeBreakdown";
import ReductionStatus from "@/components/dashboard/ReductionStatus";
import GoalsProgress from "@/components/dashboard/GoalsProgress";
import { SummaryCard as SummaryCardType } from "@/models/dashboard.model";
import { getSummaryCards } from "@/services/dashboard.service";
import { 
  TrendingDown, 
  Factory, 
  Leaf, 
  Globe 
} from "lucide-react";

const iconMap: { [key: string]: any } = {
  "TrendingDown": TrendingDown,
  "Factory": Factory,
  "Leaf": Leaf,
  "Globe": Globe,
};

const Dashboard = () => {
  const [summaryCards, setSummaryCards] = useState<SummaryCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummaryCards = async () => {
      try {
        const data = await getSummaryCards();
        setSummaryCards(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchSummaryCards();
  }, []);

  return (
    <div className="space-y-6 animate-slide-up">
      <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
      <p className="text-muted-foreground">Track your carbon reduction progress and reach your net zero goals</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[120px] bg-gray-100 animate-pulse rounded-lg"></div>
            ))}
          </>
        ) : error ? (
          <div className="col-span-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          summaryCards.map((card) => (
            <SummaryCard
              key={card.id}
              title={card.title}
              value={card.value}
              description={card.description}
              trend={card.trend}
              icon={iconMap[card.icon] || TrendingDown}
            />
          ))
        )}
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
    </div>
  );
};

export default Dashboard;
