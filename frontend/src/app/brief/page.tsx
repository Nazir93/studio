import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { BriefRequestSection } from "@/components/sections/brief-request-section";

export const metadata: Metadata = {
  title: `Заявка | ${SITE_NAME}`,
  description: `Оставьте заявку в ${SITE_NAME}: опишите задачу, мы свяжемся и уточним детали проекта.`,
  alternates: { canonical: "/brief" },
};

export default function BriefPage() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      style={{ backgroundColor: "var(--bg)", height: "100%", maxHeight: "100%" }}
    >
      <BriefRequestSection />
    </div>
  );
}
