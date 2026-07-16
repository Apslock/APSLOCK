"use client";

/**
 * GrainBlobs — Corner-anchored breathing blobs with film grain texture.
 *
 * Behaviour:
 *  - Blob A (top-right)   : emerges from corner, breathes in/out, drifts inward on exhale
 *  - Blob B (bottom-left) : same but from opposite corner, offset timing
 *  - Blob C (accent)      : mid-right subtle drift, no corner entrance
 *  - Film grain overlay   : tiled SVG noise for premium texture
 */

interface GrainBlobsProps {
  variant?: "amber" | "sage" | "blush" | "slate";
  intensity?: number;   // 0–1, grain opacity (default 0.18)
  animate?: boolean;
  className?: string;
  showAccent?: boolean;
}

/**
 * Colours are intentionally punchy enough to read on the cream #FAFAF7 background.
 * core  = the dense center of the blob (strongest)
 * mid   = the mid-ring
 * edge  = feathered outer glow
 */
const PALETTE: Record<string, { core: string; mid: string; edge: string }> = {
  amber: {
    core: "rgba(235, 145, 55, 0.85)",   // Brighter, softer orange
    mid:  "rgba(240, 185, 85, 0.65)",   // Warm amber ring
    edge: "rgba(245, 215, 145, 0.40)",  // Soft pale gold haze
  },
  sage: {
    core: "rgba(40, 115, 75, 0.85)",
    mid:  "rgba(75, 140, 100, 0.65)",
    edge: "rgba(120, 175, 140, 0.35)",
  },
  blush: {
    core: "rgba(195, 60, 70, 0.85)",
    mid:  "rgba(185, 105, 100, 0.65)",
    edge: "rgba(230, 165, 155, 0.35)",
  },
  slate: {
    core: "rgba(45, 75, 145, 0.88)",
    mid:  "rgba(80, 110, 170, 0.65)",
    edge: "rgba(135, 165, 215, 0.35)",
  },
};

// Tiled grain SVG — overlay blend for premium texture
const GRAIN_BG = [
  "url(\"data:image/svg+xml,",
  "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>",
  "<filter id='g'>",
  "<feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' seed='8' stitchTiles='stitch'/>",
  "<feColorMatrix type='saturate' values='0'/>",
  "</filter>",
  "<rect width='200' height='200' filter='url(%23g)' opacity='1'/>",
  "</svg>\")",
].join("");

export default function GrainBlobs({
  variant = "amber",
  intensity = 0.18,
  animate = true,
  className = "",
  showAccent = true,
}: GrainBlobsProps) {
  const pal = PALETTE[variant] ?? PALETTE.amber;

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* ── Blob A — Top-right corner ──────────────────────────────
          Breathes outward (scale up) into the page, then retreats.
          transform-origin: top right → scale anchors to the corner.
          Large size so when it scales up you really feel it cross the page.
      ─────────────────────────────────────────────────────────── */}
      <div
        className={animate ? "blob-drift-a" : undefined}
        style={{
          position: "absolute",
          top: "-20%",
          right: "-20%",
          width: "90vw",
          height: "130vh",
          maxWidth: 1500,
          background: `
            radial-gradient(ellipse at 95% 5%,  ${pal.core} 0%, transparent 38%),
            radial-gradient(ellipse at 82% 18%, ${pal.mid}  5%, transparent 55%),
            radial-gradient(ellipse at 65% 35%, ${pal.edge} 15%, transparent 80%)
          `,
          filter: "blur(80px)",
          willChange: "transform, opacity",
        }}
      />

      {/* ── Blob B — Bottom-left corner ─────────────────────────────
          Mirror of Blob A, opposite corner.
          transform-origin: bottom left → scale from that corner.
          Delayed entrance so it unfolds after the primary blob.
      ─────────────────────────────────────────────────────────── */}
      <div
        className={animate ? "blob-drift-b" : undefined}
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-20%",
          width: "80vw",
          height: "110vh",
          maxWidth: 1300,
          background: `
            radial-gradient(ellipse at 5% 95%,  ${pal.core} 0%, transparent 40%),
            radial-gradient(ellipse at 18% 80%, ${pal.mid}  8%, transparent 58%),
            radial-gradient(ellipse at 35% 62%, ${pal.edge} 18%, transparent 85%)
          `,
          filter: "blur(90px)",
          willChange: "transform, opacity",
        }}
      />

      {/* ── Blob C — Accent, mid-right ──────────────────────────────
          Soft secondary presence with lazy vertical drift.
          No corner entrance — just ambient breathing.
      ─────────────────────────────────────────────────────────── */}
      {showAccent && (
        <div
          className={animate ? "blob-drift-c" : undefined}
          style={{
            position: "absolute",
            top: "25%",
            right: "-8%",
            width: "45vw",
            height: "55vh",
            maxWidth: 750,
            background: `
              radial-gradient(ellipse at 90% 50%, ${pal.mid}  0%, transparent 52%),
              radial-gradient(ellipse at 75% 62%, ${pal.edge} 10%, transparent 78%)
            `,
            filter: "blur(65px)",
            opacity: 0.8,
            willChange: "transform",
          }}
        />
      )}

      {/* ── Film grain overlay ───────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: GRAIN_BG,
          backgroundRepeat: "repeat",
          backgroundSize: "150px 150px",
          opacity: intensity,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
