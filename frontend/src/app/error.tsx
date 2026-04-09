"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
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
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="max-w-md text-center">
        <h1 className="font-heading text-2xl font-semibold md:text-3xl" style={{ color: "var(--text)" }}>
          Что-то пошло не так
        </h1>
        <p className="mt-3 text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
          Попробуйте обновить страницу или вернуться на главную.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}
          >
            Повторить
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
