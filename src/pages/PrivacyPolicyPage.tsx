import MainLayout from "@/components/layout/MainLayout";
import { APP_VERSION } from "@/version";
import { Separator } from "@/components/ui/separator";

const Section = ({ title, number, children }: { title: string; number: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <div className="flex items-center gap-3">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
        {number}
      </span>
      <h2 className="text-base font-bold text-card-foreground tracking-tight">{title}</h2>
    </div>
    <div className="text-muted-foreground leading-relaxed space-y-2 pl-10">{children}</div>
    <Separator className="mt-4" />
  </section>
);

const DataItem = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-3 py-2">
    <span className="text-lg leading-none mt-0.5">{icon}</span>
    <div>
      <p className="font-semibold text-sm text-card-foreground">{title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  </div>
);

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-1.5">
    {items.map((item) => (
      <li key={item} className="flex items-start gap-2 text-sm">
        <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" />
        {item}
      </li>
    ))}
  </ul>
);

const PrivacyPolicyPage = () => {
  return (
    <MainLayout>
      <div className="container pt-24 pb-12 max-w-2xl">
        {/* Title — outside card */}
        <div className="mb-6 space-y-1">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/60 text-sm">Effective: February 19, 2026</p>
        </div>

        {/* Big card wrapping all content */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
          <p className="text-muted-foreground leading-relaxed text-sm">
            This Privacy Policy explains how <strong className="text-card-foreground">OXIA</strong> ("we", "us", "our")
            collects, uses, stores, and protects your personal information when you use the OXIA breathing app (the
            “App”). By using the App, you agree to the practices described below.
          </p>

          <Separator />

          <Section number="1" title="Who We Are">
            <p>
              OXIA is a breathing and wellness application developed by{" "}
              <strong className="text-card-foreground">Epner Solutions OÜ</strong> (“Data Controller”). Our website is{" "}
              <a
                href="https://oxiabreathe.eu"
                className="text-primary underline underline-offset-2 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                oxiabreathe.eu
              </a>
              . For privacy inquiries:{" "}
              <a href="mailto:info@oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium">
                info@oxiabreathe.eu
              </a>
            </p>
          </Section>

          <Section number="2" title="What Data We Collect">
            <p className="mb-3">We collect only the data necessary to provide and improve the App's features:</p>
            <div className="space-y-1 divide-y divide-border -ml-10 pl-0">
              <DataItem icon="📧" title="Account Information">
                Your <strong className="text-card-foreground">email address</strong>, collected when you create an
                account. Used for authentication, account recovery, and essential communication.
              </DataItem>
              <DataItem icon="🫁" title="Breathing Session Data">
                Exercise type, duration, breath count, repetitions, hold duration, and date/time of each session. Used
                to display your history and progress.
              </DataItem>
              <DataItem icon="💚" title="Mood & Emotion Data">
                Optional pre- and post-session emotional check-ins (valence, arousal scores, and optional notes). Stored
                securely and used <strong className="text-card-foreground">only</strong> inside the App for your
                tracking features.
              </DataItem>
              <DataItem icon="🏆" title="Achievements & Streaks">
                Streaks, earned badges, and daily activity records. Used to power consistency and progress features.
              </DataItem>
              <DataItem icon="🔔" title="Notification Preferences">
                Your chosen notification schedule (days and times). Stored to send breathing reminders you have
                configured.
              </DataItem>
              <DataItem icon="⚙️" title="App Preferences">
                Certain preferences (e.g., audio settings) stored locally on your device and not uploaded unless a
                feature explicitly requires syncing.
              </DataItem>
              <DataItem icon="📊" title="Analytics & Diagnostics">
                We use Firebase Analytics to understand app usage and improve stability. We do{" "}
                <strong className="text-card-foreground">not</strong> send your name or email to Firebase. Firebase may
                collect device/app identifiers and technical data (e.g., device model, OS version, app events, crash
                logs) to provide these services.
              </DataItem>
            </div>
          </Section>

          <Section number="3" title="How We Use Your Data">
            <BulletList
              items={[
                "To create and manage your account and authenticate access",
                "To display your session history, progress charts, and wellness insights",
                "To calculate and display streaks, achievements, and consistency metrics",
                "To send reminders at times you have chosen",
                "To generate personalised PDF reports from your session data",
                "To improve App performance and fix bugs using analytics/diagnostics",
                "To respond to your support requests and feedback",
              ]}
            />
            <p className="mt-3 text-sm bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 text-card-foreground">
              We do <strong>not</strong> sell your data. We do <strong>not</strong> use your health or mood data for
              advertising.
            </p>
          </Section>

          <Section number="4" title="How We Store & Protect Your Data">
            <p className="mb-3">
              All personal and session data is stored on <strong className="text-card-foreground">Supabase</strong>, a
              secure cloud database hosted in the European Union. We apply:
            </p>
            <ul className="space-y-1.5">
              {[
                {
                  label: "Row Level Security (RLS)",
                  desc: "Every table enforces strict rules — you can only access your own data.",
                },
                { label: "Encrypted connections", desc: "All data uses HTTPS/TLS encryption in transit." },
                {
                  label: "Secure Edge Functions",
                  desc: "Sensitive operations (like account deletion) run server-side with authenticated tokens.",
                },
                { label: "Field protection", desc: "Controls to prevent client-side tampering of sensitive fields." },
                {
                  label: "No sensitive logging",
                  desc: "We do not log your email, user ID, or health data to any analytics service.",
                },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <span>
                    <strong className="text-card-foreground">{item.label}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          <Section number="5" title="Third-Party Services">
            <p className="mb-3">We use the following trusted third-party services ("processors"):</p>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-card-foreground text-sm">Supabase</p>
                <p className="text-sm">
                  Database, authentication, and Edge Functions provider. Data stored in EU-based data centres.{" "}
                  <a
                    href="https://supabase.com/privacy"
                    className="text-primary underline underline-offset-2 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy →
                  </a>
                </p>
              </div>
              <div>
                <p className="font-semibold text-card-foreground text-sm">Firebase (Google)</p>
                <p className="text-sm">
                  Anonymous or pseudonymous analytics (Firebase Analytics). We do not send your email or profile data to
                  Firebase.{" "}
                  <a
                    href="https://firebase.google.com/support/privacy"
                    className="text-primary underline underline-offset-2 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy →
                  </a>
                </p>
                <p>
                  Some providers may process data outside the EEA. Where applicable, we rely on appropriate safeguards
                  (such as Standard Contractual Clauses) to protect personal data.
                </p>
              </div>
            </div>
          </Section>

          <Section number="6" title="Your Rights">
            <p className="mb-3">You have the following rights regarding your personal data:</p>
            <ul className="space-y-1.5">
              {[
                { label: "Access", desc: "View all your session history and data within the App." },
                { label: "Correction", desc: "Update your display name and profile information in the Profile page." },
                {
                  label: "Deletion",
                  desc: "Permanently delete your account and all data via Profile → Delete Account.",
                },
                { label: "Reset", desc: "Reset your stats while keeping your account via Profile → Reset Stats." },
                { label: "Portability", desc: "Export your session history as a PDF via the Progress page." },
                { label: "Withdraw consent", desc: "Disable emotion tracking at any time in your profile settings." },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60" />
                  <span>
                    <strong className="text-card-foreground">{item.label}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              For any other request, email:{" "}
              <a href="mailto:info@oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium">
                info@oxiabreathe.eu
              </a>
            </p>
          </Section>

          <Section number="7" title="Children's Privacy">
            <p>
              The App is not intended for children. We do not knowingly collect personal information from children. If
              you believe a child has provided us with data, please contact us and we will delete it promptly.
            </p>
          </Section>

          <Section number="8" title="Data Retention">
            <p>
              We retain data while your account is active. If you delete your account, we delete associated personal and
              session data within 30 days, except where retention is required for legal reasons (e.g.,
              billing/accounting). Backups may persist for a limited time but are not used for active processing.
              Anonymous Firebase analytics follow{" "}
              <a
                href="https://firebase.google.com/support/privacy"
                className="text-primary underline underline-offset-2 font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google's retention policies
              </a>
              .
            </p>
          </Section>

          <Section number="9" title="Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the effective date at the
              top of this page. For significant changes, we will notify you through the App or via email.
            </p>
          </Section>

          <Section number="10" title="Contact Us">
            <p>If you have any questions or requests related to this Privacy Policy:</p>
            <div className="mt-2 space-y-0.5 text-sm">
              <p className="font-semibold text-card-foreground">Epner Solutions OÜ</p>
              <p>
                Email:{" "}
                <a href="mailto:info@oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium">
                  info@oxiabreathe.eu
                </a>
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://oxiabreathe.eu"
                  className="text-primary underline underline-offset-2 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  oxiabreathe.eu
                </a>
              </p>
            </div>
          </Section>
        </div>

        {/* Logo + version — outside card */}
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <img
            src="/lovable-uploads/6d9cc0f0-addd-45b1-abab-238892b91dbf.png"
            alt="OXIA Logo"
            className="h-16 w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div className="text-sm text-white/50">© 2026 Epner Solutions OÜ · Version {APP_VERSION}</div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicyPage;
