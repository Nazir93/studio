"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";

/* ─── CONFIG: текстовые «кадры» (баннеры) ─── */

const BANNERS = [
  {
    label: "КАДР 01 · WEB",
    title: "Сайты и платформы",
    body: "Лендинги, корпоративные порталы, SaaS — полный цикл от прототипа до продакшена.",
  },
  {
    label: "КАДР 02 · DESIGN",
    title: "UX/UI и интерфейсы",
    body: "Исследования, прототипы, дизайн-системы в Figma. Figma → код без потерь.",
  },
  {
    label: "КАДР 03 · MOBILE",
    title: "Мобильные приложения",
    body: "iOS, Android, кроссплатформа. Продукты, которыми пользуются каждый день.",
  },
  {
    label: "КАДР 04 · AI",
    title: "ИИ и автоматизация",
    body: "Ассистенты, интеграции, роботизация рутины — меньше ручного труда.",
  },
  {
    label: "КАДР 05 · ENTERPRISE",
    title: "Корпоративные системы",
    body: "Порталы, личные кабинеты, интеграции с вашей IT-инфраструктурой.",
  },
  {
    label: "КАДР 06 · GROWTH",
    title: "Реклама и рост",
    body: "Таргет, контекст, SEO, аналитика — приводим клиентов и измеряем результат.",
  },
];

const SCROLL_PER_BANNER = 1100;
const SPLICE_DURATION = 0.08;
const JAM_POSITION = 0.55;

/** Фон: «Как создавались эффекты в старых фильмах» → public/videos/film-old-movies-effects.mp4 */
const BACKGROUND_VIDEO_SRC = "/videos/film-old-movies-effects.mp4";

/* ─── HELPERS ─── */

function formatTimecode(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const f = Math.floor((seconds % 1) * 24);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
}

/* ─── GRAIN / GLITCH CANVAS ─── */

