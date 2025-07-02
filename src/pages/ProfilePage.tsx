
import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileActions from "@/components/profile/ProfileActions";
import ProfileBadges from "@/components/profile/ProfileBadges";
import ProfileStreaks from "@/components/profile/ProfileStreaks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Flame, Award, Settings } from "lucide-react";

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
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
      <div className="container py-8 max-w-4xl pt-16">
        <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
        
        <div className="space-y-6">
          {/* Profile Information Section */}
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-breath" />
                <span className="text-gray-800">Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileInfo />
            </CardContent>
          </Card>
          
          {/* My Streaks Section */}
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-gray-800">My Streaks</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileStreaks />
            </CardContent>
          </Card>
          
          {/* Achievements and Badges Section */}
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-800">Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileBadges />
            </CardContent>
          </Card>
          
          {/* Account Actions Section */}
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-6">
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
