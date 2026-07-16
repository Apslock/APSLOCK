import type { Metadata } from "next";
import FadeIn from "@/components/shared/FadeIn";
import BlogFilter from "@/components/blog/BlogFilter";
import GrainBlobs from "@/components/shared/GrainBlobs";
import { blogPosts as fallbackPosts, blogCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Blog — APSLOCK",
  description:
    "Articles and analyses on digital engineering, brand strategy, and growth motions. Built for team leads and founders.",
  alternates: {
    canonical: "https://apslock.com/blogs",
  },
};

export const revalidate = 60; // revalidate every minute

export default async function BlogsPage() {
  const posts = fallbackPosts;
  const categoriesToUse = blogCategories;

  return (
    <div className="relative overflow-hidden" style={{ background: "var(--bg)" }}>
      <GrainBlobs variant="amber" intensity={0.12} animate={true} className="fixed inset-0 z-0 pointer-events-none" showAccent={false} />

      {/* Hero */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-20 relative z-10">
        <div className="container-wide">
          <FadeIn>

            <h1 className="text-hero text-text max-w-2xl">
              Ideas &amp; insights
            </h1>
            <p className="mt-6 text-lg text-text-muted max-w-xl leading-relaxed">
              Articles and notes from our team on design, engineering, and market positioning.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filter + List — transparent, same blob shows through */}
      <section className="pb-24 md:pb-32 relative z-10">
        <div className="container-wide">
          <BlogFilter posts={posts} categories={categoriesToUse} />
        </div>
      </section>
    </div>
  );
}
