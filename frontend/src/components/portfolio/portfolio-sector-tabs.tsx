"use client";

import Link from "next/link";
import { PORTFOLIO_SECTORS, type PortfolioSectorId } from "@/lib/portfolio-sectors";
import { cn } from "@/lib/utils";

type Props = {
  activeSector: PortfolioSectorId | null;
};

const tabBase =
  "rounded-lg px-3 py-2 font-montserrat text-[11px] font-medium transition-[color,background-color,box-shadow] md:px-3.5 md:text-xs";

export function PortfolioSectorTabs({ activeSector }: Props) {
  return (
    <div className="mb-8 md:mb-10">
      <div
        className="relative flex flex-wrap gap-1.5 gap-y-2 md:gap-2"
        role="tablist"
        aria-label="Разделы портфолио"
      >
        <Link
          href="/portfolio"
          scroll={false}
          role="tab"
          aria-selected={activeSector === null}
          className={cn(
            tabBase,
            activeSector === null
              ? "text-[var(--text)] shadow-sm"
              : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]/60 hover:text-[var(--text)]"
          )}
          style={{
            backgroundColor: activeSector === null ? "var(--bg-secondary)" : "transparent",
          }}
        >
          Все
        </Link>
        {PORTFOLIO_SECTORS.map((s) => {
          const on = activeSector === s.id;
          return (
            <Link
              key={s.id}
              href={`/portfolio?sector=${s.id}`}
              scroll={false}
              role="tab"
              aria-selected={on}
              className={cn(
                tabBase,
                on
                  ? "text-[var(--text)] shadow-sm"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-secondary)]/60 hover:text-[var(--text)]"
              )}
              style={{
                backgroundColor: on ? "var(--bg-secondary)" : "transparent",
              }}
            >
              {s.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
