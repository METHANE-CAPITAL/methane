'use client';

import { useEffect, useRef } from 'react';

export default function MoleculeViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 280;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;

    let frame = 0;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      frame++;

      const wobble = Math.sin(frame * 0.02) * 3;
      const rot = frame * 0.005;

      // Carbon atom (center)
      const carbonR = 24;
      const carbonGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, carbonR * 2);
      carbonGlow.addColorStop(0, 'rgba(124, 252, 0, 0.4)');
      carbonGlow.addColorStop(1, 'rgba(124, 252, 0, 0)');
      ctx.fillStyle = carbonGlow;
      ctx.fillRect(cx - carbonR * 2, cy - carbonR * 2, carbonR * 4, carbonR * 4);

      ctx.beginPath();
      ctx.arc(cx, cy, carbonR, 0, Math.PI * 2);
      ctx.fillStyle = '#7CFC00';
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('C', cx, cy);

      // 4 hydrogen atoms in tetrahedral-ish 2D arrangement
      const hydrogenPositions = [
        { angle: rot + 0, dist: 70 + wobble },
        { angle: rot + Math.PI * 0.55, dist: 70 - wobble * 0.5 },
        { angle: rot + Math.PI, dist: 70 + wobble * 0.8 },
        { angle: rot + Math.PI * 1.55, dist: 70 - wobble * 0.3 },
      ];

      hydrogenPositions.forEach(({ angle, dist }) => {
        const hx = cx + Math.cos(angle) * dist;
        const hy = cy + Math.sin(angle) * dist;

        // Bond line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(hx, hy);
        ctx.strokeStyle = 'rgba(124, 252, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dashed electron cloud
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(
          (cx + hx) / 2,
          (cy + hy) / 2,
          12,
          0, Math.PI * 2
        );
        ctx.strokeStyle = 'rgba(124, 252, 0, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // H atom
        const hGlow = ctx.createRadialGradient(hx, hy, 0, hx, hy, 24);
        hGlow.addColorStop(0, 'rgba(196, 155, 47, 0.3)');
        hGlow.addColorStop(1, 'rgba(196, 155, 47, 0)');
        ctx.fillStyle = hGlow;
        ctx.fillRect(hx - 24, hy - 24, 48, 48);

        ctx.beginPath();
        ctx.arc(hx, hy, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#C49B2F';
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText('H', hx, hy);
      });

      requestAnimationFrame(draw);
    };

    const id = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-[280px] h-[280px]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <span className="text-[11px] font-mono text-stink/40 tracking-widest">CH₄</span>
      </div>
    </div>
  );
}
