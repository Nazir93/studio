"use client";

import { useState, type ComponentType } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import {
  Phone, Mail, Send, CreditCard, ChevronDown, Building2, ArrowRight,
} from "lucide-react";
import { PHONE, PHONE_RAW, EMAIL, SOCIAL_LINKS, COMPANY } from "@/lib/constants";
import { WhatsAppGlyph, MaxChannelGlyph } from "@/components/ui/contact-channels-bar";

function RequisitesBlock() {
  const [open, setOpen] = useState(false);
  const hasRequisites =
    COMPANY.inn || COMPANY.ogrnip || COMPANY.postalAddress || COMPANY.bank.name;

  if (!hasRequisites) return null;

  return (
    <div
      className="mt-12 overflow-hidden rounded-2xl transition-colors"
      style={{ border: "1px solid var(--border)" }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group flex w-full items-center justify-between px-5 py-4 text-left sm:px-6 sm:py-5"
      >
        <div className="flex items-center gap-3">
          <CreditCard size={18} style={{ color: "var(--text-muted)" }} />
          <span className="font-body text-sm font-medium sm:text-base" style={{ color: "var(--text)" }}>
            Реквизиты компании
          </span>
        </div>
        <ChevronDown
          size={16}
          className="transition-transform duration-300"
          style={{
            color: "var(--text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? "600px" : "0", opacity: open ? 1 : 0 }}
      >
        <div className="border-t px-5 pb-5 sm:px-6 sm:pb-6" style={{ borderColor: "var(--border)" }}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 pt-4 sm:grid-cols-2">
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
                <div key={label} className="py-1">
                  <p className="mb-1 text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>
                    {label}
                  </p>
                  <p className="break-all font-mono text-xs tabular-nums sm:text-sm" style={{ color: "var(--text-muted)" }}>
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

const CONTACT_METHODS = [
  {
    icon: Phone,
    label: "Телефон",
    value: PHONE,
    href: `tel:${PHONE_RAW}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    icon: Send,
    label: "Telegram",
    value: "@code_1618",
    href: SOCIAL_LINKS.telegram,
    external: true,
  },
  {
    icon: WhatsAppGlyph as ComponentType<{ size?: number }>,
    label: "WhatsApp",
    value: PHONE,
    href: SOCIAL_LINKS.whatsapp,
    external: true,
  },
  {
    icon: MaxChannelGlyph as ComponentType<{ size?: number }>,
    label: "MAX",
    value: "max.ru",
    href: SOCIAL_LINKS.max,
    external: true,
  },
];

export function ContactsSection() {
  return (
    <Section id="contacts" className="!pt-12 md:!pt-20">
      <div className="mx-auto max-w-3xl">
        <p className="font-matrix text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--text-muted)" }}>
          Контакты
        </p>
        <h1 className="mt-3 font-heading text-xl leading-tight tracking-tight sm:text-2xl md:text-3xl lg:text-4xl" style={{ color: "var(--text)" }}>
          Свяжитесь с нами
        </h1>

        <div className="font-body mt-8 space-y-4 text-base leading-relaxed md:text-lg" style={{ color: "var(--text-muted)" }}>
          <p>
            Думаете о новом проекте, решении проблемы или просто хотите консультацию? Давайте сделаем это!
          </p>
          <p>
            Используйте форму на этой странице или свяжитесь с нами другими способами.
          </p>
          <p className="text-sm md:text-base">
            Мы любим вопросы и обратную связь — и всегда рады помочь!
          </p>
        </div>

        <Link
          href="/brief?source=contacts-page"
          className="mt-8 inline-flex items-center gap-3 px-8 py-4 font-matrix text-xs uppercase tracking-[0.2em] transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
        >
          Открыть форму заявки
          <ArrowRight size={16} />
        </Link>

        <div
          className="mt-12 inline-flex items-center gap-2 rounded-full border px-4 py-2"
          style={{ borderColor: "var(--border)" }}
        >
          <Building2 size={14} style={{ color: "var(--text-muted)" }} />
          <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
            {COMPANY.shortName}
          </span>
        </div>

        <h2 className="mt-12 font-matrix text-xs uppercase tracking-[0.2em]" style={{ color: "var(--text)" }}>
          Вот несколько способов, как можно с нами связаться
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {CONTACT_METHODS.map(({ icon: Icon, label, value, href, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-start gap-4 rounded-xl border p-5 transition-colors md:p-6"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-colors group-hover:border-[var(--text)]"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-subtle)" }}>
                  {label}
                </p>
                <p
                  className="mt-1 break-all text-sm transition-colors group-hover:underline sm:text-base"
                  style={{ color: "var(--text)" }}
                >
                  {value}
                </p>
              </div>
            </a>
          ))}
        </div>

        <RequisitesBlock />
      </div>
    </Section>
  );
}
