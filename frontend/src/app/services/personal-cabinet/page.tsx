import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PersonalCabinetContent } from "./content";

const SERVICE_SLUG = "/services/personal-cabinet";

export const metadata: Metadata = {
  title: `Личные кабинеты для сотрудников и клиентов | ${SITE_NAME}`,
  description:
    "Корпоративные порталы и личные кабинеты: проектирование, UX/UI, разработка, интеграции с CRM/ERP/1С, безопасность. Работаем в формате time & material.",
  alternates: { canonical: SERVICE_SLUG },
  openGraph: {
    title: `Личные кабинеты и корпоративные сервисы | ${SITE_NAME}`,
    description: "Индивидуальное решение под вашу инфраструктуру.",
    url: `${SITE_URL}${SERVICE_SLUG}`,
    type: "website",
  },
};

export default function PersonalCabinetPage() {
  return <PersonalCabinetContent />;
}
