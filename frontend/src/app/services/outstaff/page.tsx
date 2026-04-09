import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { OutstaffContent } from "./content";

const SERVICE_NAME = "Аутстаф IT-специалистов";
const SERVICE_SLUG = "/services/outstaff";

export const metadata: Metadata = {
  title: `${SERVICE_NAME} — разработчики, дизайнеры, аналитики | ${SITE_NAME}`,
  description: `Аутстаффинг IT-специалистов: backend, frontend, mobile разработчики, дизайнеры, QA, аналитики, DevOps. Усилим вашу команду или соберём с нуля. Прозрачные цены без скрытых доплат.`,
  keywords: [
    "аутстаф",
    "аутстаффинг",
    "аутстаф разработчиков",
    "аренда разработчиков",
    "IT аутстаффинг",
    "аутстаф программистов",
    "аутстаф дизайнеров",
    "аутстаф тестировщиков",
    SITE_NAME,
  ],
  openGraph: {
    title: `${SERVICE_NAME} | ${SITE_NAME}`,
    description: `Аутстаффинг IT-специалистов: разработчики, дизайнеры, аналитики, тестировщики. Прозрачные ставки от 2 000 ₽/час.`,
    type: "website",
    url: `${SITE_URL}${SERVICE_SLUG}`,
  },
  alternates: { canonical: SERVICE_SLUG },
};

export default function OutstaffPage() {
  return <OutstaffContent />;
}
