
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { lazyWithRetry } from "./lib/lazyWithRetry";
import LoadingSkeleton from "./components/layout/LoadingSkeleton";
import { BreathProvider } from "./context/BreathContext";
import { BreathingExerciseProvider } from "./context/BreathingExerciseContext";
import { AuthProvider } from "./context/AuthContext";
import { useDailyStreakTracker } from "./hooks/useDailyStreakTracker";
import { ScreenTracker } from "./components/layout/ScreenTracker";
import DeepLinkHandler from "./components/layout/DeepLinkHandler";
import PurchaseSync from "./components/layout/PurchaseSync";
import WelcomeModal from "./components/onboarding/WelcomeModal";
import { queryClient, queryPersister } from "./lib/queryClient";
import { preloadMainRoutes } from "./lib/routePreload";


// Lazy load all pages for code splitting
const Index = lazyWithRetry(() => import("./pages/Index"));
const LearnPage = lazyWithRetry(() => import("./pages/LearnPage"));
const SettingsPage = lazyWithRetry(() => import("./pages/SettingsPage"));
const AuthPage = lazyWithRetry(() => import("./pages/AuthPage"));
const ProfilePage = lazyWithRetry(() => import("./pages/ProfilePage"));
const ConsistencyPage = lazyWithRetry(() => import("./pages/ConsistencyPage"));
const BreathePage = lazyWithRetry(() => import("./pages/BreathePage"));
const ExerciseDetailsPage = lazyWithRetry(() => import("./pages/ExerciseDetailsPage"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const ResetPasswordPage = lazyWithRetry(() => import("./pages/ResetPasswordPage"));
const VerifyEmailPage = lazyWithRetry(() => import("./pages/VerifyEmailPage"));
const HealthConnectPreview = lazyWithRetry(() => import("./pages/HealthConnectPreview"));
const WellnessJournalPage = lazyWithRetry(() => import("./pages/WellnessJournalPage"));
const PrivacyPolicyPage = lazyWithRetry(() => import("./pages/PrivacyPolicyPage"));
const TermsPage = lazyWithRetry(() => import("./pages/TermsPage"));
const EulaPage = lazyWithRetry(() => import("./pages/EulaPage"));
const PremiumDebugPage = lazyWithRetry(() => import("./pages/PremiumDebugPage"));

const AppContent = () => {
  useDailyStreakTracker();

  // Warm the other tab bundles while idle so switching pages is instant
  useEffect(() => {
    preloadMainRoutes();
  }, []);

  return (

    <BrowserRouter>
      <ScreenTracker />
      <DeepLinkHandler />
      <PurchaseSync />
      <WelcomeModal />
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
