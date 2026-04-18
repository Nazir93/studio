"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { PortfolioCase, PORTFOLIO_CASES } from "@/lib/portfolio-data";

/** Кейсы: контент на всю ширину экрана с полями (без max-width у container) */
const CASE_FULL_WIDTH = "w-full max-w-none px-4 sm:px-5 md:px-8 lg:px-10 xl:px-12";

function useScrollVisible(threshold = 0.15) {
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
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function PortfolioLightboxOverlay({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.94)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Полноэкранный просмотр"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border transition-opacity hover:opacity-90 sm:right-5 sm:top-5"
        style={{
          borderColor: "rgba(255,255,255,0.28)",
          backgroundColor: "rgba(0,0,0,0.55)",
          color: "#fff",
        }}
        aria-label="Закрыть"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X size={22} strokeWidth={1.5} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element -- тот же URL что в /public, без ограничения по DPR */}
      <img
        src={src}
        alt={alt}
        className="max-h-[min(100dvh,100vh)] max-w-[100vw] w-auto object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

/** Растр из /public: без JS-ограничения ширины (оно давало 0px и «пустые» кадры на части браузеров). Лайтбокс по клику. */
function PortfolioRasterImg({
  src,
  alt,
  className,
  fetchPriority,
  loading,
  decoding,
  lightbox = true,
}: {
  src: string;
  alt: string;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "lazy" | "eager";
  decoding?: "async" | "auto" | "sync";
  lightbox?: boolean;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = () => setLightboxOpen(true);

  const imgEl = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className={cn("block h-auto w-full max-w-full min-w-0", className)}
      fetchPriority={fetchPriority}
      loading={loading}
      decoding={decoding}
    />
  );

  const lightboxTriggerClass =
    "relative block w-full min-h-0 cursor-zoom-in border-0 bg-transparent p-0 text-left outline-none transition-opacity hover:opacity-[0.98] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]";

  return (
    <>
      <div className="relative min-w-0 w-full">
        {lightbox ? (
          <div
            role="button"
            tabIndex={0}
            className={lightboxTriggerClass}
            onClick={openLightbox}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox();
              }
            }}
            aria-label="Открыть изображение в полном размере"
          >
            {imgEl}
          </div>
        ) : (
          imgEl
        )}
      </div>
      {lightbox && lightboxOpen && typeof document !== "undefined"
        ? createPortal(
            <PortfolioLightboxOverlay src={src} alt={alt} onClose={() => setLightboxOpen(false)} />,
            document.body
          )
        : null}
    </>
  );
}

function ParallaxShowcase({ label, dark = true }: { label: string; dark?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = (windowH - rect.top) / (windowH + rect.height);
      setOffset(progress * 60 - 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        backgroundColor: dark ? "#0a0a0a" : "var(--bg-secondary)",
        height: "60vh",
        minHeight: "350px",
        maxHeight: "600px",
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `translateY(${offset}px) scale(1.1)` }}
      >
        <span
          className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: dark ? "rgba(255,255,255,0.3)" : "var(--text-subtle)" }}
        >
          {label}
        </span>
      </div>
      <div
        className="absolute inset-x-0 top-0 h-20 pointer-events-none"
        style={{
          background: dark
            ? "linear-gradient(to bottom, #0a0a0a, transparent)"
            : "linear-gradient(to bottom, var(--bg-secondary), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
        style={{
          background: dark
            ? "linear-gradient(to top, #0a0a0a, transparent)"
            : "linear-gradient(to top, var(--bg-secondary), transparent)",
        }}
      />
    </section>
  );
}

