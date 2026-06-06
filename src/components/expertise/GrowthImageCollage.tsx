"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GrowthImage = {
  src: string;
  alt: string;
  unoptimized?: boolean;
};

const IMAGES: [GrowthImage, GrowthImage, GrowthImage] = [
  {
    src: "/images/expertise/growth-1.jpg",
    alt: "Growth marketing campaign performance dashboard",
  },
  {
    src: "/images/expertise/growth-2.webp",
    alt: "Go-to-market strategy and demand generation",
    unoptimized: true,
  },
  {
    src: "/images/expertise/growth-3.webp",
    alt: "Revenue pipeline and lifecycle marketing systems",
    unoptimized: true,
  },
];

const SHADOW_DEFAULT =
  "0 8px 28px rgba(0,0,0,0.13), 0 2px 6px rgba(0,0,0,0.07)";
const SHADOW_HOVER =
  "0 14px 40px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.10)";

const spring = { type: "spring" as const, stiffness: 300, damping: 26 };

type CollageCardProps = {
  src: string;
  alt: string;
  className?: string;
  zIndex: number;
  dark?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
};

function CollageCard({
  src,
  alt,
  className,
  zIndex,
  dark = false,
  priority = false,
  unoptimized = false,
}: CollageCardProps) {
  return (
    <motion.div
      className={cn(
        "overflow-hidden rounded-[3px] outline outline-1 outline-black/[0.06]",
        dark ? "bg-[#1A1625]" : "bg-[#EDE8F5]",
        className,
      )}
      style={{
        zIndex,
        boxShadow: SHADOW_DEFAULT,
      }}
      whileHover={{
        scale: 1.02,
        zIndex: 10,
        boxShadow: SHADOW_HOVER,
      }}
      transition={spring}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={unoptimized}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 520px"
      />
    </motion.div>
  );
}

export function GrowthImageCollage() {
  const [img1, img2, img3] = IMAGES;

  return (
    <div className="relative ml-auto w-full max-w-[520px]">
      {/* Mobile: stack, full width, gap-3 */}
      <div className="flex flex-col gap-3 md:hidden">
        {IMAGES.map((img, index) => (
          <CollageCard
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="relative h-[220px] w-full"
            zIndex={index + 1}
            dark={index === 2}
            priority={index === 0}
            unoptimized={img.unoptimized}
          />
        ))}
      </div>

      {/* Desktop: on-axis layout, structured overlap */}
      <div className="relative hidden min-h-[640px] w-full md:block">
        <CollageCard
          src={img1.src}
          alt={img1.alt}
          className="absolute right-0 top-0 h-[340px] w-[50%]"
          zIndex={1}
          priority
        />
        <CollageCard
          src={img2.src}
          alt={img2.alt}
          className="absolute left-0 top-[152px] h-[270px] w-[56%]"
          zIndex={2}
        />
        <CollageCard
          src={img3.src}
          alt={img3.alt}
          className="absolute right-0 top-[390px] h-[290px] w-[74%]"
          zIndex={1}
          dark
          unoptimized={img3.unoptimized}
        />
      </div>
    </div>
  );
}
