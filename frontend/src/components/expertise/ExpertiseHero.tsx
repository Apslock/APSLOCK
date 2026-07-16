"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll, MotionValue } from "framer-motion";
import Lenis from 'lenis'; // FIX 7

// ─── LAYER 1: EASING SYSTEM ───────────────────────────────────────────────────
type CubicBezier = [number, number, number, number];
const EASE: Record<string, CubicBezier> = {
  snap:    [0.76, 0, 0.24, 1],
  soft:    [0.33, 1, 0.68, 1],
  text:    [0.22, 1, 0.36, 1],
};

const LETTER_ROTATIONS: number[] = [
  -1.8, 1.2, -0.6, 2.1, -1.4, 0.8, -2.2, 1.6, -0.9
];

// ─── PANEL DATA ───────────────────────────────────────────────────────────────
const floatingPanels = [
  {
    id: "portrait", // top left — trust (1)
    className:
      "hidden lg:block left-[7%] top-[12%] h-[255px] w-[255px]",
    style:
      "bg-[url('/images/expertise/trust-1.jpg')] bg-cover bg-center bg-no-repeat",
    label: "",
  },
  {
    id: "orb", // left middle — build (2)
    className:
      "hidden lg:block left-[0%] top-[48%] h-[325px] w-[325px]",
    style:
      "bg-[url('/images/expertise/build-1.jpg')] bg-cover bg-center bg-no-repeat",
    label: "",
  },

  {
    id: "landscape", // top right — growth top (3)
    className:
      "hidden lg:block right-[-4%] top-[9%] h-[360px] w-[392px]",
    style:
      "bg-[url('/images/expertise/growth-1.jpg')] bg-cover bg-center bg-no-repeat",
    label: "",
  },
  {
    id: "hand", // right middle — growth bottom (4)
    className:
      "hidden lg:block right-[11%] top-[58%] h-[165px] w-[170px]",
    style:
      "bg-[url('/images/expertise/growth-3.webp')] bg-cover bg-center bg-no-repeat",
    label: "",
  },
  {
    id: "bottom", // bottom middle — brand (5)
    className:
      "hidden lg:block left-[44%] bottom-[3%] h-[168px] w-[255px]",
    style:
      "bg-[url('/images/expertise/brand-hero.jpg')] bg-cover bg-center bg-no-repeat",
    label: "",
  },
];

// ─── DEPTHS ───────────────────────────────────────────────────────────────────
const depths: Record<string, number> = {
  portrait:  1.2,
  landscape: 2.0,
  orb:       2.8,
  hand:      3.2,
  bottom:    1.8,
};

// ─── LAYER 4: CLIP-PATH DIRECTIONAL REVEAL ────────────────────────────────────
const clipReveal: Record<string, { hidden: string; visible: string }> = {
  portrait:  { hidden: "inset(0% 0% 100% 0%)", visible: "inset(0% 0% 0% 0%)" },
  orb:       { hidden: "inset(0% 100% 0% 0%)", visible: "inset(0% 0% 0% 0%)" },

  landscape: { hidden: "inset(0% 0% 0% 100%)", visible: "inset(0% 0% 0% 0%)" },
  hand:      { hidden: "inset(0% 0% 100% 0%)", visible: "inset(0% 0% 0% 0%)" },
  bottom:    { hidden: "inset(100% 0% 0% 0%)", visible: "inset(0% 0% 0% 0%)" },
};

// ─── LAYER 5: EXIT VECTORS ────────────────────────────────────────────────────
const exitVectors: Record<string, { x: number[]; y: number[]; rotate: number[] }> = {
  portrait:  { x: [0, -420], y: [0, -180], rotate: [0, -18] },
  orb:       { x: [0, -280], y: [0,  200], rotate: [0,  22] },

  landscape: { x: [0,  320], y: [0, -120], rotate: [0,  14] },
  hand:      { x: [0,  340], y: [0,  220], rotate: [0, -20] },
  bottom:    { x: [0,  100], y: [0,  260], rotate: [0,  10] },
};

