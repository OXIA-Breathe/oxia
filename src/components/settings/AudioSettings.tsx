
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Music, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioSettingsProps {
  settings: {
    backgroundMusic: {
      enabled: boolean;
      selected: string;
      volume: number;
    };
    voiceGuidance: {
      enabled: boolean;
      selected: string;
    };
  };
  onSettingsChange: (settings: any) => void;
  onSaveSettings: () => void;
}

const AudioSettings = ({ settings, onSettingsChange, onSaveSettings }: AudioSettingsProps) => {
  const { toast, dismiss } = useToast();
  const location = useLocation();
  const [openSections, setOpenSections] = useState({
    backgroundMusic: false,
    voiceGuidance: false,
  });
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Clear all toasts when route changes to a different page
  useEffect(() => {
    if (currentPath !== location.pathname) {
      dismiss();
      setCurrentPath(location.pathname);
    }
  }, [location.pathname, currentPath, dismiss]);

  const backgroundMusicOptions = [
    { id: 'cosmic', name: 'Cosmic Exploration' },
    { id: 'ambient', name: 'Gentle Ambient Melodies' },
    { id: 'meditation', name: 'Meditation Flow' },
    { id: 'piano', name: 'Nature Calm Piano' },
    { id: 'nature', name: 'Nature Dreamscape' },
    { id: 'stream', name: 'Peaceful Stream' },
    { id: 'silent', name: 'Silent Universe' },
  ];

  const voiceGuidanceOptions = [
    { id: 'liam', name: 'Liam (Male)', gender: 'male' },
    { id: 'mila', name: 'Mila (Female)', gender: 'female' },
  ];


  const updateSetting = (category: string, field: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [field]: value,
      },
    };
    onSettingsChange(newSettings);
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  return (
    <div className="space-y-6">
        {/* Background Music */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <Label className="text-base font-medium">Background Music</Label>
            </div>
            <Switch
              checked={settings.backgroundMusic.enabled}
              onCheckedChange={(checked) => {
                updateSetting('backgroundMusic', 'enabled', checked);
                if (checked) {
                  setOpenSections(prev => ({ ...prev, backgroundMusic: true }));
                }
              }}
            />
          </div>
          
          {settings.backgroundMusic.enabled && (
            <Collapsible open={openSections.backgroundMusic} onOpenChange={(open) => toggleSection('backgroundMusic')}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                {openSections.backgroundMusic ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Choose Music
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <RadioGroup
                  value={settings.backgroundMusic.selected}
                  onValueChange={(value) => updateSetting('backgroundMusic', 'selected', value)}
                  className="ml-4"
                >
                  {backgroundMusicOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="text-sm">{option.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {/* Volume Slider */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Volume</Label>
                    <span className="text-sm text-muted-foreground">{Math.round((settings.backgroundMusic.volume || 1) * 100)}%</span>
                  </div>
                  <Slider
                    value={[settings.backgroundMusic.volume || 1]}
                    onValueChange={(value) => updateSetting('backgroundMusic', 'volume', value[0])}
                    max={1}
                    min={0}
                    step={0.01}
                    className="w-full"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {/* Voice Guidance */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <Label className="text-base font-medium">Voice Guidance</Label>
            </div>
            <Switch
              checked={settings.voiceGuidance.enabled}
              onCheckedChange={(checked) => {
                updateSetting('voiceGuidance', 'enabled', checked);
                if (checked) {
                  setOpenSections(prev => ({ ...prev, voiceGuidance: true }));
                }
              }}
            />
          </div>
          
          {settings.voiceGuidance.enabled && (
            <Collapsible open={openSections.voiceGuidance} onOpenChange={(open) => toggleSection('voiceGuidance')}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                {openSections.voiceGuidance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Choose Voice
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <RadioGroup
                  value={settings.voiceGuidance.selected}
                  onValueChange={(value) => updateSetting('voiceGuidance', 'selected', value)}
                  className="ml-4"
                >
                  {voiceGuidanceOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="text-sm">{option.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        <Button 
          onClick={() => {
            onSaveSettings();
            toast({
              title: "Settings saved",
              description: "Your audio settings have been applied successfully.",
              duration: 3000,
            });
          }}
          className="w-full"
        >
          Save Settings
        </Button>
    </div>
  );
};

export default AudioSettings;
