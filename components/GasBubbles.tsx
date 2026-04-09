'use client';

import { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
  phase: number;
}

export default function GasBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let bubbles: Bubble[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createBubble = (): Bubble => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 100,
      radius: 2 + Math.random() * 6,
      speed: 0.3 + Math.random() * 0.8,
      wobble: 0,
      wobbleSpeed: 0.01 + Math.random() * 0.02,
      opacity: 0.1 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    });

    // Initialize bubbles
    for (let i = 0; i < 40; i++) {
      const b = createBubble();
      b.y = Math.random() * canvas.height;
      bubbles.push(b);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubbles.forEach((b, i) => {
        b.y -= b.speed;
        b.phase += b.wobbleSpeed;
        b.wobble = Math.sin(b.phase) * 30;

        if (b.y < -20) {
          bubbles[i] = createBubble();
          return;
        }

        // Draw bubble
        ctx.beginPath();
        ctx.arc(b.x + b.wobble, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(57, 255, 20, ${b.opacity * 0.5})`;
        ctx.fill();

        // Inner glow
        const gradient = ctx.createRadialGradient(
          b.x + b.wobble, b.y, 0,
          b.x + b.wobble, b.y, b.radius
        );
        gradient.addColorStop(0, `rgba(57, 255, 20, ${b.opacity})`);
        gradient.addColorStop(1, 'rgba(57, 255, 20, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
