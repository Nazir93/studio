"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { ConditionalNavBar } from "./conditional-navbar";
import { Footer } from "./footer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { CustomCursor } from "../ui/custom-cursor";
import { ContactModal } from "../ui/contact-modal";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  /** Страница заявки (оффер): без шапки и футера, на весь экран */
  const isBriefFullBleed = pathname === "/brief";

  if (isBriefFullBleed) {
    return (
      <>
        <CustomCursor />
        <ContactModal />
        <main className="relative flex h-[100dvh] max-h-[100dvh] min-h-0 w-full max-w-full flex-col overflow-hidden">
          {children}
        </main>
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <ContactModal />
      <Header />
      <ConditionalNavBar />
      <main className="relative min-h-screen min-h-[100dvh] w-full min-w-0 max-w-full overflow-x-clip">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
      {/* Отступ под фиксированный таббар + home indicator */}
      <div
        className="shrink-0 lg:hidden"
        style={{ height: "calc(3.5rem + env(safe-area-inset-bottom, 0px))" }}
        aria-hidden
      />
    </>
  );
}
