import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Inter, Montserrat } from "next/font/google";
import { SiteShell } from "@/components/layout/site-shell";
import { ThemeProvider } from "@/lib/theme-context";
import { ModalProvider } from "@/lib/modal-context";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import { AnalyticsScripts } from "@/components/seo/analytics";
import { JsonLd } from "@/components/seo/json-ld";
import "./globals.css";

/** Основной UI: AKONY — геометрический, современный (вместо Montserrat) */
const akonyMain = localFont({
  src: [{ path: "../../public/fonts/AKONY.woff2", weight: "400", style: "normal" }],
  variable: "--font-main",
  display: "swap",
});

const interBody = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/** Читабельный текст в разделе «Кейсы» (заголовки — по-прежнему AKONY / font-heading) */
const montserratPortfolio = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const blackOpsOne = localFont({
  src: [{ path: "../../public/fonts/BlackOpsOne.otf", weight: "400", style: "normal" }],
  variable: "--font-blackops",
  display: "swap",
});

const metalLord = localFont({
  src: [{ path: "../../public/fonts/MetalLord.otf", weight: "400", style: "normal" }],
  variable: "--font-metallord",
  display: "swap",
});

const redMolot = localFont({
  src: [{ path: "../../public/fonts/RedMolot.ttf", weight: "400", style: "normal" }],
  variable: "--font-redmolot",
  display: "swap",
});

const spriteGraffiti = localFont({
  src: [{ path: "../../public/fonts/SpriteGraffiti.woff2", weight: "400", style: "normal" }],
  variable: "--font-graffiti",
  display: "swap",
});

/** Единая конфигурация viewport — корректно на мобильных, notch, масштабирование */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  /** По умолчанию сайт в тёмной теме; цвет панели браузера под тёмный фон */
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "CODE 1.618 — студия разработки сайтов, лендингов, корпоративных порталов и ИИ-решений.",
  keywords: [
    "CODE 1.618",
    "студия разработки",
    "разработка сайтов",
    "лендинги",
    "корпоративные порталы",
    "ИИ работники",
    "веб-разработка",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: "Разработка сайтов, лендингов, корпоративных порталов и ИИ-решений.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
  /** Тот же файл, что логотип в шапке (`/public/logo.png`) */
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: [{ url: "/logo.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      data-theme="dark"
      suppressHydrationWarning
      className={`${akonyMain.variable} ${interBody.variable} ${montserratPortfolio.variable} ${blackOpsOne.variable} ${metalLord.variable} ${redMolot.variable} ${spriteGraffiti.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='code1618-theme';var s=localStorage.getItem(k);var t=s==='light'||s==='dark'?s:'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
        <meta name="format-detection" content="telephone=no" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <JsonLd />
      </head>
      <body className="font-body font-normal normal-case antialiased theme-bg theme-text transition-colors duration-500">
        <ThemeProvider>
          <ModalProvider>
            <SiteShell>{children}</SiteShell>
          </ModalProvider>
        </ThemeProvider>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
