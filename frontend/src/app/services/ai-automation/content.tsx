"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, Bot, Brain, BarChart3, MessageSquare, Eye, Zap, Settings, TrendingUp } from "lucide-react";
/* ─── NEURAL NETWORK CANVAS ─── */

interface Node { x: number; y: number; r: number; pulse: number; speed: number }
interface Edge { from: number; to: number; progress: number; speed: number; active: boolean }

function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
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
      if (!initRef.current) initNetwork();
    };

    const initNetwork = () => {
      initRef.current = true;
      const layers = [4, 6, 8, 6, 4];
      const nodes: Node[] = [];
      const edges: Edge[] = [];
      const layerGap = W / (layers.length + 1);

      layers.forEach((count, li) => {
        const x = layerGap * (li + 1);
        const nodeGap = H / (count + 1);
        for (let ni = 0; ni < count; ni++) {
          nodes.push({
            x: x + (Math.random() - 0.5) * 20,
            y: nodeGap * (ni + 1) + (Math.random() - 0.5) * 15,
            r: 2 + Math.random() * 2,
            pulse: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.02,
          });
        }
      });

      let offset = 0;
      for (let li = 0; li < layers.length - 1; li++) {
        const fromStart = offset;
        const fromEnd = offset + layers[li];
        const toStart = fromEnd;
        const toEnd = toStart + layers[li + 1];
        for (let fi = fromStart; fi < fromEnd; fi++) {
          for (let ti = toStart; ti < toEnd; ti++) {
            if (Math.random() > 0.45) {
              edges.push({ from: fi, to: ti, progress: Math.random(), speed: 0.002 + Math.random() * 0.004, active: Math.random() > 0.6 });
            }
          }
        }
        offset += layers[li];
      }

      nodesRef.current = nodes;
      edgesRef.current = edges;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isDark = () => {
        const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
        return bg === "#0A0A0A" || bg === "#0a0a0a" || bg.includes("10,10,10");
      };
      const dark = isDark();
      const baseColor = dark ? "255,255,255" : "0,0,0";

      edges.forEach((e) => {
        const n1 = nodes[e.from];
        const n2 = nodes[e.to];
        if (!n1 || !n2) return;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = `rgba(${baseColor},0.06)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        if (e.active) {
          e.progress += e.speed;
          if (e.progress > 1) { e.progress = 0; e.active = Math.random() > 0.3; }
          const px = n1.x + (n2.x - n1.x) * e.progress;
          const py = n1.y + (n2.y - n1.y) * e.progress;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${baseColor},0.3)`;
          ctx.fill();
        } else {
          if (Math.random() > 0.998) e.active = true;
        }
      });

      nodes.forEach((n) => {
        n.pulse += n.speed;
        const pulseFactor = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(n.pulse));
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = dist < 150 ? 1 - dist / 150 : 0;
        const r = n.r * (1 + proximity * 0.8);
        const alpha = 0.15 + pulseFactor * 0.25 + proximity * 0.4;

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor},${alpha})`;
        ctx.fill();

        if (proximity > 0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 4 + proximity * 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${baseColor},${proximity * 0.06})`;
          ctx.fill();
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

/* ─── COUNTER ─── */

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
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

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── TYPING EFFECT ─── */

function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, 30);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(timer);
  }, [started, text, delay]);

  return (
    <span ref={ref}>
      {displayed}
      {displayed.length < text.length && started && (
        <span className="inline-block w-[2px] h-[1em] ml-0.5 animate-pulse" style={{ backgroundColor: "var(--text)" }} />
      )}
    </span>
  );
}

/* ─── DATA ─── */

const SCENARIOS = [
  { icon: MessageSquare, title: "Поддержка клиентов", desc: "AI-бот обрабатывает до 80% типовых обращений, маршрутизирует сложные кейсы оператору.", tags: ["GPT-4", "Telegram", "WhatsApp"] },
  { icon: Brain, title: "Генерация контента", desc: "Тексты, посты, описания товаров, email-рассылки — по вашему tone of voice и регламентам.", tags: ["Claude", "LangChain", "RAG"] },
  { icon: BarChart3, title: "Аналитика данных", desc: "Предиктивные модели, кластеризация клиентов, прогноз спроса и выручки.", tags: ["Python", "ML", "BI"] },
  { icon: TrendingUp, title: "Автоматизация продаж", desc: "Скоринг лидов, автоматическая квалификация, персонализированные предложения.", tags: ["CRM", "RPA", "Monday.com"] },
  { icon: Eye, title: "Компьютерное зрение", desc: "Распознавание документов, контроль качества на производстве, подсчёт объектов.", tags: ["OpenCV", "YOLO", "OCR"] },
  { icon: Settings, title: "Процессная автоматизация", desc: "RPA-роботы для рутинных операций: сбор данных, заполнение форм, синхронизация систем 24/7.", tags: ["RPA", "API", "Webhooks"] },
];

