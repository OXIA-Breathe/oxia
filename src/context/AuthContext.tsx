
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("=== AUTH CONTEXT INITIALIZATION ===");
    
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Update streak data when user logs in - deferred to avoid auth listener deadlocks
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            console.log("Updating login streak for user:", session.user.id);
            updateUserLoginStreak(session.user.id);
          }, 100); // Small delay to avoid blocking
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateUserLoginStreak = async (userId: string) => {
    try {
      console.log("Starting login streak update for:", userId);
      const today = new Date().toISOString().split('T')[0];
      
      // Check if we already processed today's login
      const { data: activityData, error: activityError } = await supabase
        .from("daily_activity")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .maybeSingle();
        
      if (activityError && activityError.code !== 'PGRST116') {
        console.error("Error checking daily activity:", activityError);
        return;
      }
      
      // If we already processed today, skip
      if (activityData) {
        console.log("Already processed login for today");
        return;
      }
      
      // Mark today as logged in
      const { error: insertError } = await supabase
        .from("daily_activity")
        .insert({
          user_id: userId,
          date: today,
          logged_in: true
        });
        
      if (insertError) {
        console.error("Error creating daily activity:", insertError);
        return;
      }
      
      // Get current streak data
      const { data: streakData, error: streakError } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
        
      if (streakError && streakError.code !== 'PGRST116') {
        console.error("Error checking streak data:", streakError);
        return;
      }
      
      // Calculate new login streak
      const lastLoginDate = streakData?.last_login_date;
      const currentStreak = streakData?.current_login_streak || 0;
      const longestStreak = streakData?.longest_login_streak || 0;
      
      let newCurrentStreak = 1;
      
      if (lastLoginDate) {
        const lastDate = new Date(lastLoginDate);
        const todayDate = new Date(today);
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) {
          newCurrentStreak = currentStreak;
        } else if (daysDiff === 1) {
          newCurrentStreak = currentStreak + 1;
        } else {
          newCurrentStreak = 1;
        }
      }
      
      const newLongestStreak = Math.max(longestStreak, newCurrentStreak);
      
      // Update streak data
      const { error: updateStreakError } = await supabase
        .from("user_streaks")
        .upsert({
          user_id: userId,
          last_login_date: today,
          current_login_streak: newCurrentStreak,
          longest_login_streak: newLongestStreak,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
        
      if (updateStreakError) {
        console.error("Error updating login streak:", updateStreakError);
      } else {
        console.log("Successfully updated login streak");
      }
      
    } catch (error) {
      console.error("Error updating login streak:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in for:", email);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error signing in",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Attempting sign up for:", email);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
      toast({
        title: "Account created",
        description: "Check your email for the confirmation link",
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Error creating account",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting sign out");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  console.log("AuthContext render - User:", user?.id, "Loading:", isLoading);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
