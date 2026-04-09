'use client';

// Circular flywheel diagram — SVG based, no external deps
export default function FlywheelDiagram() {
  const nodes = [
    { label: 'CREATOR\nFEES', x: 200, y: 40 },
    { label: 'SWAP\nSOL→USDC', x: 360, y: 120 },
    { label: 'DRIFT\nDEPOSIT', x: 360, y: 260 },
    { label: '5× FART\nLONG', x: 200, y: 340 },
    { label: 'BUYBACK\n+ BURN', x: 40, y: 260 },
    { label: 'HOLDERS\nGAIN', x: 40, y: 120 },
  ];

  return (
    <div className="panel" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.12em' }}>THE FLYWHEEL</div>
        <div style={{ fontSize: 9, color: 'var(--fg-dark)' }}>autonomous · every 15 min</div>
      </div>

      <svg viewBox="0 0 400 380" style={{ width: '100%', maxWidth: 500, display: 'block', margin: '0 auto' }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.2)" />
          </marker>
          <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(90,170,69,0.5)" />
          </marker>
        </defs>

        {/* Connecting arrows */}
        {[
          { from: 0, to: 1, color: 'rgba(255,255,255,0.12)' },
          { from: 1, to: 2, color: 'rgba(255,255,255,0.12)' },
          { from: 2, to: 3, color: 'rgba(90,170,69,0.25)' },
          { from: 3, to: 4, color: 'rgba(90,170,69,0.25)' },
          { from: 4, to: 5, color: 'rgba(196,48,48,0.25)' },
          { from: 5, to: 0, color: 'rgba(255,255,255,0.12)' },
        ].map((edge, i) => {
          const f = nodes[edge.from];
          const t = nodes[edge.to];
          // Offset towards center to avoid overlapping nodes
          const cx = 200, cy = 190;
          const fx = f.x + (cx - f.x) * 0.15;
          const fy = f.y + (cy - f.y) * 0.15;
          const tx = t.x + (cx - t.x) * 0.15;
          const ty = t.y + (cy - t.y) * 0.15;
          const mx = (fx + tx) / 2 + (cy - (fy + ty) / 2) * 0.15;
          const my = (fy + ty) / 2 - (cx - (fx + tx) / 2) * 0.15;
          return (
            <path
              key={i}
              d={`M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`}
              stroke={edge.color}
              strokeWidth={1.5}
              fill="none"
              markerEnd={edge.color.includes('170,69') ? 'url(#arrow-green)' : 'url(#arrow)'}
            />
          );
        })}

        {/* Center label */}
        <text x="200" y="186" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.1)" letterSpacing="0.1em" fontFamily="inherit">AUTONOMOUS</text>
        <text x="200" y="198" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.1)" letterSpacing="0.1em" fontFamily="inherit">LOOP</text>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const lines = node.label.split('\n');
          const isGreen = i === 3 || i === 5; // FART LONG, HOLDERS GAIN
          const isRed = i === 4; // BURN
          const fill = isGreen ? 'rgba(90,170,69,0.08)' : isRed ? 'rgba(196,48,48,0.08)' : 'rgba(255,255,255,0.03)';
          const stroke = isGreen ? 'rgba(90,170,69,0.25)' : isRed ? 'rgba(196,48,48,0.25)' : 'var(--border-med)';
          const textColor = isGreen ? 'var(--green)' : isRed ? 'var(--red)' : 'var(--fg-dim)';
          return (
            <g key={i}>
              <rect x={node.x - 40} y={node.y - 12} width={80} height={lines.length * 14 + 8} rx={0}
                fill={fill} stroke={stroke} strokeWidth={1} />
              {lines.map((line, j) => (
                <text key={j} x={node.x} y={node.y + j * 14 + 6} textAnchor="middle"
                  fontSize="9" fill={textColor} fontWeight="600" letterSpacing="0.06em" fontFamily="inherit">
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12, fontSize: 10, color: 'var(--fg-dark)' }}>
        <span>FART buy pressure <span style={{ color: 'var(--green)' }}>↑</span></span>
        <span>$METHANE supply <span style={{ color: 'var(--red)' }}>↓</span></span>
        <span>holder value <span style={{ color: 'var(--green)' }}>↑</span></span>
      </div>
    </div>
  );
}
