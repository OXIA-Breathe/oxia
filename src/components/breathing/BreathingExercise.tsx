import { useCallback, useEffect, useMemo, useState } from "react";
import BreathingCircle from "./BreathingCircle";
import BreathingStats from "./BreathingStats";
import BreathingControls from "./BreathingControls";
import { SignUpPromptModal } from "./SignUpPromptModal";
import { useBreathingSession } from "./hooks/useBreathingSession";
import { useBreathingTimer } from "./hooks/useBreathingTimer";
import { useElapsedTimer } from "./hooks/useElapsedTimer";
import { useBreathingVoice } from "@/hooks/useBreathingVoice";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useCountdownSound } from "@/hooks/useCountdownSound";
import { useAuth } from "@/context/AuthContext";
import { useTrialCounter } from "@/hooks/useTrialCounter";
import { useToast } from "@/hooks/use-toast";

const BreathingExercise = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasReachedLimit, remainingSessions, incrementTrial } = useTrialCounter();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  
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
  } = useBreathingSession(() => {
    // Increment trial counter when session completes (for unauthenticated users)
    if (!user) {
      incrementTrial();
      
      // Check if this was the last free session
      if (remainingSessions === 1) {
        setTimeout(() => setShowSignUpModal(true), 1000);
      }
    }
  });

  // Get audio settings from localStorage (memoized to prevent re-creation)
  const audioSettings = useMemo(() => {
    try {
      const stored = localStorage.getItem('audioSettings');
      return stored ? JSON.parse(stored) : {
        backgroundMusic: { enabled: true, selected: 'cosmic', volume: 0.3 }
      };
    } catch {
      return { backgroundMusic: { enabled: true, selected: 'cosmic', volume: 0.3 } };
    }
  }, []);

  // Background music hook
  const { startMusic, stopMusic, pauseMusic, resumeMusic } = useBackgroundMusic({
    isEnabled: audioSettings.backgroundMusic?.enabled || false,
    selectedMusic: audioSettings.backgroundMusic?.selected || 'cosmic',
    volume: audioSettings.backgroundMusic?.volume || 0.3
  });

  // Countdown sound hook
  const { playCountdownTick, stopCountdownTicks } = useCountdownSound();


  // Add voice guidance with static audio files
  const { isVoiceSupported, isVoiceReady, isVoiceLoading, stopVoice, triggerVoicePrompt } = useBreathingVoice({
    phase: phase as "inhale" | "exhale" | "hold1" | "hold2",
    isActive,
    exerciseTitle: exerciseSettings.title
  });

  // Create a stable voice prompt callback
  const handleVoicePrompt = useCallback((newPhase: "inhale" | "exhale" | "hold1" | "hold2") => {
    if (isActive && triggerVoicePrompt) {
      console.log(`🎙️ Triggering voice prompt for phase: ${newPhase}`);
      triggerVoicePrompt(newPhase);
    }
  }, [isActive, triggerVoicePrompt]);

  // Trigger voice prompts when phase changes
  useEffect(() => {
    if (isActive && phase !== "idle" && phase !== "countdown") {
      console.log(`🎙️ Phase changed to: ${phase}, triggering voice prompt`);
      handleVoicePrompt(phase as "inhale" | "exhale" | "hold1" | "hold2");
    }
  }, [phase, isActive, handleVoicePrompt]);

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
    // Check trial limit for unauthenticated users
    if (!user && !isActive && phase === "idle" && hasReachedLimit) {
      setShowSignUpModal(true);
      return;
    }
    
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

  const handleToggle = () => {
    // Check trial limit for unauthenticated users
    if (!user && !isActive && phase === "idle" && hasReachedLimit) {
      setShowSignUpModal(true);
      return;
    }
    
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

  // Handle background music and countdown sound
  useEffect(() => {
    if (isActive && phase === "countdown") {
      // Start background music and countdown sound when exercise begins
      startMusic();
      playCountdownTick(); // Play the full 3-tick audio clip once
    } else if (!isActive && phase === "idle") {
      // Stop background music when exercise ends
      stopMusic();
    }
  }, [isActive, phase]);

  // Stop countdown sound when exercise is reset
  useEffect(() => {
    if (phase === "idle" && !isActive) {
      stopCountdownTicks();
    }
  }, [phase, isActive]);


  return (
    <>
      <SignUpPromptModal open={showSignUpModal} onOpenChange={setShowSignUpModal} />
    <div className="flex flex-col items-center justify-center w-full h-full gap-[4.5vh] sm:gap-[5.5vh]">
      {/* Exercise Title */}
      {exerciseSettings.title && (
        <div className="text-center">
          <h2 className="text-[1.5rem] font-semibold text-white">
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
      
      <div className="flex items-center justify-center flex-shrink-0">
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
        isAuthenticated={!!user}
        remainingSessions={remainingSessions}
      />
      </div>
    </>
  );
};

export default BreathingExercise;
