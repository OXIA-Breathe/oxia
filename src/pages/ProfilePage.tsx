
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, User, Flame, Award, Settings } from "lucide-react";

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
          <Card className="border-none shadow-md bg-white">
            <Collapsible 
              open={openInfo} 
              onOpenChange={setOpenInfo}
              className="transition-all duration-200"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-breath" />
                    <span className="text-gray-800">Profile Information</span>
                  </CardTitle>
                  <CollapsibleTrigger asChild>
                    <button className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                      {openInfo ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent className="transition-all duration-300">
                <CardContent>
                  <ProfileInfo />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
          
          {/* My Streaks Section */}
          <Card className="border-none shadow-md bg-white">
            <Collapsible 
              open={openStreaks} 
              onOpenChange={setOpenStreaks}
              className="transition-all duration-200"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <span className="text-gray-800">My Streaks</span>
                  </CardTitle>
                  <CollapsibleTrigger asChild>
                    <button className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                      {openStreaks ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent className="transition-all duration-300">
                <CardContent>
                  <ProfileStreaks />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
          
          {/* Achievements and Badges Section */}
          <Card className="border-none shadow-md bg-white">
            <Collapsible 
              open={openBadges} 
              onOpenChange={setOpenBadges}
              className="transition-all duration-200"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-800">Achievements</span>
                  </CardTitle>
                  <CollapsibleTrigger asChild>
                    <button className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                      {openBadges ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent className="transition-all duration-300">
                <CardContent>
                  <ProfileBadges />
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
          
          {/* Account Actions Section (not collapsible) */}
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" />
                <span className="text-gray-800">Account Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileActions />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
