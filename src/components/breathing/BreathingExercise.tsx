
import BreathingCircle from "./BreathingCircle";
import BreathingStats from "./BreathingStats";
import BreathingControls from "./BreathingControls";
import { useBreathingSession } from "./hooks/useBreathingSession";
import { useBreathingTimer } from "./hooks/useBreathingTimer";
import { useElapsedTimer } from "./hooks/useElapsedTimer";

const BreathingExercise = () => {
  const {
    phase,
    isActive,
    currentRepetition,
    breathCount,
    timeElapsed,
    phaseTimeRemaining,
    setTimeElapsed,
    setPhaseTimeRemaining,
    resetExercise,
    toggleExercise,
    handlePhaseComplete,
    settings
  } = useBreathingSession();

  const { duration, timeRemaining } = useBreathingTimer({
    isActive,
    phase,
    inhaleDuration: settings.inhaleDuration,
    exhaleDuration: settings.exhaleDuration,
    holdDuration: settings.holdDuration,
    onPhaseComplete: handlePhaseComplete,
    phaseTimeRemaining,
    setPhaseTimeRemaining
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

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <BreathingStats
        currentRepetition={currentRepetition}
        totalRepetitions={settings.repetitions}
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
        onReset={resetExercise}
      />
    </div>
  );
};

export default BreathingExercise;
