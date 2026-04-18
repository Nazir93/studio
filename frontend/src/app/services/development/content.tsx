"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, Terminal } from "lucide-react";
/* ─── TERMINAL TYPING EFFECT ─── */

const TERMINAL_LINES = [
  { type: "input" as const, text: '$ cat app/api/health/route.ts' },
  { type: "output" as const, text: 'import { NextResponse } from "next/server";' },
  { type: "output" as const, text: "" },
  { type: "output" as const, text: "export async function GET() {" },
  { type: "output" as const, text: '  return NextResponse.json({ ok: true, service: "code1618" });' },
  { type: "output" as const, text: "}" },
  { type: "output" as const, text: "" },
  { type: "input" as const, text: "$ npm run build" },
  { type: "output" as const, text: "" },
  { type: "output" as const, text: "✓ Compiled successfully" },
  { type: "output" as const, text: "→ Ready — http://localhost:3000" },
];

function TerminalHeroAnimation() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true);
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (lineIdx >= TERMINAL_LINES.length) return;

    const line = TERMINAL_LINES[lineIdx];
    const isInput = line.type === "input";
    const speed = isInput ? 28 : 12;

    if (charIdx < line.text.length) {
      const timer = setTimeout(() => {
        setCurrentLine(line.text.slice(0, charIdx + 1));
        setCharIdx(charIdx + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
    const delay = isInput ? 380 : line.text === "" ? 120 : 45;
    const timer = setTimeout(() => {
      setLines((prev) => [...prev, line.text]);
      setCurrentLine("");
      setCharIdx(0);
      setLineIdx(lineIdx + 1);
    }, delay);
    return () => clearTimeout(timer);
  }, [inView, lineIdx, charIdx]);

  return (
    <div
      ref={ref}
      className="font-mono text-[10px] md:text-[11px] leading-relaxed tracking-tight"
      style={{ color: "var(--text-muted)" }}
    >
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre" style={{ color: TERMINAL_LINES[i]?.type === "input" ? "var(--text)" : "var(--text-muted)" }}>
          {l || "\u00A0"}
        </div>
      ))}
      {lineIdx < TERMINAL_LINES.length && (
        <div className="whitespace-pre" style={{ color: TERMINAL_LINES[lineIdx]?.type === "input" ? "var(--text)" : "var(--text-muted)" }}>
          {currentLine}
          <span className="inline-block w-[6px] h-[14px] ml-0.5 animate-pulse align-middle" style={{ backgroundColor: "var(--text)" }} />
        </div>
      )}
    </div>
  );
}

/* ─── TECH GRAPH CANVAS ─── */

interface TechNode { x: number; y: number; label: string; r: number; connections: number[] }

const TECH_GRAPH_DATA: { label: string; group: number }[] = [
  { label: "React", group: 0 }, { label: "Next.js", group: 0 }, { label: "Vue", group: 0 }, { label: "Angular", group: 0 },
  { label: "TypeScript", group: 1 }, { label: "Node.js", group: 1 }, { label: "Nest.js", group: 1 },
  { label: "PostgreSQL", group: 2 }, { label: "Redis", group: 2 }, { label: "ClickHouse", group: 2 },
  { label: "Docker", group: 3 }, { label: "Kafka", group: 3 }, { label: "Prisma", group: 3 },
  { label: "Swift", group: 4 }, { label: "Kotlin", group: 4 },
  { label: "Jest", group: 5 }, { label: "Grafana", group: 5 },
];

function TechGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const nodesRef = useRef<TechNode[]>([]);
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
      initNetwork();
    };

    const initNetwork = () => {
      initRef.current = true;
      const nodes: TechNode[] = [];
      const groups = [0, 1, 2, 3, 4, 5];
      const groupCenters = groups.map((_, i) => ({
        x: W * 0.15 + (W * 0.7) * (i % 3) / 2,
        y: H * 0.25 + (i < 3 ? 0 : H * 0.45),
      }));

      TECH_GRAPH_DATA.forEach((tech, idx) => {
        const gc = groupCenters[tech.group];
        nodes.push({
          x: gc.x + (Math.random() - 0.5) * W * 0.18,
          y: gc.y + (Math.random() - 0.5) * H * 0.25,
          label: tech.label,
          r: 3,
          connections: [],
        });
      });

      nodes.forEach((n, i) => {
        const sameGroup = TECH_GRAPH_DATA.filter((_, j) => j !== i && TECH_GRAPH_DATA[j].group === TECH_GRAPH_DATA[i].group);
        TECH_GRAPH_DATA.forEach((t, j) => {
          if (j !== i && (t.group === TECH_GRAPH_DATA[i].group || Math.random() > 0.75)) {
            if (!n.connections.includes(j)) n.connections.push(j);
          }
        });
      });

      nodesRef.current = nodes;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const nodes = nodesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const isDark = () => {
        const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
        return bg === "#0A0A0A" || bg === "#0a0a0a" || bg.includes("10,10,10");
      };
      const dark = isDark();
      const color = dark ? "255,255,255" : "0,0,0";

      let hoveredIdx = -1;
      nodes.forEach((n, i) => {
        const dx = n.x - mx;
        const dy = n.y - my;
        if (Math.sqrt(dx * dx + dy * dy) < 40) hoveredIdx = i;
      });

      nodes.forEach((n) => {
        n.connections.forEach((ci) => {
          const target = nodes[ci];
          if (!target) return;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = `rgba(${color},0.04)`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        });
      });

      if (hoveredIdx >= 0) {
        const hn = nodes[hoveredIdx];
        hn.connections.forEach((ci) => {
          const target = nodes[ci];
          if (!target) return;
          ctx.beginPath();
          ctx.moveTo(hn.x, hn.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = `rgba(${color},0.2)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      }

      nodes.forEach((n, i) => {
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = i === hoveredIdx;
        const isConnected = hoveredIdx >= 0 && nodes[hoveredIdx].connections.includes(i);
        const proximity = dist < 120 ? 1 - dist / 120 : 0;
        const alpha = isHovered ? 0.9 : isConnected ? 0.6 : 0.15 + proximity * 0.3;
        const r = isHovered ? 5 : isConnected ? 4 : n.r + proximity * 2;

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.fill();

        if (isHovered || isConnected) {
          ctx.font = `${isHovered ? 11 : 10}px JetBrains Mono, monospace`;
          ctx.fillStyle = `rgba(${color},${isHovered ? 0.8 : 0.5})`;
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y - r - 6);
        }
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); parent.removeEventListener("mousemove", handleMouseMove); ro.disconnect(); };
  }, [handleMouseMove]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-[2] h-full w-full" />;
}

/* ─── ANIMATED BLOCK ─── */

function AnimatedBlock({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)", transition: `all 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── ANIMATED COUNTER ─── */

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1600;
        const startTime = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setVal(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

/* ─── DATA ─── */

const TECH_STACK = [
  "Nest.js", "React", "Vue", "ASP.NET", "Java", "Kotlin",
  "Kafka", "Docker", "Swift", "Angular", "Redis", "ClickHouse",
  "Prisma", "NATS", "Next.js", "Laravel", "PostgreSQL", "TypeScript",
  "Yii2", "PHP", "RabbitMQ", "Grafana / k6", "Jest",
];

const APPROACH_ITEMS = [
  { title: "Аналитика", desc: "Изучаем данные, выделяем сильные стороны, проводим опросы и проверяем гипотезы.", note: "Рассчитаем стоимость разработки" },
  { title: "Юзабилити и дизайн", desc: "Создадим кликабельный прототип, чтобы вы могли оценить будущее приложение или сайт.", note: "Общение напрямую с дизайнером · Разработка на ваших глазах" },
  { title: "Поддержка и развитие", desc: "По завершении проекта ведём поддержку продукта. Добавляем новые функции, совершенствуем готовые.", note: "1 год гарантии · Обучим персонал" },
  { title: "Интеграция с системами", desc: "Проводим интеграцию с системами IT-инфраструктуры заказчика.", note: null },
  { title: "Scrum", desc: "Методология на видимый результат: каждые две недели вы получаете доступ к работающему функционалу, а не просто код.", note: null },
  { title: "Политики безопасности", desc: "Делаем упор на безопасность данных.", note: null },
];

const FORMATS = [
  { title: "Гибкая разработка", desc: "Формат, позволяющий развивать ваш проект в зависимости от актуальных целей и реагировать на обратную связь от реальных пользователей.", tags: ["Почасовая оплата", "Для долгосрочных проектов"] },
  { title: "Работа по ТЗ", desc: "Составим техническое задание, согласуем прототипы и определим окончательную стоимость проекта.", tags: ["Когда знаете, чего хотите", "Для решения конкретной задачи"] },
];

const DELIVERABLES = [
  { title: "Аналитика проекта", desc: "Поделитесь своей идеей — мы проанализируем рынок и целевую аудиторию для будущего продукта. Вы получите информацию о сроках и стоимости разработки." },
  { title: "UI/UX дизайн", desc: "Создадим дизайн с учётом ваших пожеланий, составим путь пользователя и вайрфреймы. Вы получите кликабельный прототип, чтобы оценить будущее приложение или сайт." },
  { title: "Разработка", desc: "Разработка включает спринты. В конце каждого спринта добавляем новые функции и рассказываем о ходе разработки. Вы сможете протестировать их в демо-версии." },
  { title: "Тестирование", desc: "Наши тестировщики найдут ошибки, которые мешают удобному использованию. В результате продукт будет работать быстро и без проблем." },
  { title: "Интеграции с вашими системами", desc: "Проводим интеграцию с системами IT-инфраструктуры заказчика." },
  { title: "Техническая поддержка и развитие", desc: "После релиза работа продолжается. Команда учитывает отзывы пользователей и регулярно выпускает обновления." },
  { title: "Медийная поддержка", desc: "Когда проект запущен, мы делаем его заметным и успешным через освещение в медиа." },
];

const SUPPORT_ITEMS = [
  { title: "Гарантия", desc: "60 дней на софт" },
  { title: "Политики безопасности", desc: "Работаем по стандартам ISO 9001, 27001" },
  { title: "SLA", desc: "Базовый SLA для большинства проектов. Реагируем на инциденты в течение 8 рабочих часов." },
  { title: "Full SLA 24/7", desc: "Подходит для критической IT-инфраструктуры." },
];

const ARCHITECTURE_LAYERS = [
  { label: "Frontend", tech: "React · Next.js · Vue", desc: "SSR, SPA, PWA" },
  { label: "API Gateway", tech: "Nginx · Kong", desc: "Маршрутизация, rate limiting" },
  { label: "Backend", tech: "Nest.js · ASP.NET · Laravel", desc: "Бизнес-логика, авторизация" },
  { label: "Message Queue", tech: "Kafka · RabbitMQ · NATS", desc: "Асинхронная обработка" },
  { label: "Database", tech: "PostgreSQL · Redis · ClickHouse", desc: "Хранение и кеширование" },
  { label: "Infrastructure", tech: "Docker · k8s · CI/CD", desc: "Деплой и мониторинг" },
];

const CODE_DIFF = [
  { type: "removed" as const, text: "  // Legacy: ручная обработка без валидации" },
  { type: "removed" as const, text: "  const data = req.body;" },
  { type: "removed" as const, text: "  db.query(`INSERT INTO users VALUES ('${data.name}')`);" },
  { type: "removed" as const, text: "  res.send('ok');" },
  { type: "added" as const, text: "  // Type-safe с валидацией и защитой от инъекций" },
  { type: "added" as const, text: "  const data = createUserSchema.parse(req.body);" },
  { type: "added" as const, text: "  const user = await db.user.create({ data });" },
  { type: "added" as const, text: "  return NextResponse.json(user, { status: 201 });" },
];

const FAQ_ITEMS = [
  { q: "Оказывается ли техническая поддержка? Какая?", a: "Да, мы предоставляем техническую поддержку после запуска проекта. Базовый SLA включает реагирование на инциденты в течение 8 рабочих часов. Для критической инфраструктуры доступен Full SLA 24/7." },
  { q: "Что нужно для старта разработки, если я ничего не знаю об этом?", a: "Достаточно описать идею продукта. Наши аналитики проведут бесплатное предпроектное исследование, определят объём работ, сроки и бюджет. Вам не нужно разбираться в технологиях — это наша задача." },
  { q: "Из чего складывается процесс разработки?", a: "Аналитика → дизайн → разработка спринтами → тестирование → интеграция → запуск → поддержка. Каждые две недели вы видите работающий результат." },
  { q: "Как выбрать подрядчика?", a: "Обратите внимание на портфолио, стек технологий, наличие собственной команды (не субподряд), прозрачность процессов и готовность показать промежуточные результаты." },
  { q: "Почему так долго?", a: "Качественная разработка требует времени на аналитику, проектирование архитектуры, тестирование и интеграцию. Мы работаем спринтами — вы видите прогресс каждые 2 недели, а не ждёте готовый продукт месяцами." },
  { q: "Что такое предпроектное исследование? Зачем оно нужно?", a: "Это этап, на котором мы изучаем рынок, целевую аудиторию, конкурентов и формируем техническое задание. Без него невозможно точно оценить сроки и бюджет." },
  { q: "Заказная разработка и гарантии", a: "Мы предоставляем 60 дней гарантии на софт. В течение этого периода исправляем любые дефекты бесплатно. После — доступна техническая поддержка по SLA." },
  { q: "Какое тестирование проводится?", a: "Функциональное, регрессионное, нагрузочное тестирование, тесты безопасности. Автоматизированные тесты (Jest, Cypress) покрывают критические сценарии." },
  { q: "Почему лучше не идти к фрилансерам?", a: "Фрилансер — это один человек без команды, без процессов, без гарантий. Мы — команда с аналитиками, дизайнерами, разработчиками, тестировщиками и менеджерами. Мы несём ответственность за результат." },
];

const PROMO_ITEMS = [
  "Публикуем кейсы и увеличиваем ценность проекта среди конкурентов в информационном поле",
  "Получаем подтверждение актуальности проекта в конкурсах",
  "Увеличиваем ценность IT-бренда клиента через совместные экспертные мероприятия и подкасты. Охват аудитории IT-специалистов — 10 000 в месяц",
];

/* ─── FAQ ITEM ─── */

function FaqItem({ item, index }: { item: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-5 text-left md:py-6">
        <div className="flex items-baseline gap-3 pr-4">
          <span className="font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>{String(index + 1).padStart(2, "0")}</span>
          <h3 className="font-body text-xs font-semibold leading-snug md:text-sm" style={{ color: "var(--text)" }}>{item.q}</h3>
        </div>
        {open ? <ChevronUp size={16} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />}
      </button>
      <div className="overflow-hidden transition-all duration-400 ease-in-out" style={{ maxHeight: open ? "500px" : "0px", opacity: open ? 1 : 0 }}>
        <p className="font-body pb-6 pl-8 pr-4 text-sm leading-relaxed md:pl-10 md:text-base" style={{ color: "var(--text-muted)" }}>{item.a}</p>
      </div>
    </div>
  );
}

/* ─── SECTIONS ─── */

function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay" style={{ opacity: 0.08 }}>
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="dev-grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#dev-grain)" />
        </svg>
      </div>

      <div className="relative z-10 grid min-h-[90vh] grid-cols-1 lg:grid-cols-[1fr_1fr] px-4 py-20 md:px-8 lg:px-16">
        <div className="flex flex-col justify-center">
          <p className="font-matrix text-[10px] uppercase tracking-[0.4em] md:text-xs" style={{ color: "var(--text-muted)" }}>Разработка</p>
          <h1 className="mt-4 max-w-xl min-w-0 font-heading services-page-h1 tracking-tight" style={{ color: "var(--text)" }}>
            Frontend — Backend — iOS — Android — API
          </h1>
          <p className="font-body mt-6 max-w-lg text-base leading-relaxed md:mt-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            Разработка программного обеспечения на заказ: приложения и веб-сервисы со множеством интеграций
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/brief?source=development"
              className="group flex items-center gap-3 px-8 py-4 font-matrix text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:gap-5"
              style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
            >
              Обсудить проект <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="font-body mt-4 text-xs md:text-sm" style={{ color: "var(--text-subtle)" }}>
            Изучим и оценим проект, бесплатно предложим дизайн-решение
          </p>
        </div>

        {/* Terminal block */}
        <div className="mt-10 lg:mt-0 flex items-center justify-center">
          <div className="w-full max-w-lg p-1" style={{ border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--text) 15%, transparent)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--text) 15%, transparent)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--text) 15%, transparent)" }} />
              </div>
              <span className="font-matrix text-[9px] uppercase tracking-[0.15em] ml-2" style={{ color: "var(--text-subtle)" }}>
                <Terminal size={10} className="inline mr-1" /> terminal
              </span>
            </div>
            <div className="p-4 min-h-[300px]">
              <TerminalHeroAnimation />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 px-4 pb-16 md:px-8 lg:px-16">
        <div className="grid grid-cols-2 gap-px sm:grid-cols-4" style={{ borderTop: "1px solid var(--border)" }}>
          {[
            { val: 300, suffix: "+", label: "Реализованных проектов" },
            { val: 7, suffix: "+", label: "Лет в разработке" },
            { val: 12, suffix: "", label: "Специалистов в команде" },
            { val: 99, suffix: ".9%", label: "Uptime продуктов" },
          ].map((s) => (
            <div key={s.label} className="py-6 pr-8" style={{ borderBottom: "1px solid var(--border)" }}>
              <p className="font-body text-xl font-semibold tabular-nums tracking-tight md:text-2xl" style={{ color: "var(--text)" }}>
                <AnimatedCounter target={s.val} suffix={s.suffix} />
              </p>
              <p className="font-body mt-1 text-[11px] leading-relaxed md:text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  return (
    <section className="relative px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
        <div>
          <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
            Востребованный стек
          </h2>
          <p className="font-body mt-3 max-w-md text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
            Наведите на узел графа, чтобы увидеть связи технологий
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {TECH_STACK.map((t, i) => (
              <AnimatedBlock key={t} delay={i * 40}>
                <span className="inline-block px-4 py-2.5 font-matrix text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 md:text-xs"
                  style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
                  {t}
                </span>
              </AnimatedBlock>
            ))}
          </div>
        </div>
        <div className="relative min-h-[350px] lg:min-h-[450px]" style={{ border: "1px solid var(--border)" }}>
          <TechGraphCanvas />
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg-secondary, var(--bg))", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
        Типовая архитектура
      </h2>
      <p className="font-body mt-3 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
        Каждый проект уникален, но надёжная архитектура — всегда
      </p>
      <div className="mt-8 md:mt-12 relative">
        <div className="absolute left-3 top-0 bottom-0 w-px hidden md:block" style={{ backgroundColor: "var(--border)" }} />
        {ARCHITECTURE_LAYERS.map((layer, i) => (
          <AnimatedBlock key={layer.label} delay={i * 100}>
            <div className="flex gap-6 py-5 md:py-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="relative z-10 w-6 h-6 shrink-0 flex items-center justify-center"
                style={{ backgroundColor: "var(--bg-secondary, var(--bg))", border: "1px solid var(--border)" }}>
                <span className="font-matrix text-[8px]" style={{ color: "var(--text-subtle)" }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                <h3 className="font-body text-sm font-semibold md:text-base" style={{ color: "var(--text)" }}>{layer.label}</h3>
                <span className="font-matrix text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--text-muted)" }}>{layer.tech}</span>
                <span className="font-body text-xs" style={{ color: "var(--text-subtle)" }}>{layer.desc}</span>
              </div>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function CodeDiffSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
        Качество кода
      </h2>
      <p className="font-body mt-3 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
        Типобезопасность, валидация, ORM вместо сырых запросов
      </p>
      <AnimatedBlock delay={200}>
        <div className="mt-8 md:mt-12 p-1" style={{ border: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
            <span className="font-matrix text-[9px] uppercase tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>api/users/route.ts</span>
          </div>
          <div className="p-4 font-matrix text-[11px] md:text-xs leading-relaxed">
            {CODE_DIFF.map((line, i) => (
              <div key={i} className="flex gap-3 py-0.5" style={{
                backgroundColor: line.type === "removed"
                  ? "color-mix(in srgb, #ff4444 6%, transparent)"
                  : "color-mix(in srgb, #44ff44 6%, transparent)",
              }}>
                <span style={{ color: line.type === "removed" ? "#ff6666" : "#66ff66", opacity: 0.7 }}>
                  {line.type === "removed" ? "−" : "+"}
                </span>
                <span style={{ color: "var(--text-muted)" }}>{line.text}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedBlock>
    </section>
  );
}

function ApproachSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg-secondary, var(--bg))", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>Наш подход</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
        {APPROACH_ITEMS.map((item, i) => (
          <AnimatedBlock key={item.title} delay={i * 80} className="flex flex-col p-6 md:p-8">
            <div style={{ border: "1px solid var(--border)" }} className="flex h-full flex-col p-6 md:p-8">
              <span className="font-matrix text-[10px] uppercase tracking-[0.3em] md:text-[11px]" style={{ color: "var(--text-subtle)" }}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-body text-sm font-semibold leading-snug md:text-base" style={{ color: "var(--text)" }}>{item.title}</h3>
              <p className="font-body mt-3 flex-1 text-xs leading-relaxed md:text-sm" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
              {item.note && <p className="font-matrix mt-4 text-[10px] uppercase tracking-[0.15em] md:text-[11px]" style={{ color: "var(--text-subtle)" }}>{item.note}</p>}
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function FormatsSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>Форматы сотрудничества</h2>
      <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2">
        {FORMATS.map((f, i) => (
          <AnimatedBlock key={f.title} delay={i * 120}>
            <div className="flex h-full flex-col p-6 md:p-8" style={{ border: "1px solid var(--border)" }}>
              <h3 className="font-body text-base font-semibold leading-snug md:text-xl" style={{ color: "var(--text)" }}>{f.title}</h3>
              <p className="font-body mt-4 flex-1 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {f.tags.map((tag) => (
                  <span key={tag} className="font-matrix px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] md:text-[11px]"
                    style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function DeliverablesSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg-secondary, var(--bg))", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>Что получает клиент</h2>
      <div className="mt-8 md:mt-12">
        {DELIVERABLES.map((d, i) => (
          <AnimatedBlock key={d.title} delay={i * 60}>
            <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-[1fr_2fr] md:py-8" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-baseline gap-3">
                <span className="font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-body text-sm font-semibold leading-snug md:text-base" style={{ color: "var(--text)" }}>{d.title}</h3>
              </div>
              <p className="font-body text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>{d.desc}</p>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function SupportSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>Поддерживаем софт после запуска</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-12">
        {SUPPORT_ITEMS.map((s, i) => (
          <AnimatedBlock key={s.title} delay={i * 80}>
            <div className="flex h-full flex-col p-6" style={{ border: "1px solid var(--border)" }}>
              <h3 className="font-body text-sm font-semibold leading-snug md:text-base" style={{ color: "var(--text)" }}>{s.title}</h3>
              <p className="font-body mt-3 text-xs leading-relaxed md:text-sm" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function PromoSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg-secondary, var(--bg))", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>Продвижение проекта</h2>
      <p className="font-body mt-4 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
        Продвижение реализованного проекта в медиа
      </p>
      <div className="mt-8 space-y-4 md:mt-12">
        {PROMO_ITEMS.map((item, i) => (
          <AnimatedBlock key={i} delay={i * 100}>
            <div className="flex items-start gap-4 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="mt-0.5 font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>{String(i + 1).padStart(2, "0")}</span>
              <p className="font-body text-sm leading-relaxed md:text-base" style={{ color: "var(--text)" }}>{item}</p>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>FAQ</h2>
      <div className="mt-8 md:mt-12" style={{ borderTop: "1px solid var(--border)" }}>
        {FAQ_ITEMS.map((item, i) => <FaqItem key={i} item={item} index={i} />)}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg-secondary, var(--bg))", borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>Обсудить проект</h2>
        <p className="font-body mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
          Изучим вашу задачу, бесплатно предложим дизайн-решение и оценим сроки
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/brief?source=development"
            className="group flex items-center gap-3 px-8 py-4 font-matrix text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:gap-5"
            style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
          >
            Оставить заявку <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link href="/services" className="flex items-center gap-3 px-8 py-4 font-matrix text-sm uppercase tracking-[0.15em] transition-colors duration-300"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
            Все услуги
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── MAIN ─── */

export function DevelopmentContent() {
  return (
    <article>
      <HeroSection />
      <TechStackSection />
      <ArchitectureSection />
      <CodeDiffSection />
      <ApproachSection />
      <FormatsSection />
      <DeliverablesSection />
      <SupportSection />
      <PromoSection />
      <FaqSection />
      <CtaSection />
    </article>
  );
}
