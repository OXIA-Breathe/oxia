
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import LoadingSkeleton from "./components/layout/LoadingSkeleton";
import { BreathProvider } from "./context/BreathContext";
import { BreathingExerciseProvider } from "./context/BreathingExerciseContext";
import { AuthProvider } from "./context/AuthContext";
import { useDailyStreakTracker } from "./hooks/useDailyStreakTracker";
import { ScreenTracker } from "./components/layout/ScreenTracker";
import { queryClient, queryPersister } from "./lib/queryClient";
import { preloadMainRoutes } from "./lib/routePreload";


// Lazy load all pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const LearnPage = lazy(() => import("./pages/LearnPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ConsistencyPage = lazy(() => import("./pages/ConsistencyPage"));
const BreathePage = lazy(() => import("./pages/BreathePage"));
const ExerciseDetailsPage = lazy(() => import("./pages/ExerciseDetailsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const HealthConnectPreview = lazy(() => import("./pages/HealthConnectPreview"));
const WellnessJournalPage = lazy(() => import("./pages/WellnessJournalPage"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const EulaPage = lazy(() => import("./pages/EulaPage"));
const PremiumDebugPage = lazy(() => import("./pages/PremiumDebugPage"));

const AppContent = () => {
  useDailyStreakTracker();

  // Warm the other tab bundles while idle so switching pages is instant
  useEffect(() => {
    preloadMainRoutes();
  }, []);

  return (

    <BrowserRouter>
      <ScreenTracker />
      <BreathProvider>
        <Suspense fallback={<LoadingSkeleton />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/breathe" element={<BreathePage />} />
            <Route path="/breathe/:id" element={<ExerciseDetailsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/progress" element={<ConsistencyPage />} />
            <Route path="/health-connect-preview" element={<HealthConnectPreview />} />
            <Route path="/journal" element={<WellnessJournalPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/eula" element={<EulaPage />} />
            <Route path="/premium-debug" element={<PremiumDebugPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BreathProvider>
    </BrowserRouter>
  );
};

const App = () => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister: queryPersister, maxAge: 24 * 60 * 60 * 1000 }}
  >
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BreathingExerciseProvider>
          <AppContent />
        </BreathingExerciseProvider>
      </TooltipProvider>
    </AuthProvider>
  </PersistQueryClientProvider>

);

export default App;
