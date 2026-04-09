import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { AdvertisingContent } from "./content";

const SERVICE_SLUG = "/services/advertising";

export const metadata: Metadata = {
  title: `Реклама и продвижение — таргет, контекст, SEO, SMM | ${SITE_NAME}`,
  description:
    "Таргетированная и контекстная реклама, SEO-продвижение, SMM-стратегия и сквозная аналитика. Привлекаем клиентов и увеличиваем продажи. Студия CODE 1.618.",
  keywords: [
    "таргетированная реклама",
    "контекстная реклама",
    "SEO продвижение",
    "SMM",
    "Яндекс Директ",
    "реклама сайта",
    "digital маркетинг",
    SITE_NAME,
  ],
  alternates: { canonical: SERVICE_SLUG },
  openGraph: {
    title: `Реклама и продвижение | ${SITE_NAME}`,
    description: "Таргет, контекст, SEO, SMM — от стратегии до результата с прозрачной аналитикой.",
    url: `${SITE_URL}${SERVICE_SLUG}`,
    type: "website",
  },
};

export default function AdvertisingPage() {
  return <AdvertisingContent />;
}
