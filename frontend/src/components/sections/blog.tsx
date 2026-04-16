"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function FillLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-between mt-6 sm:mt-8 px-5 sm:px-8 py-5 sm:py-6 md:py-7 rounded-2xl font-body text-lg sm:text-xl md:text-2xl font-semibold relative overflow-hidden transition-all duration-500"
      style={{ border: "1px solid var(--border)" }}
    >
      <div
        className="absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] rounded-2xl"
        style={{
          backgroundColor: "var(--text)",
          transform: hovered ? "scaleX(1)" : "scaleX(0)",
        }}
      />
      <span
        className="relative z-10 transition-colors duration-700"
        style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
      >
        {label}
      </span>
      <ArrowRight
        size={22}
        className="relative z-10 transition-colors duration-700"
        style={{ color: hovered ? "var(--bg)" : "var(--text)" }}
      />
    </Link>
  );
}

const BLOG_POSTS = [
  {
    id: "1",
    title: "КАК ВЫБРАТЬ ПОДРЯДЧИКА НА РАЗРАБОТКУ САЙТА",
    excerpt:
      "Портфолио, договор, прозрачность сметы и демо по спринтам — чек-лист для заказчика, который впервые заказывает веб-разработку.",
  },
  {
    id: "2",
    title: "MONDAY.COM: С ЧЕГО НАЧАТЬ КОМАНДЕ",
    excerpt:
      "Рабочие пространства, статусы и автоматизации без хаоса. Как перестать терять задачи в чатах.",
  },
  {
    id: "3",
    title: "AI-АССИСТЕНТ ДЛЯ ПОДДЕРЖКИ: ГРАНИЦЫ И БЕЗОПАСНОСТЬ",
    excerpt:
      "Где нейросеть экономит время, а где без человека нельзя. Политики данных и контроль ответов клиентам.",
  },
  {
    id: "4",
    title: "DISCOVERY ПЕРЕД РАЗРАБОТКОЙ: ЗАЧЕМ ПЛАТИТЬ ЗА РАЗГОВОРЫ",
    excerpt:
      "Нулевой спринт снижает риск сорванных сроков. Что на выходе: ТЗ, прототип, оценка бюджета.",
  },
  {
    id: "5",
    title: "ЛЕНДИНГ VS МНОГОСТРАНИЧНИК ДЛЯ БИЗНЕСА",
    excerpt:
      "Когда хватает одной страницы с формой, а когда нужны разделы, блог и личный кабинет.",
  },
  {
    id: "6",
    title: "ТЕСТИРОВАНИЕ ПЕРЕД РЕЛИЗОМ: МИНИМАЛЬНЫЙ ЧЕК-ЛИСТ",
    excerpt:
      "Регресс, мобильная вёрстка, формы и кросс-браузер — без чего не стоит открывать продакшен.",
  },
];

function BlogCard({
  post,
  index,
}: {
  post: (typeof BLOG_POSTS)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="group cursor-pointer transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(50px)",
        transitionDelay: `${(index % 3) * 100}ms`,
      }}
    >
      <div
        className="relative overflow-hidden flex flex-col justify-between h-[260px] sm:h-[300px] md:h-[340px] p-4 sm:p-6 md:p-8 transition-transform duration-500 group-hover:scale-[0.98]"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
        }}
      >
        {/* Arrow */}
        <div className="flex justify-end relative z-10">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            style={{ border: "1px solid var(--border)" }}
          >
            <ArrowRight size={18} style={{ color: "var(--text)" }} />
          </div>
        </div>

        {/* Text */}
        <div className="relative z-10">
          <h3
            className="font-body text-lg md:text-xl font-semibold leading-[1.1] mb-3 transition-colors duration-200 group-hover:text-[var(--accent)]"
            style={{ color: "var(--text)" }}
          >
            {post.title}
          </h3>
          <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "var(--text-muted)" }}>
            {post.excerpt}
          </p>
        </div>
      </div>
    </div>
  );
}

export function BlogSection() {
  return (
    <section
      id="blog"
      className="py-16 sm:py-20 md:py-28"
      style={{ backgroundColor: "var(--bg)", borderTop: "1px solid var(--border)" }}
    >
      <div className="container mx-auto">
        {/* Title */}
        <h2
          className="font-body section-display-title font-semibold leading-[0.95] tracking-tight mb-10 sm:mb-14 md:mb-20 uppercase"
          style={{ color: "var(--text)" }}
        >
          БЛОГ
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {BLOG_POSTS.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>

        {/* View all */}
        <FillLink href="/blog" label="Смотреть все статьи" />
      </div>
    </section>
  );
}
