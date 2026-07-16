"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Reveal } from "@/components/expertise/shared/Reveal";
import { FAQ } from "@/components/expertise/shared/FAQ";
import { ToolsMarquee } from "@/components/expertise/shared/ToolsMarquee";
import { MarketsWeShape } from "@/components/expertise/brand-foundations/MarketsWeShape";
import CTA from "@/components/CTA";
import GrainBlobs from "@/components/shared/GrainBlobs";
import { workAreas, brandTools, faqs } from "./data";
import { motion, useSpring, useScroll, useMotionValue } from "framer-motion";

const brandMarkets = [
  {
    title: "Growth & Consumer Brands",
    items: ["Retail & eCommerce", "Food & Beverage", "Health & Wellness", "Apparel & Fashion", "Home & Lifestyle", "Beauty & Personal Care"],
  },
  {
    title: "Challenger & B2B Brands",
    items: ["SaaS & Software Companies", "Fintech & Financial Services", "Professional Services & Consulting", "Healthcare & MedTech", "Logistics & Operations", "Agencies & Creative Studios"],
  },
  {
    title: "Commerce & Retail Brands",
    items: ["Direct-to-Consumer Brands", "Specialty & Luxury Retail", "Restaurant & Food Commerce", "Subscription & Membership Brands", "Beauty & Wellness Retail", "Fashion & Apparel"],
  },
  {
    title: "Culture & Campaign Brands",
    items: ["eCommerce & Retail", "Hospitality & Travel", "Real Estate & Property", "Automotive & Mobility", "Entertainment & Events", "Local & Regional Businesses"],
  },
  {
    title: "Product & Platform Companies",
    items: ["SaaS & Web Applications", "Fintech & Banking Platforms", "Healthcare Portals & Apps", "Marketplace & Aggregator Platforms", "Enterprise & Internal Tools", "EdTech & Learning Platforms"],
  },
  {
    title: "Lifestyle & Content Brands",
    items: ["eCommerce & Product Brands", "Restaurants & Food Businesses", "Fitness & Wellness Brands", "Real Estate & Hospitality", "Fashion & Apparel", "Local & Service Businesses"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

import { ExpertiseHeroCard } from "@/components/expertise/shared/HeroCards";


export default function BrandFoundationsPage() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { damping: 50, stiffness: 120, mass: 0.6 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Config states initialized to original design values, overriden on mount by user's dragged localStorage config
  const [headline, setHeadline] = useState("The work that makes everything after easier.");
  const [headlineSize, setHeadlineSize] = useState(4.8); // in vw
  const [headlineFont, setHeadlineFont] = useState("font-script");
  const [headlineColor, setHeadlineColor] = useState("#0D0D0D");
  const [headlineWidth, setHeadlineWidth] = useState(720); // in px
  
  const [eyebrow, setEyebrow] = useState("Brand Foundations");
  const [eyebrowSize, setEyebrowSize] = useState(3.5); // in rem
  const [eyebrowFont, setEyebrowFont] = useState("font-display");
  const [eyebrowColor, setEyebrowColor] = useState("#0D0D0D");

  const [description, setDescription] = useState("Positioning, identity, voice, and the systems that let the rest of the business move.");
  const [descriptionSize, setDescriptionSize] = useState(15); // in px
  const [descriptionColor, setDescriptionColor] = useState("#1A1625");
  const [descWidth, setDescWidth] = useState(380); // in px

  // Blob settings
  const [blobWidth, setBlobWidth] = useState(68); // in vw
  const [blobHeight, setBlobHeight] = useState(90); // in vh
  const [blobTop, setBlobTop] = useState(-18); // in %
  const [blobRight, setBlobRight] = useState(-16); // in %
  const [blobBlur, setBlobBlur] = useState(60); // in px
  const [blobOpacity, setBlobOpacity] = useState(0.72);
  const [blobColor, setBlobColor] = useState("sage"); // sage, amber, slate, blush, custom
  const [customBlobColor, setCustomBlobColor] = useState("#28734B");

  // Draggable Coordinates persistence
  const [backOffset, setBackOffset] = useState({ x: 0, y: 0 });
  const [eyebrowOffset, setEyebrowOffset] = useState({ x: 0, y: 0 });
  const [headlineOffset, setHeadlineOffset] = useState({ x: 0, y: 0 });
  const [descOffset, setDescOffset] = useState({ x: 0, y: 0 });
  const [blobOffset, setBlobOffset] = useState({ x: 0, y: 0 });

  // Load custom designer state configuration from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const getStored = <T,>(key: string, fallback: T): T => {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : fallback;
        };

        setHeadline(localStorage.getItem("headline") || "The work that makes everything after easier.");
        setHeadlineSize(getStored("headlineSize", 4.8));
        setHeadlineFont(localStorage.getItem("headlineFont") || "font-script");
        setHeadlineColor(localStorage.getItem("headlineColor") || "#0D0D0D");
        setHeadlineWidth(getStored("headlineWidth", 720));

        setEyebrow(localStorage.getItem("eyebrow") || "Brand Foundations");
        setEyebrowSize(getStored("eyebrowSize", 3.5));
        setEyebrowFont(localStorage.getItem("eyebrowFont") || "font-display");
        setEyebrowColor(localStorage.getItem("eyebrowColor") || "#0D0D0D");

        setDescription(localStorage.getItem("description") || "Positioning, identity, voice, and the systems that let the rest of the business move.");
        setDescriptionSize(getStored("descriptionSize", 15));
        setDescriptionColor(localStorage.getItem("descriptionColor") || "#1A1625");
        setDescWidth(getStored("descWidth", 380));

        setBlobWidth(getStored("blobWidth", 68));
        setBlobHeight(getStored("blobHeight", 90));
        setBlobTop(getStored("blobTop", -18));
        setBlobRight(getStored("blobRight", -16));
        setBlobBlur(getStored("blobBlur", 60));
        setBlobOpacity(getStored("blobOpacity", 0.72));
        setBlobColor(localStorage.getItem("blobColor") || "sage");
        setCustomBlobColor(localStorage.getItem("customBlobColor") || "#28734B");

        setBackOffset(getStored("backOffset", { x: 0, y: 0 }));
        setEyebrowOffset(getStored("eyebrowOffset", { x: 0, y: 0 }));
        setHeadlineOffset(getStored("headlineOffset", { x: 0, y: 0 }));
        setDescOffset(getStored("descOffset", { x: 0, y: 0 }));
        setBlobOffset(getStored("blobOffset", { x: 0, y: 0 }));
      } catch (e) {
        console.warn("Could not load designer state from localStorage", e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Computed Blob Background
  const getBlobBackground = () => {
    if (blobColor === "sage") {
      return `
        radial-gradient(ellipse at 91% 4%,  rgba(40,115,75,${blobOpacity}) 0%, transparent 34%),
        radial-gradient(ellipse at 75% 24%, rgba(75,140,100,${blobOpacity * 0.78}) 4%, transparent 50%),
        radial-gradient(ellipse at 55% 55%, rgba(120,175,140,${blobOpacity * 0.49}) 10%, transparent 72%)
      `;
    }
    if (blobColor === "amber") {
      return `
        radial-gradient(ellipse at 91% 4%,  rgba(184,92,56,${blobOpacity}) 0%, transparent 34%),
        radial-gradient(ellipse at 75% 24%, rgba(210,130,80,${blobOpacity * 0.78}) 4%, transparent 50%),
        radial-gradient(ellipse at 55% 55%, rgba(240,180,130,${blobOpacity * 0.49}) 10%, transparent 72%)
      `;
    }
    if (blobColor === "slate") {
      return `
        radial-gradient(ellipse at 91% 4%,  rgba(42,157,143,${blobOpacity}) 0%, transparent 34%),
        radial-gradient(ellipse at 75% 24%, rgba(70,180,170,${blobOpacity * 0.78}) 4%, transparent 50%),
        radial-gradient(ellipse at 55% 55%, rgba(130,210,200,${blobOpacity * 0.49}) 10%, transparent 72%)
      `;
    }
    if (blobColor === "blush") {
      return `
        radial-gradient(ellipse at 91% 4%,  rgba(134,32,32,${blobOpacity}) 0%, transparent 34%),
        radial-gradient(ellipse at 75% 24%, rgba(170,70,70,${blobOpacity * 0.78}) 4%, transparent 50%),
        radial-gradient(ellipse at 55% 55%, rgba(220,120,120,${blobOpacity * 0.49}) 10%, transparent 72%)
      `;
    }
    return `
      radial-gradient(ellipse at 91% 4%, ${customBlobColor}e6 0%, transparent 34%),
      radial-gradient(ellipse at 75% 24%, ${customBlobColor}99 4%, transparent 50%),
      radial-gradient(ellipse at 55% 55%, ${customBlobColor}4d 10%, transparent 72%)
    `;
  };

  return (
    <main className="flex-1 bg-[#F3F1ED] expertise-page relative">
      <GrainBlobs variant="sage" intensity={0.12} animate={true} className="fixed inset-0 z-0 pointer-events-none" />

      {/* ── CANVAS LAYOUT (READING CUSTOM COORDINATES) ────────────────── */}
      <section className="relative min-h-[92svh] flex overflow-hidden w-full">
        
        {/* Blob — floating and scaled based on user configuration */}
        <motion.div
          className="absolute z-0 pointer-events-none"
          style={{
            top: `${blobTop}%`,
            right: `${blobRight}%`,
            width: `${blobWidth}vw`,
            height: `${blobHeight}vh`,
            maxWidth: 1100,
            background: getBlobBackground(),
            filter: `blur(${blobBlur}px)`,
            transformOrigin: "top right",
            x: blobOffset.x,
            y: blobOffset.y
          }}
          animate={{ scale: [1, 1.05, 0.97, 1.05, 1], rotate: [0, 1.5, -1.5, 1, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Bottom soft gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F3F1ED] to-transparent pointer-events-none z-10" />

        {/* ── TWO-COLUMN HERO COMPOSITION ────────────────── */}
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-16 w-full px-8 sm:px-14 lg:px-20 xl:px-28 pt-8 sm:pt-12 pb-20 items-center">
          
          {/* Left Column: Eyebrow label, main title, cursive subheadline, supporting paragraph, CTA buttons */}
          <div className="flex flex-col items-start max-w-xl">
            
            {/* Top Back Link (Eyebrow Label) */}
            <motion.div 
              className="z-30 relative w-fit mb-6"
              style={{ x: backOffset.x, y: backOffset.y }}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
            >
              <Link href="/expertise" className="group inline-flex items-center gap-3">
                <span className="w-7 h-px bg-[#1A1625] inline-block transition-all duration-300 group-hover:w-4 group-hover:opacity-40" />
                <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-[#1A1625]/40 group-hover:text-[#1A1625] transition-colors duration-200">
                  Expertise
                </span>
              </Link>
            </motion.div>

            {/* Main Title (eyebrow configuration) */}
            <motion.div 
              className="relative w-fit mb-4"
              style={{ x: eyebrowOffset.x, y: eyebrowOffset.y }}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.1}
            >
              <span
                className={`block ${eyebrowFont} font-bold uppercase tracking-[0.08em]`}
                style={{ 
                  fontSize: `${eyebrowSize}rem`,
                  color: eyebrowColor
                }}
              >
                {eyebrow}
              </span>
            </motion.div>

            {/* Cursive Subheadline (headline configuration) */}
            <motion.div 
              className="relative w-fit mb-6"
              style={{ width: `${headlineWidth}px`, maxWidth: "100%", x: headlineOffset.x, y: headlineOffset.y }}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.2}
            >
              <h1
                className={`block ${headlineFont} font-bold leading-[1.1] pr-4`}
                style={{ 
                  fontSize: `clamp(2.2rem, ${headlineSize}vw, ${headlineSize * 1.5}rem)`,
                  color: headlineColor,
                }}
              >
                {headline}
              </h1>
            </motion.div>

            {/* Supporting Paragraph */}
            <motion.div 
              className="relative w-fit mb-10"
              style={{ width: `${descWidth}px`, maxWidth: "100%", x: descOffset.x, y: descOffset.y }}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.3}
            >
              <p
                className="pr-4 leading-[1.85]"
                style={{ 
                  fontSize: `${descriptionSize}px`,
                  color: descriptionColor,
                  opacity: 0.65
                }}
              >
                {description}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.4}
              className="flex flex-col sm:flex-row items-center gap-4 z-20"
            >
              <Link href="/contact">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="group px-8 py-4 rounded-full bg-[#1A1625] text-white text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-[#1A1625]/90 hover:shadow-lg cursor-pointer"
                >
                  Start a Project
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </motion.div>
              </Link>
              <Link href="/approach">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="px-8 py-4 rounded-full border border-[#1A1625]/10 bg-transparent text-[#1A1625] text-sm font-medium transition-all hover:bg-[#1A1625]/5 cursor-pointer text-center"
                >
                  Our Approach
                </motion.div>
              </Link>
            </motion.div>

          </div>

          {/* Right Column: Orbital composition and rotated 2x2 cards */}
          <div className="relative min-h-[760px] lg:min-h-[820px] w-full flex items-center justify-center">
            
            {/* Centered thin circular outline */}
            <div className="pointer-events-none absolute h-[280px] w-[280px] rounded-full border border-black/[0.06] md:h-[640px] md:w-[640px]" />

            {/* Larger dashed rotating circle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute h-[340px] w-[340px] rounded-full border border-dashed border-black/[0.05] md:h-[780px] md:w-[780px]"
            />

            {/* Smaller dashed rotating circle */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute h-[220px] w-[220px] rounded-full border border-dashed border-black/[0.04] md:h-[520px] md:w-[520px]"
            />

            {/* Concentric rings fade out overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.42),transparent_60%)]" />

            {/* 2x2 grid of four cards */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[680px] px-4 md:px-0">
              
              {/* Card 1 */}
              <div className="transform-none md:-translate-y-12">
                <ExpertiseHeroCard scrollY={smoothY}
                  index="01"
                  eyebrow="STRATEGY"
                  title="Positioning"
                  body="Defining where your brand wins."
                  icon="target"
                  className="h-[260px] md:h-[292px] w-full"
                  rotate={0.6}
                />
              </div>

              {/* Card 2 */}
              <div className="transform-none">
                <ExpertiseHeroCard scrollY={smoothY}
                  index="02"
                  eyebrow="IDENTITY"
                  title="Visual Systems"
                  body="The structure behind recognition."
                  icon="pen"
                  className="h-[260px] md:h-[316px] w-full"
                  rotate={2.4}
                />
              </div>

              {/* Card 3 */}
              <div className="transform-none md:-translate-y-18">
                <ExpertiseHeroCard scrollY={smoothY}
                  index="03"
                  eyebrow="VOICE"
                  title="Messaging"
                  body="Language that creates clarity."
                  icon="chat"
                  className="h-[260px] md:h-[286px] w-full"
                  rotate={-1.8}
                />
              </div>

              {/* Card 4 */}
              <div className="transform-none md:translate-y-4">
                <ExpertiseHeroCard scrollY={smoothY}
                  index="04"
                  eyebrow="EXPERIENCE"
                  title="Brand Direction"
                  body="Consistency across every touchpoint."
                  icon="layers"
                  className="h-[260px] md:h-[316px] w-full"
                  rotate={1.7}
                />
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ── 02 · MARKETS WE SHAPE ─────────────────────────────────────── */}
      <MarketsWeShape markets={brandMarkets} />

      {/* ── 03 · THE WORK — dark 3×2 hover grid ──────────────────────── */}
      <section className="border-t border-white/5 bg-[#222222]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-22 pb-0">
          <Reveal delay={120} duration={900} distance={28}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] max-w-xl font-serif" style={{ color: "#EDE8DE" }}>
              Six disciplines. One foundation.
            </h2>
          </Reveal>
          <Reveal delay={240} duration={800} distance={20}>
            <p className="mt-5 text-base leading-[1.7] max-w-lg" style={{ color: "#6E6E6E" }}>
              Every engagement draws from the same body of practice — each discipline delivered at full depth, not bundled as a line item.
            </p>
          </Reveal>
        </div>

        <Reveal delay={360} duration={900} distance={24}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {workAreas.map((area, i) => {
              const isLastRow = i >= 3;
              const colIdx = i % 3;
              const borderRight = colIdx < 2 ? "lg:border-r border-white/[0.07]" : "";
              const borderBottom = !isLastRow ? "border-b border-white/[0.07]" : "";

              return (
                <div key={area.title} className={`group relative overflow-hidden px-8 py-10 sm:px-10 ${borderRight} ${borderBottom} cursor-default`}>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#C9A84C] tracking-tight leading-tight transition-all duration-500 ease-in-out group-hover:-translate-y-6 group-hover:opacity-0">
                    {area.title}
                  </h3>
                  <p className="absolute inset-x-8 sm:inset-x-10 top-1/2 -translate-y-1/2 text-[15px] sm:text-base leading-[1.75] text-[#A8894A] opacity-0 translate-y-4 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:translate-y-[-50%]">
                    {area.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ── 04 · TOOLS WE USE ─────────────────────────────────────────── */}
      <section className="border-t border-[#1A1625]/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8">
          <div className="max-w-2xl">
            <Reveal delay={0} duration={700} distance={16}>
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-[#5A2A6E]">
                Tools of the trade
              </span>
            </Reveal>
            <Reveal delay={120} duration={900} distance={0}>
              <h2
                className="font-display uppercase mt-5"
                style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1.15, color: "#0D0D0D" }}
              >
                The stack behind the foundation.
              </h2>
            </Reveal>
            <Reveal delay={240} duration={800} distance={16}>
              <p className="mt-5 text-base text-[#6B5A7A] leading-[1.7]">
                The platforms we&apos;ve standardized on because they hold up at scale — chosen for durability, not novelty.
              </p>
            </Reveal>
          </div>
        </div>
        <Reveal delay={100} duration={900} distance={16} className="pt-4 pb-20 sm:pb-24">
          <ToolsMarquee tools={brandTools} />
        </Reveal>
      </section>

      {/* ── 05 · FAQ ──────────────────────────────────────────────────── */}
      <section className="border-t border-[#1A1625]/10 bg-[#F3F1ED]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <Reveal delay={0} duration={700} distance={16}>
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-[#5A2A6E]">
                Questions clients ask
              </span>
            </Reveal>
            <Reveal delay={120} duration={900} distance={0}>
              <h2
                className="font-display uppercase mt-5"
                style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 700, letterSpacing: "0.06em", lineHeight: 1.15, color: "#0D0D0D" }}
              >
                The ones that come up first.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={240} duration={900} distance={20} className="mt-14 sm:mt-16">
            <FAQ items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* ── 06 · CTA ──────────────────────────────────────────────────── */}
      <CTA />
    </main>
  );
}
