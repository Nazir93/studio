export interface PriceItem {
  id: number;
  name: string;
  unit: string;
  price: number | null;
}

export interface PriceSection {
  id: string;
  title: string;
  items: PriceItem[];
}

/** Ориентировочные ставки студии разработки (без калькулятора — только справочник). */
export const PRICE_SECTIONS: PriceSection[] = [
  {
    id: "discovery",
    title: "Аналитика и проектирование",
    items: [
      { id: 1, name: "Предпроектное исследование, воркшопы, дорожная карта", unit: "от проекта", price: 120000 },
      { id: 2, name: "Техническое задание и спецификация требований", unit: "документ", price: 80000 },
      { id: 3, name: "Аудит существующего продукта или кода", unit: "итерация", price: 90000 },
    ],
  },
  {
    id: "design",
    title: "UX/UI",
    items: [
      { id: 4, name: "Дизайн ключевых экранов (лендинг или продукт)", unit: "экран", price: 18000 },
      { id: 5, name: "Интерактивный прототип в Figma", unit: "поток", price: 45000 },
      { id: 6, name: "UI-кит и дизайн-система", unit: "комплект", price: 95000 },
    ],
  },
  {
    id: "dev",
    title: "Разработка",
    items: [
      { id: 7, name: "Frontend (React / Next.js и др.)", unit: "час", price: 4500 },
      { id: 8, name: "Backend и API (Node и др.)", unit: "час", price: 5000 },
      { id: 9, name: "Мобильные приложения (iOS / Android)", unit: "час", price: 5500 },
      { id: 10, name: "Интеграции (CRM, платежи, внешние API)", unit: "час", price: 5500 },
    ],
  },
  {
    id: "qa",
    title: "Тестирование и сопровождение",
    items: [
      { id: 11, name: "Функциональное и регрессионное тестирование", unit: "час", price: 2800 },
      { id: 12, name: "Автотесты (e2e / API)", unit: "час", price: 4000 },
      { id: 13, name: "Техподдержка и доработки после запуска", unit: "мес от", price: 80000 },
    ],
  },
];
