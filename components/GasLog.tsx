'use client';

import { useEffect, useState } from 'react';

interface LogEntry {
  time: string;
  type: 'CLAIM' | 'SWAP' | 'LONG' | 'PROFIT' | 'BURN' | 'ALERT';
  message: string;
}

const MOCK_LOGS: LogEntry[] = [
  { time: '04:12:33', type: 'CLAIM', message: 'Creator fees claimed: 0.42 SOL' },
  { time: '04:12:35', type: 'SWAP', message: 'Swapped 0.42 SOL → 28.14 USDC via Jupiter' },
  { time: '04:12:38', type: 'LONG', message: 'Increased FART-PERP position: +$140.70 notional (5×)' },
  { time: '04:08:12', type: 'ALERT', message: 'Gas Pressure: 34% → Level 2 threshold approaching' },
  { time: '04:02:44', type: 'CLAIM', message: 'Creator fees claimed: 0.18 SOL' },
  { time: '04:02:47', type: 'SWAP', message: 'Swapped 0.18 SOL → 12.06 USDC via Jupiter' },
  { time: '04:02:50', type: 'LONG', message: 'Increased FART-PERP position: +$60.30 notional (5×)' },
  { time: '03:55:01', type: 'PROFIT', message: 'Unrealized PnL: +$42.30 (+8.7%)' },
  { time: '03:41:18', type: 'BURN', message: 'Burned 12,400 $METHANE (0.12% supply) — Burn on Rip' },
  { time: '03:30:00', type: 'ALERT', message: 'Methane Emissions Report #003 published on-chain' },
];

const TYPE_COLORS: Record<string, string> = {
  CLAIM: '#39FF14',
  SWAP: '#FFD700',
  LONG: '#39FF14',
  PROFIT: '#00BFFF',
  BURN: '#FF3333',
  ALERT: '#FFD700',
};

export default function GasLog() {
  const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    // Animate logs appearing
    MOCK_LOGS.forEach((log, i) => {
      setTimeout(() => {
        setVisibleLogs(prev => [...prev, log]);
      }, i * 200);
    });
  }, []);

  return (
    <div className="w-full border border-neutral-600/50 bg-bg-card/80 backdrop-blur-sm">
      {/* Header */}
      <div className="px-6 py-3 border-b border-neutral-600/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-toxic animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-300">
            GAS LEAK LOG — REAL-TIME ACTIVITY
          </span>
        </div>
        <span className="text-[11px] font-mono text-neutral-500">
          LAST 24H
        </span>
      </div>

      {/* Log entries */}
      <div className="max-h-[400px] overflow-y-auto">
        {visibleLogs.map((log, i) => (
          <div
            key={i}
            className="px-6 py-2.5 border-b border-neutral-600/10 flex items-start gap-4 hover:bg-neutral-600/5 transition-colors"
          >
            <span className="text-[11px] font-mono text-neutral-500 w-16 shrink-0 pt-0.5">
              {log.time}
            </span>
            <span
              className="text-[11px] font-mono font-bold w-14 shrink-0 pt-0.5"
              style={{ color: TYPE_COLORS[log.type] }}
            >
              [{log.type}]
            </span>
            <span className="text-[13px] font-mono text-neutral-300">
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
