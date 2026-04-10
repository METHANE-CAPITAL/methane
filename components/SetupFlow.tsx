'use client';

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const FEE_PROGRAM = 'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ';
const RPC = process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com';

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

interface VaultResult {
  vaultAddress?: string;
  pending?: boolean;
  existing?: boolean;
  message?: string;
  vault?: { vaultAddress: string; tokenSymbol: string };
}

export default function SetupFlow() {
  const { publicKey, signMessage, connected } = useWallet();
  const [mint, setMint] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [step, setStep] = useState(1);
  const [mintResult, setMintResult] = useState<{ valid: boolean; message: string; decimals?: number } | null>(null);
  const [feeResult, setFeeResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [validating, setValidating] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [vaultResult, setVaultResult] = useState<VaultResult | null>(null);
  const [leverage, setLeverage] = useState('5');

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

  const doRegister = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setVaultResult({ message: 'Connect your wallet first' });
      return;
    }
    setRegistering(true);
    try {
      // Sign verification message
      const msg = `methane:register:${mint.trim()}:${Date.now()}`;
      const msgBytes = new TextEncoder().encode(msg);
      const sig = await signMessage(msgBytes);
      const sigB64 = btoa(String.fromCharCode(...sig));

      const res = await fetch('/api/vault/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenMint: mint.trim(),
          tokenName: tokenName.trim() || 'Unknown',
          tokenSymbol: tokenSymbol.trim() || 'TKN',
          creatorWallet: publicKey.toBase58(),
          leverage: Number(leverage) || 5,
          signature: sigB64,
          message: msg,
        }),
      });
      const data = await res.json();
      setVaultResult(data);

      if (data.vault?.vaultAddress || data.pending) {
        setStep(3);
      }
    } catch (err: any) {
      setVaultResult({ message: err?.message || 'Registration failed — try again' });
    }
    setRegistering(false);
  }, [mint, tokenName, tokenSymbol, publicKey, signMessage, leverage]);

  const canProceed = mintResult?.valid === true;
  const vaultAddress = vaultResult?.vault?.vaultAddress;

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
              <strong style={{ color: 'var(--accent)' }}>tip:</strong> go to pump.fun → your token → fee sharing. set it up there first, then come back and verify again.
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

      {/* Step 2: Register vault */}
      <StepPanel n={2} title="REGISTER YOUR VAULT" active={step >= 2} done={step > 2}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 12, color: 'var(--fg-dim)' }}>
            Connect your wallet and we&apos;ll create a dedicated vault for your project. Fully isolated from every other project.
          </p>

          {/* Wallet connect */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <WalletMultiButton style={{
              fontSize: 11, fontFamily: 'inherit', height: 36, padding: '0 16px',
              background: connected ? 'rgba(90,170,69,0.1)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${connected ? 'rgba(90,170,69,0.3)' : 'var(--border-med)'}`,
              borderRadius: 0, color: connected ? 'var(--green)' : 'var(--accent)',
            }} />
            {connected && publicKey && (
              <span style={{ fontSize: 10, color: 'var(--fg-dim)', fontFamily: 'monospace' }}>
                {publicKey.toBase58().slice(0, 6)}...{publicKey.toBase58().slice(-4)}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div>
              <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.06em', marginBottom: 4 }}>TOKEN NAME</div>
              <input value={tokenName} onChange={e => setTokenName(e.target.value)} placeholder="e.g. My Token"
                style={{ width: '100%', padding: '8px 12px', fontSize: 12, fontFamily: 'inherit', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--fg)', outline: 'none' }} />
            </div>
            <div>
              <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.06em', marginBottom: 4 }}>SYMBOL</div>
              <input value={tokenSymbol} onChange={e => setTokenSymbol(e.target.value)} placeholder="e.g. TKN"
                style={{ width: '100%', padding: '8px 12px', fontSize: 12, fontFamily: 'inherit', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--fg)', outline: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.06em' }}>LEVERAGE</div>
            <select value={leverage} onChange={e => setLeverage(e.target.value)}
              style={{ padding: '6px 10px', fontSize: 12, fontFamily: 'inherit', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', color: 'var(--fg)', outline: 'none' }}>
              {['2', '3', '5', '7.5'].map(v => (
                <option key={v} value={v}>{v}×</option>
              ))}
            </select>
            <span style={{ fontSize: 10, color: 'var(--fg-dark)' }}>max 7.5× on Lavarage</span>
          </div>

          <button onClick={doRegister} disabled={registering || !connected}
            style={{
              padding: '10px 20px', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', alignSelf: 'flex-start',
              background: registering ? 'rgba(255,255,255,0.03)' : 'rgba(90,170,69,0.1)',
              border: `1px solid ${registering ? 'var(--border)' : 'rgba(90,170,69,0.3)'}`,
              color: registering ? 'var(--fg-dim)' : 'var(--green)', cursor: registering ? 'wait' : 'pointer',
            }}>
            {registering ? 'registering...' : 'create my vault →'}
          </button>

          {vaultResult?.message && !vaultResult.vault && (
            <div style={{ fontSize: 11, color: 'var(--fg-dim)' }}>{vaultResult.message}</div>
          )}
        </div>
      </StepPanel>

      {/* Step 3: Live */}
      <StepPanel n={3} title="YOUR VAULT IS READY" active={step >= 3} done={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {vaultAddress ? (
            <>
              <div style={{ padding: '12px 14px', background: 'rgba(90,170,69,0.04)', border: '1px solid rgba(90,170,69,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span className="status-dot" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>Vault created</span>
                </div>
                <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.06em', marginBottom: 4 }}>YOUR VAULT ADDRESS — POINT FEES HERE</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ fontSize: 12, color: 'var(--white)', wordBreak: 'break-all' }}>{vaultAddress}</code>
                  <CopyButton text={vaultAddress} label="copy" />
                </div>
              </div>

              <div style={{ fontSize: 11, color: 'var(--fg-dim)' }}>
                <strong style={{ color: 'var(--accent)' }}>next steps:</strong>
                <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div>1. Go to pump.fun → your token → fee sharing</div>
                  <div>2. Add <span style={{ color: 'var(--white)', fontFamily: 'monospace' }}>{vaultAddress.slice(0, 8)}...{vaultAddress.slice(-4)}</span> as recipient</div>
                  <div>3. Set the share percentage (we recommend 50-100%)</div>
                  <div>4. Done — the agent will start processing on the next cycle</div>
                </div>
              </div>

              <a href={`/vault/${mint}`}
                style={{
                  display: 'inline-block', padding: '10px 20px', fontSize: 11, fontWeight: 700, textDecoration: 'none',
                  background: 'rgba(90,170,69,0.1)', border: '1px solid rgba(90,170,69,0.3)', color: 'var(--green)',
                }}>
                go to your vault dashboard →
              </a>
            </>
          ) : vaultResult?.pending ? (
            <div style={{ padding: '12px 14px', background: 'rgba(255,200,0,0.04)', border: '1px solid rgba(255,200,0,0.2)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 6 }}>Registration queued</div>
              <p style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
                Your vault will be ready within 15 minutes (next agent cycle). Come back and check your vault dashboard at:
              </p>
              <a href={`/vault/${mint}`} style={{ fontSize: 11, color: 'var(--accent)', marginTop: 6, display: 'inline-block' }}>
                /vault/{mint.slice(0, 8)}... →
              </a>
            </div>
          ) : (
            <div style={{ fontSize: 11, color: 'var(--fg-dim)' }}>Setting up your vault...</div>
          )}
        </div>
      </StepPanel>
    </div>
  );
}
