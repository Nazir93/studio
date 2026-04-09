"use client";

import { BannerSection } from "@/components/sections/banner";
import {
  DesktopSideNav,
  HOME_DESKTOP_SIDE_NAV_INSET_CLASS,
  useHomeSideNavVisibility,
} from "@/components/layout/desktop-side-nav";
import { ViewAllServices } from "@/components/layout/view-all-services";
import { CapabilitiesTapeSection } from "@/components/sections/capabilities-tape";
import { WhatWeDoSection } from "@/components/sections/what-we-do";
import { PortfolioSection } from "@/components/sections/portfolio";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const sideNavVisible = useHomeSideNavVisibility();

  return (
    <>
      <div
        className={cn(
          "transition-[padding] duration-500 ease-out",
          sideNavVisible && HOME_DESKTOP_SIDE_NAV_INSET_CLASS
        )}
      >
        <BannerSection />
        <CapabilitiesTapeSection />
        <WhatWeDoSection />
        <ViewAllServices />
        <PortfolioSection />
      </div>
      <DesktopSideNav visible={sideNavVisible} />
    </>
  );
}
