'use client';

import { useEffect, useRef } from 'react';

interface PressureGaugeProps {
  pressure: number; // 0-100
  label: string;
  value: string;
  sublabel?: string;
}

export default function PressureGauge({ pressure, label, value, sublabel }: PressureGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200;
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 80;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Background arc
    const startAngle = 0.75 * Math.PI;
    const endAngle = 2.25 * Math.PI;

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, endAngle);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Pressure arc
    const pressureAngle = startAngle + (pressure / 100) * (endAngle - startAngle);
    const gradient = ctx.createLinearGradient(0, size, size, 0);

    if (pressure < 33) {
      gradient.addColorStop(0, '#39FF14');
      gradient.addColorStop(1, '#39FF14');
    } else if (pressure < 66) {
      gradient.addColorStop(0, '#39FF14');
      gradient.addColorStop(1, '#FFD700');
    } else {
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(1, '#FF3333');
    }

    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, pressureAngle);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Glow
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, pressureAngle);
    ctx.strokeStyle = pressure < 33
      ? 'rgba(57, 255, 20, 0.3)'
      : pressure < 66
        ? 'rgba(255, 215, 0, 0.3)'
        : 'rgba(255, 51, 51, 0.3)';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Tick marks
    for (let i = 0; i <= 10; i++) {
      const angle = startAngle + (i / 10) * (endAngle - startAngle);
      const innerR = radius - 20;
      const outerR = radius - 14;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Needle
    const needleAngle = startAngle + (pressure / 100) * (endAngle - startAngle);
    const needleLen = radius - 25;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(needleAngle) * needleLen,
      cy + Math.sin(needleAngle) * needleLen
    );
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

  }, [pressure]);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-300">
        {label}
      </span>
      <canvas ref={canvasRef} className="w-[200px] h-[200px]" />
      <div className="text-center -mt-4">
        <div className="text-2xl font-mono font-bold text-toxic toxic-text-glow">
          {value}
        </div>
        {sublabel && (
          <div className="text-[11px] font-mono text-neutral-400 mt-1">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}
