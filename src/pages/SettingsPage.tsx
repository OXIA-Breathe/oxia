
import { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AudioSettings from "@/components/settings/AudioSettings";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const SettingsPage = () => {
  const { user, isLoading } = useAuth();
  
  const [audioSettings, setAudioSettings] = useState({
    backgroundMusic: {
      enabled: false,
      selected: 'nature',
    },
    voiceGuidance: {
      enabled: true,
      selected: 'aria',
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
          <div className="flex flex-col items-center space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 w-full text-gray-800">
              <p className="text-center">Loading...</p>
            </div>
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
        <div className="flex flex-col items-center space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 w-full text-gray-800">
            <AudioSettings 
              settings={audioSettings} 
              onSettingsChange={setAudioSettings} 
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 w-full text-gray-800">
            <NotificationSettings />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
