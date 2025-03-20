
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    default:
      return "Dashboard";
  }
};

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const location = useLocation();
  const title = pageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 h-16 flex items-center px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="mr-4 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <MenuIcon className="h-6 w-6" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      
      <h1 className="text-xl font-semibold text-gray-800 flex-1">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm">
          Export Data
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src="" />
              <AvatarFallback className="bg-brand-green text-white">GC</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Reports</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
