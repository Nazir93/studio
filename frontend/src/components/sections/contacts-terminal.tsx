"use client";

import { useState, useEffect, type ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { WhatsAppGlyph, MaxChannelGlyph } from "@/components/ui/contact-channels-bar";
import { Section } from "@/components/ui/section";
import { TerminalWindow } from "@/components/ui/terminal-window";
import {
  Phone,
  Mail,
  Send,
  CreditCard,
  ChevronDown,
  Building2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { PHONE, PHONE_RAW, EMAIL, SOCIAL_LINKS, COMPANY } from "@/lib/constants";

const INTRO_KEY = "contacts-terminal-intro-v1";

type ContactRowIcon = LucideIcon | ComponentType<{ size?: number }>;

const CONTACT_METHODS: {
  icon: ContactRowIcon;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}[] = [
  { icon: Phone, label: "Телефон", value: PHONE, href: `tel:${PHONE_RAW}` },
  { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  {
    icon: Send,
    label: "Telegram",
    value: "@code_1618",
    href: SOCIAL_LINKS.telegram,
    external: true,
  },
  {
    icon: WhatsAppGlyph as ContactRowIcon,
    label: "WhatsApp",
    value: PHONE,
    href: SOCIAL_LINKS.whatsapp,
    external: true,
  },
  {
    icon: MaxChannelGlyph as ContactRowIcon,
    label: "MAX",
    value: "max.ru",
    href: SOCIAL_LINKS.max,
    external: true,
  },
];

function RequisitesTerminalBlock() {
  const [open, setOpen] = useState(false);
  const hasRequisites =
    COMPANY.inn || COMPANY.ogrnip || COMPANY.postalAddress || COMPANY.bank.name;

  if (!hasRequisites) return null;

  return (
    <div className="mt-8 border-t pt-6" style={{ borderColor: "var(--border)" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 text-left font-mono text-[11px] uppercase tracking-[0.12em] sm:text-xs"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="flex items-center gap-2">
          <CreditCard size={14} style={{ color: "var(--accent)" }} />
          <span style={{ color: "var(--text)" }}># cat ./requisites.txt</span>
        </span>
        <ChevronDown
          size={14}
          className="shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-500 ease-in-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-4 space-y-3 border-l-2 pl-4 font-mono text-[10px] sm:text-xs" style={{ borderColor: "var(--accent)" }}>
            {[
              { label: "Полное наименование", value: COMPANY.fullName },
              { label: "Сокращённое", value: COMPANY.shortName },
              { label: "ИНН", value: COMPANY.inn },
              { label: "ОГРНИП", value: COMPANY.ogrnip },
              { label: "Юридический адрес", value: COMPANY.postalAddress },
              { label: "Банк", value: COMPANY.bank.name },
              { label: "Расчётный счёт", value: COMPANY.bank.account },
              { label: "Корр. счёт", value: COMPANY.bank.corrAccount },
              { label: "БИК", value: COMPANY.bank.bic },
            ]
              .filter((x) => x.value)
              .map(({ label, value }) => (
                <div key={label}>
                  <p style={{ color: "var(--text-subtle)" }} className="uppercase tracking-[0.1em]">
                    {label}:
                  </p>
                  <p className="break-all tabular-nums" style={{ color: "var(--text-muted)" }}>
                    {value}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactsTerminalSection() {
  const [typedLine, setTypedLine] = useState("");
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const cmd = "cat ~/studio/contact_channels.txt";
    if (sessionStorage.getItem(INTRO_KEY) === "1") {
      setTypedLine(cmd);
      setIntroDone(true);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTypedLine(cmd.slice(0, i));
      if (i >= cmd.length) {
        clearInterval(id);
        setIntroDone(true);
        sessionStorage.setItem(INTRO_KEY, "1");
      }
    }, 38);
    return () => clearInterval(id);
  }, []);

  const accent = "var(--accent)";
  const muted = "var(--text-muted)";
  const subtle = "var(--text-subtle)";

  return (
    <Section id="contacts" className="!pt-12 md:!pt-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-matrix text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
          Контакты
        </p>
        <h1 className="mt-3 font-heading text-2xl leading-tight tracking-tight md:text-3xl lg:text-4xl" style={{ color: "var(--text)" }}>
          Свяжитесь с нами
        </h1>

        <TerminalWindow titleBar="studio — zsh — contacts" className="mt-10">
          <p style={{ color: muted }} className="mb-4">
            <span style={{ color: accent }}>code1618</span>
            <span style={{ color: subtle }}>@</span>
            <span style={{ color: accent }}>studio</span>
            <span style={{ color: muted }}>:~/contacts$ </span>
            <span style={{ color: "var(--text)" }}>{typedLine}</span>
            {!introDone && <span className="animate-pulse" style={{ color: accent }}>▌</span>}
          </p>

          {introDone && (
            <>
              <pre
                className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed sm:text-xs md:text-sm"
                style={{ color: subtle }}
              >
                {`# Думаете о проекте или консультации — ниже каналы связи.
# Форму заявки: ./open_brief.sh — откроется страница в том же стиле (кнопка ниже).
`}
              </pre>

              <div className="mt-6 space-y-1 font-mono text-[11px] sm:text-xs md:text-sm" style={{ color: "var(--text)" }}>
                {CONTACT_METHODS.map(({ icon: Icon, label, value, href, external }) => (
                  <div key={label} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 py-2 border-b border-[var(--border)] last:border-0">
                    <span style={{ color: accent }} className="shrink-0">
                      →
                    </span>
                    <span style={{ color: subtle }} className="min-w-[7rem] uppercase tracking-[0.08em]">
                      [{label}]
                    </span>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="break-all underline decoration-[var(--border)] underline-offset-2 transition-colors hover:decoration-[var(--accent)]"
                      style={{ color: "var(--text)" }}
                    >
                      {value}
                    </a>
                    <Icon size={12} className="shrink-0 opacity-50" style={{ color: muted }} aria-hidden />
                  </div>
                ))}
              </div>

              <div
                className="mt-6 inline-flex items-center gap-2 rounded border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em]"
                style={{ borderColor: "var(--border)", color: muted }}
              >
                <Building2 size={12} />
                {COMPANY.shortName}
              </div>

              <Link
                href="/brief"
                className="mt-8 flex w-full items-center justify-center gap-2 border py-3 font-matrix text-[10px] uppercase tracking-[0.2em] transition-colors hover:opacity-90 sm:text-xs"
                style={{ borderColor: "var(--accent)", color: "var(--text)" }}
              >
                <span style={{ color: accent }}>$</span> ./open_brief.sh
                <ArrowRight size={14} style={{ color: accent }} aria-hidden />
              </Link>

              <p style={{ color: subtle }} className="mt-4 text-[10px] uppercase tracking-[0.15em]">
                Полноэкранная страница заявки — удобно заполнять с телефона и десктопа
              </p>

              <RequisitesTerminalBlock />
            </>
          )}
        </TerminalWindow>
      </div>
    </Section>
  );
}
