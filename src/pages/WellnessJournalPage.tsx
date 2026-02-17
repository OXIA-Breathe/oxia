import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Brain, Wind, Heart, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface InsightSummary {
  totalSessions: number;
  totalBreaths: number;
  totalMinutes: number;
  favExercise: string | null;
  avgDuration: number;
}

const WellnessJournalPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [insights, setInsights] = useState<string | null>(null);
  const [summary, setSummary] = useState<InsightSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-wellness-insights");

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setInsights(data.insights);
      setSummary(data.summary || null);
      setHasGenerated(true);
    } catch (err) {
      console.error("Failed to generate insights:", err);
      toast({
        title: "Something went wrong",
        description: "Could not generate your wellness insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container pt-24 pb-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="h-7 w-7 text-accent-foreground" />
            AI Wellness Journal
          </h1>
          <p className="text-white/70">
            Your personal AI analyzes your breathing & emotion data to give you tailored insights.
          </p>
        </div>

        {/* Summary stats */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard icon={<Wind className="h-4 w-4" />} label="Sessions" value={summary.totalSessions} />
            <StatCard icon={<Heart className="h-4 w-4" />} label="Breaths" value={summary.totalBreaths.toLocaleString()} />
            <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Minutes" value={summary.totalMinutes} />
            <StatCard icon={<Brain className="h-4 w-4" />} label="Favorite" value={summary.favExercise || "—"} small />
          </div>
        )}

        {/* Main insights card */}
        <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              {hasGenerated ? "Your Insights" : "Generate Your Wellness Report"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!hasGenerated && !isLoading && (
              <div className="text-center py-8 space-y-4">
                <p className="text-muted-foreground">
                  Tap below and our AI will review your recent breathing sessions and emotional patterns to create a personalized wellness report.
                </p>
                <Button
                  onClick={generateInsights}
                  className="bg-breath hover:bg-breath/90"
                  size="lg"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Insights
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <RefreshCw className="h-8 w-8 text-breath animate-spin" />
                <p className="text-muted-foreground text-sm">Analyzing your wellness data…</p>
              </div>
            )}

            {hasGenerated && insights && !isLoading && (
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none text-foreground">
                  <ReactMarkdown>{insights}</ReactMarkdown>
                </div>
                <div className="pt-4 border-t border-border flex justify-center">
                  <Button
                    onClick={generateInsights}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

const StatCard = ({ icon, label, value, small }: { icon: React.ReactNode; label: string; value: string | number; small?: boolean }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm">
    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
      {icon}
      <span className="text-xs">{label}</span>
    </div>
    <p className={`font-bold text-foreground ${small ? "text-xs truncate" : "text-lg"}`}>{value}</p>
  </div>
);

export default WellnessJournalPage;
