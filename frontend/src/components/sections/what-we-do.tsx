"use client";

import Link from "next/link";
import { ArrowRight, Clapperboard, Palette, Pyramid } from "lucide-react";
import { useIsDesktopLg } from "@/lib/use-is-desktop-lg";

/** Демо и интерактивы — пополняется. */
export const SHOWCASE_ITEMS = [
  {
    id: "film",
    title: "Кино",
    subtitle: "Киноплёнка · кадры",
    description:
      "Кадры по скроллу, HUD, фоновое видео и газетная полоса — демо визуального языка студии.",
    href: "/gallery/film-reel",
    icon: "film" as const,
    previewVideo: "/videos/film-old-movies-effects.mp4",
  },
  {
    id: "ancient",
    title: "Древность",
    subtitle: "Иероглифы · пирамиды · мистика",
    description:
      "Альтернативная страница UX/UI: палео-контакт, Розеттский камень, кипу, каналы орошения — интерактивная витрина дизайна.",
    href: "/services/ux-ui-design/ancient",
    icon: "ancient" as const,
    previewVideo: "/videos/ancient-paleo.mp4",
  },
  {
    id: "artistic",
    title: "Художественные стили",
    subtitle: "Кубизм · дада · оп-арт · пуантилизм",
    description:
      "Альтернативная страница UX/UI: геометрия куба, дада-коллаж, оп-арт и пуантилизм — интерфейс как выставка.",
    href: "/services/ux-ui-design/artistic",
    icon: "palette" as const,
    previewGradient:
      "linear-gradient(165deg, #141210 0%, #3d4a6b 38%, #4a3428 72%, #0c0b0a 100%)",
  },
] as const;

type ShowcaseItem = (typeof SHOWCASE_ITEMS)[number];

function IconGlyph({ item }: { item: ShowcaseItem }) {
  const cls = "shrink-0 opacity-80";
  if (item.icon === "ancient") return <Pyramid size={16} strokeWidth={1.25} className={cls} />;
  if (item.icon === "palette") return <Palette size={16} strokeWidth={1.25} className={cls} />;
  return <Clapperboard size={16} strokeWidth={1.25} className={cls} />;
}

/** Одна схема для всех трёх карточек: фон, опционально видео/градиент, типографика */
function ShowcaseCell({ item, previewVideosEnabled }: { item: ShowcaseItem; previewVideosEnabled: boolean }) {
  const hasVideo = "previewVideo" in item && item.previewVideo;
  const showVideo = hasVideo && previewVideosEnabled;
  const hasGradient = "previewGradient" in item && item.previewGradient;

  return (
    <Link
      href={item.href}
      data-cursor-word="смотреть"
      className="group relative flex min-h-[280px] shrink-0 flex-col justify-between overflow-hidden border p-4 transition-[border-color,box-shadow] sm:min-h-[300px] md:p-5"
      style={{
        aspectRatio: "9 / 13",
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      {showVideo ? (
        <>
          <video
            className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-105 object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-within:scale-100 group-focus-within:opacity-100"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          >
            <source src={item.previewVideo} type="video/mp4" />
          </video>
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[var(--bg-secondary)] transition-opacity duration-500 group-hover:opacity-[0.15] group-focus-within:opacity-[0.15]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[color-mix(in_srgb,var(--bg-secondary)_88%,transparent)] via-[color-mix(in_srgb,var(--bg)_40%,transparent)] to-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
            aria-hidden
          />
        </>
      ) : null}

      {hasGradient ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-0" style={{ background: item.previewGradient }} aria-hidden />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[color-mix(in_srgb,var(--bg)_35%,transparent)] via-transparent to-[color-mix(in_srgb,var(--bg)_70%,transparent)]"
            aria-hidden
          />
        </>
      ) : null}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-px opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--text) 25%, transparent) 35%, color-mix(in srgb, var(--text) 25%, transparent) 65%, transparent 100%)",
        }}
      />

      <div className="relative z-[2] flex min-h-0 flex-1 flex-col justify-between gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className="font-matrix text-[7px] uppercase tracking-[0.2em] md:text-[8px]"
              style={{ color: "var(--text-muted)" }}
            >
              {item.subtitle}
            </p>
            <h3
              className="mt-1 font-akony text-sm uppercase leading-snug tracking-[0.07em] sm:text-[0.95rem] md:text-base"
              style={{ color: "var(--text)" }}
            >
              {item.title}
            </h3>
          </div>
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border md:h-9 md:w-9"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            aria-hidden
          >
            <IconGlyph item={item} />
          </span>
        </div>

        <p className="font-body text-[10px] leading-relaxed md:text-[11px]" style={{ color: "var(--text-muted)" }}>
          {item.description}
        </p>

        <div
          className="flex items-center gap-2 font-matrix text-[8px] uppercase tracking-[0.18em] transition-colors md:text-[9px] group-hover:text-[var(--accent)]"
          style={{ color: "var(--text-subtle)" }}
        >
          {item.id === "film" ? "Открыть демо" : "Открыть раздел"}
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

