"use client";

import { useLayoutEffect, useState } from "react";

/** Tailwind `lg` — десктоп: видео-маска на баннере и звук; &lt; lg — без видео (мобильные и планшеты) */
const QUERY = "(min-width: 1024px)";

/**
 * SSR и первая отрисовка на клиенте — `false` (как «не lg»), гидрация совпадает с сервером.
 * `useLayoutEffect` обновляет ширину до paint браузера, чтобы на десктопе сразу был режим с видео,
 * а не один кадр с `disableVideo` (прозрачный текст + слабая обводка).
 */
export function useIsDesktopLg(): boolean {
  const [ok, setOk] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(QUERY);
    const apply = () => setOk(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return ok;
}
