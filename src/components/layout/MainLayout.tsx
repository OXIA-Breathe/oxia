
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, ArrowLeft } from "lucide-react";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
  fullHeight?: boolean;
}

const MainLayout = ({ children, fullHeight = false }: MainLayoutProps) => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const isExerciseDetailPage = location.pathname.startsWith("/breathe/");

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${fullHeight ? 'h-screen overflow-hidden' : ''} breathing-bg text-white`}>
      <main className="flex-1 pb-16 md:pb-0 md:pl-16 lg:pl-0 w-full max-w-screen-xl mx-auto">
        {/* Header with navigation icons */}
        <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-10">
          {(isProfilePage || isExerciseDetailPage) ? (
            <button 
              onClick={() => window.history.back()}
              className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
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
              className="w-12 h-12 flex items-center justify-center border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
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
