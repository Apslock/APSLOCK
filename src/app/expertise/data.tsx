import React from "react";

export type Segment = {
  id: string;
  number: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  visual: React.ReactNode;
};

function BrandVisual() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#F3EAD7] flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-[80%] h-[80%]" aria-hidden="true">
        <g stroke="#5A2A6E" strokeWidth="0.5" fill="none" opacity="0.3">
          {Array.from({ length: 20 }).map((_, i) => (
            <circle key={i} cx="200" cy="200" r={10 + i * 9} />
          ))}
        </g>
        <path
          d="M 130 110 L 130 290 L 180 290 Q 260 290 260 230 Q 260 200 230 195 Q 260 190 260 160 Q 260 110 190 110 Z M 165 140 L 165 185 L 195 185 Q 225 185 225 160 Q 225 140 195 140 Z M 165 215 L 165 260 L 200 260 Q 230 260 230 235 Q 230 215 200 215 Z"
          fill="#1A1625"
        />
        <circle cx="110" cy="105" r="4" fill="#5A2A6E" />
        <circle cx="295" cy="110" r="4" fill="#5A2A6E" />
        <circle cx="295" cy="295" r="4" fill="#5A2A6E" />
        <circle cx="110" cy="295" r="4" fill="#5A2A6E" />
      </svg>
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        <span className="w-3 h-3 rounded-sm bg-[#5A2A6E]" />
        <span className="w-3 h-3 rounded-sm bg-[#F3D65C]" />
        <span className="w-3 h-3 rounded-sm bg-[#1A1625]" />
      </div>
    </div>
  );
}

function GrowthVisual() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#EDE8F5] flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="growthGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5A2A6E" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#5A2A6E" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path d="M 40 340 L 120 300 L 200 260 L 280 180 L 360 60" stroke="#5A2A6E" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 40 340 L 120 300 L 200 260 L 280 180 L 360 60 L 360 360 L 40 360 Z" fill="url(#growthGrad)" />
        <circle cx="40" cy="340" r="6" fill="#5A2A6E" />
        <circle cx="120" cy="300" r="6" fill="#5A2A6E" />
        <circle cx="200" cy="260" r="6" fill="#5A2A6E" />
        <circle cx="280" cy="180" r="6" fill="#5A2A6E" />
        <circle cx="360" cy="60" r="10" fill="#5A2A6E" />
        <circle cx="360" cy="60" r="18" fill="#5A2A6E" opacity="0.2" />
      </svg>
      <div className="absolute top-6 left-6 text-[11px] font-mono tracking-wider text-[#5A2A6E]/70">GROWTH INDEX</div>
      <div className="absolute top-6 right-6 text-[11px] font-mono tracking-wider text-[#5A2A6E]">+284%</div>
    </div>
  );
}

function BuildVisual() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#1A1625] flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-[90%] h-[90%]" aria-hidden="true">
        <g>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 6 }).map((_, col) => {
              const x = 60 + col * 50;
              const y = 60 + row * 50;
              const active = (row + col) % 3 === 0;
              return (
                <rect key={`${row}-${col}`} x={x} y={y} width="36" height="36" rx="4"
                  fill={active ? "#7A4A96" : "transparent"} stroke="#7A4A96" strokeWidth="1"
                  opacity={active ? 0.9 : 0.3} />
              );
            }),
          )}
        </g>
        <circle cx="200" cy="200" r="44" fill="#5A2A6E" />
        <path d="M 180 200 L 200 220 L 230 185" stroke="#FDFDFC" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#6CE97A]" />
        <span className="w-2 h-2 rounded-full bg-[#F3D65C]" />
        <span className="w-2 h-2 rounded-full bg-[#E85A5A]" />
      </div>
      <div className="absolute bottom-6 right-6 text-[11px] font-mono tracking-wider text-[#7A4A96]">{"<built />"}</div>
    </div>
  );
}

function TrustVisual() {
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#F3EAE8] flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-[85%] h-[85%]" aria-hidden="true">
        <g stroke="#5A2A6E" fill="none">
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx="200" cy="200" r={30 + i * 22} strokeWidth="0.8"
              opacity={1 - i * 0.1} strokeDasharray={i > 3 ? "2 4" : "0"} />
          ))}
        </g>
        <circle cx="200" cy="200" r="24" fill="#5A2A6E" />
        <circle cx="200" cy="200" r="10" fill="#FDFDFC" />
        <circle cx="90" cy="140" r="6" fill="#5A2A6E" />
        <circle cx="310" cy="120" r="8" fill="#5A2A6E" />
        <circle cx="340" cy="250" r="5" fill="#5A2A6E" />
        <circle cx="120" cy="310" r="7" fill="#5A2A6E" />
        <circle cx="60" cy="230" r="4" fill="#5A2A6E" />
        <circle cx="250" cy="340" r="6" fill="#5A2A6E" />
      </svg>
      <div className="absolute top-6 left-6 text-[11px] font-mono tracking-wider text-[#5A2A6E]/80">SIGNAL · REACH</div>
    </div>
  );
}

export const segments: Segment[] = [
  {
    id: "brand-foundations",
    number: "01",
    title: "Brand Foundations",
    description:
      "The backbone of every brand that lasts — identity, story, and systems that earn attention before your product ever speaks. We build the foundation your growth runs on, so every campaign, hire, and product decision compounds instead of drifts.",
    tags: ["Brand & Strategy", "Positioning & Messaging", "Experience eComm Design", "Campaign Strategy & Creative", "Design Systems", "Studio Content"],
    href: "/expertise/brand-foundations",
    visual: <BrandVisual />,
  },
  {
    id: "growth-go-to-market",
    number: "02",
    title: "Growth & Go-To-Market",
    description:
      "From first launch to scaled pipeline, we turn market ambition into commercial momentum. Sharp positioning, right-fit channels, and execution that converts — so growth stops depending on heroics and starts working as a system.",
    tags: ["Strategic Workshops", "Email Marketing & Automation", "Intelligence & Reporting", "Paid Media & Demand Generation", "Search, SEM & CRM", "GTM Strategies"],
    href: "/expertise/growth-go-to-market",
    visual: <GrowthVisual />,
  },
  {
    id: "build-innovation",
    number: "03",
    title: "Build & Innovation",
    description:
      "Websites, platforms, and products built to perform under real pressure — fast, scalable, ready for the way your business actually grows. We ship working software, not prototypes that pitch well.",
    tags: ["Websites & eCommerce", "Web & Mobile Apps", "Composable Architectures", "Martech Ecosystems", "AI & Automation", "POCs & Prototypes"],
    href: "/expertise/build-innovation",
    visual: <BuildVisual />,
  },
  {
    id: "trust-influence",
    number: "04",
    title: "Trust & Influence",
    description:
      "The authority layer — PR, thought leadership, and communications that compound over time. Earn trust before the first meeting, keep it after the toughest news cycle.",
    tags: ["Owned & Earned Media", "Analyst & Influencer Relations", "Internal Comms", "Crisis Comms", "Thought Leadership"],
    href: "/expertise/trust-influence",
    visual: <TrustVisual />,
  },
];
