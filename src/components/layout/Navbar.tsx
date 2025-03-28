
import { Home, Clock, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-card border-t border-border z-10 px-2 py-2 md:static md:w-auto md:h-screen md:border-t-0 md:border-r">
      <div className="flex justify-around md:flex-col md:justify-start md:h-full md:space-y-6 md:p-4">
        <Link to="/" className="flex flex-col items-center justify-center md:flex-row md:justify-start md:space-x-2">
          <div className={`p-2 rounded-lg transition-colors ${isActive("/") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
            <Home size={24} />
          </div>
          <span className="text-xs mt-1 md:text-sm md:mt-0 md:block">Breathe</span>
        </Link>
        
        <Link to="/history" className="flex flex-col items-center justify-center md:flex-row md:justify-start md:space-x-2">
          <div className={`p-2 rounded-lg transition-colors ${isActive("/history") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
            <Clock size={24} />
          </div>
          <span className="text-xs mt-1 md:text-sm md:mt-0 md:block">History</span>
        </Link>
        
        <Link to="/settings" className="flex flex-col items-center justify-center md:flex-row md:justify-start md:space-x-2">
          <div className={`p-2 rounded-lg transition-colors ${isActive("/settings") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
            <Settings size={24} />
          </div>
          <span className="text-xs mt-1 md:text-sm md:mt-0 md:block">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
