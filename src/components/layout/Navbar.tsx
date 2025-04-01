
import { Home, BarChart2, Calendar, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg rounded-t-3xl px-4 py-2 z-20 md:hidden">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full transition-colors ${isActive("/") ? "bg-breath text-white" : "text-gray-500"}`}>
            <Home size={22} />
          </div>
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/history" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full transition-colors ${isActive("/history") ? "bg-breath text-white" : "text-gray-500"}`}>
            <BarChart2 size={22} />
          </div>
          <span className="text-xs mt-1">Report</span>
        </Link>
        
        <Link to="/consistency" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full transition-colors ${isActive("/consistency") ? "bg-breath text-white" : "text-gray-500"}`}>
            <Calendar size={22} />
          </div>
          <span className="text-xs mt-1">Calendar</span>
        </Link>
        
        <Link to="/settings" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full transition-colors ${isActive("/settings") ? "bg-breath text-white" : "text-gray-500"}`}>
            <Settings size={22} />
          </div>
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