function ShowcaseStackCard({ item }: { item: ShowcaseItem }) {
  return (
    <Link
      href={item.href}
      data-cursor-word="смотреть"
      className="flex items-start gap-4 border-b px-4 py-5 transition-opacity active:opacity-90 last:border-b-0"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
    >
      <span
        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border md:h-11 md:w-11"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        aria-hidden
      >
        {item.icon === "ancient" ? (
          <Pyramid size={18} strokeWidth={1.25} />
        ) : item.icon === "palette" ? (
          <Palette size={18} strokeWidth={1.25} />
        ) : (
          <Clapperboard size={18} strokeWidth={1.25} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-matrix text-[9px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
          {item.subtitle}
        </p>
        <h3
          className="font-akony mt-1 text-[0.95rem] uppercase leading-snug tracking-[0.07em] sm:text-base md:text-[1.05rem]"
          style={{ color: "var(--text)" }}
        >
          {item.title}
        </h3>
        <p className="mt-2 font-body text-xs leading-relaxed sm:text-[13px]" style={{ color: "var(--text-muted)" }}>
          {item.description}
        </p>
        <div
          className="mt-3 flex items-center gap-2 font-matrix text-[9px] uppercase tracking-[0.18em]"
          style={{ color: "var(--accent)" }}
        >
          {item.id === "film" ? "Открыть демо" : "Открыть раздел"}
          <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

export function WhatWeDoSection() {
  const previewVideosEnabled = useIsDesktopLg();

  return (
    <section
      data-navbar
      className="relative border-t"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg)", color: "var(--text)" }}
      aria-label="Демо и форматы"
    >
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:py-20">
        <div
          className="mb-8 flex flex-col gap-4 border-b pb-8 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-8 md:pb-10"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="min-w-0 max-w-2xl">
            <p className="font-matrix text-[9px] uppercase tracking-[0.28em] sm:text-[10px]" style={{ color: "var(--text-subtle)" }}>
              Галерея · интерактивы
            </p>
            <h2
              className="mt-1.5 font-akony text-lg uppercase leading-tight tracking-[0.1em] sm:text-xl md:text-2xl"
              style={{ color: "var(--text)" }}
            >
              Демо и форматы
            </h2>
            <p className="mt-2 max-w-xl font-body text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Живые страницы и визуальные эксперименты — откройте демо и посмотрите подход студии.
            </p>
          </div>
          <Link
            href="/gallery"
            className="font-matrix shrink-0 text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-[var(--accent)] md:text-xs"
            style={{ color: "var(--text-subtle)" }}
          >
            вся галерея →
          </Link>
        </div>

        <div className="md:hidden" style={{ border: "1px solid var(--border)" }}>
          {SHOWCASE_ITEMS.map((item) => (
            <ShowcaseStackCard key={item.id} item={item} />
          ))}
        </div>

        <div className="hidden gap-4 md:grid md:grid-cols-3 md:gap-5 lg:gap-6">
          {SHOWCASE_ITEMS.map((item) => (
            <ShowcaseCell key={item.id} item={item} previewVideosEnabled={previewVideosEnabled} />
          ))}
        </div>
      </div>
    </section>
  );
}
