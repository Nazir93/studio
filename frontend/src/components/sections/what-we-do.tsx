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

function ShowcaseCell({ item, previewVideosEnabled }: { item: ShowcaseItem; previewVideosEnabled: boolean }) {
  const isArtistic = item.id === "artistic";
  /** Кино и древность: плоская карточка, превью и насыщенный слой — только при наведении */
  const hoverReveal = item.id === "film" || item.id === "ancient";

  return (
    <Link
      href={item.href}
      data-cursor-word="смотреть"
      className="group relative flex min-h-[300px] shrink-0 flex-col justify-between overflow-hidden border p-3 transition-colors sm:min-h-[340px] md:p-5"
      style={{
        aspectRatio: "9 / 13",
        borderColor: "var(--border)",
        backgroundColor: isArtistic ? "transparent" : "var(--bg-secondary)",
      }}
    >
      {"previewVideo" in item && item.previewVideo && previewVideosEnabled && (
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
            className="pointer-events-none absolute inset-0 z-[1] bg-[var(--bg-secondary)] transition-opacity duration-500 group-hover:opacity-[0.12] group-focus-within:opacity-[0.12]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[color-mix(in_srgb,var(--bg-secondary)_92%,transparent)] via-[color-mix(in_srgb,var(--bg)_45%,transparent)] to-[color-mix(in_srgb,var(--bg-secondary)_95%,transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
            aria-hidden
          />
        </>
      )}
      {"previewGradient" in item && item.previewGradient && (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-100"
            style={{ background: item.previewGradient }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[color-mix(in_srgb,#0c0b0a_20%,transparent)] via-transparent to-[color-mix(in_srgb,var(--bg)_55%,transparent)] opacity-50"
            aria-hidden
          />
        </>
      )}

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-[2] h-1 transition-opacity duration-500 ${
          hoverReveal ? "opacity-0 group-hover:opacity-90 group-focus-within:opacity-90" : "opacity-80"
        }`}
        style={{
          background:
            item.id === "film"
              ? "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 80%, transparent 100%)"
              : item.id === "artistic"
                ? "linear-gradient(90deg, transparent 0%, rgba(196,92,74,0.35) 25%, rgba(74,111,165,0.35) 50%, rgba(196,165,116,0.3) 75%, transparent 100%)"
                : "linear-gradient(90deg, transparent 0%, rgba(196,165,116,0.25) 35%, rgba(196,165,116,0.25) 65%, transparent 100%)",
        }}
      />
      <div className="relative z-[2] flex min-h-0 flex-1 flex-col justify-between">
        <div className="relative flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={`font-matrix text-[7px] uppercase tracking-[0.2em] md:text-[8px] ${
                hoverReveal ? "opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" : ""
              }`}
              style={{ color: item.id === "artistic" ? "rgba(245,240,235,0.55)" : "var(--text-muted)" }}
            >
              {item.subtitle}
            </p>
            <h3
              className={`font-akony mt-1.5 text-base uppercase leading-tight tracking-[0.08em] md:text-lg lg:text-xl ${
                item.id === "artistic" ? "text-[#f5f0eb]" : ""
              } ${hoverReveal ? "opacity-[0.4] transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" : ""}`}
            >
              {item.title}
            </h3>
          </div>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors md:h-10 md:w-10 ${
              hoverReveal
                ? "opacity-[0.35] transition-[opacity,colors] duration-500 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] group-hover:opacity-100 group-focus-within:border-[var(--accent)] group-focus-within:text-[var(--accent)] group-focus-within:opacity-100"
                : "group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
            }`}
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
        </div>
        <p
          className={`relative mt-3 font-body text-[10px] leading-relaxed md:text-[11px] lg:text-xs ${
            hoverReveal ? "opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" : ""
          }`}
          style={{ color: item.id === "artistic" ? "rgba(245,240,235,0.78)" : undefined }}
        >
          {item.description}
        </p>
        <div
          className={`relative mt-3 flex items-center gap-2 font-matrix text-[8px] uppercase tracking-[0.18em] md:text-[9px] ${
            hoverReveal
              ? "opacity-0 transition-[opacity,transform,color] duration-500 group-hover:text-[var(--accent)] group-hover:opacity-100 group-focus-within:text-[var(--accent)] group-focus-within:opacity-100"
              : "transition-colors group-hover:text-[var(--accent)]"
          }`}
        >
          {item.id === "film" ? "Открыть демо" : "Открыть раздел"}
          <ArrowRight
            size={12}
            className={`transition-transform ${hoverReveal ? "group-hover:translate-x-1 group-focus-within:translate-x-1" : "group-hover:translate-x-1"}`}
          />
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
        className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        aria-hidden
      >
        {item.icon === "ancient" ? (
          <Pyramid size={20} strokeWidth={1.25} />
        ) : item.icon === "palette" ? (
          <Palette size={20} strokeWidth={1.25} />
        ) : (
          <Clapperboard size={20} strokeWidth={1.25} />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-matrix text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
          {item.subtitle}
        </p>
        <h3
          className="font-akony mt-1.5 text-[0.95rem] uppercase leading-snug tracking-[0.07em] sm:text-[1.05rem] sm:leading-tight sm:tracking-[0.08em] md:text-lg"
          style={{ color: "var(--text)" }}
        >
          {item.title}
        </h3>
        <p className="mt-3 font-body text-xs leading-relaxed sm:text-[13px]" style={{ color: "var(--text-muted)" }}>
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
      <div className="container mx-auto px-4 py-14 md:px-6 md:py-20 lg:py-24">
        <div
          className="mb-10 flex flex-col gap-5 border-b pb-10 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-8 md:pb-12"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="min-w-0 max-w-2xl">
            <p className="font-matrix text-[9px] uppercase tracking-[0.28em] sm:text-[10px]" style={{ color: "var(--text-subtle)" }}>
              Галерея · интерактивы
            </p>
            <h2
              className="mt-2 font-akony text-xl uppercase leading-tight tracking-[0.1em] sm:text-2xl md:text-3xl lg:text-[2rem]"
              style={{ color: "var(--text)" }}
            >
              Демо и форматы
            </h2>
            <p className="mt-3 max-w-xl font-body text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-muted)" }}>
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
