"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface AtmosphereAPI {
  setPalette: (name: "default" | "aurora" | "ember" | "cosmic") => void;
  setOptions: (opts: Record<string, unknown>) => void;
  triggerRipple: (x: number, y: number) => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    Atmosphere?: AtmosphereAPI;
  }
}

export default function Atmosphere({
  className = "",
  disableScrollFade = false,
  disableBackgroundEffects = false,
  anchorCorner = "center",
  compact = false,
}: {
  className?: string;
  disableScrollFade?: boolean;
  disableBackgroundEffects?: boolean;
  anchorCorner?: "center" | "bottom-right" | "bottom-left" | "top-right" | "top-left" | "right";
  compact?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const stateRef = useRef<{
    rafId: number | null;
    startTs: number | null;
    introComplete: boolean;
    lastTs: number;
    scrollAlpha: number;
    mouseX: number;
    mouseY: number;
    smoothMouseX: number;
    smoothMouseY: number;
    ripples: Array<{ x: number; y: number; ts: number }>;
    w: number;
    h: number;
    cx: number;
    cy: number;
    pData: Float32Array;
    sData: Float32Array;
    hData: Float32Array;
    destroyed: boolean;
  }>({
    rafId: null,
    startTs: null,
    introComplete: false,
    lastTs: 0,
    scrollAlpha: 1,
    mouseX: -9999,
    mouseY: -9999,
    smoothMouseX: -9999,
    smoothMouseY: -9999,
    ripples: [],
    w: 0,
    h: 0,
    cx: 0,
    cy: 0,
    pData: new Float32Array(0),
    sData: new Float32Array(0),
    hData: new Float32Array(0),
    destroyed: false,
  });

  const getCount = useCallback(() => {
    const threads = navigator.hardwareConcurrency || 4;
    return threads >= 8 ? 2800 : threads >= 4 ? 1800 : 900;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const TAU = Math.PI * 2;
    const DPR = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const COUNT = getCount();
    const HAZE = 44;

    const CFG = {
      STAR_COUNT: compact ? 120 : 180,
      STRIDE: 11,
      RADIUS_BIAS: 0.55,
      DEPTH_BIAS: 1.60,
      ELLIPSE_Y: 0.75,
      FIELD_R: compact ? 140 : 220,
      FADE_X: compact ? 160 : 260,
      FADE_Y: compact ? 160 : 260,
      FADE_POW_X: 1.40,
      FADE_POW_Y: 1.40,
      SWIRL_AMP: compact ? 10 : 18,
      BREATHE_AMP: compact ? 4 : 7,
      INTRO_MS: 1500,
      MOUSE_RADIUS: 140,
      MOUSE_FORCE: 24,
      MOUSE_LERP: 0.075,
      RIPPLE_MS: 1100,
      RIPPLE_FORCE: 20,
      MAX_RIPPLES: 4,
    };

    const F = {
      BREATHE: 0.11731,
      GLOBAL: 0.049793,
      SWIRL: 0.079189,
      DEFORM_X: 0.14741,
      DEFORM_Y: 0.12113,
      MACRO_A: 0.02917,
      MACRO_B: 0.01873,
      MACRO_C: 0.03541,
      NEBULA_BR: 0.07813,
      STAR_TWK: 0.29,
      HAZE_ORB: 0.031,
      THERM_A: 3.7319,
      THERM_B: 5.1731,
    };

    const PALETTES = {
      default: [
        "rgba(215,232,255,",
        "rgba(255,255,255,",
        "rgba(255,245,218,",
        "rgba(234,218,255,",
      ],
      aurora: [
        "rgba(160,255,200,",
        "rgba(195,245,255,",
        "rgba(255,255,255,",
        "rgba(200,170,255,",
      ],
      ember: [
        "rgba(255,205,145,",
        "rgba(255,232,195,",
        "rgba(255,255,255,",
        "rgba(255,168,90, ",
      ],
      cosmic: [
        "rgba(165,145,255,",
        "rgba(255,255,255,",
        "rgba(145,195,255,",
        "rgba(215,170,255,",
      ],
    };

    let COLORS = [...PALETTES.default];

    const s = stateRef.current;
    s.destroyed = false;
    s.pData = new Float32Array(COUNT * CFG.STRIDE);
    s.sData = new Float32Array(CFG.STAR_COUNT * 5);
    s.hData = new Float32Array(HAZE * 7);

    // Init particles
    for (let i = 0; i < COUNT; i++) {
      const b = i * CFG.STRIDE;
      const dep = Math.pow(Math.random(), CFG.DEPTH_BIAS);
      const rad = Math.pow(Math.random(), CFG.RADIUS_BIAS) * CFG.FIELD_R;
      const rnd = Math.random();
      const keplerScale = Math.pow(Math.max(rad, 8) / CFG.FIELD_R, -0.18);
      
      s.pData[b] = Math.random() * TAU;          // full 360° spread
      s.pData[b + 1] = rad;
      s.pData[b + 2] = 20 + Math.random() * 80;  // tighter drift range
      
      const baseSize = Math.random() < 0.85 ? Math.random() * 0.9 + 0.15 : Math.random() * 1.6 + 0.5;
      s.pData[b + 3] = compact ? baseSize * 0.6 : baseSize; 

      s.pData[b + 4] = 0.05 + Math.random() * 0.28;  // moderate alpha
      s.pData[b + 5] = (0.008 + Math.random() * 0.045) * keplerScale;
      s.pData[b + 6] = dep;
      s.pData[b + 7] = Math.random() * TAU;
      s.pData[b + 8] = Math.random() * 1000;
      s.pData[b + 9] = Math.random() * 1000;
      s.pData[b + 10] = rnd < 0.15 ? 0 : rnd < 0.77 ? 1 : rnd < 0.91 ? 2 : 3;
    }

    // Init stars
    for (let i = 0; i < CFG.STAR_COUNT; i++) {
      const b = i * 5;
      const r = 0.30 + Math.random() * 0.70;
      const ang = Math.random() * TAU;
      s.sData[b] = 0.50 + Math.cos(ang) * r * 0.47;
      s.sData[b + 1] = 0.50 + Math.sin(ang) * r * 0.41;
      s.sData[b + 2] = 0.22 + Math.random() * 0.62;
      s.sData[b + 3] = 0.08 + Math.random() * 0.22;
      s.sData[b + 4] = Math.random() * TAU;
    }

    // Init haze
    for (let i = 0; i < HAZE; i++) {
      const b = i * 7;
      s.hData[b] = Math.random() * TAU;
      s.hData[b + 1] = 55 + Math.random() * 355;
      s.hData[b + 2] = 3.8 + Math.random() * 5.2;
      s.hData[b + 3] = 0.015 + Math.random() * 0.065;
      s.hData[b + 4] = 0.003 + Math.random() * 0.013;
      s.hData[b + 5] = Math.random() * TAU;
      s.hData[b + 6] = Math.random() * 1000;
    }

    function resize() {
      s.w = canvas!.clientWidth || window.innerWidth;
      s.h = canvas!.clientHeight || window.innerHeight;
      canvas!.width = Math.round(s.w * DPR);
      canvas!.height = Math.round(s.h * DPR);
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (anchorCorner === "bottom-right") { s.cx = s.w; s.cy = s.h; }
      else if (anchorCorner === "bottom-left") { s.cx = 0; s.cy = s.h; }
      else if (anchorCorner === "top-right") { s.cx = s.w; s.cy = 0; }
      else if (anchorCorner === "top-left") { s.cx = 0; s.cy = 0; }
      else if (anchorCorner === "right") { s.cx = s.w; s.cy = s.h * 0.50; }
      else { s.cx = s.w * 0.50; s.cy = s.h * 0.50; }
    }

    function drawGlows(t: number) {
      // Subtle, wide glows — not a blob, just ambient tinting
      const dAx = Math.sin(t * F.MACRO_A) * 80;
      const dAy = Math.cos(t * F.MACRO_A * 1.3133) * 40;
      const dBx = Math.cos(t * F.MACRO_B) * 120;
      const dBy = Math.sin(t * F.MACRO_B * 1.4719) * 60;

      const g1 = ctx!.createRadialGradient(s.cx + dAx, s.cy + dAy, 50, s.cx + dAx, s.cy + dAy, 700);
      g1.addColorStop(0, "rgba(200,218,255,0.022)");
      g1.addColorStop(0.5, "rgba(200,215,255,0.006)");
      g1.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = g1;
      ctx!.fillRect(0, 0, s.w, s.h);

      const g2 = ctx!.createRadialGradient(s.cx - dBx, s.cy - dBy, 30, s.cx - dBx, s.cy - dBy, 500);
      g2.addColorStop(0, "rgba(175,145,255,0.018)");
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = g2;
      ctx!.fillRect(0, 0, s.w, s.h);
    }

    function drawStars(t: number, ia: number) {
      for (let i = 0; i < CFG.STAR_COUNT; i++) {
        const b = i * 5;
        const sx = s.sData[b] * s.w;
        const sy = s.sData[b + 1] * s.h;
        const fa = s.sData[b + 3] * (0.55 + 0.45 * Math.sin(t * F.STAR_TWK + s.sData[b + 4])) * ia * s.scrollAlpha;
        if (fa < 0.004) continue;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(232,242,255,${fa.toFixed(3)})`;
        ctx!.arc(sx, sy, s.sData[b + 2], 0, TAU);
        ctx!.fill();
      }
    }

    function drawParticles(t: number, ia: number, now: number) {
      const hasMouse = s.smoothMouseX > -100;
      const hasRipples = s.ripples.length > 0;

      for (let i = 0; i < COUNT; i++) {
        const b = i * CFG.STRIDE;
        const angle = s.pData[b];
        const rad = s.pData[b + 1];
        const sprd = s.pData[b + 2];
        const size = s.pData[b + 3];
        const alpha = s.pData[b + 4];
        const speed = s.pData[b + 5];
        const depth = s.pData[b + 6];
        const phase = s.pData[b + 7];
        const drift = s.pData[b + 8];
        const swirl = s.pData[b + 9];
        const ci = s.pData[b + 10] | 0;

        const breathe = Math.sin(t * F.BREATHE + phase) * CFG.BREATHE_AMP;
        const localFlow = Math.sin(t * speed + drift) * sprd;
        const swirlAmt = Math.cos(t * F.SWIRL + swirl) * CFG.SWIRL_AMP;
        const a = angle + Math.sin(t * F.GLOBAL + phase) * 0.13;
        const r = rad + breathe + localFlow * 0.08;

        let x = s.cx + Math.cos(a) * r;
        let y = s.cy + Math.sin(a) * r * CFG.ELLIPSE_Y;

        x += Math.sin(y * 0.004 + t * F.DEFORM_X) * swirlAmt * depth;
        y += Math.cos(x * 0.003 + t * F.DEFORM_Y) * swirlAmt * 0.6 * depth;

        const thermal = Math.sin(t * F.THERM_A + phase * 7.1327) * 1.65
                      + Math.cos(t * F.THERM_B + phase * 4.8713) * 1.05;
        x += thermal * depth * 0.82;
        y += thermal * depth * 0.52;

        if (hasMouse) {
          const mdx = x - s.smoothMouseX;
          const mdy = y - s.smoothMouseY;
          const md2 = mdx * mdx + mdy * mdy;
          const mr2 = CFG.MOUSE_RADIUS * CFG.MOUSE_RADIUS;
          if (md2 < mr2 && md2 > 0.01) {
            const mdist = Math.sqrt(md2);
            const force = (1 - mdist / CFG.MOUSE_RADIUS);
            const push = force * force * CFG.MOUSE_FORCE * (0.35 + depth * 0.95);
            x += (mdx / mdist) * push;
            y += (mdy / mdist) * push * 0.72;
          }
        }

        if (hasRipples) {
          for (let ri = 0; ri < s.ripples.length; ri++) {
            const rip = s.ripples[ri];
            const age = (now - rip.ts) * 0.001;
            const ringR = 28 + age * 310;
            const rdx = x - rip.x;
            const rdy = y - rip.y;
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            const ring = Math.exp(-Math.pow(rdist - ringR, 2) / (ringR * 0.28 + 1));
            const push = ring * Math.exp(-age * 4.0) * CFG.RIPPLE_FORCE * (0.3 + depth * 0.85);
            if (rdist > 0.1 && push > 0.08) {
              x += (rdx / rdist) * push;
              y += (rdy / rdist) * push * 0.68;
            }
          }
        }

        if (x < -30 || x > s.w + 30 || y < -30 || y > s.h + 30) continue;

        const sf = 1 - Math.min(1, Math.abs((x - s.cx) / CFG.FADE_X));
        const vf = 1 - Math.min(1, Math.abs((y - s.cy) / CFG.FADE_Y));
        const fa = alpha
                   * Math.pow(sf, CFG.FADE_POW_X)
                   * Math.pow(vf, CFG.FADE_POW_Y)
                   * (0.70 + depth * 0.80)
                   * ia * s.scrollAlpha;

        if (fa < 0.003) continue;
        ctx!.beginPath();
        ctx!.fillStyle = COLORS[ci] + fa.toFixed(3) + ")";
        ctx!.arc(x, y, size * (0.9 + depth), 0, TAU);
        ctx!.fill();
      }
    }

    function drawHaze(t: number, ia: number) {
      for (let i = 0; i < HAZE; i++) {
        const b = i * 7;
        const ang = s.hData[b] + Math.sin(t * F.HAZE_ORB + s.hData[b + 5]) * 0.09;
        const r = s.hData[b + 1] + Math.sin(t * s.hData[b + 4] + s.hData[b + 6]) * 32;
        const x = s.cx + Math.cos(ang) * r;
        const y = s.cy + Math.sin(ang) * r * CFG.ELLIPSE_Y;
        const sf = 1 - Math.min(1, Math.abs((x - s.cx) / (CFG.FADE_X * 1.35)));
        const vf = 1 - Math.min(1, Math.abs((y - s.cy) / (CFG.FADE_Y * 1.35)));
        const fa = s.hData[b + 3] * sf * vf * ia * s.scrollAlpha;
        if (fa < 0.003) continue;
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(218,234,255,${fa.toFixed(3)})`;
        ctx!.arc(x, y, s.hData[b + 2], 0, TAU);
        ctx!.fill();
      }
    }

    function _renderFrame(t: number, ia: number, now: number) {
      ctx!.clearRect(0, 0, s.w, s.h);
      if (!disableBackgroundEffects) {
        drawGlows(t);
      }
      drawStars(t, ia);
      drawParticles(t, ia, now);
      drawHaze(t, ia);
    }

    function drawStatic() {
      resize();
      _renderFrame(3.7, 1, performance.now());
    }

    function startLoop() {
      if (s.rafId || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      s.lastTs = performance.now();
      s.rafId = requestAnimationFrame(draw);
    }

    function stopLoop() {
      if (s.rafId) cancelAnimationFrame(s.rafId);
      s.rafId = null;
    }

    function draw(ts: number) {
      if (s.destroyed) return;
      try {
        if (s.startTs === null) s.startTs = ts;

        let ia;
        if (!s.introComplete) {
          const raw = Math.min(1, (ts - s.startTs) / CFG.INTRO_MS);
          ia = 1 - Math.pow(1 - raw, 3);
          if (raw >= 1) s.introComplete = true;
        } else {
          ia = 1;
        }

        const dt = Math.min((ts - s.lastTs) / 16.667, 3.0);
        s.lastTs = ts;

        const t = ts * 0.001;

        if (s.smoothMouseX < -100) {
          s.smoothMouseX = s.mouseX;
          s.smoothMouseY = s.mouseY;
        } else {
          const lf = 1 - Math.pow(1 - CFG.MOUSE_LERP, dt);
          s.smoothMouseX += (s.mouseX - s.smoothMouseX) * lf;
          s.smoothMouseY += (s.mouseY - s.smoothMouseY) * lf;
        }

        const expiry = ts - CFG.RIPPLE_MS;
        while (s.ripples.length && s.ripples[0].ts < expiry) s.ripples.shift();

        _renderFrame(t, ia, ts);
      } catch (err) {
        console.warn("[Atmosphere] draw error — static fallback.", err);
        stopLoop();
        try { drawStatic(); } catch { /* silent */ }
        return;
      }
      s.rafId = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      s.mouseX = e.clientX - rect.left;
      s.mouseY = e.clientY - rect.top;
    }

    function onTouchMove(e: TouchEvent) {
      if (!e.touches.length) return;
      const rect = canvas!.getBoundingClientRect();
      s.mouseX = e.touches[0].clientX - rect.left;
      s.mouseY = e.touches[0].clientY - rect.top;
    }

    function onPointerLeave() {
      s.mouseX = -9999;
      s.mouseY = -9999;
    }

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const rect = canvas!.getBoundingClientRect();
      let cx = 0, cy = 0;
      if ('touches' in e && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if ('clientX' in e) {
        cx = (e as MouseEvent).clientX;
        cy = (e as MouseEvent).clientY;
      }
      const rx = cx - rect.left;
      const ry = cy - rect.top;
      
      if (s.ripples.length >= CFG.MAX_RIPPLES) s.ripples.shift();
      s.ripples.push({ x: rx, y: ry, ts: performance.now() });
    }

    function onScroll() {
      if (disableScrollFade) { s.scrollAlpha = 1; return; }
      s.scrollAlpha = Math.max(0, 1 - (window.scrollY || 0) / 480);
    }

    function onVisibilityChange() {
      if (s.destroyed) return;
      if (document.hidden) stopLoop();
      else startLoop();
    }

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) drawStatic();
    });
    ro.observe(container);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousedown", onPointerDown, { passive: true });
    window.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("mouseleave", onPointerLeave);
    document.addEventListener("touchend", onPointerLeave, { passive: true });
    document.addEventListener("touchcancel", onPointerLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    // If scroll-fade is disabled, ensure alpha starts at 1 immediately
    if (disableScrollFade) s.scrollAlpha = 1;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      drawStatic();
    } else {
      s.startTs = null;
      s.rafId = requestAnimationFrame(draw);
    }

    // Export public API to window if needed
    window.Atmosphere = {
      setPalette: (name: 'default'|'aurora'|'ember'|'cosmic') => {
        if (PALETTES[name]) COLORS = [...PALETTES[name]];
      },
      setOptions: (opts: Record<string, unknown>) => {
        Object.assign(CFG, opts);
      },
      triggerRipple: (x: number, y: number) => {
        if (s.ripples.length >= CFG.MAX_RIPPLES) s.ripples.shift();
        s.ripples.push({ x, y, ts: performance.now() });
      },
      pause: stopLoop,
      resume: startLoop,
      destroy: () => {},
    };

    return () => {
      s.destroyed = true;
      if (s.rafId) cancelAnimationFrame(s.rafId);
      s.rafId = null;
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("mouseleave", onPointerLeave);
      document.removeEventListener("touchend", onPointerLeave);
      document.removeEventListener("touchcancel", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (window.Atmosphere) delete window.Atmosphere;
    };
  }, [getCount, anchorCorner, compact, disableBackgroundEffects, disableScrollFade]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      role="img"
      aria-label="Animated atmospheric nebula — an interactive living field of light"
      style={{ background: "transparent" }}
    >
      <span className="sr-only">
        A deep-space atmospheric particle field: thousands of spectral light
        particles drift in an organic nebula formation. Move your cursor or
        touch the screen to disturb the field; click or tap to send an
        expanding ripple through the particles.
      </span>

      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ willChange: "transform", transform: "translateZ(0)" }}
      />
      
      {/* Cinematic vignette */}
      {!disableBackgroundEffects && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 30%, rgba(20, 18, 16, 0.6) 100%)",
          }}
        />
      )}
      
      {/* Film grain */}
      {!disableBackgroundEffects && (
        <div
          aria-hidden="true"
          className="absolute pointer-events-none z-20"
          style={{
            inset: "-150%",
            width: "400%",
            height: "400%",
            opacity: 0.038,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "256px 256px",
            animation: "atm-grain-shift 0.82s steps(1) infinite",
          }}
        />
      )}
    </div>
  );
}
