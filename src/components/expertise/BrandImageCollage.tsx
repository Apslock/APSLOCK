"use client";

import Image from "next/image";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

const IMAGES = [
  {
    src: "/images/expertise/brand-hero.jpg",
    alt: "Brand identity system and visual direction",
    shadow:
      "0 20px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.10)",
    shadowHover:
      "0 28px 72px rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.12)",
    objectPosition: "center" as const,
  },
  {
    src: "/images/expertise/brand-rupture.jpg",
    alt: "Editorial brand composition and mark exploration",
    shadow:
      "0 28px 70px rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.12)",
    shadowHover:
      "0 36px 80px rgba(0,0,0,0.26), 0 8px 20px rgba(0,0,0,0.14)",
    objectPosition: "center" as const,
  },
  {
    src: "/images/expertise/brand-anchor.webp",
    alt: "Brand experience across digital touchpoints",
    shadow:
      "0 16px 48px rgba(0,0,0,0.15), 0 3px 10px rgba(0,0,0,0.08)",
    shadowHover:
      "0 22px 58px rgba(0,0,0,0.19), 0 5px 14px rgba(0,0,0,0.10)",
    objectPosition: "center" as const,
  },
] as const;

const springHero: Transition = { type: "spring", stiffness: 260, damping: 28 };
const springRupture: Transition = { type: "spring", stiffness: 320, damping: 22 };
const springAnchor: Transition = { type: "spring", stiffness: 300, damping: 24 };

type CollageCardProps = {
  src: string;
  alt: string;
  className?: string;
  rotateDeg: number;
  zIndex: number;
  shadow: string;
  shadowHover: string;
  objectPosition?: "center" | string;
  whileHover: { scale: number; rotate?: number; zIndex: number };
  transition: Transition;
  priority?: boolean;
  unoptimized?: boolean;
};

function CollageCard({
  src,
  alt,
  className,
  rotateDeg,
  zIndex,
  shadow,
  shadowHover,
  objectPosition = "center",
  whileHover,
  transition,
  priority = false,
  unoptimized = false,
}: CollageCardProps) {
  return (
    <motion.div
      className={cn(
        "absolute overflow-hidden rounded-[3px] bg-[#E5E0D8] outline outline-1 outline-black/[0.065]",
        className,
      )}
      style={{
        zIndex,
        boxShadow: shadow,
        rotate: rotateDeg,
        willChange: "transform",
      }}
      whileHover={{
        ...whileHover,
        boxShadow: shadowHover,
      }}
      transition={transition}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={unoptimized}
        className="object-cover"
        style={{ objectPosition }}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </motion.div>
  );
}

function MobileCard({
  src,
  alt,
  className,
  shadow,
  priority = false,
  unoptimized = false,
}: {
  src: string;
  alt: string;
  className: string;
  shadow: string;
  priority?: boolean;
  unoptimized?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[3px] bg-[#E5E0D8] outline outline-1 outline-black/[0.065]",
        className,
      )}
      style={{ boxShadow: shadow }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={unoptimized}
        className="object-cover object-center"
        sizes="100vw"
      />
    </div>
  );
}

export function BrandImageCollage() {
  const [img1, img2, img3] = IMAGES;

  return (
    <div className="relative w-full max-w-[580px] overflow-visible">
      {/* Mobile: no bleed, no rotation */}
      <div className="flex flex-col gap-3 md:hidden">
        <MobileCard
          src={img1.src}
          alt={img1.alt}
          className="h-[260px]"
          shadow={img1.shadow}
          priority
        />
        <MobileCard
          src={img2.src}
          alt={img2.alt}
          className="h-[200px]"
          shadow={img2.shadow}
        />
        <MobileCard
          src={img3.src}
          alt={img3.alt}
          className="h-[200px]"
          shadow={img3.shadow}
          unoptimized
        />
      </div>

      {/* Desktop: pinboard — statement → rupture → anchor */}
      <div className="relative hidden min-h-[660px] w-full overflow-visible md:block">
        <CollageCard
          src={img1.src}
          alt={img1.alt}
          className="left-0 top-0 h-[450px] w-[76%]"
          rotateDeg={-1.8}
          zIndex={1}
          shadow={img1.shadow}
          shadowHover={img1.shadowHover}
          objectPosition={img1.objectPosition}
          whileHover={{ scale: 1.008, zIndex: 10 }}
          transition={springHero}
          priority
        />
        <CollageCard
          src={img2.src}
          alt={img2.alt}
          className="-right-5 top-[18px] h-[235px] w-[36%]"
          rotateDeg={3.2}
          zIndex={3}
          shadow={img2.shadow}
          shadowHover={img2.shadowHover}
          objectPosition={img2.objectPosition}
          whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
          transition={springRupture}
          priority
        />
        <CollageCard
          src={img3.src}
          alt={img3.alt}
          className="left-[35px] top-[415px] h-[215px] w-[50%]"
          rotateDeg={-0.6}
          zIndex={2}
          shadow={img3.shadow}
          shadowHover={img3.shadowHover}
          objectPosition={img3.objectPosition}
          whileHover={{ scale: 1.025, rotate: 0, zIndex: 10 }}
          transition={springAnchor}
          unoptimized
        />
      </div>
    </div>
  );
}
