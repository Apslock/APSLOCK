"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import type { Capability } from "@/lib/data"
import FadeIn from "@/components/shared/FadeIn"

interface AnimatedCapabilitiesProps {
  items: Capability[]
}

const capabilityImages = [
  "/images/capabilities/brand-identity.webp",
  "/images/capabilities/growth-marketing.webp",
  "/images/capabilities/digital-platforms.webp",
  "/images/capabilities/search-visibility.webp",
]


function pad(n: number) {
  return String(n + 1)
}

// ─────────────────────────────────────────────────────────
// STAGE TRANSITION CONFIG
// Current card: y 0% → -100% (exits UP)
// Next card:    y 100% → 0%  (enters from BOTTOM)
// Both animate simultaneously via AnimatePresence mode="sync"
// ─────────────────────────────────────────────────────────
const CARD_H = 460
const STAGE_TRANSITION = {
  duration: 0.85,
  ease: [0.4, 0, 0.2, 1],
} as const

const cardVariants = {
  initial: (direction: number) => ({
    y: direction === 1 ? "100%" : "-100%",
  }),
  animate: {
    y: "0%",
  },
  exit: (direction: number) => ({
    y: direction === 1 ? "-100%" : "100%",
  }),
}

const imageVariants = {
  initial: (direction: number) => ({
    y: direction === 1 ? "-100%" : "100%",
  }),
  animate: {
    y: "0%",
  },
  exit: (direction: number) => ({
    y: direction === 1 ? "100%" : "-100%",
  }),
}

// ─────────────────────────────────────────────────────────

