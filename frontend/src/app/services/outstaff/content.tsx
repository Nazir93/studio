"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Users, Clock, Shield, Zap } from "lucide-react";
import { OUTSTAFF_CATEGORIES, type OutstaffCategory, type OutstaffRole } from "@/lib/outstaff-data";
function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <div className="relative z-10 flex min-h-[85vh] flex-col justify-center px-4 py-20 md:px-8 lg:px-16">
        <p
          className="font-matrix text-[10px] uppercase tracking-[0.4em] md:text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          Аутстаф
        </p>

        <h1
          className="mt-4 max-w-4xl font-heading text-xl leading-[1.1] tracking-tight sm:text-2xl md:text-3xl lg:text-[2rem]"
          style={{ color: "var(--text)" }}
        >
          разработчики — дизайнеры — аналитики — тестеры
        </h1>

        <p
          className="font-body mt-6 max-w-2xl text-base leading-relaxed md:mt-8 md:text-lg"
          style={{ color: "var(--text-muted)" }}
        >
          Усилим вашу команду квалифицированными специалистами или соберём её с нуля.
          Прозрачные ставки, быстрый старт, полное сопровождение.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/brief?source=outstaff"
            className="group flex items-center gap-3 rounded-none px-8 py-4 font-matrix text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:gap-5"
            style={{
              backgroundColor: "var(--text)",
              color: "var(--bg)",
            }}
          >
            Обсудить проект
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <a
            href="#pricing"
            className="flex items-center gap-3 rounded-none px-8 py-4 font-matrix text-sm uppercase tracking-[0.15em] transition-colors duration-300"
            style={{
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            Смотреть цены
            <ChevronDown size={16} />
          </a>
        </div>

        {/* Stats */}
        <div
          className="mt-16 grid grid-cols-2 gap-px md:mt-20 md:grid-cols-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {[
            { val: "50+", label: "Специалистов в пуле" },
            { val: "24ч", label: "Старт работы" },
            { val: "15+", label: "Технологий" },
            { val: "0 ₽", label: "Скрытых доплат" },
          ].map((s) => (
            <div key={s.label} className="py-6 pr-8" style={{ borderBottom: "1px solid var(--border)" }}>
              <p className="font-body text-xl font-semibold tabular-nums tracking-tight md:text-2xl" style={{ color: "var(--text)" }}>
                {s.val}
              </p>
              <p className="font-body mt-1 text-[11px] md:text-xs" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Grain */}
      <div className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay" style={{ opacity: 0.08 }}>
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="outstaff-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#outstaff-grain)" />
        </svg>
      </div>
    </section>
  );
}