const BEFORE_AFTER = [
  { metric: "Обработка заявок", before: "4 часа", after: "12 минут", improvement: "-95%" },
  { metric: "Ошибки в отчётах", before: "15/мес", after: "0", improvement: "-100%" },
  { metric: "Стоимость поддержки", before: "450 000 ₽", after: "120 000 ₽", improvement: "-73%" },
  { metric: "Время на рутину", before: "40 ч/нед", after: "8 ч/нед", improvement: "-80%" },
];

const PIPELINE_STEPS = [
  { num: "01", title: "Данные", desc: "Сбор и подготовка данных из ваших систем: CRM, почта, 1С, базы данных" },
  { num: "02", title: "Обработка", desc: "Очистка, нормализация, обогащение данных для модели" },
  { num: "03", title: "Модель", desc: "Обучение или настройка AI-модели под вашу задачу" },
  { num: "04", title: "Результат", desc: "Ответы, предсказания, классификация, генерация" },
  { num: "05", title: "Действие", desc: "Автоматическое выполнение: отправка, обновление, уведомление" },
];

const INTEGRATIONS = [
  "OpenAI", "Anthropic", "Monday.com", "Telegram Bot API", "WhatsApp Business",
  "1С", "Bitrix24", "AmoCRM", "Google Sheets", "Notion",
  "Slack", "PostgreSQL", "REST API", "Webhooks", "n8n",
];

const FAQ_ITEMS = [
  { q: "Зачем Monday.com, если есть таблицы и мессенджер?", a: "Единая точка правды: статусы задач, сроки, ответственные и отчёты видны всем. Меньше «потерянных» поручений и ручного сбора статусов в чатах." },
  { q: "Что такое AI-сотрудник?", a: "Настраиваемый ассистент под ваши процессы: отвечает по базе знаний, классифицирует обращения, черновики писем и отчётов. Работает в рамках политики безопасности и согласованных каналов." },
  { q: "Можно ли автоматизировать без замены систем?", a: "Да. Часто достаточно связать Monday.com, почту и CRM через интеграции и webhooks, а рутину отдать роботам. Полную замену ПО не навязываем." },
  { q: "Сколько длится внедрение?", a: "Пилот по одному направлению — от 2-3 недель. Масштабирование согласуем по дорожной карте после discovery." },
  { q: "Безопасность данных?", a: "Все сценарии разворачиваются с учётом ваших политик безопасности. Данные не уходят в открытые API без вашего согласия. Возможен self-hosted деплой." },
  { q: "Какой бюджет нужен для старта?", a: "Пилотный проект (1 сценарий автоматизации или AI-ассистент) — от 150 000 ₽. Масштабирование — по дорожной карте после оценки пилота." },
];

/* ─── CHAT DEMO ─── */

const CHAT_MESSAGES = [
  { role: "user" as const, text: "Сколько заявок пришло вчера?" },
  { role: "ai" as const, text: "Вчера поступило 47 заявок. Из них 32 квалифицированные (68%). Среднее время ответа — 4 минуты. Топ-канал: Telegram (21 заявка)." },
  { role: "user" as const, text: "Сравни с прошлой неделей" },
  { role: "ai" as const, text: "Рост +23% к среднему за прошлую неделю (38 заявок/день). Конверсия в квалификацию выросла с 61% до 68%. Рекомендую усилить бюджет на Telegram — он даёт лучший CPL." },
];

