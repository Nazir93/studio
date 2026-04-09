import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ArtisticMadnessContent } from "./content";

const PATH = "/services/ux-ui-design/artistic";

export const metadata: Metadata = {
  title: `Художественные стили — UX/UI (альтернативная 3) | ${SITE_NAME}`,
  description:
    "Кубизм и UI, дадаизм, оп-арт Васарели и пуантилизм: экспериментальная витрина интерфейса как искусства.",
  alternates: { canonical: PATH },
  openGraph: {
    title: `Художественные стили | ${SITE_NAME}`,
    description: "Кубизм, дада, оп-арт и пуантилизм в одной странице UX/UI.",
    url: `${SITE_URL}${PATH}`,
    type: "website",
  },
};

export default function UxUiArtisticPage() {
  return <ArtisticMadnessContent />;
}
