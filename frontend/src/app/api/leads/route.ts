import { NextRequest, NextResponse } from "next/server";
import { leadFormSchema } from "@/lib/schemas";
import { v4 as uuidv4 } from "uuid";
import {
  sendTelegramNotification,
  formatLeadMessage,
  userFacingTelegramHint,
} from "@/lib/telegram";

export const dynamic = "force-dynamic";

const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
/** Лимит на IP: при частых тестах заявки «молчат» с 429 — не путать с Telegram */
const RATE_LIMIT_MAX = 12;
const RATE_LIMIT_WINDOW = 10 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(ip);

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте позже." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = leadFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Некорректные данные", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (parsed.data.honeypot) {
      return NextResponse.json({ success: true, redirectUrl: "/" });
    }

    const token = uuidv4();
    const source = body.source || "unknown";

    const telegramResult = await sendTelegramNotification(
      formatLeadMessage({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        service: parsed.data.service,
        message: parsed.data.message,
        source,
        pageUrl: body.pageUrl,
      })
    );

    if (!telegramResult.ok) {
      const { reason, telegramDescription } = telegramResult;
      const hint = userFacingTelegramHint(reason, telegramDescription);
      if (reason === "missing_env") {
        console.error(
          "[LEAD] Нет TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID в окружении процесса (standalone: проверьте путь в systemd EnvironmentFile и restart)"
        );
      } else {
        console.error(
          "[LEAD] Telegram не доставил заявку:",
          reason,
          telegramDescription ?? "",
          "— токен/chat_id, /start боту в личке, для группы id вида -100…"
        );
      }
      return NextResponse.json(
        {
          error:
            "Не удалось отправить заявку в мессенджер. Позвоните нам или напишите в Telegram — мы на связи.",
          code: reason,
          hint,
        },
        { status: 503 }
      );
    }

    console.log("[LEAD]", {
      name: parsed.data.name,
      phone: parsed.data.phone,
      source,
      timestamp: new Date().toISOString(),
    });

    const redirectUrl = `/spasibo?token=${token}&from=${encodeURIComponent(source)}`;
    return NextResponse.json({ success: true, redirectUrl });
  } catch (error) {
    console.error("[LEAD ERROR]", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
