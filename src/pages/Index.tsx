
import MainLayout from "@/components/layout/MainLayout";
import BreathingExercise from "@/components/breathing/BreathingExercise";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user, isLoading } = useAuth();

  return (
    <MainLayout fullHeight>
      <div className="h-full overflow-hidden">
        <div className="container flex flex-col h-full px-4 sm:px-6">
          {/* Logo - responsive height based on viewport */}
          <div className="flex justify-center pt-[8vh] pb-[2vh]">
            <img 
              src="/lovable-uploads/6d9cc0f0-addd-45b1-abab-238892b91dbf.png" 
              alt="OXIA Logo" 
              className="max-h-[8vh] min-h-[40px] w-auto object-contain" 
              onError={(e) => {
                console.error("Logo failed to load:", e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          {/* Breathing Circle - takes remaining space */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-0">
            <BreathingExercise />
          </div>
          
          {/* Bottom Controls - minimal padding to stay visible */}
          <div className="pb-[10vh] md:pb-[5vh]">
            {user && (
              <div className="mt-4 text-center hidden">
                <Link to="/progress">
                  <Button variant="outline" className="bg-white/10 text-white border-white/20 flex items-center gap-2 w-full justify-center">
                    Track Your Consistency
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
