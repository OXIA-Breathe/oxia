import MainLayout from "@/components/layout/MainLayout";
import { APP_VERSION } from "@/version";
import { Separator } from "@/components/ui/separator";

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
      <h2 className="text-base font-bold text-card-foreground tracking-tight">{title}</h2>
    </div>
    <div className="text-muted-foreground leading-relaxed space-y-2 pl-10">
      {children}
    </div>
    <Separator className="mt-4" />
  </section>
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

const TermsPage = () => {
  return (
    <MainLayout>
      <div className="container pt-24 pb-12 max-w-2xl">
        {/* Title — outside card */}
        <div className="mb-6 space-y-1">
          <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>
          <p className="text-white/60 text-sm">Effective: February 18, 2026</p>
        </div>

        {/* Big card wrapping all content */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
          <p className="text-muted-foreground leading-relaxed text-sm">
            These Terms & Conditions ("Terms") govern your use of the <strong className="text-card-foreground">OXIA</strong> breathing and wellness application ("App"), developed by <strong className="text-card-foreground">Epner Solutions OÜ</strong>. By downloading, installing, or using the App you agree to these Terms in full.
          </p>

          <Separator />

          <Section number="1" title="Who We Are">
            <p>
              OXIA is developed and operated by <strong className="text-card-foreground">Epner Solutions OÜ</strong>, a company registered in Estonia.
              Contact us at{" "}
              <a href="mailto:info@oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium">
                info@oxiabreathe.eu
              </a>{" "}
              or visit{" "}
              <a href="https://oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium" target="_blank" rel="noopener noreferrer">
                oxiabreathe.eu
              </a>.
            </p>
          </Section>

          <Section number="2" title="Not Medical Advice">
            <p className="text-sm bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 text-card-foreground">
              ⚠️ <strong>OXIA is a wellness and breathing practice tool. It is not a medical device and does not provide medical advice, diagnosis, or treatment.</strong>
            </p>
            <BulletList items={[
              "The breathing exercises in OXIA are intended for general wellness and stress management only.",
              "Do not use OXIA as a substitute for professional medical advice, diagnosis, or treatment.",
              "Always consult a qualified healthcare provider before starting any new breathing or wellness practice, especially if you have a pre-existing medical condition.",
              "Stop any exercise immediately if you feel discomfort, dizziness, shortness of breath, or any unusual symptom, and seek medical advice.",
              "Epner Solutions OÜ is not liable for any health outcomes arising from use of the App.",
            ]} />
          </Section>

          <Section number="3" title="Acceptable Use">
            <p className="mb-2">By using OXIA, you agree to:</p>
            <BulletList items={[
              "Use the App only for lawful, personal, non-commercial purposes.",
              "Provide accurate information when creating your account.",
              "Keep your login credentials secure and not share your account with others.",
              "Not attempt to reverse-engineer, decompile, or modify any part of the App.",
              "Not use the App in any way that could harm other users, Epner Solutions OÜ, or third parties.",
              "Not upload or transmit any harmful, offensive, or unlawful content through the App.",
              "Comply with all applicable laws and regulations in your jurisdiction.",
            ]} />
          </Section>

          <Section number="4" title="Account Registration">
            <p>
              Creating an account is required to use certain features of OXIA (such as session history, streaks, and personalised reports).
              You are responsible for maintaining the confidentiality of your account and for all activities that occur under it.
              We reserve the right to suspend or delete accounts that violate these Terms.
            </p>
          </Section>

          <Section number="5" title="Subscription & Payments">
            <p className="mb-2">OXIA may offer premium features via a subscription:</p>
            <BulletList items={[
              "Subscription pricing and available plans are displayed in the App at the time of purchase.",
              "Subscriptions are billed in advance on a recurring basis (monthly or annual) depending on your chosen plan.",
              "Payment is processed through the Apple App Store or Google Play Store, subject to their respective terms.",
              "You may cancel your subscription at any time through your App Store or Play Store account settings.",
              "Cancellation takes effect at the end of the current billing period — you will retain access until then.",
              "We do not offer refunds for partially used subscription periods unless required by applicable law.",
              "We reserve the right to change subscription pricing with reasonable advance notice.",
            ]} />
          </Section>

          <Section number="6" title="Free Trial">
            <p>
              We may offer a free trial period for premium features. At the end of the trial, your subscription will automatically convert to a paid plan unless you cancel before the trial ends. Trial eligibility is determined at our discretion and may be limited to one trial per user.
            </p>
          </Section>

          <Section number="7" title="Intellectual Property">
            <p>
              All content in the App — including breathing exercises, audio, design, text, illustrations, and software — is the property of Epner Solutions OÜ or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any part of the App without prior written consent.
            </p>
          </Section>

          <Section number="8" title="Privacy">
            <p>
              Your use of OXIA is also governed by our{" "}
              <strong className="text-card-foreground">Privacy Policy</strong>, which explains how we collect, use, and protect your personal data. By using the App, you agree to the practices described therein.
            </p>
          </Section>

          <Section number="9" title="Limitation of Liability">
            <p className="mb-2">To the maximum extent permitted by applicable law:</p>
            <BulletList items={[
              "Epner Solutions OÜ provides the App on an \"as is\" and \"as available\" basis without warranties of any kind.",
              "We do not guarantee that the App will be uninterrupted, error-free, or meet your specific expectations.",
              "We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the App.",
              "Our total liability to you for any claim arising out of these Terms shall not exceed the amount you paid for the App in the 12 months preceding the claim.",
            ]} />
          </Section>

          <Section number="10" title="Changes to These Terms">
            <p>
              We may update these Terms from time to time. When we do, we will update the effective date at the top of this page. Continued use of the App after changes are posted constitutes your acceptance of the revised Terms. For significant changes, we will notify you through the App or by email.
            </p>
          </Section>

          <Section number="11" title="Governing Law">
            <p>
              These Terms are governed by and construed in accordance with the laws of the <strong className="text-card-foreground">Republic of Estonia</strong>. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of Estonian courts, unless otherwise required by applicable consumer protection laws in your country.
            </p>
          </Section>

          <Section number="12" title="Contact Us">
            <p>If you have any questions about these Terms:</p>
            <div className="mt-2 space-y-0.5 text-sm">
              <p className="font-semibold text-card-foreground">Epner Solutions OÜ</p>
              <p>Email: <a href="mailto:info@oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium">info@oxiabreathe.eu</a></p>
              <p>Website: <a href="https://oxiabreathe.eu" className="text-primary underline underline-offset-2 font-medium" target="_blank" rel="noopener noreferrer">oxiabreathe.eu</a></p>
            </div>
          </Section>
        </div>

        {/* Logo + version — outside card */}
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <img
            src="/lovable-uploads/6d9cc0f0-addd-45b1-abab-238892b91dbf.png"
            alt="OXIA Logo"
            className="h-16 w-auto object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <div className="text-sm text-white/50">
            © 2026 Epner Solutions OÜ · Version {APP_VERSION}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsPage;
