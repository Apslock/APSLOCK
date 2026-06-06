"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, MapPin, Mail, Phone } from "lucide-react";
import SocialIcon from "@/components/shared/SocialIcon";
import type { NavLink, ContactInfo } from "@/lib/data";

interface FooterProps {
  links: NavLink[];
  contactInfo: ContactInfo;
  siteName: string;
}

const Hero = dynamic(() => import("./Hero"), {
  ssr: false,
  loading: () => <div style={{ width: "100%", height: "100%" }} />,
});

/* ── Marquee ── */
const marqueeItems = ["Brand Strategy", "Web Experiences", "Growth Marketing", "Design Systems", "AI Solutions", "Trust & Influence", "Build & Innovation", "Go-To-Market"];

function Marquee() {
  return (
    <div className="overflow-hidden border-y" style={{ borderColor: "rgba(255,255,255,0.08)" }} aria-hidden="true">
      <div className="flex whitespace-nowrap py-4" style={{ animation: "footer-marquee 28s linear infinite", width: "max-content" }}>
        {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
          <span key={i} className="mx-10 font-mono text-[0.65rem] uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.28)" }}>
            {item}<span className="mx-10" style={{ color: "rgba(255,255,255,0.15)" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Live clock ── */
function LiveClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "America/New_York" });
    setTime(fmt()); const id = setInterval(() => setTime(fmt()), 1000); return () => clearInterval(id);
  }, []);
  return <span className="font-mono tabular-nums" style={{ color: "rgba(255,255,255,0.45)" }}>{time ?? "—"}</span>;
}

/* ── Status dot ── */
function StatusDot() {
  return (
    <span className="relative flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#4ade80", animation: "footer-ping 2.4s cubic-bezier(0,0,0.2,1) infinite" }} />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "#22c55e" }} />
      </span>
      <span className="text-xs font-mono tracking-wide" style={{ color: "rgba(255,255,255,0.4)" }}>Available for new projects</span>
    </span>
  );
}


/* ═══════════════════════════════════════════════════
   MAIN FOOTER
   ═══════════════════════════════════════════════════ */
