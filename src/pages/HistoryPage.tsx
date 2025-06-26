
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

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
        
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-center flex items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              Session History Moved
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Your session history has been moved to the Progress page for better organization.
            </p>
            <Button asChild>
              <Link to="/progress">
                Go to Progress Page
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default HistoryPage;
