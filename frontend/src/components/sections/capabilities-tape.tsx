"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme-context";
import { useStickyHeaderPinned } from "@/lib/use-sticky-header-pinned";
import { useIsDesktopLg } from "@/lib/use-is-desktop-lg";
import { PinnedCodeTypist } from "@/components/ui/pinned-code-typist";
import {
  TAPE_CELL_EASE,
  darkTitleCharShadow,
  darkTitleFilter,
  lightNeonFilter,
  lightNeonTitleChar,
} from "@/lib/tape-hover-visual";

interface TapeItem {
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  href: string;
  image: string | null;
  video: string | null;
  effect?: "code-rain" | null;
  /** Короткая строка — появляется при наведении вместе с тегами */
  hoverLine: string;
}

const V = "/videos/capabilities";

const I: Record<string, TapeItem> = {
  web:       { title: "Веб-сервисы",          subtitle: "Full stack",     desc: "Сайты, лендинги, порталы и SaaS-платформы. React, Next.js, Node — полный цикл от прототипа до продакшена.", tags: ["React", "Next.js", "Node"], href: "/services/development", image: null, video: `${V}/hover-web.mp4`, hoverLine: "От лендинга до SaaS — один контур разработки." },
  mobile:    { title: "Мобильные\nприложения", subtitle: "iOS · Android",  desc: "Нативные и кроссплатформенные приложения. Flutter, React Native, Swift — публикация в сторы.", tags: ["Flutter", "React Native", "Swift"], href: "/expertise/mobile-apps", image: null, video: `${V}/hover-mobile.mp4`, hoverLine: "Публикация в сторы и обновления без сюрпризов." },
  corp:      { title: "Корпоративный софт",   subtitle: "CRM · ERP",      desc: "Внутренние системы автоматизации: CRM, ERP, склад, документооборот. Интеграция с 1С и SAP.", tags: ["CRM", "ERP", "1С"], href: "/expertise/corporate-systems", image: null, video: `${V}/hover-corp.mp4`, hoverLine: "Процессы и данные в одной цифровой петле." },
  ai:        { title: "AI и автоматизация",   subtitle: "ML · GPT",       desc: "Чат-боты, рекомендательные системы, компьютерное зрение, генерация контента и предиктивная аналитика.", tags: ["GPT", "ML", "CV"], href: "/services/ai-automation", image: null, video: `${V}/hover-ai.mp4`, hoverLine: "Модели под ваши данные и сценарии, не наоборот." },
  design:    { title: "Продукт и\nдизайн",     subtitle: "UX / UI",        desc: "Исследования, прототипы, дизайн-системы, анимации. Figma → код без потерь.", tags: ["Figma", "UX", "Motion"], href: "/services/ux-ui-design", image: null, video: `${V}/hover-design.mp4`, hoverLine: "Из Figma — в пиксельно точный фронт." },
  /** Вторая ячейка «Продукт и дизайн» в ленте — отдельное hover-видео */
  designB:   { title: "Продукт и\nдизайн",     subtitle: "UX / UI",        desc: "Исследования, прототипы, дизайн-системы, анимации. Figma → код без потерь.", tags: ["Figma", "UX", "Motion"], href: "/services/ux-ui-design", image: null, video: `${V}/hover-design-alt.mp4`, hoverLine: "Дизайн-система, которую не стыдно масштабировать." },
  ads:       { title: "Реклама и\nрост",        subtitle: "Performance",    desc: "Таргет, контекст, SEO, SMM. Стратегия роста, A/B тесты, сквозная аналитика.", tags: ["SEO", "Таргет", "A/B"], href: "/services/advertising", image: null, video: `${V}/hover-ads.mp4`, hoverLine: "Рост измеряем цифрами, не ощущениями." },
  analytics: { title: "Аналитика",            subtitle: "Данные · BI",    desc: "Дашборды, ETL-пайплайны, BI-отчёты. Визуализация данных для принятия решений.", tags: ["BI", "SQL", "Dashboards"], href: "/expertise/analytics-bi", image: null, video: `${V}/hover-analytics.mp4`, hoverLine: "Отчёты, которые закрывают споры за столом." },
  devops:    { title: "DevOps",               subtitle: "CI / CD",        desc: "Инфраструктура как код, контейнеризация, мониторинг. AWS, GCP, Yandex Cloud.", tags: ["Docker", "K8s", "AWS"], href: "/expertise/devops", image: null, video: `${V}/hover-devops.mp4`, hoverLine: "Деплой по кнопке — ночной дежурный не обязателен." },
  support:   { title: "Поддержка",            subtitle: "24 / 7",         desc: "Техническая поддержка, SLA, мониторинг, быстрое реагирование на инциденты.", tags: ["SLA", "Monitoring", "Support"], href: "/expertise/support-sla", image: null, video: `${V}/hover-support.mp4`, hoverLine: "SLA живёт в тикетах, не только в договоре." },
  consult:   { title: "Консалтинг",           subtitle: "Стратегия",      desc: "Аудит IT-инфраструктуры, выбор стека, архитектура решений, roadmap продукта.", tags: ["Аудит", "Архитектура", "Roadmap"], href: "/services/preproject-research", image: null, video: `${V}/hover-consult.mp4`, hoverLine: "Архитектура и дорожная карта до первой строки кода." },
  ecom:      { title: "E-commerce",           subtitle: "Магазины",       desc: "Интернет-магазины, маркетплейсы, платёжные системы, склад и логистика.", tags: ["Shopify", "WooCommerce", "API"], href: "/expertise/ecommerce", image: null, video: `${V}/hover-ecom.mp4`, hoverLine: "Корзина, оплата и склад — в одной цепочке." },
  integr:    { title: "Интеграции",           subtitle: "API · CRM",      desc: "Связываем любые системы: API, вебхуки, очереди сообщений, синхронизация данных.", tags: ["REST", "GraphQL", "Webhooks"], href: "/expertise/integrations", image: null, video: `${V}/hover-integr.mp4`, hoverLine: "Сервисы говорят друг с другом — без ручного копипаста." },
  security:  { title: "Безопасность",         subtitle: "Аудит",          desc: "Пентесты, аудит кода, защита данных, соответствие 152-ФЗ и GDPR.", tags: ["Pentest", "GDPR", "152-ФЗ"], href: "/expertise/security-compliance", image: null, video: `${V}/hover-security.mp4`, hoverLine: "152-ФЗ и GDPR — в чек-листах, не в панике." },
  mvp:       { title: "MVP за 2 нед.",        subtitle: "Быстрый старт",  desc: "Минимальный жизнеспособный продукт за 2 недели. Валидация гипотез без лишних затрат.", tags: ["Sprint", "Lean", "Prototype"], href: "/expertise/mvp-sprint", image: null, video: `${V}/hover-mvp.mp4`, hoverLine: "Две недели до первого «вау» от пользователя." },
  turnkey:   { title: "Под ключ",             subtitle: "Всё включено",   desc: "От идеи до запуска: аналитика, дизайн, разработка, тесты, деплой, поддержка.", tags: ["Full cycle", "PM", "Launch"], href: "/expertise/turnkey", image: null, video: `${V}/hover-turnkey.mp4`, hoverLine: "Идея → прод: один подрядчик, одна ответственность." },
};

