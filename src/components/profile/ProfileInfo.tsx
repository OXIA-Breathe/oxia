
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Mail } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AvatarPhotoModal from "./AvatarPhotoModal";

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
}

const ProfileInfo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  console.log("ProfileInfo - User:", user?.id);

  // Fetch profile data
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) {
        console.log("No user, skipping profile fetch");
        return null;
      }
      
      console.log("Fetching profile for user:", user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      
      console.log("Profile data:", data);
      return data as Profile;
    },
    enabled: !!user
  });

  // Set display name when profile data is loaded
  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { display_name?: string; avatar_url?: string }) => {
      if (!user) throw new Error("No user logged in");
      
      console.log("Updating profile with:", updates);
      
      const { error } = await supabase
        .from("profiles")
        .update({ 
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);
        
      if (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive"
      });
    }
  });

  const handleSave = () => {
    updateProfileMutation.mutate({ display_name: displayName });
  };

  const handleCancel = () => {
    setDisplayName(profile?.display_name || "");
    setIsEditing(false);
  };

  const handlePhotoSelected = (photoUrl: string) => {
    updateProfileMutation.mutate({ avatar_url: photoUrl });
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">Error loading profile: {error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex justify-center w-full md:w-auto">
          <div 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowPhotoModal(true)}
            title="Click to change photo"
          >
            <Avatar className="w-24 h-24 border">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback className="text-2xl">
                {displayName ? displayName[0].toUpperCase() : user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="max-w-md"
                />
                <div className="space-x-2">
                  <Button size="sm" onClick={handleSave} disabled={updateProfileMutation.isPending}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium text-gray-800">{profile?.display_name || "No name set"}</p>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} title="Edit name">
                  <Edit size={16} />
                </Button>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <p className="text-gray-800">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      <AvatarPhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onPhotoSelected={handlePhotoSelected}
      />
    </>
  );
};

export default ProfileInfo;