function CategoryAccordion({ category, defaultOpen }: { category: OutstaffCategory; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center justify-between px-4 py-5 text-left md:px-8 md:py-6"
      >
        <h3
          className="font-body text-base font-semibold leading-snug md:text-xl lg:text-2xl"
          style={{ color: "var(--text)" }}
        >
          {category.title}
        </h3>
        <div className="flex items-center gap-3">
          <span className="font-matrix text-[10px] uppercase tracking-[0.2em] md:text-xs" style={{ color: "var(--text-muted)" }}>
            {category.roles.length} {category.roles.length === 1 ? "роль" : category.roles.length < 5 ? "роли" : "ролей"}
          </span>
          <ChevronDown
            size={18}
            className="transition-transform duration-300"
            style={{
              color: "var(--text-muted)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? "2000px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div className="px-4 pb-6 md:px-8 md:pb-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.roles.map((role) => (
              <RoleCard key={role.name} role={role} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ role }: { role: OutstaffRole }) {
  return (
    <div
      className="flex flex-col overflow-hidden transition-colors duration-300"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
        <h4
          className="font-body text-xs font-semibold leading-snug md:text-sm"
          style={{ color: "var(--text)" }}
        >
          {role.name}
        </h4>
      </div>

      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th
              className="px-4 py-2 text-left text-[9px] uppercase tracking-[0.15em] md:text-[10px]"
              style={{ color: "var(--text-subtle)" }}
            >
              Уровень
            </th>
            <th
              className="px-3 py-2 text-right text-[9px] uppercase tracking-[0.15em] md:text-[10px]"
              style={{ color: "var(--text-subtle)" }}
            >
              Час
            </th>
            <th
              className="px-4 py-2 text-right text-[9px] uppercase tracking-[0.15em] md:text-[10px]"
              style={{ color: "var(--text-subtle)" }}
            >
              Месяц
            </th>
          </tr>
        </thead>
        <tbody>
          {role.rates.map((r) => (
            <tr key={r.level} style={{ borderBottom: "1px solid var(--border)" }}>
              <td
                className="px-4 py-2.5 font-matrix text-[11px] uppercase tracking-[0.08em] md:text-xs"
                style={{ color: "var(--text)" }}
              >
                {r.level}
              </td>
              <td
                className="px-3 py-2.5 text-right tabular-nums text-[11px] md:text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                {r.hourly}
              </td>
              <td
                className="px-4 py-2.5 text-right tabular-nums text-[11px] font-medium md:text-xs"
                style={{ color: "var(--text)" }}
              >
                {r.monthly}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PricingSection() {
  return (
    <section id="pricing" style={{ backgroundColor: "var(--bg)" }}>
      <div
        className="flex items-center justify-between px-4 py-6 md:px-8 md:py-8"
        style={{ borderBottom: "1px solid var(--border)", borderTop: "1px solid var(--border)" }}
      >
        <div>
          <h2
            className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug"
            style={{ color: "var(--text)" }}
          >
            Стоимость аутстаффинга
          </h2>
          <p className="font-matrix mt-1 text-[10px] uppercase tracking-[0.2em] md:text-xs" style={{ color: "var(--text-muted)" }}>
            Цены указаны без НДС
          </p>
        </div>
      </div>

      {OUTSTAFF_CATEGORIES.map((cat, i) => (
        <CategoryAccordion key={cat.title} category={cat} defaultOpen={i === 0} />
      ))}
    </section>
  );
}

function AdvantageCard({ icon: Icon, title, desc }: { icon: typeof Users; title: string; desc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col p-6 transition-all duration-700 md:p-8"
      style={{
        border: "1px solid var(--border)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
      }}
    >
      <Icon size={24} style={{ color: "var(--text-muted)" }} />
      <h3 className="mt-4 font-body text-sm font-semibold leading-snug md:text-base" style={{ color: "var(--text)" }}>
        {title}
      </h3>
      <p className="font-body mt-2 text-xs leading-relaxed md:text-sm" style={{ color: "var(--text-muted)" }}>
        {desc}
      </p>
    </div>
  );
}

function WhyUsSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)" }}>
      <h2
        className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug"
        style={{ color: "var(--text)" }}
      >
        Почему мы
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdvantageCard
          icon={Users}
          title="Свой пул специалистов"
          desc="50+ проверенных разработчиков, дизайнеров и аналитиков. Все прошли технические собеседования и работали на реальных проектах."
        />
        <AdvantageCard
          icon={Clock}
          title="Быстрый старт"
          desc="Подберём специалиста за 24 часа. Замена в течение 3 рабочих дней, если специалист не подошёл."
        />
        <AdvantageCard
          icon={Shield}
          title="Прозрачность"
          desc="Фиксированные ставки без скрытых доплат. Вы платите только за фактически отработанные часы."
        />
        <AdvantageCard
          icon={Zap}
          title="Полное сопровождение"
          desc="Менеджер проекта контролирует качество, сроки и коммуникацию. Еженедельные отчёты о прогрессе."
        />
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section
      className="px-4 py-16 md:px-8 md:py-24"
      style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug"
          style={{ color: "var(--text)" }}
        >
          Нужны специалисты?
        </h2>
        <p className="font-body mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
          Расскажите о проекте — подберём команду за 24 часа
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/brief?source=outstaff"
            className="group flex items-center gap-3 px-8 py-4 font-matrix text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:gap-5"
            style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
          >
            Обсудить проект
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/services"
            className="flex items-center gap-3 px-8 py-4 font-matrix text-sm uppercase tracking-[0.15em] transition-colors duration-300"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            Все услуги
          </Link>
        </div>
      </div>
    </section>
  );
}

export function OutstaffContent() {
  return (
    <article>
      <HeroSection />
      <PricingSection />
      <WhyUsSection />
      <CtaSection />
    </article>
  );
}
