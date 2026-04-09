'use client';

import { useEffect, useState } from 'react';
import { LiveDot, GaugeIcon, ChartUpIcon } from './icons';

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
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch('/api/drift-market');
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.error) throw new Error();
        setMarket(data);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: 'MARK PRICE',
      value: loading ? '...' : market ? `$${market.markPrice.toFixed(4)}` : '—',
      color: '#7CFC00',
      Icon: ChartUpIcon,
    },
    {
      label: 'FUNDING RATE (1H)',
      value: loading ? '...' : market ? `${market.fundingRateHourly >= 0 ? '+' : ''}${market.fundingRateHourly.toFixed(4)}%` : '—',
      color: market && market.fundingRateHourly >= 0 ? '#7CFC00' : '#FF4444',
      Icon: GaugeIcon,
    },
    {
      label: 'FUNDING (ANNUAL)',
      value: loading ? '...' : market ? `${market.fundingRateAnnualized >= 0 ? '+' : ''}${market.fundingRateAnnualized.toFixed(0)}%` : '—',
      color: market && market.fundingRateAnnualized >= 0 ? '#ADFF2F' : '#FF4444',
      Icon: GaugeIcon,
    },
    {
      label: 'OPEN INTEREST',
      value: loading ? '...' : market ? `$${(market.openInterestUsd / 1000).toFixed(1)}K` : '—',
      color: '#C49B2F',
      Icon: ChartUpIcon,
    },
  ];

  return (
    <div className="gas-border">
      <div className="px-5 py-2.5 border-b border-stink/8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LiveDot />
          <span className="font-bungee text-xs text-stink/60">FART-PERP MARKET</span>
          <span className="text-[9px] font-mono text-stink/15">DRIFT · MKT #71 · LIVE ON-CHAIN DATA</span>
        </div>
        {!loading && !error && (
          <span className="text-[8px] font-mono text-stink/10">UPDATES EVERY 30S</span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="px-4 py-3.5 border-r border-stink/5 last:border-r-0 hover:bg-stink/[0.02] transition-colors">
            <div className="text-[9px] font-mono text-stink/20 mb-1 flex items-center gap-1">
              <s.Icon size={9} className="text-stink/15" />
              {s.label}
            </div>
            <div className="text-lg font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      {error && (
        <div className="px-5 py-2 border-t border-stink/5 text-[10px] font-mono text-danger/40">
          Drift market data unavailable — retrying...
        </div>
      )}
    </div>
  );
}
