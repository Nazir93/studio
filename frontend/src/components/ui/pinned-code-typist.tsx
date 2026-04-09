"use client";

import { useEffect, useState } from "react";

type Props = {
  /** Строка как в терминале — посимвольная печать */
  text: string;
  /** мс между символами (как на странице разработки ~12–28) */
  charDelayMs?: number;
  className?: string;
};

/**
 * Печать «как код» с курсором-блоком — только когда родитель уже в режиме закрепления.
 * Родитель переключает статичный подзаголовок на этот компонент при pinned.
 */
export function PinnedCodeTypist({ text, charDelayMs = 14, className = "" }: Props) {
  const [slice, setSlice] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setSlice(text.length);
      return;
    }
    setSlice(0);
    if (!text.length) return;
    let i = 0;
    let timeoutId: number | undefined;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      i += 1;
      setSlice(i);
      if (i < text.length) {
        timeoutId = window.setTimeout(tick, charDelayMs);
      }
    };
    timeoutId = window.setTimeout(tick, 24);
    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [text, charDelayMs, reducedMotion]);

  const shown = text.slice(0, slice);
  const done = slice >= text.length;

  return (
    <span
      className={`inline-block max-w-[min(100%,42rem)] whitespace-pre-wrap break-all font-mono text-[9px] leading-snug tracking-tight md:text-[10px] ${className}`}
      style={{ color: "var(--text-muted)" }}
      aria-live="polite"
    >
      {shown}
      {!done && (
        <span
          className="ml-0.5 inline-block h-[11px] w-[6px] animate-pulse align-middle md:h-[12px]"
          style={{ backgroundColor: "var(--text-muted)" }}
          aria-hidden
        />
      )}
    </span>
  );
}
