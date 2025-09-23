
import { useCallback, useEffect, useMemo } from "react";
import BreathingCircle from "./BreathingCircle";
import BreathingStats from "./BreathingStats";
import BreathingControls from "./BreathingControls";
import { useBreathingSession } from "./hooks/useBreathingSession";
import { useBreathingTimer } from "./hooks/useBreathingTimer";
import { useElapsedTimer } from "./hooks/useElapsedTimer";
import { useBreathingVoice } from "@/hooks/useBreathingVoice";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";


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

  // Get audio settings from localStorage (memoized to prevent re-creation)
  const audioSettings = useMemo(() => {
    try {
      const stored = localStorage.getItem('audioSettings');
      return stored ? JSON.parse(stored) : {
        backgroundMusic: { enabled: true, selected: 'Cosmic Exploration' }
      };
    } catch {
      return { backgroundMusic: { enabled: true, selected: 'Cosmic Exploration' } };
    }
  }, []);

  // Background music hook
  const { startMusic, stopMusic, pauseMusic, resumeMusic } = useBackgroundMusic({
    isEnabled: audioSettings.backgroundMusic?.enabled || false,
    selectedMusic: audioSettings.backgroundMusic?.selected || 'Cosmic Exploration',
    volume: 0.3
  });


  // Add voice guidance with static audio files
  const { isVoiceSupported, isVoiceReady, isVoiceLoading, stopVoice, triggerVoicePrompt } = useBreathingVoice({
    phase: phase as "inhale" | "exhale" | "hold1" | "hold2",
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

  useElapsedTimer({ isActive, phase, setTimeElapsed });

  const handleCircleClick = () => {
    toggleExercise();
  };

  const handleToggle = () => {
    if (isActive && phaseTimeRemaining === null && phase !== "idle") {
      setPhaseTimeRemaining(timeRemaining);
    }
    
    // Handle music pause/resume
    if (isActive) {
      pauseMusic();
    } else if (phase !== "idle") {
      resumeMusic();
    }
    
    toggleExercise();
  };

  const handleReset = () => {
    stopVoice(); // Stop any ongoing voice prompts
    stopMusic(); // Stop background music
    resetExercise();
  };

  // Handle background music
  useEffect(() => {
    if (isActive && phase === "countdown") {
      // Start background music when exercise begins (during countdown)
      startMusic();
    } else if (!isActive && phase === "idle") {
      // Stop background music when exercise ends
      stopMusic();
    }
  }, [isActive, phase]);

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Exercise Title */}
      {exerciseSettings.title && (
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {exerciseSettings.title}
          </h2>
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
