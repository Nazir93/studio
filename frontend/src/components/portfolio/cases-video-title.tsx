/**
 * Заголовок страницы кейсов — та же типографика и ритм, что «БЛОГ» на /blog
 * (font-heading, vw-размеры, leading, подпись снизу).
 */
export function CasesVideoTitle() {
  return (
    <>
      <h1
        className="font-heading text-[16vw] md:text-[11vw] lg:text-[9.5vw] leading-[0.88] tracking-tighter mb-6"
        style={{ color: "var(--text)" }}
      >
        КЕЙСЫ
      </h1>
      <p
        className="font-body text-base md:text-lg mb-14 md:mb-20 max-w-xl"
        style={{ color: "var(--text-muted)" }}
      >
        Реализованные проекты: разработка, UX/UI, мобильные и корпоративные продукты
      </p>
    </>
  );
}
