"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SITE_NAME, SITE_BRAND_MARK, SITE_DOMAIN, PHONE, PHONE_RAW, EMAIL, SOCIAL_LINKS } from "@/lib/constants";
import { FONT_UI_AKONY_CTA_LARGE } from "@/lib/ui-typography";
import { cn } from "@/lib/utils";

export function Footer() {
  const pathname = usePathname();
  const [btnHovered, setBtnHovered] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn("relative", pathname === "/" && "lg:pr-[60px]")}
      style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      {/* CTA Button */}
      <div className="container mx-auto py-8 sm:py-12 md:py-16">
        <a
          href="/brief?source=footer"
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          className="group relative w-full flex items-center justify-between gap-4 px-6 sm:px-10 md:px-14 py-5 sm:py-7 md:py-9 overflow-hidden transition-shadow duration-500"
          style={{
            border: "1px solid color-mix(in srgb, var(--text) 18%, var(--border))",
            borderRadius: "32px",
            boxShadow: btnHovered
              ? "0 0 0 1px color-mix(in srgb, var(--text) 12%, transparent), 0 24px 48px -20px color-mix(in srgb, var(--text) 15%, transparent)"
              : "0 0 0 1px transparent",
          }}
        >
          <div
            className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
            style={{
              backgroundColor: "var(--text)",
              transform: btnHovered ? "scaleX(1)" : "scaleX(0)",
            }}
          />

          <span
            className={`relative z-10 ${FONT_UI_AKONY_CTA_LARGE} transition-colors duration-700 text-left`}
            style={{ color: btnHovered ? "var(--bg)" : "var(--text)" }}
          >
            Обсудить проект
          </span>

          <span
            className="relative z-10 flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-700"
            style={{
              borderColor: btnHovered ? "color-mix(in srgb, var(--bg) 35%, transparent)" : "var(--border)",
              backgroundColor: btnHovered ? "color-mix(in srgb, var(--bg) 12%, transparent)" : "transparent",
            }}
          >
            <ArrowRight
              size={20}
              strokeWidth={1.5}
              className="transition-all duration-500 group-hover:translate-x-0.5"
              style={{ color: btnHovered ? "var(--bg)" : "var(--text)" }}
            />
          </span>
        </a>
      </div>

      {/* Название бренда — читаемо CODE1618 */}
      <div className="container mx-auto px-4 pb-4 sm:px-6 sm:pb-5 md:px-8 md:pb-6">
        <h2
          className="m-0 w-full font-akony font-normal uppercase leading-[0.92] tracking-[0.08em] sm:tracking-[0.1em] select-none text-[clamp(1.05rem,4.8vw,3rem)] sm:text-[clamp(1.2rem,4.2vw,3.25rem)] md:text-[clamp(1.35rem,3.5vw,3.5rem)]"
          style={{ color: "var(--text)" }}
        >
          {SITE_BRAND_MARK}
        </h2>
        <p
          className="mt-2 font-matrix text-[9px] uppercase tracking-[0.22em] sm:text-[10px]"
          style={{ color: "var(--text-muted)" }}
        >
          {SITE_NAME}
        </p>
      </div>

      {/* Bottom bar — на мобильных отступ под фикс. таббар, иначе © уезжает под Navbar */}
      <div
        className="border-t max-lg:pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))]"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="container mx-auto py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 lg:safe-bottom">
          <p
            className="text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-[0.15em]"
            style={{ color: "var(--text-subtle)" }}
          >
            &copy; {currentYear} {SITE_NAME}
          </p>

          <div
            className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-[10px] sm:text-xs uppercase tracking-[0.1em]"
            style={{ color: "var(--text-muted)" }}
          >
            {SOCIAL_LINKS.telegram && (
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-[var(--text)]"
              >
                Telegram
              </a>
            )}
            {SOCIAL_LINKS.whatsapp && (
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-[var(--text)]"
              >
                WhatsApp
              </a>
            )}
            {SOCIAL_LINKS.max && (
              <a
                href={SOCIAL_LINKS.max}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-200 hover:text-[var(--text)]"
              >
                MAX
              </a>
            )}
            <a
              href="/privacy"
              className="transition-colors duration-200 hover:text-[var(--text)]"
            >
              Политика конфиденциальности · {SITE_DOMAIN}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="transition-colors duration-200 hover:text-[var(--text)]"
            >
              {EMAIL}
            </a>
            <a
              href={`tel:${PHONE_RAW}`}
              className="transition-colors duration-200 hover:text-[var(--text)]"
            >
              {PHONE}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
