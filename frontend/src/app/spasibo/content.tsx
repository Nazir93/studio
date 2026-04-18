"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const MESSAGE = "Спасибо за заявку. Наш инженер скоро с вами свяжется.";

export function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }
    setValid(true);
  }, [token, router]);

  if (valid === null) return null;

  if (!valid) {
    router.replace("/");
    return null;
  }

  return (
    <section
      className="theme-bg flex min-h-screen flex-col items-center justify-center px-4 py-16 transition-colors duration-500"
      style={{ color: "var(--text)" }}
    >
      <p
        className="max-w-xl text-center font-body text-base leading-relaxed sm:text-lg"
        style={{ color: "var(--text)" }}
      >
        {MESSAGE}
      </p>
      <Link
        href="/"
        className="mt-10 font-matrix text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 transition-opacity hover:opacity-80 sm:text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        На главную
      </Link>
    </section>
  );
}
