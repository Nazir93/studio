import { z } from "zod";

export const leadFormSchema = z.object({
  name: z
    .string()
    .min(2, "Введите имя")
    .max(100, "Имя слишком длинное"),
  phone: z
    .string()
    .min(10, "Введите корректный номер телефона")
    .max(20, "Номер слишком длинный")
    .regex(/^[\d\s\+\-\(\)]+$/, "Некорректный формат телефона"),
  email: z.string().email("Введите корректный email"),
  service: z.string().min(1, "Выберите тему обращения"),
  message: z
    .string()
    .min(10, "Опишите задачу чуть подробнее (от 10 символов)")
    .max(2000, "Слишком длинный текст"),
  honeypot: z.string().max(0, "Bot detected").optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

export const callbackFormSchema = z.object({
  name: z.string().min(2, "Введите имя").max(100),
  phone: z
    .string()
    .min(10, "Введите корректный номер")
    .max(20)
    .regex(/^[\d\s\+\-\(\)]+$/, "Некорректный формат"),
  preferredTime: z.enum(["now", "30min", "evening", "tomorrow"]).optional(),
  honeypot: z.string().max(0).optional(),
});

export type CallbackFormData = z.infer<typeof callbackFormSchema>;
