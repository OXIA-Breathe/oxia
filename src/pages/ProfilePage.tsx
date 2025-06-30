
import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useBreath } from "@/context/BreathContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileActions from "@/components/profile/ProfileActions";
import ProfileBadges from "@/components/profile/ProfileBadges";
import ProfileStreaks from "@/components/profile/ProfileStreaks";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, User, Flame, Award } from "lucide-react";

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [openInfo, setOpenInfo] = useState(true);
  const [openStreaks, setOpenStreaks] = useState(true);
  const [openBadges, setOpenBadges] = useState(true);
  
  // Store the previous page for back navigation
  const fromPage = location.state?.from || "/";
  
  // Override the default back behavior
  useEffect(() => {
    const handleBackButton = () => {
      navigate(fromPage);
    };
    
    // Update the back button behavior
    window.history.replaceState({ from: fromPage }, '');
    
    return () => {
      // Cleanup if needed
    };
  }, [fromPage, navigate]);
  
  // If not loading and no user, redirect to auth page
  if (!isLoading && !user) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl pt-20">
        <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
        
        <div className="space-y-6">
          {/* Profile Information Section */}
          <div className="border-none shadow-md bg-white rounded-lg p-4">
            <Collapsible 
              open={openInfo} 
              onOpenChange={setOpenInfo}
              className="transition-all duration-200"
            >
              <div className="flex items-center justify-between pb-2 mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <User className="h-5 w-5 text-breath" />
                  Profile Information
                </h2>
                <CollapsibleTrigger asChild>
                  <button className="rounded-full p-1 hover:bg-accent transition-colors">
                    {openInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="transition-all duration-300">
                <ProfileInfo />
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* My Streaks Section */}
          <div className="border-none shadow-md bg-white rounded-lg p-4">
            <Collapsible 
              open={openStreaks} 
              onOpenChange={setOpenStreaks}
              className="transition-all duration-200"
            >
              <div className="flex items-center justify-between pb-2 mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  My Streaks
                </h2>
                <CollapsibleTrigger asChild>
                  <button className="rounded-full p-1 hover:bg-accent transition-colors">
                    {openStreaks ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="transition-all duration-300">
                <ProfileStreaks />
              </CollipsibleContent>
            </Collapsible>
          </div>
          
          {/* Achievements and Badges Section */}
          <div className="border-none shadow-md bg-white rounded-lg p-4">
            <Collapsible 
              open={openBadges} 
              onOpenChange={setOpenBadges}
              className="transition-all duration-200"
            >
              <div className="flex items-center justify-between pb-2 mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Achievements
                </h2>
                <CollapsibleTrigger asChild>
                  <button className="rounded-full p-1 hover:bg-accent transition-colors">
                    {openBadges ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent className="transition-all duration-300">
                <ProfileBadges />
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* Account Actions Section (not collapsible) */}
          <ProfileActions />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
