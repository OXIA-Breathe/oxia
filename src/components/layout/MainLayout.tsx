
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
  const isProfilePage = location.pathname === "/profile";
  const isExerciseDetailPage = location.pathname.startsWith("/breathe/");

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${fullHeight ? 'h-screen overflow-hidden' : ''} breathing-bg text-foreground`}>
      <main 
        className="flex-1 md:pl-16 lg:pl-0 w-full max-w-screen-xl mx-auto"
        style={{ 
          paddingBottom: isMobile ? 'calc(5rem + env(safe-area-inset-bottom))' : '0'
        }}
      >
        {/* Header with navigation icons */}
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-10">
          {(isProfilePage || isExerciseDetailPage) ? (
            <button 
              onClick={() => window.history.back()}
              className="w-12 h-12 flex items-center justify-center border border-border rounded-lg hover:bg-accent transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div />
          )}
          
          {(!isProfilePage && !isExerciseDetailPage) && (
            <Link 
              to="/profile" 
              state={{ from: location.pathname }}
              className="w-12 h-12 flex items-center justify-center bg-card/80 backdrop-blur-sm border border-border rounded-lg shadow-md hover:bg-card transition-colors"
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
