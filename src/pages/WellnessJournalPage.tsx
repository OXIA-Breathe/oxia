import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Brain, Wind, Heart, TrendingUp, Activity, Calendar, Crown, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";

interface WellnessSections {
  practiceOverview: string;
  stressPattern: string;
  emotionalShift: string;
  consistencyInsight: string;
}

interface WellnessSummary {
  totalSessions: number;
  totalMinutes: number;
  favExercise: string | null;
  consistencyDays: number;
  longestStreak: number;
  avgStressBefore: number | null;
  avgStressAfter: number | null;
  stressChangePct: number | null;
  mostCommonMoodBefore: string | null;
  mostCommonMoodAfter: string | null;
  period: string;
}

const SECTION_CONFIG = [
  {
    key: "practiceOverview" as keyof WellnessSections,
    title: "Practice Overview",
    icon: Wind,
    accent: "bg-[hsl(204_47%_77%)]", // Glacier
  },
  {
    key: "stressPattern" as keyof WellnessSections,
    title: "Stress Pattern",
    icon: Activity,
    accent: "bg-[hsl(206_30%_53%)]", // Slate
  },
  {
    key: "emotionalShift" as keyof WellnessSections,
    title: "Emotional Shift",
    icon: Heart,
    accent: "bg-[hsl(211_60%_33%)]", // Lapis
  },
  {
    key: "consistencyInsight" as keyof WellnessSections,
    title: "Consistency Insight",
    icon: Calendar,
    accent: "bg-[hsl(213_81%_19%)]", // Abyss
  },
];

const WellnessJournalPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { isPremium, isLoading: isPremiumLoading } = usePremiumStatus();
  const [sections, setSections] = useState<WellnessSections | null>(null);
  const [summary, setSummary] = useState<WellnessSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStored, setIsFetchingStored] = useState(true);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [storedGeneratedAt, setStoredGeneratedAt] = useState<string | null>(null);
  const [premiumOpen, setPremiumOpen] = useState(false);

  // Load any previously saved reflection on mount
  useEffect(() => {
    if (!user) return;

    const fetchStored = async () => {
      setIsFetchingStored(true);
      try {
        const { data, error } = await supabase
          .from("wellness_reflections")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setSections({
            practiceOverview: data.practice_overview,
            stressPattern: data.stress_pattern,
            emotionalShift: data.emotional_shift,
            consistencyInsight: data.consistency_insight,
          });
          setSummary({
            totalSessions: data.total_sessions,
            totalMinutes: data.total_minutes,
            favExercise: null,
            consistencyDays: data.consistency_days,
            longestStreak: data.longest_streak,
            avgStressBefore: null,
            avgStressAfter: null,
            stressChangePct: null,
            mostCommonMoodBefore: null,
            mostCommonMoodAfter: null,
            period: data.period,
          });
          setStoredGeneratedAt(data.generated_at);
          setHasGenerated(true);
        }
      } catch (err) {
        console.error("Failed to load stored reflection:", err);
      } finally {
        setIsFetchingStored(false);
      }
    };

    fetchStored();
  }, [user]);

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

      if (!data.hasData) {
        toast({
          title: "Not enough data",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      setSections(data.sections);
      setSummary(data.summary ?? null);
      setStoredGeneratedAt(new Date().toISOString());
      setHasGenerated(true);
    } catch (err) {
      console.error("Failed to generate insights:", err);
      toast({
        title: "Something went wrong",
        description: "Could not generate your wellness reflection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format the "last generated" timestamp
  const formattedGeneratedAt = storedGeneratedAt
    ? new Date(storedGeneratedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  if (authLoading || isPremiumLoading) {
    return (
      <MainLayout>
        <div className="container pt-24 pb-12 max-w-2xl flex flex-col items-center justify-center min-h-[60vh]">
          <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Loading…</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container pt-24 pb-12 max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2 text-foreground">
            <Sparkles className="h-7 w-7 text-muted-foreground" />
            AI Wellness Journal
          </h1>
          <p className="text-muted-foreground text-sm">
            A structured reflection based on your last 30 days of breathing &amp; emotion data.
          </p>
        </div>

        {/* Premium gate */}
        {!isPremium && (
          <>
            <Card className="relative border-0 shadow-md bg-card/90 backdrop-blur-sm overflow-hidden">
              {/* Blurred preview of what premium unlocks */}
              <div className="blur-sm pointer-events-none select-none p-6 space-y-3" aria-hidden="true">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted/70" />
                <div className="h-3 w-5/6 rounded bg-muted/70" />
                <div className="h-3 w-4/6 rounded bg-muted/70" />
                <div className="h-4 w-1/2 rounded bg-muted mt-6" />
                <div className="h-3 w-full rounded bg-muted/70" />
                <div className="h-3 w-3/4 rounded bg-muted/70" />
              </div>

              <CardContent className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center bg-background/70">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-card-foreground flex items-center justify-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Premium Feature
                  </p>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Subscribe to OXIA Premium to unlock AI-generated wellness reflections based on your breathing and emotion data.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="min-h-[44px] bg-amber-500 hover:bg-amber-500/90 text-white"
                  onClick={() => setPremiumOpen(true)}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              </CardContent>
            </Card>

            <PremiumModal
              open={premiumOpen}
              onOpenChange={setPremiumOpen}
              highlight="Unlock the AI Wellness Journal — a 30-day reflection on your practice."
            />
          </>
        )}

        {isPremium && (
          <>
            {/* Stats strip — shown after generation */}
            {summary && (
          <div className="grid grid-cols-4 gap-2 mb-6">
            <StatChip icon={<Wind className="h-3.5 w-3.5" />} label="Sessions" value={summary.totalSessions} />
            <StatChip icon={<TrendingUp className="h-3.5 w-3.5" />} label="Minutes" value={summary.totalMinutes} />
            <StatChip icon={<Calendar className="h-3.5 w-3.5" />} label="Active days" value={summary.consistencyDays} />
            <StatChip icon={<Brain className="h-3.5 w-3.5" />} label="Best streak" value={`${summary.longestStreak}d`} />
          </div>
        )}

        {/* Initial loading state while fetching stored reflection */}
        {isFetchingStored && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw className="h-6 w-6 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Loading your reflection…</p>
          </div>
        )}

        {/* Empty / first-time state */}
        {!isFetchingStored && !hasGenerated && (
          <Card className="border-0 shadow-md bg-card/90 backdrop-blur-sm">
            <CardContent className="py-12 flex flex-col items-center gap-4 text-center">
              {isLoading ? (
                <>
                  <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-muted-foreground text-sm">Analysing your breathing &amp; emotion data…</p>
                </>
              ) : (
                <>
                  <Sparkles className="h-10 w-10 text-primary/60" />
                  <div className="space-y-1">
                    <p className="font-medium text-card-foreground">Generate your reflection</p>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Our AI will review your last 30 days of sessions and emotion tracking to produce a calm, data-based report.
                    </p>
                  </div>
                  <Button
                    onClick={generateInsights}
                    className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="lg"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Reflection
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Loading state when regenerating */}
        {hasGenerated && isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            <p className="text-muted-foreground text-sm">Refreshing your reflection…</p>
          </div>
        )}

        {/* 4 section cards */}
        {!isFetchingStored && hasGenerated && sections && !isLoading && (
          <div className="space-y-3">
            {SECTION_CONFIG.map(({ key, title, icon: Icon, accent }) => (
              <Card key={key} className="border-0 shadow-md bg-card overflow-hidden relative">
                <span className={`absolute left-0 top-0 bottom-0 w-1.5 ${accent}`} aria-hidden />
                <CardHeader className="pb-2 pt-5 px-5 pl-6">
                  <CardTitle className="text-base flex items-center gap-2 text-card-foreground">
                    <Icon className="h-4 w-4 text-primary shrink-0" />
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pl-6 pb-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {sections[key]}
                  </p>
                </CardContent>
              </Card>
            ))}

            {/* Period label + Last generated + Regenerate */}
            <div className="flex items-center justify-between pt-1 px-1">
              <div className="flex flex-col gap-0.5">
                {summary?.period && (
                  <p className="text-xs text-muted-foreground/70">{summary.period}</p>
                )}
                {formattedGeneratedAt && (
                  <p className="text-xs text-foreground/35">Generated {formattedGeneratedAt}</p>
                )}
              </div>
              <Button
                onClick={generateInsights}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground ml-auto"
              >
                <RefreshCw className="h-3 w-3 mr-1.5" />
                Regenerate
              </Button>
            </div>

            {/* Disclaimer */}
            <p className="text-center text-xs text-foreground/40 pt-2 pb-1 px-4">
              This reflection is based solely on your recorded activity within OXIA and is not medical advice.
            </p>
          </div>
        )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

const StatChip = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="bg-card/80 backdrop-blur-sm rounded-xl py-3 px-2 text-center shadow-sm">
    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
      {icon}
    </div>
    <p className="font-bold text-card-foreground text-base leading-tight">{value}</p>
    <p className="text-muted-foreground text-[10px] mt-0.5 leading-tight">{label}</p>
  </div>
);

export default WellnessJournalPage;
