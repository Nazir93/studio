"use client";

import { MaskedVideoText } from "@/components/effects/masked-video-text";
import { useIsDesktopLg } from "@/lib/use-is-desktop-lg";

const VIDEO_SRC = "/videos/cases-title.mp4";

/** Обычный UTF-8; й = U+0419 одной глифой */
const CASES_TITLE = "КЕЙСЫ";

/**
 * AKONY в проекте подключён с одним весом — фальш-жир (font-black) ломает крючок у «Й» в SVG.
 * Заголовок делаем крупным clamp’ами, без weight 900.
 */
const HEADING_CLASS =
  "font-heading font-normal w-full max-w-full break-words hyphens-none " +
  "text-[clamp(1.25rem,5.8vw,2.85rem)] leading-[0.92] tracking-tight " +
  "xs:text-[clamp(1.35rem,6.2vw,3rem)] xs:leading-[0.9] xs:tracking-tighter " +
  "sm:text-[clamp(1.5rem,6.5vw,3.15rem)] sm:leading-[0.89] " +
  "md:text-[clamp(1.65rem,6.2vw,3rem)] md:leading-[0.88] " +
  "lg:text-[clamp(1.75rem,5.6vw,2.85rem)] " +
  "xl:text-[clamp(1.85rem,5.1vw,3rem)] " +
  "pt-[0.16em] pb-[0.14em] sm:pt-[0.18em] sm:pb-[0.12em]";

/** На самых узких экранах чуть меньше «ухода» вверх, чтобы не заезжать под шапку */
const HEADING_MARGIN =
  "-mt-3 mb-7 xs:-mt-4 xs:mb-8 sm:-mt-5 sm:mb-9 md:-mt-6 md:mb-11 lg:-mt-8 lg:mb-12 xl:-mt-10 xl:mb-14";

/** Видео в буквах только на lg+; маска по центру как в вёрстке заголовка */
export function CasesVideoTitle() {
  const allowVideo = useIsDesktopLg();

  return (
    <MaskedVideoText
      text={CASES_TITLE}
      videoSrc={VIDEO_SRC}
      measureClassName={HEADING_CLASS}
      className={HEADING_MARGIN}
      disableVideo={!allowVideo}
      textAlign="middle"
    />
  );
}
