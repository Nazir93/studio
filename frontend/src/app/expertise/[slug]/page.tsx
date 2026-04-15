import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { getAllExpertiseSlugs, getExpertiseBySlug } from "@/lib/expertise-data";
import { ExpertiseArticle } from "@/components/expertise/expertise-article";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllExpertiseSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const page = getExpertiseBySlug(params.slug);
  if (!page) return { title: "Не найдено" };
  const url = `${SITE_URL}/expertise/${page.slug}`;
  return {
    title: `${page.title} — ${page.subtitle} | ${SITE_NAME}`,
    description: page.lede,
    alternates: { canonical: `/expertise/${page.slug}` },
    openGraph: {
      title: `${page.title} | ${SITE_NAME}`,
      description: page.lede,
      type: "website",
      url,
    },
  };
}

export default function ExpertisePage({ params }: Props) {
  const page = getExpertiseBySlug(params.slug);
  if (!page) notFound();
  return <ExpertiseArticle page={page} />;
}
