import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/lib/data";

interface CaseCardProps {
  study: CaseStudy;
}

export default function CaseCard({ study }: CaseCardProps) {
  return (
    <article className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-border-light mb-6">
        <Image
          src={study.image.src}
          alt={study.image.alt}
          width={study.image.width}
          height={study.image.height}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-text/0 group-hover:bg-text/10 transition-colors duration-300" />
        <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-surface/90 text-text opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight size={18} />
        </div>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium px-2.5 py-1 bg-accent/5 text-accent rounded-full">
          {study.category}
        </span>
        <span className="text-xs text-text-muted">{study.client}</span>
      </div>
      <h3 className="text-xl font-semibold text-text mb-2 group-hover:text-accent transition-colors duration-200">
        {study.title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed mb-4">
        {study.description}
      </p>
      <div className="flex items-center gap-6">
        {study.metrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-lg font-semibold text-text">
              {metric.value}
            </p>
            <p className="text-xs text-text-muted">{metric.label}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