// ─── SPATIAL REVEAL DELAYS ────────────────────────────────────────────────────
const revealDelays: Record<string, number> = {

  landscape: 0.18,
  portrait:  0.26,
  bottom:    0.34,
  hand:      0.42,
  orb:       0.52,
};

// ─── LAYER 7: FLOAT PERSONALITIES ─────────────────────────────────────────────
const floatPersonality: Record<string, { y: number[]; x: number[]; rotateZ: number[] }> = {
  portrait:  { y: [0, -18, 0], x: [0,  6, 0], rotateZ: [0,  1.5, 0] },
  orb:       { y: [0,  22, 0], x: [0, -9, 0], rotateZ: [0, -2.5, 0] },

  landscape: { y: [0,  14, 0], x: [0,  5, 0], rotateZ: [0, -1.0, 0] },
  hand:      { y: [0, -20, 0], x: [0, -6, 0], rotateZ: [0,  2.2, 0] },
  bottom:    { y: [0,  12, 0], x: [0,  8, 0], rotateZ: [0, -1.8, 0] },
};

const floatDurations: Record<string, number> = {
  portrait: 7, orb: 11, landscape: 13, hand: 8, bottom: 10
};

const panelRotations: Record<string, number> = {
  portrait:  -2.2,
  landscape:  1.4,
  orb:       -1.8,

  hand:      -3.4,
  bottom:     1.9,
};

const panelRadii: Record<string, string> = {
  portrait:  "8px",
  landscape: "4px",
  orb:       "12px",

  hand:      "10px",
  bottom:    "6px",
};

const panelShadows: Record<string, string> = {
  portrait:  "0_40px_90px_-15px_rgba(0,0,0,0.38)",
  landscape: "0_24px_60px_-10px_rgba(0,0,0,0.22)",
  orb:       "0_50px_100px_-20px_rgba(0,0,0,0.42)",

  hand:      "0_30px_70px_-12px_rgba(0,0,0,0.32)",
  bottom:    "0_20px_50px_-10px_rgba(0,0,0,0.28)",
};

