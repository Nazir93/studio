import type { ReactNode } from "react";

/**
 * Заголовки карточек лент: посимвольная анимация, но перенос строки только по пробелам,
 * не посередине слова (раньше inline-block на каждую букву давал перенос посередине слова).
 */
export function TapeTitleLineSegments({
  lines,
  titleKey,
  renderChar,
}: {
  lines: string[];
  titleKey: string;
  renderChar: (ctx: {
    ch: string;
    globalIdx: number;
    lineIdx: number;
    charInSegment: number;
  }) => ReactNode;
}): ReactNode {
  let globalIdx = 0;
  return lines.map((line, lineIdx) => (
    <span key={`${titleKey}-L${lineIdx}`} className="block w-full">
      {line.split(/(\s+)/).map((segment, segIdx) => {
        if (!segment) return null;
        if (/^\s+$/.test(segment)) {
          return (
            <span key={`${titleKey}-sp-${lineIdx}-${segIdx}`} className="inline">
              {segment.split("").map((ch, i) => {
                const idx = globalIdx++;
                return renderChar({
                  ch: ch === " " ? "\u00a0" : ch,
                  globalIdx: idx,
                  lineIdx,
                  charInSegment: i,
                });
              })}
            </span>
          );
        }
        return (
          <span key={`${titleKey}-w-${lineIdx}-${segIdx}`} className="inline-block whitespace-nowrap">
            {segment.split("").map((ch, i) => {
              const idx = globalIdx++;
              return renderChar({ ch, globalIdx: idx, lineIdx, charInSegment: i });
            })}
          </span>
        );
      })}
    </span>
  ));
}
