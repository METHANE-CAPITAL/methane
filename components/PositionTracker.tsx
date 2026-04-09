'use client';

import { useEffect, useState } from 'react';

interface PositionData {
  live: boolean;
  agentWallet: string;
  stats: {
    totalClaimed: number;
    totalSwapped: number;
    totalDeposited: number;
    totalLongNotional: number;
    cycleCount: number;
    pendingBuyback: number;
    totalBurned: number;
    burnCount: number;
    longCount: number;
    depositCount: number;
  };
  message: string;
}

function Stat({ label, value, unit, color }: { label: string; value: string; unit?: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: color || 'var(--accent)' }}>
        {value}<span style={{ fontSize: 10, fontWeight: 400, color: 'var(--fg-dark)', marginLeft: 3 }}>{unit}</span>
      </div>
    </div>
  );
}

export default function PositionTracker() {
  const [data, setData] = useState<PositionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch('/api/position');
        if (res.ok) setData(await res.json());
      } catch { /* silent */ }
      setLoading(false);
    };
    fetch_();
    const iv = setInterval(fetch_, 30000);
    return () => clearInterval(iv);
  }, []);

  const s = data?.stats;
  const isLive = data?.live || false;

  return (
    <div>
      {/* Position Overview */}
      <div className="panel" style={{ padding: '20px 24px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={isLive ? 'status-dot' : ''} style={!isLive ? { width: 6, height: 6, background: 'var(--fg-dark)', display: 'inline-block' } : {}} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em' }}>
              {isLive ? 'POSITION ACTIVE' : 'POSITION — LAUNCHING SOON'}
            </span>
          </div>
          {data?.agentWallet && (
            <a href={`https://solscan.io/account/${data.agentWallet}`} target="_blank" rel="noopener"
              style={{ fontSize: 9, color: 'var(--fg-dark)' }}>
              agent: {data.agentWallet.slice(0, 4)}...{data.agentWallet.slice(-4)} ↗
            </a>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="grid-responsive">
          <Stat label="DIRECTION" value="5× LONG" />
          <Stat label="MARKET" value="FART-PERP" />
          <Stat label="TOTAL DEPOSITED" value={loading ? '...' : s ? `$${s.totalDeposited.toFixed(2)}` : '—'} />
          <Stat label="TOTAL NOTIONAL" value={loading ? '...' : s ? `$${s.totalLongNotional.toFixed(0)}` : '—'} color="var(--green)" />
        </div>
      </div>

      {/* Pipeline Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="grid-responsive">
        {/* Claiming */}
        <div className="panel" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 10 }}>PIPELINE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>cycles run</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{loading ? '...' : s?.cycleCount || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>total claimed</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{loading ? '...' : s ? `${s.totalClaimed.toFixed(4)} SOL` : '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>total swapped</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{loading ? '...' : s ? `$${s.totalSwapped.toFixed(2)}` : '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>deposits</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{loading ? '...' : s?.depositCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Burns */}
        <div className="panel" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 10 }}>BURN TRACKER</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>total burned</span>
              <span style={{ color: 'var(--red)', fontWeight: 600 }}>{loading ? '...' : s ? `${s.totalBurned.toFixed(0)} $M` : '0'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>burn events</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{loading ? '...' : s?.burnCount || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>trigger</span>
              <span style={{ color: 'var(--fg-dim)' }}>+15% PnL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>burn rate</span>
              <span style={{ color: 'var(--fg-dim)' }}>0.5% supply</span>
            </div>
          </div>
        </div>

        {/* Buyback */}
        <div className="panel" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 10 }}>BUYBACK RESERVE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>pending</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{loading ? '...' : s ? `${s.pendingBuyback.toFixed(4)} SOL` : '0'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>allocation</span>
              <span style={{ color: 'var(--fg-dim)' }}>30% of fees</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>long count</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{loading ? '...' : s?.longCount || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--fg-dim)' }}>status</span>
              <span style={{ color: 'var(--fg-dim)' }}>Phase 2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
