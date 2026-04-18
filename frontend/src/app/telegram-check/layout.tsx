import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Проверка API заявок",
  robots: { index: false, follow: false },
};

export default function TelegramCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
