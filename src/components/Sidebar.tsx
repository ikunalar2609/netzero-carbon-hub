
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

  const staggerChildrenVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white transform lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center space-x-2" onClick={closeSidebar}>
          <motion.img 
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            src="/lovable-uploads/2dd40c72-8b51-4483-b562-5b4b5bb78f7c.png" 
            alt="FarmlyCarbon Logo" 
            className="h-10 w-auto" 
          />
          <span className="text-xl font-semibold text-gray-800">FarmlyCarbon</span>
        </Link>
        {isMobile && (
          <motion.div
            whileTap={{ scale: 0.9 }}
          >
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-gray-800 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>

      <motion.nav 
        variants={staggerChildrenVariants}
        className="mt-5 px-2 space-y-1"
      >
        {navigationItems.map((item, index) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.name}
              variants={itemVariants}
              custom={index}
            >
              <Link
                to={item.href}
                onClick={closeSidebar}
                className={cn(
                  "flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gray-100 text-green-700 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="mr-3"
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-green-700" : "text-gray-600")} />
                </motion.div>
                <span>{item.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      <motion.div 
        variants={itemVariants}
        className="absolute bottom-0 w-full p-4"
      >
        <Link
          to="/dashboard/settings"
          className="flex items-center px-3 py-3 text-base font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="mr-3"
          >
            <Settings className="h-5 w-5 flex-shrink-0 text-gray-600" />
          </motion.div>
          <span>Settings</span>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
