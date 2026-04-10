'use client';

import { useEffect, useState, useRef } from 'react';

const METHANE_ASCII = `███    ███ ███████ ████████ ██   ██  █████  ███    ██ ███████
████  ████ ██         ██    ██   ██ ██   ██ ████   ██ ██
██ ████ ██ █████      ██    ███████ ███████ ██ ██  ██ █████
██  ██  ██ ██         ██    ██   ██ ██   ██ ██  ██ ██ ██
██      ██ ███████    ██    ██   ██ ██   ██ ██   ████ ███████`;

interface CheckLine {
  label: string;
  key: string;
  check: () => Promise<string>;
}

const checks: CheckLine[] = [
  {
    label: 'Lavarage connection',
    key: 'lavarage',
    check: async () => {
      try {
        const r = await fetch('https://api.lavarage.xyz/api/v1/offers?search=fart');
        const d = await r.json();
        const count = Array.isArray(d) ? d.length : 0;
        return count > 0 ? `OK [${count} offers]` : 'NO OFFERS';
      } catch { return 'TIMEOUT'; }
    },
  },
  {
    label: 'FART oracle (Pyth)',
    key: 'pyth',
    check: async () => {
      try {
        const r = await fetch('/api/fart-price');
        const d = await r.json();
        return d.price ? `$${Number(d.price).toFixed(4)}` : 'OK';
      } catch { return 'OK'; }
    },
  },
  {
    label: 'Pipeline agent',
    key: 'agent',
    check: async () => {
      try {
        const r = await fetch('/api/position');
        const d = await r.json();
        return d.live ? 'ACTIVE' : 'STANDBY';
      } catch { return 'STANDBY'; }
    },
  },
  {
    label: 'Leverage engine',
    key: 'leverage',
    check: async () => '5× LONG',
  },
  {
    label: 'Gas-as-a-Service',
    key: 'gaas',
    check: async () => 'LOADED',
  },
];

export default function BiosPreloader({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<{ label: string; result: string | null }[]>([]);
  const [showAscii, setShowAscii] = useState(false);
  const [showVersion, setShowVersion] = useState(false);
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      // Phase 1: Show ASCII title
      await delay(200);
      setShowAscii(true);
      await delay(400);
      setShowVersion(true);
      await delay(300);

      // Phase 2: Run checks sequentially
      for (let i = 0; i < checks.length; i++) {
        const c = checks[i];
        // Add line with null result (pending)
        setLines(prev => [...prev, { label: c.label, result: null }]);
        await delay(150);

        // Run the actual check
        const result = await c.check();

        // Update with result
        setLines(prev =>
          prev.map((l, idx) => idx === i ? { ...l, result } : l)
        );
        await delay(120);
      }

      // Phase 3: Boot complete
      await delay(400);
      setDone(true);
      await delay(600);
      setFadeOut(true);
      await delay(500);
      onComplete();
    };

    run();
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
        padding: '20px',
        overflow: 'hidden',
      }}
    >
      {/* Scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
        zIndex: 1,
      }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 640 }}>
        {/* ASCII METHANE */}
        <pre
          style={{
            fontSize: 'clamp(5px, 2.2vw, 13px)',
            lineHeight: 1.2,
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            marginBottom: 20,
            opacity: showAscii ? 1 : 0,
            transform: showAscii ? 'translateY(0)' : 'translateY(-8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            whiteSpace: 'pre',
            overflow: 'hidden',
          }}
        >
          {METHANE_ASCII}
        </pre>

        {/* Version line */}
        <div
          style={{
            fontSize: 10,
            color: 'var(--fg-dark, #555)',
            textAlign: 'center',
            marginBottom: 28,
            letterSpacing: '0.1em',
            opacity: showVersion ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          GAS-AS-A-SERVICE v1.0 &nbsp;·&nbsp; BIOS POST
        </div>

        {/* Check lines */}
        <div style={{ fontSize: 11, lineHeight: 2 }}>
          {lines.map((line, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                {line.label}
                {line.result === null && <span className="bios-dots">{'...'}</span>}
              </span>
              {line.result !== null && (
                <span
                  style={{
                    color: line.result === 'TIMEOUT' || line.result === 'NO OFFERS'
                      ? '#ff4444'
                      : 'rgba(255,255,255,0.85)',
                    fontWeight: 600,
                  }}
                >
                  {line.result}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Boot complete */}
        {done && (
          <div
            style={{
              marginTop: 24,
              fontSize: 10,
              color: 'rgba(255,255,255,0.4)',
              textAlign: 'center',
              letterSpacing: '0.08em',
              animation: 'bios-blink 1s step-end infinite',
            }}
          >
            PRESS ANY KEY TO CONTINUE_
          </div>
        )}
      </div>

      <style>{`
        @keyframes bios-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .bios-dots {
          animation: bios-blink 0.6s step-end infinite;
        }
      `}</style>
    </div>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
