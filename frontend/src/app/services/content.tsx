"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  Home,
  Network,
  Code2,
  Users,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { SERVICES } from "@/lib/constants";

const SERVICE_ICONS: Record<(typeof SERVICES)[number]["icon"], LucideIcon> = {
  zap: Zap,
  shield: Shield,
  home: Home,
  network: Network,
  code: Code2,
  users: Users,
  megaphone: Megaphone,
};

function ServiceCard({
  service,
  index,
}: {
  service: (typeof SERVICES)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = SERVICE_ICONS[service.icon];
  const num = String(index + 1).padStart(2, "0");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.08, rootMargin: "140px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <Link
        href={service.slug}
        data-cursor-word="смотреть"
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_90%,var(--bg)_10%)] transition-all duration-500 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--text)_20%,transparent)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-px opacity-80 transition-opacity group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent) 45%, transparent) 45%, color-mix(in srgb, var(--text) 25%, transparent) 55%, transparent 100%)",
          }}
          aria-hidden
        />

        {/* Превью: единый вид для всех услуг (без видео) */}
        <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--border)]">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 85% 65% at 18% 28%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 52%),
                radial-gradient(ellipse 75% 55% at 88% 78%, color-mix(in srgb, var(--text) 8%, transparent) 0%, transparent 48%),
                linear-gradient(168deg, color-mix(in srgb, var(--bg-secondary) 94%, var(--bg) 6%) 0%, var(--bg) 100%)
              `,
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 opacity-[0.4] dark:opacity-[0.22]"
            style={{
              backgroundImage:
                "radial-gradient(color-mix(in srgb, var(--text) 18%, transparent) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
            aria-hidden
          />
          <span
            className="absolute left-4 top-3 z-[2] font-matrix text-[10px] uppercase tracking-[0.28em] tabular-nums"
            style={{ color: "var(--text-subtle)" }}
          >
            {num}
          </span>
          <div className="absolute inset-0 z-[1] flex items-center justify-center">
            <span
              className="flex h-[3.85rem] w-[3.85rem] items-center justify-center rounded-2xl border bg-[color-mix(in_srgb,var(--bg)_45%,transparent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_36px_rgba(0,0,0,0.07)] backdrop-blur-[3px] transition-all duration-500 group-hover:scale-[1.07] group-hover:border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_44px_rgba(0,0,0,0.12)] dark:bg-[color-mix(in_srgb,var(--bg-secondary)_55%,transparent)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_36px_rgba(0,0,0,0.35)] dark:group-hover:shadow-[0_14px_44px_rgba(0,0,0,0.5)]"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              <Icon
                size={28}
                strokeWidth={1.35}
                className="transition-colors duration-300 group-hover:text-[var(--text)]"
                aria-hidden
              />
            </span>
          </div>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[55%] bg-gradient-to-t from-[color-mix(in_srgb,var(--bg)_78%,transparent)] via-[color-mix(in_srgb,var(--bg)_20%,transparent)] to-transparent opacity-95"
            aria-hidden
          />
        </div>

        <div className="relative z-[2] flex flex-1 flex-col p-5 md:p-6">
          <h2
            className="font-akony text-lg uppercase leading-tight tracking-[0.08em] transition-colors duration-300 group-hover:text-[color-mix(in_srgb,var(--text)_92%,var(--accent)_8%)] md:text-xl"
            style={{ color: "var(--text)" }}
          >
            {service.title}
          </h2>
          <p
            className="mt-3 flex-1 font-body text-sm leading-relaxed md:text-[15px]"
            style={{ color: "var(--text-muted)" }}
          >
            {service.shortDescription}
          </p>

          <div className="mt-5 flex items-center gap-2 font-matrix text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] transition-colors group-hover:text-[var(--accent)] md:text-[10px]">
            Подробнее
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export function ServicesPageContent() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 md:mb-14 max-w-3xl">
          <div className="mb-5 flex items-center gap-2">
            <div className="h-px w-8 shrink-0" style={{ backgroundColor: "color-mix(in srgb, var(--text) 40%, transparent)" }} />
            <span
              className="text-[10px] font-medium uppercase tracking-[0.2em] sm:text-[11px]"
              style={{ color: "var(--text-muted)" }}
            >
              Направления студии
            </span>
          </div>
          <h1
            className="font-heading text-[clamp(1.2rem,3.8vw,2.75rem)] leading-[1.05] tracking-tight"
            style={{ color: "var(--text)" }}
          >
            УСЛУГИ
          </h1>
          <p className="mt-4 font-body text-base leading-relaxed md:text-lg" style={{ color: "var(--text-muted)" }}>
            Цифровые продукты под ключ: дизайн, разработка веб и мобильных приложений, личные кабинеты, тестирование,
            предпроектные исследования и команда на аутстафе.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
