"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  GitBranch,
  Rocket,
  Link2,
  FileCode2,
  Cpu,
  CheckCircle2,
} from "lucide-react";

const SCOPE = [
  {
    title: "Токены и экономика",
    desc: "ERC-20 / ERC-721 / ERC-1155, вестинг, казна, минт и сжигание — с прозрачной моделью для пользователей.",
    icon: Link2,
  },
  {
    title: "DeFi и хранение средств",
    desc: "Пулы, стейкинг, эскроу и мультисиг: логика выплат, ограничения и события для офчейн-индексации.",
    icon: Shield,
  },
  {
    title: "DAO и голосование",
    desc: "Снимки балансов, кворумы, делегирование и исполнение решений on-chain с понятным UX.",
    icon: Cpu,
  },
  {
    title: "Интеграция с продуктом",
    desc: "Связка контрактов с фронтом, бэкендом и кошельками: подписи, gasless-флоу где уместно.",
    icon: GitBranch,
  },
] as const;

const STACK = [
  "Solidity",
  "Hardhat",
  "Foundry",
  "OpenZeppelin",
  "ethers.js / viem",
  "The Graph",
  "IPFS",
] as const;

const STEPS = [
  { n: "01", title: "Спецификация", body: "Фиксируем сценарии, роли, угрозы и критерии приёмки — до первой строки кода." },
  { n: "02", title: "Разработка и тесты", body: "Юнит- и интеграционные тесты, форки mainnet, сценарии edge-case." },
  { n: "03", title: "Деплой и верификация", body: "Публикация в выбранных сетях, верификация исходников, мониторинг событий." },
  { n: "04", title: "Сопровождение", body: "Патчи, апгрейды через прокси при необходимости, консультации по эксплуатации." },
] as const;

