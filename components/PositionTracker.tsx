'use client';

import { useEffect, useState } from 'react';

interface Position {
  address: string;
  side: string;
  collateral: number;
  borrowed: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  roiPercent: number;
  liquidationPrice: number;
  effectiveLeverage: number;
  interestAccrued: number;
  dailyInterestCost: number;
  baseToken: string;
  quoteToken: string;
}

interface PositionData {
  live: boolean;
  venue: string;
  agentWallet: string;
  position: {
    hasPosition: boolean;
    count: number;
    positions: Position[];
    totals: { collateral: number; pnl: number; avgLeverage: number };
  };
  stats: {
    totalClaimed: number;
    totalLongNotional: number;
    cycleCount: number;
    pendingBuyback: number;
    totalBurned: number;
    burnCount: number;
    longCount: number;
  };
  message: string;
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: color || 'var(--accent)' }}>{value}</div>
    </div>
  );
}

function fmt(n: number | undefined, decimals = 2): string {
  if (n === undefined || n === null || isNaN(n)) return '—';
  return n.toFixed(decimals);
}

function fmtUsd(n: number | undefined): string {
  if (n === undefined || n === null || isNaN(n)) return '—';
  return `$${n.toFixed(2)}`;
}

// Map position addresses to their creation transaction signatures
function getPositionTx(positionAddress: string): string {
  const txMap: Record<string, string> = {
    'CNjjro7WjmZzX268K3iWJYVBiYL4n9Qq9KSNvYH1pGPr': '2m9jCUjmUuYCkUkjmSTxS6qPvfdm7vAtcvxchTiDhgGFSjRiDrMuYWFBM9XmnU8eSUYSX7Fa8jdBPEftgNAAeWYy',
    'GJKQarMYgFgPWAcqS2vAWBBhCVqWKkT5HRDGrnMPwxmz': '47RdCymwteC3ukbH2xEjhdXBXabUKkyS55A3q76U35urTtQbMUjBFNtmiLTzmpdVw7iwByeyPqepSdKU89UGNYgw',
  };
  return txMap[positionAddress] || 'unknown';
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
  const pos = data?.position;
  const hasPos = pos?.hasPosition || false;
  const p = hasPos ? pos?.positions?.[0] : null;

  return (
    <div>
      {/* Position Overview */}
      <div className="panel" style={{ padding: '20px 24px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={hasPos ? 'status-dot' : ''} style={!hasPos ? { width: 6, height: 6, background: 'var(--fg-dark)', display: 'inline-block', borderRadius: '50%' } : {}} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.08em' }}>
              {hasPos ? 'POSITION ACTIVE' : 'POSITION — LAUNCHING SOON'}
            </span>
            <span style={{ fontSize: 9, color: 'var(--fg-dark)', marginLeft: 8 }}>via Lavarage</span>
          </div>
          {data?.agentWallet && (
            <a href={`https://solscan.io/account/${data.agentWallet}`} target="_blank" rel="noopener"
              style={{ fontSize: 9, color: 'var(--fg-dark)', textDecoration: 'none' }}>
              agent: {data.agentWallet.slice(0, 4)}...{data.agentWallet.slice(-4)} ↗
            </a>
          )}
        </div>

        {hasPos && p ? (
          <>
            {/* Live position details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }} className="grid-responsive">
              <Stat label="DIRECTION" value={`${fmt(p.effectiveLeverage, 1)}× LONG`} />
              <Stat label="ENTRY PRICE" value={fmtUsd(p.entryPrice)} />
              <Stat label="MARK PRICE" value={fmtUsd(p.currentPrice)} />
              <Stat label="UNREALIZED PnL" value={fmtUsd(p.unrealizedPnl)} color={p.unrealizedPnl >= 0 ? 'var(--green)' : 'var(--red)'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="grid-responsive">
              <Stat label="ROI" value={`${fmt(p.roiPercent, 1)}%`} color={p.roiPercent >= 0 ? 'var(--green)' : 'var(--red)'} />
              <Stat label="LIQUIDATION" value={fmtUsd(p.liquidationPrice)} color="var(--red)" />
              <Stat label="COLLATERAL" value={`${fmt(p.collateral, 4)} SOL`} />
              <Stat label="INTEREST / DAY" value={fmtUsd(p.dailyInterestCost)} color="var(--fg-dim)" />
            </div>
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="grid-responsive">
            <Stat label="DIRECTION" value="5× LONG" />
            <Stat label="VENUE" value="Lavarage" />
            <Stat label="ASSET" value="FART" />
            <Stat label="STATUS" value={loading ? '...' : 'Launching Soon'} color="var(--fg-dim)" />
          </div>
        )}
      </div>

      {/* Verification Section */}
      {hasPos && (
        <div className="panel" style={{ padding: '20px 24px', marginBottom: 12 }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 12 }}>ON-CHAIN VERIFICATION</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, fontSize: 11 }}>
            <div>
              <div style={{ marginBottom: 8, color: 'var(--fg-dim)' }}>Agent Wallet</div>
              <a href={`https://solscan.io/account/${data?.agentWallet}`} target="_blank" rel="noopener"
                style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none' }}>
                {data?.agentWallet?.slice(0, 8)}...{data?.agentWallet?.slice(-8)} ↗
              </a>
            </div>
            <div>
              <div style={{ marginBottom: 8, color: 'var(--fg-dim)' }}>Position Address</div>
              <a href={`https://app.lavarage.xyz/position/${p?.address}`} target="_blank" rel="noopener"
                style={{ fontSize: 10, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none' }}>
                {p?.address?.slice(0, 8)}...{p?.address?.slice(-8)} ↗
              </a>
            </div>
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <div style={{ marginBottom: 8, color: 'var(--fg-dim)', fontSize: 11 }}>Position Open Transactions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {pos?.positions?.map((position, i) => (
                <div key={position.address} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--fg-dark)' }}>
                    Position {i + 1}: {fmt(position.collateral, 3)} SOL @ {fmt(position.effectiveLeverage, 1)}×
                  </span>
                  <a href={`https://solscan.io/tx/${getPositionTx(position.address)}`} target="_blank" rel="noopener"
                    style={{ fontSize: 9, color: 'var(--accent)', fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none' }}>
                    {getPositionTx(position.address).slice(0, 8)}...{getPositionTx(position.address).slice(-8)} ↗
                  </a>
                </div>
              )) || []}
            </div>
          </div>
        </div>
      )}

      {/* Pipeline Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="grid-responsive">
        <div className="panel" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 10 }}>PIPELINE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            {[
              ['cycles run', s?.cycleCount || 0],
              ['total claimed', s ? `${s.totalClaimed.toFixed(4)} SOL` : '—'],
              ['total notional', s ? `${s.totalLongNotional.toFixed(4)} SOL` : '—'],
              ['longs opened', s?.longCount || 0],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--fg-dim)' }}>{k}</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{loading ? '...' : String(v)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 10 }}>BURN TRACKER</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            {[
              ['total burned', s ? `${s.totalBurned.toFixed(0)} $M` : '0'],
              ['burn events', s?.burnCount || 0],
              ['trigger', '+15% PnL'],
              ['burn rate', '0.5% supply'],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--fg-dim)' }}>{k}</span>
                <span style={{ color: i < 2 ? 'var(--red)' : 'var(--fg-dim)', fontWeight: i < 2 ? 600 : 400 }}>{loading ? '...' : String(v)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 10 }}>BUYBACK RESERVE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            {[
              ['pending', s ? `${s.pendingBuyback.toFixed(4)} SOL` : '0'],
              ['allocation', '30% of fees'],
              ['long count', s?.longCount || 0],
              ['venue', 'Lavarage'],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--fg-dim)' }}>{k}</span>
                <span style={{ color: i === 0 ? 'var(--accent)' : 'var(--fg-dim)', fontWeight: i === 0 ? 600 : 400 }}>{loading ? '...' : String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
