import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { UxUiDesignContent } from "./content";

const SERVICE_SLUG = "/services/ux-ui-design";

export const metadata: Metadata = {
  title: `UX/UI-дизайн — интерфейсы сайтов и приложений | ${SITE_NAME}`,
  description:
    "Удобные и эстетичные интерфейсы: сайты, мобильные приложения и сервисы. UX-исследования, UI-киты, прототипы, дизайн под нагрузку и аутстаф команды.",
  alternates: { canonical: SERVICE_SLUG },
  openGraph: {
    title: `UX/UI-дизайн | ${SITE_NAME}`,
    description: "Создаём интерфейсы, которые помогают компаниям расти.",
    url: `${SITE_URL}${SERVICE_SLUG}`,
    type: "website",
  },
};

export default function UxUiDesignPage() {
  return <UxUiDesignContent />;
}
