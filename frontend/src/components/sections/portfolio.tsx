"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PORTFOLIO_CASES } from "@/lib/portfolio-data";
import { useStickyHeaderPinned } from "@/lib/use-sticky-header-pinned";
import { useIsDesktopLg } from "@/lib/use-is-desktop-lg";
import { useTheme } from "@/lib/theme-context";
import { PinnedCodeTypist } from "@/components/ui/pinned-code-typist";

const PORTFOLIO_TAPE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

interface PortfolioTapeItem {
  title: string;
  subtitle: string;
  tag: string;
  year: string;
  area: string;
  href: string;
  image: string | null;
  video: string | null;
}

const P: PortfolioTapeItem[] = PORTFOLIO_CASES.map((c) => ({
  title: c.title,
  subtitle: c.type,
  tag: c.tag,
  year: c.year,
  area: c.area,
  href: `/portfolio/${c.slug}`,
  /** Как в «Что умеем»: фон — постер; при наведении — heroVideo, если есть */
  image: c.heroImage ?? null,
  video: c.heroVideo ?? null,
}));

interface Column {
  width: number;
  speed: number;
  items: PortfolioTapeItem[];
}

const COLUMNS: Column[] = [
  {
    width: 1,
    speed: 0.5,
    items: [P[0], P[4], P[2]],
  },
  {
    width: 1.5,
    speed: 0.85,
    items: [P[1], P[3]],
  },
  {
    width: 1.7,
    speed: 0.65,
    items: [P[2], P[0], P[3]],
  },
  {
    width: 1.1,
    speed: 0.95,
    items: [P[3], P[4]],
  },
];

const SECTION_HEIGHT_VH = 200;
const GAP = 4;

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

