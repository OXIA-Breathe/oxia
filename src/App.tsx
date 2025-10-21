
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BreathProvider } from "./context/BreathContext";
import { BreathingExerciseProvider } from "./context/BreathingExerciseContext";
import { AuthProvider } from "./context/AuthContext";
import { useDailyStreakTracker } from "./hooks/useDailyStreakTracker";
import { useScreenTracking } from "./hooks/useScreenTracking";
import Index from "./pages/Index";
import LearnPage from "./pages/LearnPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ConsistencyPage from "./pages/ConsistencyPage";
import BreathePage from "./pages/BreathePage";
import ExerciseDetailsPage from "./pages/ExerciseDetailsPage";
import NotFound from "./pages/NotFound";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const queryClient = new QueryClient();

const AppContent = () => {
  useDailyStreakTracker();
  useScreenTracking();
  
  return (
    <BrowserRouter>
      <BreathProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/breathe" element={<BreathePage />} />
          <Route path="/breathe/:id" element={<ExerciseDetailsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/progress" element={<ConsistencyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BreathProvider>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BreathingExerciseProvider>
          <AppContent />
        </BreathingExerciseProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
