"use client";

import { useEffect, useRef, useState } from "react";

const HOVER_SELECTOR = "a, button, [role='button'], input, textarea, select, [data-cursor-hover]";
const WORD_ZONE = "[data-cursor-word]";

function isHoverTarget(el: Element | null): boolean {
  if (!el) return false;
  return el.closest(HOVER_SELECTOR) !== null;
}

function getWordZoneLabel(el: Element | null): string | null {
  if (!el) return null;
  const zone = el.closest(WORD_ZONE);
  if (!zone) return null;
  const w = zone.getAttribute("data-cursor-word");
  return w && w.trim() ? w.trim() : "смотреть";
}

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [wordLabel, setWordLabel] = useState<string | null>(null);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const canHover = window.matchMedia("(hover: hover)");
    if (!finePointer.matches || !canHover.matches) return;

    setVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      const label = getWordZoneLabel(e.target as Element);
      setWordLabel(label);

      if (rootRef.current) {
        rootRef.current.style.left = `${e.clientX}px`;
        rootRef.current.style.top = `${e.clientY}px`;
      }
      const isHover = isHoverTarget(e.target as Element);
      setHovering(isHover);
    };

    const handleMouseEnter = () => setVisible(true);
    const handleMouseLeave = () => setVisible(false);

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  if (!visible) return null;

  const showWord = wordLabel !== null;

  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      <div
        ref={rootRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ left: posRef.current.x, top: posRef.current.y }}
      >
        {showWord ? (
          <span
            className="block font-matrix text-[11px] tracking-[0.2em] whitespace-nowrap"
            style={{
              color: hovering ? "var(--accent)" : "var(--text)",
              transition: "color 0.15s ease",
            }}
          >
            {wordLabel}
          </span>
        ) : (
          <span
            className="block rounded-full"
            style={{
              width: hovering ? 8 : 6,
              height: hovering ? 8 : 6,
              background: hovering ? "var(--accent)" : "var(--text)",
              transition: "width 0.15s, height 0.15s, background 0.15s",
            }}
          />
        )}
      </div>
    </>
  );
}
