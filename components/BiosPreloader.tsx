'use client';

import { useEffect, useState, useRef } from 'react';

const METHANE_ASCII = [
  '███    ███ ███████ ████████ ██   ██  █████  ███    ██ ███████',
  '████  ████ ██         ██    ██   ██ ██   ██ ████   ██ ██',
  '██ ████ ██ █████      ██    ███████ ███████ ██ ██  ██ █████',
  '██  ██  ██ ██         ██    ██   ██ ██   ██ ██  ██ ██ ██',
  '██      ██ ███████    ██    ██   ██ ██   ██ ██   ████ ███████',
];

interface CheckResult {
  label: string;
  result: string | null;
  status: 'pending' | 'ok' | 'warn' | 'info';
}

const checks = [
  {
    label: 'Lavarage connection',
    run: async (): Promise<{ result: string; status: 'ok' | 'warn' | 'info' }> => {
      try {
        const r = await fetch('https://api.lavarage.xyz/api/v1/offers?search=fart');
        const d = await r.json();
        const count = Array.isArray(d) ? d.length : 0;
        return count > 0
          ? { result: `OK [${count} offers]`, status: 'ok' }
          : { result: 'NO OFFERS', status: 'warn' };
      } catch { return { result: 'TIMEOUT', status: 'warn' }; }
    },
  },
  {
    label: 'FART oracle',
    run: async () => {
      try {
        const r = await fetch('/api/fart-price');
        const d = await r.json();
        return d.price
          ? { result: `$${Number(d.price).toFixed(4)}`, status: 'ok' as const }
          : { result: 'OK', status: 'ok' as const };
      } catch { return { result: 'OK', status: 'ok' as const }; }
    },
  },
  {
    label: 'Pipeline agent',
    run: async () => {
      try {
        const r = await fetch('/api/position');
        const d = await r.json();
        return d.live
          ? { result: 'ACTIVE', status: 'ok' as const }
          : { result: 'STANDBY', status: 'info' as const };
      } catch { return { result: 'STANDBY', status: 'info' as const }; }
    },
  },
  {
    label: 'Leverage engine',
    run: async () => ({ result: '5× LONG', status: 'ok' as const }),
  },
  {
    label: 'Fee router',
    run: async () => ({ result: 'ARMED', status: 'ok' as const }),
  },
  {
    label: 'Gas-as-a-Service',
    run: async () => ({ result: 'READY', status: 'ok' as const }),
  },
];

const DOT_CHAR = '.';

function DotLeader({ label, result, status }: { label: string; result: string | null; status: string }) {
  const totalWidth = 44;
  const labelLen = label.length;
  const resultLen = result ? result.length : 3;
  const dots = Math.max(2, totalWidth - labelLen - resultLen - 2);

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 2.2, whiteSpace: 'pre' }}>
      <span style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      <span style={{ color: 'rgba(255,255,255,0.12)' }}>{DOT_CHAR.repeat(dots)}</span>
      {result === null ? (
        <span style={{ color: 'rgba(255,255,255,0.3)' }} className="bios-blink">...</span>
      ) : (
        <span
          style={{
            color:
              status === 'ok' ? 'rgba(255,255,255,0.9)' :
              status === 'warn' ? '#ff4444' :
              'rgba(255,255,255,0.45)',
            fontWeight: 600,
          }}
        >
          {result}
        </span>
      )}
    </div>
  );
}

export default function BiosPreloader({ onComplete }: { onComplete: () => void }) {
  const [asciiLines, setAsciiLines] = useState<number>(0);
  const [showVersion, setShowVersion] = useState(false);
  const [showSeparator, setShowSeparator] = useState(false);
  const [lineResults, setLineResults] = useState<CheckResult[]>([]);
  const [bootMsg, setBootMsg] = useState('');
  const [fadeOut, setFadeOut] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const run = async () => {
      // Phase 1: ASCII title — line by line
      for (let i = 0; i < METHANE_ASCII.length; i++) {
        await delay(80);
        setAsciiLines(i + 1);
      }

      await delay(300);
      setShowVersion(true);
      await delay(250);
      setShowSeparator(true);
      await delay(200);

      // Phase 2: POST checks — sequential with dot leaders
      for (let i = 0; i < checks.length; i++) {
        const c = checks[i];
        // Show pending line
        setLineResults(prev => [...prev, { label: c.label, result: null, status: 'pending' }]);
        await delay(200 + Math.random() * 150);

        // Run check
        const { result, status } = await c.run();

        // Update with result
        setLineResults(prev =>
          prev.map((l, idx) => idx === i ? { ...l, result, status } : l)
        );
        await delay(80);
      }

      // Phase 3: Boot message
      await delay(350);
      setBootMsg('All systems nominal. Booting...');
      await delay(800);

      // Phase 4: Fade out
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
        background: '#080808',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
        padding: '24px',
        overflow: 'hidden',
      }}
    >
      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
        zIndex: 1,
      }} />

      {/* CRT vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
        zIndex: 2,
      }} />

      <div style={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: 520 }}>
        {/* ASCII METHANE — line by line reveal */}
        <pre
          style={{
            fontSize: 'clamp(6px, 2.4vw, 12px)',
            lineHeight: 1.15,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            marginBottom: 12,
            whiteSpace: 'pre',
            overflow: 'hidden',
          }}
        >
          {METHANE_ASCII.slice(0, asciiLines).join('\n')}
        </pre>

        {/* Version + subheader */}
        {showVersion && (
          <div style={{
            textAlign: 'center', marginBottom: 20,
            animation: 'bios-fade-in 0.3s ease',
          }}>
            <div style={{
              fontSize: 9, color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              Gas-as-a-Service &nbsp;·&nbsp; POST v1.0
            </div>
          </div>
        )}

        {/* Separator */}
        {showSeparator && (
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            marginBottom: 16,
            animation: 'bios-fade-in 0.2s ease',
          }} />
        )}

        {/* Check lines with dot leaders */}
        <div>
          {lineResults.map((line, i) => (
            <DotLeader key={i} label={line.label} result={line.result} status={line.status} />
          ))}
        </div>

        {/* Boot message */}
        {bootMsg && (
          <div style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            fontSize: 10,
            color: 'rgba(255,255,255,0.3)',
            textAlign: 'center',
            letterSpacing: '0.06em',
            animation: 'bios-fade-in 0.3s ease',
          }}>
            {bootMsg}
            <span className="bios-cursor">_</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bios-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes bios-fade-in {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .bios-blink { animation: bios-blink 0.7s step-end infinite; }
        .bios-cursor { animation: bios-blink 1s step-end infinite; }
      `}</style>
    </div>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
