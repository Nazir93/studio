"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <html lang="ru">
      <body className="font-body antialiased" style={{ background: "#0a0a0a", color: "#fafafa" }}>
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
          <h1 className="text-xl font-semibold">Критическая ошибка</h1>
          <p className="max-w-sm text-sm opacity-80">Не удалось загрузить интерфейс. Нажмите «Повторить» или обновите страницу.</p>
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black"
          >
            Повторить
          </button>
        </div>
      </body>
    </html>
  );
}
