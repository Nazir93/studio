"use client";

import { FONT_UI_MONO_NAV } from "@/lib/ui-typography";
import { usePathname } from "next/navigation";

/** pointer-events-none: иначе на iOS/WebKit длинные штрихи SVG (особенно у «Портфолио») ломают hit-test у <Link> */
const NAV_ITEMS = [
  {
    href: "/",
    label: "Главная",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none h-5 w-5 shrink-0">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/services",
    label: "Услуги",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none h-5 w-5 shrink-0">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/portfolio",
    label: "Портфолио",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none h-5 w-5 shrink-0">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    href: "/contacts",
    label: "Контакты",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none h-5 w-5 shrink-0">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mobile-bottom-nav-shell fixed bottom-0 left-0 right-0 z-50 border-t safe-bottom lg:hidden"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-stretch justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <a
              key={item.href}
              href={item.href}
              className="relative z-10 flex min-h-[48px] min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 px-1 py-2 transition-colors duration-200 sm:min-h-[52px]"
              style={{
                color: isActive ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {item.icon}
              <span className={`${FONT_UI_MONO_NAV} w-full truncate text-center tracking-[0.14em]`}>
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
