'use client';

import { useEffect, useState } from 'react';

interface PositionData {
  live: boolean;
  venue: string;
  position: {
    hasPosition: boolean;
    count: number;
    positions: Array<{
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
    </div>
  );
}
