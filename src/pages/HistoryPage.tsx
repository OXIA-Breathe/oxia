
import MainLayout from "@/components/layout/MainLayout";
import SessionHistory from "@/components/history/SessionHistory";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const HistoryPage = () => {
  const { user, isLoading } = useAuth();

  // If not loading and no user, redirect to auth page
  if (!isLoading && !user) {
    return <Navigate to="/auth" />;
  }

  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Your Breathing History</h1>
        <p className="text-center text-muted-foreground mb-8">
          View and export your breathing sessions
        </p>
        <SessionHistory />
      </div>
    </MainLayout>
  );
};

export default HistoryPage;
