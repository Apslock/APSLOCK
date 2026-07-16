"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import Atmosphere from "@/components/about/Atmosphere";
import { motion, AnimatePresence } from "framer-motion";

const heroWords = ["website?", "brand?", "product?", "platform?"];
const wordColors = ["#A5B4FC", "#6EE7B7", "#FCA5A5", "#7DD3FC"];

const skills = [
  "Web Development",
  "App Development",
  "UI/UX Design",
  "AI Applications",
  "Digital Marketing & SEO",
  "Brand Strategy",
  "Cloud & DevOps",
  "Logo Designing",
  "Prototyping & MVPs",
  "API Integrations",
];

const items = [...skills, ...skills, ...skills];

export default function BigCTA() {
  const marqueeARef = useRef<HTMLDivElement>(null);
  const marqueeBRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % heroWords.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    // Only animate the heading and button with GSAP
    // The marquee now uses pure CSS for better performance and reliability

    if (headingRef.current) {
      const headingSt = ScrollTrigger.create({ trigger: headingRef.current, start: "top 85%" });
      triggers.push(headingSt);
      tweens.push(
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power4.out", scrollTrigger: headingSt }
        )
      );
    }

    if (btnRef.current) {
      const btnSt = ScrollTrigger.create({ trigger: btnRef.current, start: "top 90%" });
      triggers.push(btnSt);
      tweens.push(
        gsap.fromTo(
          btnRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.8, delay: 0.2, ease: "back.out(1.7)", scrollTrigger: btnSt }
        )
      );
    }

    return () => {
      tweens.forEach((t) => t.kill());
      triggers.forEach((t) => t.kill());
    };
  }, []);


  return (
    <section className="py-6 sm:py-10 px-4 sm:px-6">
      <style>{`
        @keyframes big-cta-marquee {
          0% { transform: translateX(-66.666%); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
      <div
        className="relative max-w-7xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 85% 10%, rgba(245,237,238,0.06) 0%, transparent 55%), " +
            "radial-gradient(ellipse 55% 45% at 10% 80%, rgba(238,242,237,0.04) 0%, transparent 55%), " +
            "#141210",
        }}
      >
        {/* Atmosphere particles — right corner only, no background seam */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Atmosphere disableScrollFade disableBackgroundEffects anchorCorner="right" compact />
        </div>

        {/* CTA content — centered and compact */}
        <div className="relative z-10 flex flex-col items-center justify-center py-8 sm:py-10 px-5 sm:px-8 text-center">
          <h2
            ref={headingRef}
            className="text-2xl md:text-4xl font-bold max-w-3xl leading-tight mb-6 opacity-0 font-display flex flex-wrap justify-center items-center gap-x-2"
            style={{ color: "#FAFAF7", letterSpacing: "-0.015em" }}
          >
            <span>Ready to build your next</span>
            <span className="relative inline-flex items-center min-w-[130px] md:min-w-[210px] h-[1.5em] overflow-hidden pt-1">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)", transition: { duration: 0.3 } }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-script text-[1.4em] md:text-[1.5em] font-medium leading-none"
                  style={{ color: wordColors[wordIndex] }}
                >
                  {heroWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h2>

          <Link
            ref={btnRef}
            href="/contact"
            className="opacity-0 inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-colors duration-200"
            style={{ background: "#FAFAF7", color: "#141210" }}
            onMouseEnter={(e) =>
              gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: "power2.out" })
            }
            onMouseLeave={(e) =>
              gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" })
            }
          >
            <Sparkles size={15} />
            Contact APSLOCK
          </Link>
        </div>

        {/* MARQUEE STRIP */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            className="text-center text-sm pt-8 pb-6 font-mono tracking-widest uppercase"
            style={{ color: "rgba(250,250,247,0.25)", letterSpacing: "0.2em", fontSize: "0.65rem" }}
          >
            Built for performance and clarity.
          </p>

          {/* Track */}
          <div
            className="relative overflow-hidden pb-10"
            style={{ height: 90 }}
          >

            {/* LEFT HALF — hollow */}
            <div
              className="absolute inset-0"
              style={{ clipPath: "inset(0 50% 0 0)", zIndex: 1 }}
            >
              <div
                className="flex gap-4 w-max absolute top-0 left-0 items-center h-full"
                style={{ animation: "big-cta-marquee 40s linear infinite" }}
              >
                {items.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full flex-shrink-0 text-sm font-medium"
                    style={{
                      background: "rgba(250,250,247,0.04)",
                      border: "1px solid rgba(250,250,247,0.08)",
                      color: "rgba(250,250,247,0.35)",
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full border flex-shrink-0"
                      style={{ borderColor: "rgba(250,250,247,0.15)" }}
                    />
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT HALF — checked */}
            <div
              className="absolute inset-0"
              style={{ clipPath: "inset(0 0 0 50%)", zIndex: 1 }}
            >
              <div
                className="flex gap-4 w-max absolute top-0 left-0 items-center h-full"
                style={{ animation: "big-cta-marquee 40s linear infinite" }}
              >
                {items.map((skill, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full flex-shrink-0 text-sm font-medium"
                    style={{
                      background: "rgba(250,250,247,0.08)",
                      border: "1px solid rgba(250,250,247,0.15)",
                      color: "rgba(250,250,247,0.85)",
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="flex-shrink-0"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* ── CONCAVE LENS ── */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 250,
                height: 60,
                background:
                  'radial-gradient(15px 40px at 0% 50%, transparent 99%, #141210 100%) left / 51% 100% no-repeat,' +
                  'radial-gradient(15px 40px at 100% 50%, transparent 99%, #141210 100%) right / 51% 100% no-repeat',
                zIndex: 20,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* Left concave arc */}
              <div
                style={{
                  position: 'absolute',
                  top: -10, bottom: -10, left: -15, width: 30,
                  borderRight: '1.5px solid rgba(250,250,247,0.7)',
                  borderRadius: '50%',
                  filter: 'drop-shadow(0 0 3px rgba(250,250,247,0.2))',
                  zIndex: 21,
                }}
              />
              {/* Right concave arc */}
              <div
                style={{
                  position: 'absolute',
                  top: -10, bottom: -10, right: -15, width: 30,
                  borderLeft: '1.5px solid rgba(250,250,247,0.7)',
                  borderRadius: '50%',
                  filter: 'drop-shadow(0 0 3px rgba(250,250,247,0.2))',
                  zIndex: 21,
                }}
              />
              {/* Center wordmark */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'rgba(250,250,247,0.9)',
                    letterSpacing: '0.04em',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  APSLOCK
                </span>
                <span
                  style={{
                    fontSize: 7,
                    fontWeight: 500,
                    letterSpacing: 3,
                    color: 'rgba(250,250,247,0.2)',
                    fontFamily: 'inherit',
                  }}
                >
                  STUDIO
                </span>
              </div>
            </div>

            {/* Edge fades */}
            <div
              className="absolute inset-y-0 left-0 w-12 sm:w-28 md:w-40 pointer-events-none"
              style={{ background: "linear-gradient(to right, #141210, transparent)", zIndex: 5 }}
            />
            <div
              className="absolute inset-y-0 right-0 w-12 sm:w-28 md:w-40 pointer-events-none"
              style={{ background: "linear-gradient(to left, #141210, transparent)", zIndex: 5 }}
            />

          </div>
        </div>

      </div>
    </section>
  );
}
