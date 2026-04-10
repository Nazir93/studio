"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FONT_UI_AKONY_CTA_LARGE } from "@/lib/ui-typography";

export function LandingCTA() {
  const [hover, setHover] = useState(false);

  return (
    <section className="py-16 sm:py-20 md:py-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container mx-auto text-center">
        <h2 className="font-body text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl mb-4 sm:mb-6 leading-snug">
          Обсудим ваш проект?
        </h2>
        <p
          className="font-body text-xs sm:text-sm md:text-base mb-8 sm:mb-10 max-w-lg mx-auto"
          style={{ color: "var(--text-muted)" }}
        >
          Оставьте заявку — менеджер студии свяжется с вами и уточнит задачи по сайту, сервису или автоматизации
        </p>
        <Link
          href="/brief?source=landing-cta"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="group inline-flex items-center justify-between gap-6 sm:gap-10 px-6 sm:px-12 py-4 sm:py-6 transition-all duration-500 relative overflow-hidden max-w-full w-full sm:w-auto sm:min-w-[min(100%,28rem)]"
          style={{
            border: "1px solid color-mix(in srgb, var(--text) 18%, var(--border))",
            borderRadius: "32px",
            boxShadow: hover
              ? "0 0 0 1px color-mix(in srgb, var(--text) 12%, transparent), 0 20px 40px -18px color-mix(in srgb, var(--text) 12%, transparent)"
              : "0 0 0 1px transparent",
          }}
        >
          <div
            className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{ backgroundColor: "var(--text)" }}
          />
          <span
            className={`relative z-10 ${FONT_UI_AKONY_CTA_LARGE} transition-colors duration-700`}
            style={{ color: hover ? "var(--bg)" : "var(--text)" }}
          >
            Обсудить проект
          </span>
          <span
            className="relative z-10 flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-700"
            style={{
              borderColor: hover ? "color-mix(in srgb, var(--bg) 35%, transparent)" : "var(--border)",
              backgroundColor: hover ? "color-mix(in srgb, var(--bg) 12%, transparent)" : "transparent",
            }}
          >
            <ArrowRight
              size={18}
              strokeWidth={1.5}
              className="transition-transform duration-500 group-hover:translate-x-0.5"
              style={{ color: hover ? "var(--bg)" : "var(--text)" }}
            />
          </span>
        </Link>
      </div>
    </section>
  );
}
