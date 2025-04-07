
import MainLayout from "@/components/layout/MainLayout";
import BreathingExercise from "@/components/breathing/BreathingExercise";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <MainLayout fullHeight>
      <div className="h-full">
        <div className="container py-6 px-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="invisible">
              {/* Empty div to maintain spacing */}
            </div>
            <Link to="/profile" className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-lg">
              <User className="h-4 w-4" />
            </Link>
          </div>
          
          {/* Logo */}
          <div className="mb-6 text-center">
            <img 
              src="/lovable-uploads/2537215b-9aaa-455a-9557-b82a0a16a948.png" 
              alt="OXIA Logo" 
              className="mx-auto h-12 w-auto" 
            />
          </div>
          
          {/* Breathing Circle */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <BreathingExercise />
          </div>
          
          {/* Bottom Controls - Removed sensor attached section */}
          <div className="mt-auto pb-20">
            {user && (
              <div className="mt-4 text-center hidden">
                <Link to="/consistency">
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