interface Column {
  width: number;
  speed: number;
  items: { item: TapeItem }[];
}

const COLUMNS: Column[] = [
  {
    width: 1,
    speed: 0.6,
    items: [
      { item: I.web },
      { item: I.support },
      { item: I.ecom },
      { item: I.mvp },
    ],
  },
  {
    width: 1.6,
    speed: 1.0,
    items: [
      { item: I.mobile },
      { item: I.ai },
      { item: I.consult },
      { item: I.security },
    ],
  },
  {
    width: 1.8,
    speed: 0.75,
    items: [
      { item: I.design },
      { item: I.devops },
      { item: I.integr },
      { item: I.turnkey },
    ],
  },
  {
    width: 1.2,
    speed: 1.15,
    items: [
      { item: I.corp },
      { item: I.analytics },
      { item: I.ads },
      { item: I.designB },
    ],
  },
];

const SECTION_HEIGHT_VH = 250;
const GAP = 4;

function flattenTapeItemsUnique(columns: Column[]): TapeItem[] {
  const seen = new Set<string>();
  const out: TapeItem[] = [];
  for (const col of columns) {
    for (const { item } of col.items) {
      const key = `${item.title}|${item.hoverLine}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

function TapeStackCard(item: TapeItem) {
  const titleLines = item.title.split("\n");
  return (
    <Link
      href={item.href}
      data-cursor-word="смотреть"
      className="block border-b px-4 py-5 transition-opacity active:opacity-90 last:border-b-0"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
    >
      <p
        className="font-matrix text-[10px] uppercase tracking-[0.22em]"
        style={{ color: "var(--text-muted)" }}
      >
        {item.subtitle}
      </p>
      <h3
        className="font-akony mt-2 text-[0.95rem] uppercase leading-snug tracking-[0.06em] sm:text-[1.05rem] sm:leading-tight sm:tracking-[0.07em] md:text-lg"
        style={{ color: "var(--text)" }}
      >
        {titleLines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h3>
      <p
        className="mt-3 font-body text-xs leading-relaxed sm:text-[13px]"
        style={{ color: "var(--text-muted)" }}
      >
        {item.desc}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded border px-2.5 py-1 font-matrix text-[9px] uppercase tracking-[0.14em]"
            style={{
              borderColor: "var(--border)",
              color: "var(--text)",
              backgroundColor: "color-mix(in srgb, var(--text) 6%, transparent)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <p
        className="mt-3 font-matrix text-[10px] leading-snug tracking-[0.06em]"
        style={{ color: "var(--text-subtle)" }}
      >
        {item.hoverLine}
      </p>
    </Link>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

const CODE_LINES = [
  'import React, { useState, useEffect } from "react";',
  "const [data, setData] = useState<Item[]>([]);",
  "export default function App() { return <Main />; }",
  "async function fetchAPI(url: string) {",
  '  const res = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });',
  "  if (!res.ok) throw new Error(res.statusText);",
  "  return res.json();",
  "}",
  "useEffect(() => { loadData().then(setItems); }, []);",
  "struct ContentView: View { var body: some View { NavigationStack { List(items) { item in Text(item.title) } } } }",
  "func application(_ app: UIApplication, didFinishLaunchingWithOptions opts: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {",
  "  window?.rootViewController = UIHostingController(rootView: ContentView())",
  "  return true",
  "}",
  "@Observable class DataStore { var items: [Item] = []; var isLoading = false; func load() async throws { } }",
  "class MainActivity : ComponentActivity() { override fun onCreate(s: Bundle?) { super.onCreate(s); setContent { AppTheme { Surface { Screen() } } } } }",
  'const styles = StyleSheet.create({ container: { flex: 1, padding: 16, backgroundColor: "#0a0a0a" } });',
  "SELECT users.id, users.name, COUNT(orders.id) AS total FROM users LEFT JOIN orders ON users.id = orders.user_id GROUP BY users.id;",
  "docker compose up -d --build && kubectl apply -f k8s/deployment.yaml && helm upgrade --install app ./chart",
  "git push origin main && gh pr create --title 'feat: new module' --body 'Adds API integration'",
  "npm run build && pm2 restart all --update-env",
  "export const config = { api: { bodyParser: false }, runtime: 'edge' };",
  "const handler = NextAuth({ providers: [Google({ clientId, clientSecret })], callbacks: { session: async ({ session }) => session } });",
  "app.post('/api/webhook', express.raw({ type: '*/*' }), (req, res) => { verify(req.body, sig); res.sendStatus(200); });",
  "CREATE TABLE projects (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT NOW());",
  "pipeline { agent any; stages { stage('Build') { steps { sh 'npm ci && npm run build' } } stage('Deploy') { steps { sh './deploy.sh' } } } }",
  "const observer = new IntersectionObserver((entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')));",
  "addEventListener('fetch', event => event.respondWith(handleRequest(event.request)));",
  "model User { id Int @id @default(autoincrement()) email String @unique name String? posts Post[] }",
  "FROM node:20-alpine AS builder WORKDIR /app COPY package*.json ./ RUN npm ci COPY . . RUN npm run build",
];

interface ScrollLine {
  text: string;
  y: number;
  x: number;
  speed: number;
  dir: 1 | -1;
  brightness: number;
}

function CodeRainOverlay({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const linesRef = useRef<ScrollLine[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!active) {
      cancelAnimationFrame(rafRef.current);
      linesRef.current = [];
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const FONT = 11;
    const LINE_H = FONT + 5;
    const rowCount = Math.ceil(H / LINE_H) + 1;

    if (linesRef.current.length === 0) {
      for (let i = 0; i < rowCount; i++) {
        const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
        const textIdx = i % CODE_LINES.length;
        const fullText = (CODE_LINES[textIdx] + "     ").repeat(6);
        linesRef.current.push({
          text: fullText,
          y: i * LINE_H,
          x: dir === 1 ? -Math.random() * 300 : Math.random() * 300,
          speed: 0.4 + Math.random() * 1.2,
          dir,
          brightness: 0.3 + Math.random() * 0.7,
        });
      }
    }

    const lines = linesRef.current;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, W, H);

      ctx.font = `${FONT}px "SF Mono","Fira Code","Cascadia Code",Consolas,monospace`;
      ctx.textBaseline = "top";

      for (const ln of lines) {
        const r = Math.floor(140 + ln.brightness * 115);
        const g = Math.floor(ln.brightness * 20);
        const b = Math.floor(ln.brightness * 15);
        ctx.fillStyle = `rgba(${r},${g},${b},${ln.brightness * 0.85})`;
        ctx.fillText(ln.text, ln.x, ln.y);

        ln.x += ln.speed * ln.dir;

        const textW = ctx.measureText(ln.text).width;
        if (ln.dir === 1 && ln.x > W) {
          ln.x = -textW;
        } else if (ln.dir === -1 && ln.x + textW < 0) {
          ln.x = W;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}

function TapeCell({
  title,
  subtitle,
  href,
  image,
  video,
  effect,
  tags,
  hoverLine,
  videosEnabled,
}: TapeItem & { videosEnabled: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const { isDark } = useTheme();
  const effectiveVideo = videosEnabled ? video : null;
  const hasMedia = !!(effectiveVideo || effect);
  const titleLines = title.split("\n");

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !effectiveVideo) return;
    if (hovered) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [hovered, effectiveVideo]);

  const ease = TAPE_CELL_EASE;

  return (
    <Link
      href={href}
      className="group relative flex shrink-0 flex-col overflow-hidden transition-colors"
      style={{ aspectRatio: "9 / 13", backgroundColor: "var(--bg-secondary)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Фон — изображение или градиент */}
      <div className="pointer-events-none absolute inset-0">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:opacity-70 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "radial-gradient(ellipse at 30% 25%, var(--text-subtle) 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, var(--text-subtle) 0%, transparent 45%)",
              opacity: 0.15,
            }}
          />
        )}
      </div>

      {/* Видео при наведении (только lg+) */}
      {effectiveVideo && (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <video
            ref={videoRef}
            src={effectiveVideo}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
          />
        </div>
      )}

      {/* Код-дождь при наведении */}
      {effect === "code-rain" && (
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <CodeRainOverlay active={hovered} />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3"
            style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
          />
        </div>
      )}

      {/* Текст на весь блок карточки: верх — линия + подзаголовок, центр — заголовок, низ — теги и строка */}
      <div
        className="absolute inset-0 z-30 flex flex-col justify-between gap-3 p-3 md:p-5"
        style={{
          transform: hovered && hasMedia ? "translateY(-2px)" : "translateY(0)",
          transition: `transform 0.45s ${ease}`,
        }}
      >
        <div className="shrink-0">
          <div
            className="mb-2 h-px w-full origin-left scale-x-0 rounded-full transition-transform duration-500"
            style={{
              background:
                "linear-gradient(90deg, color-mix(in srgb, var(--text) 65%, transparent), color-mix(in srgb, var(--text) 8%, transparent))",
              transform: hovered ? "scaleX(1)" : "scaleX(0)",
              transitionTimingFunction: ease,
            }}
          />
          <p
            className="font-matrix text-[8px] uppercase md:text-[9px]"
            style={{
              letterSpacing: hovered ? "0.28em" : "0.22em",
              color: hovered ? "var(--text)" : "var(--text-muted)",
              textShadow:
                !isDark ? "0 0 8px rgba(255,255,255,0.95), 0 0 16px rgba(255,255,255,0.35)" : undefined,
              transition: `letter-spacing 0.45s ${ease}, color 0.35s ease, text-shadow 0.35s ease`,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-center py-1">
          <h3
            className={`w-full text-center text-balance uppercase leading-[1.12] transition-all duration-500 ease-out ${
              hovered
                ? "font-blackops text-[clamp(0.9rem,4vmin,1.5rem)] tracking-[0.08em] md:text-[clamp(1rem,3.5vmin,1.75rem)] lg:text-[clamp(1.1rem,3vmin,2rem)]"
                : "font-matrix text-xs font-medium tracking-[0.04em] md:text-sm lg:text-base"
            }`}
            style={{
              color: "var(--text)",
              filter: isDark ? darkTitleFilter(hovered) : lightNeonFilter(hovered),
            }}
          >
            {(() => {
              let charIndex = 0;
              return titleLines.map((line, lineIdx) => (
                <span key={`${title}-L${lineIdx}`} className="block w-full">
                  {line.split("").map((ch, i) => {
                    const idx = charIndex++;
                    return (
                      <span
                        key={`${title}-${lineIdx}-${i}-${ch}`}
                        className="inline-block"
                        style={{
                          transform: hovered ? "translateY(-1px) scale(1.03)" : "translateY(0) scale(1)",
                          opacity: 1,
                          textShadow: isDark ? darkTitleCharShadow(hovered) : lightNeonTitleChar(hovered),
                          transition: `text-shadow 0.5s ${ease}, transform 0.45s ${ease}`,
                          transitionDelay: hovered ? `${20 + idx * 16}ms` : "0ms",
                        }}
                      >
                        {ch === " " ? "\u00a0" : ch}
                      </span>
                    );
                  })}
                </span>
              ));
            })()}
          </h3>
        </div>

        <div className="shrink-0">
          <div
            className="grid transition-[grid-template-rows] duration-500"
            style={{
              gridTemplateRows: hovered ? "1fr" : "0fr",
              transitionTimingFunction: ease,
            }}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-wrap gap-1.5" aria-hidden={!hovered}>
                {tags.map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className="font-matrix text-[7px] uppercase tracking-[0.12em] md:text-[8px]"
                    style={{
                      padding: "3px 7px",
                      borderRadius: "4px",
                      border: "1px solid var(--border)",
                      backgroundColor: "color-mix(in srgb, var(--text) 9%, transparent)",
                      color: "var(--text)",
                      boxShadow: !isDark ? "0 0 10px rgba(255,255,255,0.85), 0 0 20px rgba(255,255,255,0.35)" : undefined,
                      textShadow: !isDark ? "0 0 8px rgba(255,255,255,0.9)" : undefined,
                      transform: hovered ? "translateY(0)" : "translateY(14px)",
                      opacity: hovered ? 1 : 0,
                      transition: `transform 0.4s ${ease}, opacity 0.35s ease, box-shadow 0.35s ease, text-shadow 0.35s ease`,
                      transitionDelay: hovered ? `${85 + i * 40}ms` : `${(tags.length - 1 - i) * 30}ms`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p
                className="mt-2 max-w-full font-matrix text-[9px] leading-snug md:text-[10px]"
                style={{
                  color: "var(--text-muted)",
                  textShadow: !isDark ? "0 0 8px rgba(255,255,255,0.9), 0 0 16px rgba(255,255,255,0.35)" : undefined,
                  transform: hovered ? "translateY(0)" : "translateY(10px)",
                  opacity: hovered ? 1 : 0,
                  transition: `transform 0.45s ${ease}, opacity 0.4s ease, text-shadow 0.35s ease`,
                  transitionDelay: hovered ? `${100 + tags.length * 40}ms` : "0ms",
                }}
              >
                {hoverLine}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function TapeColumn({
  col,
  ci,
  progress,
  videosEnabled,
}: {
  col: Column;
  ci: number;
  progress: number;
  videosEnabled: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxTravel, setMaxTravel] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const content = contentRef.current;
    if (!wrap || !content) return;

    const measure = () => {
      const containerH = wrap.offsetHeight;
      const contentH = content.scrollHeight;
      setMaxTravel(Math.max(0, contentH - containerH));
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    ro.observe(content);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const y = -(progress * maxTravel * col.speed);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden"
      style={{
        flex: col.width,
        backgroundColor: "var(--bg)",
        borderRight: ci < COLUMNS.length - 1 ? `${GAP}px solid var(--border)` : undefined,
      }}
    >
      <div
        ref={contentRef}
        className="flex flex-col will-change-transform"
        style={{ transform: `translateY(${y}px)` }}
      >
        {col.items.map((cell, si) => (
          <div
            key={si}
            style={{ borderBottom: si < col.items.length - 1 ? `${GAP}px solid var(--border)` : undefined }}
          >
            <TapeCell {...cell.item} videosEnabled={videosEnabled} />
          </div>
        ))}
      </div>
    </div>
  );
}

const MOBILE_TAPE_ITEMS = flattenTapeItemsUnique(COLUMNS);

export function CapabilitiesTapeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const headerPinned = useStickyHeaderPinned(stickyHeaderRef);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(0);
  const videosEnabled = useIsDesktopLg();

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      setProgress(clamp(-rect.top / total, 0, 1));
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      data-cursor-word="смотреть"
      className="relative max-md:!h-auto max-md:min-h-0"
      style={{ height: `${SECTION_HEIGHT_VH}vh`, backgroundColor: "var(--bg)", color: "var(--text)" }}
      aria-label="Направления студии"
    >
      {/* Разделитель секции */}
      <div
        ref={stickyHeaderRef}
        className="sticky top-0 z-[40] flex items-center justify-between px-4 py-3 md:px-6 md:py-3.5"
        style={{ backgroundColor: "var(--bg)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex min-w-0 flex-wrap items-baseline gap-2 md:gap-4">
          <h2
            className="font-akony section-tape-heading uppercase leading-snug tracking-[0.12em]"
            style={{ color: "var(--text)" }}
          >
            Что умеем
          </h2>
          {videosEnabled && headerPinned ? (
            <PinnedCodeTypist text="// услуги: 15 направлений · full stack" charDelayMs={12} />
          ) : (
            <span
              className="max-w-[16rem] font-matrix text-[8px] uppercase leading-snug tracking-[0.22em] sm:max-w-none sm:text-[10px] sm:tracking-[0.28em] md:text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              15 направлений
            </span>
          )}
        </div>
        <p className="hidden font-matrix text-[10px] uppercase tracking-[0.2em] md:block" style={{ color: "var(--text-subtle)" }}>
          ↓
        </p>
      </div>

      <div className="border-t md:hidden" style={{ borderColor: "var(--border)" }}>
        {MOBILE_TAPE_ITEMS.map((item) => (
          <TapeStackCard key={`${item.title}|${item.hoverLine}`} {...item} />
        ))}
      </div>

      <div className="sticky top-0 hidden h-[100dvh] w-full overflow-hidden md:block">
        {/* Шероховатость / зерно */}
        <div className="pointer-events-none absolute inset-0 z-30 mix-blend-overlay" style={{ opacity: 0.15 }}>
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="tape-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#tape-grain)" />
          </svg>
        </div>

        {/* Верхний / нижний fade */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-20"
          style={{ background: "linear-gradient(to bottom, var(--bg), transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-24"
          style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
        />

        {/* Колонки */}
        <div
          className="relative z-10 flex h-full w-full"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {COLUMNS.map((col, ci) => (
            <TapeColumn key={ci} col={col} ci={ci} progress={progress} videosEnabled={videosEnabled} />
          ))}
        </div>
      </div>
    </section>
  );
}
