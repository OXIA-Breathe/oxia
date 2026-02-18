import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const SectionDivider = () => (
  <div className="flex items-center gap-3 my-2">
    <div className="h-px flex-1 bg-border/60" />
  </div>
);

const Section = ({
  title,
  number,
  children,
}: {
  title: string;
  number: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-3">
    <div className="flex items-center gap-3">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
        {number}
      </span>
      <h2 className="text-base font-bold text-foreground tracking-tight">{title}</h2>
    </div>
    <div className="text-muted-foreground leading-relaxed space-y-2 pl-10">
      {children}
    </div>
    <SectionDivider />
  </section>
);

const DataCard = ({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-card border border-border rounded-2xl p-4 space-y-1.5 shadow-sm">
    <div className="flex items-center gap-2">
      <span className="text-lg leading-none">{icon}</span>
      <p className="font-semibold text-sm text-foreground">{title}</p>
    </div>
    <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

const ThirdPartyCard = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => (
  <div className="bg-card border border-border rounded-2xl p-4 space-y-1 shadow-sm">
    <p className="font-semibold text-sm text-foreground">{name}</p>
    <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen breathing-bg text-foreground">
      {/* Branded Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#5f9fdf]/90 to-[#77a9e8]/80 backdrop-blur-md border-b border-white/20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/40 bg-white/10 hover:bg-white/20 transition-colors active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <Shield className="h-5 w-5 text-white/80" />
            <h1 className="text-lg font-bold text-white">Privacy Policy</h1>
          </div>
          <span className="text-xs font-semibold text-white/70 tracking-widest uppercase">OXIA</span>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-57px)]">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

          {/* Intro card */}
          <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-5 shadow-sm space-y-3">
            {/* Date badge */}
            <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
              <Shield className="h-3 w-3" />
              Effective: February 18, 2026
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This Privacy Policy explains how <strong className="text-foreground">OXIA</strong> ("we", "us", or "our") collects,
              uses, stores, and protects your personal information when you use the OXIA breathing app ("the App").
              By using the App, you agree to the practices described in this policy.
            </p>
          </div>

          {/* Sections */}
          <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl p-5 shadow-sm space-y-6">

            <Section number="1" title="Who We Are">
              <p>
                OXIA is a breathing and wellness application developed by <strong className="text-foreground">Kristo Epner</strong>.
                Our website is{" "}
                <a href="https://oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium" target="_blank" rel="noopener noreferrer">
                  oxiabreathe.eu
                </a>
                . For privacy inquiries, contact us at:{" "}
                <a href="mailto:hello@oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium">
                  hello@oxiabreathe.eu
                </a>
              </p>
            </Section>

            <Section number="2" title="What Data We Collect">
              <p className="mb-3">We collect only the data necessary to provide and improve the App's features:</p>
              <div className="space-y-3 pl-0 -ml-10">
                <DataCard icon="📧" title="Account Information">
                  Your <strong className="text-foreground">email address</strong>, collected when you create an account. Used for authentication, account recovery, and communication about your account.
                </DataCard>
                <DataCard icon="🫁" title="Breathing Session Data">
                  Records of your breathing sessions including exercise type, session duration, breath count, repetitions, hold duration, and the date/time of each session. Used to display your history and progress.
                </DataCard>
                <DataCard icon="💚" title="Mood & Emotion Data (Health & Fitness)">
                  Optional pre- and post-session emotional check-ins, including valence and arousal scores, and optional free-text notes. This data is sensitive and stored securely with strict access controls. It is <strong className="text-foreground">never shared</strong> with third parties.
                </DataCard>
                <DataCard icon="🏆" title="Achievements & Streaks">
                  Your login streaks, breathing streaks, earned badges, and daily activity records. Used to power the consistency and progress features.
                </DataCard>
                <DataCard icon="🔔" title="Notification Preferences">
                  Your chosen notification schedule (days and times) and notification settings. Stored to deliver breathing reminders you have configured.
                </DataCard>
                <DataCard icon="⚙️" title="App Preferences">
                  Audio settings (background music, voice guidance, volume levels) stored locally on your device in your browser's local storage. <strong className="text-foreground">Not uploaded to our servers.</strong>
                </DataCard>
                <DataCard icon="📊" title="Analytics & Diagnostics">
                  Anonymous usage analytics via Firebase Analytics, including screen views, feature interactions, and performance data. This data <strong className="text-foreground">cannot identify you personally</strong> and is used solely to improve the App.
                </DataCard>
              </div>
            </Section>

            <Section number="3" title="How We Use Your Data">
              <ul className="space-y-1.5">
                {[
                  "To create and manage your account and authenticate your identity",
                  "To display your session history, progress charts, and wellness reports",
                  "To calculate and display streaks, achievements, and consistency metrics",
                  "To send breathing reminders at times you have chosen",
                  "To generate personalised wellness PDF reports from your session data",
                  "To improve App performance and fix bugs using anonymous diagnostics",
                  "To respond to your support requests or feedback",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm bg-primary/5 border border-primary/15 rounded-xl px-3 py-2">
                We do <strong className="text-foreground">not</strong> sell your data to third parties. We do <strong className="text-foreground">not</strong> use your health or mood data for advertising.
              </p>
            </Section>

            <Section number="4" title="How We Store & Protect Your Data">
              <p className="mb-3">
                All personal and session data is stored on <strong className="text-foreground">Supabase</strong>, a secure cloud database hosted in the European Union. We apply:
              </p>
              <ul className="space-y-1.5">
                {[
                  { label: "Row Level Security (RLS)", desc: "Every database table enforces strict rules — you can only access your own data." },
                  { label: "Encrypted connections", desc: "All data transmitted between the App and our servers uses HTTPS/TLS encryption." },
                  { label: "Secure Edge Functions", desc: "Sensitive operations (like account deletion) are processed server-side with authenticated tokens." },
                  { label: "Subscription field protection", desc: "Server-side triggers prevent any client-side modification of subscription or billing fields." },
                  { label: "No sensitive logging", desc: "We do not log your email, user ID, or health data to any analytics service." },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" />
                    <span><strong className="text-foreground">{item.label}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section number="5" title="Third-Party Services">
              <p className="mb-3">We use the following trusted third-party services:</p>
              <div className="space-y-3 pl-0 -ml-10">
                <ThirdPartyCard name="Supabase">
                  Database, authentication, and Edge Functions provider. Data may be stored in EU-based data centres.{" "}
                  <a href="https://supabase.com/privacy" className="text-primary underline underline-offset-2 font-medium" target="_blank" rel="noopener noreferrer">
                    Supabase Privacy Policy →
                  </a>
                </ThirdPartyCard>
                <ThirdPartyCard name="Firebase (Google)">
                  Anonymous analytics and crash reporting. No personally identifiable data is sent to Firebase.{" "}
                  <a href="https://firebase.google.com/support/privacy" className="text-primary underline underline-offset-2 font-medium" target="_blank" rel="noopener noreferrer">
                    Firebase Privacy Policy →
                  </a>
                </ThirdPartyCard>
              </div>
            </Section>

            <Section number="6" title="Your Rights">
              <p className="mb-3">You have the following rights regarding your personal data:</p>
              <ul className="space-y-1.5">
                {[
                  { label: "Access", desc: "You can view all your session history and data within the App." },
                  { label: "Correction", desc: "You can update your display name and profile information in the Profile page." },
                  { label: "Deletion", desc: "Permanently delete your account and all associated data via Profile → Delete Account. Irreversible." },
                  { label: "Reset", desc: "Reset your stats and history while keeping your account via Profile → Reset Stats." },
                  { label: "Portability", desc: "Export your session history as a PDF via the History page." },
                  { label: "Objection", desc: "Disable emotion tracking at any time in your profile settings." },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" />
                    <span><strong className="text-foreground">{item.label}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm">
                For any other data request, email us at{" "}
                <a href="mailto:hello@oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium">
                  hello@oxiabreathe.eu
                </a>.
              </p>
            </Section>

            <Section number="7" title="Children's Privacy">
              <p>
                OXIA is not intended for children under the age of 13. We do not knowingly collect personal
                information from children. If you believe a child has provided us with personal information,
                please contact us and we will delete it promptly.
              </p>
            </Section>

            <Section number="8" title="Data Retention">
              <p>
                We retain your personal data for as long as your account is active. When you delete your account,
                all associated data is permanently removed from our servers within 30 days. Anonymous analytics
                data retained by Firebase follows{" "}
                <a href="https://firebase.google.com/support/privacy" className="text-primary underline underline-offset-2 font-medium" target="_blank" rel="noopener noreferrer">
                  Google's retention policies
                </a>.
              </p>
            </Section>

            <Section number="9" title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. When we do, we will update the effective date
                at the top of this page. For significant changes, we will notify you through the App or via email.
                Continued use of the App after changes constitutes your acceptance of the updated policy.
              </p>
            </Section>

            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                  10
                </span>
                <h2 className="text-base font-bold text-foreground tracking-tight">Contact Us</h2>
              </div>
              <div className="pl-10 space-y-3">
                <p className="text-sm text-muted-foreground">
                  If you have any questions, concerns, or requests related to this Privacy Policy, please contact us:
                </p>
                <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-1 text-sm">
                  <p className="font-semibold text-foreground">OXIA</p>
                  <p className="text-muted-foreground">
                    Email:{" "}
                    <a href="mailto:hello@oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium">
                      hello@oxiabreathe.eu
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    Website:{" "}
                    <a href="https://oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium" target="_blank" rel="noopener noreferrer">
                      oxiabreathe.eu
                    </a>
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="pb-8 text-center text-xs text-white/60 font-medium">
            © 2026 OXIA · All rights reserved
          </div>

        </div>
      </ScrollArea>
    </div>
  );
};

export default PrivacyPolicyPage;
