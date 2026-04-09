"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
/* ─── LASER POINTER (вместо курсора в зоне пещеры) ─── */

function LaserCursor({ active }: { active: boolean }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  useEffect(() => {
    if (!active) return;
    const onMove = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [active]);
  if (!active) return null;
  return (
    <>
      <div
        className="pointer-events-none fixed z-[200] h-2.5 w-2.5 rounded-full border border-red-200/90 shadow-[0_0_6px_2px_rgba(255,120,100,0.9),0_0_24px_8px_rgba(255,60,40,0.35)]"
        style={{ left: pos.x - 5, top: pos.y - 5, backgroundColor: "rgba(255,235,230,0.98)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none fixed z-[199] w-[1.5px] bg-gradient-to-b from-red-400/70 via-orange-400/25 to-transparent"
        style={{ left: pos.x, top: pos.y, height: "min(52vh, 400px)" }}
        aria-hidden
      />
    </>
  );
}

/* ─── ГЛАЗ ГОРА + КОД ─── */

function EyeOfHorusMark() {
  return (
    <div className="flex flex-col items-center gap-4 px-2 py-2 md:px-4">
      <div className="relative">
        <div className="absolute inset-0 blur-xl" style={{ background: "radial-gradient(circle, rgba(201,166,108,0.45) 0%, transparent 70%)" }} aria-hidden />
        <svg viewBox="0 0 120 80" className="relative h-16 w-24 md:h-[4.5rem] md:w-32" aria-hidden>
          <defs>
            <linearGradient id="eyeGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0d9a8" />
              <stop offset="45%" stopColor="#c9a66c" />
              <stop offset="100%" stopColor="#8b6914" />
            </linearGradient>
          </defs>
          <path
            fill="url(#eyeGold)"
            d="M60 8 C28 8 8 38 8 40 c0 2 20 32 52 32 s52-30 52-32-20-32-52-32zm0 8c18 0 32 14 32 24S78 64 60 64 28 50 28 40 42 16 60 16zm0 12a12 12 0 100 24 12 12 0 000-24z M60 28 L72 40 60 52 48 40z"
          />
          <circle cx="60" cy="40" r="6" fill="#1a1510" opacity="0.95" />
          <circle cx="60" cy="40" r="3" fill="#c9a66c" opacity="0.9" />
        </svg>
      </div>
      <code
        className="font-matrix max-w-[16rem] rounded-md bg-[#1a1510]/55 px-3 py-2 text-[9px] leading-relaxed tracking-tight md:text-[10px]"
        style={{ color: "#b8a078" }}
      >
        const φ = 1.618; <span className="text-[#e8c87c]">Eye</span>.watch(horizon);
      </code>
    </div>
  );
}

/* ─── 1. ПАЛЕО-КОНТАКТ ─── */

const FRESCO_SERVICES = [
  { h: "𓏏𓊖𓀀", label: "UX-исследование" },
  { h: "𓊃𓏤𓀁", label: "UI-кит" },
  { h: "𓃀𓈖𓀂", label: "Прототип" },
  { h: "𓂋𓏺𓀃", label: "Дизайн-система" },
  { h: "𓇋𓅱𓀄", label: "Handoff" },
  { h: "𓉔𓏤𓀅", label: "Аудит" },
];

function PaleocontactSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [laser, setLaser] = useState(false);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  const glow = useTransform(scrollYProgress, [0, 0.4], [0.15, 1]);

  return (
    <section
      ref={wrapRef}
      className="relative min-h-[160vh]"
      onMouseEnter={() => setLaser(true)}
      onMouseLeave={() => setLaser(false)}
      style={{ cursor: laser ? "none" : undefined }}
    >
      <LaserCursor active={laser} />

      {/* Накальная пещера + камень + фоновое видео */}
      <div className="sticky top-0 flex min-h-screen flex-col overflow-hidden bg-[#0c0a08]">
        <video
          className="pointer-events-none absolute inset-0 z-0 h-full min-h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src="/videos/ancient-paleo.mp4" type="video/mp4" />
        </video>
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background: `
              radial-gradient(ellipse 100% 80% at 50% -20%, rgba(20,16,12,0.75), transparent 52%),
              radial-gradient(ellipse 70% 45% at 50% 100%, rgba(201,166,108,0.14), transparent 55%),
              linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 32%, transparent 62%, rgba(0,0,0,0.6) 100%),
              linear-gradient(165deg, rgba(20,16,12,0.88) 0%, rgba(34,28,24,0.82) 28%, rgba(26,21,16,0.86) 55%, rgba(12,10,8,0.92) 100%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.4] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "160px 160px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.15]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-10 md:px-8 md:pt-14">
          <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
            <div className="min-w-0 max-w-xl">
              <p className="inline-flex items-center gap-2 font-metallord text-[10px] uppercase tracking-[0.4em] text-[#d4b87c]">
                <Sparkles className="h-3 w-3 shrink-0 opacity-80" strokeWidth={1.5} />
                Палео-контакт
              </p>
              <h1 className="mt-4 max-w-[20ch] bg-gradient-to-br from-[#f5ead8] via-[#e8dcc8] to-[#c9a66c] bg-clip-text font-heading text-[clamp(1.15rem,3.5vw,2rem)] leading-[1.12] tracking-[0.03em] text-balance text-transparent normal-case sm:max-w-none sm:text-[clamp(1.25rem,2.8vw,2.1rem)] md:leading-[1.06]">
                Древность
                <br className="sm:hidden" />
                <span className="whitespace-nowrap sm:whitespace-normal">&amp; мистика</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#c4b090] md:text-[1.05rem] md:leading-relaxed">
                UX/UI-дизайн под ваш продукт: исследования, прототип, интерфейс и UI-кит в Figma — чтобы пользователям было
                понятно и удобно, а бизнесу проще расти. Оценим задачу и сроки, предложим формат работы без лишней воды.
              </p>
            </div>
            <EyeOfHorusMark />
          </div>

          {/* Иероглифы-фрески */}
          <motion.div
            className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4"
            style={{ opacity: glow }}
          >
            {FRESCO_SERVICES.map((s, i) => (
              <motion.div
                key={s.label}
                className="group relative px-1 py-4 text-center transition-transform duration-300 hover:-translate-y-0.5 sm:px-2 sm:py-5"
                initial={{ opacity: 0.35, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#c9a66c]/06 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative block text-[clamp(2.25rem,7vw,3.75rem)] leading-[1.05] text-[#e8d4b0] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] md:text-[clamp(2.75rem,4.5vw,4rem)]">
                  {s.h}
                </span>
                <span className="relative mt-3 block font-metallord text-[9px] uppercase tracking-[0.14em] text-[#9a8868] sm:text-[10px]">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── 2. РОЗЕТТСКИЙ КАМЕНЬ ─── */

const GLYPH_ROWS = [
  { g: "𓀀 𓀁 𓀂 𓀃", tip: "Сделаем лендинг за 14 дней" },
  { g: "𓀄 𓀅 𓀆 𓀇", tip: "UI-кит и дизайн-система под ваш бренд" },
  { g: "𓀈 𓀉 𓀊 𓀋", tip: "Кликабельный прототип до разработки" },
  { g: "𓀌 𓀍 𓀎 𓀏", tip: "Исследования и CJM — в стоимости этапа" },
];

const DEMOTIC_OFFERS = [
  "Фиксированный срок на MVP-интерфейс — прозрачная смета.",
  "Пакет «прототип + UI» для питчей и тестов с пользователями.",
  "Сопровождение handoff: Figma → вашей команде или нашей разработке.",
];

const GREEK_TZ = [
  "Τεχνική προδιαγραφή · прототип · responsive breakpoints.",
  "Σύστημα σχεδιασμού · tokens · components library.",
  "Accessibility · contrast · focus states · WCAG-oriented.",
  "Παράδοση · Zeplin / Figma inspect · assets export.",
];

function SandstormCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const particles: { x: number; y: number; vx: number; s: number; a: number }[] = [];
    const W = () => c!.clientWidth;
    const H = () => c!.clientHeight;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    const resize = () => {
      c!.width = W() * dpr;
      c!.height = H() * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    for (let i = 0; i < 140; i++) {
      particles.push({
        x: Math.random() * 400,
        y: Math.random() * 80,
        vx: 1.5 + Math.random() * 3.5,
        s: 0.4 + Math.random() * 1.8,
        a: 0.08 + Math.random() * 0.2,
      });
    }

    const tick = () => {
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, "rgba(201,166,108,0.06)");
      g.addColorStop(0.5, "rgba(26,22,18,0.02)");
      g.addColorStop(1, "rgba(201,166,108,0.05)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        if (p.x > w + 20) {
          p.x = -20;
          p.y = Math.random() * h;
        }
        ctx.fillStyle = `rgba(220, 185, 130, ${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize);
    ro.observe(c!);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden />;
}

function RosettaSection() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section
      className="relative border-t"
      style={{
        borderColor: "var(--border)",
        background: `
          radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, var(--text) 6%, transparent), transparent 55%),
          linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg) 45%)`,
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <p className="font-metallord text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--text-muted)" }}>
            Розеттский камень
          </p>
          <h2
            className="mt-4 font-heading text-xl tracking-tight md:text-3xl"
            style={{
              color: "var(--text)",
              textShadow: "0 1px 0 color-mix(in srgb, var(--text) 8%, transparent)",
            }}
          >
            Три языка одной услуги
          </h2>
          <p className="mt-3 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
            Плита из трёх колонок: наведите на иероглифы — прочтите оффер по-русски.
          </p>
        </div>

        <div
          className="mt-12 overflow-hidden rounded-2xl border shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)] md:rounded-3xl"
          style={{
            borderColor: "color-mix(in srgb, var(--text) 14%, transparent)",
            background:
              "linear-gradient(145deg, color-mix(in srgb, var(--text) 5%, var(--bg)) 0%, var(--bg) 40%, color-mix(in srgb, var(--bg-secondary) 100%, transparent) 100%)",
          }}
        >
          <div className="grid grid-cols-1 divide-y border-b-0 md:grid-cols-3 md:divide-x md:divide-y-0" style={{ borderColor: "var(--border)" }}>
            {/* Иероглифы */}
            <div className="relative flex flex-col bg-gradient-to-b from-[color-mix(in_srgb,var(--text)_4%,transparent)] to-transparent p-5 md:p-8">
              <span className="mb-2 inline-flex w-fit items-center gap-2 border-b border-[color-mix(in_srgb,var(--accent)_35%,transparent)] pb-2 font-metallord text-[9px] uppercase tracking-[0.28em]" style={{ color: "var(--text-subtle)" }}>
                Иероглифы
              </span>
              {GLYPH_ROWS.map((row, i) => (
                <button
                  key={i}
                  type="button"
                  className="group relative border-b py-5 text-left transition-colors last:border-b-0 md:border-b"
                  style={{ borderColor: "var(--border)" }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <span className="text-[1.15rem] leading-relaxed tracking-wide text-[#c9a66c] transition-colors group-hover:text-[#e8d4b0] md:text-xl">
                    {row.g}
                  </span>
                  <div
                    className="pointer-events-none mt-3 min-h-[2.5rem] rounded-md border border-transparent px-2 py-1.5 text-xs transition-all md:text-sm"
                    style={{
                      color: "var(--text-muted)",
                      opacity: hover === i ? 1 : 0.45,
                      borderColor: hover === i ? "color-mix(in srgb, var(--accent) 25%, transparent)" : "transparent",
                      backgroundColor: hover === i ? "color-mix(in srgb, var(--text) 4%, transparent)" : "transparent",
                    }}
                  >
                    {hover === i ? `↳ ${row.tip}` : "· · · наведите для перевода"}
                  </div>
                </button>
              ))}
            </div>

            {/* Демотический — офферы */}
            <div
              className="relative p-5 md:p-8"
              style={{
                background:
                  "linear-gradient(160deg, color-mix(in srgb, var(--text) 6%, transparent) 0%, color-mix(in srgb, var(--text) 2%, transparent) 100%)",
              }}
            >
              <span className="mb-2 inline-flex w-fit items-center gap-2 border-b border-[color-mix(in_srgb,var(--accent)_40%,transparent)] pb-2 font-metallord text-[9px] uppercase tracking-[0.28em]" style={{ color: "var(--text-subtle)" }}>
                Демотический слой
              </span>
              <ul className="mt-8 space-y-5 text-sm leading-relaxed md:text-[0.95rem]" style={{ color: "var(--text-muted)" }}>
                {DEMOTIC_OFFERS.map((t) => (
                  <li
                    key={t}
                    className="relative flex gap-4 rounded-lg py-1 pl-5"
                    style={{ borderLeft: "3px solid color-mix(in srgb, var(--accent) 55%, transparent)" }}
                  >
                    <span className="absolute -left-1 top-2 h-1.5 w-1.5 rounded-full bg-[color-mix(in_srgb,var(--accent)_70%,transparent)]" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Греческий — ТЗ */}
            <div className="relative bg-gradient-to-br from-transparent to-[color-mix(in_srgb,var(--text)_3%,transparent)] p-5 md:p-8">
              <span className="mb-2 inline-flex w-fit items-center gap-2 border-b border-[color-mix(in_srgb,var(--accent)_30%,transparent)] pb-2 font-metallord text-[9px] uppercase tracking-[0.28em]" style={{ color: "var(--text-subtle)" }}>
                Δοκιμή · спецификация
              </span>
              <div className="mt-8 space-y-5 text-sm leading-relaxed md:text-[0.95rem]" style={{ color: "var(--text-muted)" }}>
                {GREEK_TZ.map((line) => (
                  <p key={line} className="border-l border-[color-mix(in_srgb,var(--border)_80%,transparent)] pl-4">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Песчаная буря */}
      <div
        className="relative h-40 w-full overflow-hidden border-t"
        style={{
          borderColor: "var(--border)",
          background: "linear-gradient(180deg, var(--bg) 0%, color-mix(in srgb, var(--bg-secondary) 100%, #1a1510) 100%)",
        }}
      >
        <SandstormCanvas />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--bg)_95%,transparent)] via-transparent to-[color-mix(in_srgb,var(--bg)_40%,transparent)]"
          aria-hidden
        />
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-metallord text-[9px] uppercase tracking-[0.3em] text-[#b8956a] opacity-90 mix-blend-plus-lighter">
          песчаная буря
        </p>
      </div>
    </section>
  );
}

/* ─── 3. ТЕКСТИЛЬНЫЙ КОДЕКС (кипу + календарь) ─── */

const KIPU_OFFERS = [
  { knots: 3, title: "Лендинг", price: "от 180 000 ₽" },
  { knots: 5, title: "Веб-приложение", price: "от 420 000 ₽" },
  { knots: 2, title: "Дизайн-аудит", price: "от 95 000 ₽" },
];

function QuipuColumn({ item }: { item: (typeof KIPU_OFFERS)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className="group flex max-w-[220px] flex-col items-center gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--border)_80%,transparent)] bg-[color-mix(in_srgb,var(--text)_3%,transparent)] px-5 py-6 text-center shadow-[0_16px_48px_-20px_rgba(0,0,0,0.25)] transition-all hover:border-[color-mix(in_srgb,var(--accent)_25%,transparent)]"
    >
      <div className="relative h-56 w-14">
        <div
          className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full shadow-[inset_0_0_6px_rgba(0,0,0,0.5)]"
          style={{
            background: "linear-gradient(180deg, #7a6248 0%, #4a3d32 45%, #2a2218 100%)",
          }}
        />
        {Array.from({ length: item.knots }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[#c9a66c]/70 bg-gradient-to-br from-[#5c4a38] to-[#2a2218] shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform group-hover:scale-110"
            style={{ top: `${20 + i * 32}px` }}
          />
        ))}
      </div>
      <span className="font-metallord text-[9px] uppercase tracking-[0.22em]" style={{ color: "var(--text-subtle)" }}>
        узел · {item.title}
      </span>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden font-metallord text-sm tracking-wide"
        style={{ color: "var(--accent)" }}
      >
        {item.price}
      </motion.div>
    </button>
  );
}

function AztecCalendarRing({ rotation }: { rotation: MotionValue<number> }) {
  return (
    <motion.div
      className="pointer-events-none absolute -right-4 -top-4 h-56 w-56 md:-right-8 md:-top-8 md:h-72 md:w-72"
      style={{ rotate: rotation }}
      aria-hidden
    >
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_0_40px_rgba(201,166,108,0.15)]">
        <defs>
          <linearGradient id="calRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(200,200,200,0.35)" />
            <stop offset="100%" stopColor="rgba(180,160,120,0.25)" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="none" stroke="url(#calRing)" strokeWidth="0.6" opacity="0.5" />
        {Array.from({ length: 20 }).map((_, i) => {
          const a = (i / 20) * Math.PI * 2;
          return (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 46 * Math.cos(a)}
              y2={50 + 46 * Math.sin(a)}
              stroke="currentColor"
              strokeWidth="0.35"
              className="text-[color-mix(in_srgb,var(--text-muted)_70%,transparent)]"
            />
          );
        })}
        <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.25" className="text-[color-mix(in_srgb,var(--text)_20%,transparent)]" />
        <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-[color-mix(in_srgb,var(--text-subtle)_80%,transparent)]" />
      </svg>
    </motion.div>
  );
}

function TextileCodexSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 180]), { stiffness: 26, damping: 18 });
  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t px-4 py-20 md:px-8 md:py-28"
      style={{
        borderColor: "var(--border)",
        background: `
          radial-gradient(ellipse 70% 50% at 20% 30%, color-mix(in srgb, var(--text) 5%, transparent), transparent 55%),
          linear-gradient(165deg, var(--bg-secondary) 0%, var(--bg) 55%, color-mix(in srgb, var(--bg) 85%, #1a1510) 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23p)' opacity='0.4'/%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px",
        }}
      />
      <AztecCalendarRing rotation={rotate} />

      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="font-metallord text-[10px] uppercase tracking-[0.4em]" style={{ color: "var(--text-muted)" }}>
          Текстильный кодекс
        </p>
        <h2 className="mt-4 font-heading text-xl tracking-tight md:text-3xl" style={{ color: "var(--text)" }}>
          Узлы кипу · цены
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
          Зашифрованные узелки на шнурах. Нажмите карточку — распускается строка с ориентиром по бюджету. Скролл вращает
          «календарь».
        </p>

        <div className="mt-14 flex flex-wrap items-start justify-center gap-8 md:gap-12">
          {KIPU_OFFERS.map((item) => (
            <QuipuColumn key={item.title} item={item} />
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <Link
            href="/brief?source=ux-ui-design-ancient"
            className="group relative px-12 py-5 font-metallord text-xs uppercase tracking-[0.28em] transition-all hover:scale-[1.03] active:scale-[0.99]"
            style={{
              background: "linear-gradient(155deg, #2e2c32 0%, #121014 35%, #1c1a22 70%, #0a090c 100%)",
              color: "#e0d8d0",
              boxShadow:
                "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 8px rgba(0,0,0,0.4)",
              clipPath: "polygon(7% 0, 93% 0, 100% 50%, 93% 100%, 7% 100%, 0 50%)",
            }}
            aria-label="Заказать — жертвенный нож обсидиана"
          >
            <span className="relative z-10 flex items-center gap-4">
              <svg viewBox="0 0 24 36" className="h-9 w-7 transition-transform group-hover:-translate-y-0.5" aria-hidden>
                <defs>
                  <linearGradient id="blade" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5a5a68" />
                    <stop offset="50%" stopColor="#2a2830" />
                    <stop offset="100%" stopColor="#1a1820" />
                  </linearGradient>
                </defs>
                <path fill="url(#blade)" d="M12 0 L15 6 L22 30 L12 36 L2 30 L9 6 Z" />
                <path fill="rgba(255,255,255,0.06)" d="M12 2 L14 6 L11 8 Z" />
              </svg>
              Заказать
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── PAGE ─── */

export function AncientMysticContent() {
  return (
    <article className="font-metallord selection:bg-[#c9a66c]/30" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg) 88%, transparent)",
          borderColor: "var(--border)",
          boxShadow: "0 1px 0 color-mix(in srgb, var(--text) 6%, transparent)",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3.5 md:px-8">
          <Link
            href="/services/ux-ui-design"
            className="inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-1 font-metallord text-[9px] uppercase tracking-[0.22em] transition-colors hover:border-[var(--border)] hover:text-[var(--accent)] md:text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={14} /> Классическая версия UX/UI
          </Link>
          <span className="hidden h-4 w-px sm:block" style={{ backgroundColor: "var(--border)" }} aria-hidden />
          <span className="inline-flex items-center gap-2 font-metallord text-[9px] uppercase tracking-[0.25em] md:text-[10px]" style={{ color: "var(--text-subtle)" }}>
            <Sparkles className="h-3 w-3 text-[#c9a66c]/80" strokeWidth={1.5} />
            Древность &amp; мистика
          </span>
          <Link
            href="/services/ux-ui-design/artistic"
            className="font-metallord text-[9px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--accent)] md:text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            Худож. стили
          </Link>
        </div>
      </div>

      <PaleocontactSection />
      <RosettaSection />
      <TextileCodexSection />
    </article>
  );
}
