"use client";

import { useEffect, useRef } from "react";

/** Разноцветный дым на фоне — progress 0…1 двигает облака вместе со скроллом */
export function PortfolioSmokeBackground({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const rafRef = useRef(0);
  const timeRef = useRef(0);

  progressRef.current = progress;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      W = parent.clientWidth;
      H = parent.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const parent = canvas.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
    resize();

    const blobs = [
      { hx: 0.18, hy: 0.22, r: 0.55, hue: 265, sat: 72, drift: 1.1 },
      { hx: 0.78, hy: 0.35, r: 0.48, hue: 195, sat: 78, drift: 0.85 },
      { hx: 0.45, hy: 0.65, r: 0.62, hue: 320, sat: 65, drift: 1.0 },
      { hx: 0.12, hy: 0.72, r: 0.42, hue: 155, sat: 70, drift: 1.15 },
      { hx: 0.88, hy: 0.78, r: 0.5, hue: 28, sat: 85, drift: 0.9 },
      { hx: 0.52, hy: 0.12, r: 0.38, hue: 210, sat: 68, drift: 1.05 },
    ];

    const draw = (t: number) => {
      if (W < 8 || H < 8) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      timeRef.current = t * 0.001;
      const p = progressRef.current;
      const scrollY = p * H * 1.15;
      const wobble = timeRef.current;

      ctx.clearRect(0, 0, W, H);

      for (const b of blobs) {
        const ox = Math.sin(wobble * b.drift + b.hx * 6) * (W * 0.04);
        const oy = Math.cos(wobble * b.drift * 0.9 + b.hy * 5) * (H * 0.035);
        const cx = b.hx * W + ox;
        const cy = b.hy * H + oy + scrollY * b.drift * 0.35;
        const rad = Math.max(W, H) * b.r;

        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        const a = 0.14 + p * 0.06;
        g.addColorStop(0, `hsla(${b.hue}, ${b.sat}%, 58%, ${a})`);
        g.addColorStop(0.45, `hsla(${b.hue + 25}, ${b.sat - 10}%, 52%, ${a * 0.45})`);
        g.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.35;
      for (let i = 0; i < 3; i++) {
        const phase = wobble * (0.5 + i * 0.2) + i * 2;
        const cx = W * (0.3 + i * 0.22) + Math.sin(phase) * W * 0.08;
        const cy = H * (0.4 + (i % 2) * 0.25) + scrollY * 0.5 + Math.cos(phase * 0.8) * H * 0.06;
        const rad = Math.min(W, H) * (0.35 + i * 0.05);
        const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g2.addColorStop(0, `hsla(${120 + i * 60}, 80%, 65%, 0.12)`);
        g2.addColorStop(1, "hsla(0,0%,0%,0)");
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      style={{ filter: "blur(48px) saturate(1.25)" }}
      aria-hidden
    />
  );
}
