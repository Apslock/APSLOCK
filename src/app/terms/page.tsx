import type { Metadata } from "next";
import Link from "next/link";
import GrainBlobs from "@/components/shared/GrainBlobs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions governing your use of the APSLOCK website.",
};

const LAST_UPDATED = "January 1, 2025";
const COMPANY_NAME = "APSLOCK";
const CONTACT_EMAIL = "legal@apslock.com"; // TODO: replace with real email
const GOVERNING_STATE = "Georgia"; // TODO: replace with your state

export default function TermsPage() {
  return (
    <main className="pt-36 pb-24 md:pt-44 md:pb-32 relative overflow-hidden">
      <GrainBlobs variant="amber" intensity={0.08} animate={true} className="fixed inset-0 z-0 pointer-events-none" showAccent={false} />
      <div className="container-wide max-w-3xl relative z-10">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-border">
          <p className="text-eyebrow text-accent mb-4">Legal</p>
          <h1 className="text-section-heading text-text mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-text-muted">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Body */}
        <div className="space-y-10 text-text-muted leading-relaxed">

          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using the {COMPANY_NAME} website (the
              &ldquo;Site&rdquo;), you agree to be bound by these Terms of
              Service (&ldquo;Terms&rdquo;). If you do not agree to these
              Terms, do not use the Site.
            </p>
            <p className="mt-4">
              These Terms apply to all visitors, users, and others who access
              or use the Site. We reserve the right to update these Terms at
              any time; continued use after changes constitutes acceptance.
            </p>
          </Section>

          <Section title="2. Use of the Website">
            <p>You agree to use the Site only for lawful purposes. You may not:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>
                Use the Site in a way that violates any applicable local,
                state, national, or international law or regulation
              </li>
              <li>
                Attempt to gain unauthorized access to any portion of the Site
                or its related systems
              </li>
              <li>
                Transmit any advertising or promotional material without our
                prior written consent
              </li>
              <li>
                Introduce any malicious code, virus, or disruptive material
              </li>
              <li>
                Scrape, copy, or reproduce any content without express
                permission
              </li>
            </ul>
          </Section>

          <Section title="3. Intellectual Property">
            <p>
              All content on this Site — including text, graphics, logos,
              images, designs, case studies, and code — is the property of{" "}
              {COMPANY_NAME} or its content suppliers and is protected by
              applicable copyright, trademark, and intellectual property laws.
            </p>
            <p className="mt-4">
              You may not reproduce, distribute, modify, create derivative
              works from, or publicly display any content from this Site
              without our express prior written permission.
            </p>
          </Section>

          <Section title="4. Services and Proposals">
            <p>
              The Site provides information about {COMPANY_NAME}&rsquo;s
              services. Nothing on this Site constitutes an offer or contract
              for services. Engagement for services requires a separate written
              agreement signed by both parties.
            </p>
            <p className="mt-4">
              Case studies and portfolio work displayed on the Site are shown
              with client permission and represent past work. Results described
              are specific to those engagements and are not guarantees of
              future performance.
            </p>
          </Section>

          <Section title="5. Disclaimer of Warranties">
            <p>
              The Site and its content are provided on an &ldquo;as is&rdquo;
              and &ldquo;as available&rdquo; basis without warranties of any
              kind, either express or implied, including but not limited to
              implied warranties of merchantability, fitness for a particular
              purpose, or non-infringement.
            </p>
            <p className="mt-4">
              {COMPANY_NAME} does not warrant that the Site will be
              uninterrupted, error-free, or free of viruses or other harmful
              components.
            </p>
          </Section>

          <Section title="6. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law,{" "}
              {COMPANY_NAME} shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages — including loss of
              profits, data, or goodwill — arising from your use of or
              inability to use the Site, even if {COMPANY_NAME} has been
              advised of the possibility of such damages.
            </p>
          </Section>

          <Section title="7. Third-Party Links">
            <p>
              The Site may contain links to third-party websites or services
              that are not owned or controlled by {COMPANY_NAME}. We have no
              control over, and assume no responsibility for, the content,
              privacy policies, or practices of any third-party sites. We
              encourage you to review the privacy policies of any third-party
              sites you visit.
            </p>
          </Section>

          <Section title="8. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the State of {GOVERNING_STATE}, United States,
              without regard to its conflict of law provisions. Any disputes
              arising under these Terms shall be subject to the exclusive
              jurisdiction of the courts located in {GOVERNING_STATE}.
            </p>
          </Section>

          <Section title="9. Contact Us">
            <p>
              Questions about these Terms? Contact us:
            </p>
            <address className="mt-4 not-italic space-y-1 text-text">
              <p className="font-semibold">{COMPANY_NAME}</p>
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
          <Link
            href="/privacy"
            className="text-sm text-text-muted hover:text-text transition-colors underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          <Link
            href="/cookies"
            className="text-sm text-text-muted hover:text-text transition-colors underline underline-offset-2"
          >
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
