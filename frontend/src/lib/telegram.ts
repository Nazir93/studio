export type TelegramSendFailure =
  | "missing_env"
  | "telegram_rejected"
  | "network";

export type TelegramSendResult =
  | { ok: true }
  | { ok: false; reason: TelegramSendFailure; telegramDescription?: string };

/** Краткая подсказка пользователю / владельцу сайта по тексту ошибки Telegram API */
export function userFacingTelegramHint(
  reason: TelegramSendFailure,
  telegramDescription?: string
): string | undefined {
  if (reason === "missing_env") return "Не заданы токен или chat_id на сервере.";
  if (reason === "network") {
    return "Сервер не достучался до api.telegram.org (сеть, фаервол, блокировка). Проверьте с VPS: curl -sI https://api.telegram.org";
  }
  const d = (telegramDescription ?? "").toLowerCase();
  if (d.includes("unauthorized")) return "Токен бота недействителен — выпустите новый в @BotFather и обновите токен.";
  if (d.includes("chat not found")) return "Неверный chat_id или диалог с ботом не открыт — откройте бота и нажмите /start.";
  if (d.includes("bot was blocked")) return "Пользователь заблокировал бота — используйте другой chat_id или группу.";
  if (d.includes("forbidden")) return "Бот не может писать в этот чат — добавьте бота в группу или нажмите /start в личке.";
  if (telegramDescription) return `Ответ Telegram: ${telegramDescription}`;
  return undefined;
}

/** Дефолты, если переменные окружения не заданы (можно переопределить через TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID). */
const DEFAULT_TELEGRAM_BOT_TOKEN = "8765604434:AAFHbAIr7EKg3VCMs5gGbIPYcKX9MOjcDh0";
const DEFAULT_TELEGRAM_CHAT_ID = "8765604434";

/** Пустая строка в systemd/.env не должна «перебивать» встроенный дефолт */
function envOrDefault(key: "TELEGRAM_BOT_TOKEN" | "TELEGRAM_CHAT_ID", fallback: string): string {
  const raw = process.env[key];
  if (raw === undefined || raw === null) return fallback;
  const t = raw.trim().replace(/^["']|["']$/g, "");
  return t.length > 0 ? t : fallback;
}

/** Доставка в Telegram; при ошибке смотрите telegramDescription и логи сервера */
export async function sendTelegramNotification(message: string): Promise<TelegramSendResult> {
  const botToken = envOrDefault("TELEGRAM_BOT_TOKEN", DEFAULT_TELEGRAM_BOT_TOKEN);
  const chatId = envOrDefault("TELEGRAM_CHAT_ID", DEFAULT_TELEGRAM_CHAT_ID);

  if (!botToken || !chatId) {
    console.warn("[TELEGRAM] Нет токена или chat_id");
    return { ok: false, reason: "missing_env" };
  }

  const TELEGRAM_MAX = 4096;

  try {
    const textHtml = message.length > TELEGRAM_MAX ? `${message.slice(0, TELEGRAM_MAX - 20)}…` : message;

    const sendOnce = async (payload: Record<string, unknown>) => {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, disable_web_page_preview: true, ...payload }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        description?: string;
        error_code?: number;
      } | null;
      return { res, data };
    };

    let { res, data } = await sendOnce({ text: textHtml, parse_mode: "HTML" });

    const desc = data?.description ?? "";
    const parseEntityFail =
      !res.ok &&
      (desc.includes("parse") || desc.includes("entity") || data?.error_code === 400);

    if (!res.ok || data?.ok === false) {
      if (parseEntityFail) {
        const plain = textHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        const plainCut = plain.length > TELEGRAM_MAX ? `${plain.slice(0, TELEGRAM_MAX - 20)}…` : plain;
        ({ res, data } = await sendOnce({ text: plainCut }));
      }
    }

    if (!res.ok || data?.ok === false) {
      const desc = data?.description;
      console.error(
        "[TELEGRAM] sendMessage failed:",
        desc ?? res.status,
        data?.error_code != null ? `(code ${data.error_code})` : "",
        "| HTTP",
        res.status,
        "| Подсказка: для лички напишите боту /start; для группы — id вида -100… и бот в группе; токен в BotFather при отзыве меняется"
      );
      return { ok: false, reason: "telegram_rejected", telegramDescription: desc };
    }
    return { ok: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[TELEGRAM] Failed to send notification:", error);
    return {
      ok: false,
      reason: "network",
      telegramDescription: msg,
    };
  }
}

function escapeTelegramHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function formatLeadMessage(lead: {
  name: string;
  phone: string;
  email?: string | null;
  service?: string | null;
  message?: string | null;
  source?: string | null;
  pageUrl?: string | null;
}) {
  const lines = [
    `<b>Новая заявка</b>`,
    ``,
    `<b>Имя:</b> ${escapeTelegramHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeTelegramHtml(lead.phone)}`,
  ];

  if (lead.email) lines.push(`<b>Email:</b> ${escapeTelegramHtml(lead.email)}`);
  if (lead.service) lines.push(`<b>Тема:</b> ${escapeTelegramHtml(lead.service)}`);
  if (lead.message) lines.push(`<b>Комментарий:</b> ${escapeTelegramHtml(lead.message)}`);
  if (lead.source) lines.push(`<b>Источник:</b> ${escapeTelegramHtml(lead.source)}`);
  if (lead.pageUrl) lines.push(`<b>Страница:</b> ${escapeTelegramHtml(lead.pageUrl)}`);

  return lines.join("\n");
}
