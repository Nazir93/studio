import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { FilmReelContent } from "./content";

export const metadata: Metadata = {
  title: `Кинопленка — интерактивное видео | ${SITE_NAME}`,
  description:
    "Текстовые кадры по ходу страницы в стиле киноплёнки. Таймкоды, глитч между сценами. Демо дизайна от CODE 1.618.",
  alternates: { canonical: "/gallery/film-reel" },
};

export default function FilmReelPage() {
  return <FilmReelContent />;
}
