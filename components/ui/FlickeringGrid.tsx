"use client";
// Animated background of softly flickering squares (canvas).
// Pauses when off-screen and stays still for prefers-reduced-motion.

import { useEffect, useRef } from "react";

export function FlickeringGrid({
  colors = ["#6EE7B7", "#34D399", "#10B981", "#059669"],
  square = 4,
  gap = 8,
  maxOpacity = 0.35,
  density = 0.12, // share of squares that are lit
  className = "",
}: {
  colors?: string[];
  square?: number;
  gap?: number;
  maxOpacity?: number;
  density?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const colorsKey = colors.join(","); // stable dependency even if a new array is passed each render

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const palette = colorsKey.split(",");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0;
    let rows = 0;
    let cells: { o: number; c: number; lit: boolean }[] = [];
    let raf = 0;
    let visible = true;
    let last = 0;

    function resize() {
      const { width, height } = canvas!.getBoundingClientRect();
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      cols = Math.ceil(width / (square + gap));
      rows = Math.ceil(height / (square + gap));
      cells = Array.from({ length: cols * rows }, () => ({
        o: Math.random() * maxOpacity,
        c: Math.floor(Math.random() * palette.length),
        lit: Math.random() < density,
      }));
      draw();
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const step = (square + gap) * dpr;
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (!cell.lit) continue;
        ctx!.globalAlpha = cell.o;
        ctx!.fillStyle = palette[cell.c];
        ctx!.fillRect((i % cols) * step, Math.floor(i / cols) * step, square * dpr, square * dpr);
      }
      ctx!.globalAlpha = 1;
    }

    function tick(t: number) {
      raf = requestAnimationFrame(tick);
      if (!visible || t - last < 90) return; // ~11 fps is plenty for a flicker
      last = t;
      for (let i = 0; i < cells.length; i++) {
        if (Math.random() < 0.04) {
          cells[i].o = Math.random() * maxOpacity;
          if (Math.random() < 0.15) cells[i].lit = Math.random() < density;
        }
      }
      draw();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    if (!reduce) raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [colorsKey, square, gap, maxOpacity, density]);

  return <canvas ref={ref} className={`pointer-events-none h-full w-full ${className}`} aria-hidden />;
}
