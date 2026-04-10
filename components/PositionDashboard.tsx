'use client';

import { useEffect, useState } from 'react';

interface PositionData {
  live: boolean;
  venue: string;
  agentWallet: string;
  position: {
    hasPosition: boolean;
    count: number;
    positions: Array<{
      address: string;
      openTx: string | null;
      side: string;
      collateral: number;
      entryPrice: number;
      currentPrice: number;
      unrealizedPnl: number;
      roiPercent: number;
      liquidationPrice: number;
      effectiveLeverage: number;
      interestAccrued: number;
    }>;
    totals: {
      collateral: number;
      pnl: number;
      avgLeverage: number;
    };
  };
  stats: {
    totalClaimed: number;
    totalLongNotional: number;
    cycleCount: number;
    longCount: number;
  };
}

// Open-tx mapping lives in Redis, written by the agent when it opens a position.
// /api/position returns p.openTx per active position, so this file has no hardcoded map.

export default function PositionDashboard() {
  const [data, setData] = useState<PositionData | null>(null);
  const [fartPrice, setFartPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [posRes, priceRes] = await Promise.all([
          fetch('/api/position'),
          fetch('/api/fart-price?type=live'),
        ]);
        if (posRes.ok) setData(await posRes.json());
        if (priceRes.ok) {
          const p = await priceRes.json();
          if (p.price) setFartPrice(p.price);
        }
      } catch { /* silent */ }
      setLoading(false);
    };
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const pos = data?.position;
  const hasPos = pos?.hasPosition;
  const stats = data?.stats;

  const statItems = [
    {
      label: 'FART PRICE',
      value: loading ? '...' : fartPrice ? `$${fartPrice.toFixed(4)}` : '—',
      color: 'var(--white)',
    },
    {
      label: 'VAULT PNL',
      value: loading ? '...' : hasPos ? `$${pos!.totals.pnl.toFixed(2)}` : '—',
      color: hasPos && pos!.totals.pnl >= 0 ? 'var(--green)' : 'var(--red)',
    },
    {
      label: 'AVG LEVERAGE',
      value: loading ? '...' : hasPos ? `${pos!.totals.avgLeverage.toFixed(1)}×` : '—',
      color: 'var(--accent)',
    },
    {
      label: 'CYCLES RUN',
      value: loading ? '...' : stats ? `${stats.cycleCount}` : '—',
      color: 'var(--fg-dim)',
    },
  ];

  return (
    <div className="panel" style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="status-dot" />
          <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em' }}>FART LEVERAGE — LIVE</span>
          <span style={{ fontSize: 9, color: 'var(--fg-dark)' }}>· lavarage</span>
        </div>
        <span style={{ fontSize: 9, color: 'var(--fg-dark)' }}>updates every 30s</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="grid-responsive">
        {statItems.map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--fg-dark)', letterSpacing: '0.05em' }}>
        SPOT LEVERAGE · LAVARAGE · SOL COLLATERAL → FART · <span style={{ color: 'var(--fg-dim)' }}>{hasPos ? `${pos!.count} ACTIVE POSITION${pos!.count > 1 ? 'S' : ''}` : 'LAUNCHING SOON'}</span>
      </div>

      {/* Per-position detail rows */}
      {hasPos && pos!.positions.length > 0 && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 10 }}>ACTIVE POSITIONS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pos!.positions.map((p, i) => (
              <div key={p.address} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 1fr 1fr 1fr 1fr', gap: 10, alignItems: 'center', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                <div style={{ fontSize: 9, color: 'var(--fg-dark)' }}>#{i + 1}</div>
                <div>
                  <div style={{ fontSize: 8, color: 'var(--fg-dark)', letterSpacing: '0.06em' }}>COLLATERAL</div>
                  <div style={{ color: 'var(--fg-dim)' }}>{p.collateral.toFixed(3)} SOL</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: 'var(--fg-dark)', letterSpacing: '0.06em' }}>LEVERAGE</div>
                  <div style={{ color: 'var(--fg-dim)' }}>{p.effectiveLeverage.toFixed(2)}×</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: 'var(--fg-dark)', letterSpacing: '0.06em' }}>ENTRY</div>
                  <div style={{ color: 'var(--fg-dim)' }}>${p.entryPrice.toFixed(6)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: 'var(--fg-dark)', letterSpacing: '0.06em' }}>ROI</div>
                  <div style={{ color: p.roiPercent >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {p.roiPercent >= 0 ? '+' : ''}{p.roiPercent.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 8, color: 'var(--fg-dark)', letterSpacing: '0.06em' }}>PNL</div>
                  <div style={{ color: p.unrealizedPnl >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {p.unrealizedPnl >= 0 ? '+' : ''}${p.unrealizedPnl.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* On-Chain Verification */}
      {hasPos && data?.agentWallet && (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 10 }}>ON-CHAIN VERIFICATION</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 9, color: 'var(--fg-dark)', marginBottom: 4 }}>AGENT WALLET</div>
              <a href={`https://solscan.io/account/${data.agentWallet}`} target="_blank" rel="noopener"
                style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none' }}>
                {data.agentWallet.slice(0, 6)}...{data.agentWallet.slice(-6)} ↗
              </a>
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'var(--fg-dark)', marginBottom: 4 }}>POSITION</div>
              <a href={`https://app.lavarage.xyz/position/${pos!.positions[0]?.address || ''}`} target="_blank" rel="noopener"
                style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none' }}>
                {(pos!.positions[0]?.address || '').slice(0, 6)}...{(pos!.positions[0]?.address || '').slice(-6)} ↗
              </a>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {pos!.positions.map((p, i) => {
              const tx = p.openTx || '';
              return (
                <div key={p.address} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a href={`https://app.lavarage.xyz/position/${p.address}`} target="_blank" rel="noopener"
                    style={{ fontSize: 9, color: 'var(--fg-dark)', textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>
                    pos {i + 1}: {p.address.slice(0, 6)}...{p.address.slice(-6)} ↗
                  </a>
                  {tx ? (
                    <a href={`https://solscan.io/tx/${tx}`} target="_blank" rel="noopener"
                      style={{ fontSize: 9, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none' }}>
                      open tx: {tx.slice(0, 6)}...{tx.slice(-6)} ↗
                    </a>
                  ) : (
                    <span style={{ fontSize: 9, color: 'var(--fg-dark)', fontFamily: 'JetBrains Mono, monospace' }}>
                      open tx: pending
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
