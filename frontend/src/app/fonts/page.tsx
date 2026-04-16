import Link from "next/link";

const FONTS = [
  {
    name: "Black Ops One",
    class: "font-blackops",
    sample: "CODE1618 — Студия",
    desc: "Жирный дисплейный, кириллица",
  },
  {
    name: "AKONY",
    class: "font-akony",
    sample: "CODE1618 — Студия",
    desc: "Геометрический, современный — основной шрифт сайта (body / heading)",
  },
  {
    name: "Metal Lord",
    class: "font-metallord",
    sample: "CODE1618 — Студия",
    desc: "Метал, готика",
  },
  {
    name: "Red Molot",
    class: "font-redmolot",
    sample: "CODE1618 — Студия",
    desc: "Плакатный, советский стиль",
  },
  {
    name: "JetBrains Mono (matrix)",
    class: "font-matrix",
    sample: "CODE1618 — Студия",
    desc: "Моноширинный, терминал",
  },
];

export default function FontsPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-[#262626] py-16 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#8e8e8e] hover:text-[#262626] text-sm tracking-wider uppercase mb-12 transition-colors"
        >
          ← На главную
        </Link>

        <h1 className="font-blackops text-[clamp(1.75rem,4.5vw+0.75rem,3.75rem)] sm:text-5xl md:text-6xl text-[#262626] mb-2 text-balance">
          Шрифты проекта
        </h1>
        <p className="text-[#8e8e8e] text-sm sm:text-base mb-16">
          Витрина кастомных шрифтов CODE1618
        </p>

        <div className="space-y-16">
          {FONTS.map((font) => (
            <section
              key={font.class}
              className="border-b border-[#dbdbdb] pb-16 last:border-0"
            >
              <p className="text-[#8e8e8e] text-xs uppercase tracking-widest mb-2">
                {font.name}
              </p>
              <p className="text-[#8e8e8e] text-sm mb-6">{font.desc}</p>

              <div
                className={`${font.class} text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#262626] leading-tight`}
              >
                {font.sample}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-white border border-[#dbdbdb]">
                <p className="text-[#8e8e8e] text-xs uppercase mb-2">Как на баннере</p>
                <p className={`${font.class} text-xl sm:text-2xl text-[#262626]`}>
                  Студия разработки сайтов
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-6">
                <div>
                  <p className="text-[#8e8e8e] text-xs uppercase mb-1">Крупно</p>
                  <p className={`${font.class} text-2xl text-[#262626]`}>
                    Разработка · Дизайн · ИИ · Реклама
                  </p>
                </div>
                <div>
                  <p className="text-[#8e8e8e] text-xs uppercase mb-1">Мелко</p>
                  <p className={`${font.class} text-sm text-[#8e8e8e]`}>
                    Студия разработки будущего
                  </p>
                </div>
              </div>

              <p className="mt-4 font-matrix text-[10px] text-[#a8a8a8]">
                класс: {font.class}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-20 p-6 border border-dashed border-[#dbdbdb] rounded-lg bg-white">
          <p className="font-matrix text-xs text-[#8e8e8e] mb-2">Использование в коде</p>
          <pre className="font-matrix text-[11px] text-[#262626] overflow-x-auto">
{`<h1 className="font-blackops">Заголовок</h1>
<span className="font-redmolot">Плакат</span>
<p className="font-metallord">Метал</p>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
