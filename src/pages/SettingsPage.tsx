
import { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AudioSettings from "@/components/settings/AudioSettings";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Volume2, Bell, Info } from "lucide-react";

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

          {/* About Us Section */}
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-breath" />
                <span className="text-gray-800">About Us</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Links Section */}
              <div className="space-y-2">
                <div className="py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-md flex items-center text-breath hover:text-breath/80 font-medium">
                  Terms & Conditions
                </div>
                <Separator className="my-2" />
                <div className="py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-md flex items-center text-breath hover:text-breath/80 font-medium">
                  Privacy Policy
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* About Accordion */}
              <Accordion type="single" collapsible>
                <AccordionItem value="about" className="border-none">
                  <AccordionTrigger className="text-gray-800 hover:text-breath">
                    About
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    Our breathing app is designed to help you find moments of calm and mindfulness in your daily life. 
                    We believe that proper breathing techniques can significantly improve your mental and physical well-being. 
                    Our company is dedicated to creating tools that promote wellness and help people develop healthy habits 
                    for a more balanced lifestyle.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
