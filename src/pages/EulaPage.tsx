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

const EulaPage = () => {
  return (
    <MainLayout>
      <div className="container pt-24 pb-12 max-w-2xl">
        {/* Title — outside card */}
        <div className="mb-6 space-y-1">
          <h1 className="text-3xl font-bold text-white">End User License Agreement</h1>
          <p className="text-white/60 text-sm">Effective: February 18, 2026</p>
        </div>

        {/* Big card wrapping all content */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
          <p className="text-muted-foreground leading-relaxed text-sm">
            This End User License Agreement ("EULA") is a legal agreement between you ("User") and{" "}
            <strong className="text-card-foreground">Epner Solutions OÜ</strong> ("Licensor") for the use of the{" "}
            <strong className="text-card-foreground">OXIA</strong> breathing and wellness application ("App"). By downloading, installing, or using the App, you agree to be bound by this EULA. If you do not agree, do not install or use the App.
          </p>

          <Separator />

          <Section number="1" title="License Grant">
            <p>
              Epner Solutions OÜ grants you a limited, non-exclusive, non-transferable, revocable licence to install and use the App on devices you own or control, solely for your personal, non-commercial purposes, in accordance with this EULA and any applicable App Store or Google Play terms.
            </p>
          </Section>

          <Section number="2" title="Restrictions">
            <p className="mb-2">You may not:</p>
            <BulletList items={[
              "Copy, modify, or create derivative works of the App or any part thereof.",
              "Reverse-engineer, decompile, disassemble, or attempt to derive the source code of the App.",
              "Sell, sublicense, rent, lease, lend, or otherwise transfer the App or any rights in it to any third party.",
              "Remove or alter any proprietary notices, labels, or marks on the App.",
              "Use the App for any unlawful purpose or in violation of any applicable regulations.",
              "Use the App to develop a competing product or service.",
            ]} />
          </Section>

          <Section number="3" title="Not Medical Advice">
            <p className="text-sm bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 text-card-foreground">
              ⚠️ <strong>OXIA is a wellness and breathing practice tool. It is not a medical device and does not provide medical advice, diagnosis, or treatment.</strong>
            </p>
            <BulletList items={[
              "Do not use OXIA as a substitute for professional medical advice or treatment.",
              "Always consult a qualified healthcare provider before beginning any new breathing or wellness practice.",
              "Stop any exercise immediately if you feel unwell and seek medical attention.",
              "Epner Solutions OÜ accepts no liability for any health outcomes arising from use of the App.",
            ]} />
          </Section>

          <Section number="4" title="Intellectual Property">
            <p>
              The App and all content within it — including but not limited to text, graphics, audio, breathing exercises, software, and design — are the exclusive property of Epner Solutions OÜ or its licensors and are protected by copyright, trademark, and other intellectual property laws. This EULA does not grant you any rights to trademarks or service marks of Epner Solutions OÜ.
            </p>
          </Section>

          <Section number="5" title="Updates & Changes">
            <p>
              Epner Solutions OÜ may release updates, patches, or new versions of the App from time to time. Such updates may be required to continue using the App and may be delivered automatically. This EULA applies to all such updates unless a separate licence accompanies them.
            </p>
          </Section>

          <Section number="6" title="Subscription & In-App Purchases">
            <p className="mb-2">Access to certain features requires a paid subscription:</p>
            <BulletList items={[
              "Subscriptions are offered on a monthly or annual basis and renew automatically unless cancelled.",
              "Payments are processed through the Apple App Store or Google Play Store.",
              "You may cancel at any time via your App Store / Play Store account settings; access continues until the end of the billing period.",
              "We do not offer refunds for unused portions of a subscription period, except where required by law.",
              "Pricing may change with reasonable advance notice communicated through the App.",
            ]} />
          </Section>

          <Section number="7" title="Termination">
            <p>
              This licence is effective until terminated. Your rights under this EULA will terminate automatically and without notice if you fail to comply with any of its terms. Upon termination you must cease all use of the App and delete all copies from your devices. Epner Solutions OÜ may also terminate or suspend your access at any time if we reasonably believe you have violated this EULA.
            </p>
          </Section>

          <Section number="8" title="Disclaimer of Warranties">
            <p>
              The App is provided on an <strong className="text-card-foreground">"as is"</strong> and{" "}
              <strong className="text-card-foreground">"as available"</strong> basis without any warranty of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement. Epner Solutions OÜ does not warrant that the App will be error-free, uninterrupted, or free of viruses or other harmful components.
            </p>
          </Section>

          <Section number="9" title="Limitation of Liability">
            <p className="mb-2">To the maximum extent permitted by applicable law:</p>
            <BulletList items={[
              "Epner Solutions OÜ shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the App.",
              "Our total aggregate liability to you for any claim shall not exceed the amount you paid for the App in the 12 months preceding the claim.",
              "Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so some of the above may not apply to you.",
            ]} />
          </Section>

          <Section number="10" title="Privacy">
            <p>
              Your use of the App is subject to our{" "}
              <strong className="text-card-foreground">Privacy Policy</strong>, which is incorporated into this EULA by reference. By using the App you consent to the collection and use of information as described therein.
            </p>
          </Section>

          <Section number="11" title="Governing Law">
            <p>
              This EULA is governed by and construed in accordance with the laws of the{" "}
              <strong className="text-card-foreground">Republic of Estonia</strong>. Any disputes shall be subject to the exclusive jurisdiction of Estonian courts, unless otherwise required by mandatory consumer protection laws in your country of residence.
            </p>
          </Section>

          <Section number="12" title="Contact">
            <p>If you have any questions about this EULA, please contact us:</p>
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

export default EulaPage;
