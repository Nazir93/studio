/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Древовидное подключение тяжёлых пакетов — меньше JS при навигации */
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  /** Сборка Docker: `frontend/Dockerfile` копирует `.next/standalone` */
  output: "standalone",
  /** Ускоряет `next build` на слабом VPS (lint отдельно: `npm run lint`) */
  eslint: {
    ignoreDuringBuilds: true,
  },
  /**
   * Только для `next dev` без --turbo. Turbopack эти опции не применяет — для стабильности на Windows
   * используйте обычный `npm run dev` (см. .env.development WATCHPACK_POLLING).
   */
  webpack: (config, { dev }) => {
    if (dev) {
      const poll = process.env.WATCHPACK_POLLING === "true";
      config.watchOptions = {
        ...config.watchOptions,
        followSymlinks: false,
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
        ],
        ...(poll ? { poll: 1000 } : {}),
      };
    }
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