export default function Footer({ links, contactInfo, siteName }: FooterProps) {
  const pathname = usePathname();
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const footerRef = useRef<HTMLElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [heroVisible, setHeroVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    const timer = setTimeout(() => setHeroVisible(true), 100);
    
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  /* ── Blob animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (blob1Ref.current) {
        gsap.to(blob1Ref.current, { scaleX: 1.07, scaleY: 0.94, duration: 8, ease: "sine.inOut", repeat: -1, yoyo: true });
        gsap.to(blob1Ref.current, { opacity: 0.85, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1 });
      }
      if (blob2Ref.current) {
        gsap.to(blob2Ref.current, { scaleX: 0.93, scaleY: 1.06, duration: 10, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2 });
        gsap.to(blob2Ref.current, { opacity: 0.75, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 3 });
      }
    }, footerRef);
    return () => ctx.revert();
  }, []);

  /* ── Cursor magnet effect ── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      letterRefs.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx; const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (1 - dist / 120) * 18;
          gsap.to(el, { x: (dx / dist) * force, y: (dy / dist) * force, duration: 0.4, ease: "power2.out" });
        } else {
          gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
        }
      });
    };
    const onLeave = () => {
      letterRefs.current.forEach((el) => { if (el) gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power2.out" }); });
    };
    window.addEventListener("mousemove", onMove);
    const footer = footerRef.current;
    footer?.addEventListener("mouseleave", onLeave);
    return () => { window.removeEventListener("mousemove", onMove); footer?.removeEventListener("mouseleave", onLeave); };
  }, []);

  const navCols = [
    { label: "Navigate", items: links.map(l => ({ label: l.label, href: l.href })) },
    {
      label: "Services", items: [
        { label: "Brand Foundations", href: "/expertise/brand-foundations" },
        { label: "Growth & Go-To-Market", href: "/expertise/growth-go-to-market" },
        { label: "Build & Innovation", href: "/expertise/build-innovation" },
        { label: "Trust & Influence", href: "/expertise/trust-influence" },
      ]
    },
  ];

  return (
    <>
      <style>{`
        @keyframes footer-marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
        @keyframes footer-ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        .footer-link-hover { position: relative; display: inline-block; }
        .footer-link-hover::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 0; height: 1px; background: rgba(255,255,255,0.3); transition: width 0.3s cubic-bezier(0.22,1,0.36,1); }
        .footer-link-hover:hover::after { width: 100%; }
      `}</style>

      <footer ref={footerRef} role="contentinfo" className="relative flex flex-col"
        style={{
          height: "auto", overflow: "visible", color: "#FAFAF7",
          background:
            "radial-gradient(ellipse 70% 50% at 85% 10%, rgba(245,237,238,0.06) 0%, transparent 55%), " +
            "radial-gradient(ellipse 60% 45% at 10% 80%, rgba(238,242,237,0.05) 0%, transparent 55%), " +
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(235,240,245,0.04) 0%, transparent 60%), " +
            "#141210",
        }}
      >
        {/* ── Two overlapping blobs ── */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <div ref={blob1Ref} style={{
            position: "absolute", top: "50%", left: "38%", transform: "translate(-50%, -50%)",
            width: "55vw", height: "55vw", maxWidth: "750px", maxHeight: "750px",
            borderRadius: "50%",
            background: "radial-gradient(circle at center, #141210 0%, #141210 35%, transparent 68%)",
            filter: "blur(90px)", willChange: "transform",
          }} />
          <div ref={blob2Ref} style={{
            position: "absolute", top: "52%", left: "58%", transform: "translate(-50%, -50%)",
            width: "48vw", height: "48vw", maxWidth: "650px", maxHeight: "650px",
            borderRadius: "50%",
            background: "radial-gradient(circle at center, #141210 0%, #141210 35%, transparent 68%)",
            filter: "blur(85px)", willChange: "transform",
          }} />
        </div>



        {/* ── Top marquee ── */}
        <div className="relative z-10 pointer-events-none"><Marquee /></div>

        {/* ── Main content ── */}
        <div className="relative z-10 flex-1 flex flex-col">

          {/* Full-width CTA with sphere pinned to left, vertically centered */}
          <div
            className="relative flex flex-col justify-center px-8 md:px-16 lg:px-24"
            style={{ paddingTop: "4rem", paddingBottom: "3rem", minHeight: "460px", overflow: "visible" }}
          >
            {/* Sphere — pinned left, vertically centered so it grows in both directions */}
            <div
              className="hidden lg:block absolute left-0 pointer-events-none"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                width: "420px",
                height: "420px",
                opacity: heroVisible ? 1 : 0,
                transition: "opacity 1s ease-out"
              }}
            >
              {!isMobile && <Hero />}
            </div>

            {/* CTA text — uses full remaining width */}
            <div className="relative z-10 lg:pl-[26rem]">
              <p
                className="font-mono text-[0.65rem] uppercase tracking-[0.25em]"
                style={{ color: "rgba(255,255,255,0.35)", marginBottom: "1.25rem" }}
              >
                Let&apos;s build something
              </p>
              <h2
                className="font-display font-black leading-[1.02] tracking-tight"
                style={{ fontSize: "clamp(2.8rem, 5.5vw, 6rem)", letterSpacing: "-0.03em", marginBottom: "1.5rem" }}
              >
                Ready to build a{" "}
                <em className="not-italic" style={{
                  background: "linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.55) 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>brand people remember?</em>
              </h2>
              <p
                className="text-sm font-sans max-w-lg leading-relaxed"
                style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}
              >
                Whether you&apos;re launching, refining, or scaling, APSLOCK helps shape brands that feel clear, credible, and built to last.
              </p>
              <div className="flex items-center gap-6">
                <Link href="/contact"
                  className="group inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ background: "#FAFAF7", color: "#141210" }}>
                  Start a conversation
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                {/* Magnetic APSLOCK wordmark */}
                <div className="relative select-none hidden lg:block" style={{ fontFamily: "Gordita, sans-serif", fontSize: "clamp(2rem, 4vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>
                  {"APSLOCK".split("").map((letter, i) => (
                    <span key={i} ref={(el) => { letterRefs.current[i] = el; }}
                      style={{ display: "inline-block", color: "rgba(255,255,255,0.12)", willChange: "transform" }}>
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom strip ── */}
          <div
            className="relative z-10 border-t pt-12 pb-10 px-6 md:px-12 lg:px-16 xl:px-24 flex flex-col lg:flex-row justify-between gap-12 lg:gap-4"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <div className="flex flex-wrap gap-x-8 gap-y-12 md:gap-20">
              {navCols.map(col => (
                <div key={col.label}>
                  <p className="text-[0.6rem] font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>{col.label}</p>
                  <ul className="space-y-2.5">
                    {col.items.map(item => (
                      <li key={item.href}>
                        <Link href={item.href} className="footer-link-hover text-sm transition-colors duration-200" style={{ color: "rgba(255,255,255,0.5)" }}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="flex flex-col">
                <p className="text-[0.6rem] font-mono uppercase tracking-[0.25em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>Social</p>
                <ul className="flex flex-row gap-4">
                  {contactInfo.social.map(s => (
                    <li key={s.platform}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200"
                        style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.06)" }}
                        aria-label={s.platform}
                        onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.9)"; e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                      >
                        <SocialIcon platform={s.platform} size={16} />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-4">
                {/* Location & Time Row */}
                <div className="grid grid-cols-2 md:grid-cols-1 items-center md:items-start gap-4 md:gap-y-4">
                  <div className="flex items-start gap-3 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
                    <span className="truncate">{contactInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.25)" }}>ET</span>
                    {pathname !== "/expertise" && <LiveClock />}
                  </div>
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-2 md:grid-cols-1 items-center md:items-start gap-4 md:gap-y-4">
                  <div className="flex items-start gap-3 text-sm">
                    <Mail size={14} className="mt-0.5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
                    <a href={`mailto:${contactInfo.email}`} className="footer-link-hover transition-colors duration-200 truncate" style={{ color: "rgba(255,255,255,0.55)" }}>{contactInfo.email}</a>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Phone size={14} className="mt-0.5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
                    <a href={`tel:${contactInfo.phone}`} className="footer-link-hover transition-colors duration-200" style={{ color: "rgba(255,255,255,0.55)" }}>{contactInfo.phone}</a>
                  </div>
                </div>
                
                <div className="mt-1"><StatusDot /></div>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end justify-between gap-12 lg:gap-0 w-full lg:w-auto self-stretch">
              {/* Newsletter */}
              <div className="w-full max-w-xs">
                <p className="text-[0.6rem] font-mono uppercase tracking-[0.25em] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Newsletter</p>
                <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Useful thoughts on brand, design, and growth — written for teams building something meaningful.</p>
                <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-0 rounded-full overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    aria-label="Email for newsletter"
                    className="flex-1 bg-transparent px-4 py-2.5 text-xs outline-none placeholder:text-white/20"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="px-4 py-2.5 transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                  >
                    <span className="text-xs font-medium tracking-wide">Subscribe</span>
                  </button>
                </form>
              </div>
              <div className="flex flex-col items-start lg:items-end gap-5">
                <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.22)" }}>© {currentYear} {siteName}. All rights reserved.</p>
                <div className="flex items-center gap-5">
                  {[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: "Cookies", href: "/cookies" }].map(l => (
                    <Link key={l.href} href={l.href} className="text-[0.7rem] font-mono transition-colors duration-200" style={{ color: "rgba(255,255,255,0.22)" }}>{l.label}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
