export type TelegramSendFailure =
  | "missing_env"
  | "telegram_rejected"
  | "network";

/** Успешная доставка в Telegram */
export async function sendTelegramNotification(
  message: string
): Promise<{ ok: true } | { ok: false; reason: TelegramSendFailure }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    console.warn(
      "[TELEGRAM] Задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID (для systemd: EnvironmentFile=…/.env.production, затем daemon-reload и restart сервиса)"
    );
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
      console.error(
        "[TELEGRAM] sendMessage failed:",
        data?.description ?? res.status,
        data?.error_code != null ? `(code ${data.error_code})` : ""
      );
      return { ok: false, reason: "telegram_rejected" };
    }
    return { ok: true };
  } catch (error) {
    console.error("[TELEGRAM] Failed to send notification:", error);
    return { ok: false, reason: "network" };
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
