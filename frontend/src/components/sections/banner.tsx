"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PHONE_RAW } from "@/lib/constants";
import { MaskedVideoText } from "@/components/effects/masked-video-text";
import { useIsDesktopLg } from "@/lib/use-is-desktop-lg";
const BANNER_GHOST_VIDEO = "/videos/banner-title-ghost.mp4";
const BANNER_GHOST_MEASURE_CLASS =
  "font-akony text-[clamp(1.05rem,4.6vw,2.55rem)] font-normal leading-[0.95] tracking-[0.02em] uppercase " +
  "sm:text-[clamp(1.15rem,4vw,2.85rem)] md:text-[clamp(1.25rem,3.4vw,3.2rem)] lg:text-[clamp(1.45rem,3.8vw,3.85rem)]";

const SLIDES = [
  {
    num: "01",
    title: "РАЗРАБОТКА",
    titleGhost: "САЙТОВ",
    subtitle: "[ WEB DEVELOPMENT ]",
    tab: "Разработка",
    href: "/services/development",
    lines: [
      "Сайты, лендинги, корпоративные порталы",
      "SaaS-платформы и веб-приложения",
      "React · Next.js · Node.js · TypeScript",
      "Полный цикл: от прототипа до продакшена",
      "Адаптивная вёрстка и кроссбраузерность",
      "SEO-оптимизация из коробки",
    ],
  },
  {
    num: "02",
    title: "ДИЗАЙН",
    titleGhost: "ИНТЕРФЕЙСОВ",
    subtitle: "[ UI/UX DESIGN ]",
    tab: "Дизайн",
    href: "/services/ux-ui-design",
    lines: [
      "Исследования и аналитика пользователей",
      "Прототипирование и wireframes",
      "Дизайн-системы и UI-киты",
      "Motion-дизайн и микроанимации",
      "Figma → код без потерь",
      "Брендинг и айдентика",
    ],
  },
  {
    num: "03",
    title: "ИИ-РЕШЕНИЯ",
    titleGhost: "БУДУЩЕГО",
    subtitle: "[ AI SOLUTIONS ]",
    tab: "ИИ-Решения",
    href: "/services/ai-automation",
    lines: [
      "Чат-боты и голосовые ассистенты",
      "Рекомендательные системы",
      "Компьютерное зрение и OCR",
      "Генерация контента и копирайтинг",
      "Предиктивная аналитика",
      "Интеграция GPT / Claude / LLM",
    ],
  },
  {
    num: "04",
    title: "РЕКЛАМА",
    titleGhost: "И РОСТ",
    subtitle: "[ ADVERTISING ]",
    tab: "Реклама",
    href: "/services/advertising",
    lines: [
      "Таргетированная реклама",
      "Контекстная реклама: Яндекс · Google",
      "SMM-стратегия и ведение соцсетей",
      "SEO-продвижение и аналитика",
      "A/B тесты и оптимизация воронок",
      "Сквозная аналитика и дашборды",
    ],
  },
];

const SWITCH_SOUND = "/sounds/banner-switch.mp3";
const OFFER_LOGO = "/logo.png";

