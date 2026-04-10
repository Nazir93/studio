"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, ArrowRight, Send, MessageCircle } from "lucide-react";
import {
  PHONE,
  PHONE_RAW,
  SOCIAL_LINKS,
  SITE_NAME,
} from "@/lib/constants";
import { isWorkingHours } from "@/lib/utils";
import Link from "next/link";

const panelClass =
  "rounded-2xl border p-6 mb-8";
const panelStyle: CSSProperties = {
  borderColor: "var(--border)",
  backgroundColor: "color-mix(in srgb, var(--text) 5%, var(--bg))",
};

const socialBtnClass =
  "flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-colors";
const socialBtnStyle: CSSProperties = {
  borderColor: "var(--border)",
  backgroundColor: "color-mix(in srgb, var(--text) 6%, transparent)",
  color: "var(--text-muted)",
};

export function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [countdown, setCountdown] = useState(15);
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace("/");
      return;
    }
    setValid(true);
  }, [token, router]);

  useEffect(() => {
    if (!valid) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [valid, router]);

  if (valid === null) return null;

  if (!valid) {
    router.replace("/");
    return null;
  }

  const workingHours = isWorkingHours();

  return (
    <section
      className="theme-bg flex min-h-screen items-center justify-center px-4 pb-12 pt-24 transition-colors duration-500 md:pt-20"
      style={{ color: "var(--text)" }}
    >
      <div className="w-full max-w-lg text-center">
        <div
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: "color-mix(in srgb, var(--accent) 14%, transparent)" }}
        >
          <CheckCircle size={40} style={{ color: "var(--accent)" }} aria-hidden />
        </div>

        <h1 className="mb-4 font-heading text-2xl font-bold md:text-3xl" style={{ color: "var(--text)" }}>
          Спасибо за заявку!
        </h1>

        <p className="mb-8 text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Мы получили ваш запрос. Инженер {SITE_NAME} свяжется с вами{" "}
          {workingHours
            ? "в течение 30 минут"
            : "в начале следующего рабочего дня"}
          .
        </p>

        <div className={panelClass} style={panelStyle}>
          <p className="mb-3 text-sm" style={{ color: "var(--text-subtle)" }}>
            Если вопрос срочный — позвоните:
          </p>
          <a
            href={`tel:${PHONE_RAW}`}
            className="flex items-center justify-center gap-3 text-xl font-bold transition-opacity hover:opacity-85"
            style={{ color: "var(--accent)" }}
          >
            <Phone size={22} aria-hidden />
            {PHONE}
          </a>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className={socialBtnClass}
            style={socialBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#16a34a";
              e.currentTarget.style.borderColor = "#16a34a";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = socialBtnStyle.backgroundColor as string;
              e.currentTarget.style.borderColor = socialBtnStyle.borderColor as string;
              e.currentTarget.style.color = socialBtnStyle.color as string;
            }}
          >
            <MessageCircle size={18} aria-hidden />
            Написать в WhatsApp
          </a>
          <a
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className={socialBtnClass}
            style={socialBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
              e.currentTarget.style.borderColor = "#2563eb";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = socialBtnStyle.backgroundColor as string;
              e.currentTarget.style.borderColor = socialBtnStyle.borderColor as string;
              e.currentTarget.style.color = socialBtnStyle.color as string;
            }}
          >
            <Send size={18} aria-hidden />
            Написать в Telegram
          </a>
        </div>

        <div className="mb-8">
          <p className="mb-3 text-sm" style={{ color: "var(--text-subtle)" }}>
            Пока ждёте — посмотрите наши проекты:
          </p>
          <Link href="/#portfolio">
            <Button variant="outline" size="sm">
              Перейти в портфолио
              <ArrowRight size={16} className="ml-2" aria-hidden />
            </Button>
          </Link>
        </div>

        <div className="rounded-xl border p-4" style={panelStyle}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Вы вернётесь на главную через{" "}
            <span className="font-bold" style={{ color: "var(--accent)" }}>
              {countdown}
            </span>{" "}
            {countdown === 1
              ? "секунду"
              : countdown < 5
                ? "секунды"
                : "секунд"}
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-1 text-sm underline-offset-2 hover:underline"
            style={{ color: "var(--accent)" }}
          >
            Вернуться сейчас
          </button>
        </div>
      </div>
    </section>
  );
}
