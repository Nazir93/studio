import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { ServicesPageContent } from "./content";

export const metadata: Metadata = {
  title: `Услуги — ${SITE_NAME}`,
  description:
    "ИИ и автоматизация, тестирование, личные кабинеты, предпроектные исследования, UX/UI, разработка, аутстаф, реклама и продвижение — полный цикл под ключ.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
