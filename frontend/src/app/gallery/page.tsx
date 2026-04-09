import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { GalleryContent } from "./content";

export const metadata: Metadata = {
  title: `Галерея дизайна | ${SITE_NAME}`,
  description:
    "Интерактивные демо-страницы: посмотрите, как мы делаем дизайн. Каждая страница — отдельный визуальный опыт.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return <GalleryContent />;
}
