"use client";

import { useEffect, useRef } from "react";

export default function SpinningText() {
  const ref = useRef<HTMLDivElement>(null);

  // Continuous rotation via requestAnimationFrame for a smooth, always-alive feel.
  // Scroll speed is layered on top: scrolling faster → spins faster.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let angle = 0;
    let lastScroll = window.scrollY;
    let raf: number;

    const BASE_SPEED = 0.25; // degrees per frame

    const tick = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - lastScroll;
      lastScroll = currentScroll;

      // Base rotation + scroll boost (scroll faster → spin faster)
      angle += BASE_SPEED + Math.abs(delta) * 0.15;
      el.style.transform = `rotate(${angle}deg)`;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute -top-[5vh] lg:-top-[25vh] -right-[15vw] lg:-right-[15vw] w-[40vh] lg:w-[90vh] h-[40vh] lg:h-[90vh] text-text-muted/40 pointer-events-none select-none z-0 mt-[4em]"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <path
          id="circlePath"
          fill="none"
          d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
        />
        <text className="font-display text-[0.7rem] lg:text-[1.4rem] font-bold uppercase tracking-[0.25em]" fill="currentColor">
          <textPath href="#circlePath" startOffset="0%">
            {"LET'S CREATE THINGS • LET'S CREATE THINGS • "}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
