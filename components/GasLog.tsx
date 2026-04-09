'use client';

import { useEffect, useState } from 'react';
import { LiveDot, GasCloudIcon, FlameIcon, ChartUpIcon, SkullIcon, GaugeIcon } from './icons';

interface LogEntry {
  time: string;
  type: 'CLAIM' | 'SWAP' | 'LONG' | 'PROFIT' | 'BURN' | 'ALERT';
  message: string;
}

const MOCK_LOGS: LogEntry[] = [
  { time: '04:12:33', type: 'CLAIM', message: 'Ripped 0.42 SOL in creator fees — the gas flows' },
  { time: '04:12:35', type: 'SWAP', message: 'Digested 0.42 SOL → 28.14 USDC via Jupiter' },
  { time: '04:12:38', type: 'LONG', message: 'FART long increased by $140.70 — the position grows stronger' },
  { time: '04:08:12', type: 'ALERT', message: 'Gas Pressure hitting 34% — approaching critical stink levels' },
  { time: '04:02:44', type: 'CLAIM', message: 'Another 0.18 SOL squeezed out of the system' },
  { time: '04:02:47', type: 'SWAP', message: 'Processed 0.18 SOL → 12.06 USDC — smooth digestion' },
  { time: '04:02:50', type: 'LONG', message: 'Added $60.30 to the FART long — she\'s getting thicc' },
  { time: '03:55:01', type: 'PROFIT', message: 'Unrealized PnL: +$42.30 (+8.7%) — smells like money' },
  { time: '03:41:18', type: 'BURN', message: 'Burned 12,400 $METHANE — that one was silent but deadly' },
  { time: '03:30:00', type: 'ALERT', message: 'Methane Emissions Report #003 published — the EPA is concerned' },
  { time: '03:15:22', type: 'LONG', message: 'FART-PERP funding rate positive — longs getting paid to fart' },
  { time: '03:01:05', type: 'CLAIM', message: '0.67 SOL extracted — biggest rip of the day' },
];

const TYPE_CONFIG: Record<string, { color: string; Icon: typeof GasCloudIcon }> = {
  CLAIM: { color: '#7CFC00', Icon: GasCloudIcon },
  SWAP: { color: '#C49B2F', Icon: GaugeIcon },
  LONG: { color: '#ADFF2F', Icon: ChartUpIcon },
  PROFIT: { color: '#7CFC00', Icon: ChartUpIcon },
  BURN: { color: '#FF4444', Icon: FlameIcon },
  ALERT: { color: '#C49B2F', Icon: SkullIcon },
};

export default function GasLog() {
  const [visible, setVisible] = useState<LogEntry[]>([]);

  useEffect(() => {
    MOCK_LOGS.forEach((log, i) => {
      setTimeout(() => setVisible(prev => [...prev, log]), i * 150);
    });
  }, []);

  return (
    <div className="gas-border">
      <div className="px-6 py-3 border-b border-stink/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LiveDot />
          <span className="font-bungee text-sm text-stink/70">GAS LEAK LOG</span>
          <span className="text-[10px] font-mono text-stink/30">REAL-TIME EMISSIONS</span>
        </div>
        <span className="text-[10px] font-mono text-stink/20">LAST 24H</span>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {visible.map((log, i) => {
          const config = TYPE_CONFIG[log.type];
          return (
            <div key={i} className="px-6 py-2.5 border-b border-stink/5 flex items-start gap-4 hover:bg-stink/[0.02] transition-colors">
              <span className="text-[11px] font-mono text-stink/20 w-16 shrink-0 pt-0.5">{log.time}</span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold w-16 shrink-0 pt-0.5" style={{ color: config.color }}>
                <config.Icon size={11} className="shrink-0" />
                {log.type}
              </span>
              <span className="text-[13px] font-mono text-stink/50">{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
