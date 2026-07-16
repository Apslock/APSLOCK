import type { FAQItem } from "@/components/expertise/shared/FAQ";
import type { Tool } from "@/components/expertise/shared/ToolsMarquee";

// ── Work Areas (3×2 hover grid) ──────────────────────────────────────────────

export interface WorkArea {
  title: string;
  description: string;
}

export const workAreas: WorkArea[] = [
  {
    title: "Brand Strategy",
    description:
      "Positioning frameworks, competitive audits, and the narrative architecture that ties everything together.",
  },
  {
    title: "Visual Identity",
    description:
      "Logo systems, color, typography, and the visual language that travels consistently across every surface.",
  },
  {
    title: "Verbal Identity",
    description:
      "Naming, tone of voice, messaging hierarchies, and the copy standards that make communication unmistakably yours.",
  },
  {
    title: "Brand Guidelines",
    description:
      "Living documents that let teams move fast without breaking the brand — built for real-world use.",
  },
  {
    title: "Brand Architecture",
    description:
      "Parent brand, sub-brand, and product portfolio structures that reduce confusion and amplify equity.",
  },
  {
    title: "Launch & Rollout",
    description:
      "From internal alignment to public debut — the strategy, assets, and momentum to make a brand land.",
  },
];

// ── Tools Marquee ─────────────────────────────────────────────────────────────

export const brandTools: Tool[] = [
  { name: "Figma",          icon: "🎨" },
  { name: "Adobe CC",       icon: "✦" },
  { name: "Notion",         icon: "📋" },
  { name: "Framer",         icon: "⚡" },
  { name: "Webflow",        icon: "🌐" },
  { name: "Lottie",         icon: "🎞" },
  { name: "Miro",           icon: "🗂" },
  { name: "Spline",         icon: "🧊" },
  { name: "Midjourney",     icon: "🖼" },
  { name: "Fontshare",      icon: "Aa" },
  { name: "Coolors",        icon: "🎭" },
  { name: "Linear",         icon: "◆" },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────

export const faqs: FAQItem[] = [
  {
    question: "How long does a brand foundations engagement typically take?",
    answer:
      "Most brand foundations projects run 6–12 weeks depending on scope. Strategy and audit phases take 2–3 weeks, identity development 3–5 weeks, and guidelines + handoff 1–2 weeks. We move efficiently without cutting corners on the thinking.",
  },
  {
    question: "Do you work with early-stage startups or only established brands?",
    answer:
      "Both. We have frameworks for startups that need to move fast and establish a foundation before growth, and for established brands that need to realign, refresh, or extend an existing identity. The process adapts; the rigour doesn't.",
  },
  {
    question: "What's included in brand guidelines?",
    answer:
      "Logo usage rules, color system, typography hierarchy, iconography, photography and imagery direction, tone of voice examples, UI components, and dos/don'ts. We deliver guidelines that teams actually use — not PDFs that collect dust.",
  },
  {
    question: "Can you redesign a brand without losing existing equity?",
    answer:
      "Yes, and it's one of the more nuanced challenges we tackle. We audit what equity exists, what's worth keeping, and what needs to change — then build a transition strategy that preserves recognition while moving the brand forward.",
  },
  {
    question: "Do you offer brand strategy without design?",
    answer:
      "Absolutely. Strategy-only engagements — positioning, messaging architecture, competitive audits — are a core part of our practice. Many clients start with strategy before committing to design work.",
  },
];
