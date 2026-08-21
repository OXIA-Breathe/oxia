import { Home, BarChart2, Settings, Wind, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { preloadRoute } from "@/lib/routePreload";

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 md:hidden"
      style={{ bottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center gap-1 px-2 py-2 bg-card/95 backdrop-blur-md border border-border/60 rounded-full shadow-[0_12px_32px_-12px_hsl(213_81%_19%_/_0.35)]">
        <NavItem path="/" label="Home" icon={<Home size={18} />} isActive={isActive("/")} />
        <NavItem path="/breathe" label="Breathe" icon={<Wind size={18} />} isActive={isActive("/breathe")} />
        <NavItem path="/learn" label="Learn" icon={<BookOpen size={18} />} isActive={isActive("/learn")} />
        <NavItem path="/progress" label="Progress" icon={<BarChart2 size={18} />} isActive={isActive("/progress")} />
        <NavItem path="/settings" label="Settings" icon={<Settings size={18} />} isActive={isActive("/settings")} />
      </div>
    </nav>
  );
};

interface NavItemProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

const NavItem = ({ path, label, icon, isActive }: NavItemProps) => (
  <Link
    to={path}
    onPointerDown={() => preloadRoute(path)}
    className={`flex items-center justify-center gap-1.5 rounded-full transition-all duration-200 active:scale-95 ${
      isActive
        ? "bg-primary text-primary-foreground px-3.5 py-2"
        : "text-muted-foreground hover:text-foreground px-2.5 py-2"
    }`}
    aria-label={label}
  >
    {icon}
    {isActive && <span className="text-xs font-semibold">{label}</span>}
  </Link>
);

export default Navbar;
