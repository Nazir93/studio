"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { PHONE_RAW } from "@/lib/constants";

/**
 * Круглая кнопка звонка на всех страницах кроме главной и /brief.
 * Не пересекается с нижним таббаром (отступ снизу).
 */
export function CallFab() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/brief") return null;

  return (
    <Link
      href={`tel:${PHONE_RAW}`}
      className="fixed z-[60] flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-[transform,box-shadow] hover:scale-[1.04] active:scale-[0.98] sm:h-14 sm:w-14 max-lg:bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] max-lg:right-[max(1rem,env(safe-area-inset-right,0px))] lg:bottom-8 lg:right-8"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
      aria-label={`Позвонить ${PHONE_RAW}`}
    >
      <Phone className="h-6 w-6" strokeWidth={1.5} aria-hidden />
    </Link>
  );
}