/** Мобильные / планшеты: круглый звонок. Десктоп: большой круг → бриф */
function BannerOfferCircle() {
  return (
    <>
      <a
        href={`tel:${PHONE_RAW}`}
        className="absolute bottom-[7.25rem] right-4 z-[21] flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full border text-center shadow-lg transition-[transform,box-shadow] active:scale-[0.97] min-[480px]:bottom-[7.5rem] min-[480px]:right-5 min-[480px]:h-16 min-[480px]:w-16 lg:hidden"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text)",
          boxShadow: "0 10px 28px rgba(0,0,0,0.4)",
        }}
        aria-label="Позвонить — обсудить проект"
      >
        <Phone className="h-[1.35rem] w-[1.35rem] min-[480px]:h-7 min-[480px]:w-7" strokeWidth={1.5} aria-hidden />
      </a>
      <Link
        href="/brief?source=banner-offer"
        className="group absolute bottom-12 right-[7.5rem] z-[21] hidden h-[min(11.5rem,38vw)] w-[min(11.5rem,38vw)] min-h-[9.5rem] min-w-[9.5rem] overflow-hidden rounded-full border text-center transition-[border-color,box-shadow,transform] hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:bottom-14 sm:right-[8.5rem] lg:flex lg:bottom-[4.5rem] lg:right-[11.5rem] lg:min-h-[11rem] lg:min-w-[11rem] lg:h-[min(14rem,32vw)] lg:w-[min(14rem,32vw)]"
        style={{
          borderColor: "var(--border)",
          boxShadow: "0 0 0 1px color-mix(in srgb, var(--text) 8%, transparent), 0 16px 40px rgba(0,0,0,0.35)",
        }}
        aria-label="Обсудить проект — бриф"
      >
        <span className="pointer-events-none absolute inset-0 bg-[var(--bg)]" aria-hidden />
        <Image
          src={OFFER_LOGO}
          alt=""
          fill
          className="object-contain object-center p-0 opacity-[0.99] transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 200px, 260px"
        />
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 z-[2] flex aspect-square w-[54%] max-w-[7.25rem] min-w-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black px-2 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] sm:min-w-[5rem] md:max-w-[8rem]"
          aria-hidden
        >
          <span className="flex flex-col items-center gap-[0.45em] font-akony text-center font-normal uppercase leading-none tracking-[0.02em] text-[clamp(0.34rem,1.65vw,0.5rem)] text-white sm:gap-[0.52em] sm:text-[clamp(0.38rem,1.4vw,0.56rem)] md:gap-[0.58em] md:text-[clamp(0.42rem,1.25vw,0.6rem)]">
            <span className="block">Обсудить</span>
            <span className="block">проект</span>
          </span>
        </span>
      </Link>
    </>
  );
}

function useCurrentTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);
  return time;
}

const lineVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.2 } },
};

