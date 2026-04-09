"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PORTFOLIO_CASES } from "@/lib/portfolio-data";
import { PortfolioSplit } from "@/components/portfolio/portfolio-split";
import { PortfolioSectorTabs } from "@/components/portfolio/portfolio-sector-tabs";
import { isPortfolioSectorId } from "@/lib/portfolio-sectors";
import { CasesVideoTitle } from "@/components/portfolio/cases-video-title";

function PortfolioPageInner() {
  const searchParams = useSearchParams();
  const sectorParam = searchParams.get("sector");
  const activeSector = isPortfolioSectorId(sectorParam) ? sectorParam : null;

  const filteredProjects = useMemo(() => {
    if (!activeSector) return PORTFOLIO_CASES;
    return PORTFOLIO_CASES.filter((p) => p.sector === activeSector);
  }, [activeSector]);

  return (
    <>
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
        <PortfolioSplit projects={filteredProjects} showPreview={activeSector !== null} />
      )}
    </>
  );
}

export function PortfolioPageContent() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28" style={{ backgroundColor: "var(--bg)" }}>
      <div className="container relative z-10 mx-auto">
        <CasesVideoTitle />

        <div className="font-montserrat text-[15px] leading-normal antialiased sm:text-[15px] md:text-base">
          <Suspense
            fallback={
              <div className="animate-pulse font-montserrat text-sm" style={{ color: "var(--text-muted)" }}>
                Загрузка…
              </div>
            }
          >
            <PortfolioPageInner />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
