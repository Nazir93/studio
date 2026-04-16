"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PHONE, PHONE_RAW, EMAIL } from "@/lib/constants";

/** Instagram: только #fafafa #fff #262626 #8e8e8e #dbdbdb */
const HERO = {
  text: "#262626",
  textStrong: "#000000",
  muted: "#8e8e8e",
  border: "#dbdbdb",
  sectionBg: "#fafafa",
  centerBg: "#ffffff",
  cardBg: "#ffffff",
} as const;

const HERO_ITEMS = [
  { title: "Веб-сервисы", slug: "/services" },
  { title: "Мобильные приложения", slug: "/services" },
  { title: "Корпоративный софт", slug: "/services" },
  { title: "Web-сервисы", slug: "/services" },
  { title: "Под ключ", slug: "/services" },
];

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function ServiceCard({
  title,
  slug,
  opacity,
  scale,
  borderRadius,
}: {
  title: string;
  slug: string;
  opacity: number;
  scale: number;
  borderRadius: number;
}) {
  return (
    <Link
      href={slug}
      className="w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-300 group relative"
      style={{
        opacity,
        transform: `scale(${scale})`,
        borderRadius: `${borderRadius}px`,
        background: HERO.cardBg,
        boxShadow: "0 0 0 1px #dbdbdb",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/[0.03]"
      />
      <span
        className="relative z-10 text-xs md:text-sm uppercase tracking-[0.1em] text-center px-3 transition-colors duration-300 group-hover:text-[#000000]"
        style={{ color: HERO.muted, opacity }}
      >
        {title}
      </span>
    </Link>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportH = window.innerHeight;
      const scrolled = -rect.top;
      const scrollRange = sectionHeight - viewportH;
      const p = clamp(scrolled / scrollRange, 0, 1);
      setProgress(p);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scale = 1 - progress * 0.15;
  const borderRadius = progress * 24;
  const gap = progress * 16;
  const sideOpacity = clamp(progress * 2.5 - 0.5, 0, 1);
  const sideScale = 0.85 + sideOpacity * 0.15;
  const textScale = 1 - progress * 0.2;

  return (
    <>
      {/* Desktop: scroll-driven grid animation */}
      <section
        ref={sectionRef}
        className="relative hidden md:block w-full"
        style={{
          height: "250vh",
          background: HERO.sectionBg,
        }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div
            className="h-full w-full flex flex-col"
            style={{
              padding: progress > 0 ? `${gap}px` : 0,
              gap: progress > 0 ? `${gap}px` : 0,
            }}
          >
            {/* Top row: service1 | HERO | service2 */}
            <div className="flex flex-1 min-h-0 w-full" style={{ gap: progress > 0 ? `${gap}px` : 0 }}>
              <div style={{ flex: `0 0 ${progress * 20}%` }}>
                <ServiceCard
                  title={HERO_ITEMS[0].title}
                  slug={HERO_ITEMS[0].slug}
                  opacity={sideOpacity}
                  scale={sideScale}
                  borderRadius={borderRadius}
                />
              </div>

              {/* Center — main hero */}
              <Link
                href="/services"
                className="relative flex-1 overflow-hidden flex items-center justify-center cursor-pointer"
                style={{
                  borderRadius: `${borderRadius}px`,
                  transform: `scale(${scale})`,
                  background: HERO.centerBg,
                  boxShadow:
                    progress > 0.1
                      ? "0 0 0 1px #dbdbdb"
                      : "0 0 0 1px #dbdbdb",
                }}
              >
                {/* Мягкий свет сверху + сетка */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                  }}
                />
                {/* Ghost text */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                  style={{
                    transform: `translate(${mouse.x * -15}px, ${mouse.y * -10}px) scale(${textScale})`,
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  <h2
                    className="font-matrix text-[clamp(2.5rem,10vw,9rem)] font-bold leading-[0.85] text-center whitespace-nowrap opacity-[0.06] max-w-full px-2"
                    style={{ color: HERO.text }}
                  >
                    CODE1618
                  </h2>
                </div>

                {/* Main heading */}
                <div
                  className="relative z-10 container mx-auto"
                  style={{
                    transform: `translate(${mouse.x * 8}px, ${mouse.y * 5}px) scale(${textScale})`,
                    transition: "transform 0.2s ease-out",
                    transformOrigin: "center center",
                  }}
                >
                  <h1 className="font-heading text-[clamp(24px,4.5vw,72px)] leading-[0.95] tracking-tight">
                    <span style={{ color: HERO.text }}>ВЕБ-СЕРВИСЫ</span>
                    <br />
                    <span style={{ color: HERO.textStrong }}>МОБИЛЬНЫЕ ПРИЛОЖЕНИЯ</span>
                    <br />
                    <span className="text-[0.42em] tracking-[0.12em] mt-2 inline-block" style={{ color: HERO.muted }}>
                      РАЗРАБАТЫВАЕМ
                    </span>
                  </h1>
                </div>

                {/* Subtitle */}
                <div
                  className="absolute bottom-12 left-0 right-0 container mx-auto z-10"
                  style={{ transform: `scale(${textScale})`, transformOrigin: "bottom left" }}
                >
                  <p className="text-xs uppercase tracking-[0.25em] max-w-lg leading-relaxed" style={{ color: HERO.muted }}>
                    Корпоративный софт · Web-сервисы · Интеграции · Сопровождение
                  </p>
                </div>

                {/* Contacts */}
                <div
                  className="absolute bottom-12 right-0 container mx-auto z-10 flex justify-end items-center gap-6"
                  style={{ transform: `scale(${textScale})`, transformOrigin: "bottom right" }}
                >
                  <div className="flex items-center gap-4 text-xs" style={{ color: HERO.muted }}>
                    <span>{EMAIL}</span>
                    <span style={{ color: "#c7c7c7" }}>/</span>
                    <span>{PHONE}</span>
                  </div>
                  <span
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-300 hover:opacity-90 border"
                    style={{
                      borderColor: HERO.border,
                      color: HERO.text,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    Услуги
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>

              <div style={{ flex: `0 0 ${progress * 22}%` }}>
                <ServiceCard
                  title={HERO_ITEMS[1].title}
                  slug={HERO_ITEMS[1].slug}
                  opacity={sideOpacity}
                  scale={sideScale}
                  borderRadius={borderRadius}
                />
              </div>
            </div>

            {/* Bottom row: 3 services */}
            <div
              className="flex min-h-0 w-full"
              style={{
                flex: `0 0 ${progress * 35}%`,
                gap: progress > 0 ? `${gap}px` : 0,
                opacity: sideOpacity,
              }}
            >
              {HERO_ITEMS.slice(2, 5).map((item, i) => (
                <div key={item.slug + i} className="flex-1 flex">
                  <ServiceCard
                    title={item.title}
                    slug={item.slug}
                    opacity={sideOpacity}
                    scale={sideScale}
                    borderRadius={borderRadius}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: static hero + service links */}
      <section
        className="md:hidden relative overflow-hidden"
        style={{ background: HERO.sectionBg }}
      >
        <div className="min-h-[70vh] flex flex-col justify-center px-5 sm:px-8 py-12">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <h2
              className="font-matrix text-[clamp(2.5rem,12vw,3.75rem)] font-bold leading-[0.85] text-center whitespace-nowrap opacity-[0.07] max-w-full px-2"
              style={{ color: HERO.text }}
            >
              CODE1618
            </h2>
          </div>

          <div className="relative z-10">
            <Link href="/services">
              <h1 className="font-heading text-[clamp(17px,4.8vw,30px)] leading-[1.06] tracking-tight mb-4">
                <span style={{ color: HERO.text }}>ВЕБ-СЕРВИСЫ</span>
                <br />
                <span style={{ color: HERO.textStrong }}>МОБИЛЬНЫЕ ПРИЛОЖЕНИЯ</span>
                <br />
                <span className="text-[0.75em] tracking-[0.1em] mt-1 inline-block" style={{ color: HERO.muted }}>
                  РАЗРАБАТЫВАЕМ
                </span>
              </h1>
            </Link>
            <p
              className="text-[11px] uppercase tracking-[0.2em] max-w-sm leading-relaxed mb-6"
              style={{ color: HERO.muted }}
            >
              Корпоративный софт · Web-сервисы · Интеграции
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-300 active:scale-95 border"
              style={{
                borderColor: HERO.border,
                color: HERO.text,
                backgroundColor: "#fafafa",
              }}
            >
              Услуги
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="px-5 sm:px-8 pb-8">
          <p
            className="text-[9px] uppercase tracking-[0.25em] mb-4"
            style={{ color: "#888" }}
          >
            Направления
          </p>
          <div className="border-t border-[rgba(0,0,0,0.08)]">
            {HERO_ITEMS.map((item, i) => (
              <Link
                key={item.slug + i}
                href={item.slug}
                className="flex items-center justify-between py-4 border-b border-[rgba(0,0,0,0.06)] last:border-0 group"
              >
                <span className="text-sm uppercase tracking-[0.08em] text-[#8e8e8e] group-hover:text-[#262626] transition-colors">
                  {item.title}
                </span>
                <ArrowRight size={14} className="text-[#888]" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
