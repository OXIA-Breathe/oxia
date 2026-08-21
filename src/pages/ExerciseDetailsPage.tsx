import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { useBreathingExercise } from "@/context/BreathingExerciseContext";
import { formatTimeDisplay } from "@/components/history/utils/formatTime";
import { ParametersModal } from "@/components/breathing/ParametersModal";
import EditExerciseModal from "@/components/breathing/EditExerciseModal";

const ExerciseDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { exercises, setCurrentExercise, updateExercise } = useBreathingExercise();
  
  const exercise = exercises.find(ex => ex.id === id);
  const [repetitions, setRepetitions] = useState(exercise?.repetitions || 20);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!exercise) {
    return (
      <MainLayout>
        <div className="container pt-24 pb-12 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Exercise not found</h1>
            <Button onClick={() => navigate("/breathe")} variant="outline" className="bg-card/10 text-foreground border-border">
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
      <div className="container pt-24 pb-12 max-w-4xl">
        {/* Header removed - using MainLayout back button */}

        {/* Exercise Details */}
        <div className="space-y-6">
          {/* Title and Description */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">{exercise.title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {exercise.description}
            </p>
          </div>

          {/* Description Card */}
          <Card className="p-6 bg-card/90 backdrop-blur-sm">
            {exercise.detailedDescription && (
              <>
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Description</h3>
                <div className="text-muted-foreground leading-relaxed mb-6 text-justify whitespace-pre-line">
                  {exercise.detailedDescription.split('small study from 2022').map((part, index, array) => (
                    <span key={index}>
                      {part}
                      {index < array.length - 1 && (
                        <a 
                          href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9277512/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-medium"
                        >
                          small study from 2022
                        </a>
                      )}
                    </span>
                  ))}
                </div>
              </>
            )}
            
            {exercise.stepByStepInstructions && exercise.stepByStepInstructions.length > 0 && (
              <>
                <h4 className="text-base font-semibold text-card-foreground mb-3">How to do it (step-by-step)</h4>
                <ol className="space-y-1">
                  {exercise.stepByStepInstructions.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-breath mr-3 font-medium">{index + 1}.</span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
            
            {/* If no content at all, show message */}
            {!exercise.detailedDescription && (!exercise.stepByStepInstructions || exercise.stepByStepInstructions.length === 0) && (
              <p className="text-muted-foreground italic">No detailed description or instructions provided for this exercise.</p>
            )}
          </Card>

          {/* Breathing Parameters Card */}
          <Card className="p-6 bg-card/90 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">Breathing Parameters</h3>
              <ParametersModal 
                exercise={exercise} 
                onSave={(parameters) => {
                  updateExercise(exercise.id, parameters);
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Inhale</p>
                <p className="text-xl font-bold text-card-foreground">{exercise.inhaleDuration}s</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Hold 1</p>
                <p className="text-xl font-bold text-card-foreground">{exercise.firstHoldDuration}s</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Exhale</p>
                <p className="text-xl font-bold text-card-foreground">{exercise.exhaleDuration}s</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Hold 2</p>
                <p className="text-xl font-bold text-card-foreground">{exercise.secondHoldDuration}s</p>
              </div>
            </div>
            
            {exercise.parametersNote && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 text-justify whitespace-pre-line">
                {exercise.parametersNote}
              </p>
            )}
            
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-card-foreground">How long would you like to breathe?</h4>
              
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
                    <p className="text-sm text-muted-foreground">Repetitions</p>
                    <p className="text-xl font-bold text-card-foreground">{repetitions}</p>
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
                  <p className="text-sm text-muted-foreground">Approximate total time</p>
                  <p className="text-lg font-semibold text-card-foreground">{formatTimeDisplay(calculateTotalTime())}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Exercise Information Card - only show if any content exists */}
          {((exercise.whenToUse && exercise.whenToUse.length > 0) || 
            exercise.howItHelps || 
            (exercise.commonMistakes && exercise.commonMistakes.length > 0) || 
            exercise.safetyNote) && (
            <Card className="p-6 bg-card/90 backdrop-blur-sm">
              <div className="space-y-6">
                {exercise.whenToUse && exercise.whenToUse.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">When to use:</h3>
                    <ul className="space-y-1">
                      {exercise.whenToUse.map((use, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-breath mr-2">•</span>
                          <span className="text-muted-foreground">{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* How it helps */}
                {exercise.howItHelps && (
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">How it helps</h3>
                    <p className="text-muted-foreground leading-relaxed text-justify whitespace-pre-line">
                      {exercise.howItHelps}
                    </p>
                  </div>
                )}

                {/* Common mistakes */}
                {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-3">Common mistakes</h3>
                    <ul className="space-y-1">
                      {exercise.commonMistakes.map((mistake, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-destructive mr-2">•</span>
                          <span className="text-muted-foreground">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safety note */}
                {exercise.safetyNote && (
                  <div className="p-4 bg-accent border border-border rounded-lg">
                    <p className="text-sm text-accent-foreground text-justify">
                      <strong>Safety note:</strong> {exercise.safetyNote}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}


          {/* Start Practice Button */}
          <div className="text-center pt-4 space-y-3">
            <Button
              onClick={handleStartPractice}
              className="bg-breath hover:bg-breath/90 text-primary-foreground px-8 py-3 text-lg font-semibold w-64"
              size="lg"
            >
              Start this practice
            </Button>
            
            {/* Modify Button - Only for custom exercises */}
            {exercise.isCustom && (
              <div>
                <Button
                  onClick={() => setIsEditModalOpen(true)}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg font-semibold text-foreground w-64"
                >
                  Modify
                </Button>
              </div>
            )}
            
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

        {/* Edit Exercise Modal */}
        {exercise && exercise.isCustom && (
          <EditExerciseModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            exercise={exercise}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ExerciseDetailsPage;