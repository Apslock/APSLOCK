"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export function FAQ({ items }: FAQProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[#1A1625]/10">
      {items.map((item, i) => (
        <div key={i} className="py-5">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="group flex w-full items-start justify-between gap-6 text-left"
            aria-expanded={open === i}
          >
            <span className="text-[15px] sm:text-base font-semibold text-[#0D0D0D] leading-[1.5] group-hover:text-[#5A2A6E] transition-colors duration-200">
              {item.question}
            </span>
            <span className="mt-0.5 flex-shrink-0 text-[#5A2A6E]">
              {open === i ? <Minus size={18} /> : <Plus size={18} />}
            </span>
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              open === i ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
            )}
          >
            <p className="text-[15px] leading-[1.75] text-[#6B5A7A]">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
