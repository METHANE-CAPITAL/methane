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

  const typeColors: Record<string, string> = {
    CLAIM: 'var(--green)',
    SWAP: 'var(--green)',
    LONG: 'var(--white)',
    BURN: 'var(--red)',
    SYSTEM: 'var(--fg-dark)',
    INFO: 'var(--fg-dark)',
  };

  return (
    <div>
      <h2 style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Gas Log</h2>
      <div className="panel" style={{ padding: '16px 20px', maxHeight: 280, overflow: 'auto' }}>
        {loading ? (
          <div style={{ fontSize: 11, color: 'var(--fg-dark)' }}>loading...</div>
        ) : (
          displayLogs.map((log, i) => {
            const time = new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false });
            return (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 11 }}>
                <span style={{ color: 'var(--fg-dark)', flexShrink: 0, width: 56 }}>[{time}]</span>
                <span style={{ color: typeColors[log.type] || 'var(--fg-dark)', flexShrink: 0, width: 56, fontWeight: 600, fontSize: 9, letterSpacing: '0.06em' }}>{log.type}</span>
                <span style={{ color: 'var(--fg-dim)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.message}</span>
                {log.txHash && (
                  <a href={`https://solscan.io/tx/${log.txHash}`} target="_blank" rel="noopener" style={{ color: 'var(--fg-dark)', fontSize: 9, flexShrink: 0 }}>
                    {log.txHash.slice(0, 8)}…
                  </a>
                )}
              </div>
            );
          })
        )}
        <div className="cursor-blink" style={{ marginTop: 4 }} />
      </div>
    </div>
  );
}
