import {
  SITE_NAME,
  CITY,
  SITE_URL,
  PHONE_RAW,
  EMAIL,
  ADDRESS,
} from "@/lib/constants";

export async function JsonLd() {
  const area = CITY
    ? { "@type": "City" as const, name: CITY }
    : { "@type": "Country" as const, name: "RU" };

  const organization = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    description: `Студия разработки сайтов, веб-сервисов и цифровых продуктов. UX/UI, заказная разработка, тестирование, внедрение Monday.com и AI-автоматизация.${CITY ? ` Работаем с клиентами в ${CITY} и по всей России.` : ""}`,
    url: SITE_URL,
    telephone: PHONE_RAW,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      ...(CITY ? { addressLocality: CITY } : {}),
      addressCountry: "RU",
      ...(ADDRESS ? { streetAddress: ADDRESS } : {}),
    },
    areaServed: area,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги студии",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Разработка сайтов и ПО" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "UX/UI-дизайн" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Тестирование и QA" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "ИИ и автоматизация (Monday.com, AI-сотрудники)" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Личные кабинеты и порталы" } },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}
