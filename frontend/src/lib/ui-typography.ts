/**
 * JetBrains Mono (`font-matrix` / Tailwind `font-body`) — навигация в шапке и основной текст страниц.
 * AKONY — класс `font-heading` только на **одном главном h1** страницы (герой, титул раздела).
 * Все h2 и остальной UI — `font-body` / `font-matrix` (см. константы ниже).
 */

/** Пункты верхнего меню, боковая «Обсудить проект», навигация на welcome-баннере */
export const FONT_UI_MONO_NAV =
  "font-matrix font-normal text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.08em] sm:tracking-[0.12em] uppercase";

/** Заголовки колонок в мобильном полноэкранном меню */
export const FONT_UI_MONO_SECTION =
  "font-matrix font-normal text-[10px] sm:text-[11px] md:text-[12px] tracking-[0.08em] sm:tracking-[0.12em] uppercase";

/** Кнопка CTA в меню / компактные кнопки */
export const FONT_UI_MONO_CTA =
  "font-matrix font-normal text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.12em] uppercase";

/** Крупная кнопка в футере (как лендинги, но matrix) */
export const FONT_UI_MONO_CTA_LARGE =
  "font-matrix font-normal text-lg sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-[0.06em] sm:tracking-[0.08em]";

/** Крупная CTA — AKONY, в духе заголовков баннера */
export const FONT_UI_AKONY_CTA_LARGE =
  "font-akony font-normal text-[clamp(1.35rem,3.8vw,2.85rem)] uppercase tracking-[0.04em] sm:tracking-[0.07em] leading-[1.02]";

/** Компактная CTA в меню / вторичные кнопки */
export const FONT_UI_AKONY_CTA =
  "font-akony font-normal text-[13px] sm:text-sm md:text-base uppercase tracking-[0.1em]";

/** Подпункты меню — моноширинный, но без капса (длинные названия услуг) */
export const FONT_UI_MONO_MENU_BODY =
  "font-matrix font-normal text-[11px] sm:text-xs tracking-[0.03em] leading-snug normal-case";

/** Телефон / email в полоске шапки (без forced uppercase — корректный e-mail) */
export const FONT_UI_MONO_CONTACT =
  "font-matrix font-normal text-[10px] sm:text-[11px] tracking-[0.06em] sm:tracking-[0.08em] tabular-nums normal-case";

/** Крупные цифры в нижней панели статистики (не AKONY) */
export const FONT_UI_MONO_STAT_NUM =
  "font-matrix font-normal text-lg sm:text-xl md:text-2xl lg:text-3xl tabular-nums leading-none tracking-[0.06em] uppercase";

/** Подписи к цифрам статистики */
export const FONT_UI_MONO_STAT_LABEL =
  "font-matrix font-normal text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.08em] sm:tracking-[0.1em] uppercase";
