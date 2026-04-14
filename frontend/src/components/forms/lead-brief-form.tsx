"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { leadFormSchema } from "@/lib/schemas";
import { PHONE, PHONE_RAW } from "@/lib/constants";

const contactFormSchema = leadFormSchema
  .extend({
    privacy: z.boolean().optional(),
  })
  .refine((d) => d.privacy === true, {
    message: "Необходимо согласие на обработку данных",
    path: ["privacy"],
  });

export type LeadBriefFormValues = z.infer<typeof contactFormSchema>;

const SERVICE_OPTIONS: { value: string }[] = [
  { value: "Сайт, лендинг, корпоративный портал" },
  { value: "Электромонтаж, СКС, умный дом, акустика, видеонаблюдение" },
  { value: "UX/UI, дизайн интерфейсов" },
  { value: "Автоматизация, ИИ, интеграции" },
  { value: "Выделенная команда / аутстафф" },
  { value: "Консультация — помогите определиться с задачей" },
  { value: "Другое" },
];

export function serviceDefaultForHint(hint: string | null): string {
  if (hint === "development") return SERVICE_OPTIONS[0].value;
  if (hint === "outstaff") return "Выделенная команда / аутстафф";
  return "";
}

export function buildLeadSource(hint: string | null, pathname: string): string {
  if (hint === "development") return "brief-development";
  if (hint === "outstaff") return "brief-outstaff";
  if (hint) return `brief-${hint}`;
  if (pathname && pathname !== "/") return `brief${pathname.replace(/\//g, "-")}`;
  return "brief";
}

type LeadBriefFormProps = {
  /** Из модалки или ?source= на странице */
  sourceHint?: string | null;
  /** После успешной отправки (модалка закрывается) */
  onSuccess?: () => void;
  /** Страница: чуть просторнее поля */
  variant?: "modal" | "page";
};

