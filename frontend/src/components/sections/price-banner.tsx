"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, ListChecks, Zap, Shield, Clock, Award } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

const ADVANTAGES = [
  { icon: Zap, label: "Продуктовая команда", desc: "Дизайн, разработка, QA — в одном контуре" },
  { icon: Shield, label: "Договор и прозрачность", desc: "Фиксируем объём, сроки и формат оплаты" },
  { icon: Clock, label: "Сроки по этапам", desc: "Дорожная карта и регулярные демо" },
  { icon: Award, label: "Гарантия на софт", desc: "Сопровождение после запуска по договору" },
];

export function PriceBannerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [briefHovered, setBriefHovered] = useState(false);
  const [priceHovered, setPriceHovered] = useState(false);
  const { isDark } = useTheme();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionRef} className="relative" style={{ height: "200vh" }}>
      <div
        className="sticky top-0 h-[100dvh] overflow-hidden"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
              : "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            top: 0,
            right: "38%",
            bottom: 0,
            width: "1px",
            background: isDark
              ? "linear-gradient(180deg, transparent 10%, rgba(255,255,255,0.12) 50%, transparent 90%)"
              : "linear-gradient(180deg, transparent 10%, rgba(0,0,0,0.12) 50%, transparent 90%)",
            transform: "rotate(15deg) scaleY(1.4)",
            transformOrigin: "top center",
          }}
        />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 px-5 sm:px-8 md:px-0">
            <div
              className="md:w-[50%] lg:w-[45%] md:pl-[8%] lg:pl-[12%] md:pr-8 transition-all duration-1000"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
              }}
            >
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="w-8 h-[1px]" style={{ backgroundColor: "color-mix(in srgb, var(--text) 35%, transparent)" }} />
                <span
                  className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Прозрачное ценообразование
                </span>
              </div>

              <h2
                className="font-body text-xl font-semibold sm:text-2xl md:text-3xl leading-snug mb-4 md:mb-6"
                style={{ color: "var(--text)" }}
              >
                Стоимость без{" "}
                <span style={{ color: "var(--text)", fontWeight: 600 }}>скрытых</span> доплат
              </h2>

              <p
                className="text-xs sm:text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-md"
                style={{ color: "var(--text-muted)" }}
              >
                Фиксируем бюджет и формат в договоре. Ориентировочные ставки — на странице прайса; точную смету готовим
                после брифа и уточнения задачи.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/brief?source=price-banner"
                  onMouseEnter={() => setBriefHovered(true)}
                  onMouseLeave={() => setBriefHovered(false)}
                  className="group relative flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full overflow-hidden transition-all duration-500"
                  style={{
                    backgroundColor: briefHovered ? "var(--text)" : "transparent",
                    border: "1px solid var(--border)",
                  }}
                >
                  <MessageSquare
                    size={16}
                    className="transition-colors duration-500"
                    style={{ color: briefHovered ? "var(--bg)" : "var(--text-muted)" }}
                  />
                  <span
                    className="font-matrix text-xs sm:text-sm uppercase tracking-[0.1em] transition-colors duration-500"
                    style={{ color: briefHovered ? "var(--bg)" : "var(--text)" }}
                  >
                    Запросить оценку
                  </span>
                </Link>

                <Link
                  href="/price"
                  onMouseEnter={() => setPriceHovered(true)}
                  onMouseLeave={() => setPriceHovered(false)}
                  className="group flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all duration-500"
                  style={{
                    backgroundColor: priceHovered ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)") : "transparent",
                    border: "1px solid var(--border)",
                  }}
                >
                  <ListChecks
                    size={16}
                    className="transition-colors duration-500"
                    style={{ color: priceHovered ? "var(--text)" : "var(--text-muted)" }}
                  />
                  <span
                    className="font-matrix text-xs sm:text-sm uppercase tracking-[0.1em] transition-colors duration-500"
                    style={{ color: priceHovered ? "var(--text)" : "var(--text-muted)" }}
                  >
                    Смотреть ставки
                  </span>
                </Link>
              </div>
            </div>

            <div
              className="md:w-[50%] lg:w-[45%] md:pr-[8%] lg:pr-[12%] md:pl-8 transition-all duration-1000 delay-300"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
              }}
            >
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                {ADVANTAGES.map((adv, i) => {
                  const Icon = adv.icon;
                  return (
                    <div
                      key={i}
                      className="group p-4 sm:p-5 md:p-6 rounded-2xl transition-all duration-500 hover:scale-[1.03]"
                      style={{
                        backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                        border: "1px solid var(--border)",
                        transitionDelay: `${i * 100}ms`,
                      }}
                    >
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-500 group-hover:scale-110"
                        style={{
                          backgroundColor: "color-mix(in srgb, var(--text) 8%, transparent)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <Icon size={16} style={{ color: "var(--text-muted)" }} />
                      </div>
                      <h4
                        className="font-matrix text-xs sm:text-sm uppercase tracking-wide mb-1"
                        style={{ color: "var(--text)" }}
                      >
                        {adv.label}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {adv.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="py-4 sm:py-5 md:py-6 border-t text-center transition-all duration-1000 delay-500"
            style={{
              borderColor: "var(--border)",
              opacity: visible ? 1 : 0,
            }}
          >
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>
              7+ лет в разработке • 45+ проектов • Прозрачные этапы и смета по ТЗ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
