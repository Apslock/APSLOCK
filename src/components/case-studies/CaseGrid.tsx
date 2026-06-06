import FadeIn from "@/components/shared/FadeIn";
import CaseCard from "./CaseCard";
import type { CaseStudy } from "@/lib/data";

interface CaseGridProps {
  studies: CaseStudy[];
}

export default function CaseGrid({ studies }: CaseGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {studies.map((study, index) => (
        <FadeIn key={study.slug} delay={index * 0.08}>
          <CaseCard study={study} />
        </FadeIn>
      ))}
    </div>
  );
}
