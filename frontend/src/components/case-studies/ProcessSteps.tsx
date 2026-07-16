import FadeIn from "@/components/shared/FadeIn";
import type { ProcessStep } from "@/lib/data";

interface ProcessStepsProps {
  steps: ProcessStep[];
}

export default function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <section className="py-24 md:py-32">
      <div className="container-wide">
        <FadeIn>
          <p className="text-eyebrow mb-4">Our Process</p>
          <h2 className="text-section-heading text-text max-w-xl mb-16">
            How we work
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-8 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-[1px] bg-border" />

          {steps.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.1}>
              <div className="relative">
                <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-border bg-bg text-text font-display text-xl mb-6 relative z-10">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-text mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
