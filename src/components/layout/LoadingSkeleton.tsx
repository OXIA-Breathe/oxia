import { Wind } from "lucide-react";

const LoadingSkeleton = () => (
  <div className="min-h-screen breathing-bg flex flex-col items-center justify-center gap-6">
    <img 
      src="/lovable-uploads/6d9cc0f0-addd-45b1-abab-238892b91dbf.png" 
      alt="OXIA Logo" 
      className="h-12 w-auto object-contain opacity-80"
    />
    <div className="flex items-center gap-2 text-foreground/60">
      <Wind className="h-5 w-5 animate-breathe" />
      <span className="text-sm font-medium">Loading...</span>
    </div>
  </div>
);

export default LoadingSkeleton;
