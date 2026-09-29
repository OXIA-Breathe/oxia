import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useBreath } from "@/context/BreathContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Number of saved sessions for the current user.
 * Signed in -> authoritative count from Supabase (stays correct after deletions).
 * Guest -> local session list.
 */
export const useSavedSessionCount = () => {
  const { user } = useAuth();
  const { sessions } = useBreath();

  const { data: onlineCount = 0 } = useQuery({
    queryKey: ["sessionCount", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { count, error } = await supabase
        .from("breath_sessions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user,
    staleTime: 30 * 1000,
  });

  return user ? onlineCount : sessions.length;
};
