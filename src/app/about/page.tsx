import type { Metadata } from "next";
import FadeIn from "@/components/shared/FadeIn";
import { HighlightText } from "@/components/ui/HighlightText";
import ValuesSection from "@/components/about/ValuesSection";
import WorkProcess from "@/components/about/WorkProcess";
import TeamSection from "@/components/about/TeamSection";
import BigCTA from "@/components/shared/BigCTA";
import GrainBlobs from "@/components/shared/GrainBlobs";
import { workProcess } from "@/lib/data";

export const metadata: Metadata = {
  title: "About — APSLOCK",
  description:
    "Meet the team behind APSLOCK. We are a focused, senior-led studio designing and engineering digital platforms built to last. Learn our values, process, and how we partner with brands.",
  alternates: {
    canonical: "https://apslock.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Amber tint — warmer and much more visible */}
      <GrainBlobs variant="amber" intensity={0.11} animate={true} className="fixed inset-0 z-0 pointer-events-none" />

      {/* Hero */}
      <section className="min-h-[100svh] flex flex-col justify-center pt-32 pb-16 relative z-10">
        <div className="container-wide">
          <FadeIn>

            <h1 className="text-hero text-text max-w-4xl">
              <HighlightText text="A studio built on craft and conviction" highlight={["craft", "conviction"]} />
            </h1>
            <div className="mt-6 text-lg md:text-xl text-text-muted max-w-3xl leading-relaxed space-y-4">
              <p>
                APSLOCK was founded on a simple belief — the most effective digital work happens when strategy, design, and engineering are aligned from day one.
              </p>
              <p>
                We&apos;re a focused, senior-led team partnering with businesses to build digital platforms that support operational stability and commercial growth. We work as a direct partner, helping you build systems that last.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Values */}
      <div className="relative z-10"><ValuesSection /></div>

      {/* Work Process */}
      <div className="relative z-10"><WorkProcess process={workProcess} /></div>

      {/* Team */}
      <div className="relative z-10"><TeamSection /></div>

      {/* CTA */}
      <div className="relative z-10"><BigCTA /></div>
    </div>
  );
}
