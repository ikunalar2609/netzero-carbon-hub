
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  LineChart, 
  GitBranch, 
  Target, 
  Leaf, 
  X,
  Settings,
  LineChart as MarketIcon
} from "lucide-react";
import { ProfileMenu } from "@/components/ProfileMenu";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const isMobile = window.innerWidth < 768;

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Emissions Tracker", href: "/dashboard/emissions", icon: LineChart },
    { name: "Supply Chain", href: "/dashboard/supply-chain", icon: GitBranch },
    { name: "Net Zero Planner", href: "/dashboard/net-zero-planner", icon: Target },
    { name: "Carbon Impact", href: "/dashboard/carbon-impact", icon: Leaf },
    { name: "Carbon Market Insights", href: "/dashboard/carbon-market", icon: MarketIcon }
  ];

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center space-x-2" onClick={closeSidebar}>
          <img 
            src="/lovable-uploads/2dd40c72-8b51-4483-b562-5b4b5bb78f7c.png" 
            alt="FarmlyCarbon Logo" 
            className="h-10 w-auto" 
          />
          <span className="text-xl font-semibold text-gray-800">FarmlyCarbon</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-gray-800 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <nav className="mt-5 px-2 space-y-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={closeSidebar}
              className={cn(
                "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gray-100 text-green-700 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-green-700" : "text-gray-600")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4">
        <Link
          to="/dashboard/settings"
          className="flex items-center px-3 py-3 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-gray-600" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
