"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { PortfolioCase } from "@/lib/portfolio-data";
import { ArrowUpRight } from "lucide-react";

type Props = {
  projects: PortfolioCase[];
};

function videoMime(src: string): string {
  const lower = src.toLowerCase();
  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".mov")) return "video/quicktime";
  return "video/mp4";
}

/** Видео в списке: без звука, в цикле; играет только пока блок в зоне видимости */
function PreviewVideo({
  src,
  poster,
  label,
  videoClassName,
}: {
  src: string;
  poster?: string;
  label: string;
  /** По умолчанию — естественная высота; для фикс. контейнера (aspect-video) — absolute inset-0 h-full w-full */
  videoClassName?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "80px", threshold: 0.15 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={
        videoClassName ??
        "block h-auto w-full bg-black object-cover object-top"
      }
      poster={poster}
      muted
      playsInline
      loop
      preload="metadata"
      aria-label={label}
    >
      <source src={src} type={videoMime(src)} />
    </video>
  );
}

/** Слоистое «окно браузера» с превью — без толстых рамок, мягкая тень */
function BrowserPreviewStack({
  imageSrc,
  videoSrc,
  label,
}: {
  imageSrc?: string;
  videoSrc?: string;
  label: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[min(100%,680px)] lg:max-w-[min(92vw,880px)]">
      {/* Задний слой — лёгкая глубина */}
      <div
        className="pointer-events-none absolute left-[6%] top-[5%] z-0 hidden w-[86%] overflow-hidden rounded-lg shadow-md ring-1 ring-black/[0.06] sm:block dark:ring-white/[0.08]"
        style={{ transform: "rotate(-1.5deg)" }}
        aria-hidden
      >
        <div className="aspect-[16/10] bg-gradient-to-br from-neutral-200/90 to-neutral-300/60 dark:from-neutral-700/50 dark:to-neutral-800/40" />
      </div>

      <div className="relative z-10 overflow-hidden rounded-lg shadow-[0_24px_56px_-18px_rgba(0,0,0,0.22)] ring-1 ring-black/[0.07] dark:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.55)] dark:ring-white/[0.1]">
        <div className="flex items-center gap-1.5 border-b border-black/[0.06] bg-[#ececec] px-3 py-2.5 dark:border-white/[0.08] dark:bg-[#252525]">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        {videoSrc ? (
          <PreviewVideo src={videoSrc} poster={imageSrc} label={label} />
        ) : imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- пути из /public, разные DPR
          <img
            src={imageSrc}
            alt=""
            className="block h-auto w-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div
            className="flex aspect-[16/10] items-center justify-center bg-neutral-200 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            aria-hidden
          >
            Превью
          </div>
        )}
        <div className="pointer-events-none absolute bottom-4 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border border-white/40 bg-white/95 text-neutral-800 shadow-md backdrop-blur-sm dark:border-white/15 dark:bg-black/55 dark:text-white">
          <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
        </div>
      </div>
    </div>
  );
}

function caseEyebrow(p: PortfolioCase): string {
  if (p.clientNote) {
    const first = p.clientNote.split(/[—–-]/)[0]?.trim();
    if (first && first.length <= 52) return first;
  }
  if (p.location?.trim()) return p.location.trim();
  return `${p.tag} · ${p.year}`;
}

function CaseRowDesktop({ project: p }: { project: PortfolioCase }) {
  const img = p.heroImage ?? p.showcaseImage1;
  const eyebrow = caseEyebrow(p);
  const tagsLine = [p.type, p.industry].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/portfolio/${p.slug}`}
      className="group block border-t transition-[background-color] duration-300 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="flex flex-col py-12 md:py-14 lg:py-14 xl:py-16"
        style={{ backgroundColor: "color-mix(in srgb, var(--bg-secondary) 92%, var(--bg))" }}
      >
        {/* Заголовок на всю ширину секции (над превью и текстом) */}
        <div className="w-full max-w-none px-4 pb-6 md:px-6 md:pb-7 lg:pb-8">
          <p
            className="font-montserrat text-[12px] font-medium leading-snug md:text-[13px]"
            style={{ color: "var(--text-muted)" }}
          >
            {eyebrow}
          </p>
          <h2
            className="mt-1.5 max-w-none font-heading normal-case text-[0.8rem] leading-[1.28] tracking-tight text-balance md:text-[0.82rem] lg:mt-2 lg:text-[0.8rem] xl:text-[0.85rem]"
            style={{ color: "var(--text)" }}
          >
            {p.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 md:gap-10 lg:grid-cols-[minmax(0,1.42fr)_minmax(0,0.58fr)] lg:gap-10 xl:gap-14">
          <div className="relative flex min-h-[220px] justify-center px-4 md:px-6 lg:min-h-[300px] lg:justify-end lg:pr-2 xl:pr-4">
            <div className="w-full">
              <BrowserPreviewStack imageSrc={img} videoSrc={p.heroVideo} label={p.title} />
            </div>
          </div>

          <div className="min-w-0 px-4 md:px-6 lg:px-4 lg:pr-8 xl:pr-10">
            <p
              className="font-montserrat text-[14px] font-normal leading-relaxed md:text-[14px] md:leading-[1.6]"
              style={{ color: "var(--text-muted)" }}
            >
              {p.shortDescription}
            </p>
            {tagsLine ? (
              <p
                className="mt-6 font-montserrat text-[11px] font-medium uppercase leading-relaxed tracking-[0.1em] md:text-[11px]"
                style={{ color: "var(--text-subtle)" }}
              >
                {tagsLine}
              </p>
            ) : null}
            <span className="mt-5 inline-flex items-center gap-1.5 font-montserrat text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)] opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:mt-6">
              Открыть кейс
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CaseRowMobile({ project: p }: { project: PortfolioCase }) {
  const img = p.heroImage ?? p.showcaseImage1;
  const eyebrow = caseEyebrow(p);
  return (
    <Link
      href={`/portfolio/${p.slug}`}
      className="block border-b px-4 py-5 transition-colors active:bg-black/[0.03] dark:active:bg-white/[0.04]"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
    >
      <p className="font-montserrat text-[11px] font-medium leading-snug" style={{ color: "var(--text-muted)" }}>
        {eyebrow}
      </p>
      <h3 className="mt-1.5 max-w-none font-heading normal-case text-[0.8rem] leading-snug tracking-tight" style={{ color: "var(--text)" }}>
        {p.title}
      </h3>
      {p.heroVideo ? (
        <div className="relative mb-3 mt-4 aspect-video w-full overflow-hidden rounded-md bg-black">
          <PreviewVideo
            src={p.heroVideo}
            poster={img}
            label={p.title}
            videoClassName="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
      ) : img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt="" className="mb-3 mt-4 aspect-video w-full object-cover object-top" loading="lazy" />
      ) : null}
      <p className="mt-2 line-clamp-3 font-montserrat text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
        {p.shortDescription}
      </p>
      <span className="mt-3 inline-flex items-center gap-1 font-montserrat text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--accent)" }}>
        Подробнее
        <ArrowUpRight size={14} />
      </span>
    </Link>
  );
}

export function PortfolioSplit({ projects }: Props) {
  return (
    <div className="w-full max-w-full overflow-x-clip">
      <div className="hidden md:block">
        {projects.map((p) => (
          <CaseRowDesktop key={p.id} project={p} />
        ))}
      </div>
      <div className="md:hidden" role="list">
        {projects.map((p) => (
          <CaseRowMobile key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