function HeroCaseImage({ src, title, compact }: { src: string; title: string; compact?: boolean }) {
  const inner = (
    <div
      className={
        compact
          ? "relative w-full border border-solid shadow-sm lg:border-x-0 lg:shadow-none"
          : "relative w-full border border-solid shadow-sm"
      }
      style={{
        borderColor: "var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: "var(--bg)", paddingBottom: "1px" }}
      >
        <PortfolioRasterImg
          src={src}
          alt={`${title} — интерфейс`}
          className="mx-auto max-h-[min(85vh,1100px)] object-contain object-center"
          decoding="async"
          fetchPriority="high"
          loading="eager"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 md:h-20"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.22), transparent)",
          }}
        />
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="relative w-full min-w-0" aria-label="Главный скриншот проекта">
        {inner}
      </div>
    );
  }

  return (
    <section
      className="relative w-full py-8 md:py-12"
      style={{ backgroundColor: "var(--bg)" }}
      aria-label="Главный скриншот проекта"
    >
      <div className="px-4 md:px-6 lg:px-0">{inner}</div>
    </section>
  );
}

function HeroCaseVideo({
  src,
  poster,
  title,
  compact,
}: {
  src: string;
  poster?: string;
  title: string;
  compact?: boolean;
}) {
  const inner = (
    <div
      className={
        compact
          ? "relative w-full border border-solid shadow-sm lg:border-x-0 lg:shadow-none"
          : "relative w-full border border-solid shadow-sm"
      }
      style={{
        borderColor: "var(--border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="relative aspect-[16/10] md:aspect-[21/9] w-full min-h-[220px] max-h-[min(78vh,900px)] overflow-hidden"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <video
          src={src}
          poster={poster}
          className="absolute inset-0 z-[1] h-full w-full object-contain object-center"
          style={{ backgroundColor: "var(--bg)" }}
          muted
          loop
          playsInline
          autoPlay
          controls
          controlsList="nodownload"
          preload="metadata"
          aria-label={`${title} — демонстрация интерфейса`}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-14 md:h-20"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.22), transparent)",
          }}
        />
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="relative w-full min-w-0" aria-label="Видео проекта">
        {inner}
      </div>
    );
  }

  return (
    <section className="relative w-full py-8 md:py-12" style={{ backgroundColor: "var(--bg)" }} aria-label="Видео проекта">
      <div className="px-4 md:px-6 lg:px-0">{inner}</div>
    </section>
  );
}

