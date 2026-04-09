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

  return (
    <div className="bg-block text-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-dimmer">{'// '}</span>
          <span className="text-accent">FART-PERP LIVE MARKET DATA</span>
          <span className="text-dimmest"> · drift #71</span>
        </div>
        <span className="text-dimmest">updates every 30s</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-6">
        <div>
          <div className="text-dimmest mb-0.5">mark price</div>
          <div className="text-accent text-base font-bold">
            {loading ? '...' : market ? `$${market.markPrice.toFixed(4)}` : '—'}
          </div>
        </div>
        <div>
          <div className="text-dimmest mb-0.5">funding (1h)</div>
          <div className={`text-base font-bold ${market && market.fundingRateHourly >= 0 ? 'text-green' : 'text-red'}`}>
            {loading ? '...' : market ? `${market.fundingRateHourly >= 0 ? '+' : ''}${market.fundingRateHourly.toFixed(4)}%` : '—'}
          </div>
        </div>
        <div>
          <div className="text-dimmest mb-0.5">funding (annual)</div>
          <div className={`text-base font-bold ${market && market.fundingRateAnnualized >= 0 ? 'text-green' : 'text-red'}`}>
            {loading ? '...' : market ? `${market.fundingRateAnnualized >= 0 ? '+' : ''}${market.fundingRateAnnualized.toFixed(0)}%` : '—'}
          </div>
        </div>
        <div>
          <div className="text-dimmest mb-0.5">open interest</div>
          <div className="text-accent text-base font-bold">
            {loading ? '...' : market ? `$${(market.openInterestUsd / 1000).toFixed(1)}K` : '—'}
          </div>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-subtle text-dimmest">
        5x LONG · FART-PERP #71 · DRIFT PROTOCOL · <span className="text-dim">LAUNCHING SOON</span>
      </div>
    </div>
  );
}
