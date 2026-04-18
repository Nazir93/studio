/** Разделы портфолио — меню «Кейсы» и фильтр на /portfolio */

export const PORTFOLIO_SECTORS = [
  { id: "web-services", label: "Web-сервисы" },
  { id: "corporate-soft", label: "Корпоративный софт" },
  { id: "ux-ui", label: "UX/UI" },
  { id: "retail", label: "Ритейл" },
  { id: "mobile-apps", label: "Мобильные приложения" },
  { id: "transport-logistics", label: "Транспорт и логистика" },
  { id: "manufacturing", label: "Производство" },
  { id: "industry", label: "Промышленность" },
  { id: "real-estate", label: "Недвижимость" },
  { id: "commerce", label: "Коммерция" },
] as const;

export type PortfolioSectorId = (typeof PORTFOLIO_SECTORS)[number]["id"];

export function isPortfolioSectorId(v: string | null | undefined): v is PortfolioSectorId {
  return !!v && PORTFOLIO_SECTORS.some((s) => s.id === v);
}
