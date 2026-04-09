'use client';

import { useEffect, useRef } from 'react';

export default function FartClouds() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    interface Cloud {
      x: number; y: number; radius: number; speed: number;
      wobblePhase: number; wobbleSpeed: number; opacity: number;
      color: string; drift: number;
    }

    let clouds: Cloud[] = [];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      'rgba(124, 252, 0, OPACITY)',
      'rgba(173, 255, 47, OPACITY)',
      'rgba(139, 105, 20, OPACITY)',
      'rgba(100, 180, 0, OPACITY)',
    ];

    const makeCloud = (startY?: number): Cloud => ({
      x: Math.random() * canvas.width,
      y: startY ?? canvas.height + Math.random() * 200,
      radius: 15 + Math.random() * 50,
      speed: 0.15 + Math.random() * 0.4,
      wobblePhase: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.005 + Math.random() * 0.015,
      opacity: 0.03 + Math.random() * 0.08,
      color: colors[Math.floor(Math.random() * colors.length)],
      drift: (Math.random() - 0.5) * 0.3,
    });

    for (let i = 0; i < 25; i++) {
      clouds.push(makeCloud(Math.random() * canvas.height));
    }

    const drawCloud = (c: Cloud) => {
      const wobbleX = Math.sin(c.wobblePhase) * 20;
      const cx = c.x + wobbleX;

      // Draw multiple overlapping ellipses for cloud shape
      for (let i = 0; i < 3; i++) {
        const offsetX = (i - 1) * c.radius * 0.5;
        const offsetY = Math.sin(i * 1.5) * c.radius * 0.2;
        const r = c.radius * (0.6 + i * 0.2);

        const grad = ctx.createRadialGradient(
          cx + offsetX, c.y + offsetY, 0,
          cx + offsetX, c.y + offsetY, r
        );
        const col = c.color.replace('OPACITY', String(c.opacity));
        const colFade = c.color.replace('OPACITY', '0');
        grad.addColorStop(0, col);
        grad.addColorStop(0.6, col);
        grad.addColorStop(1, colFade);

        ctx.beginPath();
        ctx.ellipse(cx + offsetX, c.y + offsetY, r, r * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      clouds.forEach((c, i) => {
        c.y -= c.speed;
        c.x += c.drift;
        c.wobblePhase += c.wobbleSpeed;

        if (c.y < -100) clouds[i] = makeCloud();

        drawCloud(c);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
