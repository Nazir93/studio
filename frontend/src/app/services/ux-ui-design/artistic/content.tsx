"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Palette } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

/* ─── sound ─── */

function playPurr() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const t = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, t);
    master.gain.linearRampToValueAtTime(0.18, t + 0.02);
    master.gain.exponentialRampToValueAtTime(0.01, t + 0.32);
    master.connect(ctx.destination);
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = i === 0 ? "sawtooth" : "triangle";
      o.frequency.setValueAtTime(52 + i * 16, t);
      o.frequency.exponentialRampToValueAtTime(40 + i * 10, t + 0.26);
      g.gain.setValueAtTime(0.1 - i * 0.025, t);
      o.connect(g);
      g.connect(master);
      o.start(t);
      o.stop(t + 0.34);
    }
  } catch {
    /* ignore */
  }
}

const DADA_WORDS = ["Глок!", "Брысь!", "Ква!", "Плюх!", "Зум!", "Тьфу!", "Ой-ёй!", "Бац!"];

const CUBISM_NAV = [
  { href: "/services", label: "Услуги" },
  { href: "/portfolio", label: "Кейсы" },
  { href: "/contacts", label: "Контакты" },
  { href: "/price", label: "Цены" },
];

/* ─── triangle cursor (SVG) ─── */

