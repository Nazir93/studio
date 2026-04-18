"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
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
      const leadsUrl =
        typeof window !== "undefined" ? `${window.location.origin}/api/leads` : "/api/leads";
      const response = await fetch(leadsUrl, {
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
        const err = await response.json().catch(() => ({})) as {
          error?: string;
          hint?: string;
          code?: string;
        };
        const extra = err.hint ? `\n\n${err.hint}` : err.code ? `\n\n(код: ${err.code})` : "";
        alert((err.error || "Не удалось отправить. Позвоните: " + PHONE) + extra);
      }
    } catch {
      alert("Ошибка сети. Позвоните: " + PHONE);
    }
  };

  const pageTight = variant === "page";
  /** На странице: ≥16px на узких экранах — без зума iOS при фокусе */
  const controlPad = pageTight
    ? "px-3.5 py-3 text-[16px] leading-snug sm:px-3 sm:py-2.5 sm:text-[13px] md:text-[14px]"
    : "px-4 py-3.5 text-[15px] sm:text-sm";
  const controlSurface = cn(
    "w-full rounded-xl border outline-none transition-[border-color,box-shadow,background-color] duration-200",
    "border-[color-mix(in_srgb,var(--border)_72%,transparent)]",
    "bg-[color-mix(in_srgb,var(--text)_4%,var(--bg))] text-[var(--text)]",
    "shadow-[inset_0_1px_0_color-mix(in_srgb,var(--text)_6%,transparent)]",
    "placeholder:text-[color-mix(in_srgb,var(--text-muted)_78%,transparent)]",
    "focus-visible:border-[color-mix(in_srgb,var(--accent)_50%,var(--border))]",
    "focus-visible:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_20%,transparent),inset_0_1px_0_color-mix(in_srgb,var(--text)_8%,transparent)]",
    controlPad
  );
  const gapClass = pageTight ? "gap-3 sm:gap-3.5" : "gap-4 sm:gap-5";
  const labelMb = pageTight ? "mb-1" : "mb-1.5";

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "relative flex w-full min-w-0 flex-col",
        gapClass,
        pageTight ? "" : "min-h-0 flex-1"
      )}
    >
      <div className="min-h-0 shrink-0">
        <label
          className={`${labelMb} block font-matrix uppercase tracking-[0.16em] sm:tracking-[0.18em] ${pageTight ? "text-[9px] sm:text-[10px]" : "text-[10px]"}`}
          style={{ color: "var(--text-subtle)" }}
        >
          Тема обращения <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <div className="relative">
          <select
            className={cn(controlSurface, "cursor-pointer appearance-none pr-11")}
            {...register("service")}
          >
            <option value="" className="bg-[var(--bg)] text-[var(--text-muted)]">
              Выберите вариант
            </option>
            {SERVICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-[var(--bg)] text-[var(--text)]">
                {o.value}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 opacity-45"
            style={{ color: "var(--text-muted)" }}
            aria-hidden
          />
        </div>
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
            className={controlSurface}
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
            className={controlSurface}
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
          className={controlSurface}
          placeholder="name@company.ru"
          {...register("email")}
        />
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div className="flex min-h-0 w-full min-w-0 flex-col">
        <label
          className={`${labelMb} block shrink-0 font-matrix uppercase tracking-[0.16em] sm:tracking-[0.18em] ${pageTight ? "text-[9px] sm:text-[10px]" : "text-[10px]"}`}
          style={{ color: "var(--text-subtle)" }}
        >
          Комментарий <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <textarea
          rows={pageTight ? 5 : 4}
          className={cn(
            controlSurface,
            "leading-relaxed",
            pageTight
              ? "min-h-[8.5rem] resize-y sm:min-h-[7.5rem] md:min-h-[11rem]"
              : "min-h-[112px] flex-1 resize-y"
          )}
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
            className={cn(
              "flex shrink-0 cursor-pointer items-start gap-3 rounded-xl border border-transparent p-1 -m-1 transition-colors sm:gap-3.5",
              "hover:border-[color-mix(in_srgb,var(--border)_45%,transparent)]",
              pageTight ? "text-[10px] sm:text-xs" : "text-xs sm:text-sm"
            )}
            style={{ color: "var(--text-muted)" }}
          >
            <input
              type="checkbox"
              className="peer sr-only"
              checked={field.value === true}
              onBlur={field.onBlur}
              ref={field.ref}
              onChange={(e) => field.onChange(e.target.checked)}
            />
            <span
              className={cn(
                "mt-0.5 flex shrink-0 items-center justify-center rounded-md border transition-[border-color,background-color,box-shadow]",
                "border-[color-mix(in_srgb,var(--border)_75%,transparent)]",
                "bg-[color-mix(in_srgb,var(--text)_4%,var(--bg))]",
                "shadow-[inset_0_1px_0_color-mix(in_srgb,var(--text)_6%,transparent)]",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-[color-mix(in_srgb,var(--accent)_35%,transparent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--bg)]",
                "peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-checked:[&>svg]:opacity-100",
                pageTight ? "h-[18px] w-[18px] sm:h-5 sm:w-5" : "h-5 w-5"
              )}
              aria-hidden
            >
              <Check strokeWidth={3} className="h-2.5 w-2.5 text-[var(--bg)] opacity-0 transition-opacity" />
            </span>
            <span className="leading-snug">
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
        className={cn(
          "mt-1 flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border font-matrix uppercase tracking-[0.2em]",
          "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] transition-[opacity,box-shadow] hover:opacity-95 hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_40%,transparent)]",
          "disabled:opacity-50",
          pageTight ? "py-2.5 text-[9px] sm:py-3 sm:text-[10px] md:text-xs" : "py-3.5 text-xs sm:py-4 sm:text-sm"
        )}
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

