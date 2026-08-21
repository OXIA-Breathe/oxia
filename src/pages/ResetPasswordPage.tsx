import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { summarizePasswordErrors } from "@/lib/passwordValidation";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { PasswordInput } from "@/components/auth/PasswordInput";




const ResetPasswordPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session && !error) {
        setIsValidSession(true);
      } else {
        toast({
          title: "Invalid or expired link",
          description: "Please request a new password reset link",
          variant: "destructive"
        });
        navigate("/auth");
      }
    };

    checkSession();
  }, [navigate, toast]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    const passwordError = summarizePasswordErrors(password);
    if (passwordError) {
      toast({
        title: "Error",
        description: passwordError,
        variant: "destructive"
      });
      return;
    }


    setIsLoading(true);


    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password updated",
        description: "Your password has been successfully updated"
      });

      // Redirect to main page
      navigate("/");

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Validating reset link...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">OXIA</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <PasswordInput
                  id="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  required
                  minLength={10}
                  aria-describedby="new-password-requirements"
                />
                <PasswordStrengthMeter password={password} id="new-password-requirements" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <PasswordInput
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  required
                  minLength={10}
                  aria-invalid={!!confirmPassword && confirmPassword !== password}
                  aria-describedby="confirm-password-error"
                />
                <p id="confirm-password-error" className="text-xs text-destructive" aria-live="polite">
                  {confirmPassword && confirmPassword !== password ? "Passwords do not match." : ""}
                </p>
              </div>

            </CardContent>

            <CardContent>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;