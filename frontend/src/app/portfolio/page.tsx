import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { isPortfolioSectorId } from "@/lib/portfolio-sectors";
import { PortfolioPageContent } from "./content";

export const metadata: Metadata = {
  title: `Портфолио — реализованные проекты`,
  description: `Реализованные проекты ${SITE_NAME}: электромонтаж, умный дом, видеонаблюдение, акустика для ресторанов, офисов и квартир.`,
  alternates: { canonical: "/portfolio" },
};

function parseSectorParam(raw: string | string[] | undefined): string | undefined {
  if (raw === undefined) return undefined;
  return typeof raw === "string" ? raw : raw[0];
}

/**
 * searchParams читаются на сервере — клиенту не нужен useSearchParams + Suspense,
 * из‑за которых при переходах на /portfolio часто мелькал fallback «Загрузка…».
 */
export default function PortfolioPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const sectorParam = parseSectorParam(searchParams.sector);
  const activeSector = isPortfolioSectorId(sectorParam) ? sectorParam : null;

  return <PortfolioPageContent activeSector={activeSector} />;
}
