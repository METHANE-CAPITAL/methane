'use client';

import { useEffect, useRef } from 'react';

/**
 * Plasma Cloud effect adapted from rikschennink's CodePen.
 * Particle simulation with blur + contrast = metaball/plasma look.
 * Colorway: site palette (greys, whites, subtle green glow).
 */

// Simple 2D Vector
class Vec {
  x: number;
  y: number;
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  static random(range = 1) {
    return new Vec(range * 2 * (-.5 + Math.random()), range * 2 * (-.5 + Math.random()));
  }
  static distSq(a: Vec, b: Vec) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return dx * dx + dy * dy;
  }
  static sub(a: Vec, b: Vec) { return new Vec(a.x - b.x, a.y - b.y); }
  add(v: Vec) { this.x += v.x; this.y += v.y; }
  get mag() { return Math.sqrt(this.x * this.x + this.y * this.y); }
  normalize() { const m = this.mag; if (m > 0) { this.x /= m; this.y /= m; } }
  multiply(s: number) { this.x *= s; this.y *= s; }
  divide(s: number) { this.x /= s; this.y /= s; }
  limit(t: number) { if (this.mag > t) { this.normalize(); this.multiply(t); } }
  clone() { return new Vec(this.x, this.y); }
}

interface Particle {
  pos: Vec;
  vel: Vec;
  size: number;
  baseSize: number;
}

export default function PlasmaCloud() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctxMaybe = canvasEl.getContext('2d');
    if (!ctxMaybe) return;

    // Non-null aliases for closures
    const canvas = canvasEl;
    const ctx = ctxMaybe;

    let w = 0, h = 0;
    let mouse = { x: -9999, y: -9999 };
    let particles: Particle[] = [];
    let raf: number;

    function resize() {
      const container = canvas.parentElement;
      if (!container) return;
      w = container.clientWidth;
      h = container.clientHeight;
      canvas.width = w;
      canvas.height = h;
    }

    function init() {
      resize();
      particles = [];
      const count = Math.floor((w * h) / (65 * 65));
      for (let i = 0; i < count; i++) {
        const baseSize = 12 + Math.random() * 16;
        particles.push({
          pos: new Vec(Math.random() * w, Math.random() * h),
          vel: Vec.random(0.4),
          size: baseSize,
          baseSize,
        });
      }
    }

    // Separation behavior
    function separate(p: Particle) {
      const heading = new Vec();
      let count = 0;
      const dist = 50 * 50;
      for (const other of particles) {
        if (other === p || Vec.distSq(other.pos, p.pos) > dist) continue;
        const diff = Vec.sub(p.pos, other.pos);
        diff.normalize();
        heading.add(diff);
        count++;
      }
      if (count > 0) {
        heading.divide(count);
        heading.normalize();
        heading.multiply(p.vel.mag);
        heading.limit(0.1);
      }
      p.vel.add(heading);
    }

    // Reflect off edges
    function reflect(p: Particle) {
      const r = p.size * 0.5;
      if (p.pos.x + r > w || p.pos.x - r < 0) p.vel.x = -p.vel.x;
      if (p.pos.y + r > h || p.pos.y - r < 0) p.vel.y = -p.vel.y;
    }

    // Color mapping — bright enough to survive contrast filter
    function getColor(size: number): string {
      const t = Math.max(0, Math.min(1, (size - 12) / 50));
      // Small: dim green. Large: bright white-green
      const r = Math.floor(30 + t * 180);
      const g = Math.floor(50 + t * 200);
      const b = Math.floor(25 + t * 140);
      return `rgb(${r},${g},${b})`;
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        // Mouse proximity → grow
        if (Vec.distSq(p.pos, mouse as any) < 20000) {
          p.size = Math.min(65, p.size + 0.8);
        } else {
          p.size = Math.max(p.baseSize, p.size - 0.5);
        }

        // Behaviors
        separate(p);
        p.vel.limit(0.3);
        reflect(p);
        p.pos.add(p.vel);

        // Draw
        ctx.beginPath();
        ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = getColor(p.size);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    }

    init();
    tick();

    const handleResize = () => { resize(); };
    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => { mouse = { x: -9999, y: -9999 }; };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('mouseleave', handleLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: 280, overflow: 'hidden' }}>
      {/* Background layer to make the contrast trick work */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#0a0f0a',
        filter: 'contrast(3)',
      }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            filter: 'blur(20px)',
          }}
        />
      </div>
      {/* Subtle label */}
      <div style={{
        position: 'absolute', bottom: 12, left: 0, right: 0,
        textAlign: 'center', fontSize: 9, letterSpacing: '0.15em',
        color: 'rgba(255,255,255,0.15)', zIndex: 1,
      }}>
        METHANE GAS CLOUD · MOVE YOUR MOUSE
      </div>
    </div>
  );
}
