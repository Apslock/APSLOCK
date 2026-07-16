import type { FAQItem } from "@/components/expertise/shared/FAQ";
import type { Tool } from "@/components/expertise/shared/ToolsMarquee";

export type WorkArea = { title: string; description: string };

export const workAreas: WorkArea[] = [
  {
    title: "Owned & Earned Media",
    description:
      "Content strategy, editorial programming, and PR that build a body of work the brand owns — reach that compounds without a media budget behind every post.",
  },
  {
    title: "Thought Leadership",
    description:
      "Executive positioning, ghostwriting, and speaking programmes that put your people's names on the ideas your category is already debating.",
  },
  {
    title: "Analyst & Influencer Relations",
    description:
      "The relationships with analysts, creators, and domain voices that shape how buyers think before they open a brief — built systematically, not episodically.",
  },
  {
    title: "Crisis Communications",
    description:
      "Preparation before the bad news, response architecture when it lands — so the story your brand tells in the worst week holds up as well as the best week.",
  },
  {
    title: "Internal Communications",
    description:
      "The alignment layer between leadership and the organisation — message architecture, all-hands structure, and change communications that keep the signal consistent under pressure.",
  },
  {
    title: "Reputation Strategy",
    description:
      "Long-arc reputation management — monitoring, response protocol, and narrative positioning that protects brand equity while the business is moving fast.",
  },
];

export const trustTools: Tool[] = [
  { name: "Meltwater" },
  { name: "Cision" },
  { name: "Brandwatch" },
  { name: "Notion" },
  { name: "Sprout Social" },
  { name: "Beehiiv" },
  { name: "Substack" },
  { name: "LinkedIn" },
  { name: "Loom" },
  { name: "Figma" },
  { name: "Canva" },
  { name: "Prezly" },
];

export const faqs: FAQItem[] = [
  {
    question: "What's the difference between PR and what you call Trust & Influence?",
    answer:
      "Traditional PR is reactive and press-release-shaped. Trust & Influence is the broader system: owned content, executive positioning, analyst relationships, and crisis preparation — all designed to compound over time rather than spike around a news moment. We do include media relations, but it's one component, not the whole programme.",
  },
  {
    question: "How do you measure trust and influence — it sounds hard to quantify.",
    answer:
      "We set a scorecard at engagement start: share of voice in target publications, analyst mention rate, inbound media requests, executive LinkedIn reach, and branded search volume. None of these are perfect proxies, but together they give you a credible leading indicator for the thing that matters — deals closing faster because buyers already trust the brand.",
  },
  {
    question: "Do you work with executives directly on thought leadership?",
    answer:
      "Yes. Most thought leadership programmes pair us directly with the executive — interviews, editing, and channel strategy. The voice is always theirs; we provide the structure, the publishing cadence, and the editorial quality control that makes it sustainable beyond the first quarter.",
  },
  {
    question: "How do you handle crisis communications?",
    answer:
      "We separate preparation from response. In a calm period, we run a scenario audit — the ten things most likely to go wrong — and build a response architecture for each. When something lands, we can move inside the hour because the decision tree already exists. We don't recommend figuring out process when you're already in the story.",
  },
  {
    question: "Can you work with our existing PR agency?",
    answer:
      "Absolutely. We're often brought in alongside an incumbent agency — either to add the strategy and content layer the agency doesn't cover, or to run a specific workstream like thought leadership or analyst relations. We're not built around exclusivity.",
  },
  {
    question: "How long before trust work produces visible results?",
    answer:
      "Honest answer: six to twelve months for the compounding effects to become undeniable. Thought leadership and SEO-adjacent content start showing signal at ninety days. Analyst relationships and share of voice move on a six-month horizon. Crisis preparation produces results the day you need it — you just can't predict when that is.",
  },
];
