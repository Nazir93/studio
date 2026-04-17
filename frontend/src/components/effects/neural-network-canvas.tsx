"use client";

import { useRef, useEffect, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  r: number;
  pulse: number;
  speed: number;
}
interface Edge {
  from: number;
  to: number;
  progress: number;
  speed: number;
  active: boolean;
}

/** Фон баннера: нейросеть с пульсацией и реакцией на курсор (как /services/ai-automation) */
export function NeuralNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  const initRef = useRef(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const c = canvasRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    parent.addEventListener("mousemove", handleMouseMove);

    const dpr = window.devicePixelRatio || 1;
    let W = 0;
    let H = 0;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!initRef.current) initNetwork();
    };

    const initNetwork = () => {
      initRef.current = true;
      const layers = [4, 6, 8, 6, 4];
      const nodes: Node[] = [];
      const edges: Edge[] = [];
      const layerGap = W / (layers.length + 1);

      layers.forEach((count, li) => {
        const x = layerGap * (li + 1);
        const nodeGap = H / (count + 1);
        for (let ni = 0; ni < count; ni++) {
          nodes.push({
            x: x + (Math.random() - 0.5) * 20,
            y: nodeGap * (ni + 1) + (Math.random() - 0.5) * 15,
            r: 2 + Math.random() * 2,
            pulse: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.02,
          });
        }
      });

      let offset = 0;
      for (let li = 0; li < layers.length - 1; li++) {
        const fromStart = offset;
        const fromEnd = offset + layers[li];
        const toStart = fromEnd;
        const toEnd = toStart + layers[li + 1];
        for (let fi = fromStart; fi < fromEnd; fi++) {
          for (let ti = toStart; ti < toEnd; ti++) {
            if (Math.random() > 0.45) {
              edges.push({
                from: fi,
                to: ti,
                progress: Math.random(),
                speed: 0.002 + Math.random() * 0.004,
                active: Math.random() > 0.6,
              });
            }
          }
        }
        offset += layers[li];
      }

      nodesRef.current = nodes;
      edgesRef.current = edges;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isDark = () => {
        const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
        return bg === "#0A0A0A" || bg === "#0a0a0a" || bg.includes("10,10,10");
      };
      const dark = isDark();
      const baseColor = dark ? "255,255,255" : "0,0,0";

      edges.forEach((e) => {
        const n1 = nodes[e.from];
        const n2 = nodes[e.to];
        if (!n1 || !n2) return;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = `rgba(${baseColor},0.06)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        if (e.active) {
          e.progress += e.speed;
          if (e.progress > 1) {
            e.progress = 0;
            e.active = Math.random() > 0.3;
          }
          const px = n1.x + (n2.x - n1.x) * e.progress;
          const py = n1.y + (n2.y - n1.y) * e.progress;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${baseColor},0.3)`;
          ctx.fill();
        } else {
          if (Math.random() > 0.998) e.active = true;
        }
      });

      nodes.forEach((n) => {
        n.pulse += n.speed;
        const pulseFactor = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(n.pulse));
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = dist < 150 ? 1 - dist / 150 : 0;
        const r = n.r * (1 + proximity * 0.8);
        const alpha = 0.15 + pulseFactor * 0.25 + proximity * 0.4;

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor},${alpha})`;
        ctx.fill();

        if (proximity > 0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 4 + proximity * 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${baseColor},${proximity * 0.06})`;
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener("mousemove", handleMouseMove);
      ro.disconnect();
    };
  }, [handleMouseMove]);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[2] h-full w-full" />;
}
