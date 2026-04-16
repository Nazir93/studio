import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ExpertisePageData } from "@/lib/expertise-data";

export function ExpertiseArticle({ page }: { page: ExpertisePageData }) {
  return (
    <article
      className="relative pt-28 pb-24 md:pt-36 md:pb-32"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, color-mix(in srgb, var(--text) 6%, transparent), transparent 50%)",
        }}
      />
      <div className="container relative mx-auto max-w-3xl px-4">
        <Link
          href="/#capabilities"
          className="group mb-10 inline-flex items-center gap-2 font-matrix text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--accent)]"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Что умеем
        </Link>

        <header className="border-b pb-10" style={{ borderColor: "var(--border)" }}>
          <p className="font-matrix text-[10px] uppercase tracking-[0.28em] md:text-[11px]" style={{ color: "var(--accent)" }}>
            {page.subtitle}
          </p>
          <h1 className="mt-3 font-heading page-inset-hero-title leading-[1.08] tracking-tight">
            {page.title}
          </h1>
          <p className="mt-5 font-body text-base leading-relaxed md:text-lg" style={{ color: "var(--text-muted)" }}>
            {page.lede}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {page.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg border px-3 py-1.5 font-matrix text-[9px] uppercase tracking-[0.14em] md:text-[10px]"
                style={{
                  borderColor: "color-mix(in srgb, var(--border) 80%, transparent)",
                  backgroundColor: "color-mix(in srgb, var(--text) 5%, var(--bg))",
                  color: "var(--text)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="mt-12 space-y-12">
          {page.sections.map((section) => (
            <section key={section.heading} className="space-y-4">
              <h2
                className="font-akony text-xl uppercase leading-snug tracking-[0.08em] md:text-2xl"
                style={{ color: "var(--text)" }}
              >
                {section.heading}
              </h2>
              {section.paragraphs.map((p, i) => (
                <p
                  key={i}
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
          className="mt-16 grid gap-4 rounded-2xl border p-6 sm:grid-cols-2 sm:items-center sm:justify-between sm:p-8"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "color-mix(in srgb, var(--text) 4%, var(--bg))",
          }}
        >
          <div>
            <p className="font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>
              Нужно это направление?
            </p>
            <p className="mt-1 font-body text-sm" style={{ color: "var(--text-muted)" }}>
              Расскажите о задаче — предложим формат и сроки.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              href="/brief?source=expertise"
              className="inline-flex items-center justify-center rounded-xl border px-6 py-3 text-center font-matrix text-[10px] uppercase tracking-[0.22em] transition-opacity hover:opacity-90 sm:text-xs"
              style={{ borderColor: "var(--accent)", color: "var(--text)" }}
            >
              Обсудить проект
            </Link>
            <Link
              href="/services"
              className="font-matrix text-[9px] uppercase tracking-[0.18em] underline underline-offset-2"
              style={{ color: "var(--text-muted)" }}
            >
              Все услуги
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
