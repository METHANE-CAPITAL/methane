'use client';

import { useEffect, useState } from 'react';

export default function FlywheelDiagram() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [spin, setSpin] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setSpin(p => (p + 0.15) % 360), 50);
    return () => clearInterval(iv);
  }, []);

  const nodes = [
    { label: 'TOKEN FEES', desc: 'Creator fees from your project', icon: '◆' },
    { label: 'METHANE VAULT', desc: 'Isolated vault per project', icon: '⬡' },
    { label: '7× FART LONG', desc: 'Leveraged via Lavarage', icon: '⟠' },
    { label: 'BUY PRESSURE', desc: 'FART demand increases', icon: '▲' },
    { label: 'FART PRICE ↑', desc: 'Rising tide lifts all boats', icon: '◉' },
    { label: 'ALL VAULTS ↑', desc: 'Every position grows', icon: '⊕' },
  ];

  const cx = 200, cy = 190, rx = 140, ry = 130;

  const positions = nodes.map((_, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * rx, y: cy + Math.sin(angle) * ry };
  });

  return (
    <div className="panel" style={{ padding: '24px 24px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.12em' }}>THE FLYWHEEL</div>
        <div style={{ fontSize: 9, color: 'var(--fg-dark)' }}>each project · own vault · shared upside</div>
      </div>

      <svg viewBox="0 0 400 380" style={{ width: '100%', maxWidth: 520, display: 'block', margin: '0 auto' }}>
        <defs>
          <marker id="fw-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(90,170,69,0.6)" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Spinning orbit ring */}
        <ellipse cx={cx} cy={cy} rx={rx + 8} ry={ry + 8}
          fill="none" stroke="rgba(90,170,69,0.06)" strokeWidth={1} />

        {/* Orbit pulse dot */}
        <circle
          cx={cx + Math.cos((spin * Math.PI) / 180) * (rx + 8)}
          cy={cy + Math.sin((spin * Math.PI) / 180) * (ry + 8)}
          r={3} fill="rgba(90,170,69,0.4)" filter="url(#glow)" />

        {/* Connection arrows */}
        {positions.map((from, i) => {
          const to = positions[(i + 1) % nodes.length];
          // Shorten line to not overlap nodes
          const dx = to.x - from.x, dy = to.y - from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const nx = dx / len, ny = dy / len;
          const gap = 44;
          const sx = from.x + nx * gap, sy = from.y + ny * gap;
          const ex = to.x - nx * gap, ey = to.y - ny * gap;
          // Slight curve
          const mx = (sx + ex) / 2 + (cy - (sy + ey) / 2) * 0.12;
          const my = (sy + ey) / 2 - (cx - (sx + ex) / 2) * 0.12;
          const isHot = hovered === i || hovered === (i + 1) % nodes.length;
          return (
            <path key={i}
              d={`M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`}
              stroke={isHot ? 'rgba(90,170,69,0.5)' : 'rgba(90,170,69,0.15)'}
              strokeWidth={isHot ? 2 : 1.2}
              fill="none"
              markerEnd="url(#fw-arrow)"
              style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
            />
          );
        })}

        {/* Center text */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.08)" letterSpacing="0.12em" fontFamily="inherit">MORE PROJECTS</text>
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.08)" letterSpacing="0.12em" fontFamily="inherit">FASTER SPIN</text>

        {/* Nodes */}
        {positions.map((pos, i) => {
          const node = nodes[i];
          const isHot = hovered === i;
          const isGreen = i >= 3;
          return (
            <g key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'default' }}>
              {/* Hit area */}
              <rect x={pos.x - 48} y={pos.y - 28} width={96} height={56} fill="transparent" />

              {/* Box */}
              <rect x={pos.x - 44} y={pos.y - 24} width={88} height={48} rx={0}
                fill={isHot ? (isGreen ? 'rgba(90,170,69,0.12)' : 'rgba(255,255,255,0.06)')
                  : (isGreen ? 'rgba(90,170,69,0.05)' : 'rgba(255,255,255,0.02)')}
                stroke={isHot ? (isGreen ? 'rgba(90,170,69,0.5)' : 'rgba(255,255,255,0.15)')
                  : (isGreen ? 'rgba(90,170,69,0.2)' : 'var(--border)')}
                strokeWidth={isHot ? 1.5 : 1}
                style={{ transition: 'all 0.2s' }}
              />

              {/* Icon */}
              <text x={pos.x} y={pos.y - 6} textAnchor="middle"
                fontSize="11" fill={isGreen ? 'var(--green)' : 'var(--accent)'}
                style={{ opacity: isHot ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                {node.icon}
              </text>

              {/* Label */}
              <text x={pos.x} y={pos.y + 10} textAnchor="middle"
                fontSize="8" fill={isGreen ? 'var(--green)' : 'var(--fg-dim)'}
                fontWeight="700" letterSpacing="0.08em" fontFamily="inherit">
                {node.label}
              </text>

              {/* Tooltip on hover */}
              {isHot && (
                <text x={pos.x} y={pos.y + 36} textAnchor="middle"
                  fontSize="8" fill="var(--fg-dark)" fontFamily="inherit">
                  {node.desc}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16, fontSize: 10, color: 'var(--fg-dark)', flexWrap: 'wrap' }}>
        <span>fees flow in <span style={{ color: 'var(--green)' }}>→</span></span>
        <span>leverage amplifies <span style={{ color: 'var(--green)' }}>→</span></span>
        <span>FART price rises <span style={{ color: 'var(--green)' }}>→</span></span>
        <span>all vaults grow <span style={{ color: 'var(--green)' }}>→</span></span>
        <span style={{ color: 'var(--green)' }}>repeat</span>
      </div>
    </div>
  );
}
