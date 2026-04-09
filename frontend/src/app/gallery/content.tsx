"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const GALLERY_PAGES = [
  {
    slug: "film-reel",
    num: "01",
    title: "КИНОПЛЕНКА",
    subtitle: "Интерактивное видео + скролл-контрол",
    desc: "Скролл переключает текстовые кадры — как плёнку. Таймкоды, глитч между сценами, сюрприз посередине.",
    tags: ["Киноплёнка", "Текст", "Canvas", "Glitch"],
  },
];

function AnimatedBlock({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `all 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export function GalleryContent() {
  return (
    <article style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <section className="px-4 py-16 sm:py-20 md:px-8 md:py-24 lg:px-16">
        <p className="font-matrix text-[9px] uppercase tracking-[0.35em] sm:text-[10px]" style={{ color: "var(--text-muted)" }}>
          Галерея дизайна
        </p>
        <h1 className="mt-3 max-w-2xl font-heading text-lg leading-snug tracking-tight text-balance sm:text-xl md:text-2xl" style={{ color: "var(--text)" }}>
          Интерактивные демо-страницы
        </h1>
        <p className="font-body mt-3 max-w-xl text-xs leading-relaxed sm:text-sm md:text-[15px]" style={{ color: "var(--text-muted)" }}>
          Каждая страница — отдельный визуальный опыт. Хотите такой дизайн? Вам к нам.
        </p>
      </section>

      <section className="px-4 pb-20 md:px-8 md:pb-28 lg:px-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_PAGES.map((page, i) => (
            <AnimatedBlock key={page.slug} delay={i * 100}>
              <Link href={`/gallery/${page.slug}`}
                className="group flex h-full flex-col justify-between p-6 md:p-8 transition-colors duration-300"
                style={{ border: "1px solid var(--border)" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-matrix text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--text-subtle)" }}>{page.num}</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" style={{ color: "var(--text-muted)" }} />
                  </div>
                  <h2 className="font-heading text-base leading-snug tracking-tight text-balance sm:text-lg" style={{ color: "var(--text)" }}>
                    {page.title}
                  </h2>
                  <p className="font-matrix text-[8px] sm:text-[9px] uppercase tracking-[0.12em] mt-1" style={{ color: "var(--text-subtle)" }}>
                    {page.subtitle}
                  </p>
                  <p className="font-body mt-3 text-[11px] leading-relaxed sm:text-xs md:text-sm" style={{ color: "var(--text-muted)" }}>
                    {page.desc}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {page.tags.map((tag) => (
                    <span key={tag} className="font-matrix px-2 py-1 text-[8px] uppercase tracking-[0.1em]"
                      style={{ border: "1px solid var(--border)", color: "var(--text-subtle)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </AnimatedBlock>
          ))}
        </div>
      </section>
    </article>
  );
}
