/**
 * После `next build` с output: "standalone" Next.js кладёт server.js в `.next/standalone`,
 * но не копирует туда `public` и `.next/static`. Без них сайт открывается без CSS/JS.
 * Скрипт вызывается из `npm run build` (после `next build`).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.join(__dirname, "..");
const standalone = path.join(frontendRoot, ".next", "standalone");

if (!fs.existsSync(standalone)) {
  console.log("[copy-standalone-assets] пропуск: нет .next/standalone (нужен next build с output standalone)");
  process.exit(0);
}

function mustCopyDir(src, dest, label) {
  if (!fs.existsSync(src)) {
    console.error(`[copy-standalone-assets] нет каталога ${label}: ${src}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
  console.log(`[copy-standalone-assets] OK: ${label} → ${dest}`);
}

mustCopyDir(
  path.join(frontendRoot, "public"),
  path.join(standalone, "public"),
  "public"
);
fs.mkdirSync(path.join(standalone, ".next"), { recursive: true });
mustCopyDir(
  path.join(frontendRoot, ".next", "static"),
  path.join(standalone, ".next", "static"),
  ".next/static"
);
