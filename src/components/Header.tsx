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
  };

  return (
    <motion.header 
      className="sticky top-0 z-10 bg-[#111111]/95 backdrop-blur-lg border-b border-white/10 h-16 flex items-center px-4 md:px-6"
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
          className="mr-4 md:hidden text-gray-300 hover:bg-white/10 hover:text-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </motion.div>
      
      <motion.h1
        className="text-xl font-bold text-white mr-4"
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
          className="pl-10 pr-4 bg-white/5 border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-emerald-500/50 focus:ring-emerald-500/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 h-4 w-4 text-gray-500" />
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
              <Button variant="outline" size="sm" className="flex gap-1 bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </motion.div>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-[#1a1a1a] border-white/10 text-gray-200">
            <div className="space-y-4">
              <h4 className="font-medium text-white">Filter Options</h4>
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-300">Status</h5>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">In Progress</Button>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">Planning</Button>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">Completed</Button>
                </div>
              </div>
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-300">Category</h5>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">Energy</Button>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">Transportation</Button>
                  <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">Waste</Button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">Reset</Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">Apply Filters</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white">
            Export Data
          </Button>
        </motion.div>
        
        <ProfileMenu />
      </motion.div>
    </motion.header>
  );
};

export default Header;
