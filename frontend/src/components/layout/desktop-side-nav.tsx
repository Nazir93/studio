"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Send, Sun, Moon } from "lucide-react";
import { SOCIAL_LINKS, PHONE, PHONE_RAW, EMAIL } from "@/lib/constants";
import { WhatsAppGlyph, MaxMessengerIcon } from "@/components/ui/contact-channels-bar";
import { NAV_SECTIONS } from "@/lib/nav-config";
import {
  FONT_UI_MONO_NAV,
  FONT_UI_MONO_MENU_BODY,
  FONT_UI_MONO_CONTACT,
} from "@/lib/ui-typography";
import { useTheme } from "@/lib/theme-context";

const socialBtnClass =
  "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 hover:scale-110 shrink-0";
const socialIconClass = "w-[18px] h-[18px]";

/** Правая полоса + нижняя панель на главной (lg+): отступ контента, чтобы не перекрывать текст и блоки */
export const HOME_DESKTOP_SIDE_NAV_INSET_CLASS = "lg:pr-[60px] lg:pb-[4.25rem]";

/**
 * Герой (первый section) ушёл вверх → показываем нижнюю панель и правый столбец.
 * Состояние же используется для отступов контента на главной.
 */
export function useHomeSideNavVisibility() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const hero =
        document.querySelector("main > *:first-child section") ?? document.querySelector("section");
      if (!hero) return;
      setVisible(hero.getBoundingClientRect().bottom <= 0);
    };

    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    updateVisibility();
    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return visible;
}

export function DesktopSideNav({ visible }: { visible: boolean }) {
  const [btnHovered, setBtnHovered] = useState(false);
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
    <>
      {/* ═══ Bottom horizontal navbar (desktop only) ═══ */}
      <div
        className="fixed bottom-0 left-0 right-[60px] z-[45] hidden lg:block transition-all duration-500"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(100%)",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        <div
          className="backdrop-blur-xl border-t"
          style={{
            backgroundColor: isDark ? "rgba(10,10,10,0.92)" : "rgba(255,255,255,0.92)",
            borderColor: "var(--border)",
          }}
        >
          <div className="container mx-auto flex items-center justify-between py-3">
            <Link href="/" className="relative w-20 h-8 sm:w-24 sm:h-9 shrink-0 flex items-center">
              <Image
                src="/logo.png"
                alt="CODE1618"
                fill
                className="object-contain object-left"
                sizes="(max-width: 640px) 80px, 96px"
              />
            </Link>

            <div className={`flex items-center gap-3 ${FONT_UI_MONO_CONTACT}`} style={{ color: "var(--text-muted)" }}>
              <a href={`tel:${PHONE_RAW}`} className="hover:opacity-100 transition-opacity">{PHONE}</a>
              <span style={{ color: "var(--text-subtle)" }}>/</span>
              <a href={`mailto:${EMAIL}`} className="hover:opacity-100 transition-opacity max-w-[200px] truncate xl:max-w-none xl:overflow-visible xl:whitespace-normal">{EMAIL}</a>
            </div>

            <nav className="flex items-center gap-6 xl:gap-8">
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
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-3">
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
                            onClick={() => setOpenSection(null)}
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
          </div>
        </div>
      </div>

      {/* ═══ Правый столбец на всю высоту окна ═══ */}
      <div
        className="fixed inset-y-0 right-0 z-[45] hidden h-[100dvh] min-h-0 w-[60px] flex-col border-l border-[var(--border)] transition-all duration-500 lg:flex"
        style={{
          paddingTop: "max(0.75rem, env(safe-area-inset-top, 0px))",
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(100%)",
          pointerEvents: visible ? "auto" : "none",
          backgroundColor: isDark ? "rgba(10,10,10,0.92)" : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-between gap-4 px-0 py-2">
          {/* Соцсети — Telegram, WhatsApp, MAX */}
          <div className="flex shrink-0 flex-col items-center gap-3">
            {SOCIAL_LINKS.telegram && (
              <a
                href={SOCIAL_LINKS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className={`${socialBtnClass} hover:border-[#0088cc]`}
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                aria-label="Telegram"
                title="Telegram"
              >
                <Send size={17} strokeWidth={1.75} className={socialIconClass} />
              </a>
            )}
            {SOCIAL_LINKS.whatsapp && (
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className={`${socialBtnClass} hover:border-[#25D366]`}
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <WhatsAppGlyph size={18} className={socialIconClass} />
              </a>
            )}
            {SOCIAL_LINKS.max && (
              <a
                href={SOCIAL_LINKS.max}
                target="_blank"
                rel="noopener noreferrer"
                className={`${socialBtnClass} hover:border-[var(--accent)]`}
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                aria-label="MAX"
                title="MAX"
              >
                <MaxMessengerIcon size={18} className={socialIconClass} />
              </a>
            )}
          </div>

          <Link
            href="/brief?source=side-nav"
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            className="flex min-h-0 min-w-0 flex-1 items-center justify-center py-2 transition-all duration-300"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
            }}
          >
            <span
              className={`font-akony text-[9px] uppercase tracking-[0.14em] transition-colors duration-300 flex items-center gap-2`}
              style={{ color: btnHovered ? "var(--accent)" : "var(--text-muted)" }}
            >
              Обсудить проект
              <ArrowRight
                size={12}
                className="transition-transform duration-300 rotate-90"
                style={{ transform: btnHovered ? "rotate(90deg) translateX(2px)" : "rotate(90deg)" }}
              />
            </span>
          </Link>

          <div
            className="h-2 w-2 shrink-0 rounded-full transition-colors duration-500"
            style={{ backgroundColor: "var(--accent)" }}
            aria-hidden
          />
        </div>
      </div>
    </>
  );
}
