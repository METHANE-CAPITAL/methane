import { NextResponse } from 'next/server';

export const runtime = 'edge';

const REDIS_URL = process.env.UPSTASH_REDIS_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN || '';

async function redisPost(body: any[]) {
  const res = await fetch(`${REDIS_URL}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function redisGet(cmd: string, ...args: string[]) {
  const res = await fetch(`${REDIS_URL}/${cmd}/${args.join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  return res.json();
}

/**
 * Verify an Ed25519 signature on edge runtime using SubtleCrypto.
 * Solana wallets sign with Ed25519 — we verify the signature matches the claimed wallet.
 */
async function verifySignature(message: string, signatureB64: string, publicKeyB58: string): Promise<boolean> {
  try {
    // Decode base58 public key
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    function decodeB58(str: string): Uint8Array {
      const bytes: number[] = [];
      for (const c of str) {
        let carry = ALPHABET.indexOf(c);
        if (carry < 0) throw new Error('Invalid base58');
        for (let i = 0; i < bytes.length; i++) {
          carry += bytes[i] * 58;
          bytes[i] = carry & 0xff;
          carry >>= 8;
        }
        while (carry > 0) {
          bytes.push(carry & 0xff);
          carry >>= 8;
        }
      }
      for (const c of str) {
        if (c !== '1') break;
        bytes.push(0);
      }
      return new Uint8Array(bytes.reverse());
    }

    const pubKeyBytes = decodeB58(publicKeyB58);
    const sigBytes = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));
    const msgBytes = new TextEncoder().encode(message);

    // Import Ed25519 public key
    const key = await crypto.subtle.importKey(
      'raw',
      new Uint8Array(pubKeyBytes) as unknown as BufferSource,
      { name: 'Ed25519' },
      false,
      ['verify']
    );

    return await crypto.subtle.verify(
      'Ed25519',
      key,
      new Uint8Array(sigBytes) as unknown as BufferSource,
      new Uint8Array(msgBytes) as unknown as BufferSource
    );
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}

/**
 * POST /api/vault/register
 *
 * Body: {
 *   tokenMint: string,
 *   tokenName: string,
 *   tokenSymbol: string,
 *   creatorWallet: string,
 *   leverage?: number,
 *   signature: string (base64),
 *   message: string (the signed message)
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tokenMint, tokenName, tokenSymbol, creatorWallet, leverage, signature, message } = body;

    if (!tokenMint || !creatorWallet) {
      return NextResponse.json({ error: 'Missing tokenMint or creatorWallet' }, { status: 400 });
    }

    // Verify wallet signature
    if (!signature || !message) {
      return NextResponse.json({ error: 'Wallet signature required. Connect your wallet and sign the verification message.' }, { status: 401 });
    }

    // Verify the signed message contains the expected content
    const expectedPrefix = `methane:register:${tokenMint}:`;
    if (!message.startsWith(expectedPrefix)) {
      return NextResponse.json({ error: 'Invalid signed message format' }, { status: 400 });
    }

    const verified = await verifySignature(message, signature, creatorWallet);
    if (!verified) {
      return NextResponse.json({ error: 'Invalid signature — could not verify wallet ownership' }, { status: 401 });
    }

    // Check if already registered
    const existing = await redisGet('hget', 'methane:vaults', tokenMint);
    if (existing.result) {
      const vault = JSON.parse(existing.result);
      return NextResponse.json({
        vault: {
          tokenMint: vault.tokenMint,
          tokenName: vault.tokenName,
          tokenSymbol: vault.tokenSymbol,
          vaultAddress: vault.vaultAddress,
          status: vault.status,
          leverage: vault.leverage,
        },
        message: 'Vault already registered',
        existing: true,
      });
    }

    // Queue registration for agent to process
    const pending = {
      tokenMint,
      tokenName: tokenName || 'Unknown',
      tokenSymbol: tokenSymbol || 'TKN',
      creatorWallet,
      leverage: Math.min(Math.max(Number(leverage) || 5, 1.1), 7.5), // clamp to Lavarage limits
      requestedAt: Date.now(),
      status: 'pending',
    };

    await redisPost(['HSET', 'methane:vault-pending', tokenMint, JSON.stringify(pending)]);

    return NextResponse.json({
      message: 'Registration queued. Your vault will be ready within 15 minutes.',
      pending: true,
      tokenMint,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
