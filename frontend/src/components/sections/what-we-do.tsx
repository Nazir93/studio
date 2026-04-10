"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clapperboard, Palette, Pyramid } from "lucide-react";
import { useStickyHeaderPinned } from "@/lib/use-sticky-header-pinned";
import { useIsDesktopLg } from "@/lib/use-is-desktop-lg";
import { PinnedCodeTypist } from "@/components/ui/pinned-code-typist";

/** Демо и интерактивы — пополняется. */
export const SHOWCASE_ITEMS = [
  {
    id: "film",
    title: "Кино",
    subtitle: "Киноплёнка · кадры",
    description:
      "Кадры по скроллу, HUD, фоновое видео и газетная полоса — демо визуального языка студии.",
    href: "/gallery/film-reel",
    icon: "film" as const,
    /** То же, что фон на странице киноплёнки */
    previewVideo: "/videos/film-old-movies-effects.mp4",
  },
  {
    id: "ancient",
    title: "Древность",
    subtitle: "Иероглифы · пирамиды · мистика",
    description:
      "Альтернативная страница UX/UI: палео-контакт, Розеттский камень, кипу, каналы орошения — интерактивная витрина дизайна.",
    href: "/services/ux-ui-design/ancient",
    icon: "ancient" as const,
    /** Фон первого экрана «Древность & мистика» */
    previewVideo: "/videos/ancient-paleo.mp4",
  },
  {
    id: "artistic",
    title: "Художественные стили",
    subtitle: "Кубизм · дада · оп-арт · пуантилизм",
    description:
      "Альтернативная страница UX/UI: геометрия куба, дада-коллаж, оп-арт и пуантилизм — интерфейс как выставка.",
    href: "/services/ux-ui-design/artistic",
    icon: "palette" as const,
    previewGradient:
      "linear-gradient(165deg, #141210 0%, #3d4a6b 38%, #4a3428 72%, #0c0b0a 100%)",
  },
] as const;

const GAP = 4;
/** Как у блока «Портфолио» — длинная секция + лента в sticky-viewport */
const SECTION_HEIGHT_VH = 185;

type ShowcaseItem = (typeof SHOWCASE_ITEMS)[number];

type ColumnConfig = {
  width: number;
  speed: number;
  itemIndex: 0 | 1 | 2;
};

const COLUMNS: ColumnConfig[] = [
  { width: 1.15, speed: 0.52, itemIndex: 0 },
  { width: 1, speed: 0.78, itemIndex: 1 },
  { width: 0.9, speed: 0.62, itemIndex: 2 },
];

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

/** Параллельные линии чуть косо к вертикали (90° = строго вертикальные полосы — берём ~86° / ~94°). */
function SlantedLinesParallax({ progress }: { progress: number }) {
  const ty = progress * 36;
  const line = (angleDeg: number) =>
    `repeating-linear-gradient(
      ${angleDeg}deg,
      transparent 0,
      transparent 10px,
      color-mix(in srgb, var(--border) 48%, transparent) 10px,
      color-mix(in srgb, var(--border) 48%, transparent) 11px
    )`;

  return (
    <div className="pointer-events-none absolute inset-0 z-[24] overflow-hidden" aria-hidden>
      <div
        className="absolute -inset-[30%] opacity-[0.13]"
        style={{
          backgroundImage: line(86),
          transform: `translate3d(${progress * -6}px, ${ty * 0.2}px, 0)`,
        }}
      />
      <div
        className="absolute -inset-[30%] opacity-[0.09]"
        style={{
          backgroundImage: line(94),
          transform: `translate3d(${progress * 5}px, ${ty * -0.15}px, 0)`,
        }}
      />
    </div>
  );
}

