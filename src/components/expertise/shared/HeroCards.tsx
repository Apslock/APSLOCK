"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform, MotionValue } from "framer-motion";

export function CardIcon({ type }: { type: "target" | "pen" | "chat" | "layers" }) {
  const common = "stroke-[1.8] stroke-current text-current";

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

export function ExpertiseHeroCard({
  index, title, eyebrow, body, icon, className, rotate, scrollY
}: {
  index: string; title: string; eyebrow: string; body: string;
  icon: "target" | "pen" | "chat" | "layers";
  className: string; rotate: number;
  scrollY: MotionValue<number>;
}) {
  let depth = 1.5;
  let exitVec = { x: [0, 0], y: [0, 200], rotate: [0, 0] };

  if (index === "01") {
    depth = 1.2;
    exitVec = { x: [0, -420], y: [0, -180], rotate: [0, -18] };
  } else if (index === "02") {
    depth = 2.0;
    exitVec = { x: [0, 320], y: [0, -120], rotate: [0, 14] };
  } else if (index === "03") {
    depth = 1.8;
    exitVec = { x: [0, -280], y: [0, 200], rotate: [0, 22] };
  } else if (index === "04") {
    depth = 2.5;
    exitVec = { x: [0, 340], y: [0, 220], rotate: [0, -20] };
  }

  const exitX = useTransform(scrollY, [0, 700], exitVec.x);
  const exitY = useTransform(scrollY, [0, 700], exitVec.y);
  const exitRot = useTransform(scrollY, [0, 700], exitVec.rotate);
  const exitOp = useTransform(scrollY, [200, 640], [1, 0]);
  const exitBlurV = useTransform(scrollY, [350, 640], [0, 14]);
  const exitBlurS = useTransform(exitBlurV, (v: number) => `blur(${v}px)`);

  const [isHovered, setIsHovered] = useState(false);
  const hoverScale = useSpring(1, { stiffness: 260, damping: 22, mass: 0.5 });
  useEffect(() => { hoverScale.set(isHovered ? 1.04 : 1); }, [isHovered, hoverScale]);

  return (
    <motion.div
      className={`group relative ${className}`}
      style={{
        x: exitX, y: exitY, rotate: exitRot, opacity: exitOp, filter: exitBlurS, zIndex: Math.floor(depth * 10), willChange: 'transform, opacity'
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{ rotate, scale: hoverScale }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="w-full h-full relative rounded-[28px] border border-white/70 bg-white/62 p-6 shadow-[0_20px_60px_rgba(31,41,55,0.08)] backdrop-blur-xl"
        >
          <div className="w-full h-full flex flex-col">
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/60 via-white/15 to-transparent opacity-80 pointer-events-none" />
            <div className="relative flex h-full flex-col z-10">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.15)]">
                  <CardIcon type={icon} />
                </div>
                <div className="text-sm font-medium tracking-[0.2em] text-black/22">{index}</div>
              </div>
              <div className="mt-8 text-[12px] font-medium tracking-[0.32em] text-black/42">{eyebrow}</div>
              <div className="mt-3 text-[26px] font-semibold tracking-tight text-black/93">{title}</div>
              <div className="mt-4 h-px w-8 bg-black/25" />
              <p className="mt-5 max-w-[24ch] text-[15px] leading-6 text-black/58">{body}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
