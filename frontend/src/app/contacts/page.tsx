import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";
import { ContactsTerminalSection } from "@/components/sections/contacts-terminal";

export const metadata: Metadata = {
  title: `Контакты | ${SITE_NAME}`,
  description: `Свяжитесь с ${SITE_NAME}: телефон, email, Telegram, WhatsApp, MAX. Форма заявки на сайте — ответим на проект или консультацию.`,
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      <ContactsTerminalSection />
    </div>
  );
}
