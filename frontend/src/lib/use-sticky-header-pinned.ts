"use client";

import { useEffect, useState, type RefObject } from "react";

/** true, когда sticky-шапка секции у верхнего края viewport */
export function useStickyHeaderPinned<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const stuck = r.top <= 1 && r.top >= -3;
      setPinned((p) => (p !== stuck ? stuck : p));
    };

    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);

  return pinned;
}
