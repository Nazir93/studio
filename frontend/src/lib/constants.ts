export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "CODE 1.618";
/** Читаемое написание бренда (как в домене code1618) */
export const SITE_BRAND_MARK = "CODE1618";
export const SITE_TAGLINE = "Студия разработки";
export const CITY = process.env.NEXT_PUBLIC_CITY || "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const PHONE = "+7 917 704-18-93";
export const PHONE_RAW = "+79177041893";
export const EMAIL = "info@code1618.ru";
export const ADDRESS = "";
export const WORKING_HOURS = "";

export const COMPANY = {
  fullName: "CODE 1.618",
  shortName: "CODE 1.618",
  inn: "",
  ogrnip: "",
  postalAddress: "",
  bank: {
    name: "",
    account: "",
    corrAccount: "",
    bic: "",
  },
};

export const SOCIAL_LINKS = {
  telegram: "https://t.me/code_1618",
  /** WhatsApp: тот же номер, что и PHONE_RAW */
  whatsapp: "https://wa.me/79177041893",
  /** MAX (мессенджер) */
  max: "https://max.ru/u/f9LHodD0cOKXWSiERxwblhr1182uhvERfxKmce6N29hUgAgc79b6PhoMvLg",
};

export const SERVICES = [
  {
    id: "ai-automation",
    slug: "/services/ai-automation",
    title: "ИИ и автоматизация",
    shortDescription:
      "Monday.com, процессы, AI-сотрудники и RPA: меньше рутины в маркетинге, продажах и операционке.",
    icon: "zap" as const,
    coverImage: null as string | null,
    videoUrl: "/videos/ai.mp4",
  },
  {
    id: "testing",
    slug: "/services/testing",
    title: "Тестирование",
    shortDescription:
      "Сайты, приложения, ПО, API. Ручное и автоматизированное QA, проверка работ подрядчиков.",
    icon: "shield" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "personal-cabinet",
    slug: "/services/personal-cabinet",
    title: "Личные кабинеты",
    shortDescription:
      "Порталы для сотрудников и клиентов: корпоративные сервисы, интеграции, безопасность. Time & material.",
    icon: "home" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "preproject-research",
    slug: "/services/preproject-research",
    title: "Предпроектное исследование",
    shortDescription:
      "Discovery и нулевой спринт: воркшопы, анализ рынка, прототип в Figma, ТЗ и дорожная карта до старта разработки.",
    icon: "zap" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "ux-ui-design",
    slug: "/services/ux-ui-design",
    title: "UX/UI-дизайн",
    shortDescription:
      "Интерфейсы сайтов и приложений: исследования, прототипы, UI-киты и дизайн-системы в Figma.",
    icon: "network" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "development",
    slug: "/services/development",
    title: "Разработка",
    shortDescription:
      "Frontend, Backend, iOS, Android, API. Приложения и веб-сервисы на заказ со множеством интеграций.",
    icon: "code" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "outstaff",
    slug: "/services/outstaff",
    title: "Аутстаф",
    shortDescription:
      "Разработчики, дизайнеры, аналитики, тестеры. Усилим вашу команду или соберём с нуля.",
    icon: "users" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
  {
    id: "advertising",
    slug: "/services/advertising",
    title: "Реклама и продвижение",
    shortDescription:
      "Таргет, контекст, SEO, SMM — привлекаем клиентов через digital-каналы со сквозной аналитикой.",
    icon: "megaphone" as const,
    coverImage: null as string | null,
    videoUrl: null as string | null,
  },
];

export const STATS = [
  { value: 7, label: "лет в разработке", suffix: "+" },
  { value: 45, label: "проектов реализовано", suffix: "+" },
  { value: 12, label: "специалистов в команде", suffix: "" },
  { value: 60, label: "дней гарантии на софт", suffix: "" },
] as const;
