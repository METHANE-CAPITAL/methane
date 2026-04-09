'use client';

import { useEffect, useState } from 'react';
import { LiveDot, GasCloudIcon, FlameIcon, ChartUpIcon, SkullIcon, GaugeIcon } from './icons';

interface LogEntry {
  time: string;
  type: 'CLAIM' | 'SWAP' | 'LONG' | 'PROFIT' | 'BURN' | 'ALERT';
  message: string;
}

const MOCK_LOGS: LogEntry[] = [
  { time: '04:12:33', type: 'CLAIM', message: '0.42 SOL claimed from creator fees' },
  { time: '04:12:35', type: 'SWAP', message: '0.42 SOL → 28.14 USDC via Jupiter' },
  { time: '04:12:38', type: 'LONG', message: 'FART long +$140.70 — position updated' },
  { time: '04:02:44', type: 'CLAIM', message: '0.18 SOL claimed from creator fees' },
  { time: '04:02:50', type: 'LONG', message: 'FART long +$60.30 — position updated' },
  { time: '03:41:18', type: 'BURN', message: '12,400 $METHANE burned (0.12% supply)' },
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
      setTimeout(() => setVisible(prev => [...prev, log]), i * 120);
    });
  }, []);

  return (
    <div className="gas-border">
      <div className="px-5 py-2.5 border-b border-stink/8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LiveDot />
          <span className="font-bungee text-xs text-stink/60">GAS LOG</span>
        </div>
        <span className="text-[9px] font-mono text-stink/15">LAST 24H</span>
      </div>

      <div>
        {visible.map((log, i) => {
          const config = TYPE_CONFIG[log.type];
          return (
            <div key={i} className="px-5 py-2 border-b border-stink/4 flex items-center gap-4 hover:bg-stink/[0.02] transition-colors">
              <span className="text-[10px] font-mono text-stink/15 w-14 shrink-0">{log.time}</span>
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold w-12 shrink-0" style={{ color: config.color }}>
                <config.Icon size={10} className="shrink-0" />
                {log.type}
              </span>
              <span className="text-[12px] font-mono text-stink/40">{log.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
