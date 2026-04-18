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
  FileCode2,
  type LucideIcon,
} from "lucide-react";
import { SERVICES } from "@/lib/constants";

const SERVICE_ICONS: Record<(typeof SERVICES)[number]["icon"], LucideIcon> = {
  zap: Zap,
  shield: Shield,
  home: Home,
  network: Network,
  code: Code2,
  fileCode: FileCode2,
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
      { threshold: 0.08, rootMargin: "120px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transitionDelay: `${index * 50}ms`,
      }}
    >
      <Link
        href={service.slug}
        data-cursor-word="смотреть"
        className="group block rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_88%,var(--bg)_12%)] px-4 py-4 transition-all duration-300 hover:border-[color-mix(in_srgb,var(--text)_18%,var(--border))] hover:bg-[color-mix(in_srgb,var(--bg-secondary)_95%,var(--bg)_5%)] sm:px-5 sm:py-5 md:rounded-2xl md:px-6 md:py-5"
      >
        <div className="flex gap-3 sm:gap-4">
          <div className="flex shrink-0 flex-col items-center gap-2 pt-0.5 sm:items-start">
            <span
              className="font-matrix text-[9px] uppercase tracking-[0.26em] tabular-nums sm:text-[10px]"
              style={{ color: "var(--text-subtle)" }}
            >
              {num}
            </span>
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg border sm:h-10 sm:w-10"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
                backgroundColor: "color-mix(in srgb, var(--bg) 50%, transparent)",
              }}
            >
              <Icon size={19} strokeWidth={1.35} className="transition-colors group-hover:text-[var(--text)]" aria-hidden />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <h2
              className="font-akony text-[0.9rem] uppercase leading-tight tracking-[0.07em] transition-colors duration-300 sm:text-[0.95rem] md:text-[1.05rem]"
              style={{ color: "var(--text)" }}
            >
              {"listTitle" in service && service.listTitle ? service.listTitle : service.title}
            </h2>
            <p
              className="mt-2 font-body text-[12px] leading-snug sm:text-[13px] md:text-[15px] md:leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {service.shortDescription}
            </p>
            <div className="mt-3 flex items-center gap-2 font-matrix text-[9px] uppercase tracking-[0.2em] text-[var(--text-subtle)] transition-colors group-hover:text-[var(--accent)] sm:mt-3.5 sm:text-[10px]">
              Подробнее
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </div>
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
            className="font-heading services-page-h1 tracking-tight"
            style={{ color: "var(--text)" }}
          >
            УСЛУГИ
          </h1>
          <p className="mt-4 font-body text-base leading-relaxed md:text-lg" style={{ color: "var(--text-muted)" }}>
            Цифровые продукты под ключ: дизайн, разработка веб и мобильных приложений, личные кабинеты, тестирование,
            предпроектные исследования и команда на аутстафе.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 sm:gap-3.5 md:max-w-5xl lg:max-w-6xl lg:grid-cols-2 lg:gap-x-6 lg:gap-y-3.5">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
