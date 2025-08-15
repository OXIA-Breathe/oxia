import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";

const ExerciseDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exercises, setCurrentExercise } = useBreathingExercise();

  const exercise = exercises.find(ex => ex.id === id);

  if (!exercise) {
    return (
      <MainLayout>
        <div className="container py-12 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Exercise not found</h1>
            <Button onClick={() => navigate("/breathe")} variant="outline">
              Back to Exercises
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleStartPractice = () => {
    setCurrentExercise(exercise);
    navigate("/");
  };

  const getBreathingPattern = () => {
    if (exercise.secondHoldDuration > 0) {
      return `${exercise.inhaleDuration}-${exercise.firstHoldDuration}-${exercise.exhaleDuration}-${exercise.secondHoldDuration}`;
    } else {
      return `${exercise.inhaleDuration}-${exercise.firstHoldDuration}-${exercise.exhaleDuration}`;
    }
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-4xl pt-16">
        {/* Header removed - using MainLayout back button */}

        {/* Exercise Details */}
        <div className="space-y-6">
          {/* Title and Description */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">{exercise.title}</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {exercise.detailedDescription || exercise.description}
            </p>
          </div>

          {/* Breathing Parameters Card */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Breathing Parameters</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Inhale</p>
                <p className="text-xl font-bold text-gray-800">{exercise.inhaleDuration}s</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Hold 1</p>
                <p className="text-xl font-bold text-gray-800">{exercise.firstHoldDuration}s</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Exhale</p>
                <p className="text-xl font-bold text-gray-800">{exercise.exhaleDuration}s</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Hold 2</p>
                <p className="text-xl font-bold text-gray-800">{exercise.secondHoldDuration}s</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Repetitions</p>
                <p className="text-xl font-bold text-gray-800">{exercise.repetitions}</p>
              </div>
            </div>
          </Card>

          {/* When to use */}
          {exercise.whenToUse && (
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">When to use</h3>
              <ul className="space-y-2">
                {exercise.whenToUse.map((use, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-breath mr-2">•</span>
                    <span className="text-gray-700">{use}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* How it helps */}
          {exercise.howItHelps && (
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">How it helps</h3>
              <p className="text-gray-700 leading-relaxed">{exercise.howItHelps}</p>
            </Card>
          )}

          {/* Common mistakes */}
          {exercise.commonMistakes && (
            <Card className="p-6 bg-white/90 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Common mistakes</h3>
              <ul className="space-y-2">
                {exercise.commonMistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-gray-700">{mistake}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Safety note */}
          {exercise.safetyNote && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Safety note:</strong> {exercise.safetyNote}
              </p>
            </Card>
          )}

          {/* Start Practice Button */}
          <div className="text-center pt-4">
            <Button
              onClick={handleStartPractice}
              className="bg-breath hover:bg-breath/90 text-white px-8 py-3 text-lg font-semibold"
              size="lg"
            >
              Start this practice
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExerciseDetailsPage;