import { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

/** Мета страницы без БД — только defaults из вызывающего кода */
export async function getPageMeta(
  path: string,
  defaults: {
    title?: string;
    description?: string;
    keywords?: string[];
  } = {}
): Promise<Metadata> {
  const title = defaults.title;
  const description = defaults.description;
  const keywords = defaults.keywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: title || SITE_NAME,
      description,
      url: `${SITE_URL}${path}`,
    },
    alternates: {
      canonical: `${SITE_URL}${path}`,
    },
  };
}
