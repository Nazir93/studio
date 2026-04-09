import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { AiAutomationContent } from "./content";

const SERVICE_SLUG = "/services/ai-automation";

export const metadata: Metadata = {
  title: `ИИ, Monday.com и цифровые сотрудники | ${SITE_NAME}`,
  description:
    "Внедрение Monday.com, настройка процессов, AI-ассистенты и роботизация рутины для маркетинга, продаж и операционки. Студия CODE 1.618.",
  keywords: [
    "Monday.com внедрение",
    "AI сотрудники",
    "автоматизация бизнеса",
    "RPA",
    "цифровые роботы",
    SITE_NAME,
  ],
  alternates: { canonical: SERVICE_SLUG },
  openGraph: {
    title: `ИИ и автоматизация | ${SITE_NAME}`,
    description: "Monday.com, процессы, AI-сотрудники и роботизация для вашей команды.",
    url: `${SITE_URL}${SERVICE_SLUG}`,
    type: "website",
  },
};

export default function AiAutomationPage() {
  return <AiAutomationContent />;
}
