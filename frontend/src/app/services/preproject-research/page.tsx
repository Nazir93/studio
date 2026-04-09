import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PreprojectResearchContent } from "./content";

const SERVICE_SLUG = "/services/preproject-research";

export const metadata: Metadata = {
  title: `Предпроектное исследование и discovery | ${SITE_NAME}`,
  description:
    "Разберёмся, как реализовать идею, что учесть на старте и как уложиться в бюджет. Нулевой спринт 2–4 недели: ТЗ, прототип, дорожная карта и отчёт для бизнеса и техдиректоров.",
  alternates: { canonical: SERVICE_SLUG },
  openGraph: {
    title: `Предпроектное исследование | ${SITE_NAME}`,
    description: "Discovery, воркшопы, исследования и кликабельный прототип до старта разработки.",
    url: `${SITE_URL}${SERVICE_SLUG}`,
    type: "website",
  },
};

export default function PreprojectResearchPage() {
  return <PreprojectResearchContent />;
}
