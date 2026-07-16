"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import FadeIn from "@/components/shared/FadeIn";

const items = [
  {
    title: "Origin",
    body: "APSLOCK was founded on a single conviction — that strategy, design, and engineering belong under one roof. Not handed off across teams, not managed through layers. Built together, from the first brief to the final delivery.",
    side: "left",
  },
  {
    title: "Conviction",
    body: "We do not operate at arm's length. Every engagement is a direct partnership — embedded in your process, accountable to your outcomes. The work carries our name, and we treat it accordingly.",
    side: "right",
  },
  {
    title: "Approach",
    body: "We listen before we build. Every project begins with mapping what exists, questioning what is assumed, and identifying what actually needs to change. Clarity first — then momentum.",
    side: "left",
  },
  {
    title: "Today",
    body: "A focused, senior-led studio based in Atlanta. Working with ambitious brands on strategy, product, and growth. No juniors on the work. No diluted output. Just craft, applied with intention.",
    side: "right",
  },
];

// Scroll-progress when each block should reveal (roughly when brush passes it)
const triggers = [0.06, 0.36, 0.64, 0.88];

// Vertical positions of content blocks (as % of section height)
// Left items:  x 0–38%   Right items: x 58–100%
// Path weaves on the OPPOSITE side so it never crosses text
const topPositions = ["5%", "36%", "62%", "89%"];

export default function ValuesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 });
  const pathLength = useTransform(smoothProgress, [0, 1], [0, 1]);

  // Per-item: reveal slightly after brush passes
  const reveals = triggers.map((start) => ({
    opacity: useTransform(smoothProgress, [start, start + 0.14], [0, 1]),
    y:       useTransform(smoothProgress, [start, start + 0.14], [20, 0]),
    blur:    useTransform(smoothProgress, [start, start + 0.14], [6, 0]),
  }));

  // Path flows through OPPOSITE side from each content block:
  // Origin (left)     → path stays right  (x ~750)
  // Conviction (right)→ path stays left   (x ~250)
  // Approach (left)   → path stays right  (x ~750)
  // Today (right)     → path stays left   (x ~250)
  // viewBox: 0 0 1000 1000
  const brushPath =
    "M 750 -20 " +
    "C 750 160, 250 240, 250 400 " +   // sweeps left (Conviction right side clear)
    "C 250 600, 750 560, 750 720 " +   // sweeps right (Approach left side clear)
    "C 750 880, 250 840, 250 1020";    // sweeps left — cleanly clears Today text at ~89% (890px)


  return (
    <section
      ref={containerRef}
      className="py-16 md:py-24 relative overflow-hidden bg-transparent"
    >
      <div className="container-wide">
        <h2 className="text-[clamp(3.5rem,7vw,6rem)] font-editorial font-light text-text mb-16 uppercase tracking-tight">
          Who We Are
        </h2>

        {/* ── DESKTOP ── */}
        <div className="hidden md:block">
          <div className="relative" style={{ minHeight: 960 }}>

            {/* ── Paintbrush SVG ── full width, no dots, no ghost trail ── */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1000 1000"
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: "visible", zIndex: 0 }}
              aria-hidden="true"
            >
              <defs>
                <filter id="brush-texture" x="-10%" y="-5%" width="120%" height="110%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.018 0.065"
                    numOctaves="4"
                    seed="12"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="12"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>

              {/* Thick brush body — paints from nothing as you scroll */}
              <motion.path
                d={brushPath}
                fill="none"
                stroke="currentColor"
                strokeWidth="28"
                strokeOpacity="0.10"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#brush-texture)"
                initial={{ pathLength: 0 }}
                style={{ pathLength }}
              />

              {/* Sharp ink edge — draws on top, same scroll drive */}
              <motion.path
                d={brushPath}
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeOpacity="0.55"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                style={{ pathLength }}
              />
            </svg>

            {/* ── Content blocks at far edges — never touching path ── */}
            {items.map((item, i) => (
              <div
                key={item.title}
                className="absolute"
                style={{
                  // Left blocks: 0–38% width | Right blocks: 58–100%
                  left:   item.side === "left"  ? "0%"   : "58%",
                  right:  item.side === "right" ? "0%"   : "58%",
                  top:    topPositions[i],
                  zIndex: 10,
                }}
              >
                <motion.div
                  style={{
                    opacity: reveals[i].opacity,
                    y:       reveals[i].y,
                    filter:  useTransform(reveals[i].blur, (v) => `blur(${v}px)`),
                  }}
                >
                  <h3 className="text-2xl md:text-3xl font-semibold text-text mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p
                    className="text-text-muted leading-relaxed text-base"
                    style={{ maxWidth: 340 }}
                  >
                    {item.body}
                  </p>
                </motion.div>
              </div>
            ))}

          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="grid grid-cols-1 gap-12 md:hidden">
          {items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <h3 className="text-2xl font-semibold text-text tracking-tight mb-3">
                {item.title}
              </h3>
              <p className="text-text-muted leading-relaxed">{item.body}</p>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  );
}
