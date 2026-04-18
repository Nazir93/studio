"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import {
  PREPROJECT_WHY,
  PREPROJECT_PROCESS,
  PREPROJECT_WHEN,
  PREPROJECT_PROBLEMS,
  PREPROJECT_WORK_STAGES,
  PREPROJECT_DELIVERABLES,
  PREPROJECT_WHY_US_POINTS,
} from "@/lib/preproject-research-data";
const HERO_STATS = [
  { value: "25%", label: "Повышение эффективности" },
  { value: "5×", label: "Укрепление стабильности" },
] as const;

const SPRINT_STATS = [
  { value: "2–4 нед.", label: "Длительность спринта" },
  { value: "50%", label: "Сокращаются исправления" },
  { value: "10×", label: "Снижаются затраты на доработку" },
] as const;

export function PreprojectResearchContent() {
  return (
    <article style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      {/* Hero */}
      <section className="relative border-b px-4 py-14 md:px-8 md:py-20 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <filter id="pp-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#pp-grain)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-[900px]">
          <p className="font-matrix text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--text-muted)" }}>
            Об услуге
          </p>
          <h1 className="mt-3 font-heading services-page-h1 tracking-tight">
            Предпроектное исследование
          </h1>
          <p className="font-body mt-6 text-base leading-relaxed md:text-lg" style={{ color: "var(--text-muted)" }}>
            Разберёмся, как лучше реализовать вашу идею, что учесть на старте и как не выйти за рамки бюджета. Если у вас уже есть готовый продукт — подскажем, как сделать его лучше.
          </p>
          <Link
            href="/brief?source=preproject-research"
            className="mt-8 flex items-center gap-3 px-8 py-4 font-matrix text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
          >
            Обсудить проект
            <ArrowRight size={16} />
          </Link>

          <div className="mt-14 grid grid-cols-2 gap-6 border-t pt-10 md:gap-10" style={{ borderColor: "var(--border)" }}>
            {HERO_STATS.map((s) => (
              <div key={s.label}>
                <p className="font-body text-xl font-semibold tabular-nums tracking-tight sm:text-2xl md:text-3xl" style={{ color: "var(--text)" }}>
                  {s.value}
                </p>
                <p className="font-body mt-1 text-[10px] leading-relaxed md:text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Зачем проводить */}
      <section className="px-4 py-14 md:px-8 md:py-16 lg:px-12" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="mx-auto grid max-w-[1100px] gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl leading-snug">Зачем проводить</h2>
            <ul className="mt-6 space-y-3">
              {PREPROJECT_WHY.map((item) => (
                <li key={item} className="font-body flex gap-3 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
                  <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--text-subtle)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="font-body self-center text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
            Прототип, дорожная карта и реалистичный бюджет повышают шансы на финансирование и быстрое «да» от руководства. Всё это оформляется в{" "}
            <strong style={{ color: "var(--text)" }}>отчёт об обследовании</strong>, который понятен и бизнесу, и техдиректорам.
          </p>
        </div>
      </section>

      {/* Процесс (краткий) */}
      <section className="border-t px-4 py-14 md:px-8 md:py-16 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1100px]">
          <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl leading-snug">Процесс</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {PREPROJECT_PROCESS.map((step, i) => (
              <div key={step.title} className="border p-6 md:p-8" style={{ borderColor: "var(--border)" }}>
                <span className="font-matrix text-[10px] tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-matrix text-sm uppercase tracking-[0.12em]" style={{ color: "var(--text)" }}>
                  {step.title}
                </h3>
                <p className="font-body mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Когда нужно */}
      <section className="border-t px-4 py-14 md:px-8 md:py-16 lg:px-12" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-[1100px]">
          <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl leading-snug">
            Когда нужно проводить предпроектное исследование
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {PREPROJECT_WHEN.map((item) => (
              <li
                key={item}
                className="flex gap-2 border px-4 py-3 text-sm"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <span className="font-matrix text-[10px] leading-6" style={{ color: "var(--text-subtle)" }}>
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Проблемы discovery */}
      <section className="border-t px-4 py-14 md:px-8 md:py-16 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1100px]">
          <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl leading-snug">Проблемы, которые решает discovery</h2>
          <div className="mt-8 space-y-4">
            {PREPROJECT_PROBLEMS.map((p) => (
              <p
                key={p}
                className="border-l-2 pl-4 text-sm leading-relaxed md:text-base"
                style={{ borderColor: "var(--text-subtle)", color: "var(--text-muted)" }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Нулевой спринт */}
      <section className="border-t px-4 py-14 md:px-8 md:py-20 lg:px-12" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl leading-snug">Нулевой спринт</h2>
          <p className="font-body mx-auto mt-4 max-w-2xl text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
            Короткий, но насыщенный этап перед началом разработки. В процесс включается бизнес-аналитик, UX-дизайнер, архитектор и project-менеджер.
            Спринт длится <strong style={{ color: "var(--text)" }}>2–4 недели</strong>: вы знаете, что получите и сколько это будет стоить. За это время мы создаём{" "}
            <strong style={{ color: "var(--text)" }}>шесть ключевых артефактов</strong>, на которых можно уверенно строить проект.
          </p>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
            {SPRINT_STATS.map((s) => (
              <div key={s.label} className="border px-4 py-5" style={{ borderColor: "var(--border)" }}>
                <p className="font-body text-xl font-semibold tabular-nums tracking-tight sm:text-2xl md:text-3xl">{s.value}</p>
                <p className="font-body mt-2 text-[9px] leading-relaxed md:text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Этапы работы */}
      <section className="border-t px-4 py-14 md:px-8 md:py-20 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1000px]">
          <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl leading-snug">Этапы нашей работы</h2>
          <div className="mt-12 space-y-0">
            {PREPROJECT_WORK_STAGES.map((stage, i) => (
              <div
                key={stage.title}
                className="border-t py-10 md:py-12"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:gap-10">
                  <span className="font-matrix text-[10px] tracking-[0.25em] shrink-0 md:w-8" style={{ color: "var(--text-subtle)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-matrix text-sm uppercase tracking-[0.1em] md:text-base" style={{ color: "var(--text)" }}>
                      {stage.title}
                    </h3>
                    <p className="font-body mt-3 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
                      {stage.body}
                    </p>
                    <p
                      className="mt-4 border-l-2 pl-4 text-xs font-medium leading-relaxed md:text-sm"
                      style={{ borderColor: "var(--text)", color: "var(--text)" }}
                    >
                      {stage.outcome}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Что получает клиент */}
      <section className="border-t px-4 py-14 md:px-8 md:py-16 lg:px-12" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-[900px]">
          <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl leading-snug">Что получает клиент</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {PREPROJECT_DELIVERABLES.map((d) => (
              <li
                key={d}
                className="flex items-start gap-3 border px-4 py-3 text-sm"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--text)" }} />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Почему мы */}
      <section className="border-t px-4 py-14 md:px-8 md:py-20 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[900px]">
          <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl leading-snug">
            Почему {SITE_NAME}
          </h2>
          <ul className="mt-8 space-y-4">
            {PREPROJECT_WHY_US_POINTS.map((point) => (
              <li key={point} className="font-body flex gap-3 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: "var(--text)" }} />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/brief?source=preproject-research"
              className="flex items-center gap-3 px-8 py-4 font-matrix text-xs uppercase tracking-[0.2em]"
              style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
            >
              Запросить нулевой спринт
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services/development"
              className="flex items-center border px-6 py-4 font-matrix text-[10px] uppercase tracking-[0.18em]"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              Разработка после discovery
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
