"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useModal } from "@/lib/modal-context";
import { SITE_NAME } from "@/lib/constants";
import { LeadBriefForm } from "@/components/forms/lead-brief-form";

export function ContactModal() {
  const { isOpen, closeModal, leadSourceHint } = useModal();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[6px] dark:bg-black/55"
        aria-label="Закрыть форму"
        onClick={closeModal}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="terminal-chrome-bg relative z-[101] flex max-h-[min(92dvh,900px)] w-full max-w-lg flex-col rounded-t-2xl border shadow-2xl sm:max-h-[90dvh] sm:rounded-2xl"
        style={{ borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex shrink-0 items-start justify-between gap-4 border-b px-5 py-4 sm:px-6 sm:py-5"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <p className="font-matrix text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--text-subtle)" }}>
              {SITE_NAME}
            </p>
            <h2 id="contact-modal-title" className="mt-1 font-heading text-xl tracking-tight sm:text-2xl" style={{ color: "var(--text)" }}>
              Заявка
            </h2>
            <p className="mt-1 max-w-sm font-body text-xs leading-relaxed sm:text-sm" style={{ color: "var(--text-muted)" }}>
              Оставьте контакты и кратко опишите задачу — ответим и уточним детали.
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="shrink-0 rounded-lg p-2 transition-colors hover:opacity-80"
            style={{ color: "var(--text-muted)" }}
            aria-label="Закрыть"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6 safe-bottom">
          <LeadBriefForm sourceHint={leadSourceHint} onSuccess={closeModal} variant="modal" />
        </div>
      </div>
    </div>
  );
}
