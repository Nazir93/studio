"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme-context";

const SVG_FONT_WEIGHT = 400;

function useMeasuredBox() {
  const ref = useRef<HTMLDivElement | null>(null);
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

type Props = {
  text: string;
  videoSrc: string;
  /** Классы как у видимого заголовка (для измерения и совпадения с AKONY) */
  measureClassName: string;
  className?: string;
  /** Без `<video>` — только обводка (мобильные / планшеты) */
  disableVideo?: boolean;
  /**
   * Как в вёрстке: баннер — вторая строка слева как первая (`start`);
   * «КЕЙСЫ» — по центру блока (`middle`). Иначе SVG маска с `middle` при левом HTML даёт полосы фона и сдвиг.
   */
  textAlign?: "start" | "middle";
};

/**
 * Текст с видео внутри букв (SVG-маска), как на портфолио «КЕЙСЫ».
 * При prefers-reduced-motion — обычная строка с обводкой.
 */
export function MaskedVideoText({
  text,
  videoSrc,
  measureClassName,
  className = "",
  disableVideo = false,
  textAlign = "start",
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [fontPx, setFontPx] = useState(0);
  const [svgTextStyle, setSvgTextStyle] = useState({
    letterSpacing: "0px",
    fontFamily: "var(--font-main), sans-serif",
  });
  const [reduceMotion, setReduceMotion] = useState(false);
  const { isDark } = useTheme();
  const maskIdRaw = useId();
  const maskId = `mvt-${maskIdRaw.replace(/:/g, "")}`;
  const { ref: wrapRef, box } = useMeasuredBox();

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const sync = () => {
      const cs = getComputedStyle(el);
      const raw = parseFloat(cs.fontSize);
      setFontPx(Number.isFinite(raw) && raw > 0 ? raw : 0);
      setSvgTextStyle({
        letterSpacing: cs.letterSpacing || "0px",
        fontFamily: cs.fontFamily || "var(--font-main), sans-serif",
      });
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [box.w, box.h, text, textAlign]);

  const strokeColor = isDark ? "#ffffff" : "#141414";

  const ready = box.w >= 12 && box.h >= 12 && fontPx > 0;
  const anchorMiddle = textAlign === "middle";
  const cx = box.w / 2;
  const tx = anchorMiddle ? cx : 0;
  const textAnchor = anchorMiddle ? "middle" : "start";
  const cy = box.w < 640 ? box.h * 0.515 : box.h * 0.52;

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
    if (!ready || reduceMotion || disableVideo) return;
    const v = videoRef.current;
    if (!v) return;
    v.load();
    void v.play().catch(() => {});
  }, [ready, reduceMotion, disableVideo, text, videoSrc]);

  const strokeStyle = {
    color: "transparent" as const,
    WebkitTextStroke: "1.5px color-mix(in srgb, var(--text) 25%, transparent)",
  };

  const alignClass = anchorMiddle ? "text-center" : "text-left";

  if (reduceMotion || disableVideo) {
    return (
      <span className={`block w-full ${alignClass} ${measureClassName} ${className}`} style={strokeStyle}>
        {text}
      </span>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div
        ref={measureRef}
        className={`${measureClassName} ${alignClass} invisible pointer-events-none w-full select-none`}
        aria-hidden
      >
        {text}
      </div>

      {!ready && (
        <span
          className={`absolute left-0 top-0 block w-full ${alignClass} ${measureClassName}`}
          style={strokeStyle}
          aria-hidden
        >
          {text}
        </span>
      )}

      {ready && (
        <div className="absolute inset-0">
          <svg width="1" height="1" className="pointer-events-none absolute overflow-hidden opacity-0" aria-hidden>
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
                  x={tx}
                  y={cy}
                  lang="ru"
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  fill="white"
                  fontWeight={SVG_FONT_WEIGHT}
                  fontSize={fontPx}
                  style={{
                    fontFamily: svgTextStyle.fontFamily,
                    letterSpacing: svgTextStyle.letterSpacing,
                    textRendering: "optimizeLegibility",
                  }}
                >
                  {text}
                </text>
              </mask>
            </defs>
          </svg>

          <video
            key={videoSrc}
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
            <source src={videoSrc} type="video/mp4" />
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
              x={tx}
              y={cy}
              lang="ru"
              textAnchor={textAnchor}
              dominantBaseline="middle"
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidthPx}
              strokeLinejoin="round"
              vectorEffect="nonScalingStroke"
              fontWeight={SVG_FONT_WEIGHT}
              fontSize={fontPx}
              style={{
                fontFamily: svgTextStyle.fontFamily,
                letterSpacing: svgTextStyle.letterSpacing,
                textRendering: "optimizeLegibility",
              }}
            >
              {text}
            </text>
          </svg>
        </div>
      )}

      <span className="sr-only">{text}</span>
    </div>
  );
}
