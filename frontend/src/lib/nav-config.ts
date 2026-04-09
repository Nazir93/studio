/**
 * Навигация шапки (fullscreen-меню, desktop top bar, боковая панель).
 * Пункты: кейсы, услуги, ИИ/автоматизация, новости, обсудить проект.
 */

import { PORTFOLIO_SECTORS } from "@/lib/portfolio-sectors";

export type NavItem = { href: string; label: string };

export type NavSection = {
  label: string;
  items: NavItem[];
};

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
    label: "Проект",
    items: [
      { href: "/contacts", label: "Контакты" },
      { href: "/brief?source=nav", label: "Обсудить проект" },
    ],
  },
];