const SECURITY = [
  "Чек-лист уязвимостей и контроль прав доступа (роли, Ownable, timelock).",
  "Ограничение внешних вызовов и защита от реентерабельности там, где это критично.",
  "Рекомендации по мультисигу, кастоди и процедурам обновления.",
];

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function SmartContractsContent() {
  return (
    <article className="overflow-x-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      {/* Hero */}
      <section className="relative min-h-[min(92vh,920px)] border-b" style={{ borderColor: "var(--border)" }}>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.9]"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 100% 70% at 50% -15%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 52%),
              radial-gradient(ellipse 50% 45% at 100% 15%, rgba(52, 211, 153, 0.07), transparent),
              radial-gradient(ellipse 45% 40% at 0% 60%, rgba(56, 189, 248, 0.06), transparent)
            `,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.28]"
          style={{
            backgroundImage: `
              linear-gradient(color-mix(in srgb, var(--text) 8%, transparent) 1px, transparent 1px),
              linear-gradient(90deg, color-mix(in srgb, var(--text) 8%, transparent) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-[min(92vh,920px)] max-w-[1200px] flex-col justify-center px-4 pb-20 pt-28 md:px-8 md:pb-28 md:pt-32 lg:px-12">
          <Reveal>
            <p
              className="font-matrix text-[10px] uppercase tracking-[0.42em] md:text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              Web3 · EVM
            </p>
            <h1 className="mt-5 max-w-[22ch] min-w-0 font-heading services-page-h1 tracking-tight md:max-w-[28ch]">
              Разработка смарт-контрактов
            </h1>
            <p className="font-body mt-6 max-w-2xl text-base leading-relaxed md:mt-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
              Проектируем и внедряем on-chain-логику под ваш продукт: от токеномики и эскроу до DAO и интеграции с веб-приложением — с упором на безопасность и ясность для аудитории.
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-10">
            <div
              className="max-w-xl rounded-2xl border px-4 py-3 font-mono text-[11px] leading-relaxed tracking-wide md:text-xs"
              style={{
                borderColor: "color-mix(in srgb, var(--accent) 35%, var(--border))",
                backgroundColor: "color-mix(in srgb, var(--bg-secondary) 92%, transparent)",
                color: "var(--text-subtle)",
              }}
            >
              <span style={{ color: "color-mix(in srgb, var(--accent) 80%, var(--text-muted))" }}>//</span> deploy trust, not hope
              <br />
              <span className="opacity-70">contract</span>{" "}
              <span style={{ color: "var(--text)" }}>BusinessLogic</span>
              <span className="opacity-70"> is </span>
              <span style={{ color: "color-mix(in srgb, var(--accent) 90%, var(--text))" }}>Audited</span>
              <span className="opacity-70">, </span>
              <span style={{ color: "var(--text)" }}>Immutable</span>
              <span className="opacity-70">, </span>
              <span style={{ color: "var(--text)" }}>Observable</span>
              <span className="opacity-70"> {"{}"}</span>
            </div>
          </Reveal>

          <Reveal delay={140} className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/brief?source=smart-contracts"
              className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-matrix text-xs uppercase tracking-[0.18em] transition-all hover:gap-4"
              style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
            >
              Обсудить контракт
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/services/development"
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3.5 font-matrix text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-[color-mix(in_srgb,var(--text)_25%,var(--border))]"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              Связка с разработкой ПО
              <FileCode2 size={15} strokeWidth={1.5} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Scope grid */}
      <section className="border-b px-4 py-16 md:px-8 md:py-24 lg:px-12" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <h2 className="font-body max-w-xl text-xl font-semibold leading-snug tracking-tight md:text-2xl">
              Что закрываем on-chain
            </h2>
            <p className="font-body mt-3 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
              Подбираем архитектуру под задачу: не «контракт ради контракта», а понятная модель для пользователей и команды.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:gap-5">
            {SCOPE.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div
                  className="group h-full rounded-2xl border p-6 transition-colors md:p-8"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors group-hover:border-[color-mix(in_srgb,var(--accent)_40%,var(--border))]"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-muted)",
                        backgroundColor: "color-mix(in srgb, var(--bg-secondary) 80%, transparent)",
                      }}
                    >
                      <item.icon size={20} strokeWidth={1.35} aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-body text-sm font-semibold leading-snug md:text-base">{item.title}</h3>
                      <p className="font-body mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="border-b px-4 py-16 md:px-8 md:py-20 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl">Стек и инструменты</h2>
            <p className="font-body mt-2 max-w-xl text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
              Проверенные библиотеки, автоматизированные тесты и воспроизводимые сборки.
            </p>
          </Reveal>
          <Reveal className="mt-8 flex flex-wrap gap-2.5 md:gap-3" delay={80}>
            {STACK.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-4 py-2 font-matrix text-[10px] uppercase tracking-[0.14em] md:text-[11px]"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                  backgroundColor: "color-mix(in srgb, var(--bg-secondary) 70%, transparent)",
                }}
              >
                {tag}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="border-b px-4 py-16 md:px-8 md:py-24 lg:px-12" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl">Как ведём проект</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 70}>
                <div
                  className="h-full rounded-2xl border p-6 lg:p-7"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)" }}
                >
                  <span className="font-matrix text-[10px] tracking-[0.25em]" style={{ color: "var(--accent)" }}>
                    {step.n}
                  </span>
                  <h3 className="font-body mt-3 text-sm font-semibold md:text-base">{step.title}</h3>
                  <p className="font-body mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="px-4 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <Reveal>
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl border"
                style={{ borderColor: "var(--border)", color: "var(--accent)" }}
              >
                <Shield size={22} strokeWidth={1.35} aria-hidden />
              </span>
              <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl">Безопасность</h2>
            </div>
            <p className="font-body mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
              Смарт-контракт нельзя «запатчить» как сервер: ошибки дорого стоят. Мы закладываем проверки на этапе дизайна и кода; при необходимости подключаем партнёрский аудит перед mainnet.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ul className="space-y-4">
              {SECURITY.map((line) => (
                <li key={line} className="flex gap-3 text-sm leading-relaxed md:text-base">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "color-mix(in srgb, var(--accent) 85%, var(--text))" }} aria-hidden />
                  <span style={{ color: "var(--text-muted)" }}>{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* CTA band */}
      <section
        className="border-t px-4 py-16 md:px-8 md:py-20 lg:px-12"
        style={{
          borderColor: "var(--border)",
          background: `
            linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, var(--bg-secondary)) 0%, var(--bg) 48%, color-mix(in srgb, var(--accent) 8%, var(--bg)) 100%)
          `,
        }}
      >
        <Reveal>
          <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-8 rounded-3xl border p-8 md:flex-row md:items-center md:p-10 lg:p-12" style={{ borderColor: "var(--border)" }}>
            <div className="min-w-0">
              <div className="flex items-center gap-2 font-matrix text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--text-subtle)" }}>
                <Rocket size={14} className="shrink-0" aria-hidden />
                Запуск
              </div>
              <p className="font-body mt-3 max-w-xl text-lg font-medium leading-snug md:text-xl">
                Расскажите о сценарии — предложим архитектуру и оценку по срокам
              </p>
            </div>
            <Link
              href="/brief?source=smart-contracts"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full px-8 py-4 font-matrix text-xs uppercase tracking-[0.18em] transition-all hover:gap-4"
              style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
            >
              Оставить заявку
              <ArrowRight size={17} />
            </Link>
          </div>
        </Reveal>
      </section>
    </article>
  );
}
