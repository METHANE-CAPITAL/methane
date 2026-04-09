'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface VaultActionsProps {
  tokenMint: string;
  vaultCreator: string;
  hasPosition: boolean;
  currentPrice?: number;
  entryPrice?: number;
}

function ActionButton({ label, onClick, loading, color, disabled }: {
  label: string; onClick: () => void; loading?: boolean; color?: string; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{
        padding: '8px 16px', fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
        background: loading ? 'rgba(255,255,255,0.02)' : `rgba(${color === 'red' ? '196,48,48' : color === 'green' ? '90,170,69' : '255,255,255'},0.06)`,
        border: `1px solid ${color === 'red' ? 'rgba(196,48,48,0.3)' : color === 'green' ? 'rgba(90,170,69,0.3)' : 'var(--border-med)'}`,
        color: loading ? 'var(--fg-dark)' : color === 'red' ? 'var(--red)' : color === 'green' ? 'var(--green)' : 'var(--accent)',
        cursor: loading || disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'all 0.2s',
      }}
    >
      {loading ? 'signing...' : label}
    </button>
  );
}

export default function VaultActions({ tokenMint, vaultCreator, hasPosition, currentPrice, entryPrice }: VaultActionsProps) {
  const { publicKey, signMessage, connected } = useWallet();
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<{ message: string; success: boolean } | null>(null);
  const [tpPrice, setTpPrice] = useState('');
  const [slPrice, setSlPrice] = useState('');
  const [sellPct, setSellPct] = useState('50');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isOwner = connected && publicKey?.toBase58() === vaultCreator;

  const executeAction = useCallback(async (action: string, params: Record<string, any> = {}) => {
    if (!publicKey || !signMessage) return;

    setLoading(action);
    setResult(null);

    try {
      const msg = `methane:action:${tokenMint}:${action}:${Date.now()}`;
      const msgBytes = new TextEncoder().encode(msg);
      const sig = await signMessage(msgBytes);
      const sigB64 = btoa(String.fromCharCode(...sig));

      const res = await fetch('/api/vault/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenMint,
          action,
          params,
          creatorWallet: publicKey.toBase58(),
          signature: sigB64,
          message: msg,
        }),
      });

      const data = await res.json();
      setResult({
        message: data.message || data.error || 'Done',
        success: res.ok,
      });
    } catch (err: any) {
      setResult({ message: err?.message || 'Failed', success: false });
    }

    setLoading(null);
  }, [publicKey, signMessage, tokenMint]);

  return (
    <div>
      {/* Wallet connect / ownership check */}
      {!connected ? (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'var(--fg-dim)', marginBottom: 8 }}>Connect your wallet to manage this vault</div>
          <WalletMultiButton style={{
            fontSize: 11, fontFamily: 'inherit', height: 36, padding: '0 16px',
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-med)',
            borderRadius: 0, color: 'var(--accent)',
          }} />
        </div>
      ) : !isOwner ? (
        <div style={{ padding: '12px 16px', fontSize: 11, color: 'var(--fg-dim)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', marginBottom: 16 }}>
          Connected as <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{publicKey?.toBase58().slice(0, 6)}...</span> — this vault belongs to a different wallet. Connect the creator wallet to manage.
        </div>
      ) : null}

      {/* Quick actions */}
      {isOwner && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {hasPosition && (
              <>
                <ActionButton
                  label="close position"
                  onClick={() => executeAction('close')}
                  loading={loading === 'close'}
                  color="red"
                />
                <ActionButton
                  label={`partial sell (${sellPct}%)`}
                  onClick={() => executeAction('partial-sell', { percent: Number(sellPct) })}
                  loading={loading === 'partial-sell'}
                />
              </>
            )}
            <ActionButton
              label="pause vault"
              onClick={() => executeAction('pause')}
              loading={loading === 'pause'}
            />
            <ActionButton
              label="resume vault"
              onClick={() => executeAction('resume')}
              loading={loading === 'resume'}
              color="green"
            />
          </div>

          {/* Advanced: TP/SL */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              fontSize: 10, color: 'var(--fg-dark)', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', padding: 0,
            }}
          >
            {showAdvanced ? '▾' : '▸'} advanced (TP/SL, partial sell %)
          </button>

          {showAdvanced && (
            <div className="panel" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Partial sell amount */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--fg-dark)', width: 80 }}>Partial sell:</span>
                <select value={sellPct} onChange={e => setSellPct(e.target.value)}
                  style={{ padding: '4px 8px', fontSize: 11, fontFamily: 'inherit', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--fg)', outline: 'none' }}>
                  {['25', '50', '75'].map(v => <option key={v} value={v}>{v}%</option>)}
                </select>
                <span style={{ fontSize: 10, color: 'var(--fg-dark)' }}>of position</span>
              </div>

              {/* Take profit */}
              {hasPosition && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--fg-dark)', width: 80 }}>Take profit:</span>
                  <span style={{ fontSize: 10, color: 'var(--fg-dark)' }}>$</span>
                  <input value={tpPrice} onChange={e => setTpPrice(e.target.value)} placeholder={currentPrice ? (currentPrice * 1.5).toFixed(4) : '0.00'}
                    style={{ width: 100, padding: '4px 8px', fontSize: 11, fontFamily: 'inherit', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--fg)', outline: 'none' }} />
                  <ActionButton
                    label="set TP"
                    onClick={() => executeAction('set-tp', { price: Number(tpPrice) })}
                    loading={loading === 'set-tp'}
                    color="green"
                    disabled={!tpPrice}
                  />
                  <ActionButton
                    label="cancel TP"
                    onClick={() => executeAction('cancel-tp')}
                    loading={loading === 'cancel-tp'}
                  />
                </div>
              )}

              {/* Stop loss */}
              {hasPosition && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--fg-dark)', width: 80 }}>Stop loss:</span>
                  <span style={{ fontSize: 10, color: 'var(--fg-dark)' }}>$</span>
                  <input value={slPrice} onChange={e => setSlPrice(e.target.value)} placeholder={currentPrice ? (currentPrice * 0.7).toFixed(4) : '0.00'}
                    style={{ width: 100, padding: '4px 8px', fontSize: 11, fontFamily: 'inherit', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--fg)', outline: 'none' }} />
                  <ActionButton
                    label="set SL"
                    onClick={() => executeAction('set-sl', { price: Number(slPrice) })}
                    loading={loading === 'set-sl'}
                    color="red"
                    disabled={!slPrice}
                  />
                  <ActionButton
                    label="cancel SL"
                    onClick={() => executeAction('cancel-sl')}
                    loading={loading === 'cancel-sl'}
                  />
                </div>
              )}
            </div>
          )}

          {/* Result feedback */}
          {result && (
            <div style={{
              padding: '8px 12px', fontSize: 11, fontWeight: 600,
              background: result.success ? 'rgba(90,170,69,0.05)' : 'rgba(196,48,48,0.05)',
              border: `1px solid ${result.success ? 'rgba(90,170,69,0.2)' : 'rgba(196,48,48,0.2)'}`,
              color: result.success ? 'var(--green)' : 'var(--red)',
            }}>
              {result.success ? '✓' : '✗'} {result.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
