'use client';

import { useEffect, useState } from 'react';

interface AggregateData {
  totalVaults: number;
  activeVaults: number;
  totalClaimed: number;
  totalNotional: number;
  totalBurned: number;
  cycleCount: number;
}

export default function ProtocolStats() {
  const [data, setData] = useState<AggregateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch vault count
        const vaultRes = await fetch('/api/vault');
        let totalVaults = 0, activeVaults = 0;
        if (vaultRes.ok) {
          const vaultData = await vaultRes.json();
          const vaults = vaultData.vaults || [];
          totalVaults = vaults.length;
          activeVaults = vaults.filter((v: any) => v.status === 'active').length;
        }

        // Fetch global stats
        const logRes = await fetch('/api/logs?limit=1');
        let stats: any = {};
        if (logRes.ok) {
          const logData = await logRes.json();
          stats = logData.stats || {};
        }

        setData({
          totalVaults,
          activeVaults,
          totalClaimed: Number(stats.totalClaimedSol || 0),
          totalNotional: Number(stats.totalLongNotional || 0),
          totalBurned: Number(stats.totalBurned || 0),
          cycleCount: Number(stats.cycleCount || 0),
        });
      } catch { /* silent */ }
      setLoading(false);
    };

    fetchStats();
    const iv = setInterval(fetchStats, 60000);
    return () => clearInterval(iv);
  }, []);

  const stats = [
    { label: 'VAULTS', value: loading ? '...' : `${data?.activeVaults || 0}`, sub: `${data?.totalVaults || 0} total`, color: 'var(--green)' },
    { label: 'SOL CLAIMED', value: loading ? '...' : `${(data?.totalClaimed || 0).toFixed(2)}`, sub: 'across all vaults', color: 'var(--accent)' },
    { label: 'NOTIONAL', value: loading ? '...' : `${(data?.totalNotional || 0).toFixed(2)} SOL`, sub: 'leveraged FART exposure', color: 'var(--white)' },
    { label: '$M BURNED', value: loading ? '...' : `${(data?.totalBurned || 0).toFixed(0)}`, sub: 'permanently removed', color: 'var(--red)' },
    { label: 'CYCLES', value: loading ? '...' : `${data?.cycleCount || 0}`, sub: 'pipeline executions', color: 'var(--fg-dim)' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="status-dot" />
          <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em' }}>PROTOCOL OVERVIEW</span>
        </div>
        <a href="/vaults" style={{ fontSize: 10, color: 'var(--fg-dim)', textDecoration: 'none' }}>
          view all vaults →
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }} className="grid-responsive">
        {stats.map((s, i) => (
          <div key={i} className="panel" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: 'var(--fg-dark)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
