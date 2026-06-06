import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/data";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blogs/${post.slug}`} className="group block">
      <article>
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-border-light mb-5">
          {post.image?.src ? (
            <Image
              src={post.image.src}
              alt={post.image.alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-text-muted text-sm">No Image</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-medium px-2.5 py-1 bg-accent/5 text-accent rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-text-muted">{post.readTime}</span>
        </div>
        <h3 className="text-lg font-semibold text-text leading-snug mb-2 group-hover:text-accent transition-colors duration-200">
          {post.title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="text-sm font-medium text-accent group-hover:text-accent-hover transition-colors duration-200">
          Read more →
        </div>
      </article>
    </Link>
  );
}
