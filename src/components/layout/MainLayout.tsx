import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, ArrowLeft } from "lucide-react";
import Navbar from "./Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children: ReactNode;
  fullHeight?: boolean;
}

const MainLayout = ({ children, fullHeight = false }: MainLayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const backRoutes = [
    "/profile", "/settings", "/privacy-policy", "/terms",
    "/eula", "/journal", "/health-connect-preview", "/history",
  ];
  const isExerciseDetailPage = location.pathname.startsWith("/breathe/");
  const showBackButton = backRoutes.includes(location.pathname) || isExerciseDetailPage;

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${fullHeight ? 'h-screen overflow-hidden' : ''} breathing-bg text-foreground`}>
      <main
        className="flex-1 md:pl-16 lg:pl-0 w-full max-w-screen-xl mx-auto relative"
        style={{
          paddingBottom: isMobile ? 'calc(5.5rem + env(safe-area-inset-bottom))' : '0'
        }}
      >
        <div className="absolute top-6 left-5 right-5 flex justify-between items-center z-10">
          {showBackButton ? (
            <button
              onClick={() => window.history.back()}
              className="w-11 h-11 flex items-center justify-center bg-card/90 backdrop-blur-md border border-border/60 rounded-full shadow-[0_4px_14px_-6px_hsl(213_81%_19%_/_0.25)] hover:bg-card transition-all active:scale-95 text-foreground"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div />
          )}

          {!showBackButton && (
            <Link
              to="/profile"
              state={{ from: location.pathname }}
              className="ml-auto w-11 h-11 flex items-center justify-center bg-card/90 backdrop-blur-md border border-border/60 rounded-full shadow-[0_4px_14px_-6px_hsl(213_81%_19%_/_0.25)] hover:bg-card transition-all active:scale-95 text-foreground"
              aria-label="Go to profile"
            >
              <User className="h-5 w-5" />
            </Link>
          )}
        </div>

        {children}
      </main>
      <Navbar />
    </div>
  );
};

export default MainLayout;
