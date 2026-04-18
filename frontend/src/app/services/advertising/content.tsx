"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, Search, Target, Share2, TrendingUp, BarChart3, Megaphone } from "lucide-react";
/* ─── FUNNEL CANVAS ─── */

function FunnelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{ x: number; y: number; vy: number; alpha: number; size: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let W = 0, H = 0;

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

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const dark = isDark();
      const color = dark ? "255,255,255" : "0,0,0";

      const cx = W * 0.75;
      const topY = H * 0.1;
      const botY = H * 0.9;
      const topW = W * 0.28;
      const botW = W * 0.06;

      ctx.beginPath();
      ctx.moveTo(cx - topW, topY);
      ctx.lineTo(cx + topW, topY);
      ctx.lineTo(cx + botW, botY);
      ctx.lineTo(cx - botW, botY);
      ctx.closePath();
      ctx.strokeStyle = `rgba(${color},0.08)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      const stages = [0.1, 0.35, 0.6, 0.85];
      stages.forEach((pct) => {
        const y = topY + (botY - topY) * pct;
        const w = topW + (botW - topW) * pct;
        ctx.beginPath();
        ctx.moveTo(cx - w, y);
        ctx.lineTo(cx + w, y);
        ctx.strokeStyle = `rgba(${color},0.05)`;
        ctx.stroke();
      });

      if (Math.random() > 0.85) {
        particlesRef.current.push({
          x: cx + (Math.random() - 0.5) * topW * 1.6,
          y: topY,
          vy: 0.5 + Math.random() * 1,
          alpha: 0.4 + Math.random() * 0.3,
          size: 1 + Math.random() * 1.5,
        });
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.y += p.vy;
        const progress = (p.y - topY) / (botY - topY);
        const currentW = topW + (botW - topW) * progress;
        const targetX = cx + (Math.random() - 0.5) * 0.3;
        p.x += (targetX - p.x) * 0.01;

        if (Math.abs(p.x - cx) > currentW) p.alpha -= 0.02;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${p.alpha})`;
        ctx.fill();

        return p.y < botY + 20 && p.alpha > 0;
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[2] h-full w-full" />;
}

/* ─── ANIMATED BLOCK ─── */

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

/* ─── ANIMATED BAR ─── */

function AnimatedBar({ width, delay = 0 }: { width: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-[3px] transition-all duration-1000 ease-out" style={{
      width: vis ? `${width}%` : "0%",
      backgroundColor: "var(--text)",
      opacity: vis ? 0.5 : 0,
      transitionDelay: `${delay}ms`,
    }} />
  );
}

/* ─── DATA ─── */

const CHANNELS = [
  { icon: Search, title: "Яндекс.Директ", desc: "Контекстная реклама в поиске и сетях. Горячий спрос, быстрый запуск, оплата за клики.", tags: ["Поиск", "РСЯ", "Ретаргетинг"], avgRoas: "300-500%" },
  { icon: Search, title: "Google Ads", desc: "Контекстная реклама для международных рынков и YouTube. Performance-кампании с оптимизацией под конверсии.", tags: ["Search", "Display", "YouTube"], avgRoas: "250-450%" },
  { icon: Target, title: "Соцтаргет", desc: "Таргетированная реклама в соцсетях и партнёрских площадках: охваты, лид-формы, ретаргетинг.", tags: ["Лид-формы", "Промопосты", "Ретаргет"], avgRoas: "200-400%" },
  { icon: Share2, title: "Telegram Ads", desc: "Реклама в каналах и через Telegram Ads Platform. Точные аудитории и высокий CTR.", tags: ["Каналы", "Боты", "Mini Apps"], avgRoas: "180-350%" },
  { icon: TrendingUp, title: "SEO-продвижение", desc: "Вывод сайта в топ Яндекса и Google. Техническое SEO, контент-стратегия, ссылочный профиль.", tags: ["Техническое SEO", "Контент", "Ссылки"], avgRoas: "500-1200%" },
  { icon: Megaphone, title: "SMM", desc: "Ведение соцсетей, контент-план, дизайн, комьюнити-менеджмент. Растим лояльную аудиторию.", tags: ["Контент", "Сторис", "Reels"], avgRoas: "150-300%" },
];

const CASES = [
  { client: "Сеть ресторанов", channel: "Соцтаргет + Яндекс.Директ", result: "+340% заявок", period: "3 месяца", budget: "от 150 000 ₽/мес" },
  { client: "Онлайн-школа", channel: "Telegram Ads + SEO", result: "x4 регистрации", period: "4 месяца", budget: "от 200 000 ₽/мес" },
  { client: "B2B SaaS", channel: "Google Ads + контент-маркетинг", result: "−62% стоимость лида", period: "6 месяцев", budget: "от 300 000 ₽/мес" },
  { client: "Интернет-магазин", channel: "Яндекс.Директ + SEO + SMM", result: "+180% выручка", period: "5 месяцев", budget: "от 250 000 ₽/мес" },
];

