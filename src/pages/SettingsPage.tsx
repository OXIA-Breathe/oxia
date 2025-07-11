
import { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AudioSettings from "@/components/settings/AudioSettings";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Bell } from "lucide-react";

const SettingsPage = () => {
  const { user, isLoading } = useAuth();
  
  const [audioSettings, setAudioSettings] = useState({
    backgroundMusic: {
      enabled: false,
      selected: 'nature',
    },
    voiceGuidance: {
      enabled: true,
      selected: 'kristo',
    },
    breathingVoices: {
      enabled: false,
      selected: 'gentle',
    },
  });

  console.log("SettingsPage - User:", user?.id, "Loading:", isLoading);

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>
          <div className="space-y-6">
            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-6">
                <p className="text-center text-gray-800">Loading...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  // If not loading and no user, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <MainLayout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Settings</h1>
        <div className="space-y-6">
          {/* Audio Settings Section */}
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-breath" />
                <span className="text-gray-800">Audio Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AudioSettings 
                settings={audioSettings} 
                onSettingsChange={setAudioSettings} 
              />
            </CardContent>
          </Card>
          
          {/* Notification Settings Section */}
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-breath" />
                <span className="text-gray-800">Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
