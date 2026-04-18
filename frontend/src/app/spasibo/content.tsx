"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";

const MESSAGE =
  "Наш инженер свяжется с вами в ближайшее рабочее время — обычно в течение одного дня.";

function CornerFrame({ className }: { className?: string }) {
  return (
    <svg
      className={cn("pointer-events-none text-[var(--border)]", className)}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
    >
      <path d="M0 32V0h32" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      <path d="M68 0h32v32" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      <path d="M100 68v32H68" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      <path d="M32 100H0V68" stroke="currentColor" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const reduceMotion = useReducedMotion();

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

  const ease = [0.22, 1, 0.36, 1] as const;
  const base = reduceMotion ? { duration: 0 } : { duration: 0.75, ease };
  const stagger = reduceMotion ? 0 : 0.08;

  return (
    <section
      className="theme-bg relative flex min-h-[min(100dvh,920px)] flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 md:min-h-[100dvh] md:py-24"
      style={{ color: "var(--text)" }}
    >
      {/* Фон: сетка + мягкое свечение */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_42%,#000_45%,transparent_100%)]"
          style={{
            backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
          }}
        />
        <div
          className="absolute left-1/2 top-[38%] h-[min(480px,55vw)] w-[min(520px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] md:blur-[120px]"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(250, 250, 250, 0.09) 0%, rgba(250, 250, 250, 0.02) 42%, transparent 72%)",
          }}
        />
        <div
          className="absolute -right-[15%] top-[12%] h-px w-[45%] rotate-[-32deg] opacity-20"
          style={{
            background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
          }}
        />
        <div
          className="absolute -left-[10%] bottom-[18%] h-px w-[38%] rotate-[24deg] opacity-15"
          style={{
            background: "linear-gradient(90deg, transparent, var(--text-subtle), transparent)",
          }}
        />
      </div>

      <div className="relative z-[1] mx-auto w-full max-w-3xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={base}
          className="relative"
        >
          <CornerFrame className="absolute -left-1 -top-1 h-16 w-16 sm:h-20 sm:w-20" />
          <CornerFrame className="absolute -bottom-1 -right-1 h-16 w-16 rotate-180 sm:h-20 sm:w-20" />

          <div
            className="relative overflow-hidden rounded-2xl border px-6 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:px-10 sm:py-12 md:px-14 md:py-14"
            style={{
              borderColor: "var(--border)",
              background:
                "linear-gradient(165deg, color-mix(in srgb, var(--bg-secondary) 88%, transparent) 0%, color-mix(in srgb, var(--bg) 94%, transparent) 100%)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="pointer-events-none absolute -right-8 top-6 font-matrix text-[10px] uppercase tracking-[0.35em] opacity-[0.2]"
              style={{ color: "var(--text)" }}
              aria-hidden
            >
              1.618
            </div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...base, delay: stagger }}
              className="mb-6 flex flex-wrap items-center gap-3"
            >
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-matrix text-[9px] uppercase tracking-[0.22em] sm:text-[10px]"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <span className="relative flex h-4 w-4 items-center justify-center rounded-full border" style={{ borderColor: "var(--border)" }}>
                  <Check className="h-2.5 w-2.5" strokeWidth={2.5} style={{ color: "var(--accent)" }} aria-hidden />
                </span>
                Заявка получена
              </span>
              <span className="font-matrix text-[9px] uppercase tracking-[0.28em] sm:text-[10px]" style={{ color: "var(--text-subtle)" }}>
                inbox · ok
              </span>
            </motion.div>

            <motion.h1
              className="font-heading text-[clamp(1.35rem,5vw+0.5rem,3.25rem)] leading-[0.95] tracking-tight"
              style={{ color: "var(--text)" }}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...base, delay: stagger * 2 }}
            >
              Спасибо
              <span className="block pt-1 text-[0.72em] font-normal normal-case tracking-normal sm:pt-1.5" style={{ color: "var(--text-muted)" }}>
                за доверие
              </span>
            </motion.h1>

            <motion.div
              className="relative mt-8 max-w-xl"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...base, delay: stagger * 3 }}
            >
              <div className="absolute -left-3 top-0 hidden h-full w-px sm:block" style={{ backgroundColor: "var(--border)" }} aria-hidden />
              <p className="pl-0 text-base leading-[1.75] sm:pl-5 sm:text-lg" style={{ color: "var(--text-muted)" }}>
                {MESSAGE}
              </p>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...base, delay: stagger * 4 }}
            >
              <Link
                href="/"
                className="group inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 font-matrix text-[10px] uppercase tracking-[0.22em] transition-[background-color,color,border-color] duration-300 sm:text-xs"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                  backgroundColor: "transparent",
                }}
              >
                На главную
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                href="/portfolio"
                className="font-matrix text-[10px] uppercase tracking-[0.2em] underline-offset-[6px] transition-opacity hover:opacity-80 sm:text-xs"
                style={{ color: "var(--text-subtle)" }}
              >
                Смотреть кейсы
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          className="mt-10 text-center font-matrix text-[9px] uppercase tracking-[0.32em] sm:text-[10px]"
          style={{ color: "var(--text-subtle)" }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...base, delay: stagger * 5 }}
        >
          {SITE_NAME} · ответ не автоматический
        </motion.p>
      </div>
    </section>
  );
}
