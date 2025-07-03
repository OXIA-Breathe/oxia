
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
    countdownValue,
    setTimeElapsed,
    setPhaseTimeRemaining,
    resetExercise,
    toggleExercise,
    handlePhaseComplete,
  } = useBreathingSession();

  const { duration, timeRemaining } = useBreathingTimer({
    isActive: isActive && phase !== "countdown",
    phase,
    exerciseSettings: {
      inhaleDuration: exerciseSettings.inhaleDuration,
      exhaleDuration: exerciseSettings.exhaleDuration,
      firstHoldDuration: exerciseSettings.firstHoldDuration,
      secondHoldDuration: exerciseSettings.secondHoldDuration,
    },
    onPhaseComplete: handlePhaseComplete,
    phaseTimeRemaining,
    setPhaseTimeRemaining
  });

  useElapsedTimer({ 
    isActive: isActive && phase !== "countdown", 
    setTimeElapsed 
  });

  // Add voice guidance with caching
  const { isVoiceSupported, isVoiceReady, isVoiceLoading, stopVoice } = useBreathingVoice({
    phase: phase === "countdown" ? "idle" : phase,
    isActive: isActive && phase !== "countdown",
    exerciseTitle: exerciseSettings.title
  });

  const handleCircleClick = () => {
    toggleExercise();
  };

  const handleToggle = () => {
    if (isActive && phaseTimeRemaining === null && phase !== "idle" && phase !== "countdown") {
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
          phase={phase} 
          duration={duration}
          timeRemaining={timeRemaining}
          onCircleClick={handleCircleClick}
          isPaused={!isActive && phase !== "idle" && phase !== "countdown"}
          countdownValue={countdownValue}
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
