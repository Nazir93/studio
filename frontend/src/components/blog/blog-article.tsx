import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { BlogPost } from "@/lib/blog-data";

export function BlogArticle({ post }: { post: BlogPost }) {
  return (
    <article
      className="pt-28 pb-20 md:pt-36 md:pb-28"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="container mx-auto max-w-3xl px-4">
        <Link
          href="/blog"
          className="group mb-10 inline-flex items-center gap-2 font-matrix text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--accent)]"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Все материалы
        </Link>

        <header className="border-b pb-10" style={{ borderColor: "var(--border)" }}>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className="rounded-full border px-3 py-1 font-matrix text-[10px] uppercase tracking-[0.15em]"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              {post.category}
            </span>
            <span className="font-matrix text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--text-subtle)" }}>
              {post.date}
            </span>
            <span className="font-matrix text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--text-subtle)" }}>
              · {post.readTime}
            </span>
          </div>
          <h1 className="font-heading text-3xl leading-[1.1] tracking-tight sm:text-4xl md:text-[2.75rem]">
            {post.title}
          </h1>
          <p className="mt-5 font-body text-base leading-relaxed md:text-lg" style={{ color: "var(--text-muted)" }}>
            {post.excerpt}
          </p>
        </header>

        <div className="prose-blog mt-12 space-y-10">
          {post.sections.map((section, i) => (
            <section key={i} className="space-y-4">
              {section.heading ? (
                <h2
                  className="font-akony text-xl uppercase leading-snug tracking-[0.08em] md:text-2xl"
                  style={{ color: "var(--text)" }}
                >
                  {section.heading}
                </h2>
              ) : null}
              {section.paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="font-body text-[15px] leading-[1.75] md:text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div
          className="mt-14 flex flex-col gap-4 border-t pt-10 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="font-matrix text-[10px] uppercase tracking-[0.18em]" style={{ color: "var(--text-subtle)" }}>
            Остались вопросы по теме?
          </p>
          <Link
            href="/brief?source=blog"
            className="inline-flex items-center justify-center rounded-xl border px-6 py-3 font-matrix text-[10px] uppercase tracking-[0.22em] transition-opacity hover:opacity-90 sm:text-xs"
            style={{ borderColor: "var(--accent)", color: "var(--text)" }}
          >
            Обсудить проект
          </Link>
        </div>
      </div>
    </article>
  );
}
