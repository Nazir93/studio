export interface OutstaffRate {
  level: string;
  hourly: string;
  monthly: string;
}

export interface OutstaffRole {
  name: string;
  rates: OutstaffRate[];
}

export interface OutstaffCategory {
  title: string;
  roles: OutstaffRole[];
}

export const OUTSTAFF_CATEGORIES: OutstaffCategory[] = [
  {
    title: "Backend-разработчики",
    roles: [
      {
        name: "Node.js (Nest.js)",
        rates: [
          { level: "Middle", hourly: "2 600 ₽", monthly: "429 000 ₽" },
          { level: "Middle +", hourly: "2 800 ₽", monthly: "462 000 ₽" },
          { level: "Senior", hourly: "3 000 ₽", monthly: "495 000 ₽" },
        ],
      },
      {
        name: "Java",
        rates: [
          { level: "Middle", hourly: "2 600 ₽", monthly: "429 000 ₽" },
          { level: "Middle +", hourly: "2 800 ₽", monthly: "462 000 ₽" },
          { level: "Senior", hourly: "3 000 ₽", monthly: "495 000 ₽" },
        ],
      },
      {
        name: "PHP (Yii2, Laravel)",
        rates: [
          { level: "Middle", hourly: "2 500 ₽", monthly: "412 500 ₽" },
          { level: "Middle +", hourly: "2 700 ₽", monthly: "445 500 ₽" },
          { level: "Senior", hourly: "2 900 ₽", monthly: "478 500 ₽" },
        ],
      },
      {
        name: ".NET (ASP.NET)",
        rates: [
          { level: "Middle", hourly: "2 600 ₽", monthly: "429 000 ₽" },
          { level: "Middle +", hourly: "2 800 ₽", monthly: "462 000 ₽" },
          { level: "Senior", hourly: "3 000 ₽", monthly: "495 000 ₽" },
        ],
      },
      {
        name: "Python",
        rates: [
          { level: "Middle", hourly: "2 600 ₽", monthly: "429 000 ₽" },
          { level: "Middle +", hourly: "2 800 ₽", monthly: "462 000 ₽" },
          { level: "Senior", hourly: "3 000 ₽", monthly: "495 000 ₽" },
        ],
      },
      {
        name: "C#",
        rates: [
          { level: "Middle", hourly: "2 600 ₽", monthly: "429 000 ₽" },
          { level: "Middle +", hourly: "2 800 ₽", monthly: "462 000 ₽" },
          { level: "Senior", hourly: "3 000 ₽", monthly: "495 000 ₽" },
        ],
      },
      {
        name: "GO",
        rates: [
          { level: "Middle", hourly: "2 600 ₽", monthly: "429 000 ₽" },
          { level: "Middle +", hourly: "2 800 ₽", monthly: "462 000 ₽" },
          { level: "Senior", hourly: "3 000 ₽", monthly: "495 000 ₽" },
        ],
      },
    ],
  },
  {
    title: "Frontend-разработчики",
    roles: [
      {
        name: "React JavaScript",
        rates: [
          { level: "Middle", hourly: "2 500 ₽", monthly: "412 500 ₽" },
          { level: "Middle +", hourly: "2 700 ₽", monthly: "445 500 ₽" },
          { level: "Senior", hourly: "2 900 ₽", monthly: "478 500 ₽" },
        ],
      },
      {
        name: "VUE JavaScript",
        rates: [
          { level: "Middle", hourly: "2 500 ₽", monthly: "412 500 ₽" },
          { level: "Middle +", hourly: "2 700 ₽", monthly: "445 500 ₽" },
          { level: "Senior", hourly: "2 900 ₽", monthly: "478 500 ₽" },
        ],
      },
    ],
  },
  {
    title: "Mobile-разработчики",
    roles: [
      {
        name: "iOS (Swift)",
        rates: [
          { level: "Middle", hourly: "2 600 ₽", monthly: "429 000 ₽" },
          { level: "Middle +", hourly: "2 800 ₽", monthly: "462 000 ₽" },
          { level: "Senior", hourly: "3 000 ₽", monthly: "495 000 ₽" },
        ],
      },
      {
        name: "Android (Kotlin, Java)",
        rates: [
          { level: "Middle", hourly: "2 600 ₽", monthly: "429 000 ₽" },
          { level: "Middle +", hourly: "2 800 ₽", monthly: "462 000 ₽" },
          { level: "Senior", hourly: "3 000 ₽", monthly: "495 000 ₽" },
        ],
      },
    ],
  },
  {
    title: "Дизайн, QA и аналитика",
    roles: [
      {
        name: "Дизайнеры (Figma)",
        rates: [
          { level: "Middle", hourly: "2 200 ₽", monthly: "363 000 ₽" },
          { level: "Middle +", hourly: "2 300 ₽", monthly: "379 500 ₽" },
          { level: "Senior", hourly: "2 500 ₽", monthly: "412 500 ₽" },
        ],
      },
      {
        name: "Тестировщики / QA",
        rates: [
          { level: "Middle", hourly: "2 000 ₽", monthly: "330 000 ₽" },
          { level: "Middle +", hourly: "2 300 ₽", monthly: "379 500 ₽" },
          { level: "Senior", hourly: "2 500 ₽", monthly: "412 500 ₽" },
        ],
      },
      {
        name: "Бизнес-аналитики",
        rates: [
          { level: "Middle", hourly: "2 300 ₽", monthly: "379 500 ₽" },
          { level: "Middle +", hourly: "2 500 ₽", monthly: "412 500 ₽" },
          { level: "Senior", hourly: "2 700 ₽", monthly: "445 500 ₽" },
        ],
      },
      {
        name: "Системные аналитики",
        rates: [
          { level: "Middle", hourly: "2 500 ₽", monthly: "412 500 ₽" },
          { level: "Middle +", hourly: "2 700 ₽", monthly: "445 500 ₽" },
          { level: "Senior", hourly: "2 900 ₽", monthly: "478 500 ₽" },
        ],
      },
    ],
  },
  {
    title: "Управление и DevOps",
    roles: [
      {
        name: "Project Manager",
        rates: [
          { level: "Middle", hourly: "2 300 ₽", monthly: "379 500 ₽" },
          { level: "Middle +", hourly: "2 500 ₽", monthly: "412 500 ₽" },
          { level: "Senior", hourly: "2 700 ₽", monthly: "445 500 ₽" },
        ],
      },
      {
        name: "DevOps",
        rates: [
          { level: "Middle", hourly: "2 700 ₽", monthly: "445 500 ₽" },
          { level: "Middle +", hourly: "2 900 ₽", monthly: "478 500 ₽" },
          { level: "Senior", hourly: "3 100 ₽", monthly: "511 500 ₽" },
        ],
      },
      {
        name: "Тестировщики / AQA (Java)",
        rates: [
          { level: "Middle", hourly: "2 700 ₽", monthly: "445 500 ₽" },
          { level: "Middle +", hourly: "2 900 ₽", monthly: "478 500 ₽" },
          { level: "Senior", hourly: "3 100 ₽", monthly: "511 500 ₽" },
        ],
      },
      {
        name: "Технические писатели",
        rates: [
          { level: "Middle", hourly: "2 100 ₽", monthly: "346 500 ₽" },
          { level: "Middle +", hourly: "2 300 ₽", monthly: "379 500 ₽" },
          { level: "Senior", hourly: "2 600 ₽", monthly: "429 000 ₽" },
        ],
      },
    ],
  },
];
