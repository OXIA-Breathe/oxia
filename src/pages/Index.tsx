
import MainLayout from "@/components/layout/MainLayout";
import BreathingExercise from "@/components/breathing/BreathingExercise";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user, isLoading } = useAuth();

  return (
    <MainLayout fullHeight>
      <div className="h-full">
        <div className="container py-6 px-6 flex flex-col h-full">
          {/* Logo */}
          <div className="flex justify-center mb-4 mt-16">
            <img 
              src="/lovable-uploads/6d9cc0f0-addd-45b1-abab-238892b91dbf.png" 
              alt="OXIA Logo" 
              className="h-16 w-auto object-contain" 
              onError={(e) => {
                console.error("Logo failed to load:", e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          
          {/* Breathing Circle */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <BreathingExercise />
          </div>
          
          {/* Bottom Controls */}
          <div className="mt-auto pb-20">
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
