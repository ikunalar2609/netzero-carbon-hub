
import { Button } from "@/components/ui/button";
import { MenuIcon, Filter, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { ProfileMenu } from "@/components/ProfileMenu";
import { useState } from "react";
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
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 h-16 flex items-center px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="mr-4 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mr-4">{title}</h1>
      
      <form onSubmit={handleSearch} className="hidden md:flex items-center relative flex-1 max-w-md mx-4">
        <Input
          type="search"
          placeholder="Search..."
          className="pl-10 pr-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      </form>
      
      <div className="flex items-center gap-3 ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
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
        
        <Button variant="outline" size="sm">
          Export Data
        </Button>
        
        <ProfileMenu />
      </div>
    </header>
  );
};

export default Header;
