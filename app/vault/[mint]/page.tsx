'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import VaultActions from '@/components/VaultActions';
import VaultActivity from '@/components/VaultActivity';

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
}

interface VaultData {
  vault: {
    tokenMint: string;
    tokenName: string;
    tokenSymbol: string;
    vaultAddress: string;
    creatorWallet: string;
    createdAt: number;
    status: string;
    leverage: number;
    splitLongPct: number;
    splitBuybackPct: number;
  };
  position: {
    active: boolean;
    count: number;
    positions: Position[];
    totals: { collateral: number; pnl: number; avgLeverage: number };
  };
  stats: Record<string, number>;
}

function Stat({ label, value, color, small }: { label: string; value: string; color?: string; small?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: small ? 14 : 18, fontWeight: 700, color: color || 'var(--accent)' }}>{value}</div>
    </div>
  );
}

function fmt(n: number | undefined, d = 2): string {
  if (n === undefined || n === null || isNaN(n)) return '—';
  return n.toFixed(d);
}

function fmtUsd(n: number | undefined): string {
  if (n === undefined || n === null || isNaN(n)) return '—';
  return `$${n.toFixed(2)}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export default function VaultPage() {
  const params = useParams();
  const mint = params.mint as string;
  const [data, setData] = useState<VaultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [pending, setPending] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/vault?mint=${mint}`);
      if (!res.ok) {
        if (res.status === 404) {
          // Check if it's in pending queue
          try {
            const pendingRes = await fetch(`/api/vault/pending?mint=${mint}`);
            if (pendingRes.ok) {
              const pData = await pendingRes.json();
              if (pData.pending) {
                setPending(true);
                setError(null);
                setLoading(false);
                return;
              }
            }
          } catch { /* silent */ }
          setError('Vault not found');
        } else {
          setError('Failed to load vault');
        }
        setLoading(false);
        return;
      }
      setData(await res.json());
      setPending(false);
      setError(null);
    } catch {
      setError('Failed to load vault');
    }
    setLoading(false);
  }, [mint]);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 30000);
    return () => clearInterval(iv);
  }, [fetchData]);

  const handleCopy = () => {
    if (data?.vault.vaultAddress) {
      copyToClipboard(data.vault.vaultAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--fg-dark)', letterSpacing: '0.1em' }}>LOADING VAULT...</div>
      </div>
    );
  }

  if (pending) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: 'var(--accent)', marginBottom: 12 }}>⏳ Vault registration pending</div>
        <p style={{ fontSize: 12, color: 'var(--fg-dim)', maxWidth: 440, margin: '0 auto 16px', lineHeight: 1.7 }}>
          Your vault is being set up. The agent processes new registrations every 15 minutes.
          This page will update automatically when your vault is ready.
        </p>
        <div style={{ fontSize: 10, color: 'var(--fg-dark)', fontFamily: 'monospace', marginBottom: 20 }}>{mint}</div>
        <a href="/" style={{ fontSize: 11, color: 'var(--fg-dim)', textDecoration: 'none' }}>← back to methane</a>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 14, color: 'var(--red)', marginBottom: 12 }}>{error || 'Vault not found'}</div>
        <p style={{ fontSize: 11, color: 'var(--fg-dark)', marginBottom: 16 }}>This token hasn&apos;t been registered with Methane yet.</p>
        <a href="/" style={{ fontSize: 11, color: 'var(--fg-dim)', textDecoration: 'none' }}>← register your token</a>
      </div>
    );
  }

  const v = data.vault;
  const pos = data.position;
  const stats = data.stats;
  const p = pos.active ? pos.positions[0] : null;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
      {/* Nav */}
      <nav style={{ fontSize: 10, borderBottom: '1px solid var(--border)', padding: '16px 0', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ color: 'var(--fg-dim)', textDecoration: 'none', fontSize: 11 }}>← $METHANE</a>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em' }}>{v.tokenSymbol} VAULT</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href={`https://solscan.io/account/${v.vaultAddress}`} target="_blank" rel="noopener"
            style={{ color: 'var(--fg-dim)', fontSize: 10, textDecoration: 'none' }}>
            solscan ↗
          </a>
          <a href="https://lavarage.xyz" target="_blank" rel="noopener"
            style={{ color: 'var(--fg-dim)', fontSize: 10, textDecoration: 'none' }}>
            lavarage ↗
          </a>
        </div>
      </nav>

      {/* Header */}
      <section style={{ padding: '40px 0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontSize: 20, color: 'var(--white)', fontWeight: 700 }}>{v.tokenName}</h1>
          <span style={{ fontSize: 12, color: 'var(--accent)' }}>${v.tokenSymbol}</span>
          <span style={{
            fontSize: 9, letterSpacing: '0.08em', fontWeight: 600, padding: '2px 8px', borderRadius: 2,
            background: v.status === 'active' ? 'rgba(0, 255, 100, 0.1)' : 'rgba(255, 100, 0, 0.1)',
            color: v.status === 'active' ? 'var(--green)' : 'var(--red)',
          }}>
            {v.status.toUpperCase()}
          </span>
        </div>

        {/* Vault address */}
        <div className="panel" style={{ padding: '12px 16px', display: 'inline-flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
          onClick={handleCopy}>
          <div>
            <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 2 }}>VAULT ADDRESS — SEND CREATOR FEES HERE</div>
            <div style={{ fontSize: 13, color: 'var(--white)', fontFamily: 'monospace', letterSpacing: '0.02em' }}>{v.vaultAddress}</div>
          </div>
          <span style={{ fontSize: 10, color: copied ? 'var(--green)' : 'var(--fg-dark)' }}>
            {copied ? '✓ copied' : 'copy'}
          </span>
        </div>

        <div style={{ fontSize: 10, color: 'var(--fg-dark)', marginTop: 8 }}>
          Registered {new Date(v.createdAt).toLocaleDateString()} · {v.leverage}× leverage · {v.splitLongPct}/{v.splitBuybackPct} split
        </div>
      </section>

      <hr className="divider" />

      {/* Position */}
      <div className="section-label" style={{ marginTop: 24 }}><span>POSITION</span></div>

      {pos.active && p ? (
        <section style={{ paddingBottom: 32 }}>
          <div className="panel" style={{ padding: '20px 24px', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="status-dot" />
                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em' }}>LIVE POSITION</span>
                <span style={{ fontSize: 9, color: 'var(--fg-dark)' }}>· lavarage</span>
              </div>
              <span style={{ fontSize: 9, color: 'var(--fg-dark)' }}>auto-refreshes every 30s</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }} className="grid-responsive">
              <Stat label="DIRECTION" value={`${fmt(p.effectiveLeverage, 1)}× LONG`} />
              <Stat label="ENTRY PRICE" value={fmtUsd(p.entryPrice)} />
              <Stat label="CURRENT PRICE" value={fmtUsd(p.currentPrice)} />
              <Stat label="UNREALIZED PnL" value={fmtUsd(p.unrealizedPnl)} color={p.unrealizedPnl >= 0 ? 'var(--green)' : 'var(--red)'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="grid-responsive">
              <Stat label="ROI" value={`${fmt(p.roiPercent, 1)}%`} color={p.roiPercent >= 0 ? 'var(--green)' : 'var(--red)'} />
              <Stat label="LIQUIDATION" value={fmtUsd(p.liquidationPrice)} color="var(--red)" />
              <Stat label="COLLATERAL" value={`${fmt(p.collateral, 4)} SOL`} />
              <Stat label="INTEREST / DAY" value={fmtUsd(p.dailyInterestCost)} color="var(--fg-dim)" />
            </div>
          </div>

          {/* Multiple positions */}
          {pos.count > 1 && (
            <div style={{ fontSize: 10, color: 'var(--fg-dark)', marginBottom: 12 }}>
              Showing primary position. {pos.count} total positions.
            </div>
          )}

          {/* Totals */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="grid-responsive">
            <div className="panel" style={{ padding: '14px 18px' }}>
              <Stat label="TOTAL COLLATERAL" value={`${fmt(pos.totals.collateral, 4)} SOL`} small />
            </div>
            <div className="panel" style={{ padding: '14px 18px' }}>
              <Stat label="TOTAL PnL" value={fmtUsd(pos.totals.pnl)} color={pos.totals.pnl >= 0 ? 'var(--green)' : 'var(--red)'} small />
            </div>
            <div className="panel" style={{ padding: '14px 18px' }}>
              <Stat label="AVG LEVERAGE" value={`${fmt(pos.totals.avgLeverage, 1)}×`} small />
            </div>
          </div>
        </section>
      ) : (
        <section style={{ paddingBottom: 32 }}>
          <div className="panel" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--fg-dim)', marginBottom: 8 }}>No active position yet</div>
            <div style={{ fontSize: 11, color: 'var(--fg-dark)' }}>
              Send creator fees to the vault address above. The agent will open a position on the next cycle (every 15 min).
            </div>
          </div>
        </section>
      )}

      <hr className="divider" />

      {/* Vault Actions */}
      <div className="section-label" style={{ marginTop: 24 }}><span>MANAGE</span></div>

      <section style={{ paddingBottom: 32 }}>
        <VaultActions
          tokenMint={mint}
          vaultCreator={v.creatorWallet || ''}
          hasPosition={pos.active}
          currentPrice={p?.currentPrice}
          entryPrice={p?.entryPrice}
        />
      </section>

      <hr className="divider" />

      {/* Pipeline Stats */}
      <div className="section-label" style={{ marginTop: 24 }}><span>PIPELINE STATS</span></div>

      <section style={{ paddingBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="grid-responsive">
          {[
            { label: 'CYCLES', value: `${stats.cycleCount || 0}` },
            { label: 'TOTAL CLAIMED', value: `${fmt(stats.totalClaimed, 4)} SOL` },
            { label: 'TOTAL NOTIONAL', value: `${fmt(stats.totalNotional, 4)} SOL` },
            { label: 'PENDING BUYBACK', value: `${fmt(stats.pendingBuyback, 4)} SOL` },
          ].map((s, i) => (
            <div key={i} className="panel" style={{ padding: '14px 18px' }}>
              <Stat label={s.label} value={s.value} small />
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* Settings */}
      <div className="section-label" style={{ marginTop: 24 }}><span>SETTINGS</span></div>

      <section style={{ paddingBottom: 32 }}>
        <div className="panel" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="grid-responsive">
            {[
              { label: 'Leverage', value: `${v.leverage}×` },
              { label: 'Fee Split', value: `${v.splitLongPct}% long / ${v.splitBuybackPct}% buyback` },
              { label: 'Venue', value: 'Lavarage (spot leverage)' },
              { label: 'Target Asset', value: 'FART' },
              { label: 'Cycle Interval', value: 'Every 15 minutes' },
              { label: 'Min Claim', value: '0.05 SOL' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--fg-dim)' }}>{s.label}</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Feed */}
      <div className="section-label" style={{ marginTop: 24 }}><span>ACTIVITY</span></div>

      <section style={{ paddingBottom: 32 }}>
        <div className="panel" style={{ padding: 0, overflow: 'hidden' }}>
          <VaultActivity tokenMint={mint} vaultAddress={v.vaultAddress} />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--fg-dark)' }}>
        <span>$METHANE · {v.tokenSymbol} vault · all transactions verifiable on-chain</span>
        <a href="/" style={{ color: 'var(--fg-dim)', textDecoration: 'none' }}>← back to methane</a>
      </footer>
    </div>
  );
}