const PACKAGES = [
  {
    title: "Старт",
    price: "от 80 000 ₽",
    period: "/мес",
    desc: "Быстрый запуск одного рекламного канала",
    features: ["1 рекламный канал", "Настройка кампаний", "Еженедельные отчёты", "A/B тестирование", "Базовая аналитика"],
  },
  {
    title: "Рост",
    price: "от 180 000 ₽",
    period: "/мес",
    desc: "Комплексное продвижение для растущего бизнеса",
    features: ["2-3 рекламных канала", "SEO-оптимизация", "Контент-маркетинг", "Сквозная аналитика", "Ежемесячная стратегия", "Личный менеджер"],
    highlighted: true,
  },
  {
    title: "Масштаб",
    price: "от 350 000 ₽",
    period: "/мес",
    desc: "Полный digital-маркетинг для амбициозных целей",
    features: ["Все каналы", "SMM-ведение", "Видео-контент", "CRM-интеграция", "Еженедельная стратегия", "Выделенная команда", "Сквозная аналитика"],
  },
];

const DASHBOARD_METRICS = [
  { label: "CTR", value: 4.7, suffix: "%", barWidth: 47 },
  { label: "Конверсия", value: 3.2, suffix: "%", barWidth: 32 },
  { label: "ROAS", value: 420, suffix: "%", barWidth: 84 },
  { label: "CPL", value: 850, suffix: " ₽", barWidth: 28 },
];

const FAQ_ITEMS = [
  { q: "Какой бюджет нужен для старта?", a: "Минимальный рекламный бюджет — от 50 000 ₽/мес на один канал. Оптимальный — от 150 000 ₽/мес для комплексного продвижения. Мы не тратим бюджет впустую: начинаем с тестовых кампаний и масштабируем работающее." },
  { q: "Через сколько ждать результат?", a: "Контекстная и таргетированная реклама — первые заявки в течение 1-3 дней после запуска. SEO — устойчивый рост через 2-4 месяца. Мы показываем промежуточные результаты еженедельно." },
  { q: "Что такое сквозная аналитика?", a: "Система, которая связывает расходы на рекламу с реальными продажами. Вы видите, какой канал приносит клиентов, а какой — только клики. Интегрируем с CRM, коллтрекингом и системами аналитики." },
  { q: "Работаете ли с Яндекс.Директ?", a: "Да, Яндекс.Директ — один из основных каналов. Настраиваем поисковые кампании, РСЯ, ретаргетинг, смарт-баннеры. Сертифицированные специалисты." },
  { q: "Можно ли контролировать расходы?", a: "Полная прозрачность: вы видите каждый рубль в реальном времени через дашборд. Дневные лимиты, еженедельные отчёты, моментальная остановка неэффективных кампаний." },
  { q: "Чем вы отличаетесь от других агентств?", a: "Мы — студия разработки с экспертизой в маркетинге. Это значит: идеальные посадочные страницы, техническое SEO на уровне разработчиков, интеграция аналитики без костылей, A/B тесты с правильной инфраструктурой." },
];

/* ─── FAQ ─── */

