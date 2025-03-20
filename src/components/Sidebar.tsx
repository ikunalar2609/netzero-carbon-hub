
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
  Settings
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const isMobile = window.innerWidth < 768;

  const navigationItems = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Emissions Tracker", href: "/emissions", icon: LineChart },
    { name: "Supply Chain", href: "/supply-chain", icon: GitBranch },
    { name: "Net Zero Planner", href: "/net-zero-planner", icon: Target },
    { name: "Carbon Impact", href: "/carbon-impact", icon: Leaf }
  ];

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-brand-green transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-auto overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-brand-green-600">
        <Link to="/" className="flex items-center space-x-2 text-white" onClick={closeSidebar}>
          <Leaf className="h-6 w-6" />
          <span className="text-xl font-semibold">NetZero</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-brand-green-600">
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
                  ? "bg-white text-brand-green-600 shadow-sm"
                  : "text-white hover:bg-brand-green-600"
              )}
            >
              <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-brand-green" : "text-white")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4">
        <Link
          to="/settings"
          className="flex items-center px-3 py-3 text-base font-medium rounded-lg text-white hover:bg-brand-green-600 transition-all duration-200"
        >
          <Settings className="mr-3 h-5 w-5 flex-shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
