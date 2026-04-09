"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PORTFOLIO_CASES } from "@/lib/portfolio-data";
import { useStickyHeaderPinned } from "@/lib/use-sticky-header-pinned";
import { PinnedCodeTypist } from "@/components/ui/pinned-code-typist";
import { PortfolioSmokeBackground } from "@/components/effects/portfolio-smoke-background";

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
  image: null,
  video: null,
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

function PortfolioCell({ title, subtitle, tag, year, area, href, image, video }: PortfolioTapeItem) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [hovered]);

  return (
    <Link
      href={href}
      className="group relative flex shrink-0 flex-col justify-end overflow-hidden p-3 transition-colors md:p-5"
      style={{ aspectRatio: "9 / 13", backgroundColor: "var(--bg-secondary)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Фон */}
      <div className="pointer-events-none absolute inset-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:opacity-70 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(ellipse at 25% 20%, var(--text-subtle) 0%, transparent 50%), radial-gradient(ellipse at 70% 75%, var(--text-subtle) 0%, transparent 40%)",
              opacity: 0.12,
            }}
          />
        )}
      </div>

      {/* Видео при наведении */}
      {video && (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            src={video}
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
      )}

      {/* Текст */}
      <div
        className="relative z-30 transition-all duration-300"
        style={{ transform: hovered && video ? "translateY(-4px)" : "none" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-matrix text-[7px] uppercase tracking-[0.2em] md:text-[8px]"
            style={{
              color:
                hovered && video
                  ? "color-mix(in srgb, var(--text) 58%, transparent)"
                  : "var(--text-subtle)",
            }}
          >
            {tag}
          </span>
          <span
            className="font-matrix text-[7px] uppercase tracking-[0.15em] md:text-[8px]"
            style={{
              color:
                hovered && video
                  ? "color-mix(in srgb, var(--text) 48%, transparent)"
                  : "var(--text-subtle)",
            }}
          >
            {year}
          </span>
        </div>
        <h3
          className="mt-0.5 font-matrix text-xs uppercase leading-tight tracking-[0.04em] transition-colors duration-300 md:text-sm lg:text-base"
          style={{
            color: "var(--text)",
            textShadow:
              hovered && video
                ? "0 1px 12px color-mix(in srgb, var(--bg) 65%, transparent)"
                : undefined,
          }}
        >
          {title}
        </h3>
        <p
          className="mt-0.5 font-matrix text-[7px] uppercase tracking-[0.18em] transition-colors duration-300 md:text-[8px]"
          style={{
            color: hovered && video ? "color-mix(in srgb, var(--text) 72%, transparent)" : "var(--text-muted)",
          }}
        >
          {subtitle}
        </p>
        {area && (
          <p
            className="mt-1 font-matrix text-[7px] uppercase tracking-[0.15em] transition-colors duration-300 md:text-[8px]"
            style={{
              color: hovered && video ? "color-mix(in srgb, var(--text) 50%, transparent)" : "var(--text-subtle)",
            }}
          >
            {area}
          </p>
        )}
      </div>
    </Link>
  );
}

function PortfolioColumn({ col, ci, progress }: { col: Column; ci: number; progress: number }) {
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
            <PortfolioCell {...cell} />
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
      className="relative"
      style={{ height: `${SECTION_HEIGHT_VH}vh`, backgroundColor: "var(--bg)", color: "var(--text)" }}
      aria-label="Портфолио"
    >
      {/* Разделитель секции */}
      <div
        ref={stickyHeaderRef}
        className="sticky top-0 z-[40] flex items-center justify-between px-4 py-3 md:px-6 md:py-3.5"
        style={{ backgroundColor: "var(--bg)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex min-w-0 flex-wrap items-baseline gap-3 md:gap-4">
          <h2
            className="font-akony text-xl uppercase tracking-[0.12em] md:text-3xl lg:text-4xl"
            style={{ color: "var(--text)" }}
          >
            Портфолио
          </h2>
          {headerPinned ? (
            <PinnedCodeTypist text='// портфолио: cases.filter(Boolean).length === 7' charDelayMs={11} />
          ) : (
            <span
              className="font-matrix text-[10px] uppercase tracking-[0.28em] md:text-[11px]"
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

      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
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
            <PortfolioColumn key={ci} col={col} ci={ci} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  );
}
