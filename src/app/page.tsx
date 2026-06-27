import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import GrainBlobs from "@/components/shared/GrainBlobs";
import { heroContent, capabilities, blogPosts } from "@/lib/data";
import dynamic from "next/dynamic";

const CaseReel = dynamic(() => import("@/components/home/CaseReel"), { ssr: true });
const AnimatedCapabilities = dynamic(() => import("@/components/home/AnimatedCapabilities"), { ssr: true });
const BlogPreview = dynamic(() => import("@/components/home/BlogPreview"), { ssr: true });

export const metadata: Metadata = {
  title: "APSLOCK — Atlanta Digital Agency | Web Design, Brand & Growth",
  description:
    "Atlanta's results-driven digital agency for web design, brand identity & growth marketing. Trusted by eCommerce, healthcare, fintech & nonprofit brands to deliver measurable growth.",
  alternates: {
    canonical: "https://apslock.com",
  },
};

export default function HomePage() {
  return (
    <div className="relative overflow-clip" style={{ background: "var(--bg)" }}>
      <GrainBlobs variant="amber" intensity={0.20} animate={true} />
      
      <div className="relative z-10">
        <Hero content={heroContent} />
        <CaseReel />
        <AnimatedCapabilities items={capabilities} />
        <BlogPreview posts={blogPosts} />
      </div>
    </div>
  );
}
