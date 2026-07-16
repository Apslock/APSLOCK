"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Report to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      // e.g. Sentry.captureException(error);
    }
  }, [error]);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center min-h-[80svh] px-6 text-center relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Background watermark */}
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
        500
      </span>

      <div className="relative z-10 max-w-lg">
        <p className="text-eyebrow text-accent mb-6">Error 500</p>
        <h1 className="text-hero text-text mb-6">Something went wrong</h1>
        <p className="text-lg text-text-muted leading-relaxed mb-10">
          An unexpected error occurred. Our team has been notified. You can try
          refreshing the page or go back to the homepage.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent text-white font-medium text-sm hover:bg-accent-hover transition-colors duration-200"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border text-text font-medium text-sm hover:bg-surface transition-colors duration-200 group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
