"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import {
  CABINET_VALUE_PROPS,
  CABINET_CASES,
  CABINET_STEPS,
  CABINET_WHY_US,
  CABINET_TNM,
} from "@/lib/personal-cabinet-data";
export function PersonalCabinetContent() {
  return (
    <article style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      {/* Hero */}
      <section className="border-b px-4 py-14 md:px-8 md:py-20 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1100px]">
          <h1 className="max-w-[24ch] font-heading text-xl leading-[1.1] tracking-tight sm:text-2xl md:text-3xl lg:text-[2rem]">
            Разработка личного кабинета для сотрудников и клиентов
          </h1>

          <div className="mt-12 grid gap-8 border-t pt-10 md:grid-cols-2 md:gap-12" style={{ borderColor: "var(--border)" }}>
            {CABINET_VALUE_PROPS.map((block) => (
              <div key={block.title}>
                <h2 className="font-matrix text-[10px] uppercase tracking-[0.28em]" style={{ color: "var(--text-muted)" }}>
                  {block.title}
                </h2>
                <p className="font-body mt-3 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
                  {block.body}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/brief?source=personal-cabinet"
            className="mt-10 flex items-center gap-3 px-8 py-4 font-matrix text-xs uppercase tracking-[0.2em]"
            style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
          >
            Обсудить проект
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Кейсы */}
      <section className="px-4 py-14 md:px-8 md:py-16 lg:px-12" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-[1100px]">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl leading-snug" style={{ color: "var(--text)" }}>
              Кейсы
            </h2>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 font-matrix text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--text-subtle)" }}
            >
              Смотреть все проекты
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-10 space-y-6">
            {CABINET_CASES.map((c, i) => (
              <article
                key={c.client + i}
                className="group border p-6 transition-colors md:p-8"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-matrix text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>
                      {c.tags}
                    </p>
                    <p className="mt-2 font-body text-base font-medium leading-snug md:text-lg" style={{ color: "var(--text)" }}>
                      {c.client}
                    </p>
                    <h3 className="mt-2 font-body text-sm font-medium leading-snug md:text-base" style={{ color: "var(--text)" }}>
                      {c.title}
                    </h3>
                    <p className="font-body mt-3 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
                      {c.lead}
                    </p>
                  </div>
                  <Link
                    href="/portfolio"
                    className="inline-flex shrink-0 items-center gap-1 font-matrix text-[9px] uppercase tracking-[0.18em] opacity-60 transition-opacity group-hover:opacity-100"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Подробнее
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Индивидуальное решение */}
      <section className="border-t px-4 py-14 md:px-8 md:py-16 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[1100px]">
          <h2 className="max-w-[20ch] font-body text-lg font-semibold leading-tight tracking-tight md:text-xl lg:text-2xl">
            Разработаем индивидуальное решение под вашу инфраструктуру
          </h2>

          <div className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ backgroundColor: "var(--border)" }}>
            {CABINET_STEPS.map((step, i) => (
              <div key={step.title} className="bg-[var(--bg)] p-6 md:p-8">
                <span className="font-matrix text-[10px] tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-body text-xs font-semibold leading-snug md:text-sm" style={{ color: "var(--text)" }}>
                  {step.title}
                </h3>
                <p className="font-body mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Time & Material */}
      <section className="border-t px-4 py-14 md:px-8 md:py-16 lg:px-12" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
        <div className="mx-auto max-w-[1100px]">
          <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl leading-snug">Работаем в формате time &amp; material</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {CABINET_TNM.map((item) => (
              <div key={item.title} className="border p-6 md:p-7" style={{ borderColor: "var(--border)" }}>
                <h3 className="font-body text-xs font-semibold leading-snug md:text-sm" style={{ color: "var(--text)" }}>
                  {item.title}
                </h3>
                <p className="font-body mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Почему мы */}
      <section className="border-t px-4 py-14 md:px-8 md:py-20 lg:px-12" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-[800px]">
          <h2 className="font-body text-xl font-semibold tracking-tight md:text-2xl leading-snug">Почему {SITE_NAME}</h2>
          <ul className="mt-8 space-y-4">
            {CABINET_WHY_US.map((line) => (
              <li key={line} className="font-body flex gap-3 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: "var(--text)" }} />
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/brief?source=personal-cabinet"
              className="flex items-center gap-3 px-8 py-4 font-matrix text-xs uppercase tracking-[0.2em]"
              style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
            >
              Обсудить проект
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services/outstaff"
              className="flex items-center border px-6 py-4 font-matrix text-[10px] uppercase tracking-[0.18em]"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              Аутстаф команды
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
