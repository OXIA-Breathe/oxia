
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    <div className="text-muted-foreground leading-relaxed space-y-2">{children}</div>
  </section>
);

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen breathing-bg text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold">Privacy Policy</h1>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">

          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Effective date: February 18, 2026</strong>
            <br />
            This Privacy Policy explains how OXIA ("we", "us", or "our") collects, uses, stores,
            and protects your personal information when you use the OXIA breathing app ("the App").
            By using the App, you agree to the practices described in this policy.
          </p>

          <Section title="1. Who We Are">
            <p>
              OXIA is a breathing and wellness application developed by Kristo Epner.
              Our website is <a href="https://oxiabreathe.eu" className="text-breath underline" target="_blank" rel="noopener noreferrer">oxiabreathe.eu</a>.
              For privacy inquiries, contact us at: <a href="mailto:hello@oxiabreathe.eu" className="text-breath underline">hello@oxiabreathe.eu</a>
            </p>
          </Section>

          <Section title="2. What Data We Collect">
            <p>We collect only the data necessary to provide and improve the App's features:</p>

            <div className="space-y-4 mt-2">
              <div className="bg-card rounded-lg p-4 space-y-1 border border-border">
                <p className="font-medium text-foreground">📧 Account Information</p>
                <p>Your <strong>email address</strong>, collected when you create an account. Used for authentication, account recovery, and communication about your account.</p>
              </div>

              <div className="bg-card rounded-lg p-4 space-y-1 border border-border">
                <p className="font-medium text-foreground">🫁 Breathing Session Data</p>
                <p>Records of your breathing sessions including: exercise type, session duration, breath count, repetitions, hold duration, and the date/time of each session. Used to display your history and progress.</p>
              </div>

              <div className="bg-card rounded-lg p-4 space-y-1 border border-border">
                <p className="font-medium text-foreground">💚 Mood & Emotion Data (Health & Fitness)</p>
                <p>Optional pre- and post-session emotional check-ins, including valence (positive/negative feeling) and arousal (energy level) scores on a numeric scale, and optional free-text notes. This data is sensitive and stored securely with strict access controls. It is never shared with third parties.</p>
              </div>

              <div className="bg-card rounded-lg p-4 space-y-1 border border-border">
                <p className="font-medium text-foreground">🏆 Achievements & Streaks</p>
                <p>Your login streaks, breathing streaks, earned badges, and daily activity records. Used to power the consistency and progress features.</p>
              </div>

              <div className="bg-card rounded-lg p-4 space-y-1 border border-border">
                <p className="font-medium text-foreground">🔔 Notification Preferences</p>
                <p>Your chosen notification schedule (days and times) and notification settings. Stored to deliver breathing reminders you have configured.</p>
              </div>

              <div className="bg-card rounded-lg p-4 space-y-1 border border-border">
                <p className="font-medium text-foreground">⚙️ App Preferences</p>
                <p>Audio settings (background music selection, voice guidance, volume levels) stored locally on your device in your browser's local storage. These are not uploaded to our servers.</p>
              </div>

              <div className="bg-card rounded-lg p-4 space-y-1 border border-border">
                <p className="font-medium text-foreground">📊 Analytics & Diagnostics</p>
                <p>Anonymous usage analytics collected via Firebase Analytics, including screen views, feature interactions, app crashes, and performance data. This data cannot identify you personally and is used solely to improve the App.</p>
              </div>
            </div>
          </Section>

          <Section title="3. How We Use Your Data">
            <ul className="list-disc list-inside space-y-1">
              <li>To create and manage your account and authenticate your identity</li>
              <li>To display your session history, progress charts, and wellness reports</li>
              <li>To calculate and display streaks, achievements, and consistency metrics</li>
              <li>To send breathing reminders at times you have chosen</li>
              <li>To generate personalised wellness PDF reports from your session data</li>
              <li>To improve App performance and fix bugs using anonymous diagnostics</li>
              <li>To respond to your support requests or feedback</li>
            </ul>
            <p>We do <strong>not</strong> sell your data to third parties. We do <strong>not</strong> use your health or mood data for advertising.</p>
          </Section>

          <Section title="4. How We Store & Protect Your Data">
            <p>
              All personal and session data is stored on <strong>Supabase</strong>, a secure cloud database
              hosted in the European Union. We apply the following protections:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Row Level Security (RLS)</strong>: Every database table enforces strict rules — you can only access your own data. Other users cannot read your records.</li>
              <li><strong>Encrypted connections</strong>: All data transmitted between the App and our servers uses HTTPS/TLS encryption.</li>
              <li><strong>Secure Edge Functions</strong>: Sensitive operations (like account deletion) are processed server-side with authenticated tokens, not directly from the client.</li>
              <li><strong>Subscription field protection</strong>: Server-side triggers prevent any client-side modification of subscription or billing fields.</li>
              <li><strong>No sensitive logging</strong>: We do not log your email, user ID, or health data to any analytics or error-tracking service.</li>
            </ul>
          </Section>

          <Section title="5. Third-Party Services">
            <p>We use the following trusted third-party services:</p>
            <div className="space-y-3 mt-2">
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="font-medium text-foreground">Supabase</p>
                <p>Database, authentication, and Edge Functions provider. Data may be stored in EU-based data centres. <a href="https://supabase.com/privacy" className="text-breath underline" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy →</a></p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="font-medium text-foreground">Firebase (Google)</p>
                <p>Anonymous analytics and crash reporting. No personally identifiable data is sent to Firebase. <a href="https://firebase.google.com/support/privacy" className="text-breath underline" target="_blank" rel="noopener noreferrer">Firebase Privacy Policy →</a></p>
              </div>
            </div>
          </Section>

          <Section title="6. Your Rights">
            <p>You have the following rights regarding your personal data:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Access</strong>: You can view all your session history and data within the App.</li>
              <li><strong>Correction</strong>: You can update your display name and profile information in the Profile page.</li>
              <li><strong>Deletion</strong>: You can permanently delete your account and all associated data via <strong>Profile → Delete Account</strong>. Deletion is processed immediately and is irreversible.</li>
              <li><strong>Reset</strong>: You can reset your stats and history while keeping your account via <strong>Profile → Reset Stats</strong>.</li>
              <li><strong>Portability</strong>: You can export your session history as a PDF via the History page.</li>
              <li><strong>Objection</strong>: You can disable emotion tracking at any time in your profile settings.</li>
            </ul>
            <p>For any other data request, email us at <a href="mailto:hello@oxiabreathe.eu" className="text-breath underline">hello@oxiabreathe.eu</a>.</p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>
              OXIA is not intended for children under the age of 13. We do not knowingly collect personal
              information from children. If you believe a child has provided us with personal information,
              please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section title="8. Data Retention">
            <p>
              We retain your personal data for as long as your account is active. When you delete your account,
              all associated data is permanently removed from our servers within 30 days. Anonymous analytics
              data retained by Firebase follows <a href="https://firebase.google.com/support/privacy" className="text-breath underline" target="_blank" rel="noopener noreferrer">Google's retention policies</a>.
            </p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the effective date
              at the top of this page. For significant changes, we will notify you through the App or via email.
              Continued use of the App after changes constitutes your acceptance of the updated policy.
            </p>
          </Section>

          <Section title="10. Contact Us">
            <p>
              If you have any questions, concerns, or requests related to this Privacy Policy, please contact us:
            </p>
            <div className="bg-card rounded-lg p-4 border border-border mt-2">
              <p><strong className="text-foreground">OXIA</strong></p>
              <p>Email: <a href="mailto:hello@oxiabreathe.eu" className="text-breath underline">hello@oxiabreathe.eu</a></p>
              <p>Website: <a href="https://oxiabreathe.eu" className="text-breath underline" target="_blank" rel="noopener noreferrer">oxiabreathe.eu</a></p>
            </div>
          </Section>

          <div className="pt-4 pb-8 text-center text-sm text-muted-foreground">
            © 2026 OXIA. All rights reserved.
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrivacyPolicyPage;
