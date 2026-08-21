import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileActions from "@/components/profile/ProfileActions";
import ProfileBadges from "@/components/profile/ProfileBadges";
import ProfileStreaks from "@/components/profile/ProfileStreaks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Flame, Award, Settings } from "lucide-react";

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fromPage = location.state?.from || "/";

  useEffect(() => {
    window.history.replaceState({ from: fromPage }, "");
  }, [fromPage, navigate]);

  if (!isLoading && !user) {
    return <Navigate to="/auth" />;
  }

  const sections: Array<{
    title: string;
    icon: typeof User;
    children: React.ReactNode;
  }> = [
    { title: "Profile Information", icon: User, children: <ProfileInfo /> },
    { title: "My Streaks", icon: Flame, children: <ProfileStreaks /> },
    { title: "Achievements", icon: Award, children: <ProfileBadges /> },
    { title: "Account Actions", icon: Settings, children: <ProfileActions /> },
  ];

  return (
    <MainLayout>
      <div className="container pt-20 pb-12 max-w-4xl">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
            Your space
          </p>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        </div>

        <div className="space-y-5">
          {sections.map(({ title, icon: Icon, children }) => (
            <Card key={title} className="bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-foreground">{title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>{children}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