function ChatDemo() {
  const [messages, setMessages] = useState<typeof CHAT_MESSAGES>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        addNext(0);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNext = (idx: number) => {
    if (idx >= CHAT_MESSAGES.length) return;
    const msg = CHAT_MESSAGES[idx];
    if (msg.role === "ai") setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, msg]);
      setCurrentIdx(idx + 1);
      setTimeout(() => addNext(idx + 1), msg.role === "user" ? 800 : 1500);
    }, msg.role === "ai" ? 1800 : 500);
  };

  return (
    <div ref={ref} className="flex flex-col gap-3" style={{ minHeight: 220 }}>
      {messages.map((m, i) => (
        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-[85%] px-4 py-3 text-xs leading-relaxed font-body ${m.role === "user" ? "rounded-tl-lg rounded-bl-lg rounded-tr-sm" : "rounded-tr-lg rounded-br-lg rounded-tl-sm"}`}
            style={{
              backgroundColor: m.role === "user" ? "var(--text)" : "color-mix(in srgb, var(--text) 8%, transparent)",
              color: m.role === "user" ? "var(--bg)" : "var(--text)",
              border: m.role === "ai" ? "1px solid var(--border)" : "none",
            }}
          >
            {m.role === "ai" && (
              <span className="flex items-center gap-1.5 mb-1.5 font-matrix text-[9px] uppercase tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>
                <Bot size={10} /> AI-ассистент
              </span>
            )}
            {m.text}
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <div className="px-4 py-3 rounded-tr-lg rounded-br-lg rounded-tl-sm" style={{ border: "1px solid var(--border)" }}>
            <span className="flex items-center gap-1.5 font-matrix text-[9px] uppercase tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>
              <Bot size={10} className="animate-pulse" /> печатает...
            </span>
          </div>
        </div>
      )}
      {currentIdx >= CHAT_MESSAGES.length && messages.length > 0 && (
        <p className="font-matrix text-[9px] uppercase tracking-[0.15em] text-center mt-2" style={{ color: "var(--text-subtle)" }}>
          Демо · реальный AI-ассистент настраивается под ваш бизнес
        </p>
      )}
    </div>
  );
}

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
      <NeuralNetworkCanvas />
      <div className="pointer-events-none absolute inset-0 z-[3] mix-blend-overlay" style={{ opacity: 0.06 }}>
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="ai-grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#ai-grain)" />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-[90vh] flex-col justify-center px-4 py-20 md:px-8 lg:px-16">
        <p className="font-matrix text-[10px] uppercase tracking-[0.4em] md:text-xs" style={{ color: "var(--text-muted)" }}>
          ИИ-решения
        </p>
        <h1 className="mt-4 max-w-4xl font-heading text-xl leading-[1.1] tracking-tight sm:text-2xl md:text-3xl lg:text-[2rem]" style={{ color: "var(--text)" }}>
          AI-сотрудники, автоматизация и нейросети для бизнеса
        </h1>
        <p className="font-body mt-6 max-w-2xl text-base leading-relaxed md:mt-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
          Внедряем искусственный интеллект в ваши процессы: от чат-ботов до предиктивной аналитики. Меньше рутины, быстрее результат, точнее решения.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/brief?source=ai-automation"
            className="group flex items-center gap-3 px-8 py-4 font-matrix text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:gap-5"
            style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
          >
            Обсудить проект <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="font-body mt-4 text-xs md:text-sm" style={{ color: "var(--text-subtle)" }}>
          Бесплатно проведём discovery-сессию и покажем, что можно автоматизировать
        </p>

        <div className="mt-16 grid grid-cols-2 gap-px sm:grid-cols-4 md:mt-20" style={{ borderTop: "1px solid var(--border)" }}>
          {[
            { val: "80%", label: "рутины можно автоматизировать" },
            { val: "x3", label: "скорость обработки заявок" },
            { val: "−73%", label: "снижение операционных затрат" },
            { val: "24/7", label: "работа без перерывов" },
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

function ScenariosSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
        Сценарии использования
      </h2>
      <p className="font-body mt-3 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
        Подберём и настроим решение под вашу задачу
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
        {SCENARIOS.map((item, i) => (
          <AnimatedBlock key={item.title} delay={i * 80}>
            <div className="group flex h-full flex-col p-6 md:p-8 transition-colors duration-300" style={{ border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-3 mb-4">
                <item.icon size={18} style={{ color: "var(--text-muted)" }} className="transition-colors group-hover:text-[var(--text)]" />
                <span className="font-matrix text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--text-subtle)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-body text-sm font-semibold leading-snug md:text-base" style={{ color: "var(--text)" }}>
                {item.title}
              </h3>
              <p className="font-body mt-3 flex-1 text-xs leading-relaxed md:text-sm" style={{ color: "var(--text-muted)" }}>
                {item.desc}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
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

function ChatDemoSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg-secondary, var(--bg))", borderTop: "1px solid var(--border)" }}>
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
            AI-ассистент в деле
          </h2>
          <p className="font-body mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
            Так выглядит работа цифрового сотрудника: мгновенные ответы на основе ваших данных, аналитика и рекомендации в реальном времени.
          </p>
          <p className="font-body mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
            Ассистент обучается на вашей базе знаний, регламентах и истории обращений. Работает в Telegram, WhatsApp, на сайте или внутри CRM.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Telegram", "WhatsApp", "Сайт", "CRM", "Email"].map((ch) => (
              <span key={ch} className="font-matrix px-3 py-1.5 text-[10px] uppercase tracking-[0.12em]"
                style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                {ch}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 md:p-6" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg)" }}>
          <div className="flex items-center gap-2 pb-4 mb-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <Bot size={14} style={{ color: "var(--text-muted)" }} />
            <span className="font-matrix text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-muted)" }}>
              AI-ассистент · демо
            </span>
          </div>
          <ChatDemo />
        </div>
      </div>
    </section>
  );
}

function BeforeAfterSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
        До и после внедрения AI
      </h2>
      <div className="mt-8 md:mt-12" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 py-4 md:py-5">
          <span className="font-matrix text-[9px] uppercase tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>Метрика</span>
          <span className="font-matrix text-[9px] uppercase tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>Было</span>
          <span className="font-matrix text-[9px] uppercase tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>Стало</span>
          <span className="font-matrix text-[9px] uppercase tracking-[0.15em] hidden sm:block" style={{ color: "var(--text-subtle)" }}>Эффект</span>
        </div>
        {BEFORE_AFTER.map((row, i) => (
          <AnimatedBlock key={row.metric} delay={i * 100}>
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-center gap-4 py-4 md:py-5" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="font-body text-xs font-semibold md:text-sm" style={{ color: "var(--text)" }}>{row.metric}</p>
              <p className="font-matrix text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>{row.before}</p>
              <p className="font-matrix text-xs tabular-nums font-bold" style={{ color: "var(--text)" }}>{row.after}</p>
              <span className="hidden sm:inline-block font-matrix px-2 py-1 text-[10px] uppercase tracking-[0.1em]"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
                {row.improvement}
              </span>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function PipelineSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg-secondary, var(--bg))", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
        Как работает AI-pipeline
      </h2>
      <p className="font-body mt-3 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
        От сырых данных до конкретного действия — каждый этап прозрачен
      </p>
      <div className="mt-8 md:mt-12">
        <div className="relative">
          <div className="absolute left-[11px] top-0 bottom-0 w-px hidden md:block" style={{ backgroundColor: "var(--border)" }} />
          {PIPELINE_STEPS.map((step, i) => (
            <AnimatedBlock key={step.num} delay={i * 120}>
              <div className="flex gap-6 py-6 md:py-8" style={{ borderBottom: "1px solid var(--border)" }}>
                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center"
                  style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)" }}>
                  <span className="font-matrix text-[8px] tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>
                    {step.num}
                  </span>
                </div>
                <div>
                  <h3 className="font-body text-sm font-semibold md:text-base" style={{ color: "var(--text)" }}>{step.title}</h3>
                  <p className="font-body mt-2 text-xs leading-relaxed md:text-sm" style={{ color: "var(--text-muted)" }}>{step.desc}</p>
                </div>
              </div>
            </AnimatedBlock>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntegrationsSection() {
  return (
    <section className="px-4 py-10 md:py-16 overflow-hidden" style={{ backgroundColor: "var(--bg-secondary, var(--bg))", borderTop: "1px solid var(--border)" }}>
      <p className="font-matrix text-[10px] uppercase tracking-[0.2em] text-center mb-6" style={{ color: "var(--text-subtle)" }}>
        Интеграции
      </p>
      <div className="relative">
        <div className="flex gap-8 animate-[marquee-left_30s_linear_infinite]">
          {[...INTEGRATIONS, ...INTEGRATIONS].map((name, i) => (
            <span key={`${name}-${i}`} className="shrink-0 font-matrix text-xs uppercase tracking-[0.15em] whitespace-nowrap"
              style={{ color: "var(--text-muted)" }}>
              {name}
            </span>
          ))}
        </div>
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
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
          Обсудить внедрение AI
        </h2>
        <p className="font-body mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
          Проведём discovery-сессию и предложим план автоматизации под ваши процессы
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/brief?source=ai-automation"
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

export function AiAutomationContent() {
  return (
    <article>
      <HeroSection />
      <ScenariosSection />
      <ChatDemoSection />
      <BeforeAfterSection />
      <PipelineSection />
      <IntegrationsSection />
      <FaqSection />
      <CtaSection />
    </article>
  );
}
