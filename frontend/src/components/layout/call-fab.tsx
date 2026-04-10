"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Круг «Обсудить проект» на всех страницах кроме главной и /brief.
 * Не пересекается с нижним таббаром (отступ снизу).
 */
export function CallFab() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/brief") return null;

  return (
    <Link
      href="/brief?source=fab"
      className="fixed z-[60] flex h-14 w-14 flex-col items-center justify-center rounded-full border px-1.5 text-center shadow-lg transition-[transform,box-shadow] hover:scale-[1.04] active:scale-[0.98] sm:h-16 sm:w-16 max-lg:bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] max-lg:right-[max(1rem,env(safe-area-inset-right,0px))] lg:bottom-8 lg:right-8"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
      aria-label="Обсудить проект — заявка"
    >
      <span className="font-akony text-[7px] font-normal uppercase leading-[1.05] tracking-[0.06em] sm:text-[8px]">
        Обсудить
      </span>
      <span className="font-akony mt-0.5 text-[7px] font-normal uppercase leading-[1.05] tracking-[0.06em] sm:text-[8px]">
        проект
      </span>
    </Link>
  );
}
