"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import FadeIn from "@/components/shared/FadeIn";
import GrainBlobs from "@/components/shared/GrainBlobs";
import { motion, AnimatePresence } from "framer-motion";
import type { HeroContent } from "@/lib/data";

interface HeroProps {
  content: HeroContent;
}

// The original resolution of the retro-tvs image asset.
const TV_FRAME_SIZE = {
  width: 1024,
  height: 1024,
};

// Precise pixel coordinates of the three TV screen boundaries inside the 1024x1024 artwork.
// These coordinates correspond to the original chroma-key regions of the artwork.
const TV_SCREENS = [
  { x: 356, y: 87, w: 245, h: 191 },  // Top TV screen
  { x: 355, y: 445, w: 247, h: 194 }, // Middle TV screen
  { x: 353, y: 721, w: 249, h: 197 }, // Bottom TV screen
];

export default function Hero({ content }: HeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const isVisibleRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const animationIdRef = useRef<number | null>(null);

  const wordColors = [
    "text-[#B85C38]", // Terracotta (notice)
    "text-[#2A9D8F]", // Deep Teal (trust)
    "text-[#862020]", // Deep Maroon (remember)
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % content.headlineWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [content.headlineWords.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx = maybeCtx;

    let mediaElements: (HTMLVideoElement | HTMLImageElement)[] = [];
    let startAnimation: () => void = () => {};
    let stopAnimation: () => void = () => {};

    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      const W = img.naturalWidth;
      const H = img.naturalHeight;
      canvas.width = W;
      canvas.height = H;

      // Create GPU-optimized bitmap directly from the preprocessed transparent asset
      const processedBitmap = await createImageBitmap(img);
      const bounds = TV_SCREENS;

      // --- Step 2: Create media elements ---
      const mediaSrcs = [
        { type: "video", src: "/videos/video-top.mp4" },
        { type: "video", src: "/videos/video-mid.mp4" },
        { type: "video", src: "/videos/video-bot.mp4" },
      ];

      let readyCount = 0;
      mediaElements = [];

      const checkReady = () => {
        readyCount++;
        if (readyCount === 3) {
          setReady(true);
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            isVisibleRef.current = rect.top < window.innerHeight && rect.bottom > 0;
          }
          if (isVisibleRef.current) {
            startAnimation();
          } else {
            mediaElements.forEach((m) => {
              if (m instanceof HTMLVideoElement) m.pause();
            });
          }
        }
      };

      mediaSrcs.forEach((item, idx) => {
        if (item.type === "video") {
          const video = document.createElement("video");
          video.loop = true;
          video.muted = true;
          video.playsInline = true;
          video.crossOrigin = "anonymous";
          video.src = item.src;
          mediaElements[idx] = video;
          video.addEventListener("canplaythrough", checkReady, { once: true });
          video.load();
        } else {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = item.src;
          mediaElements[idx] = img;
          img.onload = checkReady;
        }
      });

      // --- Step 3: requestAnimationFrame render loop controller functions ---
      startAnimation = () => {
        if (isAnimatingRef.current || !isVisibleRef.current) return;
        isAnimatingRef.current = true;

        mediaElements.forEach((m) => {
          if (m instanceof HTMLVideoElement && m.paused) {
            m.play().catch(e => console.error("Video play failed:", e));
          }
        });

        const startTime = performance.now();
        function frame(time: number) {
          if (!isAnimatingRef.current) return;
          ctx.clearRect(0, 0, W, H);

          // Draw each media into its TV bounding box
          for (let i = 0; i < 3; i++) {
            const m = mediaElements[i];
            const b = bounds[i];
            
            let isReady = false;
            let mWidth = 0, mHeight = 0;
            
            if (m instanceof HTMLVideoElement) {
              isReady = m.readyState >= 2;
              mWidth = m.videoWidth;
              mHeight = m.videoHeight;
            } else if (m instanceof HTMLImageElement) {
              isReady = m.complete;
              mWidth = m.width;
              mHeight = m.height;
            }

            if (isReady && b.w > 0) {
              // Calculate object-fit: cover to prevent stretching
              const mediaAspect = mWidth / mHeight;
              const boxAspect = b.w / b.h;

              let sx = 0, sy = 0, sw = mWidth, sh = mHeight;

              if (mediaAspect > boxAspect) {
                // Media is wider than the box, crop sides
                sw = mHeight * boxAspect;
                sx = (mWidth - sw) / 2;
                
                // Add slow cinematic pan for image
                if (m instanceof HTMLImageElement) {
                  const elapsed = (time - startTime) / 1000;
                  const panRange = mWidth - sw;
                  sx = (panRange / 2) + Math.sin(elapsed * 0.2) * (panRange / 2);
                }
              } else {
                // Media is taller than the box, crop top/bottom
                sh = mWidth / boxAspect;
                sy = (mHeight - sh) / 2;
                
                // Add slow cinematic pan for image
                if (m instanceof HTMLImageElement) {
                  const elapsed = (time - startTime) / 1000;
                  const panRange = mHeight - sh;
                  sy = (panRange / 2) + Math.sin(elapsed * 0.2) * (panRange / 2);
                }
              }

              ctx.drawImage(m, sx, sy, sw, sh, b.x, b.y, b.w, b.h);
            }
          }

          // Draw the processed TV frame on top (green holes are transparent)
          ctx.drawImage(processedBitmap, 0, 0);

          if (isAnimatingRef.current) {
            animationIdRef.current = requestAnimationFrame(frame);
          }
        }
        animationIdRef.current = requestAnimationFrame(frame);
      };

      stopAnimation = () => {
        if (!isAnimatingRef.current) return;
        isAnimatingRef.current = false;
        if (animationIdRef.current !== null) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }
        mediaElements.forEach((m) => {
          if (m instanceof HTMLVideoElement) {
            m.pause();
          }
        });
      };
    };
    img.src = "/images/home/retro-tvs-transparent.png";

    // --- Step 4: Intersection Observer for visibility tracking ---
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // --- Cleanup on unmount ---
    return () => {
      observer.disconnect();
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
      mediaElements.forEach((m) => {
        if (m instanceof HTMLVideoElement) {
          m.pause();
          m.src = "";
        }
      });
      animationIdRef.current = null;
      isAnimatingRef.current = false;
      isVisibleRef.current = false;
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[var(--bg)] gradient-hero">
      <GrainBlobs variant="slate" intensity={0.08} className="opacity-40" />
      <div className="w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
          {/* Left — text (padded for readability) */}
          <div className="order-2 lg:order-1 px-6 md:px-12 lg:pl-16 xl:pl-24 lg:pr-8">
            <FadeIn>
              <div className="flex flex-col items-start leading-[1.1] tracking-[-0.03em] text-text mb-8">
                {/* Line 1 & 2: Static Prefix & Script */}
                <div className="text-[clamp(3rem,5vw,5.5rem)] font-editorial font-bold text-[var(--text)]">
                  <span className="block">{content.headlinePrefix}</span>
                  <span className="block">{content.headlineScript}</span>
                </div>
                
                {/* Line 2: [Animated Words] */}
                <div className="mt-[0.5rem] md:mt-[0.25rem]">
                  <span className="relative inline-flex items-center min-w-[280px] lg:min-w-[450px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={wordIndex}
                        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: 0.1, duration: 0.8 } }}
                        exit={{ opacity: 0, y: -20, filter: "blur(12px)", transition: { duration: 0.4 } }}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-script text-[clamp(4.5rem,7vw,8.5rem)] leading-[0.8] tracking-normal font-medium ${wordColors[wordIndex]}`}
                      >
                        {content.headlineWords[wordIndex]}
                      </motion.span>
                    </AnimatePresence>
                    {/* Invisible spacer to maintain height/width */}
                    <span className="invisible pointer-events-none whitespace-nowrap font-script text-[clamp(4.5rem,7vw,8.5rem)] leading-[0.8] tracking-normal font-medium">remember.</span>
                  </span>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p 
                className="mt-6 text-lg md:text-xl text-text-muted leading-relaxed max-w-xl"
                dangerouslySetInnerHTML={{ __html: content.subline }}
              />
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href={content.primaryCta.href}
                  className="inline-flex items-center px-8 py-4 text-base font-medium bg-accent text-bg rounded-full hover:bg-accent-hover transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  {content.primaryCta.label}
                </Link>
                <Link
                  href={content.secondaryCta.href}
                  className="inline-flex items-center px-8 py-4 text-base font-medium text-text border border-border rounded-full hover:border-text transition-all duration-200"
                >
                  {content.secondaryCta.label}
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Right — retro TVs, full-bleed (no padding) */}
          <FadeIn delay={0.15} direction="left" className="order-1 lg:order-2">
            <div className="relative flex items-center justify-center" style={{ maxWidth: '75%', margin: '0 auto', transform: 'scale(1.1)' }}>
              {/* Fallback shown while canvas processes — same layout footprint, no shift */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/home/retro-tvs-transparent.png"
                alt="Stacked retro TVs"
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto object-contain"
                style={{ opacity: 0 }}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-auto"
                style={{
                  opacity: ready ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              />
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}
