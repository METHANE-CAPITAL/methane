import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const REDIS_URL = process.env.UPSTASH_REDIS_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN || '';
const LAVARAGE_API = 'https://api.lavarage.xyz';
const LAVARAGE_KEY = process.env.LAVARAGE_API_KEY || '';
const FART_MINT = '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump';

async function redisCmd(cmd: string, ...args: string[]) {
  const res = await fetch(`${REDIS_URL}/${cmd}/${args.join('/')}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  return res.json();
}

/**
 * GET /api/vault?mint=<tokenMint>
 * Returns vault info + live Lavarage position data for a specific vault.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get('mint');

  if (!mint) {
    // Return all vaults (public info only)
    try {
      const all = await redisCmd('hgetall', 'methane:vaults');
      if (!all.result || !Array.isArray(all.result)) {
        return NextResponse.json({ vaults: [] });
      }
      const vaults = [];
      for (let i = 0; i < all.result.length; i += 2) {
        const v = JSON.parse(all.result[i + 1]);
        vaults.push({
          tokenMint: v.tokenMint,
          tokenName: v.tokenName,
          tokenSymbol: v.tokenSymbol,
          vaultAddress: v.vaultAddress,
          createdAt: v.createdAt,
          status: v.status,
          leverage: v.leverage,
        });
      }
      return NextResponse.json({ vaults });
    } catch {
      return NextResponse.json({ vaults: [] });
    }
  }

  // Single vault lookup
  try {
    const raw = await redisCmd('hget', 'methane:vaults', mint);
    if (!raw.result) {
      return NextResponse.json({ error: 'Vault not found' }, { status: 404 });
    }

    const vault = JSON.parse(raw.result);

    // Fetch live position from Lavarage
    let positions: any[] = [];
    try {
      const posRes = await fetch(
        `${LAVARAGE_API}/api/v1/positions?owner=${vault.vaultAddress}&status=OPEN`,
        { headers: { 'x-api-key': LAVARAGE_KEY, 'Content-Type': 'application/json' } }
      );
      if (posRes.ok) {
        const allPos = await posRes.json();
        positions = allPos.filter(
          (p: any) => p.offerBaseTokenAddress === FART_MINT || p.baseToken?.address === FART_MINT || p.tradedTokenAddress === FART_MINT
        );
      }
    } catch { /* silent */ }

    // Fetch per-vault stats from Redis
    let stats: Record<string, number> = {};
    try {
      const s = await redisCmd('hgetall', 'methane:stats');
      if (s.result && Array.isArray(s.result)) {
        for (let i = 0; i < s.result.length; i += 2) {
          const key = s.result[i];
          if (key.startsWith(`vault:${mint}:`)) {
            const shortKey = key.replace(`vault:${mint}:`, '');
            stats[shortKey] = Number(s.result[i + 1]);
          }
        }
      }
    } catch { /* silent */ }

    const hasPosition = positions.length > 0;

    return NextResponse.json({
      vault: {
        tokenMint: vault.tokenMint,
        tokenName: vault.tokenName,
        tokenSymbol: vault.tokenSymbol,
        vaultAddress: vault.vaultAddress,
        creatorWallet: vault.creatorWallet,
        createdAt: vault.createdAt,
        status: vault.status,
        leverage: vault.leverage,
        splitLongPct: vault.splitLongPct,
        splitBuybackPct: vault.splitBuybackPct,
      },
      position: hasPosition ? {
        active: true,
        count: positions.length,
        positions: positions.map((p: any) => ({
          address: p.address,
          side: p.side || 'LONG',
          collateral: p.collateralAmount,
          borrowed: p.borrowedAmount,
          entryPrice: p.entryPrice,
          currentPrice: p.currentPrice,
          unrealizedPnl: p.unrealizedPnlUsd,
          roiPercent: p.roiPercent,
          liquidationPrice: p.liquidationPrice,
          effectiveLeverage: p.effectiveLeverage,
          interestAccrued: p.interestAccrued,
          dailyInterestCost: p.dailyInterestCost,
        })),
        totals: {
          collateral: positions.reduce((s: number, p: any) => s + (parseFloat(p.collateralAmount) || 0), 0),
          pnl: positions.reduce((s: number, p: any) => s + (parseFloat(p.unrealizedPnlUsd) || 0), 0),
          avgLeverage: positions.reduce((s: number, p: any) => s + (parseFloat(p.effectiveLeverage) || 0), 0) / positions.length,
        },
      } : {
        active: false,
        count: 0,
        positions: [],
        totals: { collateral: 0, pnl: 0, avgLeverage: 0 },
      },
      stats,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch vault data' }, { status: 500 });
  }
}
