
import { useCallback } from "react";
import BreathingCircle from "./BreathingCircle";
import BreathingStats from "./BreathingStats";
import BreathingControls from "./BreathingControls";
import { useBreathingSession } from "./hooks/useBreathingSession";
import { useBreathingTimer } from "./hooks/useBreathingTimer";
import { useElapsedTimer } from "./hooks/useElapsedTimer";
import { useBreathingVoice } from "@/hooks/useBreathingVoice";

const BreathingExercise = () => {
  const {
    phase,
    isActive,
    currentRepetition,
    breathCount,
    timeElapsed,
    phaseTimeRemaining,
    exerciseSettings,
    setTimeElapsed,
    setPhaseTimeRemaining,
    resetExercise,
    toggleExercise,
    handlePhaseComplete,
  } = useBreathingSession();

  // Add voice guidance with caching
  const { isVoiceSupported, isVoiceReady, isVoiceLoading, stopVoice, triggerVoicePrompt } = useBreathingVoice({
    phase,
    isActive,
    exerciseTitle: exerciseSettings.title
  });

  // Create a stable voice prompt callback
  const handleVoicePrompt = useCallback((newPhase: "inhale" | "exhale" | "hold1" | "hold2") => {
    if (isActive && triggerVoicePrompt) {
      triggerVoicePrompt(newPhase);
    }
  }, [isActive, triggerVoicePrompt]);

  const { duration, timeRemaining } = useBreathingTimer({
    isActive,
    phase,
    exerciseSettings: {
      inhaleDuration: exerciseSettings.inhaleDuration,
      exhaleDuration: exerciseSettings.exhaleDuration,
      firstHoldDuration: exerciseSettings.firstHoldDuration,
      secondHoldDuration: exerciseSettings.secondHoldDuration,
    },
    onPhaseComplete: handlePhaseComplete,
    phaseTimeRemaining,
    setPhaseTimeRemaining,
  });

  useElapsedTimer({ isActive, setTimeElapsed });

  const handleCircleClick = () => {
    toggleExercise();
  };

  const handleToggle = () => {
    if (isActive && phaseTimeRemaining === null && phase !== "idle") {
      setPhaseTimeRemaining(timeRemaining);
    }
    toggleExercise();
  };

  const handleReset = () => {
    stopVoice(); // Stop any ongoing voice prompts
    resetExercise();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Exercise Title */}
      {exerciseSettings.title && (
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {exerciseSettings.title}
          </h2>
          {isVoiceLoading && (
            <p className="text-sm text-gray-300 mt-1">
              Preparing voice guidance...
            </p>
          )}
        </div>
      )}
      
      <BreathingStats
        currentRepetition={currentRepetition}
        totalRepetitions={exerciseSettings.repetitions}
        breathCount={breathCount}
        timeElapsed={timeElapsed}
      />
      
      <div className="flex items-center justify-center my-8">
        <BreathingCircle 
          phase={isActive ? phase : "idle"} 
          duration={duration}
          timeRemaining={timeRemaining}
          onCircleClick={handleCircleClick}
          isPaused={!isActive && phase !== "idle"}
        />
      </div>
      
      <BreathingControls
        isActive={isActive}
        phase={phase}
        currentRepetition={currentRepetition}
        onToggle={handleToggle}
        onReset={handleReset}
      />
    </div>
  );
};

export default BreathingExercise;
