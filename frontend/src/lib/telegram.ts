/** Успешная доставка в Telegram (false — нет env, сеть или ответ ok: false) */
export async function sendTelegramNotification(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    console.warn("[TELEGRAM] Задайте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в окружении");
    return false;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      description?: string;
      error_code?: number;
    } | null;
    if (!res.ok || data?.ok === false) {
      console.error(
        "[TELEGRAM] sendMessage failed:",
        data?.description ?? res.status,
        data?.error_code != null ? `(code ${data.error_code})` : ""
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("[TELEGRAM] Failed to send notification:", error);
    return false;
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
