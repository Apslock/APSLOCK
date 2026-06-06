"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function CardIcon({ type }: { type: "target" | "pen" | "chat" | "layers" }) {
  const common = "stroke-[1.8] text-[#111111]";

  if (type === "target") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 ${common}`}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <path d="M14 10l5-5" />
        <path d="M16 5h3v3" />
      </svg>
    );
  }

  if (type === "pen") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 ${common}`}>
        <path d="M12 3l9 9-9 9-9-9 9-9Z" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 ${common}`}>
        <path d="M20 12a7 7 0 0 1-7 7H8l-4 3v-4a7 7 0 0 1-1-3.5A7 7 0 0 1 10 5h3a7 7 0 0 1 7 7Z" />
        <path d="M8 11h8M8 14h5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={`h-5 w-5 ${common}`}>
      <path d="M4 12h16" />
      <path d="M8 8h8v8H8z" />
      <path d="M6 4h12v4H6z" />
    </svg>
  );
}

function FoundationCard({
  index,
  title,
  eyebrow,
  body,
  icon,
  className,
  rotate,
}: {
  index: string;
  title: string;
  eyebrow: string;
  body: string;
  icon: "target" | "pen" | "chat" | "layers";
  className: string;
  rotate: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{
        y: -8,
        rotate: rotate + 0.6,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      className={`group relative rounded-[28px] border border-white/70 bg-white/62 p-6 shadow-[0_20px_60px_rgba(31,41,55,0.08)] backdrop-blur-xl transition-all duration-500 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/60 via-white/15 to-transparent opacity-80" />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf1e8] text-black/85 ring-1 ring-black/5 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
            <CardIcon type={icon} />
          </div>
          <div className="text-sm font-medium tracking-[0.2em] text-black/22">{index}</div>
        </div>

        <div className="mt-8 text-[12px] font-medium tracking-[0.32em] text-black/42">{eyebrow}</div>
        <div className="mt-3 text-[26px] font-semibold tracking-tight text-black/93">{title}</div>
        <div className="mt-4 h-px w-8 bg-black/25" />
        <p className="mt-5 max-w-[24ch] text-[15px] leading-6 text-black/58">{body}</p>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(157,201,159,0.55),transparent_28%),radial-gradient(circle_at_74%_58%,rgba(180,214,169,0.38),transparent_22%),radial-gradient(circle_at_38%_48%,rgba(255,255,255,0.68),transparent_26%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.08)_42%,rgba(153,198,150,0.10)_100%)]" />
        <motion.div
          aria-hidden
          animate={{ x: [0, 16, 0], y: [0, 8, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-10%] top-[10%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(173,214,165,0.35)_0%,rgba(173,214,165,0.14)_34%,transparent_72%)] blur-3xl"
        />
        <motion.div
          aria-hidden
          animate={{ opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-6%] top-[8%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.16)_34%,transparent_74%)] blur-3xl"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,.9) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.9) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(circle at center, black 36%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 36%, transparent 78%)",
        }}
      />

      <nav className="relative z-10 w-full flex items-center justify-between px-8 py-6">
        <div className="font-bold text-xl tracking-tight text-black">APSLOCK</div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-black/70">
          <span>Work</span>
          <span>Expertise</span>
          <span>About</span>
        </div>
        <button className="px-5 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-black/80 transition-colors">
          Contact Us
        </button>
      </nav>

      <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 px-8 lg:px-16 pt-12 pb-24 items-center">
        
        <div className="flex flex-col items-start max-w-xl">
          <motion.div
            custom={0}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-[11px] font-bold tracking-[0.2em] text-black/40 uppercase mb-6"
          >
            Brand Foundation
          </motion.div>
          
          <motion.h1
            custom={0.1}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-5xl lg:text-7xl font-bold tracking-tight text-black leading-[1.05] mb-4"
          >
            Build your brand
          </motion.h1>
          
          <motion.div
            custom={0.2}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-4xl lg:text-5xl font-serif italic text-black/70 mb-6"
          >
            from the ground up
          </motion.div>
          
          <motion.p
            custom={0.3}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-lg text-black/60 leading-relaxed mb-10"
          >
            We help ambitious companies establish clear positioning, compelling messaging, and premium visual identities that resonate with their most valuable audiences.
          </motion.p>
          
          <motion.div
            custom={0.4}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link href="/contact">
              <motion.div
                whileHover={{ y: -2 }}
                className="group px-8 py-4 rounded-full bg-black text-white text-sm font-medium flex items-center justify-center gap-2 transition-transform hover:shadow-lg cursor-pointer"
              >
                Start a Project
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </motion.div>
            </Link>
            <Link href="/approach">
              <motion.div
                whileHover={{ y: -2 }}
                className="px-8 py-4 rounded-full border border-black/10 bg-black/5 text-black text-sm font-medium transition-all hover:bg-black/10 cursor-pointer text-center"
              >
                Our Approach
              </motion.div>
            </Link>
          </motion.div>
        </div>

        <div className="relative min-h-[760px] lg:min-h-[820px]">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-[640px] w-[640px] rounded-full border border-black/8" />
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              className="h-[780px] w-[780px] rounded-full border border-dashed border-black/7"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="h-[520px] w-[520px] rounded-full border border-dashed border-black/6"
            />
          </div>

          <div className="relative grid h-full grid-cols-2 gap-6 pt-4">
            <div className="translate-y-0 lg:translate-y-8">
              <FoundationCard
                index="01"
                eyebrow="STRATEGY"
                title="Positioning"
                body="Defining where your brand wins."
                icon="target"
                className="h-[292px]"
                rotate={0.6}
              />
            </div>

            <div className="translate-y-10 lg:translate-y-20">
              <FoundationCard
                index="02"
                eyebrow="IDENTITY"
                title="Visual Systems"
                body="The structure behind recognition."
                icon="pen"
                className="h-[316px]"
                rotate={2.4}
              />
            </div>

            <div className="translate-y-[-4px] lg:translate-y-2">
              <FoundationCard
                index="03"
                eyebrow="VOICE"
                title="Messaging"
                body="Language that creates clarity."
                icon="chat"
                className="h-[286px]"
                rotate={-1.8}
              />
            </div>

            <div className="translate-y-12 lg:translate-y-24">
              <FoundationCard
                index="04"
                eyebrow="EXPERIENCE"
                title="Brand Direction"
                body="Consistency across every touchpoint."
                icon="layers"
                className="h-[316px]"
                rotate={1.7}
              />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.42),transparent_30%)]" />
        </div>

      </div>
    </section>
  );
}
