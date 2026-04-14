"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ViewAllServices() {
  return (
    <div
      data-navbar
      data-cursor-word="смотреть"
      className="border-b"
      style={{
        backgroundColor: "var(--bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="container mx-auto flex items-center justify-center py-3 sm:py-4">
        <Link
          href="/services"
          className="group flex items-center gap-1.5 font-matrix font-normal text-[9px] uppercase tracking-[0.1em] transition-colors duration-300 hover:text-[var(--accent)] sm:gap-2 sm:text-[10px] sm:tracking-[0.11em]"
          style={{ color: "var(--text-muted)" }}
        >
          Смотреть все услуги
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}
