"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { PortfolioCase } from "@/lib/portfolio-data";
import { TerminalWindow } from "@/components/ui/terminal-window";

const INTRO_KEY = "portfolio-terminal-intro-v1";

const FILTERS: { label: string; match: (p: PortfolioCase) => boolean }[] = [
  { label: "Все", match: () => true },
  {
    label: "Электромонтаж",
    match: (p) =>
      /электро|электр/i.test(p.type + p.industry + p.title),
  },
  {
    label: "Умный дом",
    match: (p) => /умн|smart|дом/i.test(p.type + p.industry + p.title + p.shortDescription),
  },
  {
    label: "Акустика",
    match: (p) => /акуст/i.test(p.type + p.industry + p.title),
  },
  {
    label: "Видеонаблюдение",
    match: (p) => /видео|наблюд|cctv|камер/i.test(p.type + p.industry + p.title),
  },
  {
    label: "СКС",
    match: (p) => /скс|слаботоч|сеть|lan/i.test(p.type + p.industry + p.title),
  },
];

function padSlug(s: string, len: number) {
  return s.length >= len ? s.slice(0, len) : s + " ".repeat(len - s.length);
}

export function PortfolioTerminal({ projects }: { projects: PortfolioCase[] }) {
  const [typedLine, setTypedLine] = useState("");
  const [introDone, setIntroDone] = useState(false);
  const [activeFilterIdx, setActiveFilterIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => projects.filter(FILTERS[activeFilterIdx].match),
    [projects, activeFilterIdx]
  );

  useEffect(() => {
    setSelectedIdx(0);
  }, [activeFilterIdx, filtered.length]);

  useEffect(() => {
    const cmd = "ls -la ~/projects";
    if (sessionStorage.getItem(INTRO_KEY) === "1") {
      setTypedLine(cmd);
      setIntroDone(true);
      return;
    }

    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTypedLine(cmd.slice(0, i));
      if (i >= cmd.length) {
        clearInterval(id);
        setIntroDone(true);
        sessionStorage.setItem(INTRO_KEY, "1");
      }
    }, 42);
    return () => clearInterval(id);
  }, []);

  const openSelected = useCallback(() => {
    const p = filtered[selectedIdx];
    if (p) window.location.href = `/portfolio/${p.slug}`;
  }, [filtered, selectedIdx]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement !== wrapRef.current) return;
      if (!introDone || filtered.length === 0) return;
      const t = e.target as HTMLElement;
      if (t.closest("a") && e.key === "Enter") return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        openSelected();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [introDone, filtered.length, openSelected]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-row-index="${selectedIdx}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIdx]);

  const accent = "var(--accent)";
  const muted = "var(--text-muted)";
  const subtle = "var(--text-subtle)";

  return (
    <TerminalWindow
      ref={wrapRef}
      tabIndex={0}
      role="region"
      aria-label="Портфолио в виде терминала. Стрелки вверх и вниз — выбор строки, Enter — открыть кейс."
      innerClassName="p-0 sm:p-0 md:p-0"
    >
      <div className="p-3 sm:p-5 md:p-6">
        <p style={{ color: muted }} className="mb-1">
          <span style={{ color: accent }}>code1618</span>
          <span style={{ color: subtle }}>@</span>
          <span style={{ color: accent }}>studio</span>
          <span style={{ color: muted }}>:~/portfolio$ </span>
          <span style={{ color: "var(--text)" }}>{typedLine}</span>
          {!introDone && <span className="animate-pulse" style={{ color: accent }}>▌</span>}
        </p>

        {introDone && (
          <>
            <p style={{ color: subtle }} className="mb-3 mt-4">
              total {filtered.length}
            </p>

            <div className="mb-4 flex flex-wrap gap-2" role="toolbar" aria-label="Фильтр по типу работ">
              <span style={{ color: subtle }} className="w-full text-[10px] uppercase tracking-[0.15em] sm:w-auto sm:mr-2">
                # filter:
              </span>
              {FILTERS.map((f, i) => (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setActiveFilterIdx(i)}
                  className="rounded border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] transition-colors sm:text-[11px]"
                  style={{
                    borderColor: activeFilterIdx === i ? accent : "var(--border)",
                    color: activeFilterIdx === i ? "var(--bg)" : muted,
                    backgroundColor: activeFilterIdx === i ? accent : "transparent",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div
              ref={listRef}
              className="font-mono text-[10px] sm:text-[11px] md:text-xs"
              style={{ color: "var(--text)" }}
              aria-live="polite"
            >
              <div style={{ color: subtle }} className="mb-2 hidden sm:block">
                drwxr-xr-x&nbsp;&nbsp;7 code1618&nbsp;&nbsp;staff&nbsp;&nbsp;224&nbsp;&nbsp;.
                <br />
                drwxr-xr-x&nbsp;&nbsp;7 code1618&nbsp;&nbsp;staff&nbsp;&nbsp;224&nbsp;&nbsp;..
              </div>

              {filtered.map((p, i) => {
                const isSel = i === selectedIdx;
                return (
                  <Link
                    key={p.id}
                    href={`/portfolio/${p.slug}`}
                    data-row-index={i}
                    className="block border-l-2 py-1.5 pl-2 pr-1 transition-colors sm:py-2 sm:pl-3"
                    style={{
                      borderLeftColor: isSel ? accent : "transparent",
                      backgroundColor: isSel ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "transparent",
                    }}
                  >
                    <span style={{ color: isSel ? accent : subtle }} className="inline-block w-5 sm:w-6">
                      {isSel ? "▶" : " "}
                    </span>
                    <span style={{ color: muted }}>-rw-r--r--</span>
                    <span style={{ color: subtle }}>&nbsp;&nbsp;1 code1618&nbsp;&nbsp;staff&nbsp;&nbsp;</span>
                    <span style={{ color: accent }}>{p.year.padStart(4, " ")}</span>
                    <span style={{ color: subtle }}>&nbsp;&nbsp;</span>
                    <span style={{ color: "var(--text)" }} className="break-all">
                      {padSlug(`${p.slug}/`, 22)}
                    </span>
                    <span style={{ color: subtle }}>&nbsp;→&nbsp;</span>
                    <span style={{ color: "var(--text)" }}>{p.title}</span>
                    <span style={{ color: subtle }} className="hidden md:inline">
                      &nbsp;&nbsp;·&nbsp;&nbsp;{p.tag}
                    </span>
                  </Link>
                );
              })}

              {filtered.length === 0 && (
                <p style={{ color: muted }} className="py-4">
                  (no matches — попробуйте другой фильтр)
                </p>
              )}
            </div>

            <p style={{ color: subtle }} className="mt-6 text-[10px] uppercase tracking-[0.18em]">
              ↑↓ выбор · Enter открыть · Tab навигация по ссылкам
            </p>
          </>
        )}
      </div>
    </TerminalWindow>
  );
}
