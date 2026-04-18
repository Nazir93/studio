import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { SmartContractsContent } from "./content";

const SERVICE_SLUG = "/services/smart-contracts";

export const metadata: Metadata = {
  title: `Разработка смарт-контрактов | ${SITE_NAME}`,
  description:
    "Проектирование и разработка смарт-контрактов для EVM: Solidity, тесты, деплой, интеграция с веб-приложениями и процессы безопасного обновления.",
  alternates: { canonical: SERVICE_SLUG },
  openGraph: {
    title: `Смарт-контракты и Web3 — ${SITE_NAME}`,
    description: "Solidity, Hardhat, Foundry, аудит логики и сопровождение после запуска.",
    url: `${SITE_URL}${SERVICE_SLUG}`,
    type: "website",
  },
};

export default function SmartContractsPage() {
  return <SmartContractsContent />;
}
