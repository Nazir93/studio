"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useIsDesktopLg } from "@/lib/use-is-desktop-lg";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { NeuralNetworkCanvas } from "@/components/effects/neural-network-canvas";

/** Заголовок баннера: один ритм; на lg+ крупнее, чем на планшете */
const BANNER_GHOST_MEASURE_CLASS =
  "font-akony text-[clamp(0.95rem,3.8vw,2.2rem)] font-normal leading-[0.9] tracking-[0.02em] uppercase " +
  "sm:text-[clamp(1.05rem,3.2vw,2.5rem)] md:text-[clamp(1.12rem,2.6vw,2.85rem)] " +
  "lg:text-[clamp(1.45rem,3.15vw,4rem)] xl:text-[clamp(1.55rem,2.95vw,4.35rem)] 2xl:text-[clamp(1.65rem,2.85vw,4.85rem)]";

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

/** CTA «Обсудить проект»: моб. — обычная кнопка; lg+ — круг с лого */
function BannerOfferCircle() {
  return (
    <Link
      href="/brief?source=banner-offer"
      prefetch
      scroll
      className="group relative z-[1] ml-auto block w-full max-w-sm shrink-0 overflow-hidden rounded-full border text-center transition-[border-color,box-shadow,transform] hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:max-w-xs lg:ml-0 lg:-translate-x-3 lg:aspect-square lg:h-[min(11.5rem,22vw)] lg:w-[min(11.5rem,22vw)] lg:min-h-[10.5rem] lg:min-w-[10.5rem] lg:max-w-none xl:-translate-x-5"
      style={{
        borderColor: "var(--border)",
        boxShadow: "0 0 0 1px color-mix(in srgb, var(--text) 8%, transparent), 0 12px 32px rgba(0,0,0,0.22)",
      }}
      aria-label="Обсудить проект — бриф"
    >
      {/* Мобильные / планшеты: одна кнопка, без лого */}
      <span className="flex min-h-[3rem] w-full items-center justify-center bg-[var(--bg-secondary)] px-5 py-3.5 font-akony text-[13px] font-normal uppercase leading-none tracking-[0.1em] text-[var(--text)] active:opacity-95 lg:hidden">
        Обсудить проект
      </span>

      {/* Десктоп: лого + чёрный круг с текстом по центру */}
      <div className="absolute inset-0 hidden bg-[var(--bg)] lg:block">
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
          <span className="flex flex-col items-center gap-[0.45em] font-akony text-center font-normal uppercase leading-none tracking-[0.02em] text-[clamp(0.36rem,1.35vw,0.52rem)] text-white sm:gap-[0.52em] sm:text-[clamp(0.4rem,1.2vw,0.58rem)] md:gap-[0.58em] md:text-[clamp(0.44rem,1.1vw,0.62rem)]">
            <span className="block">Обсудить</span>
            <span className="block">проект</span>
          </span>
        </span>
      </div>
    </Link>
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

export function BannerSection() {
  const router = useRouter();
  const switchSoundRef = useRef<HTMLAudioElement | null>(null);
  const isFirstMountRef = useRef(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const time = useCurrentTime();
  const active = SLIDES[activeIdx];
  const allowHeavyMedia = useIsDesktopLg();
  const { isDark } = useTheme();

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
        /* под шапку в потоке на главной — оставшаяся высота экрана (~5rem запас под нав + safe area) */
        height: "calc(100dvh - 5rem)",
        minHeight: "min(600px, calc(100dvh - 5rem))",
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

      {/* Нейросеть на canvas — как на /services/ai-automation */}
      <NeuralNetworkCanvas />

      {/* ===== CONTENT ===== */}
      <div className="relative z-[10] flex h-full min-h-0 flex-col justify-between">
        {/* ── TOP BAR ── Отключено: контакты и ссылки — в глобальной NavBar (иначе дубль с логотипом) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={visible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hidden"
          aria-hidden
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
          className={cn(
            "flex min-h-0 flex-1 flex-col justify-center pad-x-hero",
            !isDark &&
              "max-lg:[--banner-text-shadow:0_1px_0_rgba(255,255,255,0.95),0_0_18px_rgba(250,250,250,0.9),0_0_1px_rgba(0,0,0,0.12)] max-lg:[&_h1]:[text-shadow:var(--banner-text-shadow)] max-lg:[&_p]:[text-shadow:var(--banner-text-shadow)] max-lg:[&_.font-matrix]:[text-shadow:var(--banner-text-shadow)] max-lg:[&_.font-akony]:[text-shadow:var(--banner-text-shadow)]"
          )}
        >
          <div className="relative z-[1] mb-3 flex min-w-0 items-end gap-2.5 sm:mb-4 sm:gap-4">
            <div className="flex shrink-0 flex-col items-center gap-2 pb-0.5 pt-0 sm:pb-1.5 sm:pt-0">
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
                <motion.p
                  key={active.titleGhost}
                  variants={titleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(BANNER_GHOST_MEASURE_CLASS, "mt-0.5 block w-full min-w-0 sm:mt-1")}
                  style={{ color: "var(--text)" }}
                >
                  {active.titleGhost}
                </motion.p>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p
                  key={active.subtitle}
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-1.5 font-matrix uppercase tracking-[0.15em] text-[clamp(0.58rem,1.85vw,0.78rem)] sm:mt-2 sm:text-[clamp(0.62rem,1.45vw,0.82rem)] md:text-[0.88rem]"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {active.subtitle}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Строки описания + CTA: на широком экране CTA справа в свободном месте */}
          <div className="relative z-[1] mt-4 flex w-full min-w-0 flex-col gap-5 sm:mt-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6 xl:gap-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.num}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2 md:gap-2.5 lg:max-w-[min(40rem,50vw)] xl:max-w-[42rem]"
              >
                {active.lines.map((line, i) => (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={lineVariants}
                    className="flex items-center gap-3"
                  >
                    <span
                      className="h-[1px] w-4 shrink-0"
                      style={{ backgroundColor: "var(--border)" }}
                    />
                    <p
                      className="font-matrix uppercase leading-relaxed tracking-[0.08em] text-[clamp(0.62rem,1.7vw,0.75rem)] sm:text-[0.75rem] sm:tracking-[0.1em] md:text-[0.8125rem]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {line}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
            <div className="flex shrink-0 justify-end lg:pb-0.5">
              <BannerOfferCircle />
            </div>
          </div>
        </motion.div>

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
