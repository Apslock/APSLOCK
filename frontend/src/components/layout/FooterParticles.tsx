"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
}

export default function FooterParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];

    function resize() {
      canvas!.width = canvas!.offsetWidth * DPR;
      canvas!.height = canvas!.offsetHeight * DPR;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function spawn() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;

      // Cone spread: particles shoot from bottom-right corner (w, h) toward upper-left
      // Cone angle: between 150° and 210° (pointing left), spread ±35°
      const baseAngle = Math.PI; // pointing left
      const spread = (Math.PI / 180) * 70; // 70° total cone
      const angle = baseAngle - spread / 2 + Math.random() * spread;

      const speed = 0.4 + Math.random() * 1.2;
      const maxLife = 180 + Math.random() * 220;

      particles.push({
        x: w,
        y: h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 0.8 + Math.random() * 2.2,
        alpha: 0,
        maxAlpha: 0.12 + Math.random() * 0.55,
        life: 0,
        maxLife,
      });
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      ctx!.clearRect(0, 0, w, h);

      // Spawn a few particles each frame
      if (particles.length < 220) {
        for (let i = 0; i < 2; i++) spawn();
      } else if (Math.random() < 0.6) {
        spawn();
      }

      // Mouse interaction offset
      const mx = mouse.current.x;
      const my = mouse.current.y;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Fade in first 15%, then fade out last 25%
        const t = p.life / p.maxLife;
        if (t < 0.15) {
          p.alpha = (t / 0.15) * p.maxAlpha;
        } else if (t > 0.75) {
          p.alpha = ((1 - t) / 0.25) * p.maxAlpha;
        } else {
          p.alpha = p.maxAlpha;
        }

        // Soft mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0.1) {
          const force = (1 - dist / 120) * 0.18;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Subtle gravity drift (slight upward float)
        p.vy -= 0.002;

        // Damping
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx;
        p.y += p.vy;

        // Distance from corner fade (radial mask — no hard edges)
        const cornerDist = Math.sqrt((p.x - w) ** 2 + (p.y - h) ** 2);
        const maxDist = Math.sqrt(w * w + h * h) * 0.75;
        const cornerFade = Math.max(0, 1 - cornerDist / maxDist);
        const finalAlpha = p.alpha * Math.pow(cornerFade, 1.4);

        if (p.life >= p.maxLife || finalAlpha < 0.004) {
          particles.splice(i, 1);
          continue;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(210,225,255,${finalAlpha.toFixed(3)})`;
        ctx!.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    resize();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouse.current.x = -9999; mouse.current.y = -9999; };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onLeave);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
}
