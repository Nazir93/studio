"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { useIsDesktopLg } from "@/lib/use-is-desktop-lg";

const VIDEO_SRC = "/videos/cases-title.mp4";

/** Обычный UTF-8; й = U+0419 одной глифой */
const CASES_TITLE = "КЕЙСЫ";

/**
 * AKONY в проекте подключён с одним весом — фальш-жир (font-black) ломает крючок у «Й» в SVG.
 * Заголовок делаем крупным clamp’ами, без weight 900.
 */
/**
 * Мобильные / планшеты: умеренный vw (не раздувает на узких экранах), чуть свободнее leading,
 * xs/sm/md — отдельные clamp. Десктоп без изменений по ощущению.
 */
const HEADING_CLASS =
  "font-heading font-normal w-full max-w-full break-words hyphens-none " +
  "text-[clamp(1.9rem,8.8vw,4.85rem)] leading-[0.92] tracking-tight " +
  "xs:text-[clamp(2.05rem,9.2vw,5.15rem)] xs:leading-[0.9] xs:tracking-tighter " +
  "sm:text-[clamp(2.35rem,9.8vw,5.35rem)] sm:leading-[0.89] " +
  "md:text-[clamp(2.6rem,9.2vw,5rem)] md:leading-[0.88] " +
  "lg:text-[clamp(2.8rem,8.4vw,4.65rem)] " +
  "xl:text-[clamp(2.95rem,7.5vw,4.95rem)] " +
  "pt-[0.16em] pb-[0.14em] sm:pt-[0.18em] sm:pb-[0.12em]";

/** На самых узких экранах чуть меньше «ухода» вверх, чтобы не заезжать под шапку */
const HEADING_MARGIN =
  "-mt-3 mb-7 xs:-mt-4 xs:mb-8 sm:-mt-5 sm:mb-9 md:-mt-6 md:mb-11 lg:-mt-8 lg:mb-12 xl:-mt-10 xl:mb-14";

/** В маске/обводке — тот же вес, что у файла шрифта (без синтеза) */
const SVG_FONT_WEIGHT = 400;

function useMeasuredBox<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      const w = Math.max(0, Math.round(r.width));
      const h = Math.max(0, Math.round(r.height));
      setBox((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return { ref, box };
}

export function CasesVideoTitle() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [fontPx, setFontPx] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const allowVideo = useIsDesktopLg();
  const { isDark } = useTheme();
  const maskIdRaw = useId();
  const maskId = `cases-v-${maskIdRaw.replace(/:/g, "")}`;
  const { ref: wrapRef, box } = useMeasuredBox<HTMLDivElement>();

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const sync = () => {
      const raw = parseFloat(getComputedStyle(el).fontSize);
      setFontPx(Number.isFinite(raw) && raw > 0 ? raw : 0);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [box.w, box.h]);

  const strokeColor = isDark ? "#ffffff" : "#141414";

  const ready = box.w >= 12 && box.h >= 12 && fontPx > 0;
  const cx = box.w / 2;
  const cy = box.w < 640 ? box.h * 0.515 : box.h * 0.52;

  /** Тоньше обводка на маленьких экранах — выглядит чище */
  const strokeWidthPx = !ready
    ? 2.5
    : box.w < 400
      ? isDark
        ? 2
        : 2.35
      : box.w < 768
        ? isDark
          ? 2.25
          : 2.55
        : isDark
          ? 2.5
          : 2.75;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReduceMotion(mq.matches);
      const v = videoRef.current;
      if (!v) return;
      if (mq.matches) v.pause();
      else void v.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!ready || reduceMotion) return;
    const v = videoRef.current;
    if (!v) return;
    void v.play().catch(() => {});
  }, [ready, reduceMotion]);

  if (reduceMotion || !allowVideo) {
    return (
      <h1 className={`${HEADING_CLASS} ${HEADING_MARGIN}`} style={{ color: "var(--text)" }}>
        {CASES_TITLE}
      </h1>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`relative w-full overflow-hidden ${HEADING_MARGIN}`}
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div
        ref={measureRef}
        className={`${HEADING_CLASS} invisible pointer-events-none select-none`}
        aria-hidden
      >
        {CASES_TITLE}
      </div>

      {ready && (
        <div className="absolute inset-0">
          <svg width="0" height="0" className="absolute" aria-hidden>
            <defs>
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                maskContentUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={box.w}
                height={box.h}
              >
                <rect width={box.w} height={box.h} fill="black" />
                <text
                  x={cx}
                  y={cy}
                  lang="ru"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontWeight={SVG_FONT_WEIGHT}
                  fontSize={fontPx}
                  style={{
                    fontFamily: "var(--font-main), ui-sans-serif, system-ui, sans-serif",
                    textRendering: "optimizeLegibility",
                  }}
                >
                  {CASES_TITLE}
                </text>
              </mask>
            </defs>
          </svg>

          <video
            ref={videoRef}
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
            style={{
              mask: `url(#${maskId})`,
              WebkitMask: `url(#${maskId})`,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
            }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>

          <svg
            className="pointer-events-none absolute inset-0 z-[2]"
            width="100%"
            height="100%"
            viewBox={`0 0 ${box.w} ${box.h}`}
            preserveAspectRatio="none"
            aria-hidden
          >
            <text
              x={cx}
              y={cy}
              lang="ru"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidthPx}
              strokeLinejoin="round"
              vectorEffect="nonScalingStroke"
              fontWeight={SVG_FONT_WEIGHT}
              fontSize={fontPx}
              style={{
                fontFamily: "var(--font-main), ui-sans-serif, system-ui, sans-serif",
                textRendering: "optimizeLegibility",
              }}
            >
              {CASES_TITLE}
            </text>
          </svg>
        </div>
      )}

      <h1 className="sr-only">{CASES_TITLE}</h1>
    </div>
  );
}