export default function AnimatedCapabilities({ items }: AnimatedCapabilitiesProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [direction, setDirection] = React.useState(1)
  const [mobileOpenIndex, setMobileOpenIndex] = React.useState<number | null>(0)
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  function handleSelect(index: number) {
    if (index === activeIndex) return
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  function onHover(index: number) {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      handleSelect(index)
    }, 120) // 120ms debounce prevents rapid-fire glitches on fast sweeping
  }

  function onClick(index: number) {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    handleSelect(index)
  }

  return (
    <section
      className="py-16 lg:py-20 relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* ── Header ────────────────────────────────────────── */}
      <div className="px-6 md:px-10 lg:px-16 mb-12 lg:mb-16">
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-section-heading text-text max-w-xl">
              Building Blocks of Digital Growth
            </h2>
            <p className="text-base text-text-muted leading-relaxed max-w-sm lg:text-right">
              The core capabilities we bring together to design, build,
              and scale high‑performing digital experiences.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* ── Mobile Accordion ──────────────────────────────── */}
      <div className="px-6 md:px-10 flex flex-col gap-4 lg:hidden">
        {items.map((item, index) => {
          const isOpen = mobileOpenIndex === index;
          return (
            <FadeIn key={item.title} delay={index * 0.05}>
              <div className={`border-b border-border/40 pb-4 transition-colors duration-300 ${isOpen ? 'border-text/30' : ''}`}>
                <button 
                  onClick={() => setMobileOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left py-2"
                >
                  <div className="flex gap-4 items-center">
                    <span className="font-mono text-[0.7rem] text-border/60">
                      {pad(index)}.
                    </span>
                    <span className={`font-display font-bold text-base uppercase tracking-tight transition-colors duration-300 ${isOpen ? 'text-text' : 'text-text/70'}`}>
                      {item.title}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-text-muted transition-transform duration-500 ${isOpen ? 'rotate-180 text-text' : ''}`} 
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pl-8 pb-2">
                        <p className="text-sm leading-relaxed text-text-muted mb-5 max-w-sm">
                          {item.description}
                        </p>
                        <Link href={item.href} className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-widest text-text hover:opacity-70 transition-opacity">
                          Explore Capability <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          );
        })}
      </div>

      {/* ── Desktop: 3 columns, right bleeds to edge ──────── */}
      {/*
        Only left padding — no right padding — image bleeds to viewport.
        Columns: 28% list | 35% stage viewport | 1fr image
      */}
      <div
        className="hidden lg:grid px-6 md:px-10 lg:px-16"
        style={{
          gridTemplateColumns: "28% 35% 1fr",
          columnGap: "2.5rem",
          alignItems: "start",
        }}
      >

        {/* ══════════════════════════════════════════════════
            COLUMN 1 — Clickable service list
            Dark card on active, plain text on inactive.
            No dividers. Weight contrast: number light, label bold.
        ══════════════════════════════════════════════════ */}
        <div
          className="flex flex-col"
          style={{ height: "100%" }}
        >
          {items.map((item, index) => {
            const isActive = activeIndex === index
            return (
              <button
                key={item.title}
                type="button"
                className="w-full text-left focus:outline-none flex-1 flex flex-col justify-center"
                style={{ transition: "all 0.2s ease" }}
                onMouseEnter={() => onHover(index)}
                onClick={() => onClick(index)}
              >
                {isActive ? (
                  /* Active — dark lifted tile */
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      background: "var(--text)",
                      borderRadius: 12,
                      boxShadow:
                        "0 6px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.07)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,0.4)",
                        fontWeight: 300,
                        flexShrink: 0,
                        width: "1.4rem",
                      }}
                    >
                      {pad(index)}.
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "-0.01em",
                        color: "#ffffff",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                ) : (
                  /* Inactive — plain row */
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem 1rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.9rem",
                        color: "var(--border)",
                        fontWeight: 300,
                        flexShrink: 0,
                        width: "1.4rem",
                      }}
                    >
                      {pad(index)}.
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.15rem",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "-0.01em",
                        color: "var(--text-muted)",
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* ══════════════════════════════════════════════════
            COLUMN 2 — Stage viewport (CENTER)

            Rules:
            - Fixed height, overflow hidden
            - Cards absolutely positioned inside
            - ONLY 2 cards ever in DOM during transition
              (AnimatePresence mode="sync"):
                • Current exits:  y 0% → -100%
                • Next enters:    y 100% → 0%
            - At rest: exactly 1 card in DOM
        ══════════════════════════════════════════════════ */}
        <div
          style={{
            position: "relative",
            height: CARD_H,
            overflow: "hidden",
            /* The static viewport has NO border or background now */
          }}
        >
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={STAGE_TRANSITION}
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 32,
                /* The moving card ITSELF has the border and background */
                border: "1px solid var(--border)",
                borderRadius: 24,
                background: "var(--surface)",
              }}
            >
              {/* Title & Description — floats at top */}
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                    color: "var(--text)",
                    marginBottom: "1rem",
                  }}
                >
                  {items[activeIndex].title}
                </h3>
                <p
                  style={{
                    fontSize: "1.125rem",
                    lineHeight: 1.75,
                    color: "var(--text-muted)",
                    maxWidth: 400,
                  }}
                >
                  {items[activeIndex].description}
                </p>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ══════════════════════════════════════════════════
            COLUMN 3 — Image stage viewport
            The moving card itself has the rounded corners.
        ══════════════════════════════════════════════════ */}
        <div
          style={{
            position: "relative",
            height: CARD_H,
            overflow: "hidden",
            /* NO border radius here — the moving card has it */
          }}
        >
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 24,
                overflow: "hidden",
              }}
            >
              <Link href={items[activeIndex].href} className="group relative block w-full h-full">
                <Image
                  src={capabilityImages[activeIndex % capabilityImages.length]}
                  alt={items[activeIndex].title}
                  fill
                  sizes="(max-width: 1280px) 35vw, 500px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Bottom gradient overlay — moves WITH the image */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Subtle dark overlay on hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Top-Right Glass Pill */}
                <div className="absolute top-6 right-6 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 ease-out">
                  <div className="flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-1.5 shadow-2xl">
                    <span className="px-4 text-white font-display text-[0.75rem] font-bold uppercase tracking-[0.15em]">
                      View More
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white text-[#1A1625] flex items-center justify-center shadow-sm transform group-hover:rotate-[15deg] transition-transform duration-500">
                      <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
