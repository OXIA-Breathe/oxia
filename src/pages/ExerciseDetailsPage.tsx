import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";
import { formatTimeDisplay } from "@/components/history/utils/formatTime";

const ExerciseDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exercises, setCurrentExercise, updateExercise } = useBreathingExercise();
  
  const exercise = exercises.find(ex => ex.id === id);
  const [repetitions, setRepetitions] = useState(exercise?.repetitions || 20);

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
    const updatedExercise = { ...exercise, repetitions };
    setCurrentExercise(updatedExercise);
    navigate("/");
  };

  const handleSaveRepetitions = () => {
    updateExercise(exercise.id, { repetitions });
  };

  const calculateTotalTime = () => {
    const cycleTime = exercise.inhaleDuration + exercise.firstHoldDuration + exercise.exhaleDuration + exercise.secondHoldDuration;
    return cycleTime * repetitions;
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
              {exercise.description}
            </p>
          </div>

          {/* Description Card */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              {exercise.detailedDescription || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."}
            </p>
            
            <h4 className="text-base font-semibold text-gray-800 mb-3">How to do it (step-by-step)</h4>
            <ol className="space-y-1">
              {exercise.stepByStepInstructions ? exercise.stepByStepInstructions.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-breath mr-3 font-medium">{index + 1}.</span>
                  <span className="text-gray-700">{step}</span>
                </li>
              )) : (
                <>
                  <li className="flex items-start">
                    <span className="text-breath mr-3 font-medium">1.</span>
                    <span className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-breath mr-3 font-medium">2.</span>
                    <span className="text-gray-700">Sed do eiusmod tempor incididunt ut labore.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-breath mr-3 font-medium">3.</span>
                    <span className="text-gray-700">Ut enim ad minim veniam, quis nostrud.</span>
                  </li>
                </>
              )}
            </ol>
          </Card>

          {/* Breathing Parameters Card */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Breathing Parameters</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
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
            </div>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {exercise.parametersNote || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."}
            </p>
            
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-gray-800">How long would you like to breathe?</h4>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRepetitions(Math.max(1, repetitions - 1))}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="text-center min-w-[80px]">
                    <p className="text-sm text-gray-600">Repetitions</p>
                    <p className="text-xl font-bold text-gray-800">{repetitions}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setRepetitions(repetitions + 1)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="ml-6">
                  <p className="text-sm text-gray-600">Approximate total time</p>
                  <p className="text-lg font-semibold text-gray-800">{formatTimeDisplay(calculateTotalTime())}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Exercise Information Card */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm">
            <div className="space-y-6">
              {/* When to use */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">When to use:</h3>
                <ul className="space-y-1">
                  {exercise.whenToUse ? exercise.whenToUse.map((use, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-breath mr-2">•</span>
                      <span className="text-gray-700">{use}</span>
                    </li>
                  )) : (
                    <>
                      <li className="flex items-start">
                        <span className="text-breath mr-2">•</span>
                        <span className="text-gray-700">Lorem ipsum dolor sit amet</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-breath mr-2">•</span>
                        <span className="text-gray-700">Consectetur adipiscing elit</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-breath mr-2">•</span>
                        <span className="text-gray-700">Sed do eiusmod tempor</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* How it helps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">How it helps</h3>
                <p className="text-gray-700 leading-relaxed">
                  {exercise.howItHelps || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."}
                </p>
              </div>

              {/* Common mistakes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Common mistakes</h3>
                <ul className="space-y-1">
                  {exercise.commonMistakes ? exercise.commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span className="text-gray-700">{mistake}</span>
                    </li>
                  )) : (
                    <>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span className="text-gray-700">Lorem ipsum dolor sit amet</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span className="text-gray-700">Consectetur adipiscing elit</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span className="text-gray-700">Sed do eiusmod tempor</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Safety note */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Safety note:</strong> {exercise.safetyNote || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."}
                </p>
              </div>
            </div>
          </Card>


          {/* Start Practice Button */}
          <div className="text-center pt-4 space-y-3">
            <Button
              onClick={handleStartPractice}
              className="bg-breath hover:bg-breath/90 text-white px-8 py-3 text-lg font-semibold w-64"
              size="lg"
            >
              Start this practice
            </Button>
            <div>
              <Button
                onClick={handleSaveRepetitions}
                variant="outline"
                size="lg"
                className="px-8 py-3 text-lg font-semibold text-foreground w-64"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExerciseDetailsPage;