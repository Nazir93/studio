"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { ConditionalNavBar } from "./conditional-navbar";
import { Footer } from "./footer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { CallFab } from "./call-fab";
import { CustomCursor } from "../ui/custom-cursor";
import { ContactModal } from "../ui/contact-modal";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  /** Страница заявки (оффер): без шапки и футера; на мобильных — прокрутка всей страницы */
  const isBriefFullBleed = pathname === "/brief";

  if (isBriefFullBleed) {
    return (
      <>
        <CustomCursor />
        <ContactModal />
        <main className="relative flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden overflow-y-auto md:h-[100dvh] md:max-h-[100dvh] md:overflow-hidden">
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
      <CallFab />
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
