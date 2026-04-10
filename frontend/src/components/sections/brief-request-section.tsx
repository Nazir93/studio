"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { ContactChannelsBar } from "@/components/ui/contact-channels-bar";
import { LeadBriefForm } from "@/components/forms/lead-brief-form";
import { SITE_BRAND_MARK } from "@/lib/constants";

function BriefFormWithSource() {
  const searchParams = useSearchParams();
  const sourceHint = useMemo(() => searchParams.get("source")?.trim() || null, [searchParams]);

  return <LeadBriefForm variant="page" sourceHint={sourceHint} />;
}

function FormFallback() {
  return (
    <div className="h-32 animate-pulse rounded border border-[var(--border)] bg-[color-mix(in_srgb,var(--text)_4%,transparent)]" aria-hidden />
  );
}

export function BriefRequestSection() {
  const titleBar = SITE_BRAND_MARK;

  return (
    <div
      className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-3 py-2 sm:gap-1.5 sm:px-5 md:h-full md:overflow-hidden md:py-0 md:max-w-[52rem] md:px-6"
      style={{
        paddingTop: "max(0.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      <header className="flex shrink-0 items-center justify-between gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-matrix text-[9px] uppercase tracking-[0.2em] transition-opacity hover:opacity-80 sm:text-[10px]"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={12} className="shrink-0 opacity-80" aria-hidden />
          Главная
        </Link>
        <span className="font-matrix text-[9px] uppercase tracking-[0.28em] sm:text-[10px]" style={{ color: "var(--text-subtle)" }}>
          Заявка
        </span>
      </header>

      <div className="shrink-0">
        <h1 className="font-heading text-base leading-tight tracking-tight sm:text-lg md:text-xl" style={{ color: "var(--text)" }}>
          Расскажите о задаче
        </h1>
        <p className="mt-0.5 line-clamp-2 max-w-xl font-body text-[11px] leading-snug sm:text-[12px]" style={{ color: "var(--text-muted)" }}>
          Контакты и краткое ТЗ — ответим с уточнениями по срокам и формату.
        </p>
      </div>

      <TerminalWindow
        titleBar={titleBar}
        scrollableContent={false}
        className="flex min-h-[min(70vh,32rem)] min-w-0 flex-1 flex-col overflow-hidden text-[10px] sm:min-h-0 sm:text-[11px] md:flex-1"
        innerClassName="!flex !min-h-0 !min-w-0 !flex-1 !flex-col !overflow-y-auto !overflow-x-hidden md:!overflow-hidden !p-2 sm:!p-3 md:!p-4"
      >
        <p className="mb-1.5 shrink-0 font-mono text-[9px] leading-tight sm:text-[10px]" style={{ color: "var(--text-subtle)" }}>
          # Тема и комментарий обязательны.
        </p>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Suspense fallback={<FormFallback />}>
            <BriefFormWithSource />
          </Suspense>
        </div>
      </TerminalWindow>

      <ContactChannelsBar className="shrink-0 scale-[0.92] sm:scale-100" />
    </div>
  );
}
