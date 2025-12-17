import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Activity, 
  ArrowRight, 
  ExternalLink, 
  Smartphone, 
  Watch,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Info,
  Zap,
  ChevronRight,
  RefreshCw
} from "lucide-react";

const HealthConnectPreview = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [stressLevel, setStressLevel] = useState(4);

  const getStressLabel = (value: number) => {
    if (value <= 2) return "Very Low";
    if (value <= 3) return "Low";
    if (value === 4) return "Neutral";
    if (value <= 5) return "Moderate";
    if (value <= 6) return "High";
    return "Very High";
  };

  const getStressColor = (value: number) => {
    if (value <= 2) return "text-emerald-500";
    if (value <= 3) return "text-green-500";
    if (value === 4) return "text-yellow-500";
    if (value <= 5) return "text-orange-400";
    if (value <= 6) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 pb-24">
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <div className="text-center pt-4">
          <Badge variant="outline" className="mb-2 text-primary border-primary/30">
            UI/UX Preview
          </Badge>
          <h1 className="text-2xl font-bold text-slate-800">Health Connect Integration</h1>
          <p className="text-sm text-slate-500 mt-1">Preview of proposed designs</p>
        </div>

        {/* SECTION 1: Onboarding Slide Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <h2 className="font-semibold text-slate-700">Onboarding Slide (Before Final)</h2>
          </div>
          
          <Card className="bg-gradient-to-br from-primary/5 via-white to-blue-50 border-primary/20 overflow-hidden">
            <CardContent className="p-6 text-center space-y-4">
              {/* Illustration Area */}
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full animate-pulse" />
                <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <div className="relative">
                    <Heart className="w-12 h-12 text-primary" />
                    <Activity className="w-6 h-6 text-emerald-500 absolute -bottom-1 -right-1" />
                  </div>
                </div>
                <Watch className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-400" />
                <Smartphone className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">Track Your Stress Level</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Connect with Health Connect to automatically measure your stress using data from your smartwatch or fitness tracker
                </p>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                <Badge variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  See real-time changes
                </Badge>
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  <Activity className="w-3 h-3 mr-1" />
                  Track breathing impact
                </Badge>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 text-slate-600">
                  Skip
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  Set Up
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* SECTION 2: Settings Card Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">2</span>
            </div>
            <h2 className="font-semibold text-slate-700">Settings Page Card</h2>
          </div>

          {/* Toggle to switch between states */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Preview state:</span>
            <Button 
              variant={!isConnected ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsConnected(false)}
            >
              Not Connected
            </Button>
            <Button 
              variant={isConnected ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsConnected(true)}
            >
              Connected
            </Button>
          </div>

          {!isConnected ? (
            /* Not Connected State */
            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Health Connect</CardTitle>
                      <CardDescription className="text-xs">Sync stress data from your wearable</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Get automatic stress readings from your smartwatch or fitness tracker before and after each breathing session.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Info className="w-3 h-3" />
                    <span>We'll only read heart rate variability (HRV) data</span>
                  </div>
                </div>
                
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                  <Heart className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Connected State */
            <Card className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        Health Connect
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-xs">Syncing stress data automatically</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sync Toggle */}
                <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Sync with Health Connect</p>
                    <p className="text-xs text-slate-500">Pause or resume data sync</p>
                  </div>
                  <Switch checked={true} />
                </div>

                {/* Data source info */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-slate-500 mb-2">DATA WE READ</p>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm text-slate-700">Heart Rate Variability (HRV)</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 ml-6">Used to calculate your stress level</p>
                </div>

                <Button variant="outline" className="w-full text-slate-600">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Manage Access in Health Connect
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-6" />

        {/* SECTION 3: Pre-Exercise Check-in Preview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">3</span>
            </div>
            <h2 className="font-semibold text-slate-700">Pre-Exercise Check-in (Updated)</h2>
          </div>

          <Card className="bg-white/95 border-primary/20">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-lg">Quick check-in</CardTitle>
              <CardDescription>How do you feel?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Mood Slider (existing) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span className="text-sm font-medium text-slate-700">Mood</span>
                  </div>
                  <span className="text-sm text-rose-500 font-medium">Positive</span>
                </div>
                <Slider defaultValue={[5]} max={7} min={1} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Very Negative</span>
                  <span>Very Positive</span>
                </div>
              </div>

              {/* NEW: Stress Level */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-slate-700">Stress Level</span>
                  </div>
                  <span className={`text-sm font-medium ${getStressColor(stressLevel)}`}>
                    {getStressLabel(stressLevel)}
                  </span>
                </div>
                
                {isConnected ? (
                  /* Auto-populated from Health Connect */
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="text-lg font-bold text-slate-800">Level 3</p>
                          <p className="text-xs text-slate-500">Low stress detected</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-emerald-600">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                      <Heart className="w-3 h-3" />
                      <span>From Samsung Health via Health Connect</span>
                    </div>
                  </div>
                ) : (
                  /* Manual slider when not connected */
                  <>
                    <Slider 
                      value={[stressLevel]} 
                      onValueChange={(v) => setStressLevel(v[0])}
                      max={7} 
                      min={1} 
                      step={1} 
                      className="w-full" 
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Very Low</span>
                      <span>Very High</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-500 bg-blue-50 rounded-lg p-2">
                      <Heart className="w-3 h-3" />
                      <span>Connect Health Connect to auto-detect stress level</span>
                      <ChevronRight className="w-3 h-3 ml-auto" />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1">Skip</Button>
                <Button className="flex-1 bg-primary">Continue</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6" />

        {/* SECTION 4: Post-Exercise Comparison */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">4</span>
            </div>
            <h2 className="font-semibold text-slate-700">Post-Exercise Stress Comparison</h2>
          </div>

          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <CardContent className="p-5 space-y-4">
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-slate-800">Session Complete!</h3>
                <p className="text-sm text-slate-600">Great work on your breathing exercise</p>
              </div>

              {/* Before/After Comparison */}
              <div className="bg-white rounded-xl p-4 space-y-3">
                <p className="text-xs font-medium text-slate-500 text-center">STRESS LEVEL CHANGE</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">Before</p>
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-orange-500">5</span>
                    </div>
                    <p className="text-xs text-orange-500 mt-1">Moderate</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <TrendingDown className="w-8 h-8 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-600">-40%</span>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-slate-400 mb-1">After</p>
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-emerald-500">3</span>
                    </div>
                    <p className="text-xs text-emerald-500 mt-1">Low</p>
                  </div>
                </div>

                {/* Data Attribution */}
                <div className="flex items-center justify-center gap-1 text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <Activity className="w-3 h-3" />
                  <span>HRV data from Samsung Health via Health Connect</span>
                </div>
              </div>

              {/* Quick Scan Button (if connected) */}
              {isConnected && (
                <Button variant="outline" className="w-full bg-white text-emerald-600 border-emerald-200">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Quick Scan (Refresh HRV)
                </Button>
              )}

              <Button className="w-full bg-primary">
                Done
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <div className="text-center text-xs text-slate-400 pt-4 pb-8">
          <p>This is a UI/UX preview page.</p>
          <p>Toggle "Connected" state above to see both versions.</p>
        </div>
      </div>
    </div>
  );
};

export default HealthConnectPreview;
