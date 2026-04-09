import type { Metadata } from "next";
import { SITE_NAME, CITY } from "@/lib/constants";
import { PricePageContent } from "./content";

export const metadata: Metadata = {
  title: `Прайс — ставки на разработку и дизайн${CITY ? ` в ${CITY}` : ""} | ${SITE_NAME}`,
  description: `Ориентировочные ставки студии ${SITE_NAME}: аналитика, UX/UI, разработка, тестирование. Итоговая смета — после согласования ТЗ.`,
  alternates: { canonical: "/price" },
};

export default function PricePage() {
  return <PricePageContent />;
}