function ShowcaseCell({ item, previewVideosEnabled }: { item: ShowcaseItem; previewVideosEnabled: boolean }) {
  return (
    <Link
      href={item.href}
      data-cursor-word="смотреть"
      className="group relative flex shrink-0 flex-col justify-between overflow-hidden p-3 transition-colors md:p-5"
      style={{ aspectRatio: "9 / 13", backgroundColor: "var(--bg-secondary)" }}
    >
      {"previewVideo" in item && item.previewVideo && previewVideosEnabled && (
        <>
          <video
            className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-105 object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          >
            <source src={item.previewVideo} type="video/mp4" />
          </video>
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[var(--bg-secondary)] transition-opacity duration-500 group-hover:opacity-[0.15]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] via-[color-mix(in_srgb,var(--bg)_45%,transparent)] to-[color-mix(in_srgb,var(--bg-secondary)_95%,transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />
        </>
      )}
      {"previewGradient" in item && item.previewGradient && (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.88] transition-[opacity,transform] duration-700 ease-out group-hover:opacity-100"
            style={{ background: item.previewGradient }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[color-mix(in_srgb,var(--bg-secondary)_55%,transparent)] via-transparent to-[color-mix(in_srgb,var(--bg)_75%,transparent)] opacity-60 transition-opacity duration-500 group-hover:opacity-40"
            aria-hidden
          />
        </>
      )}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-1 opacity-80 transition-opacity group-hover:opacity-100"
        style={{
          background:
            item.id === "film"
              ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 80%, transparent 100%)"
              : item.id === "artistic"
                ? "linear-gradient(90deg, transparent 0%, rgba(196,92,74,0.35) 25%, rgba(74,111,165,0.35) 50%, rgba(196,165,116,0.3) 75%, transparent 100%)"
                : "linear-gradient(90deg, transparent 0%, rgba(196,165,116,0.25) 35%, rgba(196,165,116,0.25) 65%, transparent 100%)",
        }}
      />
      <div className="relative z-[2] flex min-h-0 flex-1 flex-col justify-between">
        <div className="relative flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className="font-matrix text-[7px] uppercase tracking-[0.2em] md:text-[8px]"
              style={{ color: item.id === "artistic" ? "rgba(245,240,235,0.55)" : "var(--text-muted)" }}
            >
              {item.subtitle}
            </p>
            <h3
              className={`font-akony mt-1.5 text-base uppercase leading-tight tracking-[0.08em] md:text-lg lg:text-xl ${
                item.id === "artistic" ? "text-[#f5f0eb]" : ""
              }`}
            >
              {item.title}
            </h3>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] md:h-10 md:w-10"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            aria-hidden
          >
            {item.icon === "ancient" ? (
              <Pyramid size={18} strokeWidth={1.25} />
            ) : item.icon === "palette" ? (
              <Palette size={18} strokeWidth={1.25} />
            ) : (
              <Clapperboard size={18} strokeWidth={1.25} />
            )}
          </span>
        </div>
        <p
          className="relative mt-3 font-body text-[10px] leading-relaxed md:text-[11px] lg:text-xs"
          style={{ color: item.id === "artistic" ? "rgba(245,240,235,0.78)" : undefined }}
        >
          {item.description}
        </p>
        <div className="relative mt-3 flex items-center gap-2 font-matrix text-[8px] uppercase tracking-[0.18em] transition-colors group-hover:text-[var(--accent)] md:text-[9px]">
          {item.id === "film" ? "Открыть демо" : "Открыть раздел"}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function ShowcaseStackCard({ item }: { item: ShowcaseItem }) {
  return (
    <Link
      href={item.href}
      data-cursor-word="смотреть"
      className="flex items-start gap-4 border-b px-4 py-5 transition-opacity active:opacity-90 last:border-b-0"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
    >
      <span
        className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        aria-hidden
      >
        {item.icon === "ancient" ? (
          <Pyramid size={20} strokeWidth={1.25} />
        ) : item.icon === "palette" ? (
          <Palette size={20} strokeWidth={1.25} />
        ) : (
          <Clapperboard size={20} strokeWidth={1.25} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
          {item.subtitle}
        </p>
        <h3
          className="font-akony mt-1.5 text-[0.95rem] uppercase leading-snug tracking-[0.07em] sm:text-[1.05rem] sm:leading-tight sm:tracking-[0.08em] md:text-lg"
          style={{ color: "var(--text)" }}
        >
          {item.title}
        </h3>
        <p className="mt-3 font-body text-xs leading-relaxed sm:text-[13px]" style={{ color: "var(--text-muted)" }}>
          {item.description}
        </p>
        <div
          className="mt-3 flex items-center gap-2 font-matrix text-[9px] uppercase tracking-[0.18em]"
          style={{ color: "var(--accent)" }}
        >
          {item.id === "film" ? "Открыть демо" : "Открыть раздел"}
          <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

function ShowcaseColumn({
  col,
  ci,
  progress,
  previewVideosEnabled,
}: {
  col: ColumnConfig;
  ci: number;
  progress: number;
  previewVideosEnabled: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxTravel, setMaxTravel] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const content = contentRef.current;
    if (!wrap || !content) return;

    const measure = () => {
      const containerH = wrap.offsetHeight;
      const contentH = content.scrollHeight;
      setMaxTravel(Math.max(0, contentH - containerH));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    ro.observe(content);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const y = -(progress * maxTravel * col.speed);

  return (
    <div
      ref={wrapRef}
      className="relative min-w-0 overflow-hidden"
      style={{
        flex: col.width,
        borderRight: ci < COLUMNS.length - 1 ? `${GAP}px solid var(--border)` : undefined,
      }}
    >
      <div ref={contentRef} className="flex flex-col will-change-transform" style={{ transform: `translateY(${y}px)` }}>
        <div style={{ borderBottom: `${GAP}px solid var(--border)` }}>
          <ShowcaseCell item={SHOWCASE_ITEMS[col.itemIndex]} previewVideosEnabled={previewVideosEnabled} />
        </div>
        {/* Нижний «ход» ленты — как у портфолио, чтобы параллакс был заметен */}
        <div className="h-[min(52vh,420px)] shrink-0" aria-hidden />
      </div>
    </div>
  );
}

export function WhatWeDoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const headerPinned = useStickyHeaderPinned(stickyHeaderRef);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const previewVideosEnabled = useIsDesktopLg();
  const codeTypistEnabled = useIsDesktopLg();

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      setProgress(clamp(-rect.top / total, 0, 1));
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      data-navbar
      className="relative max-md:!h-auto max-md:min-h-0"
      style={{ height: `${SECTION_HEIGHT_VH}vh`, backgroundColor: "var(--bg)", color: "var(--text)" }}
      aria-label="Выбери себе дизайн"
    >
      <div
        ref={stickyHeaderRef}
        className="sticky top-0 z-[40] flex flex-col gap-1 px-4 py-2 sm:flex-row sm:items-end sm:justify-between md:px-6 md:py-2"
        style={{ backgroundColor: "var(--bg)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="min-w-0 flex-1">
          <h2
            className="font-akony text-[0.95rem] uppercase leading-snug tracking-[0.14em] sm:text-lg md:text-2xl lg:text-3xl"
            style={{ color: "var(--text)" }}
          >
            Выбери себе дизайн
          </h2>
          <div className="mt-1 min-h-[1.6rem] max-w-2xl sm:min-h-[2rem]">
            {codeTypistEnabled && headerPinned ? (
              <PinnedCodeTypist
                text={
                  '// дизайн: showcase[] — интерактивы, UX/UI\n// блок пополняем · gallery → демо'
                }
                charDelayMs={11}
              />
            ) : (
              <p
                className="max-w-[18rem] font-matrix text-[8px] uppercase leading-snug tracking-[0.2em] sm:max-w-none sm:text-[10px] md:text-[11px]"
                style={{ color: "var(--text-muted)" }}
              >
                Разные интерактивы и визуальные форматы — блок будем наполнять
              </p>
            )}
          </div>
        </div>
        <Link
          href="/gallery"
          className="font-matrix shrink-0 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--accent)] md:text-xs"
          style={{ color: "var(--text-subtle)" }}
        >
          галерея →
        </Link>
      </div>

      <div className="border-t md:hidden" style={{ borderColor: "var(--border)" }}>
        {SHOWCASE_ITEMS.map((item) => (
          <ShowcaseStackCard key={item.id} item={item} />
        ))}
      </div>

      <div className="sticky top-0 hidden h-[100dvh] w-full overflow-hidden md:block">
        <div className="pointer-events-none absolute inset-0 z-[30] mix-blend-overlay" style={{ opacity: 0.12 }}>
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <filter id="whatwedo-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#whatwedo-grain)" />
          </svg>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[30] h-20"
          style={{ background: "linear-gradient(to bottom, var(--bg), transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[30] h-24"
          style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
        />

        <SlantedLinesParallax progress={progress} />

        <div className="relative z-10 flex h-full w-full min-h-0 bg-transparent">
          {COLUMNS.map((col, ci) => (
            <ShowcaseColumn
              key={ci}
              col={col}
              ci={ci}
              progress={progress}
              previewVideosEnabled={previewVideosEnabled}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
