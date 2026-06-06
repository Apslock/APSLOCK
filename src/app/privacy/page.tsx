import type { Metadata } from "next";
import Link from "next/link";
import GrainBlobs from "@/components/shared/GrainBlobs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how APSLOCK collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "January 1, 2025";
const COMPANY_NAME = "APSLOCK";
const CONTACT_EMAIL = "privacy@apslock.com"; // TODO: replace with real email
const COMPANY_ADDRESS = "[City, State, ZIP]"; // TODO: replace with real address

export default function PrivacyPage() {
  return (
    <main className="pt-36 pb-24 md:pt-44 md:pb-32 relative overflow-hidden">
      <GrainBlobs variant="amber" intensity={0.08} animate={true} className="fixed inset-0 z-0 pointer-events-none" showAccent={false} />
      <div className="container-wide max-w-3xl relative z-10">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-border">
          <p className="text-eyebrow text-accent mb-4">Legal</p>
          <h1 className="text-section-heading text-text mb-4">Privacy Policy</h1>
          <p className="text-sm text-text-muted">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Body */}
        <div className="space-y-10 text-text-muted leading-relaxed">

          <Section title="1. Introduction">
            <p>
              {COMPANY_NAME} (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
              &ldquo;us&rdquo;) operates this website. This Privacy Policy
              explains how we collect, use, disclose, and protect information
              about you when you visit our website or interact with our
              services.
            </p>
            <p className="mt-4">
              By using our website, you agree to the practices described in
              this policy. If you do not agree, please discontinue use of the
              site.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p className="font-medium text-text">Information you provide directly:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Name and email address when you submit our contact form</li>
              <li>Company name and project details you choose to share</li>
              <li>Any other information you voluntarily include in a message</li>
            </ul>
            <p className="mt-4 font-medium text-text">
              Information collected automatically:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>
                Browser type, device type, operating system, and screen
                resolution
              </li>
              <li>Pages visited, time spent on pages, and navigation paths</li>
              <li>
                Referring URL (the page that linked you here) and exit pages
              </li>
              <li>
                IP address (anonymized before storage when analytics are
                enabled)
              </li>
            </ul>
            <p className="mt-4">
              We only collect analytics data with your explicit consent via our
              cookie banner.
            </p>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul className="space-y-2 list-disc list-inside">
              <li>To respond to inquiries and provide requested services</li>
              <li>
                To analyze website usage and improve content and performance
                (only with your consent)
              </li>
              <li>To comply with legal obligations</li>
              <li>
                To protect against fraudulent or unauthorized use of our
                website
              </li>
            </ul>
            <p className="mt-4">
              We do not sell, rent, or trade your personal information to third
              parties for their marketing purposes.
            </p>
          </Section>

          <Section title="4. Cookies and Tracking Technologies">
            <p>
              We use cookies and similar technologies to operate essential site
              functions and, with your consent, to collect analytics data. See
              our{" "}
              <Link href="/cookies" className="text-text underline underline-offset-2 hover:text-accent transition-colors">
                Cookie Policy
              </Link>{" "}
              for a full breakdown of cookie types and how to manage them.
            </p>
          </Section>

          <Section title="5. Third-Party Services">
            <p>
              We may use third-party service providers to help operate our
              website and deliver services, including:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-text">Analytics</strong> — We intend to
                use Google Analytics to understand site usage. Google Analytics
                only activates after you accept cookies. Google&rsquo;s privacy
                policy governs their data handling:{" "}
                <span className="text-text">policies.google.com/privacy</span>
              </li>
              <li>
                <strong className="text-text">Hosting &amp; Infrastructure</strong>{" "}
                — Our website is hosted on Vercel. Vercel may process server
                logs that include IP addresses. See Vercel&rsquo;s privacy policy
                at vercel.com/legal/privacy-policy.
              </li>
            </ul>
            <p className="mt-4">
              These providers are contractually required to protect your
              information and may not use it for their own marketing purposes.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              Contact form submissions are retained for up to 2 years to
              maintain correspondence records, then deleted. Analytics data
              (when enabled) is retained per the default settings of the
              analytics provider. You may request deletion of your data at any
              time by contacting us.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>
              Depending on where you reside, you may have rights regarding your
              personal information:
            </p>
            <ul className="mt-3 space-y-3 list-disc list-inside">
              <li>
                <strong className="text-text">Right to Access</strong> — request
                a copy of the personal data we hold about you
              </li>
              <li>
                <strong className="text-text">Right to Deletion</strong> — request
                that we delete your personal data
              </li>
              <li>
                <strong className="text-text">Right to Correction</strong> — request
                correction of inaccurate data
              </li>
              <li>
                <strong className="text-text">Right to Opt Out</strong>{" "}
                (California residents under CCPA) — opt out of the sale of
                personal information. We do not sell personal information.
              </li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, email us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-text underline underline-offset-2 hover:text-accent transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              . We will respond within 30 days.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Our website is not directed at children under 13. We do not
              knowingly collect personal information from children. If you
              believe a child has submitted information to us, contact us
              immediately and we will delete it.
            </p>
          </Section>

          <Section title="9. Security">
            <p>
              We use industry-standard security measures to protect your
              information, including HTTPS encryption for all data in transit.
              However, no method of transmission over the internet is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. The
              &ldquo;Last updated&rdquo; date at the top of this page reflects
              when the policy was last revised. Continued use of the website
              after changes constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              Questions about this Privacy Policy? Contact us:
            </p>
            <address className="mt-4 not-italic space-y-1 text-text">
              <p className="font-semibold">{COMPANY_NAME}</p>
              <p>{COMPANY_ADDRESS}</p>
              <p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="underline underline-offset-2 hover:text-accent transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </address>
          </Section>

        </div>

        {/* Footer nav */}
        <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-6">
          <Link href="/terms" className="text-sm text-text-muted hover:text-text transition-colors underline underline-offset-2">
            Terms of Service
          </Link>
          <Link href="/cookies" className="text-sm text-text-muted hover:text-text transition-colors underline underline-offset-2">
            Cookie Policy
          </Link>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-text mb-3 font-display tracking-tight">
        {title}
      </h2>
      <div className="text-base leading-relaxed">{children}</div>
    </section>
  );
}
