import type { FAQItem } from "@/components/expertise/shared/FAQ";
import type { Tool } from "@/components/expertise/shared/ToolsMarquee";

export type Scenario = { tag: string; quote: string; response: string };

export const scenarios: Scenario[] = [
  {
    tag: "01 / launch motion",
    quote: "We're shipping a new product in the spring and we don't have a launch motion that scales beyond a press release.",
    response: "We map the launch from analyst pre-brief to post-launch nurture in a single GTM plan — owned, paid, lifecycle, and sales enablement built against the same calendar. Your team gets one runbook, not five vendors trying to coordinate around it.",
  },
  {
    tag: "02 / pipeline plateau",
    quote: "Top-of-funnel volume is fine, but pipeline quality has flattened for two quarters running.",
    response: "Plateaus are usually a targeting problem dressed up as a creative problem. We rebuild the ICP from closed-won data, retire the segments that look busy but never convert, and reweight spend toward the channels that actually move pipeline — not the ones that look good on a board slide.",
  },
  {
    tag: "03 / paid media efficiency",
    quote: "CAC has crept up 40% year over year and nobody can give me a clean answer why.",
    response: "Almost always a mix of channel saturation, attribution drift, and creative fatigue compounding quietly. We rebuild the measurement model first — so the question is answerable — then re-architect the media plan against it. The number usually comes back into range inside a quarter.",
  },
  {
    tag: "04 / lifecycle gap",
    quote: "We acquire well, but the second purchase rate is killing LTV and nobody owns the email program.",
    response: "Acquisition without a lifecycle layer is a leaky bucket the CFO eventually notices. We design the post-purchase journey end-to-end — segmentation, triggers, content, deliverability — and stand it up in your existing stack so the LTV math starts working before the next planning cycle.",
  },
];

export type WorkArea = { title: string; description: string };

export const workAreas: WorkArea[] = [
  {
    title: "Strategic Workshops",
    description: "Two-day working sessions that compress a quarter of decisions into a week — alignment your leadership team can act on Monday morning.",
  },
  {
    title: "Email Marketing & Automation",
    description: "Lifecycle programs designed for revenue, not opens — segmentation, triggers, and content that actually move repeat purchase and pipeline velocity.",
  },
  {
    title: "Intelligence & Reporting",
    description: "Marketing measurement your CFO trusts. Attribution, MMM, and dashboards built so the team stops arguing about the number and starts moving it.",
  },
  {
    title: "Paid Media & Demand Generation",
    description: "Full-funnel paid programs across search, social, and display — engineered for efficient pipeline, with creative refreshed before fatigue costs you the quarter.",
  },
  {
    title: "Search, SEM & CRM",
    description: "Organic and paid search run as one motion, wired into the CRM so every click is accountable to the deal it eventually closes.",
  },
  {
    title: "GTM Strategies",
    description: "Launch plans, segmentation, and motion design that translate product roadmap into a calendar your sales, marketing, and CS teams can execute against.",
  },
];

export const growthTools: Tool[] = [
  { name: "HubSpot" },
  { name: "Salesforce" },
  { name: "Marketo" },
  { name: "Klaviyo" },
  { name: "Customer.io" },
  { name: "Iterable" },
  { name: "Segment" },
  { name: "Amplitude" },
  { name: "Mixpanel" },
  { name: "Looker" },
  { name: "GA4" },
  { name: "Google Ads" },
  { name: "Meta Ads" },
  { name: "LinkedIn Ads" },
  { name: "6sense" },
];

export const faqs: FAQItem[] = [
  {
    question: "How long before we see pipeline impact?",
    answer: "Paid programs usually show signal in 30–45 days; lifecycle and SEO compound over 90–180 days. We agree on a leading-indicator scorecard at week one — pipeline-influenced revenue, MQL-to-SQL conversion, blended CAC — so you're not waiting on a quarterly read to know whether the work is landing.",
  },
  {
    question: "Do you replace our in-house marketing team or work alongside them?",
    answer: "Almost always alongside. We're brought in to install the operating system — measurement, channel architecture, lifecycle program — and stand up the early execution. Your team owns it from there. We can stay on as a fractional growth function if you want, but we design the engagement to make ourselves replaceable.",
  },
  {
    question: "What does media spend management look like?",
    answer: "We don't take agency commission on media. You pay platforms directly, we run the buying inside your accounts, and you keep ownership of every asset, audience, and pixel on day one. The incentive is pipeline efficiency, not spend volume.",
  },
  {
    question: "Can you work with our existing martech stack?",
    answer: "Yes. We've shipped lifecycle and demand programs on every major stack — HubSpot, Salesforce, Marketo, Klaviyo, Iterable, Customer.io. We'll tell you fast if your tooling is genuinely the bottleneck, but most of the time it isn't.",
  },
  {
    question: "How do you handle attribution disagreements?",
    answer: "We rebuild the measurement model before we touch the channel mix — multi-touch, MMM-lite, or self-reported attribution depending on your business. The point is to get every team — finance, marketing, sales — looking at the same number, so the conversation moves from 'which dashboard is right' to 'where do we deploy the next dollar.'",
  },
  {
    question: "What if our category is regulated or hard to advertise into?",
    answer: "Half the work we do is in regulated categories — fintech, health, B2B with long sales cycles. We default to owned and earned channels first, lean into intent and ABM where paid is constrained, and structure messaging that gets through compliance without losing teeth.",
  },
];
