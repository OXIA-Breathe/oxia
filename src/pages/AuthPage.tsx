import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForgotPasswordModal from "@/components/auth/ForgotPasswordModal";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { validatePassword } from "@/lib/passwordValidation";


/** Only allow same-origin relative paths as a post-login redirect target. */
const safeNext = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/";

const AuthPage = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpError, setSignUpError] = useState<string | null>(null);

  if (user) {
    return <Navigate to={next} replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);

    const name = fullName.trim();
    if (name.length < 2) {
      setSignUpError("Please enter your name (at least 2 characters).");
      return;
    }
    if (name.length > 60) {
      setSignUpError("Name must be less than 60 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setSignUpError("Passwords do not match.");
      return;
    }

    const validation = validatePassword(password);
    if (!validation.isValid) {
      setSignUpError(validation.errors[0]);
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen breathing-bg text-foreground p-4">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-5 w-11 h-11 flex items-center justify-center bg-card/90 backdrop-blur-md border border-border/60 rounded-full shadow-[0_4px_14px_-6px_hsl(213_81%_19%_/_0.25)] hover:bg-card transition-all active:scale-95 text-foreground"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/lovable-uploads/6d9cc0f0-addd-45b1-abab-238892b91dbf.png"
            alt="OXIA Logo"
            className="h-12 w-auto object-contain mb-4"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <h1 className="text-2xl font-bold text-foreground">Welcome to OXIA</h1>
          <p className="text-sm text-muted-foreground mt-1">Breathe with awareness, every day.</p>
        </div>

        <div className="bg-card rounded-3xl border border-border/60 shadow-[0_8px_24px_-12px_hsl(213_81%_19%_/_0.18)] p-6">
          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary rounded-full p-1 h-auto">
              <TabsTrigger value="sign-in" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm py-2">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm py-2">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="sign-in">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-xl h-11" />
                </div>
                <Button type="submit" className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-2" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                <div className="flex justify-center">
                  <ForgotPasswordModal>
                    <Button variant="link" className="text-sm p-0 text-muted-foreground hover:text-primary">
                      Forgot password?
                    </Button>
                  </ForgotPasswordModal>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="sign-up">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">Your name</Label>
                  <Input id="new-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Kristo" required maxLength={60} autoComplete="name" className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-email">Email</Label>
                  <Input id="new-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required autoComplete="email" className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password</Label>
                  <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" className="rounded-xl h-11" />
                  <p className="text-xs text-muted-foreground">At least 8 characters, with an uppercase letter and a number.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Repeat password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    aria-invalid={!!confirmPassword && confirmPassword !== password}
                    className="rounded-xl h-11"
                  />
                </div>
                {signUpError && (
                  <p role="alert" className="text-sm text-destructive">{signUpError}</p>
                )}
                <Button type="submit" className="w-full rounded-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-2" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-6 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Continue as guest →
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
