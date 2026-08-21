import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, MailWarning } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Status = "checking" | "confirmed" | "error";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("checking");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const finish = async () => {
      try {
        const url = new URL(window.location.href);
        const hash = new URLSearchParams(url.hash.replace(/^#/, ""));

        const errorDescription =
          url.searchParams.get("error_description") || hash.get("error_description");
        if (errorDescription) {
          if (!cancelled) {
            setStatus("error");
            setMessage(errorDescription);
          }
          return;
        }

        // PKCE style link (?code=...)
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        // Implicit style link (#access_token=...) is picked up automatically by
        // the Supabase client, so we just need to read the resulting session.
        const { data } = await supabase.auth.getSession();

        if (cancelled) return;

        if (data.session) {
          setStatus("confirmed");
          // Clean the tokens out of the address bar
          window.history.replaceState({}, "", "/verify-email");
          setTimeout(() => navigate("/", { replace: true }), 1800);
        } else {
          setStatus("error");
          setMessage("This confirmation link is invalid or has already been used.");
        }
      } catch (error: any) {
        if (cancelled) return;
        setStatus("error");
        setMessage(error?.message || "We could not confirm your email.");
      }
    };

    finish();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen breathing-bg text-foreground p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl border border-border/60 shadow-[0_8px_24px_-12px_hsl(213_81%_19%_/_0.18)] p-6 text-center">
        {status === "checking" && (
          <>
            <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
            <h1 className="text-lg font-semibold">Confirming your email…</h1>
            <p className="text-sm text-muted-foreground mt-1">This only takes a moment.</p>
          </>
        )}

        {status === "confirmed" && (
          <>
            <CheckCircle2 className="h-10 w-10 mx-auto mb-4 text-primary" />
            <h1 className="text-lg font-semibold">Your email is confirmed</h1>
            <p className="text-sm text-muted-foreground mt-1">
              You're signed in. Taking you to OXIA…
            </p>
            <Button
              className="w-full rounded-full h-11 mt-5 font-semibold"
              onClick={() => navigate("/", { replace: true })}
            >
              Start breathing
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <MailWarning className="h-10 w-10 mx-auto mb-4 text-destructive" />
            <h1 className="text-lg font-semibold">Confirmation failed</h1>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
            <Button
              className="w-full rounded-full h-11 mt-5 font-semibold"
              onClick={() => navigate("/auth", { replace: true })}
            >
              Back to sign in
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
