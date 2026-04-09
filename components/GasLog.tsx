'use client';

import { useEffect, useState } from 'react';

interface LogEntry {
  type: string;
  message: string;
  timestamp: string;
  txHash?: string;
}

export default function GasLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setLogs(data.logs || []);
      } catch { /* silent */ }
      setLoading(false);
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 60000);
    return () => clearInterval(interval);
  }, []);

  const placeholders: LogEntry[] = [
    { type: 'SYSTEM', message: 'agent initialized. monitoring creator wallet...', timestamp: new Date().toISOString() },
    { type: 'INFO', message: 'waiting for first fee claim', timestamp: new Date().toISOString() },
    { type: 'SYSTEM', message: 'drift connection established. FART-PERP #71 ready.', timestamp: new Date().toISOString() },
  ];

  const displayLogs = logs.length > 0 ? logs.slice(0, 10) : placeholders;

  return (
    <div>
      <h2 className="text-accent text-sm mb-3">GAS LOG</h2>
      <div className="bg-block text-[11px] leading-relaxed max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="text-dimmest">loading...</div>
        ) : (
          displayLogs.map((log, i) => {
            const time = new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false });
            const typeColor = log.type === 'CLAIM' ? 'text-green' : log.type === 'SWAP' ? 'text-green' : log.type === 'LONG' ? 'text-accent' : 'text-dimmer';
            return (
              <div key={i} className="flex gap-2">
                <span className="text-dimmest shrink-0">[{time}]</span>
                <span className={`shrink-0 ${typeColor}`}>{log.type.padEnd(7)}</span>
                <span className="text-dim">{log.message}</span>
                {log.txHash && (
                  <a href={`https://solscan.io/tx/${log.txHash}`} target="_blank" rel="noopener" className="text-dimmest shrink-0">
                    {log.txHash.slice(0, 8)}...
                  </a>
                )}
              </div>
            );
          })
        )}
        <div className="text-dimmest mt-1 cursor-blink" />
      </div>
    </div>
  );
}
