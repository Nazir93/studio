import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { DevelopmentContent } from "./content";

const SERVICE_NAME = "Разработка программного обеспечения на заказ";
const SERVICE_SLUG = "/services/development";

export const metadata: Metadata = {
  title: `${SERVICE_NAME} — приложения и веб-сервисы | ${SITE_NAME}`,
  description: `Заказная разработка: Frontend, Backend, iOS, Android, API. Приложения и веб-сервисы со множеством интеграций. 300+ реализованных проектов для крупного бизнеса.`,
  keywords: [
    "разработка на заказ",
    "заказная разработка",
    "разработка приложений",
    "веб-разработка",
    "мобильная разработка",
    "разработка API",
    "frontend разработка",
    "backend разработка",
    SITE_NAME,
  ],
  openGraph: {
    title: `${SERVICE_NAME} | ${SITE_NAME}`,
    description: `Frontend, Backend, iOS, Android, API. 300+ проектов, middle+ квалификация. Сбер, МТС и другие крупные бренды уже с нами.`,
    type: "website",
    url: `${SITE_URL}${SERVICE_SLUG}`,
  },
  alternates: { canonical: SERVICE_SLUG },
};

export default function DevelopmentPage() {
  return <DevelopmentContent />;
}
