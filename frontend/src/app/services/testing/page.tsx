import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { TestingContent } from "./content";

const SERVICE_NAME = "Тестирование ПО, сайтов и приложений";
const SERVICE_SLUG = "/services/testing";

export const metadata: Metadata = {
  title: `${SERVICE_NAME} — ручное и автоматизированное QA | ${SITE_NAME}`,
  description: `Ручное и автоматизированное тестирование сайтов, приложений, ПО и API. Проверка работ подрядчиков, QA/QC, Scrum. 20+ проектов, middle+ специалисты.`,
  keywords: [
    "тестирование ПО",
    "QA тестирование",
    "автоматизированное тестирование",
    "функциональное тестирование",
    "тестирование API",
    "тестирование мобильных приложений",
    SITE_NAME,
  ],
  openGraph: {
    title: `${SERVICE_NAME} | ${SITE_NAME}`,
    description: `Сайты, приложения, ПО, API. До 86% меньше обращений в техподдержку. S7, Т-банк, Газпромбанк.`,
    type: "website",
    url: `${SITE_URL}${SERVICE_SLUG}`,
  },
  alternates: { canonical: SERVICE_SLUG },
};

export default function TestingPage() {
  return <TestingContent />;
}
