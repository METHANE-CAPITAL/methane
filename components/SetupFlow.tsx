'use client';

import { useState, useCallback } from 'react';

const AGENT_WALLET = 'FXf5jhkD7HoyrRrbtWfN29YZGVTQDnDSqaQVdZfQ6TKd';
const FEE_PROGRAM = 'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ';
const RPC = 'https://mainnet.helius-rpc.com/?api-key=REDACTED_HELIUS_KEY';

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px',
        fontSize: 11, fontFamily: 'inherit',
        background: copied ? 'rgba(90,170,69,0.1)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${copied ? 'rgba(90,170,69,0.3)' : 'var(--border)'}`,
        color: copied ? 'var(--green)' : 'var(--fg-dim)', cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {label || text} {copied ? '✓' : '⧉'}
    </button>
  );
}

function StatusBadge({ valid, message }: { valid: boolean | null; message: string }) {
  if (valid === null) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', fontSize: 11,
      background: valid ? 'rgba(90,170,69,0.05)' : 'rgba(196,48,48,0.05)',
      border: `1px solid ${valid ? 'rgba(90,170,69,0.2)' : 'rgba(196,48,48,0.2)'}`,
      color: valid ? 'var(--green)' : 'var(--red)', fontWeight: 600,
    }}>
      {valid ? '✓' : '✗'} {message}
    </div>
  );
}

