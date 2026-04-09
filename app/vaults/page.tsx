'use client';

import { useEffect, useState } from 'react';
import Nav from '@/components/Nav';

interface VaultSummary {
  tokenMint: string;
  tokenName: string;
  tokenSymbol: string;
  vaultAddress: string;
  createdAt: number;
  status: string;
  leverage: number;
}

export default function VaultsPage() {
  const [vaults, setVaults] = useState<VaultSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/vault');
        if (res.ok) {
          const data = await res.json();
          setVaults(data.vaults || []);
        }
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, []);

  const active = vaults.filter(v => v.status === 'active');
  const paused = vaults.filter(v => v.status === 'paused');

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
      <Nav />

      {/* Header */}
      <section style={{ padding: '40px 0 32px' }}>
        <h1 style={{ fontSize: 20, color: 'var(--white)', fontWeight: 700, marginBottom: 8 }}>Active Vaults</h1>
        <p style={{ fontSize: 12, color: 'var(--fg-dark)', maxWidth: 560 }}>
          Every project plugged into Methane. Each vault is isolated — its own wallet, its own position, its own PnL. 
          More vaults = more FART buy pressure = everyone benefits.
        </p>
      </section>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }} className="grid-responsive">
        <div className="panel" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 3 }}>TOTAL VAULTS</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent)' }}>{loading ? '...' : vaults.length}</div>
        </div>
        <div className="panel" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 3 }}>ACTIVE</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--green)' }}>{loading ? '...' : active.length}</div>
        </div>
        <div className="panel" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 3 }}>PAUSED</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--fg-dim)' }}>{loading ? '...' : paused.length}</div>
        </div>
      </div>

      {/* Vault list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, fontSize: 11, color: 'var(--fg-dark)' }}>Loading vaults...</div>
      ) : vaults.length === 0 ? (
        <div className="panel" style={{ padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--fg-dim)', marginBottom: 8 }}>No vaults yet</div>
          <div style={{ fontSize: 11, color: 'var(--fg-dark)', marginBottom: 16 }}>Be the first to plug in your token.</div>
          <a href="/#plug-in" style={{
            display: 'inline-block', padding: '8px 20px', fontSize: 11, fontWeight: 700, textDecoration: 'none',
            background: 'rgba(90,170,69,0.1)', border: '1px solid rgba(90,170,69,0.3)', color: 'var(--green)',
          }}>
            register your token →
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {vaults
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((v) => (
            <a key={v.tokenMint} href={`/vault/${v.tokenMint}`}
              style={{ textDecoration: 'none', display: 'block' }}>
              <div className="panel" style={{
                padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-med)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: v.status === 'active' ? 'var(--green)' : 'var(--fg-dark)',
                    boxShadow: v.status === 'active' ? '0 0 6px rgba(90,170,69,0.5)' : 'none',
                  }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 13, color: 'var(--white)', fontWeight: 700 }}>{v.tokenName}</span>
                      <span style={{ fontSize: 11, color: 'var(--accent)' }}>${v.tokenSymbol}</span>
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--fg-dark)', marginTop: 2, fontFamily: 'monospace' }}>
                      vault: {v.vaultAddress.slice(0, 8)}...{v.vaultAddress.slice(-4)}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>{v.leverage}× leverage</div>
                    <div style={{ fontSize: 9, color: 'var(--fg-dark)' }}>
                      {new Date(v.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--fg-dark)' }}>→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 0', marginTop: 40, display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--fg-dark)' }}>
        <span>$METHANE · all vaults on-chain verifiable</span>
        <a href="/" style={{ color: 'var(--fg-dim)', textDecoration: 'none' }}>← back to methane</a>
      </footer>
    </div>
  );
}
