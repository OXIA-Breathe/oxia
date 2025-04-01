
import MainLayout from "@/components/layout/MainLayout";
import BreathingExercise from "@/components/breathing/BreathingExercise";
import { Link } from "react-router-dom";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Breathify</h1>
        <div className="flex justify-center items-center flex-col">
          <BreathingExercise />
          
          {user && (
            <div className="mt-8 text-center">
              <Link to="/consistency">
                <Button variant="outline" className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Track Your Consistency
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                Monitor your daily breathing practice and login streaks
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
