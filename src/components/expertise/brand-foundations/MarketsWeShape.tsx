"use client";

import { Reveal } from "@/components/expertise/shared/Reveal";

interface MarketItem {
  title: string;
  items: string[];
}

interface MarketsWeShapeProps {
  markets: MarketItem[];
}

export function MarketsWeShape({ markets }: MarketsWeShapeProps) {
  return (
    <section className="w-full bg-transparent text-[#1A1625] py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[0.75fr_1.35fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <Reveal delay={0} duration={800} distance={20}>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#1A1625]/60">
                Capability Overview
              </p>
            </Reveal>

            <Reveal delay={100} duration={1000} distance={0}>
              <h2 className="mt-5 max-w-lg font-editorial font-light text-[clamp(2.75rem,5vw,3.75rem)] tracking-[-0.04em] leading-[0.92] text-[#1A1625]">
                Markets We Shape
              </h2>
            </Reveal>

            <Reveal delay={200} duration={800} distance={24}>
              <p className="mt-6 max-w-md text-base leading-[1.7] text-[#6B5A7A]">
                We work across categories where clarity, consistency, and elevated digital
                experiences make a meaningful difference.
              </p>
            </Reveal>

            <Reveal delay={300} duration={800} distance={16}>
              <div className="mt-10 flex flex-wrap gap-3">
                {["Strategy", "Design", "Content"].map((tag) => (
                  <span key={tag} className="rounded-full border border-[#E0D9E8] bg-white/50 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B5A7A]">
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={400} duration={800} distance={20}>
              <div className="mt-12 border-t border-[#E0D9E8] pt-6">
                <p className="text-[15px] leading-[1.8] text-[#6B5A7A] max-w-sm">
                  Built for brands that need thoughtful direction, refined systems, and a
                  more considered digital presence.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {markets.map((item, index) => (
              <Reveal key={item.title} delay={index * 80} duration={1000} distance={40}>
                <article className="group relative h-full min-h-[400px] overflow-hidden rounded-[32px] border border-[#E0D9E8] bg-white/40 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] hover:bg-[#0D0D0D] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
                  {/* Giant Typographic Watermark */}
                  <div className="absolute -right-4 -bottom-10 pointer-events-none select-none overflow-hidden">
                    <span className="font-display text-[12rem] font-bold leading-none text-[#1A1625] opacity-20 transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:text-white/[0.02] group-hover:-translate-y-8 group-hover:scale-110 block">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </span>
                  </div>

                  <div className="relative z-10 flex h-full flex-col p-10 sm:p-12">
                    <div className="flex items-center justify-between">
                      <div className="h-[2px] w-8 bg-[#1A1625] transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:w-16 group-hover:bg-white/30" />
                    </div>

                    <h3
                      className="font-display uppercase mt-12 transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:text-white"
                      style={{
                        fontSize: "clamp(18px, 2.5vw, 24px)",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        lineHeight: 1.1,
                        color: "#0D0D0D",
                        margin: "48px 0 0 0",
                        padding: 0,
                      }}
                    >
                      {item.title}
                    </h3>

                    <div className="mt-auto pt-12">
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8A8195] mb-6 opacity-0 translate-y-2 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0">
                        Focus Areas
                      </p>
                      <ul className="space-y-4">
                        {item.items.map((sub, i) => (
                          <li key={sub} className="overflow-hidden">
                            <span
                              className="block text-[14px] sm:text-[16px] font-medium leading-none text-[#6B5A7A] transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] translate-y-full group-hover:translate-y-0 group-hover:text-white/70"
                              style={{ transitionDelay: `${i * 50 + 200}ms` }}
                            >
                              {sub}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Top Edge Reveal */}
                  <div className="absolute top-0 left-0 h-1.5 w-0 bg-[#1A1625] transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:w-full" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
