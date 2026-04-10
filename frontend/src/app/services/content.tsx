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
  /** Видео подключаем вместе с появлением карточки — один observer, без одновременной загрузки всех mp4 */
  const [loadVideo, setLoadVideo] = useState(false);
  const Icon = SERVICE_ICONS[service.icon];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        if (service.videoUrl) setLoadVideo(true);
        observer.disconnect();
      },
      { threshold: 0.08, rootMargin: "140px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [service.videoUrl]);

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
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-secondary)_88%,var(--bg)_12%)] transition-all duration-500 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--text)_22%,transparent)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px opacity-70 transition-opacity group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--text) 35%, transparent) 40%, color-mix(in srgb, var(--text) 35%, transparent) 60%, transparent 100%)",
          }}
          aria-hidden
        />

        {/* Превью */}
        <div className="relative aspect-[16/10] overflow-hidden border-b" style={{ borderColor: "var(--border)" }}>
          {service.videoUrl ? (
            loadVideo ? (
              <video
                className="h-full w-full object-cover opacity-90 transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden
              >
                <source src={service.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div
                className="flex h-full w-full items-center justify-center bg-[color-mix(in_srgb,var(--bg-secondary)_92%,var(--bg)_8%)]"
                aria-hidden
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border opacity-70"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                >
                  <Icon size={24} strokeWidth={1.35} />
                </span>
              </div>
            )
          ) : (
            <div
              className="flex h-full w-full items-center justify-center transition-colors duration-500 group-hover:bg-[color-mix(in_srgb,var(--bg-secondary)_88%,var(--bg)_12%)]"
              style={{
                background:
                  "linear-gradient(145deg, color-mix(in srgb, var(--bg-secondary) 92%, transparent) 0%, var(--bg) 100%)",
              }}
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-500 group-hover:border-[color-mix(in_srgb,var(--text)_35%,transparent)] group-hover:text-[var(--text)]"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                aria-hidden
              >
                <Icon size={26} strokeWidth={1.35} />
              </span>
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--bg)_55%,transparent)] via-transparent to-transparent opacity-80"
            aria-hidden
          />
        </div>

        <div className="relative z-[2] flex flex-1 flex-col p-5 md:p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <span
              className="font-matrix text-[10px] uppercase tracking-[0.22em] tabular-nums"
              style={{ color: "var(--text-subtle)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:border-[color-mix(in_srgb,var(--text)_40%,transparent)] group-hover:text-[var(--text)]"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              aria-hidden
            >
              <Icon size={18} strokeWidth={1.35} />
            </span>
          </div>

          <h2
            className="font-akony text-lg uppercase leading-tight tracking-[0.08em] transition-colors duration-300 group-hover:opacity-95 md:text-xl"
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

          <div className="mt-5 flex items-center gap-2 font-matrix text-[9px] uppercase tracking-[0.2em] transition-colors group-hover:text-[var(--accent)] md:text-[10px]">
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
