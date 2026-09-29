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
import { useBreath } from "@/context/BreathContext";
import { useSavedSessionCount } from "@/hooks/useSavedSessionCount";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { supabase } from "@/integrations/supabase/client";
import { keepScreenAwake, allowScreenSleep } from "@/lib/keepAwake";
import { wasShown, markShown, PREMIUM_REMINDER_MILESTONES } from "@/lib/upsellPrompts";
import SessionCompleteModal from "./SessionCompleteModal";
import PremiumModal from "@/components/premium/PremiumModal";
import type { PendingSession } from "./hooks/useBreathingSession";

const TRIAL_LIMIT = 10;

const BreathingExercise = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasReachedLimit, remainingSessions, incrementTrial } = useTrialCounter();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showPreCheckIn, setShowPreCheckIn] = useState(false);
  const [showPostTracking, setShowPostTracking] = useState(false);
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [signUpVariant, setSignUpVariant] = useState<"limit" | "invite">("limit");
  const [showTrackingUpsell, setShowTrackingUpsell] = useState(false);
  const startAfterUpsellRef = useRef(false);
  const purchasedRef = useRef(false);
  const savedSessionCount = useSavedSessionCount();
  const { isPremium, refresh: refreshPremium } = usePremiumStatus();
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

  const handleSessionComplete = useCallback((sessionData: { breathCount: number; duration: number; sessionId: string; session: PendingSession }) => {
    // Prevent automatic music stop - let it fade out gracefully
    shouldStopMusicRef.current = false;
    setTimeout(() => {
      stopMusic();
    }, 500);

    // Show the "Well done!" screen; nothing is stored until the user taps Save.
    setPendingSession(sessionData.session);
  }, [stopMusic]);

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
    saveSession,
  } = useBreathingSession(handleSessionComplete);

  // Keep the screen awake while an exercise is running (user setting).
  useEffect(() => {
    if (isActive) keepScreenAwake();
    else allowScreenSleep();
  }, [isActive]);
  useEffect(() => () => { allowScreenSleep(); }, []);

  const handleSaveSession = async () => {
    if (!pendingSession) return;
    const session = pendingSession;
    setIsSaving(true);
    try {
      await saveSession(session);
    } finally {
      setIsSaving(false);
      setPendingSession(null);
    }

    if (!user) {
      // Guests: each saved session uses one of the free trial sessions.
      const wasLast = remainingSessions <= 1;
      const isFirst = remainingSessions === TRIAL_LIMIT;
      incrementTrial();
      if (wasLast) {
        setSignUpVariant("limit");
        setTimeout(() => setShowSignUpModal(true), 400);
      } else if (isFirst && !wasShown(null, "signup-first")) {
        markShown(null, "signup-first");
        setSignUpVariant("invite");
        setTimeout(() => setShowSignUpModal(true), 400);
      }
    }

    if (isTrackingEnabled) {
      setCompletedSessionData({ breathCount: session.breathCount, duration: session.totalDuration, sessionId: session.id });
      setShowPostTracking(true);
      return;
    }

    toast({ title: "Session saved", description: "You'll find it in your Progress." });

    // Registered free users: Premium reminder after the 10th, 20th and 100th session.
    if (user && !isPremium) {
      const total = savedSessionCount + 1;
      const milestone = PREMIUM_REMINDER_MILESTONES.find((m) => m === total);
      if (milestone && !wasShown(user.id, `premium-${milestone}`)) {
        markShown(user.id, `premium-${milestone}`);
        startAfterUpsellRef.current = false;
        setTimeout(() => setShowTrackingUpsell(true), 400);
      }
    }
  };

  const handleDiscardSession = () => {
    setPendingSession(null);
    handleReset();
  };

  const handleUpsellOpenChange = (open: boolean) => {
    setShowTrackingUpsell(open);
    if (!open) {
      // Wait a tick so onPurchased (if any) runs first.
      setTimeout(() => {
        if (!purchasedRef.current && startAfterUpsellRef.current) {
          startAfterUpsellRef.current = false;
          toggleExercise();
        }
        purchasedRef.current = false;
      }, 0);
    }
  };

  const handleUpsellPurchased = async () => {
    purchasedRef.current = true;
    startAfterUpsellRef.current = false;
    if (user) {
      await supabase.from("profiles").update({ emotion_tracking_enabled: true }).eq("id", user.id);
      await refreshPremium();
    }
    // Go straight to the before-session check-in.
    setShowPreCheckIn(true);
  };

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
    toast({ title: "Session saved", description: "You'll find it in your Progress." });
  };

  // Common logic for starting/toggling exercise
  const handleStartOrToggle = useCallback(() => {
    // Check trial limit for unauthenticated users
    if (!user && !isActive && phase === "idle" && hasReachedLimit) {
      setSignUpVariant("limit");
      setShowSignUpModal(true);
      return;
    }

    // Registered free users: invite to Premium before their 2nd session.
    if (user && !isPremium && !isActive && phase === "idle" && sessions.length === 1 && !wasShown(user.id, "premium-before-2")) {
      markShown(user.id, "premium-before-2");
      startAfterUpsellRef.current = true;
      setShowTrackingUpsell(true);
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
  }, [user, isPremium, sessions.length, isActive, phase, hasReachedLimit, isTrackingEnabled, phaseTimeRemaining, timeRemaining, setPhaseTimeRemaining, pauseMusic, resumeMusic, toggleExercise]);

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
      <SignUpPromptModal open={showSignUpModal} onOpenChange={setShowSignUpModal} variant={signUpVariant} />
      <SessionCompleteModal
        open={!!pendingSession}
        exerciseTitle={pendingSession?.exerciseTitle ?? ""}
        repetitions={pendingSession?.repetitions ?? 0}
        durationSeconds={pendingSession?.totalDuration ?? 0}
        saving={isSaving}
        onSave={handleSaveSession}
        onDiscard={handleDiscardSession}
      />
      <PremiumModal
        open={showTrackingUpsell}
        onOpenChange={handleUpsellOpenChange}
        onPurchased={handleUpsellPurchased}
        highlight="Track how breathing changes you. Premium asks how you feel before and after each session and shows your stress and mood trends over time."
      />
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
            <h2 className="text-[1.5rem] font-bold text-foreground">
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
