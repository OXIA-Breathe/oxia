
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from "@/components/layout/MainLayout";
import { APP_VERSION } from "@/version";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AudioSettings from "@/components/settings/AudioSettings";
import OtherSettings from "@/components/settings/OtherSettings";
import SubscriptionSettings from "@/components/settings/SubscriptionSettings";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Volume2, Bell, Info, Instagram, MessageCircleHeart, Share, Music2, Settings2, Crown } from "lucide-react";
import FeedbackForm from "@/components/settings/FeedbackForm";
import ContactForm from "@/components/settings/ContactForm";
import { useShareTracking } from "@/components/breathing/hooks/useShareTracking";

const SettingsPage = () => {
  const { user, isLoading } = useAuth();
  const { shareApp } = useShareTracking();
  const navigate = useNavigate();
  
  const handleRateApp = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) {
      // Redirect to Apple App Store
      window.open('https://apps.apple.com/app/oxia-breathe', '_blank');
    } else if (isAndroid) {
      // Redirect to Google Play Store  
      window.open('https://play.google.com/store/apps/details?id=app.lovable.d3590b81c81449329e6d4fbda085725b', '_blank');
    } else {
      // Fallback for other devices
      window.open('https://apps.apple.com/app/oxia-breathe', '_blank');
    }
  };
  
  const [audioSettings, setAudioSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('audioSettings');
      const parsed = stored ? JSON.parse(stored) : null;
      
      // Migrate old settings or use defaults
      return {
        backgroundMusic: {
          enabled: parsed?.backgroundMusic?.enabled ?? true,
          selected: parsed?.backgroundMusic?.selected ?? 'cosmic',
          volume: parsed?.backgroundMusic?.volume ?? 1,
        },
        voiceGuidance: {
          enabled: parsed?.voiceGuidance?.enabled ?? true,
          selected: parsed?.voiceGuidance?.selected ?? 'mila',
          volume: parsed?.voiceGuidance?.volume ?? 1,
        },
      };
    } catch {
      return {
        backgroundMusic: {
          enabled: true,
          selected: 'cosmic',
          volume: 1,
        },
        voiceGuidance: {
          enabled: true,
          selected: 'mila',
          volume: 1,
        },
      };
    }
  });

  // Save settings to localStorage
  const handleSaveSettings = () => {
    localStorage.setItem('audioSettings', JSON.stringify(audioSettings));
  };

  // Auto-save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('audioSettings', JSON.stringify(audioSettings));
  }, [audioSettings]);

  console.log("SettingsPage - User:", user?.id, "Loading:", isLoading);

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container pt-24 pb-12 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Settings</h1>
          <div className="space-y-6">
            <Card className="border-none shadow-md bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="h-4 w-4 animate-breathe rounded-full bg-breath/50" />
                  <span>Loading settings...</span>
                </div>
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
      <div className="container pt-24 pb-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Settings</h1>
        <div className="space-y-6">
          {/* Audio Settings Section */}
          <Card className="border-none shadow-md bg-card">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-breath" />
                <span className="text-card-foreground">Audio Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AudioSettings 
                settings={audioSettings} 
                onSettingsChange={setAudioSettings}
                onSaveSettings={handleSaveSettings}
              />
            </CardContent>
          </Card>
          
          {/* Notification Settings Section */}
          <Card className="border-none shadow-md bg-card">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-breath" />
                <span className="text-card-foreground">Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationSettings />
            </CardContent>
          </Card>

          {/* Other Settings Section */}
          <Card className="border-none shadow-md bg-card">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-breath" />
                <span className="text-card-foreground">Other Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OtherSettings />
            </CardContent>
          </Card>

          {/* About Us Section */}
          <Card className="border-none shadow-md bg-card">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-breath" />
                <span className="text-card-foreground">About Us</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
             
              {/* About Accordion */}
              <Accordion type="single" collapsible>
                <AccordionItem value="about" className="border-none">
                  <AccordionTrigger className="text-card-foreground hover:text-breath">
                    About
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
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
                  <AccordionTrigger className="text-card-foreground hover:text-breath">
                    Help us improve
                  </AccordionTrigger>
                  <AccordionContent>
                    <FeedbackForm />
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="contact" className="border-none">
                  <AccordionTrigger className="text-card-foreground hover:text-breath">
                    Contact us
                  </AccordionTrigger>
                  <AccordionContent>
                    <ContactForm />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Links Section */}
              <div>
                <button 
                  onClick={() => navigate('/terms')}
                  className="py-4 w-full text-left hover:bg-accent transition-colors rounded-md flex items-center text-breath hover:text-breath/80 font-medium"
                  aria-label="Open Terms & Conditions"
                >
                  Terms & Conditions
                </button>
                <button 
                  onClick={() => navigate('/eula')}
                  className="py-4 w-full text-left hover:bg-accent transition-colors rounded-md flex items-center text-breath hover:text-breath/80 font-medium"
                  aria-label="Open End User License Agreement"
                >
                  End User License Agreement
                </button>
                <button 
                  onClick={() => navigate('/privacy-policy')}
                  className="py-4 w-full text-left hover:bg-accent transition-colors rounded-md flex items-center text-breath hover:text-breath/80 font-medium"
                  aria-label="Open Privacy Policy"
                >
                  Privacy Policy
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Social Media Section */}
          <div className="flex gap-3">
            <button 
              onClick={() => window.open('https://instagram.com/oxia_breathe/', '_blank')}
              className="flex-1 bg-card/90 backdrop-blur-sm rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 group"
              aria-label="Follow us on Instagram"
            >
              <div className="flex items-center justify-center">
                <Instagram className="h-6 w-6 text-breath group-hover:text-breath/80 transition-colors" />
              </div>
            </button>

            <button 
              onClick={() => window.open('https://www.tiktok.com/@oxia_breathe', '_blank')}
              className="flex-1 bg-card/90 backdrop-blur-sm rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 group"
              aria-label="Follow us on TikTok"
            >
              <div className="flex items-center justify-center">
                <Music2 className="h-6 w-6 text-breath group-hover:text-breath/80 transition-colors" />
              </div>
            </button>

            <button 
              onClick={handleRateApp}
              className="flex-1 bg-card/90 backdrop-blur-sm rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 group"
              aria-label="Rate our app"
            >
              <div className="flex items-center justify-center">
                <MessageCircleHeart className="h-6 w-6 text-breath group-hover:text-breath/80 transition-colors" />
              </div>
            </button>

            <button 
              onClick={shareApp}
              className="flex-1 bg-card/90 backdrop-blur-sm rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 group"
              aria-label="Share OXIA with friends"
            >
              <div className="flex items-center justify-center">
                <Share className="h-6 w-6 text-breath group-hover:text-breath/80 transition-colors" />
              </div>
            </button>
          </div>

          {/* OXIA Logo and Version */}
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <img 
              src="/lovable-uploads/6d9cc0f0-addd-45b1-abab-238892b91dbf.png" 
              alt="OXIA Logo" 
              className="h-16 w-auto object-contain" 
              onError={(e) => {
                console.error("Logo failed to load:", e);
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="text-sm text-muted-foreground">
              Version {APP_VERSION}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
