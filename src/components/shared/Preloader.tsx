"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const hasPreloaded = sessionStorage.getItem("apslock-preloaded");
    if (hasPreloaded === "true") {
      setShow(false);
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    // Snappy reveal duration
    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("apslock-preloaded", "true");
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 800);
    }, 1400);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  const logoLetters = ["A", "P", "S", "L", "O", "C", "K"];

  // Animation variants
  const containerVariants = {
    initial: {
      y: 0,
    },
    exit: {
      y: "-100%",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as any, // Custom cinematic cubic-bezier
        when: "afterChildren",
      },
    },
  };

  const letterVariants = {
    initial: {
      y: 8,
      opacity: 0,
    },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.55,
        delay: i * 0.05 + 0.15,
        ease: [0.215, 0.61, 0.355, 1] as any,
      },
    }),
  };

  const textVariants = {
    initial: {
      opacity: 0,
      y: 5,
    },
    animate: {
      opacity: 0.4,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.65,
        ease: "easeOut" as any,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          id="apslock-preloader"
          variants={containerVariants}
          initial="initial"
          exit="exit"
          suppressHydrationWarning
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0D0D0D] pointer-events-auto"
          style={{ willChange: "transform" }}
        >
          {/* Subtle noise grain for premium texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative flex flex-col items-center select-none">
            {/* Word Mark - Fixed height, visible overflow, and no-wrap to prevent cutoffs */}
            <div 
              className="flex flex-row flex-nowrap items-center justify-center whitespace-nowrap mb-4 pb-2 h-14"
              style={{ overflow: "visible" }}
            >
              {logoLetters.map((char, index) => (
                <motion.span
                  key={index}
                  custom={index}
                  variants={letterVariants}
                  initial="initial"
                  animate="animate"
                  className="font-display text-4xl sm:text-5xl font-medium tracking-[0.25em] text-[#FAFAF7] inline-block last:mr-0"
                  style={{ marginRight: "0.25em", willChange: "transform, opacity" }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Subtext only */}
            <div className="min-h-[20px] flex items-center justify-center">
              <motion.p
                variants={textVariants}
                initial="initial"
                animate="animate"
                className="font-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#FAFAF7]"
              >
                Atlanta Digital Studio
              </motion.p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
