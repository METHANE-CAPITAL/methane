import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const runtime = 'edge';

const REDIS_URL = process.env.UPSTASH_REDIS_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN || '';
const VAULT_MASTER_SEED = process.env.VAULT_MASTER_SEED || '';

async function redisCmd(method: string, body: any[]) {
  const res = await fetch(`${REDIS_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json',
    },
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
 * Derive vault public address deterministically.
 * This ONLY derives the public key — no secret key leaves the server.
 * The actual keypair is only materialized in the agent process.
 *
 * For the site, we use the same derivation to show the deposit address.
 */
function deriveVaultAddress(masterSeed: string, tokenMint: string): string {
  // We need Ed25519 key derivation. Since edge runtime doesn't have Node crypto,
  // we use SubtleCrypto to hash, then derive a deterministic "address" that
  // matches what the agent derives.
  //
  // IMPORTANT: The actual keypair derivation happens in the agent (Node.js).
  // Here we just compute the same hash to get the public key.
  // This is a simplified version — in production the agent pre-registers
  // the vault address in Redis, and the site just reads it.
  //
  // For now: we call the agent's registration endpoint or pre-derive.
  // Since we can't do Ed25519 from seed in edge runtime, the flow is:
  // 1. Site sends registration request
  // 2. Agent (or a serverless function with Node runtime) derives the keypair
  // 3. Stores vault info (with public address) in Redis
  // 4. Site reads from Redis
  //
  // This route triggers the registration. The vault address comes from Redis
  // after the agent processes it.
  return ''; // placeholder — actual address comes from agent
}

/**
 * POST /api/vault/register
 * Register a new vault for a token.
 *
 * Body: { tokenMint, tokenName, tokenSymbol, creatorWallet, signature }
 * signature = signed message proving creator wallet ownership
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tokenMint, tokenName, tokenSymbol, creatorWallet, leverage } = body;

    if (!tokenMint || !creatorWallet) {
      return NextResponse.json({ error: 'Missing tokenMint or creatorWallet' }, { status: 400 });
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

    // Queue registration — store as pending, agent picks it up and derives keypair
    const pending = {
      tokenMint,
      tokenName: tokenName || 'Unknown',
      tokenSymbol: tokenSymbol || 'TKN',
      creatorWallet,
      leverage: leverage || 5,
      requestedAt: Date.now(),
      status: 'pending',
    };

    // Store in pending queue
    await redisCmd('POST', ['HSET', 'methane:vault-pending', tokenMint, JSON.stringify(pending)]);

    return NextResponse.json({
      message: 'Registration queued. Your vault will be ready within 15 minutes (next agent cycle).',
      pending: true,
      tokenMint,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
