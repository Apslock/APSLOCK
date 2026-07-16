import type { FAQItem } from "@/components/expertise/shared/FAQ";
import type { Tool } from "@/components/expertise/shared/ToolsMarquee";

// ── Scenarios ─────────────────────────────────────────────────────────────────
export type Scenario = { tag: string; quote: string; response: string };

export const scenarios: Scenario[] = [
  {
    tag: "01 / platform stall",
    quote: "Our stack held up for launch — it's buckling under the roadmap we signed up for.",
    response:
      "We see this on the other side of product-market fit: a stack picked for speed that now taxes every new feature. We audit what's load-bearing, replace what's actively costing velocity, and migrate in reversible increments — so the team keeps shipping while the foundation gets rebuilt underneath them.",
  },
  {
    tag: "02 / post-acquisition",
    quote: "We just absorbed three platforms and nothing talks to each other.",
    response:
      "Post-M&A integration is almost never a platform problem — it's a data-contract problem. We stand up a composable layer that lets each system keep its shape while the experiences on top feel like one company, and we do it without forcing a rip-and-replace the board would never approve.",
  },
  {
    tag: "03 / AI pilot purgatory",
    quote: "Our AI pilots keep not making it to production.",
    response:
      "Usually because they were built as demos, not as workflows. We ship AI into the actual system — with the evals, guardrails, human-in-the-loop, and telemetry that turn a pilot into a feature finance will fund. Trackable on day one, auditable the day legal asks.",
  },
  {
    tag: "04 / speed to proof",
    quote: "We need a prototype in investor hands in six weeks — and it has to feel real.",
    response:
      "We build lean POCs that carry real production DNA: the flow is scripted, but the auth, the data layer, and the UI are the same ones that survive the Series A. You get something that demos cleanly on Monday and doesn't have to be thrown away on Tuesday.",
  },
];

// ── Work Areas (3×2 hover grid) ───────────────────────────────────────────────
export type WorkArea = { title: string; description: string };

export const workAreas: WorkArea[] = [
  {
    title: "Websites & eCommerce",
    description:
      "Storefronts and marketing sites engineered to convert — fast in every market, built directly for commercial growth, and structured to scale with your catalog.",
  },
  {
    title: "Web & Mobile Apps",
    description:
      "Product experiences that hold up at scale — shared design systems across surfaces, native performance where it counts, release cadence that compounds.",
  },
  {
    title: "Composable Architectures",
    description:
      "Headless commerce, modular content layers, and API-first systems that let each team ship on its own clock without breaking the experience on top.",
  },
  {
    title: "Martech Ecosystems",
    description:
      "CDP, analytics, and campaign tooling wired into the product so marketing, sales, and growth operate on one source of truth — not three dashboards that disagree.",
  },
  {
    title: "AI & Automation",
    description:
      "LLM workflows, agents, and automations shipped into the actual system — with the evals, guardrails, and telemetry that turn a pilot into a production feature.",
  },
  {
    title: "POCs & Prototypes",
    description:
      "Six-week builds with real production DNA — the auth, the data layer, the UI that survive the Series A. Ready to demo on Monday, ready to scale from there.",
  },
];

// ── Tools Marquee ─────────────────────────────────────────────────────────────
export const buildTools: Tool[] = [
  { name: "Next.js" },
  { name: "React" },
  { name: "React Native" },
  { name: "TypeScript" },
  { name: "Node.js" },
  { name: "Vercel" },
  { name: "AWS" },
  { name: "Shopify" },
  { name: "Contentful" },
  { name: "Sanity" },
  { name: "Prisma" },
  { name: "Postgres" },
  { name: "Stripe" },
  { name: "Segment" },
  { name: "Temporal" },
  { name: "OpenAI" },
  { name: "Linear" },
  { name: "GitHub Actions" },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────
export const faqs: FAQItem[] = [
  {
    question: "What kinds of engagements does Build & Innovation cover?",
    answer:
      "Anything from a six-week POC to a multi-quarter platform rebuild. The common thread is that engineering is the primary output — not a side-effect of design. Typical shapes: a new commerce storefront, a mobile app rebuild, a headless migration, an AI workflow shipped into production, or a greenfield product MVP.",
  },
  {
    question: "Do you work alongside our internal engineering team?",
    answer:
      "Yes, and we prefer it. Most of our engagements pair our engineers with yours — we handle the load during the build, your team takes the work forward after. We write the runbooks, pair on the deploys, and design the handover into the engagement so the system you end up with is one your people actually own.",
  },
  {
    question: "How do you pick the technology stack?",
    answer:
      "Three criteria, in this order: durability (will this still be a reasonable choice in three years), hiring market (can your future self hire for it), and total cost of ownership. Boring technology by default. We do use the interesting stuff — but only where it earns its place against those three tests.",
  },
  {
    question: "How do you handle AI engagements specifically?",
    answer:
      "AI work ships with the same rigor as the rest of the system: evals before deploy, telemetry on day one, human-in-the-loop where the stakes warrant it, and a spend budget that lands in the same finance review as any other line item. We don't do \"demos that impress.\" We ship workflows that make numbers move.",
  },
  {
    question: "What's the typical team shape and size?",
    answer:
      "A tech lead, two to three senior engineers, a product designer, and a delivery lead — scaled up or down against scope. Every engineer on your build is senior. There are no junior hands on the system you're paying us to ship.",
  },
  {
    question: "What do we own, and how does handover work?",
    answer:
      "Everything: source, infrastructure, documentation, CI, the runbooks, the dashboards. No license fees, no retainer lock-in. We hand the repo over warm, pair with your team for two weeks, and stay on-call through the first real load event on the house.",
  },
];
