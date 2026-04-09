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
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    }

    function init() {
      resize();
      particles = [];
      // Sparse particles across viewport
      const count = Math.floor((w * h) / (100 * 100));
      for (let i = 0; i < count; i++) {
        const baseSize = 6 + Math.random() * 8;
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

    // Color mapping — subtle warm white glow
    function getColor(size: number): string {
      const t = Math.max(0, Math.min(1, (size - 6) / 30));
      // Small: barely visible. Large (near mouse): soft warm white
      const r = Math.floor(18 + t * 40);
      const g = Math.floor(20 + t * 42);
      const b = Math.floor(18 + t * 38);
      return `rgb(${r},${g},${b})`;
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        // Mouse proximity → grow
        if (Vec.distSq(p.pos, mouse as any) < 25000) {
          p.size = Math.min(40, p.size + 0.5);
        } else {
          p.size = Math.max(p.baseSize, p.size - 0.3);
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

    const handleResize = () => { init(); };
    const handleMouse = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
    };
    const handleLeave = () => { mouse = { x: -9999, y: -9999 }; };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      background: 'transparent',
      filter: 'contrast(2.5)',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          filter: 'blur(18px)',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}
