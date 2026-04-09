"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ViewAllCases() {
  return (
    <div
      data-navbar
      className="border-b"
      style={{
        backgroundColor: "var(--bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="container mx-auto py-4 sm:py-5 flex items-center justify-center">
        <Link
          href="/portfolio"
          className="group flex items-center gap-2 font-matrix font-normal text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.12em] transition-colors duration-300 hover:text-[var(--accent)]"
          style={{ color: "var(--text-muted)" }}
        >
          Смотреть все кейсы
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </div>
  );
}
