"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, Search, X } from "lucide-react";
import { SITE_NAME, PHONE, PHONE_RAW } from "@/lib/constants";
import { PRICE_SECTIONS, type PriceSection, type PriceItem } from "./price-data";

const VAT_RATE = 0.2;

function formatPrice(n: number): string {
  return n.toLocaleString("ru-RU");
}

function StaticItemRow({
  item,
  withVat,
}: {
  item: PriceItem;
  withVat: boolean;
}) {
  const displayPrice = item.price
    ? withVat
      ? Math.round(item.price * (1 + VAT_RATE))
      : item.price
    : null;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-[1fr_80px_120px] gap-2 sm:gap-3 py-3 sm:py-3.5 border-b last:border-b-0 items-start sm:items-center"
      style={{ borderColor: "var(--border)" }}
    >
      <span className="text-xs sm:text-sm leading-tight" style={{ color: "var(--text-muted)" }}>
        {item.name}
      </span>
      <span className="text-[11px] sm:text-center" style={{ color: "var(--text-subtle)" }}>
        {item.unit}
      </span>
      <span className="text-sm font-body text-left sm:text-right tabular-nums" style={{ color: displayPrice ? "var(--text)" : "var(--text-muted)" }}>
        {displayPrice ? `${formatPrice(displayPrice)} ₽` : "по запросу"}
      </span>
    </div>
  );
}

