"use client";

import { useMemo } from "react";
import { PORTFOLIO_CASES } from "@/lib/portfolio-data";
import { PortfolioSplit } from "@/components/portfolio/portfolio-split";
import { PortfolioSectorTabs } from "@/components/portfolio/portfolio-sector-tabs";
import type { PortfolioSectorId } from "@/lib/portfolio-sectors";
import { CasesVideoTitle } from "@/components/portfolio/cases-video-title";

type Props = {
  /** С серверной страницы — без useSearchParams / Suspense, без «мигания» при переходах */
  activeSector: PortfolioSectorId | null;
};

export function PortfolioPageContent({ activeSector }: Props) {
  const filteredProjects = useMemo(() => {
    if (!activeSector) return PORTFOLIO_CASES;
    return PORTFOLIO_CASES.filter((p) => p.sector === activeSector);
  }, [activeSector]);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container relative z-10 mx-auto">
        <CasesVideoTitle />

        <div className="font-montserrat text-[15px] leading-normal antialiased sm:text-[15px] md:text-base">
          <PortfolioSectorTabs activeSector={activeSector} />

          {filteredProjects.length === 0 ? (
            <div
              className="rounded-2xl border px-6 py-12 text-center font-montserrat md:px-10"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              <p className="text-base md:text-lg">В этом разделе пока нет опубликованных кейсов.</p>
              <p className="mt-2 text-sm opacity-80">Откройте полный список или выберите другой раздел.</p>
            </div>
          ) : (
            <PortfolioSplit projects={filteredProjects} />
          )}
        </div>
      </div>
    </section>
  );
}
