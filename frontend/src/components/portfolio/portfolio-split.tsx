"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PortfolioCase } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type Props = {
  projects: PortfolioCase[];
  /** При «Все» — только список; при фильтре по разделу — список + превью справа */
  showPreview?: boolean;
};

export function PortfolioSplit({ projects, showPreview = true }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileTab, setMobileTab] = useState<"list" | "preview">("list");
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const active = projects[activeIdx] ?? projects[0];

  const expandPreview = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
    setPreviewExpanded(true);
  }, []);

  const scheduleCollapsePreview = useCallback(() => {
    if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = setTimeout(() => {
      setPreviewExpanded(false);
      collapseTimerRef.current = null;
    }, 180);
  }, []);

  const setRef = useCallback((el: HTMLDivElement | null, i: number) => {
    itemRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    if (nodes.length === 0) return;

    const ratioByEl = new Map<Element, number>();
    nodes.forEach((n) => ratioByEl.set(n, 0));

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratioByEl.set(e.target, e.intersectionRatio);
        }
        let bestIdx = 0;
        let best = -1;
        nodes.forEach((node, i) => {
          const r = ratioByEl.get(node) ?? 0;
          if (r > best) {
            best = r;
            bestIdx = i;
          }
        });
        if (best > 0.08) setActiveIdx(bestIdx);
      },
      { root: null, threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1], rootMargin: "-10% 0px -10% 0px" }
    );

    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [projects]);

  useEffect(
    () => () => {
      if (collapseTimerRef.current) clearTimeout(collapseTimerRef.current);
    },
    []
  );

  useEffect(() => {
    setActiveIdx((i) => (projects.length === 0 ? 0 : Math.min(i, projects.length - 1)));
  }, [projects]);

  function PreviewPanel({ className, expanded }: { className?: string; expanded?: boolean }) {
    if (!active) return null;
    return (
      <div
        className={cn(
          "flex min-h-[240px] flex-col justify-between gap-6 rounded-xl border p-5 transition-[box-shadow] duration-300 sm:min-h-[260px] md:min-h-0 md:max-h-[min(560px,calc(100vh-7rem))] md:overflow-y-auto md:overscroll-contain md:p-6 lg:p-7",
          "shadow-sm",
          expanded && "md:shadow-md",
          className
        )}
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-secondary)",
        }}
        key={active.id}
      >
        <div className="min-w-0">
          <p
            className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.2em] md:text-[11px]"
            style={{ color: "var(--text-subtle)" }}
          >
            {active.tag} · {active.year}
          </p>
          <h2
            className={cn(
              "mt-2 font-heading normal-case leading-[1.08] tracking-tight md:mt-3",
              expanded
                ? "text-xl md:text-2xl lg:text-3xl"
                : "text-lg md:text-xl lg:text-2xl"
            )}
            style={{ color: "var(--text)" }}
          >
            {active.title}
          </h2>
          <p
            className="mt-2 font-montserrat text-[11px] font-medium uppercase tracking-[0.1em] md:text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {active.industry}
          </p>
          <p
            className="mt-4 font-montserrat text-sm font-normal leading-relaxed md:mt-5 md:text-[15px] md:leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {active.shortDescription}
          </p>
        </div>
        <Link
          href={`/portfolio/${active.slug}`}
          className="inline-flex shrink-0 items-center gap-2 font-montserrat text-xs font-semibold uppercase tracking-[0.12em] transition-opacity hover:opacity-80 md:text-[13px]"
          style={{ color: "var(--accent)" }}
        >
          Открыть кейс
          <ArrowUpRight size={18} strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid w-full max-w-full gap-10 overflow-x-clip md:items-start",
        showPreview
          ? "md:grid-cols-[minmax(0,18rem)_minmax(280px,1fr)] md:gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(300px,1fr)] lg:gap-8 xl:gap-10"
          : "md:grid-cols-1 md:gap-0"
      )}
    >
      {showPreview && (
        <div className="mb-2 flex gap-2 md:hidden" role="tablist" aria-label="Режим просмотра на мобильном">
          {(
            [
              { id: "list" as const, label: "Список" },
              { id: "preview" as const, label: "Превью" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mobileTab === id}
              onClick={() => setMobileTab(id)}
              className={cn(
                "flex-1 border px-4 py-2.5 font-montserrat text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors",
                mobileTab === id
                  ? "border-[var(--accent)] text-[var(--text)]"
                  : "border-[var(--border)] text-[var(--text-muted)]"
              )}
              style={{
                backgroundColor: mobileTab === id ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div
        className={cn(
          "min-w-0",
          showPreview && mobileTab === "preview" && "hidden md:block"
        )}
        role="list"
        aria-label="Список проектов"
        onMouseEnter={showPreview ? expandPreview : undefined}
        onMouseLeave={showPreview ? scheduleCollapsePreview : undefined}
      >
        {projects.map((p, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={p.id}
              ref={(el) => setRef(el, i)}
              role="listitem"
              data-index={i}
              onMouseEnter={() => setActiveIdx(i)}
              className="border-b transition-colors"
              style={{ borderColor: "var(--border)" }}
            >
              <Link
                href={`/portfolio/${p.slug}`}
                onFocus={() => setActiveIdx(i)}
                className={cn(
                  "block py-2.5 outline-none transition-colors md:py-3",
                  "focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                )}
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className="block font-heading normal-case text-[0.8125rem] leading-snug tracking-tight transition-colors sm:text-sm md:text-[0.8125rem] md:leading-[1.2]"
                  style={{ color: isActive ? "var(--text)" : "var(--text-muted)" }}
                >
                  {p.title}
                </span>
                <span
                  className="mt-0.5 block font-montserrat text-[9px] font-medium uppercase tracking-[0.1em] md:text-[10px]"
                  style={{ color: isActive ? "var(--accent)" : "var(--text-subtle)" }}
                >
                  {p.year} · {p.tag}
                </span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Desktop: превью только при фильтре по разделу */}
      {showPreview && (
        <aside
          className="hidden min-w-0 md:block"
          onMouseEnter={expandPreview}
          onMouseLeave={scheduleCollapsePreview}
          data-preview-zone
        >
          <div className="sticky top-24 self-start md:top-28 lg:top-32">
            <PreviewPanel expanded={previewExpanded} />
          </div>
        </aside>
      )}

      {/* Mobile: превью во вкладке «Превью» */}
      {showPreview && (
        <div className={cn("md:hidden", mobileTab === "list" && "hidden")}>
          <p className="mb-3 font-montserrat text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "var(--text-subtle)" }}>
            Выбранный кейс · листайте список или откройте вкладку после выбора
          </p>
          <PreviewPanel expanded />
        </div>
      )}
    </div>
  );
}
