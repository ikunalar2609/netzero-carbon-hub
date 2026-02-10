import { Button } from "@/components/ui/button";
import { MenuIcon, Filter, Search } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ProfileMenu } from "@/components/ProfileMenu";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const pageTitle = (pathname: string): string => {
  switch (pathname) {
    case "/":
      return "Dashboard";
    case "/emissions":
      return "Emissions Tracker";
    case "/supply-chain":
      return "Supply Chain";
    case "/net-zero-planner":
      return "Net Zero Planner";
    case "/carbon-impact":
      return "Carbon Impact";
    case "/profile":
      return "Profile";
    default:
      return "Dashboard";
  }
};

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const location = useLocation();
  const title = pageTitle(location.pathname);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    // Implement search functionality here
  };

  return (
    <motion.header 
      className="sticky top-0 z-10 bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 h-16 flex items-center px-4 md:px-6 shadow-lg"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="mr-4 md:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </motion.div>
      
      <motion.h1
        className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mr-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {title}
      </motion.h1>
      
      <motion.form 
        onSubmit={handleSearch} 
        className="hidden md:flex items-center relative flex-1 max-w-md mx-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Input
          type="search"
          placeholder="Search..."
          className="pl-10 pr-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 focus:border-green-500 dark:focus:border-green-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      </motion.form>
      
      <motion.div 
        className="flex items-center gap-3 ml-auto"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Popover>
          <PopoverTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="sm" className="flex gap-1 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </motion.div>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-gray-200/50 dark:border-gray-800/50">
            <div className="space-y-4">
              <h4 className="font-medium">Filter Options</h4>
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Status</h5>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">In Progress</Button>
                  <Button variant="outline" size="sm">Planning</Button>
                  <Button variant="outline" size="sm">Completed</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Category</h5>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">Energy</Button>
                  <Button variant="outline" size="sm">Transportation</Button>
                  <Button variant="outline" size="sm">Waste</Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Reset</Button>
                <Button size="sm">Apply Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700">
            Export Data
          </Button>
        </motion.div>
        
        <ProfileMenu />
      </motion.div>
    </motion.header>
  );
};

export default Header;
