"use client";

import { useEffect, useRef } from "react";

type DNAHelixBackgroundProps = {
  className?: string;
  strandColorA?: string;   // teal
  strandColorB?: string;   // purple
  glow?: number;           // 0..1
  ampScale?: number;       // scales helix radius (default 0.22)
  offsetY?: number;        // vertical offset in px (+down/-up)
};

export default function DNAHelixBackground({
  className = "",
  strandColorA = "#1FAE9F",
  strandColorB = "#A78BFA",
  glow = 0.6,
  ampScale = 0.26,
  offsetY = 0,
}: DNAHelixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>();
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    let w = 0, h = 0, t = 0, running = true;

    const setSize = () => {
      // Ensure canvas occupies full parent size
      const parent = canvas.parentElement!;
      const pw = parent.clientWidth;
      const ph = parent.clientHeight;

      canvas.style.width = "100%";
      canvas.style.height = "100%";
      w = pw;
      h = ph;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    running = !mq.matches;
    const onMotionChange = () => {
      running = !mq.matches;
      if (running) loop();
    };
    mq.addEventListener?.("change", onMotionChange);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / (w || 1);
      mouse.current.y = e.clientY / (h || 1);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", setSize);
    setSize();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Soft diagonal wash
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "rgba(31,174,159,0.08)");
      bg.addColorStop(1, "rgba(167,139,250,0.08)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // Helix geometry (responsive)
      const centerY = h * 0.5 + (mouse.current.y - 0.5) * 24 + offsetY;
      const amp = Math.min(h, w) * ampScale;
      const freq = 0.012;
      const speed = 0.016;
      const phaseShift = Math.PI;
      const columns = Math.max(200, Math.round(w / 5)); // adapt to width

      t += speed;

      // Rungs for 3D feel
      ctx.lineWidth = 1.4;
      for (let i = 0; i <= columns; i++) {
        const x = (i / columns) * w;
        const s = Math.sin(i * freq + t);
        const y1 = centerY + s * amp;
        const y2 = centerY + Math.sin(i * freq + t + phaseShift) * amp;

        const depth = (1 + Math.cos(i * freq * 1.12 + t)) * 0.5; // 0..1
        const alpha = 0.1 + depth * 0.22;
        ctx.strokeStyle = `rgba(148,163,184,${alpha})`; // slate-400
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.stroke();
      }

      // Glowing strands
      const drawStrand = (phase: number, color: string) => {
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = glow * 48;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        for (let i = 0; i <= columns; i++) {
          const x = (i / columns) * w;
          const y = centerY + Math.sin(i * freq + t + phase) * amp;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      };

      drawStrand(0, strandColorA);
      drawStrand(phaseShift, strandColorB);
    };

    const loop = () => {
      draw();
      if (running) rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", setSize);
      mq.removeEventListener?.("change", onMotionChange);
    };
  }, [strandColorA, strandColorB, glow, ampScale, offsetY]);

  return <canvas ref={canvasRef} className={`block w-full h-full ${className}`} />;
}