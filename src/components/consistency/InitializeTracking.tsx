
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InitializeTrackingProps {
  onInitialized: (data: any) => void;
}

export const InitializeTracking = ({ onInitialized }: InitializeTrackingProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreatingStreak, setIsCreatingStreak] = useState(false);
  
  const createUserStreak = async () => {
    if (!user || isCreatingStreak) return;
    
    try {
      setIsCreatingStreak(true);
      
      // Create a new streak record for the user
      const { data, error } = await supabase
        .from("user_streaks")
        .insert([{ user_id: user.id }])
        .select("*")
        .single();
        
      if (error) throw error;
      
      // Create a daily activity record
      await supabase
        .from("daily_activity")
        .insert([{ user_id: user.id }]);
      
      onInitialized(data);
      
      toast({
        title: "Success",
        description: "Your consistency tracking has been initialized!",
      });
    } catch (error) {
      console.error("Error creating streak data:", error);
      toast({
        title: "Error",
        description: "Failed to initialize consistency tracking",
        variant: "destructive",
      });
    } finally {
      setIsCreatingStreak(false);
    }
  };
  
  return (
    <div className="text-center">
      <p className="text-muted-foreground mb-6">
        You need to initialize consistency tracking for your account
      </p>
      <Button 
        onClick={createUserStreak} 
        disabled={isCreatingStreak}
      >
        {isCreatingStreak ? "Setting up..." : "Initialize Tracking"}
      </Button>
    </div>
  );
};
