
import MainLayout from "@/components/layout/MainLayout";
import BreathingExercise from "@/components/breathing/BreathingExercise";

const Index = () => {
  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Breathify</h1>
        <div className="flex justify-center items-center">
          <BreathingExercise />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
