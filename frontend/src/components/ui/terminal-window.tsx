"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TerminalWindowProps = HTMLAttributes<HTMLDivElement> & {
  titleBar?: string;
  children: ReactNode;
  innerClassName?: string;
  /** false — без прокрутки внутри окна (страница заявки на один экран) */
  scrollableContent?: boolean;
};

/**
 * macOS-style terminal chrome (traffic lights + title). Content area scrolls horizontally on overflow.
 */
export const TerminalWindow = forwardRef<HTMLDivElement, TerminalWindowProps>(
  function TerminalWindow(
    { titleBar = "code1618 — zsh — 80×24", className, innerClassName, scrollableContent = true, children, ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          "terminal-chrome-bg rounded-xl border font-matrix text-[11px] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] sm:text-xs md:text-sm",
          className
        )}
        style={{ borderColor: "var(--border)" }}
        {...props}
      >
        <div
          className="flex items-center gap-2 border-b px-3 py-2 sm:px-4"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
          </span>
          <span
            style={{ color: "var(--text-subtle)" }}
            className="text-[9px] uppercase tracking-[0.2em] sm:text-[10px]"
          >
            {titleBar}
          </span>
        </div>

        <div
          className={cn(
            "min-h-0 p-3 sm:p-5 md:p-6",
            scrollableContent ? "overflow-x-auto" : "overflow-hidden",
            innerClassName
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);
