"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { X, Sun, Moon } from "lucide-react";
import { PHONE, PHONE_RAW, EMAIL, SITE_NAME } from "@/lib/constants";
import { NAV_SECTIONS } from "@/lib/nav-config";
import {
  FONT_UI_MONO_NAV,
  FONT_UI_MONO_SECTION,
  FONT_UI_MONO_CTA,
  FONT_UI_AKONY_CTA,
  FONT_UI_MONO_MENU_BODY,
  FONT_UI_MONO_CONTACT,
} from "@/lib/ui-typography";
import { useTheme } from "@/lib/theme-context";

function buildGridPath(
  cols: number, rows: number, cellW: number, cellH: number,
  startCol: number, startRow: number, seed: number
): string {
  let c = startCol;
  let r = startRow;
  const pts: [number, number][] = [[c * cellW, r * cellH]];
  let rng = seed;
  const next = () => { rng = (rng * 16807 + 11) % 2147483647; return (rng & 0xffff) / 0xffff; };

  const steps = 14 + Math.floor(next() * 8);
  let dir: "h" | "v" = next() > 0.5 ? "h" : "v";
  for (let s = 0; s < steps; s++) {
    if (dir === "h") {
      const move = next() > 0.5 ? 1 : -1;
      const dist = 1 + Math.floor(next() * 3);
      for (let d = 0; d < dist; d++) {
        c += move;
        if (c < 0) c = 0;
        if (c > cols) c = cols;
        pts.push([c * cellW, r * cellH]);
      }
      dir = "v";
    } else {
      const move = next() > 0.5 ? 1 : -1;
      const dist = 1 + Math.floor(next() * 2);
      for (let d = 0; d < dist; d++) {
        r += move;
        if (r < 0) r = 0;
        if (r > rows) r = rows;
        pts.push([c * cellW, r * cellH]);
      }
      dir = "h";
    }
  }
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
}

const GRID_W = 600;
const GRID_H = 400;
const CELL = 40;
const COLS = GRID_W / CELL;
const ROWS = GRID_H / CELL;

const SPARK_PATHS = [
  buildGridPath(COLS, ROWS, CELL, CELL, 0, 2, 42),
  buildGridPath(COLS, ROWS, CELL, CELL, 2, 0, 137),
  buildGridPath(COLS, ROWS, CELL, CELL, COLS, 5, 271),
  buildGridPath(COLS, ROWS, CELL, CELL, 8, ROWS, 999),
  buildGridPath(COLS, ROWS, CELL, CELL, 5, 3, 555),
];

function CircuitGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${GRID_W} ${GRID_H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="spark-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Grid lines — horizontal */}
        {Array.from({ length: ROWS + 1 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1={0} y1={i * CELL} x2={GRID_W} y2={i * CELL}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
        ))}
        {/* Grid lines — vertical */}
        {Array.from({ length: COLS + 1 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={i * CELL} y1={0} x2={i * CELL} y2={GRID_H}
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
        ))}

        {/* Spark paths */}
        {SPARK_PATHS.map((d, i) => (
          <g key={i}>
            {/* Glow */}
            <path
              d={d}
              fill="none"
              stroke="rgba(250,204,21,0.15)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              filter="url(#spark-glow)"
              strokeDasharray="80 1200"
              className="electric-snake"
              style={{
                animationDelay: `${i * 300}ms`,
                animationDuration: `${10 + i * 1.5}s`,
                ["--path-len" as string]: 1280,
              }}
            />
            {/* Core */}
            <path
              d={d}
              fill="none"
              stroke="rgba(232,212,139,0.25)"
              strokeWidth="0.8"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="80 1200"
              className="electric-snake"
              style={{
                animationDelay: `${i * 300}ms`,
                animationDuration: `${10 + i * 1.5}s`,
                ["--path-len" as string]: 1280,
              }}
            />
          </g>
        ))}

        {/* Small dots at some intersections */}
        {[
          [3, 2], [7, 4], [11, 6], [5, 8], [9, 1],
          [1, 5], [13, 3], [6, 7], [10, 9], [4, 4],
        ].map(([cx, cy], i) => (
          <circle
            key={`dot-${i}`}
            cx={cx * CELL}
            cy={cy * CELL}
            r="1.5"
            fill="rgba(250,204,21,0.08)"
          />
        ))}
      </svg>
    </div>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleOpenMenu = () => setIsOpen(true);
    window.addEventListener("open-mobile-menu", handleOpenMenu);
    return () => window.removeEventListener("open-mobile-menu", handleOpenMenu);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  /**
   * Плавающая полоска с вторым логотипом отключена: на главной после скролла она накладывалась
   * на sticky NavBar (моб.) и DesktopSideNav (десктоп) — двойной логотип и «гапка».
   * Меню: NavBar, боковая панель, полноэкранное меню по событию open-mobile-menu.
   */
  const showFloatingChrome = false;

  const headerColor = isHome ? "#FFFFFF" : "var(--text)";
  const headerBorderColor = isHome ? "rgba(255,255,255,0.2)" : "var(--border)";
  const headerMutedColor = isHome ? "rgba(255,255,255,0.6)" : "var(--text-muted)";

  return (
    <>
      {/* Минимальная плавающая шапка: выключена — иначе дубль логотипа со sticky NavBar на главной */}
      <header
        className={showFloatingChrome ? "fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-500" : "hidden"}
        aria-hidden={!showFloatingChrome}
      >
        <div className="container mx-auto flex items-center justify-between py-3 sm:py-4 md:py-5">
          {/* Logo */}
          <Link href="/" className="relative w-20 h-8 sm:w-24 sm:h-9 pointer-events-auto flex items-center shrink-0" aria-label={SITE_NAME}>
            <Image
              src="/logo.png"
              alt={SITE_NAME}
              fill
              className="object-contain object-left"
              sizes="(max-width: 640px) 80px, 96px"
            />
          </Link>

          {/* Right: theme toggle + hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-3 pointer-events-auto">
            <button
              onClick={toggleTheme}
              className="w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border"
              style={{ borderColor: headerBorderColor, transition: "border-color 0.3s" }}
              aria-label="Переключить тему"
            >
              {isDark ? (
                <Sun size={15} style={{ color: headerMutedColor }} />
              ) : (
                <Moon size={15} style={{ color: headerMutedColor }} />
              )}
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="w-11 h-11 sm:w-12 sm:h-12 flex flex-col items-center justify-center gap-[5px] sm:gap-[6px]"
              aria-label="Открыть меню"
            >
              <span className="block w-6 sm:w-7 h-[2px] transition-colors duration-300" style={{ backgroundColor: headerColor }} />
              <span className="block w-6 sm:w-7 h-[2px] transition-colors duration-300" style={{ backgroundColor: headerColor }} />
              <span className="block w-4 sm:w-5 h-[2px] self-start ml-[7px] sm:ml-[10px] transition-colors duration-300" style={{ backgroundColor: headerColor }} />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto"
          style={{ backgroundColor: "var(--bg)" }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="fixed z-[70] flex h-12 w-12 items-center justify-center"
            style={{
              top: "max(1rem, env(safe-area-inset-top, 0px))",
              right: "max(1rem, env(safe-area-inset-right, 0px))",
            }}
            aria-label="Закрыть меню"
          >
            <X size={28} style={{ color: "var(--text)" }} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="fixed z-[70] flex h-12 w-12 items-center justify-center rounded-full border"
            style={{
              top: "max(1rem, env(safe-area-inset-top, 0px))",
              right: "calc(3.5rem + max(1rem, env(safe-area-inset-right, 0px)))",
              borderColor: "var(--border)",
            }}
            aria-label="Переключить тему"
          >
            {isDark ? (
              <Sun size={16} style={{ color: "var(--text-muted)" }} />
            ) : (
              <Moon size={16} style={{ color: "var(--text-muted)" }} />
            )}
          </button>

          <nav className="container mx-auto pt-16 sm:pt-20 pb-4 sm:pb-6 flex flex-col min-h-full safe-bottom">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:gap-x-10 sm:gap-y-7">
              {NAV_SECTIONS.map((section) => (
                <div key={section.label}>
                  <h3
                    className={`${FONT_UI_MONO_SECTION} mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b`}
                    style={{ color: "var(--text)", borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    {section.label}
                  </h3>
                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`${FONT_UI_MONO_MENU_BODY} transition-colors py-1 min-h-[36px] flex items-center`}
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-1 min-h-4" />

            {/* CTA + contacts */}
            <div className="pt-4 sm:pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <Link
                href="/brief?source=header-menu"
                onClick={() => setIsOpen(false)}
                className={`w-full mt-2 sm:mt-4 py-4 sm:py-5 ${FONT_UI_AKONY_CTA} text-center rounded-full mb-4 sm:mb-6 min-h-[52px] border transition-colors duration-300 hover:opacity-95`}
                style={{
                  backgroundColor: "var(--text)",
                  color: "var(--bg)",
                  borderColor: "color-mix(in srgb, var(--text) 40%, var(--border))",
                }}
              >
                Обсудить проект
              </Link>
              <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 ${FONT_UI_MONO_CONTACT}`}>
                <a href={`tel:${PHONE_RAW}`} className="min-h-[36px] flex items-center" style={{ color: "var(--text-muted)" }}>
                  {PHONE}
                </a>
                <a href={`mailto:${EMAIL}`} className="min-h-[36px] flex items-center break-all" style={{ color: "var(--text-muted)" }}>
                  {EMAIL}
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

export function NavBar() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const handleEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenSection(label);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenSection(null), 200);
  };

  return (
    <div
      className="safe-sticky-top sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        backgroundColor: isDark ? "rgba(10,10,10,0.9)" : "rgba(255,255,255,0.9)",
        borderColor: "var(--border)",
      }}
    >
      <div className="container mx-auto flex items-center justify-between py-2.5 sm:py-3 md:py-4">
        {/* Left: logo + contacts */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="relative w-20 h-8 sm:w-24 sm:h-9 shrink-0 flex items-center" aria-label={SITE_NAME}>
            <Image
              src="/logo.png"
              alt={SITE_NAME}
              fill
              className="object-contain object-left"
              sizes="(max-width: 640px) 80px, 96px"
            />
          </Link>
          <div className={`hidden md:flex items-center gap-3 ${FONT_UI_MONO_CONTACT}`} style={{ color: "var(--text-muted)" }}>
            <a href={`tel:${PHONE_RAW}`} className="hover:opacity-100 transition-opacity">{PHONE}</a>
            <span style={{ color: "var(--text-subtle)" }}>/</span>
            <a href={`mailto:${EMAIL}`} className="hover:opacity-100 transition-opacity max-w-[200px] truncate xl:max-w-none xl:overflow-visible xl:whitespace-normal">{EMAIL}</a>
          </div>
        </div>

        {/* Right: Navigation with dropdowns + switch */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {NAV_SECTIONS.map((section) => (
            <div
              key={section.label}
              className="relative"
              onMouseEnter={() => handleEnter(section.label)}
              onMouseLeave={handleLeave}
            >
              <button
                type="button"
                className={`${FONT_UI_MONO_NAV} transition-colors py-2`}
                style={{ color: openSection === section.label ? "var(--text)" : "var(--text-muted)" }}
              >
                {section.label}
              </button>

              {openSection === section.label && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                  <div
                    className={`py-2 backdrop-blur-xl ${section.label === "Кейсы" ? "min-w-[min(100vw-2rem,320px)]" : "min-w-[240px]"}`}
                    style={{
                      backgroundColor: isDark ? "rgba(20,20,20,0.95)" : "rgba(255,255,255,0.95)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                    }}
                  >
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`${FONT_UI_MONO_MENU_BODY} block px-5 py-2.5 transition-colors duration-200`}
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--text)";
                          e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--text-muted)";
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="ml-2 w-9 h-9 rounded-full flex items-center justify-center border transition-colors"
            style={{ borderColor: "var(--border)" }}
            aria-label="Переключить тему"
          >
            {isDark ? (
              <Sun size={14} style={{ color: "var(--text-muted)" }} />
            ) : (
              <Moon size={14} style={{ color: "var(--text-muted)" }} />
            )}
          </button>
        </nav>

        {/* Mobile: theme + hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center border"
            style={{ borderColor: "var(--border)" }}
            aria-label="Переключить тему"
          >
            {isDark ? (
              <Sun size={14} style={{ color: "var(--text-muted)" }} />
            ) : (
              <Moon size={14} style={{ color: "var(--text-muted)" }} />
            )}
          </button>
          <button
            onClick={() => window.dispatchEvent(new Event("open-mobile-menu"))}
            className="w-10 h-10 flex flex-col items-center justify-center gap-[4px]"
            aria-label="Открыть меню"
          >
            <span className="block w-5 h-[1.5px]" style={{ backgroundColor: "var(--text)" }} />
            <span className="block w-5 h-[1.5px]" style={{ backgroundColor: "var(--text)" }} />
            <span className="block w-3.5 h-[1.5px] self-start ml-[5px]" style={{ backgroundColor: "var(--text)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
