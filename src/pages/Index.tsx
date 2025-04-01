
import MainLayout from "@/components/layout/MainLayout";
import BreathingExercise from "@/components/breathing/BreathingExercise";
import { Link } from "react-router-dom";
import { Calendar, Award } from "lucide-react";
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
            <div className="flex gap-4 items-center">
              <div className="px-4 py-1 rounded-full border border-white/20 text-sm">
                Today
              </div>
              <div className="px-4 py-1 rounded-full bg-white text-breath font-medium text-sm">
                Live
              </div>
            </div>
            <button className="w-8 h-8 flex items-center justify-center border border-white/20 rounded-lg">
              <Calendar className="h-4 w-4" />
            </button>
          </div>
          
          {/* Status Message */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1">Smooth sailing!</h1>
            <p className="text-white/80">
              Please be careful even if the risk of seizures is low.
            </p>
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
                    <Award className="h-5 w-5" />
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
