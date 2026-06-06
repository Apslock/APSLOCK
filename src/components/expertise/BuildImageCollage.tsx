"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const IMAGES = [
  {
    src: "/images/expertise/build-1.jpg",
    alt: "Digital product interface and platform build",
  },
  {
    src: "/images/expertise/build-2.png",
    alt: "Illustration of creative systems thinking and product build",
  },
  {
    src: "/images/expertise/build-3.jpg",
    alt: "Composable architecture and innovation systems",
  },
] as const;

const SHADOW_DEFAULT =
  "0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.09)";
const SHADOW_HOVER =
  "0 16px 48px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.12)";

const spring = { type: "spring" as const, stiffness: 280, damping: 22 };

type CollageCardProps = {
  src: string;
  alt: string;
  className?: string;
  rotateDeg: number;
  zIndex: number;
  priority?: boolean;
};

function CollageCard({
  src,
  alt,
  className,
  rotateDeg,
  zIndex,
  priority = false,
}: CollageCardProps) {
  return (
    <motion.div
      className={cn(
        "overflow-hidden rounded-[4px] bg-[#0A0A0A] outline outline-1 outline-black/[0.06]",
        className,
      )}
      style={{
        zIndex,
        boxShadow: SHADOW_DEFAULT,
        rotate: rotateDeg,
      }}
      whileHover={{
        scale: 1.03,
        rotate: 0,
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
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 580px"
      />
    </motion.div>
  );
}

export function BuildImageCollage() {
  const [img1, img2, img3] = IMAGES;

  return (
    <div className="relative w-full max-w-[580px] overflow-visible">
      {/* Mobile: < 768px — stack, full width, no rotation */}
      <div className="flex flex-col gap-3 md:hidden">
        {IMAGES.map((img, index) => (
          <CollageCard
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="relative h-[220px] w-full"
            rotateDeg={0}
            zIndex={index + 1}
            priority={index === 0}
          />
        ))}
      </div>

      {/* Desktop: absolute editorial layout */}
      <div className="relative hidden min-h-[620px] w-full overflow-visible md:block">
        <CollageCard
          src={img1.src}
          alt={img1.alt}
          className="absolute left-0 top-0 h-[240px] w-[78%]"
          rotateDeg={1.5}
          zIndex={1}
          priority
        />
        <CollageCard
          src={img2.src}
          alt={img2.alt}
          className="absolute right-0 top-[200px] h-[210px] w-[62%]"
          rotateDeg={-1.2}
          zIndex={2}
        />
        <CollageCard
          src={img3.src}
          alt={img3.alt}
          className="absolute left-[-10px] top-[360px] h-[270px] w-[82%]"
          rotateDeg={0.8}
          zIndex={3}
        />
      </div>
    </div>
  );
}
