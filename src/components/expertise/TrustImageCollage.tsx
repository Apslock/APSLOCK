"use client";

import Image from "next/image";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

const IMAGES = [
  {
    src: "/images/expertise/trust-1.jpg",
    alt: "Earned media and public relations coverage",
  },
  {
    src: "/images/expertise/trust-2.jpg",
    alt: "Thought leadership and executive positioning",
  },
  {
    src: "/images/expertise/trust-3.jpg",
    alt: "Trust-building communications and reputation",
  },
] as const;

const SHADOW_DEFAULT =
  "0 10px 36px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)";
const SHADOW_HOVER =
  "0 18px 52px rgba(0,0,0,0.20), 0 4px 12px rgba(0,0,0,0.11)";
const SHADOW_HOVER_FRONT =
  "0 22px 58px rgba(0,0,0,0.22), 0 6px 14px rgba(0,0,0,0.12)";

const springBack: Transition = { type: "spring", stiffness: 300, damping: 24 };
const springFront: Transition = { type: "spring", stiffness: 320, damping: 22 };

type CollageCardProps = {
  src: string;
  alt: string;
  className?: string;
  zIndex: number;
  hoverScale: number;
  shadowHover?: string;
  transition: Transition;
  priority?: boolean;
};

function CollageCard({
  src,
  alt,
  className,
  zIndex,
  hoverScale,
  shadowHover = SHADOW_HOVER,
  transition,
  priority = false,
}: CollageCardProps) {
  return (
    <motion.div
      className={cn(
        "absolute overflow-hidden rounded-lg bg-[#E5E0D8] outline outline-1 outline-black/[0.06]",
        className,
      )}
      style={{
        zIndex,
        boxShadow: SHADOW_DEFAULT,
        willChange: "transform",
      }}
      whileHover={{
        scale: hoverScale,
        zIndex: 10,
        boxShadow: shadowHover,
      }}
      transition={transition}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 580px"
      />
    </motion.div>
  );
}

function MobileCard({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "relative w-full overflow-hidden rounded-lg bg-[#E5E0D8] outline outline-1 outline-black/[0.06]",
        className,
      )}
      style={{ boxShadow: SHADOW_DEFAULT }}
      whileHover={{ scale: 1.02, boxShadow: SHADOW_HOVER }}
      transition={springBack}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="100vw"
      />
    </motion.div>
  );
}

export function TrustImageCollage() {
  const [img1, img2, img3] = IMAGES;

  return (
    <div className="relative w-full overflow-visible">
      {/* Mobile */}
      <div className="flex flex-col gap-3 md:hidden">
        <MobileCard src={img1.src} alt={img1.alt} className="h-[220px]" priority />
        <MobileCard src={img2.src} alt={img2.alt} className="h-[240px]" />
        <MobileCard src={img3.src} alt={img3.alt} className="h-[220px]" />
      </div>

      {/* Desktop — original trust geometry + hover */}
      <div className="relative mx-auto flex aspect-[4/3] w-full max-w-[580px] items-center justify-center sm:aspect-[4/5] lg:aspect-[3/4] md:mx-0">
        <div className="relative aspect-[20/21] w-[90%] overflow-visible sm:w-[85%]">
          <CollageCard
            src={img1.src}
            alt={img1.alt}
            className="top-0 right-[40%] aspect-square w-[75%] -translate-y-[26.5%]"
            zIndex={1}
            hoverScale={1.025}
            transition={springBack}
            priority
          />
          <CollageCard
            src={img2.src}
            alt={img2.alt}
            className="left-[42.5%] top-[21.42%] h-[57.14%] w-[35%]"
            zIndex={3}
            hoverScale={1.03}
            shadowHover={SHADOW_HOVER_FRONT}
            transition={springFront}
          />
          <CollageCard
            src={img3.src}
            alt={img3.alt}
            className="bottom-0 left-[60%] w-[75%] translate-y-[26.5%] aspect-square"
            zIndex={1}
            hoverScale={1.025}
            transition={springBack}
          />
        </div>
      </div>
    </div>
  );
}