function ShowcasePhoto({
  src,
  label,
  dark = true,
}: {
  src: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <section
      className="relative w-full min-w-0"
      style={{
        backgroundColor: dark ? "#0a0a0a" : "var(--bg-secondary)",
      }}
    >
      {/* На lg+ картинка на всю ширину вьюпорта; на мобилке — прежние поля */}
      <div className="w-full px-4 py-10 md:px-6 md:py-14 lg:px-0 lg:py-12 xl:py-16">
        <div
          className="relative mx-auto w-full max-w-full border border-solid shadow-sm lg:mx-0 lg:rounded-none lg:border-x-0 lg:shadow-none"
          style={{
            borderColor: dark ? "rgba(255,255,255,0.12)" : "var(--border)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.07)",
          }}
        >
          <div
            className="overflow-hidden"
            style={{ backgroundColor: dark ? "#0a0a0a" : "var(--bg)", paddingBottom: "1px" }}
          >
            <PortfolioRasterImg
              src={src}
              alt={label.trim() ? label : "Скриншот интерфейса"}
              className="mx-auto max-h-[min(88vh,1200px)] object-contain object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
      {label.trim() ? (
        <div className={`${CASE_FULL_WIDTH} pb-10 md:pb-14 lg:pb-12 xl:pb-16`}>
          <p
            className="text-center font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: dark ? "rgba(255,255,255,0.45)" : "var(--text-subtle)" }}
          >
            {label}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function ShowcasePair({
  leftSrc,
  rightSrc,
  label,
  dark = true,
}: {
  leftSrc: string;
  rightSrc: string;
  label?: string;
  dark?: boolean;
}) {
  const border = dark ? "rgba(255,255,255,0.12)" : "var(--border)";
  const bg = dark ? "#0a0a0a" : "var(--bg)";
  return (
    <section
      className="relative w-full min-w-0"
      style={{ backgroundColor: dark ? "#0a0a0a" : "var(--bg-secondary)" }}
    >
      <div className="w-full px-4 py-10 md:px-6 md:py-14 lg:px-0 lg:py-12 xl:py-16">
        <div
          className="mx-auto grid max-w-full grid-cols-1 gap-4 border border-solid shadow-sm md:grid-cols-2 md:gap-3 lg:mx-0 lg:gap-4 lg:border-x-0 lg:shadow-none"
          style={{ borderColor: border, boxShadow: "0 8px 28px rgba(0,0,0,0.07)" }}
        >
          <div className="min-w-0 overflow-hidden" style={{ backgroundColor: bg, paddingBottom: "1px" }}>
            <PortfolioRasterImg
              src={leftSrc}
              alt={label ? `${label} — фрагмент слева` : "Скриншот слева"}
              className="mx-auto max-h-[min(80vh,1000px)] object-contain object-center md:object-right"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="min-w-0 overflow-hidden" style={{ backgroundColor: bg, paddingBottom: "1px" }}>
            <PortfolioRasterImg
              src={rightSrc}
              alt={label ? `${label} — фрагмент справа` : "Скриншот справа"}
              className="mx-auto max-h-[min(80vh,1000px)] object-contain object-center md:object-left"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
      {label?.trim() ? (
        <div className={`${CASE_FULL_WIDTH} pb-10 md:pb-14 lg:pb-12 xl:pb-16`}>
          <p
            className="text-center font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: dark ? "rgba(255,255,255,0.45)" : "var(--text-subtle)" }}
          >
            {label}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function TextBlock({ leftText, rightText, accent }: { leftText: string; rightText: string; accent?: boolean }) {
  const { ref, visible } = useScrollVisible(0.2);

  return (
    <section
      ref={ref}
      className="py-20 md:py-28"
      style={{
        backgroundColor: accent ? "var(--bg-secondary)" : "var(--bg)",
        borderTop: accent ? "1px solid var(--border)" : undefined,
        borderBottom: accent ? "1px solid var(--border)" : undefined,
      }}
    >
      <div className={CASE_FULL_WIDTH}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-30px)",
            }}
          >
            <p className="whitespace-pre-line text-sm md:text-base leading-[1.8]" style={{ color: "var(--text-muted)" }}>
              {leftText}
            </p>
          </div>
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transitionDelay: "100ms",
            }}
          >
            <p className="whitespace-pre-line text-sm md:text-base leading-[1.8]" style={{ color: "var(--text-muted)" }}>
              {rightText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function NavLink({ href, label, direction }: { href: string; label: string; direction: "prev" | "next" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex w-full min-w-0 flex-1 items-center gap-3 px-4 py-5 sm:gap-4 sm:px-6 sm:py-6 md:py-8 rounded-2xl relative overflow-hidden transition-all duration-500"
      style={{ border: "1px solid var(--border)" }}
    >
      <div
        className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{
          backgroundColor: "var(--text)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
        }}
      />
      {direction === "prev" && (
        <ArrowLeft
          size={20}
          className="relative z-10 transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
        />
      )}
      <div className="relative z-10 min-w-0 flex-1">
        <span
          className="text-[10px] uppercase tracking-[0.15em] block mb-1 transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text-muted)" }}
        >
          {direction === "prev" ? "Предыдущий проект" : "Следующий проект"}
        </span>
        <span
          className="font-heading normal-case text-[0.625rem] font-medium leading-tight sm:text-[0.65rem] md:text-[0.6875rem] transition-colors duration-700 text-pretty [overflow-wrap:break-word] [word-break:normal]"
          style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
        >
          {label}
        </span>
      </div>
      {direction === "next" && (
        <ArrowRight
          size={20}
          className="relative z-10 transition-colors duration-700"
          style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
        />
      )}
    </Link>
  );
}

export function CaseContent({ project }: { project: PortfolioCase }) {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  const currentIndex = PORTFOLIO_CASES.findIndex((c) => c.id === project.id);
  const prevCase = currentIndex > 0 ? PORTFOLIO_CASES[currentIndex - 1] : null;
  const nextCase = currentIndex < PORTFOLIO_CASES.length - 1 ? PORTFOLIO_CASES[currentIndex + 1] : null;

  return (
    <article className="font-montserrat text-[15px] leading-normal antialiased md:text-base">
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20" style={{ backgroundColor: "var(--bg)" }}>
        <div className={CASE_FULL_WIDTH}>
          {/* Back link */}
          <div
            className="transition-all duration-700"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] mb-10 transition-colors duration-200 hover:text-[var(--accent)]"
              style={{ color: "var(--text-muted)" }}
            >
              <ArrowLeft size={14} />
              Все проекты
            </Link>
          </div>

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <h1
              className="font-heading text-[clamp(0.95rem,4vw,1.45rem)] sm:text-[clamp(1.15rem,3.4vw,1.62rem)] md:text-[clamp(1.3rem,2.75vw,1.62rem)] lg:text-[clamp(1.35rem,2.1vw,1.68rem)] xl:text-[clamp(1.38rem,1.7vw,1.75rem)] leading-[1.06] tracking-tight transition-all duration-1000 ease-out"
              style={{
                color: "var(--text)",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(40px)",
                transitionDelay: "100ms",
              }}
            >
              {project.title}
            </h1>
            <span
              className="font-body text-base md:text-lg transition-all duration-1000 ease-out italic"
              style={{
                color: "var(--text-muted)",
                opacity: heroVisible ? 1 : 0,
                transitionDelay: "200ms",
              }}
            >
              ({project.tag})
            </span>
          </div>

          {/* Divider */}
          <div className="h-px mb-10" style={{ backgroundColor: "var(--border)" }} />

          {/* Meta row */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14 transition-all duration-1000 ease-out"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "250ms",
            }}
          >
            {[
              { label: "Отрасль", value: project.industry },
              { label: "Услуга", value: project.type },
              { label: "Площадь", value: project.area },
              { label: "Год", value: project.year },
            ].map((item) => (
              <div key={item.label}>
                <span
                  className="text-[10px] uppercase tracking-[0.15em] block mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.label}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {(project.clientNote || project.tagline || project.awardsLine || project.productionUrl) && (
            <div
              className="mb-10 space-y-2 text-sm md:mb-12 md:space-y-2.5 transition-all duration-1000 ease-out"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(12px)",
                transitionDelay: "260ms",
              }}
            >
              {project.clientNote ? (
                <p className="font-medium" style={{ color: "var(--text)" }}>
                  {project.clientNote}
                </p>
              ) : null}
              {project.tagline ? (
                <p style={{ color: "var(--text-muted)" }}>
                  <span className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: "var(--text-subtle)" }}>
                    Tagline{" "}
                  </span>
                  {project.tagline}
                </p>
              ) : null}
              {project.awardsLine ? (
                <p style={{ color: "var(--text-muted)" }}>
                  <span className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: "var(--text-subtle)" }}>
                    Награды{" "}
                  </span>
                  {project.awardsLine}
                </p>
              ) : null}
              {project.productionUrl ? (
                <p className="pt-1">
                  <a
                    href={project.productionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors hover:opacity-90"
                    style={{ color: "var(--accent)" }}
                  >
                    Посмотреть в продакшене
                    <ArrowUpRight size={14} className="shrink-0" aria-hidden />
                  </a>
                </p>
              ) : null}
            </div>
          )}
        </div>

        {(project.heroVideo || project.heroImage) && (
          <div className="mb-14 w-full min-w-0 md:mb-16">
            {project.heroVideo ? (
              <HeroCaseVideo
                src={project.heroVideo}
                poster={project.heroImage}
                title={project.title}
                compact
              />
            ) : (
              <HeroCaseImage src={project.heroImage!} title={project.title} compact />
            )}
          </div>
        )}

        <div className={CASE_FULL_WIDTH}>
          {/* Two columns: description + features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div
              className="transition-all duration-1000 ease-out"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "300ms",
              }}
            >
              <p className="text-base md:text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {project.heroDescription}
              </p>
            </div>
            <div
              className="transition-all duration-1000 ease-out"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: "400ms",
              }}
            >
              <ul className="space-y-3 mb-8">
                {project.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span
                      className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                      style={{ backgroundColor: "var(--accent)" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="border-t pt-6" style={{ borderColor: "var(--border)" }}>
                <p
                  className="text-[10px] uppercase tracking-[0.15em] font-bold mb-2"
                  style={{ color: "var(--text)" }}
                >
                  Ключевые задачи:
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {project.goals}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase 1 */}
      {project.showcaseImage1 ? (
        <ShowcasePhoto src={project.showcaseImage1} label={project.showcaseLabel1} />
      ) : (
        <ParallaxShowcase label={project.showcaseLabel1} />
      )}

      {/* Text block 1 */}
      <TextBlock leftText={project.leftText1} rightText={project.rightText1} />

      {project.showcasePair && !project.showcasePairAfterShowcase2 ? (
        <ShowcasePair
          leftSrc={project.showcasePair.left}
          rightSrc={project.showcasePair.right}
          label={project.showcasePair.label}
        />
      ) : null}

      {/* Showcase 2 (опционально) */}
      {project.showcaseImage2 || project.showcaseLabel2 ? (
        project.showcaseImage2 ? (
          <ShowcasePhoto src={project.showcaseImage2} label={project.showcaseLabel2 ?? ""} dark={false} />
        ) : (
          <ParallaxShowcase label={project.showcaseLabel2!} dark={false} />
        )
      ) : null}

      {project.showcasePair && project.showcasePairAfterShowcase2 ? (
        <ShowcasePair
          leftSrc={project.showcasePair.left}
          rightSrc={project.showcasePair.right}
          label={project.showcasePair.label}
        />
      ) : null}

      {/* Showcase 3 (optional) */}
      {project.showcaseImage3 ? (
        <ShowcasePhoto src={project.showcaseImage3} label={project.showcaseLabel3 ?? ""} />
      ) : null}

      {/* Text block 2 (accent) */}
      <TextBlock leftText={project.leftText2} rightText={project.rightText2} accent />

      {(project.resultMetrics?.length || project.techStack?.length) ? (
        <section
          className="py-16 md:py-20"
          style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}
        >
          <div className={CASE_FULL_WIDTH}>
            {project.resultMetrics?.length ? (
              <>
                <p
                  className="mb-5 text-center text-[9px] font-bold uppercase tracking-[0.2em] md:mb-6"
                  style={{ color: "var(--text-muted)" }}
                >
                  Результаты
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 md:gap-5">
                  {project.resultMetrics.map((m, i) => (
                    <div
                      key={`${m.label}-${i}`}
                      className="rounded-lg border px-2 py-2.5 text-center sm:rounded-xl sm:px-3 sm:py-3 md:px-3.5 md:py-3.5"
                      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
                    >
                      <p
                        className="font-heading text-[11px] font-semibold leading-[1.2] tracking-tight sm:text-xs md:text-sm lg:text-base"
                        style={{ color: "var(--text)" }}
                      >
                        {m.value}
                      </p>
                      <p
                        className="mt-1 text-[8px] leading-snug sm:text-[9px] md:text-[10px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
            {project.techStack?.length ? (
              <div className={project.resultMetrics?.length ? "mt-14 md:mt-16" : ""}>
                <p
                  className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] md:mb-8"
                  style={{ color: "var(--text-muted)" }}
                >
                  Технологии
                </p>
                <ul className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {project.techStack.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border px-3 py-1.5 text-xs font-medium md:px-4 md:py-2 md:text-sm"
                      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {project.imageGallery?.length
        ? project.imageGallery.map((item, i) => (
            <ShowcasePhoto
              key={`${item.src}-${i}`}
              src={item.src}
              label={item.label}
              dark={i % 2 === 0}
            />
          ))
        : null}

      {/* Navigation between cases */}
      <section className="py-16 md:py-20" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
        <div className={CASE_FULL_WIDTH}>
          <div className="flex w-full min-w-0 flex-col gap-3 md:flex-row md:gap-4">
            {prevCase && (
              <NavLink href={`/portfolio/${prevCase.slug}`} label={prevCase.title} direction="prev" />
            )}
            {nextCase && (
              <NavLink href={`/portfolio/${nextCase.slug}`} label={nextCase.title} direction="next" />
            )}
          </div>
        </div>
      </section>
    </article>
  );
}
