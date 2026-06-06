"use client";

import { useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: "up" | "left" | "right";
  scale?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, duration = 800, distance = 24, direction = "up", scale, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tx = direction === "left" ? `-${distance}px` : direction === "right" ? `${distance}px` : "0px";
    const ty = direction === "up" ? `${distance}px` : "0px";

    el.style.opacity = "0";
    el.style.transform = `translate(${tx}, ${ty})${scale ? ` scale(${scale})` : ""}`;
    el.style.transition = `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translate(0px, 0px) scale(1)";
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, duration, distance, direction, scale]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
