
import { Home, BarChart2, Calendar, Settings, Book } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg rounded-t-3xl px-2 sm:px-4 py-2 z-20 md:hidden">
      <div className="flex justify-around items-center max-w-screen-xl mx-auto">
        <NavItem path="/" label="Home" icon={<Home size={20} />} isActive={isActive("/")} />
        <NavItem path="/learn" label="Learn" icon={<Book size={20} />} isActive={isActive("/learn")} />
        <NavItem path="/progress" label="Progress" icon={<BarChart2 size={20} />} isActive={isActive("/progress")} />
        <NavItem path="/settings" label="Settings" icon={<Settings size={20} />} isActive={isActive("/settings")} />
      </div>
    </div>
  );
};

interface NavItemProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem = ({ path, label, icon, isActive }: NavItemProps) => (
  <Link to={path} className="flex flex-col items-center justify-center">
    <div className={`p-2 rounded-full transition-colors ${isActive ? "bg-breath text-white" : "text-gray-500"}`}>
      {icon}
    </div>
    <span className={`text-xs mt-1 ${isActive ? "text-breath" : "text-gray-500"}`}>{label}</span>
  </Link>
);

export default Navbar;