/** Без setState на каждом mousemove — только transform через rAF (не блокирует UI-поток) */
function TriangleCursor({ active }: { active: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let mx = -100;
    let my = -100;
    const tick = () => {
      raf = 0;
      const el = ref.current;
      if (el) el.style.transform = `translate3d(${mx - 10}px, ${my - 10}px, 0)`;
    };
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [active]);
  if (!active) return null;
  return (
    <svg
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[300] h-5 w-5 text-[#c45c4a] will-change-transform"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))", transform: "translate3d(-9999px,0,0)" }}
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path fill="currentColor" d="M12 2 L22 20 H2 Z" opacity="0.95" />
      <path fill="#f4e8dc" d="M12 6 L17 17 H7 Z" opacity="0.35" />
    </svg>
  );
}

/* ─── parallax stack: каждый слой наезжает на предыдущий ─── */

/** Чем больше — тем сильнее следующий «лист» заходит на предыдущий */
const STACK_OVERLAP = "clamp(4rem, 16vh, 10rem)";

/** Только наслоение + z-index — без useScroll/useTransform на каждый блок (было 5 тяжёлых подписок на скролл) */
function ParallaxStackLayer({ stackIndex, children }: { stackIndex: number; children: React.ReactNode }) {
  return (
    <div
      className={
        stackIndex > 0
          ? "relative isolate overflow-hidden rounded-t-[1.5rem] md:rounded-t-[2rem]"
          : "relative isolate"
      }
      style={{
        marginTop: stackIndex === 0 ? undefined : `calc(-1 * ${STACK_OVERLAP})`,
        zIndex: 10 + stackIndex,
        boxShadow:
          stackIndex > 0
            ? "0 -32px 72px rgba(0,0,0,0.42), 0 -3px 0 rgba(255,255,255,0.07)"
            : undefined,
      }}
    >
      {children}
    </div>
  );
}

/* ─── hero ─── */

function ArtisticHero() {
  return (
    <section
      className="relative overflow-hidden px-4 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 20% 20%, rgba(196, 92, 74, 0.12), transparent 50%),
          radial-gradient(ellipse 60% 50% at 80% 80%, rgba(74, 111, 165, 0.1), transparent 45%),
          linear-gradient(165deg, #0c0b0a 0%, #141210 40%, #0a0908 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-matrix text-[10px] uppercase tracking-[0.5em] text-[#c9a66c]/80"
        >
          Альтернативная витрина · UX/UI
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="mt-5 max-w-[26ch] font-heading text-[clamp(1.2rem,3vw,1.75rem)] font-normal leading-[1.08] tracking-tight text-[#f2ebe3]"
        >
          Художественные стили
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="mt-8 max-w-xl font-body text-base leading-relaxed text-[#a89b8c] md:text-lg"
        >
          Четыре экспериментальных интерфейсных мира: от куба Пикассо до пуантилизма. Листайте как по залам музея — ссылки и кнопки
          остаются рабочими.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-12 flex flex-wrap gap-3"
        >
          {["Кубизм", "Дада", "Оп-арт", "Точки"].map((label, i) => (
            <span
              key={label}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 font-matrix text-[9px] uppercase tracking-[0.25em] text-[#8a7d70]"
            >
              {String(i + 1).padStart(2, "0")} · {label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 01 cubism ─── */

function CubismSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [tri, setTri] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotY = useTransform(scrollYProgress, [0, 1], [8, -36]);
  const rotX = useTransform(scrollYProgress, [0, 1], [-6, 14]);

  const faces = [
    { t: "rotateY(0deg) translateZ(150px)", bg: "linear-gradient(145deg, #4a3428 0%, #2d2118 55%, #3d2e26 100%)", edge: "rgba(232,210,180,0.35)" },
    { t: "rotateY(180deg) translateZ(150px)", bg: "linear-gradient(145deg, #352820 0%, #1f1814 60%, #2a221c 100%)", edge: "rgba(180,160,130,0.25)" },
    { t: "rotateY(90deg) translateZ(150px)", bg: "linear-gradient(160deg, #3d4a6b 0%, #252d42 50%, #2a3348 100%)", edge: "rgba(180,195,230,0.28)" },
    { t: "rotateY(-90deg) translateZ(150px)", bg: "linear-gradient(145deg, #5c4030 0%, #3a2820 55%, #4a362c 100%)", edge: "rgba(230,200,170,0.3)" },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-[130vh] scroll-mt-0 py-20 md:py-28"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background: "linear-gradient(180deg, #0e0c0a 0%, #12100e 35%, #0a0908 100%)",
      }}
      onMouseEnter={() => setTri(true)}
      onMouseLeave={() => setTri(false)}
    >
      <TriangleCursor active={tri} />
      <div className={tri ? "cursor-none" : ""} style={{ cursor: tri ? "none" : undefined }}>
        <div className="mx-auto max-w-6xl px-4 md:px-8 text-[#e8dfd6]">
          <header className="mb-10">
            <p className="font-matrix text-[10px] uppercase tracking-[0.45em] text-white/45">01 — Кубизм + UI</p>
            <div className="mt-3 flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
              <h2 className="max-w-xl font-heading text-[clamp(1.1rem,2.4vw,1.55rem)] font-normal leading-[1.12] tracking-tight text-[#faf6f0]">
                Все ракурсы меню сразу
              </h2>
              <nav className="flex flex-wrap gap-x-4 gap-y-2 lg:shrink-0 lg:justify-end" aria-label="Навигация по сайту">
                {CUBISM_NAV.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="font-matrix text-[9px] uppercase tracking-[0.2em] text-[#c9a66c]/90 transition-colors hover:text-[#f5ebe0]"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <p className="mb-14 max-w-2xl font-body text-[15px] leading-relaxed text-[#9a8b7c] md:text-base">
            Геометрия грифа и граней: кнопки-осколки, куб на скролле, портфолио как коллаж из плоскостей.
          </p>

          <div className="flex min-h-[360px] items-center justify-center [perspective:1400px] md:min-h-[440px]">
            <motion.div
              className="relative h-[300px] w-[300px] [transform-style:preserve-3d]"
              style={{ rotateX: rotX, rotateY: rotY }}
            >
              {faces.map((face, i) => (
                <div
                  key={i}
                  className="absolute left-0 top-0 flex h-[300px] w-[300px] items-center justify-center shadow-[inset_0_0_60px_rgba(0,0,0,0.45)]"
                  style={{
                    transform: face.t,
                    backfaceVisibility: "hidden",
                    background: face.bg,
                    border: `1px solid ${face.edge}`,
                    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5)`,
                  }}
                >
                  <ul className="grid w-full grid-cols-2 gap-2 px-5 py-6">
                    {CUBISM_NAV.map((l) => (
                      <li key={l.href + i} className="flex justify-center">
                        <Link
                          href={l.href}
                          className="group relative font-matrix text-[9px] uppercase tracking-[0.2em] text-[#f0e6dc]/90 transition-colors hover:text-[#ffd88a]"
                          style={{
                            clipPath: "polygon(6% 0, 94% 8%, 100% 92%, 4% 100%)",
                            padding: "0.65rem 0.9rem",
                            background: "linear-gradient(135deg, rgba(255,255,255,0.06), transparent 60%)",
                          }}
                        >
                          <span className="relative z-10">{l.label}</span>
                          <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: "linear-gradient(90deg, transparent, rgba(255,200,120,0.12), transparent)" }} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-3 md:gap-4">
            {[
              { label: "Обсудить", href: "/brief?source=ux-ui-design-artistic" },
              { label: "Бриф", href: "/brief?source=ux-ui-design-artistic" },
              { label: "Кейсы", href: "/portfolio" },
              { label: "Цены", href: "/price" },
            ].map((item, i) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex min-w-[7rem] items-center justify-center border border-[#c9a66c]/25 bg-[#1a1512]/90 px-5 py-3.5 font-matrix text-[10px] uppercase tracking-[0.22em] text-[#e8dcc8] transition hover:border-[#c9a66c]/55 hover:bg-[#221c18]"
                style={{
                  clipPath: `polygon(${8 + i * 2}% 0, ${90 - i}% 4%, 100% ${72 + i}%, 6% 100%)`,
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 02 dada ─── */

function DadaismSection() {
  const [word, setWord] = useState<string | null>(null);
  const tilt = useMemo(() => ({ h1: -3 + Math.random() * 6, h2: 4 - Math.random() * 8, scrap: 1.5 - Math.random() * 3 }), []);

  const flash = () => {
    playPurr();
    setWord(DADA_WORDS[Math.floor(Math.random() * DADA_WORDS.length)]);
    window.setTimeout(() => setWord(null), 1500);
  };

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background: "linear-gradient(165deg, #f7f4ef 0%, #ebe4d8 45%, #e2d9cc 100%)",
      }}
    >
      {word && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="pointer-events-none fixed left-1/2 top-24 z-[400] -translate-x-1/2 px-8 py-4 font-blackops text-2xl tracking-wide text-[#1a1a1a] shadow-[6px_6px_0_#1a1a1a]"
          style={{ background: "#ffeb3b", border: "3px solid #1a1a1a" }}
        >
          {word}
        </motion.div>
      )}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 3px, #000 3px, #000 4px)`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-10 flex flex-col border-b border-black/80 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-matrix text-[10px] uppercase tracking-[0.45em] text-neutral-600">02 — Дадаизм</p>
            <h2 className="mt-2 font-heading text-[clamp(1.15rem,2.5vw,1.65rem)] leading-[1.08] tracking-tight text-neutral-900" style={{ transform: `rotate(${tilt.h1}deg)` }}>
              Хаос с работающими ссылками
            </h2>
          </div>
          <p
            className="mt-4 max-w-xs font-matrix text-[10px] uppercase leading-relaxed tracking-[0.25em] text-neutral-600 md:mt-0 md:text-right"
            style={{ transform: `rotate(${tilt.h2}deg)` }}
          >
            Парадокс эпохи
          </p>
        </div>

        <div className="mt-4 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="relative">
            <div className="absolute -left-2 -top-2 h-16 w-16 border-l-4 border-t-4 border-black" aria-hidden />
            <div className="relative overflow-hidden border-4 border-black bg-black shadow-[12px_12px_0_0_rgba(0,0,0,0.85)]">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/402px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg"
                  alt="Портрет с усами"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 400px"
                />
                <svg className="absolute bottom-[36%] left-1/2 w-[48%] -translate-x-1/2 drop-shadow-sm" viewBox="0 0 120 36" aria-hidden>
                  <path d="M8 28 Q38 6 60 18 Q82 6 112 28" fill="none" stroke="#0a0a0a" strokeWidth="5" strokeLinecap="round" />
                  <path d="M22 30 L98 30" stroke="#0a0a0a" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex items-center justify-between border-t-4 border-black bg-[#ffeb3b] px-3 py-2">
                <span className="font-matrix text-[8px] uppercase tracking-[0.2em] text-black">DADA №7</span>
                <span className="font-matrix text-[8px] uppercase tracking-[0.15em] text-black/70">уси не входят в смету</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div
              className="border-2 border-dashed border-neutral-900 bg-white/90 p-7 shadow-[4px_4px_0_0_rgba(0,0,0,0.12)]"
              style={{ transform: `rotate(${tilt.scrap}deg)` }}
            >
              <p className="font-body text-sm leading-relaxed text-neutral-800 md:text-[15px]">
                Готовое изделие как сайт: подпись на пьедестале — ниже. Маршруты настоящие, шум — декоративный.
              </p>
            </div>

            <div className="flex flex-wrap items-end gap-10">
              <div className="relative shrink-0">
                <svg width="112" height="148" viewBox="0 0 112 148" className="text-neutral-300">
                  <ellipse cx="56" cy="132" rx="40" ry="10" fill="currentColor" opacity="0.4" />
                  <path d="M42 16 L70 16 L76 124 L36 124 Z" fill="#fafafa" stroke="#0a0a0a" strokeWidth="2.5" />
                  <ellipse cx="56" cy="14" rx="20" ry="7" fill="#fff" stroke="#0a0a0a" strokeWidth="2.5" />
                </svg>
                <span className="absolute bottom-11 left-1/2 -translate-x-1/2 rotate-[-6deg] font-heading text-lg tracking-tight text-neutral-900">Сайт</span>
              </div>
              <nav className="flex min-w-0 flex-1 flex-col gap-2.5">
                {[
                  { href: "/services", t: "Услуги" },
                  { href: "/portfolio", t: "Портфолио" },
                  { href: "/contacts", t: "Контакты" },
                  { href: "/blog", t: "Блог" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={flash}
                    className="group inline-flex w-fit items-center gap-2 border-b-2 border-black pb-0.5 font-body text-sm font-medium text-neutral-900 transition hover:bg-[#ffeb3b]"
                  >
                    {l.t}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" strokeWidth={2} />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={flash} className="border-2 border-black bg-white px-5 py-2.5 font-matrix text-[10px] uppercase tracking-[0.2em] shadow-[4px_4px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                Кнопка I
              </button>
              <button type="button" onClick={flash} className="border-2 border-black bg-[#c8ff00] px-5 py-2.5 font-matrix text-[10px] uppercase tracking-[0.2em] shadow-[4px_4px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
                Кнопка II
              </button>
              <Link href="/price" onClick={flash} className="inline-flex items-center border-2 border-black bg-[#ff6b9d] px-5 py-2.5 font-matrix text-[10px] uppercase tracking-[0.2em] text-black shadow-[4px_4px_0_0_#000]">
                Цены
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 03 op-art ─── */

const OPART_COPY =
  "Брендинг, айдентика, гайдлайн и UI-кит: запоминающийся образ и единая система на всех точках контакта.";

const PEEK_RADIUS = 118;

/** Полная ширина: слой «точки» как следующий раздел; круг по курсору открывает текст снизу */
function OpArtNextSectionPeek() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 200, y: 140 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const placeCenter = () => {
      const r = el.getBoundingClientRect();
      setSpot({ x: r.width / 2, y: r.height / 2 });
    };
    placeCenter();
    const ro = new ResizeObserver(placeCenter);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    let pending = { x: spot.x, y: spot.y };
    const flush = () => {
      raf = 0;
      setSpot(pending);
    };
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      pending = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!raf) raf = requestAnimationFrame(flush);
    };
    el.addEventListener("mousemove", move, { passive: true });
    return () => {
      el.removeEventListener("mousemove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const holeMask = `radial-gradient(circle ${PEEK_RADIUS}px at ${spot.x}px ${spot.y}px, rgba(0,0,0,0) 0, rgba(0,0,0,0) ${PEEK_RADIUS - 0.5}px, rgba(255,255,255,1) ${PEEK_RADIUS}px, rgba(255,255,255,1) 100%)`;

  return (
    <div
      ref={wrapRef}
      className="relative min-h-[min(42vh,320px)] w-full cursor-none overflow-hidden md:min-h-[340px]"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="absolute inset-0 z-0 bg-[#1a1814] px-6 pb-10 pt-10 md:px-10 md:pt-12">
        <p className="font-matrix text-[10px] uppercase tracking-[0.35em] text-[#c9a66c]/85">04 — следующий раздел</p>
        <h3 className="mt-2 font-heading text-lg tracking-tight text-[#f5f0e8] md:text-xl">Пуантилизм</h3>
        <p className="mt-4 max-w-2xl font-body text-[14px] leading-relaxed text-[#d4ccc0] md:text-[15px]">
          Точки на canvas, движение мыши и скролл. Текст под слоем точек — наведите и водите курсор: круг снимает маску и показывает абзац целиком.
        </p>
        <p className="mt-6 max-w-xl font-body text-[14px] leading-relaxed text-[#e8e0d6] md:text-[15px]">
          Интерфейс как картина: цельное впечатление вместо набора экранов. Ниже на странице — живой canvas; здесь только превью настроения раздела.
        </p>
      </div>

      <div
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: "#dcd4cc",
          backgroundImage: `
            radial-gradient(circle at 2px 2px, rgba(140, 90, 110, 0.45) 1.5px, transparent 0),
            radial-gradient(circle at 9px 5px, rgba(90, 120, 160, 0.35) 1px, transparent 0),
            radial-gradient(circle at 5px 11px, rgba(160, 130, 80, 0.38) 1px, transparent 0)`,
          backgroundSize: "14px 14px, 14px 14px, 14px 14px",
          backgroundPosition: "0 0, 7px 7px, 3px 3px",
          maskImage: holeMask,
          WebkitMaskImage: holeMask,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute z-[2] rounded-full border-2 border-white/55 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
        style={{
          width: PEEK_RADIUS * 2,
          height: PEEK_RADIUS * 2,
          left: spot.x - PEEK_RADIUS,
          top: spot.y - PEEK_RADIUS,
        }}
        aria-hidden
      />
      <p className="pointer-events-none absolute bottom-4 left-1/2 z-[3] -translate-x-1/2 text-center font-matrix text-[8px] uppercase tracking-[0.28em] text-white/45 md:text-[9px]">
        круг следует за курсором · текст под точками
      </p>
    </div>
  );
}

function OpArtSection() {
  const lensBoxRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState({ x: 200, y: 180 });
  const [boxSize, setBoxSize] = useState({ w: 400, h: 400 });

  useEffect(() => {
    const el = lensBoxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setBoxSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = lensBoxRef.current;
    if (!el) return;
    let raf = 0;
    let pending = { x: 200, y: 180 };
    const flush = () => {
      raf = 0;
      setLens(pending);
    };
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      pending = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!raf) raf = requestAnimationFrame(flush);
    };
    el.addEventListener("mousemove", move, { passive: true });
    return () => {
      el.removeEventListener("mousemove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const R = 108;
  const pad = 36;

  return (
    <section className="relative py-20 md:py-28" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-12">
          <p className="font-matrix text-[10px] uppercase tracking-[0.45em] text-white/40">03 — Оп-арт</p>
          <h2 className="mt-2 font-heading text-[clamp(1.15rem,2.5vw,1.65rem)] leading-[1.1] tracking-tight text-white">Васарели · вибрация и фокус</h2>
          <p className="mt-4 max-w-2xl font-body text-[15px] leading-relaxed text-white/55">
            Сверху — превью следующего раздела: точки скрывают текст, круг по курсору его открывает. Ниже — лупа на отдельном тексте о брендинге.
          </p>
        </div>
      </div>

      <div className="w-full border-b border-white/10 bg-white/[0.06]">
        <OpArtNextSectionPeek />
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-8 md:px-8 md:pt-10">
        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/10">
          <div className="border-b border-white/10 px-5 py-4 md:px-8 md:py-5">
            <p className="font-matrix text-[9px] uppercase tracking-[0.35em] text-white/40">Лупа · фокус</p>
            <p className="mt-2 max-w-2xl font-body text-[14px] leading-relaxed text-white/65 md:text-[15px]">
              Абзац ниже размыт по всему полю — как будто страница «дрожит». В круге лупы текст читается чётко: водите курсор по серой области, чтобы пройтись по смыслу строка за строкой.
            </p>
          </div>
          <div ref={lensBoxRef} className="relative min-h-[300px] w-full cursor-none bg-[#141414] md:min-h-[400px]">
            <p
              className="pointer-events-none absolute inset-0 select-none p-9 text-left font-body text-[17px] leading-[1.65] text-white md:p-10 md:text-lg"
              style={{ filter: "blur(9px)", opacity: 0.14 }}
            >
              {OPART_COPY}
            </p>
            <div
              className="pointer-events-none absolute overflow-hidden rounded-full border-[6px] border-white/25 bg-[#1a1a1a]/50 shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_24px_48px_rgba(0,0,0,0.55),inset_0_0_40px_rgba(255,255,255,0.06)]"
              style={{ width: R * 2, height: R * 2, left: lens.x - R, top: lens.y - R }}
            >
              <p
                className="absolute box-border text-left font-body text-[17px] leading-[1.65] text-white/95 md:text-lg"
                style={{
                  left: pad - lens.x + R,
                  top: pad - lens.y + R,
                  width: boxSize.w - pad * 2,
                }}
              >
                {OPART_COPY}
              </p>
            </div>
            <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 max-w-[90%] -translate-x-1/2 text-center font-matrix text-[8px] uppercase leading-snug tracking-[0.28em] text-white/30 md:bottom-6 md:text-[9px] md:tracking-[0.32em]">
              лупа следует за курсором · ведите по полю
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 04 pointillism ─── */

function PointillismSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<{ x: number; y: number; tx: number; ty: number; h: number; s: number; l: number; vx: number; vy: number }[]>([]);
  const scrollRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [textReady, setTextReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setTextReady(true), 1000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    let visible = false;
    let raf = 0;
    let running = false;
    const dprRef = { v: Math.min(window.devicePixelRatio || 1, 2) };
    let mx = 0;
    let my = 0;

    const resize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      const w = p.clientWidth;
      const h = Math.min(420, Math.max(280, window.innerHeight * 0.38));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.v = dpr;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const dots: typeof particles.current = [];
      const cols = 44;
      const rows = Math.max(1, Math.floor((h / w) * cols));
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i / cols) * w + (Math.random() - 0.5) * 3;
          const y = (j / rows) * h + (Math.random() - 0.5) * 3;
          const hue = (i * 5 + j * 4 + 40) % 360;
          dots.push({
            x,
            y,
            tx: x,
            ty: y,
            h: hue,
            s: 48 + Math.random() * 28,
            l: 42 + Math.random() * 22,
            vx: 0,
            vy: 0,
          });
        }
      }
      particles.current = dots;
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const loop = () => {
      if (!visible || document.visibilityState !== "visible") {
        running = false;
        raf = 0;
        return;
      }
      mouseRef.current.x = mx;
      mouseRef.current.y = my;

      const dpr = dprRef.v;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.fillStyle = "#f4f0e8";
      ctx.fillRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.42;
      const sr = scrollRef.current;

      const pts = particles.current;
      for (let k = 0; k < pts.length; k++) {
        const p = pts[k];
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.sqrt(dx * dx + dy * dy) + 1;
        p.tx = p.x + (dx / d) * 26 + (cx - p.x) * 0.01;
        p.ty = p.y + (dy / d) * 26 + (cy - p.y) * 0.01;
        p.vx += (p.tx - p.x) * 0.038 + (Math.random() - 0.5) * sr * 0.12;
        p.vy += (p.ty - p.y) * 0.038 + (Math.random() - 0.5) * sr * 0.12;
        p.vx *= 0.93;
        p.vy *= 0.93;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -0.5;
        if (p.y < 0 || p.y > h) p.vy *= -0.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.45, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.h},${p.s}%,${p.l}%,0.88)`;
        ctx.fill();
      }

      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = !!(e?.isIntersecting);
        if (visible && !running && document.visibilityState === "visible") {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!visible) {
          running = false;
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { root: null, rootMargin: "120px", threshold: 0 }
    );
    io.observe(canvas);

    const onScroll = () => {
      scrollRef.current = window.scrollY * 0.018;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onMove = (e: MouseEvent) => {
      if (!visible) return;
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    canvas.addEventListener("mousemove", onMove, { passive: true });

    const onVis = () => {
      if (document.visibilityState === "hidden") {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (visible && !running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <section className="py-20 md:pb-32 md:pt-28" style={{ backgroundColor: "#f0ebe3" }}>
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="mb-10">
          <p className="font-matrix text-[10px] uppercase tracking-[0.45em] text-neutral-500">04 — Пуантилизм</p>
          <h2 className="mt-2 font-heading text-[clamp(1.15rem,2.5vw,1.65rem)] leading-[1.08] tracking-tight text-neutral-900">Свет из точек</h2>
          <p className="mt-4 max-w-2xl font-body text-[15px] leading-relaxed text-neutral-600">
            Точки дышат с мышью и дымят от скролла. Ниже — текст, который «собирается» через секунду.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-neutral-200/80 bg-[#f7f4ee] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div className="flex items-center justify-between border-b border-neutral-200/80 bg-white/50 px-4 py-2.5">
            <span className="font-matrix text-[9px] uppercase tracking-[0.3em] text-neutral-400">canvas · study</span>
            <span className="font-matrix text-[9px] uppercase tracking-[0.2em] text-neutral-400">CODE1618</span>
          </div>
          <canvas ref={canvasRef} className="block h-auto w-full touch-none" />
        </div>

        <motion.div
          initial={false}
          animate={{ opacity: textReady ? 1 : 0, y: textReady ? 0 : 12 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-14 max-w-2xl border-l-2 border-neutral-900/15 pl-6 md:pl-8"
        >
          <p className="font-body text-[17px] leading-relaxed text-neutral-800 md:text-lg">
            Пока точки собирались в буквы, прошла секунда. Интерфейс как картина: цельное впечатление, а не набор экранов.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── page ─── */

export function ArtisticMadnessContent() {
  const { isDark } = useTheme();

  return (
    <article className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div
        className="sticky top-0 z-[60] border-b backdrop-blur-md"
        style={{
          backgroundColor: isDark ? "rgba(10,10,10,0.9)" : "rgba(255,255,255,0.9)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 md:px-8">
          <Link
            href="/services/ux-ui-design"
            className="inline-flex items-center gap-2 rounded-full px-2 py-1 font-matrix text-[9px] uppercase tracking-[0.22em] transition-colors hover:text-[var(--accent)] md:text-[10px]"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft size={14} strokeWidth={1.5} /> UX/UI
          </Link>
          <span className="hidden h-4 w-px sm:block" style={{ backgroundColor: "var(--border)" }} aria-hidden />
          <Link href="/services/ux-ui-design/ancient" className="font-matrix text-[9px] uppercase tracking-[0.2em] md:text-[10px]" style={{ color: "var(--text-subtle)" }}>
            Древность
          </Link>
          <span className="hidden h-4 w-px sm:block" style={{ backgroundColor: "var(--border)" }} aria-hidden />
          <span
            className="inline-flex items-center gap-1.5 font-matrix text-[8px] uppercase tracking-[0.2em] sm:gap-2 sm:text-[9px] sm:tracking-[0.22em] md:text-[10px]"
            style={{ color: "var(--text-subtle)" }}
          >
            <Palette className="h-3 w-3 shrink-0 opacity-60 sm:h-3.5 sm:w-3.5" strokeWidth={1.5} />
            Художественные стили
          </span>
          <Link
            href="/brief?source=ux-ui-design-artistic"
            className="ml-auto rounded-full border px-4 py-2 font-matrix text-[9px] uppercase tracking-[0.2em] transition hover:border-[var(--text)] md:text-[10px]"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            Обсудить проект
          </Link>
        </div>
      </div>

      <ParallaxStackLayer stackIndex={0}>
        <ArtisticHero />
      </ParallaxStackLayer>
      <ParallaxStackLayer stackIndex={1}>
        <CubismSection />
      </ParallaxStackLayer>
      <ParallaxStackLayer stackIndex={2}>
        <DadaismSection />
      </ParallaxStackLayer>
      <ParallaxStackLayer stackIndex={3}>
        <OpArtSection />
      </ParallaxStackLayer>
      <ParallaxStackLayer stackIndex={4}>
        <PointillismSection />
      </ParallaxStackLayer>
    </article>
  );
}
