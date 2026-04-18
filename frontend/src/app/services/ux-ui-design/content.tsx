"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronUp, Figma, Layers, Palette, MousePointer2, Smartphone, Monitor } from "lucide-react";
import { EMAIL } from "@/lib/constants";
import { UX_SHOWCASE_CASES, UX_EXPERTISE_BLOCKS } from "@/lib/ux-ui-design-data";
import { FONT_UI_AKONY_CTA } from "@/lib/ui-typography";

/* ─── FIGMA CANVAS — SVG elements being "drawn" ─── */

function FigmaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const elementsRef = useRef<{ x: number; y: number; w: number; h: number; type: string; progress: number; speed: number; delay: number; opacity: number }[]>([]);
  const initRef = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    parent.addEventListener("mousemove", handleMouseMove);

    const dpr = window.devicePixelRatio || 1;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!initRef.current) initElements();
    };

    const initElements = () => {
      initRef.current = true;
      const gridSize = 60;
      const cols = Math.floor(W / gridSize);
      const rows = Math.floor(H / gridSize);
      const els: typeof elementsRef.current = [];
      const types = ["rect", "circle", "line", "button", "input", "card"];

      for (let i = 0; i < 18; i++) {
        const col = Math.floor(Math.random() * cols);
        const row = Math.floor(Math.random() * rows);
        const type = types[Math.floor(Math.random() * types.length)];
        const w = (1 + Math.floor(Math.random() * 3)) * gridSize;
        const h = type === "line" ? 2 : (1 + Math.floor(Math.random() * 2)) * gridSize;

        els.push({
          x: col * gridSize + gridSize / 2,
          y: row * gridSize + gridSize / 2,
          w, h, type,
          progress: 0,
          speed: 0.003 + Math.random() * 0.005,
          delay: i * 300 + Math.random() * 500,
          opacity: 0,
        });
      }
      elementsRef.current = els;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const startTime = performance.now();
    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const elapsed = performance.now() - startTime;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const isDark = () => {
        const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
        return bg === "#0A0A0A" || bg === "#0a0a0a" || bg.includes("10,10,10");
      };
      const dark = isDark();
      const color = dark ? "255,255,255" : "0,0,0";

      // Grid dots
      const gridSize = 60;
      for (let x = gridSize; x < W; x += gridSize) {
        for (let y = gridSize; y < H; y += gridSize) {
          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = dist < 120 ? 1 - dist / 120 : 0;
          ctx.beginPath();
          ctx.arc(x, y, 1 + proximity, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color},${0.05 + proximity * 0.15})`;
          ctx.fill();
        }
      }

      elementsRef.current.forEach((el) => {
        if (elapsed < el.delay) return;
        el.progress = Math.min(el.progress + el.speed, 1);
        const eased = 1 - Math.pow(1 - el.progress, 3);

        const dx = (el.x + el.w / 2) - mx;
        const dy = (el.y + el.h / 2) - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = dist < 150 ? 1 - dist / 150 : 0;
        const alpha = (0.06 + proximity * 0.12) * eased;

        ctx.strokeStyle = `rgba(${color},${alpha})`;
        ctx.lineWidth = 1;

        const drawW = el.w * eased;
        const drawH = el.h * eased;

        switch (el.type) {
          case "rect":
          case "card":
            ctx.strokeRect(el.x, el.y, drawW, drawH);
            if (el.type === "card" && eased > 0.5) {
              ctx.fillStyle = `rgba(${color},${alpha * 0.3})`;
              ctx.fillRect(el.x + 8, el.y + 8, drawW * 0.6, 4);
              ctx.fillRect(el.x + 8, el.y + 18, drawW * 0.4, 3);
            }
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(el.x + drawW / 2, el.y + drawW / 2, drawW / 3, 0, Math.PI * 2 * eased);
            ctx.stroke();
            break;
          case "line":
            ctx.beginPath();
            ctx.moveTo(el.x, el.y);
            ctx.lineTo(el.x + drawW, el.y);
            ctx.stroke();
            break;
          case "button":
            const bh = 28;
            ctx.strokeRect(el.x, el.y, drawW * 0.5, bh);
            if (eased > 0.7) {
              ctx.fillStyle = `rgba(${color},${alpha * 0.5})`;
              ctx.fillRect(el.x + 8, el.y + bh / 2 - 2, drawW * 0.25, 3);
            }
            break;
          case "input":
            const ih = 24;
            ctx.strokeRect(el.x, el.y, drawW * 0.6, ih);
            if (eased > 0.6) {
              ctx.fillStyle = `rgba(${color},${alpha * 0.3})`;
              ctx.fillRect(el.x + 6, el.y + ih / 2 - 1, drawW * 0.35, 2);
            }
            break;
        }
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener("mousemove", handleMouseMove);
      ro.disconnect();
    };
  }, [handleMouseMove]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[2] h-full w-full" />;
}

/* ─── HELPERS ─── */

const RELATED_LINKS = [
  { href: "/services", label: "Услуги" },
  { href: "/services/preproject-research", label: "Предпроект" },
  { href: "/services/personal-cabinet", label: "Личные кабинеты" },
  { href: "/services/outstaff", label: "Аутстаф" },
  { href: "/services/development", label: "Разработка" },
  { href: "/services/testing", label: "Тестирование" },
  { href: "/portfolio", label: "Кейсы" },
  { href: "/contacts", label: "Контакты" },
];

const TOOLS = ["Figma", "Adobe CC", "Principle", "After Effects", "Lottie", "Blender", "Spline"];

const PROCESS_STEPS = [
  { num: "01", title: "Исследование", desc: "Интервью с пользователями, анализ конкурентов, customer journey map, Jobs to be Done. Находим точки роста.", icon: MousePointer2 },
  { num: "02", title: "Wireframes", desc: "Структура и логика интерфейса. Проверяем сценарии на прототипах, итерируем до идеала.", icon: Layers },
  { num: "03", title: "UI-дизайн", desc: "Визуальный язык: типографика, цвета, компоненты, иконки. Pixel-perfect макеты в Figma.", icon: Palette },
  { num: "04", title: "Прототип", desc: "Кликабельный прототип для тестирования с пользователями. Анимации и переходы как в продукте.", icon: Smartphone },
  { num: "05", title: "Дизайн-система", desc: "UI-кит и библиотека компонентов для разработки. Токены, правила, документация.", icon: Monitor },
  { num: "06", title: "Handoff", desc: "Передача разработчикам: спецификации, ассеты, адаптивные сетки. Figma → код без потерь.", icon: Figma },
];

function AnimatedBlock({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `all 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); o.disconnect(); } }, { threshold: 0.12 });
    o.observe(el);
    return () => o.disconnect();
  }, []);
  return { ref, v };
}

