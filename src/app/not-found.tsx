import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "404 — Page Not Found | APSLOCK",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center min-h-[80svh] px-6 text-center relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Background number watermark */}
      <span
        aria-hidden="true"
        className="absolute select-none font-display font-black leading-none pointer-events-none"
        style={{
          fontSize: "clamp(12rem, 40vw, 32rem)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(10,10,10,0.05)",
          letterSpacing: "-0.05em",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          whiteSpace: "nowrap",
        }}
      >
        404
      </span>

      <div className="relative z-10 max-w-lg">
        <p className="text-eyebrow text-accent mb-6">Error 404</p>
        <h1 className="text-hero text-text mb-6">Page not found</h1>
        <p className="text-lg text-text-muted leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors duration-200 group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