function FaqItem({ item, index }: { item: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-5 text-left md:py-6">
        <div className="flex items-baseline gap-3 pr-4">
          <span className="font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
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
      <FunnelCanvas />
      <div className="pointer-events-none absolute inset-0 z-[3] mix-blend-overlay" style={{ opacity: 0.06 }}>
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="ad-grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#ad-grain)" />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-[90vh] flex-col justify-center px-4 py-20 md:px-8 lg:px-16">
        <p className="font-matrix text-[10px] uppercase tracking-[0.4em] md:text-xs" style={{ color: "var(--text-muted)" }}>
          Реклама и продвижение
        </p>
        <h1 className="mt-4 max-w-4xl min-w-0 font-heading services-page-h1 tracking-tight" style={{ color: "var(--text)" }}>
          Привлекаем клиентов через digital-каналы
        </h1>
        <p className="font-body mt-6 max-w-2xl text-base leading-relaxed md:mt-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
          Таргетированная и контекстная реклама, SEO, SMM — от стратегии до сквозной аналитики. Каждый рубль работает на результат.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/brief?source=advertising"
            className="group flex items-center gap-3 px-8 py-4 font-matrix text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:gap-5"
            style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
          >
            Обсудить продвижение <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="font-body mt-4 text-xs md:text-sm" style={{ color: "var(--text-subtle)" }}>
          Бесплатно проведём аудит текущей рекламы и предложим стратегию
        </p>

        <div className="mt-16 grid grid-cols-2 gap-px sm:grid-cols-4 md:mt-20" style={{ borderTop: "1px solid var(--border)" }}>
          {[
            { val: "45+", label: "проектов в performance-маркетинге" },
            { val: "x3", label: "средний рост заявок клиентов" },
            { val: "−40%", label: "снижение стоимости лида" },
            { val: "100%", label: "прозрачность расходов" },
          ].map((s) => (
            <div key={s.label} className="py-6 pr-8" style={{ borderBottom: "1px solid var(--border)" }}>
              <p className="font-body text-xl font-semibold tabular-nums tracking-tight md:text-2xl" style={{ color: "var(--text)" }}>{s.val}</p>
              <p className="font-body mt-1 text-[11px] leading-relaxed md:text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChannelsSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
        Каналы продвижения
      </h2>
      <p className="font-body mt-3 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
        Подберём оптимальный микс каналов под ваш бизнес и бюджет
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
        {CHANNELS.map((ch, i) => (
          <AnimatedBlock key={ch.title} delay={i * 80}>
            <div className="group flex h-full flex-col p-6 md:p-8 transition-colors duration-300" style={{ border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <ch.icon size={18} style={{ color: "var(--text-muted)" }} className="transition-colors group-hover:text-[var(--text)]" />
                <span className="font-matrix text-[9px] uppercase tracking-[0.15em] px-2 py-1"
                  style={{ border: "1px solid var(--border)", color: "var(--text-subtle)" }}>
                  ROAS {ch.avgRoas}
                </span>
              </div>
              <h3 className="font-body text-sm font-semibold leading-snug md:text-base" style={{ color: "var(--text)" }}>{ch.title}</h3>
              <p className="font-body mt-3 flex-1 text-xs leading-relaxed md:text-sm" style={{ color: "var(--text-muted)" }}>{ch.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {ch.tags.map((tag) => (
                  <span key={tag} className="font-matrix px-2 py-1 text-[9px] uppercase tracking-[0.1em]"
                    style={{ border: "1px solid var(--border)", color: "var(--text-subtle)" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function DashboardSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg-secondary, var(--bg))", borderTop: "1px solid var(--border)" }}>
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
            Аналитика в реальном времени
          </h2>
          <p className="font-body mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
            Вы видите все метрики в едином дашборде: CTR, конверсии, стоимость лида, ROAS. Никаких скрытых расходов — полная прозрачность.
          </p>
          <p className="font-body mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
            Интегрируем с вашей CRM для сквозной аналитики: от клика по рекламе до оплаты. Вы знаете, какой канал приносит деньги.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Яндекс.Метрика", "Google Analytics", "CRM", "Коллтрекинг", "Power BI"].map((tool) => (
              <span key={tool} className="font-matrix px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]"
                style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg)" }}>
          <div className="flex items-center gap-2 pb-4 mb-6" style={{ borderBottom: "1px solid var(--border)" }}>
            <BarChart3 size={14} style={{ color: "var(--text-muted)" }} />
            <span className="font-matrix text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
              Дашборд · демо
            </span>
          </div>
          <div className="space-y-6">
            {DASHBOARD_METRICS.map((m, i) => (
              <div key={m.label}>
                <div className="flex justify-between mb-2">
                  <span className="font-matrix text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--text-muted)" }}>{m.label}</span>
                  <span className="font-matrix text-sm tabular-nums" style={{ color: "var(--text)" }}>
                    <AnimatedCounter target={m.value} suffix={m.suffix} />
                  </span>
                </div>
                <div className="h-[3px] w-full" style={{ backgroundColor: "color-mix(in srgb, var(--text) 8%, transparent)" }}>
                  <AnimatedBar width={m.barWidth} delay={i * 200} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 grid grid-cols-2 gap-4" style={{ borderTop: "1px solid var(--border)" }}>
            <div>
              <p className="font-matrix text-[9px] uppercase tracking-[0.15em] mb-1" style={{ color: "var(--text-subtle)" }}>Лидов / мес</p>
              <p className="font-body text-lg font-semibold tabular-nums" style={{ color: "var(--text)" }}>
                <AnimatedCounter target={247} />
              </p>
            </div>
            <div>
              <p className="font-matrix text-[9px] uppercase tracking-[0.15em] mb-1" style={{ color: "var(--text-subtle)" }}>Бюджет / мес</p>
              <p className="font-body text-lg font-semibold tabular-nums" style={{ color: "var(--text)" }}>
                <AnimatedCounter target={210} suffix=" K ₽" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CasesSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
        Результаты клиентов
      </h2>
      <div className="mt-8 md:mt-12" style={{ borderTop: "1px solid var(--border)" }}>
        {CASES.map((c, i) => (
          <AnimatedBlock key={c.client} delay={i * 100}>
            <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-[1fr_1.2fr_auto_auto] md:items-center md:py-8"
              style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-baseline gap-3">
                <span className="font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-body text-sm font-semibold leading-snug md:text-base" style={{ color: "var(--text)" }}>{c.client}</h3>
                  <p className="font-matrix text-[9px] uppercase tracking-[0.12em] mt-0.5" style={{ color: "var(--text-subtle)" }}>{c.channel}</p>
                </div>
              </div>
              <p className="font-body text-xl font-semibold tabular-nums md:text-2xl" style={{ color: "var(--text)" }}>{c.result}</p>
              <span className="font-matrix px-3 py-1.5 text-[9px] uppercase tracking-[0.1em]"
                style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                {c.period}
              </span>
              <span className="font-matrix text-[10px] tracking-[0.08em]" style={{ color: "var(--text-subtle)" }}>{c.budget}</span>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function PackagesSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg-secondary, var(--bg))", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
        Пакеты продвижения
      </h2>
      <p className="font-body mt-3 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
        Без рекламного бюджета. Стоимость — работа команды
      </p>
      <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-3">
        {PACKAGES.map((pkg, i) => (
          <AnimatedBlock key={pkg.title} delay={i * 120}>
            <div className="flex h-full flex-col p-6 md:p-8" style={{
              border: pkg.highlighted ? "2px solid var(--text)" : "1px solid var(--border)",
            }}>
              {pkg.highlighted && (
                <span className="font-matrix text-[9px] uppercase tracking-[0.2em] mb-4 self-start px-2 py-1"
                  style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}>
                  Популярный
                </span>
              )}
              <h3 className="font-body text-lg font-semibold md:text-xl" style={{ color: "var(--text)" }}>{pkg.title}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <p className="font-heading text-xl tracking-tight md:text-2xl" style={{ color: "var(--text)" }}>{pkg.price}</p>
                <span className="font-matrix text-[10px] tracking-[0.1em]" style={{ color: "var(--text-subtle)" }}>{pkg.period}</span>
              </div>
              <p className="font-body mt-3 text-xs leading-relaxed md:text-sm" style={{ color: "var(--text-muted)" }}>{pkg.desc}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-body text-xs md:text-sm" style={{ color: "var(--text-muted)" }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: "var(--text)" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/brief?source=advertising"
                className="mt-6 flex items-center justify-center gap-2 py-3 font-matrix text-xs uppercase tracking-[0.15em] transition-colors duration-300"
                style={{
                  backgroundColor: pkg.highlighted ? "var(--text)" : "transparent",
                  color: pkg.highlighted ? "var(--bg)" : "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                Выбрать <ArrowRight size={14} />
              </Link>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { num: "01", title: "Аудит и стратегия", desc: "Анализируем текущую ситуацию, конкурентов, целевую аудиторию. Разрабатываем стратегию продвижения с KPI." },
    { num: "02", title: "Настройка и запуск", desc: "Создаём рекламные кампании, настраиваем таргетинги, подключаем аналитику и коллтрекинг." },
    { num: "03", title: "Оптимизация", desc: "A/B тесты креативов и посадочных, перераспределение бюджета на эффективные связки, минус-слова." },
    { num: "04", title: "Масштабирование", desc: "Увеличиваем бюджет на работающих связках, подключаем новые каналы, расширяем географию." },
    { num: "05", title: "Отчётность", desc: "Еженедельные отчёты с метриками, рекомендациями и планом действий. Полная прозрачность расходов." },
  ];

  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
        Как мы работаем
      </h2>
      <div className="mt-8 md:mt-12">
        {steps.map((step, i) => (
          <AnimatedBlock key={step.num} delay={i * 100}>
            <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-[1fr_2fr] md:py-8" style={{ borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-baseline gap-3">
                <span className="font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>{step.num}</span>
                <h3 className="font-body text-sm font-semibold leading-snug md:text-base" style={{ color: "var(--text)" }}>{step.title}</h3>
              </div>
              <p className="font-body text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>{step.desc}</p>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg-secondary, var(--bg))", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>FAQ</h2>
      <div className="mt-8 md:mt-12" style={{ borderTop: "1px solid var(--border)" }}>
        {FAQ_ITEMS.map((item, i) => <FaqItem key={i} item={item} index={i} />)}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
          Начать продвижение
        </h2>
        <p className="font-body mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
          Проведём аудит текущей рекламы, предложим стратегию и рассчитаем прогноз
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/brief?source=advertising"
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

export function AdvertisingContent() {
  return (
    <article>
      <HeroSection />
      <ChannelsSection />
      <DashboardSection />
      <CasesSection />
      <PackagesSection />
      <ProcessSection />
      <FaqSection />
      <CtaSection />
    </article>
  );
}
