
import MainLayout from "@/components/layout/MainLayout";
import BreathingExercise from "@/components/breathing/BreathingExercise";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Index = () => {
  const { user } = useAuth();

  return (
    <MainLayout fullHeight>
      <div className="h-full breathing-bg text-white">
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
            <h1 className="text-4xl font-bold mb-1">OXIA</h1>
          </div>
          
          {/* Breathing Circle */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <BreathingExercise />
          </div>
          
          {/* Bottom Controls */}
          <div className="mt-auto pb-20">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex justify-between items-center">
              <Label className="text-white flex items-center">
                Sensor attached
              </Label>
              <Switch />
            </div>
            
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