// ─── FLOATING PANEL COMPONENT ─────────────────────────────────────────────────
function FloatingPanel({
  id, className, style, label, index, mouseX, mouseY, isLoaded, scrollY
}: {
  id: string;
  className: string;
  style: string;
  label?: string;
  index: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  isLoaded: boolean;
  scrollY: MotionValue<number>;
}) {
  const depth = depths[id] || 1.5;

  const xOffset = useTransform(mouseX, [-1, 1], [-18 * depth, 18 * depth]);
  const yOffset = useTransform(mouseY, [-1, 1], [-10 * depth, 10 * depth]);
  const springX = useSpring(xOffset, { stiffness: 220, damping: 28, mass: 0.4 });
  const springY = useSpring(yOffset, { stiffness: 220, damping: 28, mass: 0.4 });

  const vec = exitVectors[id] ?? { x: [0, 0], y: [0, 200], rotate: [0, 0] };
  const exitX      = useTransform(scrollY, [0, 700], vec.x);
  const exitY      = useTransform(scrollY, [0, 700], vec.y);
  const exitRot    = useTransform(scrollY, [0, 700], vec.rotate);
  const exitOp     = useTransform(scrollY, [200, 640], [1, 0]);
  const exitBlurV  = useTransform(scrollY, [350, 640], [0, 14]);
  const exitBlurS  = useTransform(exitBlurV, (v: number) => `blur(${v}px)`);

  // FIX 2: Multi-input useTransform for reactive parallax fade
  const parallaxStrength = useTransform(scrollY, [0, 350], [1, 0]);
  const fadedX = useTransform([parallaxStrength, springX], ([s, x]: number[]) => x * s);
  const fadedY = useTransform([parallaxStrength, springY], ([s, y]: number[]) => y * s);

  const [isHovered, setIsHovered] = useState(false);
  const hoverScale = useSpring(1, { stiffness: 260, damping: 22, mass: 0.5 });

  useEffect(() => {
    hoverScale.set(isHovered ? 1.04 : 1);
  }, [isHovered, hoverScale]);

  const personality = floatPersonality[id] ?? { y: [0, -14, 0], x: [0, 6, 0], rotateZ: [0, 1.5, 0] };
  const floatDur = floatDurations[id] ?? 8;
  const panelDelay = revealDelays[id] ?? 0.28;
  const shadowVal = (panelShadows[id] ?? '0_30px_80px_-15px_rgba(0,0,0,0.3)').split('_').join(' ');

  return (
    <motion.div
      className={`absolute ${className}`}
      style={{
        x: exitX,
        y: exitY,
        rotate: exitRot,
        opacity: exitOp,
        filter: exitBlurS,
        zIndex: Math.floor(depth * 10),
        willChange: 'transform, opacity' // FIX 5: no 'filter'
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{ x: fadedX, y: fadedY, rotate: panelRotations[id] ?? 0, scale: hoverScale }}
        onMouseEnter={() => { setIsHovered(true); }}
        onMouseLeave={() => { setIsHovered(false); }}
      >
        <motion.div
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          variants={{
            hidden: {
              clipPath: clipReveal[id]?.hidden ?? "inset(0% 0% 100% 0%)",
              opacity: 0,
              scale: 0.94,
            },
            visible: {
              clipPath: clipReveal[id]?.visible ?? "inset(0% 0% 0% 0%)",
              opacity: 1,
              scale: 1,
              transition: {
                clipPath: { duration: 0.88, ease: EASE.snap, delay: panelDelay },
                opacity:  { duration: 0.2,  ease: "linear",  delay: panelDelay },
                scale:    { duration: 0.88, ease: EASE.soft, delay: panelDelay },
              }
            }
          }}
          // FIX 17: static shadow back in className
          className="w-full h-full overflow-hidden"
          style={{
            borderRadius: panelRadii[id] ?? '4px',
            boxShadow: shadowVal
          }}
        >
          <motion.div
            variants={{
              hidden: { y: 0, x: 0, rotateZ: 0 },
              visible: { y: personality.y, x: personality.x, rotateZ: personality.rotateZ }
            }}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            transition={{
              duration: floatDur,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.8 + index * 1.8,
            }}
            className="absolute inset-0"
          >
            <div className={`absolute inset-0 ${style}`} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.28),transparent_28%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.14),transparent_26%)]" />
            {label && (
              <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/78 px-4 py-2 text-[11px] font-medium tracking-[0.02em] text-white shadow-lg backdrop-blur-md">
                {label}
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ExpertiseHero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [curtainDone, setCurtainDone] = useState(false);

  const EYEBROW_PHRASES = [
    "Curated Visual Reference",
    "Brand · Identity · Direction",
    "Craft Without Compromise",
  ] as const;
  const [eyebrowIndex, setEyebrowIndex] = useState(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { damping: 50, stiffness: 120, mass: 0.6 });

  const textOpacity = useTransform(smoothY, [0, 380], [1, 0]);
  const textScale   = useTransform(smoothY, [0, 380], [1, 0.92]);
  const textY       = useTransform(smoothY, [0, 380], [0, -60]);
  const textBlur    = useTransform(smoothY, [200, 380], ["blur(0px)", "blur(10px)"]);



  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const timer = setTimeout(() => {
        setCurtainDone(true);
        setIsLoaded(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    // FIX 7: new lenis package with lerp instead of duration
    const lenis = new Lenis({
      lerp: 0.1,
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.92,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // FIX 3: cancelled flag + visibility safety reset
    let cancelled = false;
    document.documentElement.style.visibility = 'hidden';
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    // FIX 8: removed Promise.all wrapper
    document.fonts.ready.then(async () => {
      if (cancelled) return;
      await new Promise(r => setTimeout(r, 80));
      document.documentElement.style.visibility = 'visible';
      t1 = setTimeout(() => { if (!cancelled) setCurtainDone(true); }, 480);
      t2 = setTimeout(() => { if (!cancelled) setIsLoaded(true); }, 680);
    });

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      document.documentElement.style.visibility = 'visible';
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
    // FIX 16: mouseX and mouseY are stable MotionValue refs — listed for exhaustive-deps
    // lint compliance but will never trigger a re-run
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(() => {
      setEyebrowIndex((prev) => (prev + 1) % 3);
    }, 3800);
    return () => clearInterval(interval);
  }, [isLoaded]);

  return (
    <>

      {/* TOP CURTAIN HALF */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[99999]"
        style={{ backgroundColor: '#F3F1ED', height: '51vh', originY: 0 }}
        initial={{ scaleY: 1 }}
        animate={curtainDone ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 0.72, ease: EASE.snap, delay: 0.04 }}
      />
      {/* BOTTOM CURTAIN HALF */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-[99999]"
        style={{ backgroundColor: '#F3F1ED', height: '51vh', originY: 1 }}
        initial={{ scaleY: 1 }}
        animate={curtainDone ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 0.72, ease: EASE.snap, delay: 0 }}
      />

      {/* FIX 11: soft-light instead of overlay for dark mode compat */}
      <div
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.072]"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.68%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          mixBlendMode: 'soft-light'
        }}
      />

      {/* FIX 15: aria-labelledby on main */}
      <main
        className="relative -mt-20 lg:min-h-screen overflow-hidden text-foreground bg-[#F3F1ED]"
        style={{ perspective: "1200px" }}
        aria-labelledby="hero-heading"
      >
        {/* FIX 18: simplified ambient glow — 2 keyframes + mirror, no willChange */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.07),transparent_55%),radial-gradient(ellipse_55%_50%_at_12%_20%,rgba(220,130,160,0.09),transparent_60%),radial-gradient(ellipse_55%_50%_at_88%_15%,rgba(120,100,230,0.08),transparent_58%),radial-gradient(ellipse_40%_35%_at_50%_100%,rgba(180,155,120,0.05),transparent_70%)]"
          initial={{ opacity: 0.65 }}
          animate={isLoaded ? { opacity: [0.65, 1] } : { opacity: 0.65 }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: 2.5,
          }}
        />
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 55% at 22% 65%, rgba(220,130,160,0.055), transparent 65%), radial-gradient(ellipse 60% 45% at 78% 70%, rgba(120,100,230,0.045), transparent 60%)',
          }}
          animate={{ opacity: [0.4, 0.85, 0.4] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />

        {/* FIX 12: aria-hidden on decorative panels wrapper */}
        <div className="pointer-events-auto absolute inset-0 z-20" style={{ perspective: "1200px", perspectiveOrigin: "50% 40%" }} aria-hidden="true">
          {floatingPanels.map((panel, index) => (
            <FloatingPanel
              key={panel.id}
              id={panel.id}
              className={panel.className}
              style={panel.style}
              label={panel.label}
              index={index}
              mouseX={mouseX}
              mouseY={mouseY}
              isLoaded={isLoaded}
              scrollY={smoothY}
            />
          ))}
        </div>

        <div className="relative z-10 flex lg:min-h-screen items-start justify-center px-6 pt-[164px] md:pt-[204px] lg:pt-[calc(204px+10em)] pb-[1em] lg:pb-16">
          {/* FIX 6a: removed backfaceVisibility from text wrapper */}
          <motion.div
            className="text-center"
            style={{
              opacity: textOpacity,
              scale: textScale,
              y: textY,
              filter: textBlur,
              transformOrigin: "center",
            }}
          >


            {/* FIX 9: named variants for eyebrow */}
            <div className="mb-6 overflow-hidden h-[18px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={eyebrowIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.52, ease: EASE.text }}
                  className="text-[11px] uppercase tracking-[0.42em] text-muted-foreground absolute"
                >
                  {EYEBROW_PHRASES[eyebrowIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="relative overflow-visible">
              <div
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center overflow-visible select-none"
                aria-hidden="true"
              >
                <div className="flex items-baseline whitespace-nowrap" style={{ letterSpacing: '-0.08em' }}>
                  {Array.from("EXPERTISE").map((letter, i) => (
                    <div key={i} className="overflow-hidden">
                      <motion.span
                        variants={{
                          hidden: { y: "110%", opacity: 0, rotate: LETTER_ROTATIONS[i] * 2 },
                          visible: { y: "0%", opacity: 1, rotate: 0 },
                        }}
                        initial="hidden"
                        animate={isLoaded ? "visible" : "hidden"}
                        transition={{
                          y: { duration: 1.1, ease: EASE.soft, delay: 0.55 + i * 0.055 },
                          opacity: { duration: 0.3, ease: "linear", delay: 0.55 + i * 0.055 },
                          rotate: { duration: 1.3, ease: EASE.soft, delay: 0.55 + i * 0.055 },
                        }}
                        className="block text-[4.4rem] sm:text-[6.2rem] md:text-[7.8rem] lg:text-[9.6rem] xl:text-[11.4rem] font-black uppercase leading-none select-none"
                        style={{
                          WebkitTextStroke: '1px rgba(0,0,0,0.07)',
                          color: 'transparent',
                          display: 'inline-block',
                        }}
                      >
                        {letter}
                      </motion.span>
                    </div>
                  ))}
                </div>
              </div>
              <h1
                id="hero-heading"
                className="flex items-baseline justify-center"
                style={{ letterSpacing: '-0.08em' }}
                aria-label="Expertise"
              >
                {Array.from("EXPERTISE").map((letter, i) => (
                  <div key={i} className="overflow-hidden">
                    <motion.span
                      variants={{
                        hidden: { y: "110%", opacity: 0, rotate: LETTER_ROTATIONS[i] },
                        visible: { y: "0%", opacity: 1, rotate: 0 },
                      }}
                      initial="hidden"
                      animate={isLoaded ? "visible" : "hidden"}
                      transition={{
                        y: { duration: 0.92, ease: EASE.snap, delay: 0.18 + i * 0.048 },
                        opacity: { duration: 0.18, ease: "linear", delay: 0.18 + i * 0.048 },
                        rotate: { duration: 1.05, ease: EASE.soft, delay: 0.18 + i * 0.048 },
                      }}
                      className="block text-[3.2rem] sm:text-[4.7rem] md:text-[6rem] lg:text-[7.4rem] xl:text-[8.6rem] font-black uppercase leading-[0.86] bg-gradient-to-b from-foreground/90 from-50% to-foreground/35 to-50% bg-clip-text text-transparent"
                      style={{ display: 'inline-block' }}
                    >
                      {letter}
                    </motion.span>
                  </div>
                ))}
              </h1>
            </div>

            <div className="mt-4 flex justify-center overflow-hidden">
              <motion.div
                className="h-px w-24 bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
                variants={{
                  hidden: { scaleX: 0, opacity: 0 },
                  visible: { scaleX: 1, opacity: 1 },
                }}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                transition={{
                  scaleX: { duration: 0.8, ease: EASE.snap, delay: 0.85 },
                  opacity: { duration: 0.3, ease: "linear", delay: 0.85 },
                }}
                style={{ transformOrigin: "center" }}
              />
            </div>

            <div className="mt-8 max-w-[420px] mx-auto">
              <div className="overflow-hidden mb-1">
                <motion.p
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    visible: { y: "0%", opacity: 1 },
                  }}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  transition={{ duration: 0.72, ease: EASE.text, delay: 1.05 }}
                  className="text-[12px] leading-[1.85] tracking-[0.015em] text-foreground/40 font-normal"
                >
                  Visual craft isn&apos;t a service we offer.
                </motion.p>
              </div>
              <div className="overflow-hidden mb-1">
                <motion.p
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    visible: { y: "0%", opacity: 1 },
                  }}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  transition={{ duration: 0.72, ease: EASE.text, delay: 1.18 }}
                  className="text-[12px] leading-[1.85] tracking-[0.015em] text-foreground/40 font-normal"
                >
                  It&apos;s a standard we hold — quietly, consistently,
                </motion.p>
              </div>
              <div className="overflow-hidden">
                <motion.p
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    visible: { y: "0%", opacity: 1 },
                  }}
                  initial="hidden"
                  animate={isLoaded ? "visible" : "hidden"}
                  transition={{ duration: 0.72, ease: EASE.text, delay: 1.31 }}
                  className="text-[12px] leading-[1.85] tracking-[0.015em] text-foreground/40 font-normal"
                >
                  across every brief that lands on our desk and every pixel that leaves it.
                </motion.p>
              </div>
            </div>

            {/* Custom Blue Rectangles (Mobile Mockup) */}
            <div className="relative w-full max-w-[320px] mx-auto mt-[1em] h-[340px] pointer-events-none lg:hidden">
              {/* 1. Main Central Image */}
              <motion.div
                className="absolute top-[-10px] left-[calc(10%-30px)] w-[92%] h-[253px] shadow-xl overflow-hidden"
                style={{ y: useTransform(smoothY, [0, 800], [0, -80]), borderRadius: "8px" }}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={{
                  hidden: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0, scale: 0.94 },
                  visible: { 
                    clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: 1,
                    transition: {
                      clipPath: { duration: 0.88, ease: EASE.snap, delay: 0.2 },
                      opacity:  { duration: 0.2,  ease: "linear",  delay: 0.2 },
                      scale:    { duration: 0.88, ease: EASE.soft, delay: 0.2 },
                    }
                  }
                }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={isLoaded ? { y: [0, -12, 0], rotateZ: [0, 1.5, 0] } : {}}
                  transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
                >
                  <img src="/images/expertise/trust-1.jpg" alt="" className="w-full h-full object-cover object-center" />
                </motion.div>
              </motion.div>
              
              {/* 2. Bottom Left Rectangle */}
              <motion.div
                className="absolute top-[160px] left-[-15%] w-[55%] h-[120px] shadow-xl overflow-hidden"
                style={{ y: useTransform(smoothY, [0, 800], [0, -140]), borderRadius: "6px" }}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={{
                  hidden: { clipPath: "inset(0% 100% 0% 0%)", opacity: 0, scale: 0.94 },
                  visible: { 
                    clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: 1,
                    transition: {
                      clipPath: { duration: 0.88, ease: EASE.snap, delay: 0.35 },
                      opacity:  { duration: 0.2,  ease: "linear",  delay: 0.35 },
                      scale:    { duration: 0.88, ease: EASE.soft, delay: 0.35 },
                    }
                  }
                }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={isLoaded ? { y: [0, 15, 0], rotateZ: [0, -2, 0] } : {}}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  <div className="w-full h-full bg-[url('/images/expertise/build-1.jpg')] bg-cover bg-center scale-[1.20]" />
                </motion.div>
              </motion.div>
              
              {/* 3. Right Edge Rectangle */}
              <motion.div
                className="absolute top-[50px] right-[-20%] w-[50%] h-[130px] shadow-xl overflow-hidden"
                style={{ y: useTransform(smoothY, [0, 800], [0, -50]), borderRadius: "6px" }}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                variants={{
                  hidden: { clipPath: "inset(100% 0% 0% 0%)", opacity: 0, scale: 0.94 },
                  visible: { 
                    clipPath: "inset(0% 0% 0% 0%)", opacity: 1, scale: 1,
                    transition: {
                      clipPath: { duration: 0.88, ease: EASE.snap, delay: 0.5 },
                      opacity:  { duration: 0.2,  ease: "linear",  delay: 0.5 },
                      scale:    { duration: 0.88, ease: EASE.soft, delay: 0.5 },
                    }
                  }
                }}
              >
                <motion.div
                  className="w-full h-full"
                  animate={isLoaded ? { y: [0, -18, 0], rotateZ: [0, 2.5, 0] } : {}}
                  transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
                >
                  <img src="/images/expertise/growth-3.webp" alt="" className="w-full h-full object-cover object-center" />
                </motion.div>
              </motion.div>
            </div>

          </motion.div>
        </div>





        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F3F1ED] via-[#F3F1ED]/50 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.045) 100%)',
          }}
        />
      </main>


    </>
  );
}
