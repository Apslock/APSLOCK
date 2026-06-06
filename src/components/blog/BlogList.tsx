import FadeIn from "@/components/shared/FadeIn";
import BlogCard from "./BlogCard";
import type { BlogPost } from "@/lib/data";

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-text-muted text-lg">
          No posts found in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {posts.map((post, index) => (
        <FadeIn key={post.slug} delay={index * 0.06}>
          <BlogCard post={post} />
        </FadeIn>
      ))}
    </div>
  );
}
