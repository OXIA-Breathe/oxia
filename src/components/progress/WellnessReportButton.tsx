
import { useState } from "react";
import { FileText, Loader2, ChevronLeft, ChevronRight, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { format, startOfMonth, endOfMonth, subMonths, addMonths } from "date-fns";
import { generateWellnessPDF } from "./wellness-pdf/generateWellnessPDF";
import { WellnessEmotionRecord } from "./wellness-pdf/wellnessPdfTypes";

interface WellnessReportButtonProps {
  exerciseEffectiveness: any[];
}

const WellnessReportButton = ({ exerciseEffectiveness }: WellnessReportButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  // Default to previous month so there's likely data
  const [selectedMonth, setSelectedMonth] = useState<Date>(subMonths(startOfMonth(new Date()), 1));

  const handlePrevMonth = () => setSelectedMonth(m => subMonths(m, 1));
  const handleNextMonth = () => {
    const next = addMonths(selectedMonth, 1);
    if (next <= startOfMonth(new Date())) setSelectedMonth(next);
  };

  const isCurrentMonthOrFuture = addMonths(selectedMonth, 1) > startOfMonth(new Date());

  const handleGenerate = async () => {
    if (!user) return;
    setIsGenerating(true);

    try {
      const from = startOfMonth(selectedMonth);
      const to = endOfMonth(selectedMonth);

      // Fetch sessions for the selected month
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("breath_sessions")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", from.toISOString())
        .lte("date", to.toISOString())
        .order("date", { ascending: false });

      if (sessionsError) throw sessionsError;

      // Fetch emotion tracking for the period
      const { data: emotionData, error: emotionError } = await supabase
        .from("emotion_tracking")
        .select("created_at, pre_valence, post_valence, pre_arousal, post_arousal")
        .eq("user_id", user.id)
        .gte("created_at", from.toISOString())
        .lte("created_at", to.toISOString());

      if (emotionError) throw emotionError;

      // Fetch streak data
      const { data: streakData } = await supabase
        .from("user_streaks")
        .select("current_breath_streak, longest_breath_streak, current_login_streak")
        .eq("user_id", user.id)
        .maybeSingle();

      // Fetch user profile for display name
      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();

      const sessions = (sessionsData || []).map((s: any) => ({
        id: s.id,
        date: s.date,
        breathCount: s.breath_count,
        totalDuration: s.total_duration,
        holdDuration: s.hold_duration,
        exerciseTitle: s.exercise_title,
        repetitions: s.repetitions,
      }));

      const emotionRecords: WellnessEmotionRecord[] = (emotionData || []).map((r: any) => ({
        created_at: r.created_at,
        pre_valence: r.pre_valence,
        post_valence: r.post_valence,
        pre_arousal: r.pre_arousal,
        post_arousal: r.post_arousal,
      }));

      const { blob, fileName } = await generateWellnessPDF({
        sessions,
        exerciseEffectiveness,
        emotionRecords,
        streakData: streakData
          ? {
              currentBreathStreak: streakData.current_breath_streak,
              longestBreathStreak: streakData.longest_breath_streak,
              currentLoginStreak: streakData.current_login_streak,
            }
          : null,
        reportMonth: format(selectedMonth, "MMMM yyyy"),
        reportPeriod: { from, to },
        userName: profileData?.display_name || undefined,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Wellness report saved",
        description: `Your ${format(selectedMonth, "MMMM yyyy")} report has been downloaded.`,
      });

      setOpen(false);
    } catch (err) {
      console.error("Error generating wellness PDF:", err);
      toast({
        title: "Error generating report",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
        onClick={() => setOpen(true)}
      >
        <FileText className="h-4 w-4" />
        Wellness Report
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Monthly Wellness Report</DialogTitle>
            <DialogDescription>
              Download a PDF summary of your breathing activity, mood improvements, and top exercises for any month.
            </DialogDescription>
          </DialogHeader>

          {/* Month picker */}
          <div className="flex items-center justify-between py-4 px-2 rounded-xl bg-muted/40">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth} disabled={isGenerating}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-base font-semibold text-foreground">
              {format(selectedMonth, "MMMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              disabled={isGenerating || isCurrentMonthOrFuture}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Includes sessions, mood tracking, exercise rankings & key insights
          </p>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating} className="bg-breath hover:bg-breath/90">
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WellnessReportButton;
