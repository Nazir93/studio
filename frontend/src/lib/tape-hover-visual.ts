/** Общие визуальные функции для карточек ленты «Что умеем» и портфолио */

export const TAPE_CELL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function lightNeonTitleChar(hovered: boolean): string {
  return hovered
    ? "0 0 4px #fff, 0 0 10px rgba(255,255,255,0.95), 0 0 22px rgba(255,255,255,0.65), 0 0 36px rgba(255,255,255,0.4), 0 1px 0 rgba(255,255,255,0.9)"
    : "0 0 6px rgba(255,255,255,1), 0 0 14px rgba(255,255,255,0.55), 0 0 1px rgba(255,255,255,1)";
}

export function lightNeonFilter(hovered: boolean): string {
  return hovered
    ? "drop-shadow(0 0 10px rgba(255,255,255,0.95)) drop-shadow(0 0 22px rgba(255,255,255,0.55)) drop-shadow(0 2px 8px rgba(255,255,255,0.35))"
    : "drop-shadow(0 0 8px rgba(255,255,255,0.85)) drop-shadow(0 0 16px rgba(255,255,255,0.4))";
}

export function darkTitleCharShadow(hovered: boolean): string {
  return hovered
    ? "0 0 1.2em color-mix(in srgb, var(--text) 45%, transparent), 0 0 2em color-mix(in srgb, var(--text) 20%, transparent), 0 1px 0 color-mix(in srgb, var(--text) 35%, transparent)"
    : "none";
}

export function darkTitleFilter(hovered: boolean): string {
  return hovered
    ? "drop-shadow(0 3px 14px color-mix(in srgb, var(--text) 22%, transparent)) drop-shadow(0 0 28px color-mix(in srgb, var(--text) 18%, transparent))"
    : "none";
}
