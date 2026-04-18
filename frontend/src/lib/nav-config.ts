/**
 * Навигация шапки (fullscreen-меню, desktop top bar, боковая панель).
 * Пункты: кейсы, услуги, ИИ/автоматизация, новости, контакты.
 */

import { PORTFOLIO_SECTORS } from "@/lib/portfolio-sectors";

export type NavItem = { href: string; label: string };

export type NavSection = {
  label: string;
  items: NavItem[];
};

/** Верхняя строка шапки (десктоп): без выпадающих списков — как в макете */
export const HEADER_TOP_LINKS: NavItem[] = [
  { href: "/portfolio", label: "Кейсы" },
  { href: "/services", label: "Услуги" },
  { href: "/services/ai-automation", label: "ИИ и автоматизация" },
  { href: "/blog", label: "Новости" },
  { href: "/contacts", label: "Контакты" },
];

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Кейсы",
    items: [
      { href: "/portfolio", label: "Все" },
      ...PORTFOLIO_SECTORS.map((s) => ({
        href: `/portfolio?sector=${s.id}`,
        label: s.label,
      })),
    ],
  },
  {
    label: "Услуги",
    items: [
      { href: "/services", label: "Все направления" },
      { href: "/services/development", label: "Сайты и разработка ПО" },
      { href: "/services/smart-contracts", label: "Смарт-контракты" },
      { href: "/services/ux-ui-design", label: "UX/UI-дизайн" },
      { href: "/services/preproject-research", label: "Предпроект и Discovery" },
      { href: "/services/testing", label: "Тестирование" },
      { href: "/services/personal-cabinet", label: "Личные кабинеты и порталы" },
      { href: "/services/outstaff", label: "Аутстаф команды" },
    ],
  },
  {
    label: "ИИ и автоматизация",
    items: [
      { href: "/services/ai-automation", label: "Внедрение Monday.com и процессов" },
      { href: "/services/ai-automation#ai-workers", label: "AI-сотрудники и цифровые роботы" },
    ],
  },
  {
    label: "Новости",
    items: [{ href: "/blog", label: "Блог студии" }],
  },
  {
    label: "Связь",
    items: [
      { href: "/contacts", label: "Контакты" },
      { href: "/brief?source=nav", label: "Обсудить проект" },
    ],
  },
];
