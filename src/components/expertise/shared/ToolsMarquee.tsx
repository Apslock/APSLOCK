"use client";

export interface Tool {
  name: string;
  icon?: string;
}

const DEFAULT_TOOLS: Tool[] = [
  { name: "Next.js" }, { name: "React" }, { name: "Figma" }, { name: "Framer" },
  { name: "TypeScript" }, { name: "Node.js" }, { name: "Vercel" }, { name: "AWS" },
  { name: "HubSpot" }, { name: "Shopify" }, { name: "Segment" }, { name: "OpenAI" },
  { name: "Sanity" }, { name: "Postgres" }, { name: "Stripe" }, { name: "Linear" },
];

interface ToolsMarqueeProps {
  tools?: Tool[];
}

export function ToolsMarquee({ tools = DEFAULT_TOOLS }: ToolsMarqueeProps) {
  const items = [...tools, ...tools, ...tools];

  return (
    <div className="relative overflow-hidden">
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#F3F1ED] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#F3F1ED] to-transparent" />

      <div
        className="flex w-max gap-3 animate-[marquee_30s_linear_infinite]"
        style={{ willChange: "transform" }}
      >
        {items.map((tool, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-full border border-[#E0D9E8] bg-white/60 px-5 py-2.5 flex-shrink-0 backdrop-blur-sm"
          >
            {tool.icon && (
              <span className="text-base leading-none">{tool.icon}</span>
            )}
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#5A2A6E] whitespace-nowrap">
              {tool.name}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
