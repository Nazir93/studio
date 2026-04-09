import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { AncientMysticContent } from "./content";

const PATH = "/services/ux-ui-design/ancient";

export const metadata: Metadata = {
  title: `Древность и мистика — UX/UI (альтернативная версия) | ${SITE_NAME}`,
  description:
    "Палео-контакт, Розеттский камень, Текстильный кодекс, Каналы орошения: экспериментальная витрина дизайна в теме иероглифов и пирамид.",
  alternates: { canonical: PATH },
  openGraph: {
    title: `Древность и мистика | ${SITE_NAME}`,
    description: "Альтернативная страница UX/UI-дизайна: пещера, Розетта, кипу, каналы Нила.",
    url: `${SITE_URL}${PATH}`,
    type: "website",
  },
};

export default function AncientMysticPage() {
  return <AncientMysticContent />;
}