function SectionAccordion({
  section,
  isOpen,
  onToggle,
  withVat,
  filteredItems,
}: {
  section: PriceSection;
  isOpen: boolean;
  onToggle: () => void;
  withVat: boolean;
  filteredItems: PriceItem[];
}) {
  return (
    <div className="border-b transition-colors" style={{ borderColor: "var(--border)" }}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 sm:py-5 px-4 sm:px-6 text-left group"
      >
        <div className="min-w-0">
          <span
            className="font-body text-sm sm:text-base transition-colors block truncate"
            style={{ color: isOpen ? "var(--text)" : "var(--text-muted)" }}
          >
            {section.title}
          </span>
          <span className="text-[10px] sm:text-xs block mt-0.5" style={{ color: "var(--text-subtle)" }}>
            {filteredItems.length} позиций
          </span>
        </div>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0"
          style={{
            backgroundColor: isOpen ? "color-mix(in srgb, var(--text) 12%, transparent)" : "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <ChevronDown
            size={14}
            className="transition-transform duration-300"
            style={{
              color: isOpen ? "var(--accent)" : "var(--text-muted)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isOpen ? `${Math.min(filteredItems.length * 56 + 80, 2000)}px` : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div
            className="hidden sm:grid grid-cols-[1fr_80px_120px] gap-3 pb-2.5 mb-1 border-b text-[10px] uppercase tracking-[0.15em]"
            style={{ borderColor: "var(--border)", color: "var(--text-subtle)" }}
          >
            <span>Наименование</span>
            <span className="text-center">Ед.</span>
            <span className="text-right">Цена</span>
          </div>
          {filteredItems.map((item) => (
            <StaticItemRow key={item.id} item={item} withVat={withVat} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PricePageContent() {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(PRICE_SECTIONS.map((s) => s.id))
  );
  const [withVat, setWithVat] = useState(false);
  const [search, setSearch] = useState("");

  const toggle = useCallback((id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setOpenSections(new Set(PRICE_SECTIONS.map((s) => s.id)));
  }, []);

  const collapseAll = useCallback(() => {
    setOpenSections(new Set());
  }, []);

  const searchLower = search.toLowerCase().trim();

  const filteredSections = useMemo(() => {
    if (!searchLower) return PRICE_SECTIONS.map((s) => ({ section: s, items: s.items }));
    return PRICE_SECTIONS.map((s) => ({
      section: s,
      items: s.items.filter((i) => i.name.toLowerCase().includes(searchLower)),
    })).filter((s) => s.items.length > 0);
  }, [searchLower]);

  const totalItemsCount = PRICE_SECTIONS.reduce((n, s) => n + s.items.length, 0);

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <section className="pt-10 sm:pt-14 md:pt-20 pb-8 sm:pb-10 md:pb-14">
        <div className="container mx-auto">
          <p
            className="text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-4 sm:mb-6"
            style={{ color: "var(--text-subtle)" }}
          >
            {SITE_NAME} / Прайс
          </p>
          <h1 className="font-heading page-inset-hero-title leading-[0.95] tracking-tight mb-4 sm:mb-6">
            СТАВКИ И ФОРМАТЫ
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Ориентировочные цены на услуги студии. Итоговая стоимость фиксируется в договоре после
            согласования объёма и сроков. Переключите отображение с НДС при необходимости.
          </p>

          <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-8">
            {[
              { label: "Разделов", value: PRICE_SECTIONS.length },
              { label: "Позиций", value: totalItemsCount },
            ].map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-2">
                <span className="font-body text-lg font-semibold tabular-nums sm:text-2xl md:text-3xl" style={{ color: "var(--accent)" }}>
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-30 border-y backdrop-blur-xl" style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--bg) 85%, transparent)" }}>
        <div className="container mx-auto py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 min-w-0 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-subtle)" }} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по прайсу..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-transparent outline-none"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg"
                  style={{ color: "var(--text-muted)" }}
                  aria-label="Очистить"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setWithVat(!withVat)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300"
                style={{
                  backgroundColor: withVat ? "color-mix(in srgb, var(--text) 12%, transparent)" : "var(--bg-secondary)",
                  border: `1px solid ${withVat ? "color-mix(in srgb, var(--text) 35%, transparent)" : "var(--border)"}`,
                  color: withVat ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                <div
                  className="w-8 h-[18px] rounded-full relative transition-colors duration-300"
                  style={{ backgroundColor: withVat ? "var(--accent)" : "var(--border)" }}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full absolute top-[2px] transition-all duration-300"
                    style={{
                      backgroundColor: withVat ? "#fff" : "var(--text-muted)",
                      left: withVat ? "16px" : "2px",
                    }}
                  />
                </div>
                НДС 20%
              </button>

              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={expandAll}
                  className="px-3 py-2 rounded-xl text-xs transition-colors"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    backgroundColor: "var(--bg-secondary)",
                  }}
                >
                  Развернуть
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="px-3 py-2 rounded-xl text-xs transition-colors"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    backgroundColor: "var(--bg-secondary)",
                  }}
                >
                  Свернуть
                </button>
              </div>
            </div>
          </div>

          {search && (
            <p className="text-[11px] mt-2" style={{ color: "var(--text-subtle)" }}>
              Найдено: {filteredSections.reduce((n, s) => n + s.items.length, 0)} позиций в {filteredSections.length}{" "}
              разделах
            </p>
          )}
        </div>
      </section>

      <section className="pb-32 sm:pb-36">
        <div className="container mx-auto">
          <div className="rounded-2xl overflow-hidden border mt-0" style={{ borderColor: "var(--border)" }}>
            {filteredSections.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Ничего не найдено по запросу «{search}»
                </p>
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-3 text-xs underline"
                  style={{ color: "var(--accent)" }}
                >
                  Сбросить поиск
                </button>
              </div>
            ) : (
              filteredSections.map(({ section, items }) => (
                <SectionAccordion
                  key={section.id}
                  section={section}
                  isOpen={openSections.has(section.id)}
                  onToggle={() => toggle(section.id)}
                  withVat={withVat}
                  filteredItems={items}
                />
              ))
            )}
          </div>

          <p
            className="mt-6 text-[11px] sm:text-xs leading-relaxed max-w-2xl"
            style={{ color: "var(--text-subtle)" }}
          >
            * Ориентировочные цены без НДС (если переключатель выключен). Окончательная стоимость — после согласования
            технического задания.
          </p>
        </div>
      </section>

      <section className="border-t py-12 sm:py-16 md:py-20" style={{ borderColor: "var(--border)" }}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="font-body text-lg font-semibold sm:text-xl md:text-2xl mb-3 leading-snug">
                Нужна смета под ваш проект?
              </h2>
              <p className="text-xs sm:text-sm max-w-md" style={{ color: "var(--text-muted)" }}>
                Опишите задачу в брифе — подготовим оценку сроков и бюджета без калькулятора по списку работ.
              </p>
            </div>
            <Link
              href="/brief?source=price-page"
              className="flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-matrix text-sm sm:text-base uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02] min-h-[48px] w-full md:w-auto text-center"
              style={{ backgroundColor: "var(--accent)", color: "#000" }}
            >
              Заполнить бриф
            </Link>
          </div>

          <div
            className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
              Вопросы по формату работы?
            </p>
            <a
              href={`tel:${PHONE_RAW}`}
              className="font-body text-lg font-medium sm:text-xl transition-colors hover:opacity-80"
              style={{ color: "var(--text)" }}
            >
              {PHONE}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
