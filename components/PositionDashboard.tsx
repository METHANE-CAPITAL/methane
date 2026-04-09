'use client';

import { useEffect, useState } from 'react';

interface MarketData {
  markPrice: number;
  lastFundingRate: number;
  fundingRateHourly: number;
  fundingRateAnnualized: number;
  openInterestBase: number;
  openInterestUsd: number;
}

export default function PositionDashboard() {
  const [market, setMarket] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch('/api/drift-market');
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.error) throw new Error();
        setMarket(data);
      } catch { /* silent */ }
      setLoading(false);
    };
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'MARK PRICE', value: loading ? '...' : market ? `$${market.markPrice.toFixed(4)}` : '—', color: 'var(--white)' },
    { label: 'FUNDING (1H)', value: loading ? '...' : market ? `${market.fundingRateHourly >= 0 ? '+' : ''}${market.fundingRateHourly.toFixed(4)}%` : '—', color: market && market.fundingRateHourly >= 0 ? 'var(--green)' : 'var(--red)' },
    { label: 'FUNDING (ANN)', value: loading ? '...' : market ? `${market.fundingRateAnnualized >= 0 ? '+' : ''}${market.fundingRateAnnualized.toFixed(0)}%` : '—', color: market && market.fundingRateAnnualized >= 0 ? 'var(--green)' : 'var(--red)' },
    { label: 'OPEN INTEREST', value: loading ? '...' : market ? `$${(market.openInterestUsd / 1000).toFixed(1)}K` : '—', color: 'var(--accent)' },
  ];

  return (
    <div className="panel" style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="status-dot" />
          <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em' }}>FART-PERP LIVE MARKET DATA</span>
          <span style={{ fontSize: 9, color: 'var(--fg-dark)' }}>· drift #71</span>
        </div>
        <span style={{ fontSize: 9, color: 'var(--fg-dark)' }}>updates every 30s</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="grid-responsive">
        {stats.map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: 10, color: 'var(--fg-dark)', letterSpacing: '0.05em' }}>
        5× LONG · FART-PERP #71 · DRIFT PROTOCOL · <span style={{ color: 'var(--fg-dim)' }}>LAUNCHING SOON</span>
      </div>
    </div>
  );
}
