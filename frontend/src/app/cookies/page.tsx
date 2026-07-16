import type { Metadata } from "next";
import Link from "next/link";
import GrainBlobs from "@/components/shared/GrainBlobs";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn what cookies APSLOCK uses, why we use them, and how to manage your preferences.",
};

const LAST_UPDATED = "January 1, 2025";
const CONTACT_EMAIL = "privacy@apslock.com"; // TODO: replace with real email

export default function CookiesPage() {
  return (
    <main className="pt-36 pb-24 md:pt-44 md:pb-32 relative overflow-hidden">
      <GrainBlobs variant="amber" intensity={0.08} animate={true} className="fixed inset-0 z-0 pointer-events-none" showAccent={false} />
      <div className="container-wide max-w-3xl relative z-10">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-border">
          <p className="text-eyebrow text-accent mb-4">Legal</p>
          <h1 className="text-section-heading text-text mb-4">Cookie Policy</h1>
          <p className="text-sm text-text-muted">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Body */}
        <div className="space-y-10 text-text-muted leading-relaxed">

          <Section title="1. What Are Cookies">
            <p>
              Cookies are small text files placed on your device by a website
              when you visit. They allow the site to remember your preferences
              and behavior across pages and visits.
            </p>
            <p className="mt-4">
              Cookies cannot execute code or carry viruses. They are used by
              nearly all websites to deliver a better, more consistent
              experience.
            </p>
          </Section>

          <Section title="2. Cookies We Use">
            <p>We use two categories of cookies on this site:</p>

            <div className="mt-6 space-y-6">
              <CookieCategory
                name="Strictly Necessary"
                badge="Always active"
                badgeStyle="bg-accent/10 text-accent"
                description="These cookies are required for the website to function. They cannot be disabled."
                cookies={[
                  {
                    name: "apslock-cookie-consent",
                    purpose: "Stores your cookie consent preference (accepted / declined). Expires after 1 year.",
                    provider: "APSLOCK (first-party)",
                  },
                ]}
              />

              <CookieCategory
                name="Analytics"
                badge="Requires consent"
                badgeStyle="bg-border text-text-muted"
                description="These cookies help us understand how visitors interact with our website. They are only set after you accept cookies."
                cookies={[
                  {
                    name: "_ga, _ga_*",
                    purpose:
                      "Google Analytics — distinguishes unique visitors and tracks page views, session duration, and traffic sources. Data is anonymized before storage.",
                    provider: "Google LLC",
                  },
                  {
                    name: "_gid",
                    purpose:
                      "Google Analytics — stores and updates a unique value for each page visited. Expires after 24 hours.",
                    provider: "Google LLC",
                  },
                ]}
              />
            </div>

            <p className="mt-6 text-sm">
              We do not use advertising, social media, or profiling cookies.
            </p>
          </Section>

          <Section title="3. How to Manage Your Preferences">
            <p>
              You can change your cookie preferences at any time using the
              options below:
            </p>

            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-xl border border-border bg-surface">
                <p className="font-medium text-text mb-1">
                  Cookie banner on this site
                </p>
                <p className="text-sm">
                  Clear your browser&rsquo;s local storage to reset your
                  consent choice. The cookie banner will reappear on your next
                  visit and you can select your preference again.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface">
                <p className="font-medium text-text mb-1">Browser settings</p>
                <p className="text-sm">
                  Most browsers allow you to block or delete cookies in their
                  settings. Note that blocking all cookies may affect site
                  functionality.
                  <br />
                  <span className="mt-1 block text-xs">
                    Chrome → Settings → Privacy &amp; Security → Cookies ·
                    Firefox → Settings → Privacy &amp; Security · Safari →
                    Settings → Safari → Privacy
                  </span>
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-surface">
                <p className="font-medium text-text mb-1">
                  Google Analytics opt-out
                </p>
                <p className="text-sm">
                  Install the{" "}
                  <span className="text-text">
                    Google Analytics Opt-out Browser Add-on
                  </span>{" "}
                  (tools.google.com/dlpage/gaoptout) to prevent Google
                  Analytics from collecting data in your browser across all
                  websites.
                </p>
              </div>
            </div>
          </Section>

          <Section title="4. Third-Party Cookie Information">
            <p>
              Analytics cookies are set by Google LLC. Google processes data
              on our behalf under a Data Processing Agreement and is bound by
              applicable data protection law. For more information on how
              Google uses data from partner sites:
            </p>
            <p className="mt-3 text-text">
              policies.google.com/technologies/partner-sites
            </p>
          </Section>

          <Section title="5. Changes to This Policy">
            <p>
              We may update this Cookie Policy as our use of cookies changes
              or as legal requirements evolve. The &ldquo;Last updated&rdquo;
              date at the top reflects the most recent revision. We encourage
              you to review this page periodically.
            </p>
          </Section>

          <Section title="6. Contact Us">
            <p>
              Questions about our use of cookies? Email us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-text underline underline-offset-2 hover:text-accent transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
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
            href="/terms"
            className="text-sm text-text-muted hover:text-text transition-colors underline underline-offset-2"
          >
            Terms of Service
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

function CookieCategory({
  name,
  badge,
  badgeStyle,
  description,
  cookies,
}: {
  name: string;
  badge: string;
  badgeStyle: string;
  description: string;
  cookies: { name: string; purpose: string; provider: string }[];
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Category header */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
        <p className="font-semibold text-text text-sm">{name}</p>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeStyle}`}>
          {badge}
        </span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm mb-4">{description}</p>
        <div className="space-y-3">
          {cookies.map((c) => (
            <div key={c.name} className="text-sm">
              <p>
                <span className="font-mono text-xs bg-border-light text-text px-1.5 py-0.5 rounded">
                  {c.name}
                </span>{" "}
                <span className="text-xs text-text-muted ml-1">· {c.provider}</span>
              </p>
              <p className="mt-1 text-xs leading-relaxed">{c.purpose}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