export function LeadBriefForm({ sourceHint = null, onSuccess, variant = "modal" }: LeadBriefFormProps) {
  const pathname = usePathname() || "/";

  const [done, setDone] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadBriefFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service: "",
      message: "",
      privacy: false,
      honeypot: "",
    },
  });

  useEffect(() => {
    reset({
      name: "",
      phone: "",
      email: "",
      service: serviceDefaultForHint(sourceHint),
      message: "",
      privacy: false,
      honeypot: "",
    });
  }, [sourceHint, reset]);

  const sourceLabel = useMemo(() => buildLeadSource(sourceHint, pathname), [sourceHint, pathname]);

  const onSubmit = async (data: LeadBriefFormValues) => {
    if (data.honeypot) return;
    try {
      const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          service: data.service,
          message: data.message,
          source: sourceLabel,
          pageUrl: typeof window !== "undefined" ? window.location.href : null,
          utmSource: params.get("utm_source"),
          utmMedium: params.get("utm_medium"),
          utmCampaign: params.get("utm_campaign"),
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
          return;
        }
        if (variant === "page") setDone(true);
        onSuccess?.();
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.error || "Не удалось отправить. Позвоните: " + PHONE);
      }
    } catch {
      alert("Ошибка сети. Позвоните: " + PHONE);
    }
  };

  const pageTight = variant === "page";
  /** На странице заявки: ≥16px на узких экранах — без принудительного зума iOS при фокусе */
  const inputClass = pageTight
    ? "w-full border px-3 py-2.5 text-[16px] leading-snug outline-none transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)] sm:px-2.5 sm:py-1.5 sm:text-[12px] md:text-[13px]"
    : "w-full border px-4 py-3.5 text-sm outline-none transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] sm:text-[15px]";
  const inputStyle = { borderColor: "var(--border)", backgroundColor: "var(--bg)", color: "var(--text)" };
  const gapClass = pageTight ? "gap-1.5 sm:gap-2" : "gap-4 sm:gap-5";
  const labelMb = pageTight ? "mb-0" : "mb-1.5";

  if (done && variant === "page") {
    return (
      <div
        className="flex min-h-0 flex-1 flex-col justify-center rounded-lg border px-4 py-6 text-center sm:px-6 sm:py-8"
        style={{ borderColor: "var(--border)", backgroundColor: "color-mix(in srgb, var(--text) 3%, transparent)" }}
      >
        <CheckCircle2 className="mx-auto h-10 w-10 sm:h-12 sm:w-12" style={{ color: "var(--accent)" }} aria-hidden />
        <p className="mt-3 font-heading text-base tracking-tight sm:text-lg" style={{ color: "var(--text)" }}>
          Заявка отправлена
        </p>
        <p className="mt-1.5 max-w-md mx-auto font-body text-xs leading-relaxed sm:text-sm" style={{ color: "var(--text-muted)" }}>
          Свяжемся по указанным контактам. Срочно — звоните или Telegram.
        </p>
        <div className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center border px-6 py-3 font-matrix text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-90 sm:text-xs"
            style={{ borderColor: "var(--accent)", color: "var(--text)" }}
          >
            На главную
          </Link>
          <Link
            href="/contacts"
            className="font-matrix text-[10px] uppercase tracking-[0.18em] underline underline-offset-2 sm:text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Контакты
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`relative flex min-h-0 flex-1 flex-col ${gapClass} overflow-hidden`}>
      <div className="min-h-0 shrink-0">
        <label
          className={`${labelMb} block font-matrix uppercase tracking-[0.16em] sm:tracking-[0.18em] ${pageTight ? "text-[9px] sm:text-[10px]" : "text-[10px]"}`}
          style={{ color: "var(--text-subtle)" }}
        >
          Тема обращения <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <select className={`${inputClass} cursor-pointer appearance-none`} style={inputStyle} {...register("service")}>
          <option value="" style={{ backgroundColor: "var(--bg)", color: "var(--text-muted)" }}>
            Выберите вариант
          </option>
          {SERVICE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
              {o.value}
            </option>
          ))}
        </select>
        {errors.service && <p className="mt-1 text-xs text-red-400">{errors.service.message}</p>}
      </div>

      <div className={`grid min-h-0 shrink-0 grid-cols-1 sm:grid-cols-2 ${pageTight ? "gap-2" : "gap-4 sm:gap-4"}`}>
        <div>
          <label
            className={`${labelMb} block font-matrix uppercase tracking-[0.16em] sm:tracking-[0.18em] ${pageTight ? "text-[9px] sm:text-[10px]" : "text-[10px]"}`}
            style={{ color: "var(--text-subtle)" }}
          >
            Имя <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            type="text"
            autoComplete="name"
            className={inputClass}
            style={inputStyle}
            placeholder="Как к вам обращаться"
            {...register("name")}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label
            className={`${labelMb} block font-matrix uppercase tracking-[0.16em] sm:tracking-[0.18em] ${pageTight ? "text-[9px] sm:text-[10px]" : "text-[10px]"}`}
            style={{ color: "var(--text-subtle)" }}
          >
            Телефон <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={inputClass}
            style={inputStyle}
            placeholder="+7 …"
            {...register("phone")}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="min-h-0 shrink-0">
        <label
          className={`${labelMb} block font-matrix uppercase tracking-[0.16em] sm:tracking-[0.18em] ${pageTight ? "text-[9px] sm:text-[10px]" : "text-[10px]"}`}
          style={{ color: "var(--text-subtle)" }}
        >
          Email <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <input
          type="email"
          autoComplete="email"
          className={inputClass}
          style={inputStyle}
          placeholder="name@company.ru"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <label
          className={`${labelMb} block shrink-0 font-matrix uppercase tracking-[0.16em] sm:tracking-[0.18em] ${pageTight ? "text-[9px] sm:text-[10px]" : "text-[10px]"}`}
          style={{ color: "var(--text-subtle)" }}
        >
          Комментарий <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <textarea
          rows={pageTight ? 2 : 4}
          className={`${inputClass} min-h-0 flex-1 ${pageTight ? "max-h-[4.25rem] resize-none sm:max-h-[5rem] md:max-h-[5.5rem]" : "resize-y min-h-[100px]"}`}
          style={inputStyle}
          placeholder="Сроки, бюджет, ссылка на ТЗ…"
          {...register("message")}
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
      </div>

      <Controller
        name="privacy"
        control={control}
        render={({ field }) => (
          <label
            className={`flex shrink-0 cursor-pointer items-start gap-2 leading-tight sm:gap-3 ${pageTight ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"}`}
            style={{ color: "var(--text-muted)" }}
          >
            <input
              type="checkbox"
              className={`mt-0.5 shrink-0 accent-[var(--accent)] ${pageTight ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-4 w-4"}`}
              checked={field.value === true}
              onBlur={field.onBlur}
              ref={field.ref}
              onChange={(e) => field.onChange(e.target.checked)}
            />
            <span>
              Согласен с{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:opacity-80" target="_blank" rel="noopener noreferrer">
                политикой конфиденциальности
              </a>
            </span>
          </label>
        )}
      />
      {errors.privacy && <p className="text-xs text-red-400">{errors.privacy.message}</p>}

      <div className="pointer-events-none absolute h-0 overflow-hidden opacity-0" aria-hidden>
        <input tabIndex={-1} autoComplete="off" {...register("honeypot")} />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`mt-0.5 flex w-full shrink-0 items-center justify-center gap-2 border font-matrix uppercase tracking-[0.2em] transition-opacity disabled:opacity-50 ${pageTight ? "py-1.5 text-[9px] sm:py-2 sm:text-[10px] md:text-xs" : "py-4 text-xs sm:py-4 sm:text-sm"}`}
        style={{ borderColor: "var(--accent)", color: "var(--text)" }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Отправка…
          </>
        ) : (
          "Отправить заявку"
        )}
      </button>

      <p
        className={`shrink-0 text-center font-body leading-relaxed ${pageTight ? "text-[9px] sm:text-[10px]" : "text-[11px]"}`}
        style={{ color: "var(--text-subtle)" }}
      >
        Или:{" "}
        <a href={`tel:${PHONE_RAW}`} className="underline underline-offset-2" style={{ color: "var(--text-muted)" }}>
          {PHONE}
        </a>
      </p>
    </form>
  );
}

