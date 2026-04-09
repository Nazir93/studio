"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
const APPROACH_ITEMS = [
  {
    title: "Автоматическое тестирование",
    desc: "Работаем с инструментами Selenium (WebDriver), Appium, Cucumber, PyTest, Codeception и др.",
    tags: ["Java", "Python", "PHP", "C#"],
  },
  {
    title: "Ручное тестирование",
    desc: "Составим документацию, чек-листы, репорты. Проверим ваш софт на разных устройствах.",
    tags: null as string[] | null,
  },
  {
    title: "Scrum-тестирование",
    desc: "Работаем по гибкой методологии разработки ПО. Подстроим тестирование под ваши спринты.",
    tags: null as string[] | null,
  },
];

const FORMATS = [
  {
    title: "Спринтовое тестирование",
    desc: "Тестируем каждый релиз или итоги спринта. Налаживаем в вашей компании Agile-тестирование.",
  },
  {
    title: "Тестирование готового продукта",
    desc: "Проводим ручное и автоматизированное тестирование готового софта. Составляем документацию и отчёты.",
  },
];

const VALUE_POINTS = [
  {
    title: "Проверим работы подрядчиков",
    desc: "Протестируем работу вашего подрядчика при сдаче.",
  },
  {
    title: "Настроим процессы QA и QC",
    desc: "Выстроим прозрачные процессы контроля качества под вашу команду.",
  },
  {
    title: "Функциональное и нефункциональное тестирование",
    desc: "Покрываем сценарии пользователей, нагрузку, безопасность и стабильность.",
  },
  {
    title: "Меньше обращений в техподдержку",
    desc: "Устраним ошибки до релиза — пользователи реже сталкиваются с дефектами.",
  },
];

function AnimatedBlock({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVis(true);
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(30px)",
        transition: `all 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <div className="relative z-10 flex min-h-[88vh] flex-col justify-center px-4 py-20 md:px-8 lg:px-16">
        <p className="font-matrix text-[10px] uppercase tracking-[0.4em] md:text-xs" style={{ color: "var(--text-muted)" }}>
          Тестирование
        </p>
        <h1
          className="mt-4 max-w-5xl font-heading text-xl leading-[1.1] tracking-tight sm:text-2xl md:text-3xl lg:text-[2rem]"
          style={{ color: "var(--text)" }}
        >
          сайты — приложения — ПО — API
        </h1>
        <p className="font-body mt-6 max-w-2xl text-base leading-relaxed md:mt-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
          Возьмём на себя ручное и автоматизированное тестирование ваших продуктов, протестируем работы подрядчиков.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/brief?source=testing"
            className="group flex items-center gap-3 px-8 py-4 font-matrix text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:gap-5"
            style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
          >
            Обсудить проект
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <p className="font-body mt-4 text-xs md:text-sm" style={{ color: "var(--text-subtle)" }}>
          Повысим качество вашего продукта
        </p>

        <div className="mt-16 grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4 md:mt-20" style={{ borderTop: "1px solid var(--border)" }}>
          {[
            { val: "20+", label: "Проектов по тестированию" },
            { val: "на 86%", label: "Меньше обращений в техподдержку" },
            { val: "middle+", label: "Квалификация тестировщиков" },
            { val: "S7, Т-банк, Газпромбанк", label: "Уже обращались за тестированием" },
          ].map((s) => (
            <div key={s.label} className="py-6 pr-6" style={{ borderBottom: "1px solid var(--border)" }}>
              <p className="font-body text-lg font-semibold tabular-nums tracking-tight md:text-xl" style={{ color: "var(--text)" }}>
                {s.val}
              </p>
              <p className="font-body mt-1 text-[11px] leading-relaxed md:text-xs" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay" style={{ opacity: 0.08 }}>
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="testing-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#testing-grain)" />
        </svg>
      </div>
    </section>
  );
}

function ValueSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUE_POINTS.map((item, i) => (
          <AnimatedBlock key={item.title} delay={i * 80}>
            <div className="flex h-full flex-col p-6 md:p-8" style={{ border: "1px solid var(--border)" }}>
              <h3 className="font-body text-sm font-semibold leading-snug md:text-base" style={{ color: "var(--text)" }}>
                {item.title}
              </h3>
              <p className="font-body mt-3 text-xs leading-relaxed md:text-sm" style={{ color: "var(--text-muted)" }}>
                {item.desc}
              </p>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function ApproachSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
        Наш подход
      </h2>
      <div className="mt-8 grid gap-4 md:mt-12 lg:grid-cols-3">
        {APPROACH_ITEMS.map((item, i) => (
          <AnimatedBlock key={item.title} delay={i * 100}>
            <div className="flex h-full flex-col p-6 md:p-8" style={{ border: "1px solid var(--border)" }}>
              <span className="font-matrix text-[10px] uppercase tracking-[0.3em] md:text-[11px]" style={{ color: "var(--text-subtle)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-body text-sm font-semibold leading-snug md:text-base" style={{ color: "var(--text)" }}>
                {item.title}
              </h3>
              <p className="font-body mt-3 flex-1 text-xs leading-relaxed md:text-sm" style={{ color: "var(--text-muted)" }}>
                {item.desc}
              </p>
              {item.tags && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 font-matrix text-[10px] uppercase tracking-[0.12em] md:text-[11px]"
                      style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
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
      <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
        Форматы сотрудничества
      </h2>
      <div className="mt-8 grid gap-4 md:mt-12 md:grid-cols-2">
        {FORMATS.map((f, i) => (
          <AnimatedBlock key={f.title} delay={i * 120}>
            <div className="flex h-full flex-col p-6 md:p-8" style={{ border: "1px solid var(--border)" }}>
              <h3 className="font-body text-base font-semibold leading-snug md:text-xl" style={{ color: "var(--text)" }}>
                {f.title}
              </h3>
              <p className="font-body mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
                {f.desc}
              </p>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-24" style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-body text-lg font-semibold md:text-xl lg:text-2xl leading-snug" style={{ color: "var(--text)" }}>
          Обсудить тестирование
        </h2>
        <p className="font-body mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--text-muted)" }}>
          Расскажите о продукте или подрядчике — предложим формат и сроки
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/brief?source=testing"
            className="group flex items-center gap-3 px-8 py-4 font-matrix text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:gap-5"
            style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
          >
            Оставить заявку
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

export function TestingContent() {
  return (
    <article>
      <HeroSection />
      <ValueSection />
      <ApproachSection />
      <FormatsSection />
      <CtaSection />
    </article>
  );
}