function PortfolioCell({
  title,
  subtitle,
  tag,
  year,
  area,
  href,
  image,
  video,
  videosEnabled,
}: PortfolioTapeItem & { videosEnabled: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const { isDark } = useTheme();
  /** Как в «Что умеем»: ролик только lg+ */
  const effectiveVideo = videosEnabled && video ? video : null;
  const hasMedia = !!effectiveVideo;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !effectiveVideo) return;
    if (hovered) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [hovered, effectiveVideo]);

  return (
    <Link
      href={href}
      className="group relative flex shrink-0 flex-col overflow-hidden transition-colors"
      style={{
        aspectRatio: "9 / 13",
        /** В покое — чёрная пластина; контент «внутри» приглушён, при hover выделяется */
        backgroundColor: "#0a0a0a",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Лёгкая текстура на чёрном */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          background:
            "radial-gradient(ellipse at 30% 25%, var(--text-subtle) 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, var(--text-subtle) 0%, transparent 45%)",
          opacity: hovered ? 0.22 : 0.12,
          transition: `opacity 0.45s ${PORTFOLIO_TAPE_EASE}`,
        }}
      />

      {/* Постер: почти не виден, проявляется при наведении (если нет видео) */}
      {image && !hasMedia ? (
        <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition-all duration-700 ease-out"
            style={{
              opacity: hovered ? 0.5 : 0,
              transform: hovered ? "scale(1.03)" : "scale(1.06)",
            }}
          />
        </div>
      ) : null}

      {/* Нет ни картинки ни видео — только чуть градиента поверх чёрного */}
      {!image && !hasMedia ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 25% 20%, var(--text-subtle) 0%, transparent 50%), radial-gradient(ellipse at 70% 75%, var(--text-subtle) 0%, transparent 40%)",
            opacity: 0.1,
          }}
        />
      ) : null}

      {/* Видео при наведении (только lg+, как в ленте «Что умеем») */}
      {effectiveVideo ? (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0, transitionTimingFunction: PORTFOLIO_TAPE_EASE }}
        >
          <video
            ref={videoRef}
            src={effectiveVideo}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
          />
        </div>
      ) : null}

      {/* Текст — сетка как в TapeCell: линия сверху, заголовок по центру, подпись снизу */}
      <div
        className="absolute inset-0 z-30 flex flex-col justify-between gap-2 p-3 md:p-5"
        style={{
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          transition: `transform 0.45s ${PORTFOLIO_TAPE_EASE}`,
        }}
      >
        <div className="shrink-0">
          <div
            className="mb-2 h-px w-full origin-left rounded-full transition-transform duration-500"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--text) 65%, transparent), color-mix(in srgb, var(--text) 8%, transparent))",
              transform: hovered ? "scaleX(1)" : "scaleX(0)",
              transitionTimingFunction: PORTFOLIO_TAPE_EASE,
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="font-matrix text-[7px] uppercase md:text-[8px]"
              style={{
                letterSpacing: hovered ? "0.2em" : "0.12em",
                color: hovered ? "var(--text)" : "var(--text-subtle)",
                opacity: hovered ? 1 : 0.45,
                textShadow:
                  hovered && !isDark
                    ? "0 0 10px rgba(255,255,255,0.9)"
                    : hovered && isDark
                      ? "0 0 14px color-mix(in srgb, var(--text) 35%, transparent)"
                      : undefined,
                transition: `letter-spacing 0.45s ${PORTFOLIO_TAPE_EASE}, color 0.35s ease, opacity 0.35s ease`,
              }}
            >
              {tag}
            </span>
            <span
              className="font-matrix text-[7px] uppercase md:text-[8px]"
              style={{
                letterSpacing: hovered ? "0.18em" : "0.1em",
                color: hovered ? "var(--text)" : "var(--text-subtle)",
                opacity: hovered ? 1 : 0.4,
                textShadow:
                  hovered && !isDark
                    ? "0 0 10px rgba(255,255,255,0.85)"
                    : hovered && isDark
                      ? "0 0 12px color-mix(in srgb, var(--text) 28%, transparent)"
                      : undefined,
                transition: `letter-spacing 0.45s ${PORTFOLIO_TAPE_EASE}, color 0.35s ease, opacity 0.35s ease`,
              }}
            >
              {year}
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-center py-1">
          <h3
            className="w-full text-balance text-center font-matrix text-xs uppercase leading-tight tracking-[0.04em] transition-all duration-400 md:text-sm lg:text-base"
            style={{
              color: hovered ? "var(--text)" : "var(--text-muted)",
              opacity: hovered ? 1 : 0.38,
              transform: hovered ? "scale(1.02)" : "scale(1)",
              textShadow: hovered
                ? isDark
                  ? "0 0 20px color-mix(in srgb, var(--text) 25%, transparent), 0 2px 16px rgba(0,0,0,0.45)"
                  : "0 0 18px rgba(255,255,255,0.55), 0 1px 0 rgba(255,255,255,0.2)"
                : "none",
              transition: `opacity 0.35s ease, transform 0.45s ${PORTFOLIO_TAPE_EASE}, color 0.35s ease, text-shadow 0.35s ease`,
            }}
          >
            {title}
          </h3>
        </div>

        <div className="shrink-0 text-center">
          <p
            className="font-matrix text-[7px] uppercase tracking-[0.18em] transition-all duration-300 md:text-[8px]"
            style={{
              color: hovered ? "var(--text-muted)" : "var(--text-subtle)",
              opacity: hovered ? 0.92 : 0.35,
            }}
          >
            {subtitle}
          </p>
          {area ? (
            <p
              className="mt-1 font-matrix text-[7px] uppercase tracking-[0.15em] transition-all duration-300 md:text-[8px]"
              style={{
                color: hovered ? "var(--text-subtle)" : "var(--text-subtle)",
                opacity: hovered ? 0.75 : 0.3,
              }}
            >
              {area}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function PortfolioStackCard(cell: PortfolioTapeItem) {
  return (
    <Link
      href={cell.href}
      data-cursor-word="смотреть"
      className="block border-b px-4 py-5 transition-opacity active:opacity-90 last:border-b-0"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
    >
      {cell.image ? (
        <div className="relative -mx-4 mb-4 aspect-[16/10] w-[calc(100%+2rem)] max-w-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cell.image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>
          {cell.tag}
        </span>
        <span className="font-matrix text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>
          {cell.year}
        </span>
      </div>
      <h3
        className="mt-2 font-akony text-[0.95rem] uppercase leading-snug tracking-[0.07em] sm:text-[1.05rem] sm:leading-tight sm:tracking-[0.08em] md:text-lg"
        style={{ color: "var(--text)" }}
      >
        {cell.title}
      </h3>
      <p className="mt-2 font-matrix text-xs uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>
        {cell.subtitle}
      </p>
      {cell.area ? (
        <p className="mt-2 font-matrix text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-subtle)" }}>
          {cell.area}
        </p>
      ) : null}
    </Link>
  );
}

function PortfolioColumn({
  col,
  ci,
  progress,
  videosEnabled,
}: {
  col: Column;
  ci: number;
  progress: number;
  videosEnabled: boolean;
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
      className="relative overflow-hidden"
      style={{
        flex: col.width,
        backgroundColor: "transparent",
        borderRight: ci < COLUMNS.length - 1 ? `${GAP}px solid var(--border)` : undefined,
      }}
    >
      <div
        ref={contentRef}
        className="flex flex-col will-change-transform"
        style={{ transform: `translateY(${y}px)` }}
      >
        {col.items.map((cell, si) => (
          <div
            key={si}
            style={{ borderBottom: si < col.items.length - 1 ? `${GAP}px solid var(--border)` : undefined }}
          >
            <PortfolioCell {...cell} videosEnabled={videosEnabled} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortfolioSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const headerPinned = useStickyHeaderPinned(stickyHeaderRef);
  const isDesktopLg = useIsDesktopLg();
  const codeTypistEnabled = isDesktopLg;
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);

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
      id="portfolio"
      data-cursor-word="смотреть"
      className="relative max-md:!h-auto max-md:min-h-0"
      style={{ height: `${SECTION_HEIGHT_VH}vh`, backgroundColor: "var(--bg)", color: "var(--text)" }}
      aria-label="Портфолио"
    >
      {/* Разделитель секции */}
      <div
        ref={stickyHeaderRef}
        className="sticky top-0 z-[40] flex items-center justify-between px-4 py-3 md:px-6 md:py-3.5"
        style={{ backgroundColor: "var(--bg)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex min-w-0 flex-wrap items-baseline gap-2 md:gap-4">
          <h2
            className="font-akony text-[0.95rem] uppercase leading-snug tracking-[0.14em] sm:text-lg md:text-2xl lg:text-4xl"
            style={{ color: "var(--text)" }}
          >
            Портфолио
          </h2>
          {codeTypistEnabled && headerPinned ? (
            <PinnedCodeTypist text='// портфолио: cases.filter(Boolean).length === 7' charDelayMs={11} />
          ) : (
            <span
              className="max-w-[14rem] font-matrix text-[8px] uppercase leading-snug tracking-[0.22em] sm:max-w-none sm:text-[10px] sm:tracking-[0.28em] md:text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              7 проектов
            </span>
          )}
        </div>
        <Link
          href="/portfolio"
          className="font-matrix text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--accent)] md:text-xs"
          style={{ color: "var(--text-subtle)" }}
        >
          все проекты →
        </Link>
      </div>

      <div className="border-t md:hidden" style={{ borderColor: "var(--border)" }}>
        {P.map((cell) => (
          <PortfolioStackCard key={cell.href} {...cell} />
        ))}
      </div>

      <div className="sticky top-0 hidden h-[100dvh] w-full overflow-hidden md:block">
        {/* Шероховатость / зерно */}
        <div className="pointer-events-none absolute inset-0 z-30 mix-blend-overlay" style={{ opacity: 0.15 }}>
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="portfolio-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#portfolio-grain)" />
          </svg>
        </div>

        {/* Верхний / нижний fade */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-20"
          style={{ background: "linear-gradient(to bottom, var(--bg), transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-24"
          style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
        />

        {/* Колонки */}
        <div className="relative z-10 flex h-full w-full bg-transparent">
          {COLUMNS.map((col, ci) => (
            <PortfolioColumn key={ci} col={col} ci={ci} progress={progress} videosEnabled={isDesktopLg} />
          ))}
        </div>
      </div>
    </section>
  );
}
