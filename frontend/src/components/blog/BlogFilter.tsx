"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import BlogList from "./BlogList";
import type { BlogPost, BlogCategory } from "@/lib/data";

interface BlogFilterProps {
  posts: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogFilter({ posts, categories }: BlogFilterProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredPosts =
    activeCategory === "all"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  return (
    <div>
      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-3 mb-12" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={cn(
              "px-5 py-2.5 text-sm font-medium rounded-full border transition-all duration-200",
              activeCategory === cat.value
                ? "bg-accent text-white border-accent"
                : "bg-surface text-text-muted border-border hover:border-text-muted hover:text-text"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Post Grid */}
      <BlogList posts={filteredPosts} />
    </div>
  );
}