/* ─── SECTIONS ─── */

export function UxUiDesignContent() {
  return (
    <article className="overflow-x-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      {/* Quick nav */}
      <div
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ backgroundColor: "color-mix(in srgb, var(--bg) 88%, transparent)", borderColor: "var(--border)" }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-1 gap-y-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden">
          {RELATED_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className="shrink-0 px-3 py-1 font-matrix text-[9px] uppercase tracking-[0.18em] transition-colors hover:text-[var(--accent)] md:text-[10px]"
              style={{ color: "var(--text-muted)" }}>
              {l.label}
            </Link>
          ))}
          <Link
            href="/services/ux-ui-design/ancient"
            className="ml-1 shrink-0 border px-3 py-1 font-matrix text-[9px] uppercase tracking-[0.18em] transition-colors hover:border-[var(--text)] md:text-[10px]"
            style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
          >
            Древность &amp; мистика
          </Link>
          <Link
            href="/services/ux-ui-design/artistic"
            className="ml-1 shrink-0 border px-3 py-1 font-matrix text-[9px] uppercase tracking-[0.18em] transition-colors hover:border-[var(--text)] md:text-[10px]"
            style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
          >
            Художественные стили
          </Link>
        </div>
      </div>

      {/* HERO with Figma Canvas */}
      <section className="relative px-4 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16 lg:px-12">
        <FigmaCanvas />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="ux-grain"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width="100%" height="100%" filter="url(#ux-grain)" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px]">
          <p className="font-matrix text-[10px] uppercase tracking-[0.35em] md:text-[11px]" style={{ color: "var(--text-muted)" }}>
            UX/UI-дизайн
          </p>
          <h1 className="mt-4 max-w-[24ch] min-w-0 font-heading services-page-h1 tracking-tight" style={{ color: "var(--text)" }}>
            Создаём удобные и эстетичные интерфейсы
          </h1>
          <p className="font-body mt-6 max-w-xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-muted)" }}>
            Которые помогают компаниям расти
          </p>
          <p className="font-body mt-4 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: "var(--text-muted)" }}>
            Разрабатываем дизайн сайтов, мобильных приложений и сервисов — от исследований до UI-кита в Figma.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/brief?source=ux-ui-design"
              className={`group inline-flex items-center gap-4 px-8 py-4 sm:px-10 sm:py-4 ${FONT_UI_AKONY_CTA} transition-all duration-300 rounded-full border hover:gap-5`}
              style={{ backgroundColor: "var(--text)", color: "var(--bg)", borderColor: "color-mix(in srgb, var(--bg) 25%, transparent)" }}
            >
              Обсудить проект
              <ArrowRight size={18} strokeWidth={1.5} className="transition-transform group-hover:translate-x-0.5 shrink-0" />
            </Link>
            <Link href="/portfolio"
              className="flex items-center gap-2 border px-8 py-4 font-matrix text-xs uppercase tracking-[0.2em] transition-colors hover:border-[var(--text)]"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}>
              Смотреть кейсы <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-px sm:grid-cols-4 md:mt-20" style={{ borderTop: "1px solid var(--border)" }}>
            {[
              { val: "200+", label: "интерфейсов спроектировано" },
              { val: "98%", label: "клиентов продолжают сотрудничество" },
              { val: "x2.5", label: "средний рост конверсии" },
              { val: "Figma", label: "от прототипа до UI-кита" },
            ].map((s) => (
              <div key={s.label} className="py-6 pr-8" style={{ borderBottom: "1px solid var(--border)" }}>
                <p className="font-body text-xl font-semibold tabular-nums tracking-tight md:text-2xl" style={{ color: "var(--text)" }}>{s.val}</p>
                <p className="font-body mt-1 text-[11px] leading-relaxed md:text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process timeline */}
      <section className="border-t px-4 py-16 md:px-8 md:py-24 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-body text-lg font-semibold tracking-tight md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
            Процесс
          </h2>
          <p className="font-body mt-3 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
            От исследования до передачи в разработку — каждый этап прозрачен
          </p>
          <div className="mt-10 relative">
            <div className="absolute left-[11px] top-0 bottom-0 w-px hidden md:block" style={{ backgroundColor: "var(--border)" }} />
            {PROCESS_STEPS.map((step, i) => (
              <AnimatedBlock key={step.num} delay={i * 100}>
                <div className="flex gap-6 py-6 md:py-8" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center"
                    style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}>
                    <step.icon size={12} style={{ color: "var(--text-muted)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>{step.num}</span>
                      <h3 className="font-body text-sm font-semibold md:text-base" style={{ color: "var(--text)" }}>{step.title}</h3>
                    </div>
                    <p className="font-body text-xs leading-relaxed md:text-sm max-w-xl" style={{ color: "var(--text-muted)" }}>{step.desc}</p>
                  </div>
                </div>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Cases */}
      <section className="border-t px-4 py-16 md:px-8 md:py-20 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-body text-lg font-semibold tracking-tight md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
                Кейсы
              </h2>
              <p className="mt-2 font-matrix text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
                Отрасль · формат · продукт
              </p>
            </div>
            <Link href="/portfolio"
              className="inline-flex items-center gap-2 font-matrix text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--text-subtle)" }}>
              Смотреть все проекты <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ backgroundColor: "var(--border)" }}>
            {UX_SHOWCASE_CASES.map((c, i) => (
              <CaseTile key={`${c.client}-${i}`} item={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Typography block */}
      <section className="relative overflow-hidden border-t py-20 md:py-28 lg:py-36"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 lg:px-12">
          <p className="font-matrix text-[10px] uppercase tracking-[0.35em] md:text-[11px]" style={{ color: "var(--text-muted)" }}>
            Что мы умеем и любим
          </p>
          <div className="mt-8 flex flex-col gap-2 md:mt-10 md:gap-3">
            <h2 className="font-akony text-[clamp(0.9rem,3.2vw,2.25rem)] font-normal leading-[0.95] uppercase tracking-[0.02em] sm:text-[clamp(1.05rem,4vw,3rem)] md:text-[clamp(1.2rem,3.5vw,3rem)]" style={{ color: "var(--text)" }}>
              дизайн
            </h2>
            <h2 className="font-akony text-[clamp(0.9rem,3.2vw,2.25rem)] font-normal leading-[0.95] uppercase tracking-[0.02em] sm:text-[clamp(1.05rem,4vw,3rem)] md:text-[clamp(1.2rem,3.5vw,3rem)]"
              style={{ color: "transparent", WebkitTextStroke: "1.5px color-mix(in srgb, var(--text) 30%, transparent)" }}>
              продукт
            </h2>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="border-t px-4 py-10 md:py-14 overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1400px]">
          <p className="font-matrix text-[10px] uppercase tracking-[0.2em] mb-6" style={{ color: "var(--text-subtle)" }}>Инструменты</p>
          <div className="flex flex-wrap gap-3">
            {TOOLS.map((tool, i) => (
              <AnimatedBlock key={tool} delay={i * 60}>
                <span className="inline-block px-4 py-2.5 font-matrix text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 md:text-xs"
                  style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
                  {tool}
                </span>
              </AnimatedBlock>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="border-t px-4 py-16 md:px-8 md:py-24 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1400px]">
          <h2 className="font-body text-lg font-semibold tracking-tight md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
            Направления
          </h2>
          <div className="mt-12 space-y-0">
            {UX_EXPERTISE_BLOCKS.map((block, i) => (
              <ExpertiseRow key={block.title} block={block} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t px-4 py-16 md:px-8 md:py-20 lg:px-12"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-matrix text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>Связаться</p>
            <a href={`mailto:${EMAIL}`}
              className="mt-2 block font-akony text-lg normal-case font-medium tracking-normal transition-opacity hover:opacity-80 md:text-xl"
              style={{ color: "var(--text)" }}>
              {EMAIL}
            </a>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/brief?source=ux-ui-design"
              className="flex items-center gap-3 px-8 py-4 font-matrix text-xs uppercase tracking-[0.2em]"
              style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
            >
              Бриф на дизайн <ArrowRight size={16} />
            </Link>
            <Link href="/services/outstaff"
              className="flex items-center gap-2 border px-6 py-4 font-matrix text-[10px] uppercase tracking-[0.18em]"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
              Дизайн-команда · аутстаф
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

function CaseTile({ item, index }: { item: (typeof UX_SHOWCASE_CASES)[number]; index: number }) {
  const { ref, v } = useInView();
  return (
    <div ref={ref}
      className="group relative flex min-h-[200px] flex-col justify-between p-6 transition-opacity duration-700 md:min-h-[220px] md:p-8"
      style={{
        backgroundColor: "var(--bg)",
        opacity: v ? 1 : 0,
        transform: v ? "none" : "translateY(16px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        transitionDelay: `${(index % 6) * 60}ms`,
      }}>
      <div className="absolute inset-0 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.08]"
        style={{ background: `radial-gradient(circle at 30% 20%, var(--text), transparent 55%), radial-gradient(circle at 80% 90%, var(--text-subtle), transparent 40%)` }} />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <span className="font-matrix text-[9px] uppercase tracking-[0.22em]" style={{ color: "var(--text-subtle)" }}>{item.industry}</span>
        <span className="font-matrix text-[9px] uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="relative z-10 mt-8">
        <p className="font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>{item.type}</p>
        <p className="mt-2 font-body text-sm font-semibold leading-snug md:text-base" style={{ color: "var(--text)" }}>{item.client}</p>
      </div>
    </div>
  );
}

function ExpertiseRow({ block, index }: { block: (typeof UX_EXPERTISE_BLOCKS)[number]; index: number }) {
  const { ref, v } = useInView();
  return (
    <div ref={ref}
      className="grid gap-6 border-t py-10 md:grid-cols-[minmax(0,0.35fr)_1fr] md:gap-12 md:py-12"
      style={{
        borderColor: "var(--border)",
        opacity: v ? 1 : 0,
        transform: v ? "none" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>
      <div className="flex items-baseline gap-3 md:block">
        <span className="font-matrix text-[10px] tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>{String(index + 1).padStart(2, "0")}</span>
        <h3 className="font-body text-lg font-semibold leading-snug md:text-xl" style={{ color: "var(--text)" }}>{block.title}</h3>
      </div>
      <p className="font-body text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>{block.body}</p>
    </div>
  );
}
