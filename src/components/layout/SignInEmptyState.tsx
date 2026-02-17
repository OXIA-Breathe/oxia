import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SignInEmptyStateProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SignInEmptyState = ({ title, description, children }: SignInEmptyStateProps) => {
  return (
    <div className="relative">
      {/* Blurred preview cards */}
      <div className="pointer-events-none select-none filter blur-[6px] opacity-60">
        {children}
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center border border-border/50">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-card-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {description}
          </p>
          <Button asChild className="w-full bg-breath hover:bg-breath/90 text-primary-foreground font-semibold">
            <Link to="/auth">Sign in to unlock</Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Free account · No credit card needed
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInEmptyState;