function GrainCanvas({ intensity, glitch }: { intensity: number; glitch: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let W = 0, H = 0;
    let raf = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      if (intensity > 0.01) {
        const imgData = ctx.createImageData(W, H);
        const d = imgData.data;
        const factor = intensity * 255;
        for (let i = 0; i < d.length; i += 4) {
          const v = Math.random() * factor;
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = factor * 0.6;
        }
        ctx.putImageData(imgData, 0, 0);
      }

      if (glitch) {
        const slices = 3 + Math.floor(Math.random() * 5);
        for (let s = 0; s < slices; s++) {
          const y = Math.random() * H;
          const h = 2 + Math.random() * 20;
          const shift = (Math.random() - 0.5) * 60;
          ctx.fillStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.08})`;
          ctx.fillRect(shift, y, W, h);
        }
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [intensity, glitch]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[10] h-full w-full" />;
}

/* ─── FILM JAM EFFECT ─── */

function FilmJamOverlay({ active, onFixed }: { active: boolean; onFixed: () => void }) {
  const [phase, setPhase] = useState<"idle" | "jammed" | "fixing" | "fixed">("idle");

  useEffect(() => {
    if (active && phase === "idle") {
      setPhase("jammed");
      const t1 = setTimeout(() => setPhase("fixing"), 2000);
      const t2 = setTimeout(() => { setPhase("fixed"); onFixed(); }, 4000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (phase === "idle" || phase === "fixed") return null;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      {phase === "jammed" && (
        <div className="text-center">
          <div className="relative">
            <div className="w-40 h-1 mx-auto mb-6" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
              <div className="h-full animate-pulse" style={{ width: "30%", backgroundColor: "#ff4444" }} />
            </div>
            <p className="font-matrix text-[10px] sm:text-xs uppercase tracking-[0.18em] animate-pulse px-2" style={{ color: "#ff4444" }}>
              !! ПЛЁНКА ЗАЖЕВАНА !!
            </p>
            <p className="font-matrix text-[10px] uppercase tracking-[0.15em] mt-3" style={{ color: "rgba(255,255,255,0.45)" }}>
              Ожидайте...
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-3 h-16 border border-white/10"
                style={{
                  transform: `rotate(${(Math.random() - 0.5) * 30}deg) translateY(${Math.random() * 20}px)`,
                  opacity: 0.3 + Math.random() * 0.3,
                  backgroundColor: `rgba(255,255,255,${0.02 + Math.random() * 0.05})`,
                }} />
            ))}
          </div>
        </div>
      )}

      {phase === "fixing" && (
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse" style={{ color: "rgba(255,255,255,0.45)" }}>
              <g fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="35" y="20" width="30" height="60" rx="3" />
                <line x1="35" y1="35" x2="65" y2="35" />
                <line x1="35" y1="50" x2="65" y2="50" />
                <line x1="35" y1="65" x2="65" y2="65" />
                <circle cx="50" cy="12" r="4" />
                <path d="M42 20 L42 8 Q42 4 46 4 L50 4" />
                <path d="M58 20 L58 8 Q58 4 54 4 L50 4" />
              </g>
            </svg>
            <p className="font-matrix text-[10px] uppercase tracking-[0.15em] mt-2 animate-pulse" style={{ color: "rgba(255,255,255,0.45)" }}>
              Монтажер чинит плёнку...
            </p>
          </div>
          <div className="w-40 h-[2px] mx-auto" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <div className="h-full transition-all duration-[2000ms] ease-linear" style={{ width: "100%", backgroundColor: "rgba(255,255,255,0.85)" }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN ─── */

function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full object-cover"
      src={BACKGROUND_VIDEO_SRC}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-hidden
    />
  );
}

/** Секция после киноплёнки: газета; цвета из темы (день/ночь — как в Header). */
function FilmNewspaperEpilogue() {
  const { isDark } = useTheme();
  const paperShadow = isDark ? "8px 8px 0 rgba(0,0,0,0.55)" : "8px 8px 0 rgba(0,0,0,0.12)";

  return (
    <section
      className="relative z-10 border-t font-redmolot transition-colors duration-300"
      style={{
        backgroundColor: "var(--bg)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14 md:py-16">
        <div
          className="border-[3px] p-1 transition-colors duration-300"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-secondary)",
            boxShadow: paperShadow,
          }}
        >
          <div
            className="border-2 p-3 transition-colors duration-300 sm:p-5 md:p-6"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-secondary)",
            }}
          >
            <header
              className="border-b-4 border-double pb-3 text-center transition-colors duration-300"
              style={{ borderColor: "var(--border)" }}
            >
              <p className="text-lg uppercase tracking-[0.06em] sm:text-xl md:text-2xl" style={{ color: "var(--text)" }}>
                Вечерний кинематограф
              </p>
              <p
                className="mt-2 text-[9px] uppercase tracking-[0.2em] sm:text-[10px]"
                style={{ color: "var(--text-muted)" }}
              >
                Литературное приложение · выходит нерегулярно · демонстрационный выпуск
              </p>
            </header>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 sm:gap-5">
              <article
                className="border-2 p-3 transition-colors duration-300 sm:p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
              >
                <h2 className="text-sm uppercase leading-tight sm:text-base" style={{ color: "var(--text)" }}>
                  О титрах и кадре
                </h2>
                <p className="mt-2 text-[11px] leading-relaxed sm:text-xs" style={{ color: "var(--text-muted)" }}>
                  Каждый прокрученный фрагмент — отсылка к монтажной склейке. Здесь демонстрируется, как
                  скролл может заменить ленту и киноскоп, не отвлекая от сути: услуги студии и характер
                  работы с визуалом.
                </p>
              </article>

              <article
                className="border-2 p-3 transition-colors duration-300 sm:p-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
              >
                <h2 className="text-sm uppercase leading-tight sm:text-base" style={{ color: "var(--text)" }}>
                  Заметки редактора
                </h2>
                <p className="mt-2 text-[11px] leading-relaxed sm:text-xs" style={{ color: "var(--text-muted)" }}>
                  Вся полоса набрана одним шрифтом. Свет/тема страницы — переключатель в шапке сайта.
                </p>
              </article>
            </div>

            <div
              className="mt-4 border-2 p-3 transition-colors duration-300 sm:p-4"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
            >
              <h2
                className="text-center text-sm uppercase leading-tight sm:text-base"
                style={{ color: "var(--text)" }}
              >
                Хроника демонстрационного номера
              </h2>
              <div className="mt-4 space-y-3 sm:columns-2 sm:space-y-0 sm:[column-gap:1.5rem]">
                <p
                  className="text-[11px] leading-relaxed [break-inside:avoid] sm:text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Киноплёнка как метафора подачи контента: кадр сменяет кадр, зритель удерживает внимание.
                  Ниже — не часть ролика, а отдельная полоса верстки, как приложение к «главному фильму»
                  страницы.
                </p>
                <p
                  className="text-[11px] leading-relaxed [break-inside:avoid] sm:text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Если нужен такой же приём в продукте — лендинг, презентация, интерактивный каталог —
                  мы соберём сценарий, визуал и анимацию под ваш бренд. Обсудить можно через форму
                  заявки в разделе контактов или по кнопке после «зажима» плёнки в демо.
                </p>
              </div>
            </div>

            <footer
              className="mt-5 border-t-2 pt-3 text-center transition-colors duration-300"
              style={{ borderColor: "var(--border)" }}
            >
              <p
                className="text-[8px] uppercase tracking-[0.25em] sm:text-[9px]"
                style={{ color: "var(--text-subtle)" }}
              >
                CODE 1.618 · макет страницы «Киноплёнка»
              </p>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FilmReelContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isSplice, setIsSplice] = useState(false);
  const [totalTimecode, setTotalTimecode] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [isJammed, setIsJammed] = useState(false);
  const [jamFixed, setJamFixed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(true);

  const totalScrollHeight = BANNERS.length * SCROLL_PER_BANNER;

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scrolled = -rect.top;
    const maxScroll = container.scrollHeight - window.innerHeight;
    const progress = maxScroll <= 0 ? 0 : Math.max(0, Math.min(1, scrolled / maxScroll));

    setScrollProgress(progress);

    if (!jamFixed && progress >= JAM_POSITION && progress < JAM_POSITION + 0.05) {
      setIsJammed(true);
    }

    const n = BANNERS.length;
    const rawIdx = progress * n;
    const idx = Math.min(Math.floor(rawIdx), n - 1);
    const inBanner = rawIdx - idx;

    const spliceZone = inBanner < SPLICE_DURATION || inBanner > (1 - SPLICE_DURATION);
    setIsSplice(spliceZone && idx < n - 1 && inBanner > (1 - SPLICE_DURATION));

    setActiveIdx(idx);
    setTotalTimecode(progress * n * 10);
    setFrameCount(Math.floor(progress * n * 240));

    setSubtitleVisible(inBanner > 0.06 && inBanner < 0.94);
  }, [jamFixed]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleJamFixed = () => {
    setJamFixed(true);
    setIsJammed(false);
    setShowForm(true);
  };

  const banner = BANNERS[activeIdx];

  return (
    <>
    <div ref={containerRef} className="relative" style={{ height: `${totalScrollHeight}px` }}>
      <div
        className="sticky z-0 top-14 sm:top-[4.25rem] h-[calc(100svh-3.5rem)] sm:h-[calc(100svh-4.25rem)] w-full overflow-hidden"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <BackgroundVideo />
        {/* Затемнение под текст и «плёнку» */}
        <div
          className="pointer-events-none absolute inset-0 z-[6] bg-black/45"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[7] bg-gradient-to-b from-black/50 via-black/25 to-black/55"
          aria-hidden
        />

        <GrainCanvas intensity={isSplice ? 0.55 : 0.1} glitch={isSplice} />

        <div className="pointer-events-none absolute inset-0 z-[11] opacity-[0.06]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)" }} />

        <div className="pointer-events-none absolute inset-0 z-[11]"
          style={{ boxShadow: "inset 0 0 120px 50px rgba(0,0,0,0.65)" }} />

        {/* Перфорации плёнки — яркие «окошки» */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-[13] w-4 sm:w-5 flex flex-col justify-between py-2.5 hidden sm:flex"
          style={{
            backgroundColor: "rgba(0,0,0,0.55)",
            boxShadow: "inset -1px 0 0 rgba(255,255,255,0.35), 2px 0 14px rgba(0,0,0,0.5)",
            borderRight: "1px solid rgba(255,255,255,0.35)",
          }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="mx-auto w-[7px] sm:w-2 h-[7px] sm:h-2.5 rounded-[2px]"
              style={{
                border: "1px solid rgba(255,255,255,0.9)",
                backgroundColor: "rgba(5,5,8,0.88)",
                boxShadow: `
                  0 0 0 1px rgba(255,255,255,0.25),
                  0 0 6px rgba(255,255,255,0.45),
                  0 0 14px rgba(255,255,255,0.28),
                  inset 0 1px 0 rgba(255,255,255,0.55),
                  inset 0 -1px 2px rgba(0,0,0,0.55)
                `,
              }}
            />
          ))}
        </div>
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-[13] w-4 sm:w-5 flex flex-col justify-between py-2.5 hidden sm:flex"
          style={{
            backgroundColor: "rgba(0,0,0,0.55)",
            boxShadow: "inset 1px 0 0 rgba(255,255,255,0.35), -2px 0 14px rgba(0,0,0,0.5)",
            borderLeft: "1px solid rgba(255,255,255,0.35)",
          }}
        >
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="mx-auto w-[7px] sm:w-2 h-[7px] sm:h-2.5 rounded-[2px]"
              style={{
                border: "1px solid rgba(255,255,255,0.9)",
                backgroundColor: "rgba(5,5,8,0.88)",
                boxShadow: `
                  0 0 0 1px rgba(255,255,255,0.25),
                  0 0 6px rgba(255,255,255,0.45),
                  0 0 14px rgba(255,255,255,0.28),
                  inset 0 1px 0 rgba(255,255,255,0.55),
                  inset 0 -1px 2px rgba(0,0,0,0.55)
                `,
              }}
            />
          ))}
        </div>

        {/* HUD верх — над слоями зерна, под модалками */}
        <div className="absolute top-0 left-0 right-0 z-[32] flex items-start justify-between pt-3 sm:pt-4 px-4 sm:pl-9 sm:pr-9">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#ff3333" }} />
            <span className="font-matrix text-[9px] sm:text-[10px] uppercase tracking-[0.2em]" style={{ color: "#ff3333" }}>
              rec
            </span>
          </div>
          <div className="text-right">
            <p className="font-matrix text-xs sm:text-sm tabular-nums tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.65)" }}>
              {formatTimecode(totalTimecode)}
            </p>
            <p className="font-matrix text-[8px] sm:text-[9px] tabular-nums tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.3)" }}>
              FRM {String(frameCount).padStart(6, "0")}
            </p>
          </div>
        </div>

        {/* ─── ЦЕНТР: текстовые баннеры (компактно на всех экранах) ─── */}
        <div className="absolute inset-0 z-[25] flex items-center justify-center px-4 sm:px-10 md:px-12 pt-6 pb-28 sm:pb-32 md:pb-36">
          <AnimatePresence mode="wait">
            <motion.div
              key={banner.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{
                opacity: subtitleVisible ? 1 : 0.35,
                y: subtitleVisible ? 0 : 8,
              }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[min(100%,20rem)] sm:max-w-md md:max-w-lg lg:max-w-xl text-center"
            >
              <p className="font-matrix text-[8px] sm:text-[9px] uppercase tracking-[0.2em] mb-2 sm:mb-3" style={{ color: "rgba(255,255,255,0.38)" }}>
                {banner.label}
              </p>
              <h2 className="font-heading text-base leading-snug tracking-tight text-balance sm:text-lg md:text-xl lg:text-2xl" style={{ color: "rgba(255,255,255,0.96)" }}>
                {banner.title}
              </h2>
              <p className="font-body mt-3 sm:mt-4 text-[11px] sm:text-xs md:text-sm leading-relaxed text-balance mx-auto" style={{ color: "rgba(255,255,255,0.52)" }}>
                {banner.body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* HUD низ */}
        <div className="absolute bottom-0 left-0 right-0 z-[32] pb-4 sm:pb-5 px-4 sm:pl-9 sm:pr-9">
          <div className="flex items-end justify-between mb-3 gap-4">
            <div className="min-w-0">
              <p className="font-matrix text-[8px] sm:text-[9px] uppercase tracking-[0.2em] mb-1 truncate" style={{ color: "rgba(255,255,255,0.28)" }}>
                {banner.label}
              </p>
              <span className="font-matrix text-[8px] tabular-nums tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.22)" }}>
                {String(activeIdx + 1).padStart(2, "0")} / {String(BANNERS.length).padStart(2, "0")}
              </span>
            </div>
            <p className="font-matrix text-[8px] sm:text-[9px] uppercase tracking-[0.15em] shrink-0" style={{ color: "rgba(255,255,255,0.22)" }}>
              CODE 1.618 · КИНОПЛЁНКА
            </p>
          </div>

          <div className="relative h-[2px] w-full" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
            {BANNERS.map((_, i) => (
              <div key={i} className="absolute top-0 bottom-0 w-px"
                style={{ left: `${(i / BANNERS.length) * 100}%`, backgroundColor: "rgba(255,255,255,0.15)" }} />
            ))}
            <div className="absolute top-0 left-0 h-full transition-[width] duration-75"
              style={{ width: `${scrollProgress * 100}%`, backgroundColor: "#ff3333" }} />
            <div className="absolute -top-1 w-[3px] h-[4px] transition-[left] duration-75"
              style={{ left: `${scrollProgress * 100}%`, backgroundColor: "#ff3333" }} />
          </div>

          <p className="font-matrix text-[7px] sm:text-[8px] uppercase tracking-[0.18em] text-center mt-3 sm:mt-3.5" style={{ color: "rgba(255,255,255,0.28)" }}>
            Скролл вниз — кадры · ниже — газетная полоса
          </p>
        </div>

        {isSplice && (
          <div className="absolute inset-0 z-[20] pointer-events-none animate-pulse"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />
        )}

        <FilmJamOverlay active={isJammed} onFixed={handleJamFixed} />

        {showForm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }}>
            <div className="max-w-sm sm:max-w-md w-full p-5 sm:p-8 md:p-10" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              <p className="font-matrix text-[8px] sm:text-[9px] uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                Плёнка восстановлена · Связаться
              </p>
              <h3 className="font-heading text-base leading-snug tracking-tight text-balance sm:text-lg md:text-xl" style={{ color: "rgba(255,255,255,0.92)" }}>
                Хотите такой дизайн?
              </h3>
              <p className="font-body text-xs sm:text-sm leading-relaxed mt-2 sm:mt-3" style={{ color: "rgba(255,255,255,0.5)" }}>
                Мы создаём интерактивные визуальные опыты для брендов, которые хотят выделяться.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/brief?source=gallery"
                  onClick={() => setShowForm(false)}
                  className="group flex items-center gap-2 px-6 py-3 font-matrix text-xs uppercase tracking-[0.15em] transition-all duration-300"
                  style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#000" }}
                >
                  Обсудить проект <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 font-matrix text-xs uppercase tracking-[0.15em] transition-colors"
                  style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}>
                  Продолжить просмотр
                </button>
              </div>
            </div>
          </div>
        )}

        {scrollProgress < 0.02 && (
          <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-[30] flex flex-col items-center gap-2 animate-bounce">
            <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
              style={{ border: "1px solid rgba(255,255,255,0.25)" }}>
              <div className="w-1 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.45)" }} />
            </div>
            <span className="font-matrix text-[8px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.28)" }}>
              Листайте — смена кадров
            </span>
          </div>
        )}
      </div>
    </div>

    <FilmNewspaperEpilogue />
    </>
  );
}
