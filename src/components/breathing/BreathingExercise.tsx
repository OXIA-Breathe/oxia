import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BreathingCircle from "./BreathingCircle";
import BreathingStats from "./BreathingStats";
import BreathingControls from "./BreathingControls";
import { SignUpPromptModal } from "./SignUpPromptModal";
import PreExerciseCheckIn from "../emotion/PreExerciseCheckIn";
import PostExerciseTracking from "../emotion/PostExerciseTracking";
import { useBreathingSession } from "./hooks/useBreathingSession";
import { useBreathingTimer } from "./hooks/useBreathingTimer";
import { useElapsedTimer } from "./hooks/useElapsedTimer";
import { useBreathingVoice } from "@/hooks/useBreathingVoice";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useCountdownSound } from "@/hooks/useCountdownSound";
import { useEmotionTracking } from "@/hooks/useEmotionTracking";
import { useAuth } from "@/context/AuthContext";
import { useTrialCounter } from "@/hooks/useTrialCounter";
import { useToast } from "@/hooks/use-toast";

const BreathingExercise = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasReachedLimit, remainingSessions, incrementTrial } = useTrialCounter();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showPreCheckIn, setShowPreCheckIn] = useState(false);
  const [showPostTracking, setShowPostTracking] = useState(false);
  const [completedSessionData, setCompletedSessionData] = useState<{ breathCount: number; duration: number; sessionId?: string } | null>(null);
  
  const {
    emotionData,
    isTrackingEnabled,
    checkTrackingEnabled,
    setPreEmotion,
    setPostEmotionAndSave,
    resetEmotionTracking,
  } = useEmotionTracking();

  // Check emotion tracking status on mount
  useEffect(() => {
    checkTrackingEnabled();
  }, [checkTrackingEnabled]);

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

  // Background music hook - moved up before handleSessionComplete
  const { startMusic, stopMusic, pauseMusic, resumeMusic } = useBackgroundMusic({
    isEnabled: audioSettings.backgroundMusic?.enabled || false,
    selectedMusic: audioSettings.backgroundMusic?.selected || 'cosmic',
    volume: audioSettings.backgroundMusic?.volume || 0.3
  });

  // Track if we should stop music (only on manual reset, not on session complete)
  const shouldStopMusicRef = useRef(true);

  const handleSessionComplete = useCallback((sessionData: { breathCount: number; duration: number; sessionId: string }) => {
    // Prevent automatic music stop - let it fade out gracefully
    shouldStopMusicRef.current = false;
    
    // Fade out the music after a brief delay
    setTimeout(() => {
      stopMusic();
    }, 500);
    
    // Increment trial counter when session completes (for unauthenticated users)
    if (!user) {
      incrementTrial().then(() => {
        // remainingSessions will update via state, but check after increment
      });
      
      // Check if this was the last free session
      if (remainingSessions === 1) {
        setTimeout(() => setShowSignUpModal(true), 1000);
      }
    }
    
    // If emotion tracking is enabled, show post-exercise tracking
    if (isTrackingEnabled) {
      setCompletedSessionData(sessionData);
      setShowPostTracking(true);
    } else {
      // Show default completion toast
      toast({
        title: "Session completed!",
        description: `You completed ${sessionData.breathCount} breaths in ${sessionData.duration} seconds.`,
      });
    }
  }, [user, incrementTrial, remainingSessions, isTrackingEnabled, toast, stopMusic]);

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
  } = useBreathingSession(handleSessionComplete);

  // Countdown sound hook
  const { playCountdownTick, stopCountdownTicks } = useCountdownSound();

  // Add voice guidance with static audio files
  const { stopVoice, triggerVoicePrompt } = useBreathingVoice({
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

  // Start the exercise (called after modal closes or directly if no modal)
  const startExerciseFromIdle = useCallback(() => {
    toggleExercise();
  }, [toggleExercise]);

  // Handle pre-exercise check-in
  const handlePreCheckInSubmit = (valence: number, arousal: number) => {
    setPreEmotion(valence, arousal);
    // Start exercise after submitting pre-check-in
    startExerciseFromIdle();
  };

  const handlePreCheckInSkip = () => {
    resetEmotionTracking();
    // Start exercise after skipping pre-check-in
    startExerciseFromIdle();
  };

  // Handle post-exercise tracking
  const handlePostTrackingSubmit = async (valence: number, arousal: number, note: string) => {
    if (completedSessionData) {
      await setPostEmotionAndSave(valence, arousal, note, completedSessionData.sessionId);
    }
    setShowPostTracking(false);
    setCompletedSessionData(null);
    toast({
      title: "Session saved!",
      description: "Your breathing session and emotions have been recorded.",
    });
  };

  const handlePostTrackingSkip = () => {
    setShowPostTracking(false);
    setCompletedSessionData(null);
    resetEmotionTracking();
    toast({
      title: "Session completed!",
      description: completedSessionData 
        ? `You completed ${completedSessionData.breathCount} breaths in ${completedSessionData.duration} seconds.`
        : "Great work!",
    });
  };

  // Common logic for starting/toggling exercise
  const handleStartOrToggle = useCallback(() => {
    // Check trial limit for unauthenticated users
    if (!user && !isActive && phase === "idle" && hasReachedLimit) {
      setShowSignUpModal(true);
      return;
    }

    // Show pre-exercise check-in if emotion tracking is enabled and starting fresh
    if (!isActive && phase === "idle" && isTrackingEnabled) {
      setShowPreCheckIn(true);
      return; // Don't start exercise yet - wait for modal to close
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
  }, [user, isActive, phase, hasReachedLimit, isTrackingEnabled, phaseTimeRemaining, timeRemaining, setPhaseTimeRemaining, pauseMusic, resumeMusic, toggleExercise]);

  const handleCircleClick = () => {
    handleStartOrToggle();
  };

  const handleToggle = () => {
    handleStartOrToggle();
  };

  const handleReset = () => {
    stopVoice();
    stopMusic();
    resetExercise();
    resetEmotionTracking();
  };

  // Handle background music and countdown sound
  useEffect(() => {
    if (isActive && phase === "countdown") {
      startMusic();
      playCountdownTick();
      shouldStopMusicRef.current = true; // Reset flag when starting
    } else if (!isActive && phase === "idle" && shouldStopMusicRef.current) {
      // Only stop music on manual reset, session completion handles its own fade
      stopMusic();
    }
  }, [isActive, phase]);

  // Stop countdown sound when exercise is reset
  useEffect(() => {
    if (phase === "idle" && !isActive) {
      stopCountdownTicks();
    }
  }, [phase, isActive]);

  // Show post-exercise tracking modal
  if (showPostTracking && completedSessionData) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4">
        <PostExerciseTracking
          breathCount={completedSessionData.breathCount}
          duration={completedSessionData.duration}
          preMood={emotionData.preValence ?? undefined}
          preStress={emotionData.preStress ?? undefined}
          onSubmit={handlePostTrackingSubmit}
          onSkip={handlePostTrackingSkip}
        />
      </div>
    );
  }

  return (
    <>
      <SignUpPromptModal open={showSignUpModal} onOpenChange={setShowSignUpModal} />
      <PreExerciseCheckIn
        open={showPreCheckIn}
        onOpenChange={setShowPreCheckIn}
        onSubmit={handlePreCheckInSubmit}
        onSkip={handlePreCheckInSkip}
      />
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
