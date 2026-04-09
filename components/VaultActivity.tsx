'use client';

import { useEffect, useState } from 'react';

interface ActionEntry {
  id: string;
  action: string;
  status: string;
  result?: string;
  error?: string;
  requestedAt: number;
  completedAt?: number;
}

interface LogEntry {
  timestamp: number;
  type: string;
  message: string;
  txSignature?: string;
}

export default function VaultActivity({ tokenMint, vaultAddress }: { tokenMint: string; vaultAddress: string }) {
  const [actions, setActions] = useState<ActionEntry[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // Fetch pending/recent actions
        const actRes = await fetch(`/api/vault/action?mint=${tokenMint}`);
        if (actRes.ok) {
          const data = await actRes.json();
          setActions(data.actions || []);
        }

        // Fetch logs filtered by vault
        const logRes = await fetch('/api/logs?limit=100');
        if (logRes.ok) {
          const data = await logRes.json();
          const vaultLogs = (data.logs || []).filter((l: LogEntry) =>
            l.message?.includes(tokenMint.slice(0, 8)) ||
            l.message?.includes(vaultAddress.slice(0, 8))
          );
          setLogs(vaultLogs.slice(0, 20));
        }
      } catch { /* silent */ }
      setLoading(false);
    };

    fetchActivity();
    const iv = setInterval(fetchActivity, 30000);
    return () => clearInterval(iv);
  }, [tokenMint, vaultAddress]);

  const hasActivity = actions.length > 0 || logs.length > 0;

  // Check for important notifications
  const recentActions = actions.filter(a => a.completedAt && Date.now() - a.completedAt < 3600000);
  const autoCloses = logs.filter(l => l.message?.includes('Auto-closed') || l.message?.includes('HEALTH'));

  return (
    <div>
      {/* Important notifications */}
      {autoCloses.length > 0 && (
        <div style={{
          padding: '12px 16px', marginBottom: 12,
          background: 'rgba(196,48,48,0.05)', border: '1px solid rgba(196,48,48,0.2)',
        }}>
          <div style={{ fontSize: 10, color: 'var(--red)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6 }}>⚠ POSITION AUTO-CLOSED</div>
          <div style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
            {autoCloses[0].message}
          </div>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', marginTop: 4 }}>
            {new Date(autoCloses[0].timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {recentActions.filter(a => a.status === 'completed').length > 0 && (
        <div style={{
          padding: '12px 16px', marginBottom: 12,
          background: 'rgba(90,170,69,0.05)', border: '1px solid rgba(90,170,69,0.2)',
        }}>
          <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6 }}>✓ ACTION COMPLETED</div>
          {recentActions.filter(a => a.status === 'completed').map((a, i) => (
            <div key={i} style={{ fontSize: 11, color: 'var(--fg-dim)' }}>
              {a.action}: {a.result}
            </div>
          ))}
        </div>
      )}

      {/* Pending actions */}
      {actions.filter(a => a.status === 'pending').length > 0 && (
        <div style={{
          padding: '12px 16px', marginBottom: 12,
          background: 'rgba(255,200,0,0.03)', border: '1px solid rgba(255,200,0,0.15)',
        }}>
          <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6 }}>⏳ PENDING ACTIONS</div>
          {actions.filter(a => a.status === 'pending').map((a, i) => (
            <div key={i} style={{ fontSize: 11, color: 'var(--fg-dim)' }}>
              {a.action} — queued {new Date(a.requestedAt).toLocaleTimeString()}, will execute on next cycle
            </div>
          ))}
        </div>
      )}

      {/* Activity log */}
      {loading ? (
        <div style={{ fontSize: 11, color: 'var(--fg-dark)', padding: 16 }}>Loading activity...</div>
      ) : !hasActivity ? (
        <div style={{ fontSize: 11, color: 'var(--fg-dark)', padding: 16, textAlign: 'center' }}>
          No activity yet. Activity will appear once the agent starts processing your vault.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* Merge and sort actions + logs by time */}
          {[
            ...actions.map(a => ({
              time: a.completedAt || a.requestedAt,
              type: 'action' as const,
              data: a,
            })),
            ...logs.map(l => ({
              time: l.timestamp,
              type: 'log' as const,
              data: l,
            })),
          ]
            .sort((a, b) => b.time - a.time)
            .slice(0, 15)
            .map((entry, i) => (
              <div key={i} style={{
                padding: '10px 14px', fontSize: 11, borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, flexShrink: 0, padding: '1px 6px',
                    background: entry.type === 'action'
                      ? (entry.data as ActionEntry).status === 'completed' ? 'rgba(90,170,69,0.1)' : 'rgba(255,200,0,0.1)'
                      : (entry.data as LogEntry).type === 'ERROR' ? 'rgba(196,48,48,0.1)' : 'rgba(255,255,255,0.03)',
                    color: entry.type === 'action'
                      ? (entry.data as ActionEntry).status === 'completed' ? 'var(--green)' : 'var(--accent)'
                      : (entry.data as LogEntry).type === 'ERROR' ? 'var(--red)' : 'var(--fg-dim)',
                    letterSpacing: '0.04em',
                  }}>
                    {entry.type === 'action' ? (entry.data as ActionEntry).action.toUpperCase() : (entry.data as LogEntry).type}
                  </span>
                  <span style={{ color: 'var(--fg-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entry.type === 'action'
                      ? `${(entry.data as ActionEntry).result || (entry.data as ActionEntry).status}`
                      : (entry.data as LogEntry).message}
                  </span>
                </div>
                <div style={{ fontSize: 9, color: 'var(--fg-dark)', flexShrink: 0 }}>
                  {new Date(entry.time).toLocaleTimeString()}
                  {entry.type === 'log' && (entry.data as LogEntry).txSignature && (
                    <a href={`https://solscan.io/tx/${(entry.data as LogEntry).txSignature}`} target="_blank" rel="noopener"
                      style={{ color: 'var(--fg-dark)', marginLeft: 6, textDecoration: 'none' }}>tx ↗</a>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
