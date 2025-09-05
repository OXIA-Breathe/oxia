
import { useState } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AudioSettings from "@/components/settings/AudioSettings";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Volume2, Bell, Info, Instagram, Facebook, Twitter, Wallet } from "lucide-react";
import FeedbackForm from "@/components/settings/FeedbackForm";
import ContactForm from "@/components/settings/ContactForm";

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
            <CardContent>
             
              {/* About Accordion */}
              <Accordion type="single" collapsible>
                <AccordionItem value="about" className="border-none">
                  <AccordionTrigger className="text-gray-800 hover:text-breath">
                    About
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed">
                    I've lived with depression and anxiety for many years. Crowded events made my body buzz with discomfort, everyday challenges took a lot of mental energy, and over time the anxiety and stress became overwhelming.
                    <br /><br />
                    Then a friend sent me a link to a Wim Hof Method breathing exercise. I tried it. It changed how I understood my breath—and how my nervous system works.
                    <br /><br />
                    That's how OXIA was born. I want to offer an app that helps you experience the same shift: simple guidance, science-informed explanations, and gentle support for building a lasting habit. OXIA helps you understand why breathing matters for your system, how steady, calm breathing settles the mind and body, and how that can make everyday life feel lighter.
                    <br /><br />
                    Breathe with awareness and ease. Support your body and mind—and feel more at home in yourself.
                    <br /><br />
                    Breathing with you,<br />
                    Kristo Epner<br />
                    Founder
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="feedback" className="border-none">
                  <AccordionTrigger className="text-gray-800 hover:text-breath">
                    Help us improve
                  </AccordionTrigger>
                  <AccordionContent>
                    <FeedbackForm />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="contact" className="border-none">
                  <AccordionTrigger className="text-gray-800 hover:text-breath">
                    Contact us
                  </AccordionTrigger>
                  <AccordionContent>
                    <ContactForm />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Links Section */}
              <div>
                <div className="py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-md flex items-center text-breath hover:text-breath/80 font-medium">
                  Terms & Conditions
                </div>
                <div className="py-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-md flex items-center text-breath hover:text-breath/80 font-medium">
                  Privacy Policy
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Section */}
          <div className="space-y-3">
            {/* Instagram */}
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-center">
                <Instagram className="h-6 w-6 text-breath group-hover:text-breath/80 transition-colors" />
              </div>
            </a>

            {/* Facebook */}
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-center">
                <Facebook className="h-6 w-6 text-breath group-hover:text-breath/80 transition-colors" />
              </div>
            </a>

            {/* Twitter */}
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-center">
                <Twitter className="h-6 w-6 text-breath group-hover:text-breath/80 transition-colors" />
              </div>
            </a>

            {/* TikTok */}
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center justify-center">
                <Wallet className="h-6 w-6 text-breath group-hover:text-breath/80 transition-colors" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
