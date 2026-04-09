import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0A0A0A",
          dark: "#050505",
          accent: "#fafafa",
          "accent-hover": "#ffffff",
          light: "#FAFAFA",
          gray: "#1A1A1A",
          muted: "#8e8e8e",
          border: "#dbdbdb",
        },
        matrix: {
          DEFAULT: "#e5e5e5",
          dim: "#a3a3a3",
          glow: "#fafafa",
          dark: "#171717",
        },
      },
      fontFamily: {
        /** AKONY — только заголовки и акцентные цифры */
        heading: ["var(--font-main)", "sans-serif"],
        /** Основной текст страниц — JetBrains Mono, как пункты меню в шапке */
        body: ["var(--font-matrix)", "'Courier New'", "monospace"],
        /** Inter — редкие блоки, где нужен гротеск (подключён в layout как --font-body) */
        inter: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        matrix: ["var(--font-matrix)", "'Courier New'", "monospace"],
        /** Портфолио: основной текст кейсов */
        montserrat: ["var(--font-montserrat)", "ui-sans-serif", "system-ui", "sans-serif"],
        blackops: ["var(--font-blackops)", "sans-serif"],
        akony: ["var(--font-main)", "sans-serif"],
        metallord: ["var(--font-metallord)", "sans-serif"],
        redmolot: ["var(--font-redmolot)", "sans-serif"],
        graffiti: ["var(--font-graffiti)", "cursive"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "count-up": "countUp 2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
