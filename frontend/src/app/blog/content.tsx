"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/blog-data";

function PostCard({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${(index % 3) * 100}ms`,
      }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group relative flex h-[360px] flex-col justify-between overflow-hidden rounded-[20px] border p-6 transition-transform duration-500 hover:scale-[0.98] md:p-8"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
      >
        {/* Image placeholder */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0.03 }}
        >
          <span
            className="font-matrix text-[160px] font-bold leading-none select-none opacity-[0.07]"
            style={{ color: "var(--text)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Top: category + date + arrow */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <span
              className="font-matrix text-[10px] uppercase tracking-[0.15em] px-3 py-1 rounded-full"
              style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              {post.category}
            </span>
            <span className="font-matrix text-[10px] tracking-wider uppercase" style={{ color: "var(--text-subtle)" }}>
              {post.date}
            </span>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            style={{ border: "1px solid var(--border)" }}
          >
            <ArrowRight size={16} style={{ color: "var(--text)" }} />
          </div>
        </div>

        {/* Bottom: title + excerpt */}
        <div className="relative z-10">
          <h3
            className="font-body text-lg md:text-xl font-semibold leading-[1.15] mb-3 transition-colors duration-200 group-hover:text-[var(--accent)]"
            style={{ color: "var(--text)" }}
          >
            {post.title}
          </h3>
          <p className="font-body text-xs leading-relaxed line-clamp-3 md:text-sm" style={{ color: "var(--text-muted)" }}>
            {post.excerpt}
          </p>
        </div>
      </Link>
    </div>
  );
}

export function BlogPageContent({ posts }: { posts: readonly BlogPost[] }) {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto">
        {/* Title */}
        <h1
          className="font-heading text-[16vw] md:text-[11vw] lg:text-[9.5vw] leading-[0.88] tracking-tighter mb-6"
          style={{ color: "var(--text)" }}
        >
          БЛОГ
        </h1>
        <p className="font-body text-base md:text-lg mb-14 md:mb-20 max-w-xl" style={{ color: "var(--text-muted)" }}>
          Новости студии, разработка сайтов и сервисов, UX/UI, AI и автоматизация процессов
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