function StepPanel({ n, title, active, done, children }: {
  n: number; title: string; active: boolean; done: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: 'var(--bg-panel)',
      border: `1px solid ${done ? 'rgba(90,170,69,0.3)' : active ? 'var(--border-med)' : 'var(--border)'}`,
      opacity: active || done ? 1 : 0.4,
      transition: 'all 0.3s',
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${done ? 'rgba(90,170,69,0.15)' : 'var(--border)'}`,
        background: done ? 'rgba(90,170,69,0.03)' : active ? 'rgba(255,255,255,0.01)' : 'transparent',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{
          width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700,
          background: done ? 'var(--green)' : active ? 'rgba(255,255,255,0.08)' : 'transparent',
          color: done ? 'var(--bg)' : active ? 'var(--accent)' : 'var(--fg-dark)',
          border: done ? 'none' : `1px solid ${active ? 'var(--border-med)' : 'var(--border)'}`,
        }}>
          {done ? '✓' : n}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: done ? 'var(--green)' : active ? 'var(--accent)' : 'var(--fg-dark)' }}>
          {title}
        </span>
      </div>
      {(active || done) && (
        <div style={{ padding: '16px' }}>{children}</div>
      )}
    </div>
  );
}

async function validateMint(mint: string) {
  try {
    const res = await fetch(RPC, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getAccountInfo', params: [mint, { encoding: 'jsonParsed' }] }),
    });
    const data = await res.json();
    if (!data.result?.value) return { valid: false, message: 'account not found — check the address' };
    const owner = data.result.value.owner;
    if (owner === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' || owner === 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb') {
      const parsed = data.result.value.data?.parsed;
      const decimals = parsed?.info?.decimals;
      return { valid: true, message: `valid SPL token (decimals: ${decimals})`, decimals };
    }
    return { valid: false, message: 'valid account but not an SPL token mint' };
  } catch {
    return { valid: false, message: 'RPC error — try again' };
  }
}

async function checkFeeSharing(mint: string) {
  try {
    const res = await fetch(RPC, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'getProgramAccounts',
        params: [FEE_PROGRAM, { encoding: 'base64', filters: [{ memcmp: { offset: 8, bytes: mint } }], dataSlice: { offset: 0, length: 100 } }],
      }),
    });
    const data = await res.json();
    if (data.result?.length > 0) return { valid: true, message: 'fee sharing is active' };
    return { valid: false, message: 'no fee sharing config — set it up on pump.fun first' };
  } catch {
    return { valid: false, message: 'RPC error — try again' };
  }
}

export default function SetupFlow() {
  const [mint, setMint] = useState('');
  const [step, setStep] = useState(1);
  const [mintResult, setMintResult] = useState<{ valid: boolean; message: string; decimals?: number } | null>(null);
  const [feeResult, setFeeResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [validating, setValidating] = useState(false);
  const [pct, setPct] = useState('100');

  const doValidate = useCallback(async () => {
    if (!mint.trim() || mint.trim().length < 32) {
      setMintResult({ valid: false, message: 'enter a valid base58 address' });
      return;
    }
    setValidating(true);
    setMintResult(null);
    setFeeResult(null);
    const mr = await validateMint(mint.trim());
    setMintResult(mr);
    if (mr.valid) {
      const fr = await checkFeeSharing(mint.trim());
      setFeeResult(fr);
    }
    setValidating(false);
  }, [mint]);

  const canProceed = mintResult?.valid === true;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Step 1: Verify token */}
      <StepPanel n={1} title="VERIFY YOUR TOKEN" active={step >= 1} done={step > 1}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 12, color: 'var(--fg-dim)' }}>
            Paste your token&apos;s mint address. We&apos;ll verify it on-chain and check if fee sharing is configured.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={mint}
              onChange={e => { setMint(e.target.value); setMintResult(null); setFeeResult(null); }}
              placeholder="token mint address..."
              style={{
                flex: 1, padding: '8px 12px', fontSize: 12, fontFamily: 'inherit',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${mintResult === null ? 'var(--border)' : mintResult.valid ? 'rgba(90,170,69,0.4)' : 'rgba(196,48,48,0.4)'}`,
                color: 'var(--fg)', outline: 'none',
              }}
            />
            <button
              onClick={doValidate}
              disabled={validating}
              style={{
                padding: '8px 16px', fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
                background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-med)',
                color: 'var(--accent)', cursor: validating ? 'wait' : 'pointer',
                opacity: validating ? 0.6 : 1,
              }}
            >
              {validating ? 'checking...' : 'verify'}
            </button>
          </div>
          {mintResult && <StatusBadge valid={mintResult.valid} message={mintResult.message} />}
          {feeResult && <StatusBadge valid={feeResult.valid} message={feeResult.message} />}
          {feeResult && !feeResult.valid && (
            <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--fg-dim)', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
              <strong style={{ color: 'var(--accent)' }}>tip:</strong> go to pump.fun → your token → fee sharing. add the agent wallet as a recipient, then come back and verify again.
            </div>
          )}
          {canProceed && (
            <button onClick={() => setStep(2)} style={{
              padding: '8px 16px', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', alignSelf: 'flex-start',
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-med)',
              color: 'var(--accent)', cursor: 'pointer',
            }}>
              next →
            </button>
          )}
        </div>
      </StepPanel>

      {/* Step 2: Configure routing */}
      <StepPanel n={2} title="CONFIGURE FEE ROUTING" active={step >= 2} done={step > 2}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 12, color: 'var(--fg-dim)' }}>
            Set what percentage of creator fees to route to the shared FART vault. The rest stays in your wallet.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--fg-dark)' }}>agent wallet:</span>
              <CopyButton text={AGENT_WALLET} label={AGENT_WALLET.slice(0, 8) + '...' + AGENT_WALLET.slice(-4)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--fg-dark)' }}>fee routing:</span>
              <input
                value={pct} onChange={e => setPct(e.target.value)}
                style={{
                  width: 60, padding: '6px 10px', fontSize: 12, fontFamily: 'inherit', textAlign: 'right',
                  background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--fg)', outline: 'none',
                }}
              />
              <span style={{ fontSize: 11, color: 'var(--fg-dark)' }}>% → FART vault</span>
            </div>
          </div>

          <div style={{ fontSize: 11, color: 'var(--fg-dark)', marginTop: 4 }}>
            <div>› add the agent wallet as a fee-sharing recipient on pump.fun</div>
            <div>› set the share percentage to <span style={{ color: 'var(--accent)' }}>{pct}%</span></div>
            <div>› the agent will auto-claim and open a leveraged FART long on Lavarage</div>
          </div>

          <button onClick={() => setStep(3)} style={{
            padding: '8px 16px', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', alignSelf: 'flex-start',
            background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-med)',
            color: 'var(--accent)', cursor: 'pointer',
          }}>
            next →
          </button>
        </div>
      </StepPanel>

      {/* Step 3: Live */}
      <StepPanel n={3} title="YOU'RE LIVE" active={step >= 3} done={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ padding: '12px 14px', background: 'rgba(90,170,69,0.04)', border: '1px solid rgba(90,170,69,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span className="status-dot" />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>Pipeline active</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
              The agent is monitoring your creator wallet. When fees accumulate above 0.05 SOL, it will auto-claim → deposit SOL collateral → open 5× FART long on Lavarage.
            </p>
          </div>

          <div style={{ fontSize: 11, color: 'var(--fg-dim)' }}>
            <strong style={{ color: 'var(--accent)' }}>what happens next:</strong>
            <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div>→ fees claimed every 15 min</div>
              <div>→ 70% → FART long, 30% → buyback + burn</div>
              <div>→ your PnL shown on the live dashboard</div>
              <div>→ embed the widget on your site (coming soon)</div>
            </div>
          </div>

          {mint && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              <a href={`https://solscan.io/token/${mint}`} target="_blank" rel="noopener"
                style={{ fontSize: 10, padding: '5px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--fg-dim)', textDecoration: 'none' }}>
                solscan ↗
              </a>
              <a href={`https://dexscreener.com/solana/${mint}`} target="_blank" rel="noopener"
                style={{ fontSize: 10, padding: '5px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--fg-dim)', textDecoration: 'none' }}>
                dexscreener ↗
              </a>
              <a href={`https://solscan.io/account/${AGENT_WALLET}`} target="_blank" rel="noopener"
                style={{ fontSize: 10, padding: '5px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--fg-dim)', textDecoration: 'none' }}>
                agent wallet ↗
              </a>
            </div>
          )}
        </div>
      </StepPanel>
    </div>
  );
}