const titleVariants = {
  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -40,
    filter: "blur(10px)",
    transition: { duration: 0.35 },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.15, duration: 0.4 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const DOT_GAP = 28;
const DOT_BASE_R = 1;
const DOT_MAX_R = 3.5;
const DOT_BASE_A = 0.07;
const DOT_MAX_A = 0.45;
const LENS_RADIUS = 110;

function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothMouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    const dpr = window.devicePixelRatio || 1;
    let W = 0;
    let H = 0;

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

    const isDark = () => {
      const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
      return bg === "#0A0A0A" || bg === "#0a0a0a" || bg.includes("10,10,10");
    };

    const draw = () => {
      const sm = smoothMouseRef.current;
      const tm = mouseRef.current;
      sm.x += (tm.x - sm.x) * 0.15;
      sm.y += (tm.y - sm.y) * 0.15;

      ctx.clearRect(0, 0, W, H);

      const dark = isDark();
      const cols = Math.ceil(W / DOT_GAP) + 1;
      const rows = Math.ceil(H / DOT_GAP) + 1;
      const offsetX = (W - (cols - 1) * DOT_GAP) / 2;
      const offsetY = (H - (rows - 1) * DOT_GAP) / 2;

      const mx = sm.x;
      const my = sm.y;
      const lr2 = LENS_RADIUS * LENS_RADIUS;

      for (let row = 0; row < rows; row++) {
        const py = offsetY + row * DOT_GAP;
        const dy = py - my;
        const dy2 = dy * dy;

        if (dy2 > lr2 + DOT_GAP * DOT_GAP * 4) {
          for (let col = 0; col < cols; col++) {
            const px = offsetX + col * DOT_GAP;
            ctx.globalAlpha = DOT_BASE_A;
            ctx.beginPath();
            ctx.arc(px, py, DOT_BASE_R, 0, Math.PI * 2);
            ctx.fillStyle = dark ? "#ffffff" : "#000000";
            ctx.fill();
          }
          continue;
        }

        for (let col = 0; col < cols; col++) {
          const px = offsetX + col * DOT_GAP;
          const dx = px - mx;
          const dist2 = dx * dx + dy2;

          let r = DOT_BASE_R;
          let a = DOT_BASE_A;

          if (dist2 < lr2) {
            const dist = Math.sqrt(dist2);
            const t = 1 - dist / LENS_RADIUS;
            const ease = t * t * (3 - 2 * t);
            r = DOT_BASE_R + (DOT_MAX_R - DOT_BASE_R) * ease;
            a = DOT_BASE_A + (DOT_MAX_A - DOT_BASE_A) * ease;
          }

          ctx.globalAlpha = a;
          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = dark ? "#ffffff" : "#000000";
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      ro.disconnect();
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
    />
  );
}

export function BannerSection() {
  const router = useRouter();
  const switchSoundRef = useRef<HTMLAudioElement | null>(null);
  const isFirstMountRef = useRef(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const time = useCurrentTime();
  const active = SLIDES[activeIdx];
  const allowHeavyMedia = useIsDesktopLg();

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  /** Предзагрузка маршрутов разделов — быстрее тап по вкладкам на мобильных */
  useEffect(() => {
    SLIDES.forEach((slide) => {
      router.prefetch(slide.href);
    });
  }, [router]);

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    if (!allowHeavyMedia) return;
    if (!switchSoundRef.current) {
      switchSoundRef.current = new Audio(SWITCH_SOUND);
      try {
        switchSoundRef.current.preload = "auto";
      } catch {
        /* ignore */
      }
    }
    const a = switchSoundRef.current;
    a.currentTime = 0;
    a.volume = 0.35;
    void a.play().catch(() => {});
  }, [activeIdx, allowHeavyMedia]);

  const goNext = () => setActiveIdx((p) => (p + 1) % SLIDES.length);

  return (
    <section
      className="relative min-h-0 overflow-hidden select-none"
      style={{
        height: "100dvh",
        minHeight: "min(600px, 100dvh)",
        backgroundColor: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* Лёгкая текстура */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Тонкие горизонтальные линии */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, var(--text) 3px, var(--text) 4px)",
        }}
      />

      {/* Интерактивная сетка точек */}
      <DotGrid />

      {/* ===== CONTENT ===== */}
      <div className="relative z-[10] flex h-full min-h-0 flex-col justify-between">
        {/* ── TOP BAR ── */}
        {/* На экранах &lt; lg шапка уже в NavBar (site shell) — иначе два логотипа и две «шапки» */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex items-start justify-between pad-x-hero pt-4 sm:pt-5 md:pt-6"
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/" className="group block relative w-20 h-9 sm:w-24 sm:h-10 md:w-28 md:h-11 shrink-0">
              {/* Постоянное мягкое свечение */}
              <span
                className="absolute -inset-2 sm:-inset-3 rounded-full blur-xl"
                style={{ background: "radial-gradient(circle, var(--text) 0%, transparent 70%)", opacity: 0.07 }}
                aria-hidden
              />
              {/* Усиление свечения при hover */}
              <span
                className="absolute -inset-4 sm:-inset-5 rounded-full blur-2xl opacity-0 group-hover:opacity-[0.12] transition-opacity duration-700"
                style={{ background: "radial-gradient(circle, var(--text) 0%, transparent 70%)" }}
                aria-hidden
              />
              <Image
                src="/logo.png"
                alt="CODE1618"
                fill
                className="object-contain object-left relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-500"
                priority
                sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
              />
            </Link>
            <span
              className="text-[10px] sm:text-[11px] md:text-[12px] tracking-wide border-l pl-2 sm:pl-3 font-sans font-normal"
              style={{ color: "var(--text-muted)", borderColor: "var(--border)" }}
            >
              Студия разработки сайтов
            </span>
          </div>

          <span
            className="hidden sm:block font-matrix text-[10px] sm:text-[11px] tracking-[0.2em] pt-1"
            style={{ color: "var(--text-subtle)" }}
          >
            {time}, RU
          </span>

          <nav className="hidden md:flex items-center gap-5 lg:gap-7 font-matrix text-[10px] lg:text-[11px] tracking-[0.15em] uppercase">
            {[
              { href: "/", label: "Главная" },
              { href: "/portfolio", label: "Проекты" },
              { href: "/fonts", label: "Шрифты" },
              { href: "/contacts", label: "О нас" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors duration-300"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>

        {/* ── MIDDLE: title + animated lines ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex min-h-0 flex-1 flex-col justify-center pad-x-hero"
        >
          <div className="relative z-[1] mb-4 flex min-w-0 items-start gap-2.5 sm:mb-6 sm:gap-4 lg:items-end">
            <div className="flex shrink-0 flex-col items-center gap-2 pb-0 pt-0.5 sm:pb-2 sm:pt-0 lg:pb-1">
              <button
                type="button"
                onClick={goNext}
                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center transition-colors"
                style={{ border: "1px solid var(--border)" }}
                aria-label="Следующий слайд баннера"
              >
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-[1px]" style={{ fill: "var(--text)" }}>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={active.num}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="font-matrix text-[10px] sm:text-[11px] tracking-[0.15em]"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {active.num}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={active.title}
                  variants={titleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={BANNER_GHOST_MEASURE_CLASS}
                  style={{ color: "var(--text)" }}
                >
                  {active.title}
                </motion.h1>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.titleGhost}
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-1 w-full min-w-0"
                >
                  <MaskedVideoText
                    text={active.titleGhost}
                    videoSrc={BANNER_GHOST_VIDEO}
                    measureClassName={BANNER_GHOST_MEASURE_CLASS}
                    disableVideo={!allowHeavyMedia}
                  />
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.subtitle}
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="font-matrix uppercase text-[clamp(0.65rem,2.1vw,0.85rem)] sm:text-[clamp(0.7rem,1.8vw,0.9rem)] md:text-[0.95rem] tracking-[0.15em] mt-2 sm:mt-3"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {active.subtitle}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Строки описания — появляются одна за другой */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.num}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-[1] flex flex-col gap-1.5 sm:gap-2 md:gap-2.5 max-w-xl"
            >
              {active.lines.map((line, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={lineVariants}
                  className="flex items-center gap-3"
                >
                  <span
                    className="w-4 h-[1px] shrink-0"
                    style={{ backgroundColor: "var(--border)" }}
                  />
                  <p
                    className="font-matrix uppercase text-[clamp(0.7rem,2vw,0.8125rem)] sm:text-[0.8125rem] md:text-[0.875rem] leading-relaxed tracking-[0.08em] sm:tracking-[0.12em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {line}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Круг оффера — тот же контейнер, что и «Далее», вплотную слева от стрелки */}
        <BannerOfferCircle />

        {/* ── RIGHT: copyright + arrow ── */}
        <div className="banner-corner-tr absolute bottom-16 z-20 flex flex-col items-end gap-3 sm:bottom-20 sm:gap-5 md:bottom-24">
          <span
            className="font-matrix text-[clamp(1rem,2.5vw,1.75rem)] tracking-[-0.02em] leading-none"
            style={{ color: "var(--text-subtle)" }}
          >
            1.618
          </span>
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={goNext}
              className="w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center transition-all duration-300 group"
              style={{ border: "1px dashed var(--border)" }}
              aria-label="Следующий слайд баннера"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
                style={{ stroke: "var(--text)" }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <span
              className="font-matrix text-[7px] sm:text-[8px] tracking-[0.2em] uppercase"
              style={{ color: "var(--text-subtle)" }}
            >
              Далее
            </span>
          </div>
        </div>

        {/* ── BOTTOM TABS: клик по названию — переход в раздел; треугольник слева и стрелка справа — смена слайда на главной ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex max-w-full flex-wrap items-center justify-center gap-y-2 px-2 pb-4 sm:px-4 sm:pb-5 md:px-8 md:pb-6"
        >
          {SLIDES.map((slide, i) => (
            <Link
              key={slide.num}
              href={slide.href}
              prefetch
              scroll
              onClick={() => setActiveIdx(i)}
              className="relative font-matrix text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.08em] sm:tracking-[0.12em] uppercase px-2.5 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 transition-all duration-400"
              style={{
                color: activeIdx === i ? "var(--text)" : "var(--text-subtle)",
                border: activeIdx === i ? "1px solid var(--border)" : "1px solid transparent",
                backgroundColor: activeIdx === i ? "color-mix(in srgb, var(--text) 4%, transparent)" : "transparent",
              }}
            >
              {slide.tab}
              {activeIdx === i && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 pointer-events-none"
                  style={{ border: "1px solid var(--border)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
