'use client';

import { useEffect, useState } from 'react';

export default function BurnTracker() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/logs?limit=1');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats || {});
        }
      } catch { /* silent */ }
      setLoading(false);
    };
    fetchStats();
    const iv = setInterval(fetchStats, 60000);
    return () => clearInterval(iv);
  }, []);

  const totalBurned = Number(stats.totalBurned || 0);
  const burnCount = Number(stats.burnCount || 0);
  const blowoffPayouts = Number(stats.blowoffPayouts || 0);
  const blowoffTotalSol = Number(stats.blowoffTotalSol || 0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }} className="grid-responsive">
      <div className="panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 700, letterSpacing: '0.08em' }}>🔥 BURN COUNTER</span>
          <span style={{ fontSize: 9, color: 'var(--fg-dark)' }}>live</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.06em', marginBottom: 2 }}>TOTAL $METHANE BURNED</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--red)' }}>
              {loading ? '...' : totalBurned > 0 ? totalBurned.toLocaleString() : '0'}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: 'var(--fg-dim)' }}>burn events</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{loading ? '...' : burnCount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: 'var(--fg-dim)' }}>trigger</span>
            <span style={{ color: 'var(--fg-dim)' }}>+15% vault PnL</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', marginTop: 4, lineHeight: 1.5 }}>
            When any vault hits +15% unrealized PnL, the 30% buyback allocation buys $METHANE and burns it permanently.
          </div>
        </div>
      </div>

      <div className="panel" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.08em' }}>💨 BLOWOFF MILESTONES</span>
          <span style={{ fontSize: 9, color: 'var(--fg-dark)' }}>live</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { milestone: '2×', status: blowoffPayouts >= 1 ? 'paid' : 'pending' },
            { milestone: '5×', status: blowoffPayouts >= 2 ? 'paid' : 'pending' },
            { milestone: '10×', status: blowoffPayouts >= 3 ? 'paid' : 'pending' },
          ].map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--white)', fontWeight: 600 }}>{m.milestone} PnL</span>
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '2px 8px',
                background: m.status === 'paid' ? 'rgba(90,170,69,0.1)' : 'rgba(255,255,255,0.03)',
                color: m.status === 'paid' ? 'var(--green)' : 'var(--fg-dark)',
                border: `1px solid ${m.status === 'paid' ? 'rgba(90,170,69,0.3)' : 'var(--border)'}`,
              }}>
                {m.status === 'paid' ? '✓ PAID' : 'PENDING'}
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginTop: 4 }}>
            <span style={{ color: 'var(--fg-dim)' }}>total distributed</span>
            <span style={{ color: 'var(--green)', fontWeight: 600 }}>{loading ? '...' : `${blowoffTotalSol.toFixed(2)} SOL`}</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', marginTop: 4, lineHeight: 1.5 }}>
            At each milestone, 30% of realized gains get distributed to top 500 $METHANE holders. Bigger bag = bigger share.
          </div>
        </div>
      </div>
    </div>
  );
}
