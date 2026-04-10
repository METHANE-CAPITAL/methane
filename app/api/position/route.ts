import { NextResponse } from 'next/server';

export const runtime = 'edge';

const LAVARAGE_API = 'https://api.lavarage.xyz';
const LAVARAGE_KEY = process.env.LAVARAGE_API_KEY || '';
const AGENT_WALLET = '2i1i4UJBWKu9Uc35nM6M5FBdvEoHuKQS3TdngfnR6qxw';
const FART_MINT = '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump';

const REDIS_URL = process.env.UPSTASH_REDIS_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN || '';

async function redisHGetAll(key: string) {
  if (!REDIS_URL || !REDIS_TOKEN) return {};
  try {
    const res = await fetch(`${REDIS_URL}/hgetall/${key}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    });
    const data = await res.json();
    if (!data.result || !Array.isArray(data.result)) return {};
    const obj: Record<string, string> = {};
    for (let i = 0; i < data.result.length; i += 2) {
      obj[data.result[i]] = data.result[i + 1];
    }
    return obj;
  } catch { return {}; }
}

async function redisGet(key: string): Promise<string | null> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(`${REDIS_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    });
    const data = await res.json();
    return data.result || null;
  } catch { return null; }
}

export async function GET() {
  try {
    // Pull live position data from Lavarage
    const posRes = await fetch(
      `${LAVARAGE_API}/api/v1/positions?owner=${AGENT_WALLET}&status=OPEN`,
      { headers: { 'x-api-key': LAVARAGE_KEY, 'Content-Type': 'application/json' } }
    );

    let positions: any[] = [];
    let fartPositions: any[] = [];

    if (posRes.ok) {
      positions = await posRes.json();
      fartPositions = positions.filter(
        (p: any) => p.offerBaseTokenAddress === FART_MINT || p.baseToken?.address === FART_MINT || p.tradedTokenAddress === FART_MINT
      );
    }

    // Pull pipeline stats from Redis
    const stats = await redisHGetAll('methane:stats');

    const hasPosition = fartPositions.length > 0;

    // Look up open-tx mapping for each active position from Redis.
    // The agent writes `methane:position:<address>:openTx -> <sig>` when
    // it opens a new position, so the UI shows verifiable Solscan links
    // without any hardcoded map.
    const openTxMap: Record<string, string> = {};
    if (hasPosition) {
      await Promise.all(
        fartPositions.map(async (p: any) => {
          const sig = await redisGet(`methane:position:${p.address}:openTx`);
          if (sig) openTxMap[p.address] = sig;
        }),
      );
    }

    // Build position summary
    const positionData = hasPosition ? {
      hasPosition: true,
      count: fartPositions.length,
      positions: fartPositions.map((p: any) => {
        // Lavarage returns some numeric fields as strings. Coerce everything
        // numeric to Number() so the UI can call .toFixed() safely. A single
        // string field (e.g. entryPrice) was crashing the whole React tree.
        const num = (v: any) => {
          const n = Number(v);
          return Number.isFinite(n) ? n : 0;
        };
        return {
          address: p.address,
          openTx: openTxMap[p.address] || null,
          side: p.side || 'LONG',
          collateral: num(p.collateralHuman ?? parseInt(p.collateralAmount) / 1e9),
          collateralUsd: num(p.collateralValueUsd),
          borrowed: num(p.borrowedAmount),
          entryPrice: num(p.entryPrice),
          currentPrice: num(p.currentPrice),
          unrealizedPnl: num(p.unrealizedPnlUsd),
          roiPercent: num(p.roiPercent),
          liquidationPrice: num(p.liquidationPrice),
          effectiveLeverage: num(p.effectiveLeverage),
          interestAccrued: num(p.interestAccrued),
          dailyInterestCost: num(p.dailyInterestCost),
          interestRate: num(p.interestRate),
          positionSize: num(p.positionSizeHuman),
          baseToken: p.baseTokenSymbol,
          quoteToken: p.quoteTokenSymbol,
          currentLtv: num(p.currentLtv),
          liquidationLtv: num(p.liquidationLtv),
        };
      }),
      totals: {
        collateral: fartPositions.reduce((s: number, p: any) => s + (Number(p.collateralHuman) || parseInt(p.collateralAmount) / 1e9 || 0), 0),
        pnl: fartPositions.reduce((s: number, p: any) => s + (Number(p.unrealizedPnlUsd) || 0), 0),
        avgLeverage: fartPositions.reduce((s: number, p: any) => s + (Number(p.effectiveLeverage) || 0), 0) / fartPositions.length,
      },
    } : {
      hasPosition: false,
      count: 0,
      positions: [],
      totals: { collateral: 0, pnl: 0, avgLeverage: 0 },
    };

    return NextResponse.json({
      live: hasPosition,
      venue: 'lavarage',
      agentWallet: AGENT_WALLET,
      position: positionData,
      stats: {
        totalClaimed: Number(stats.totalClaimedSol || 0),
        totalLongNotional: Number(stats.totalLongNotional || 0),
        cycleCount: Number(stats.cycleCount || 0),
        pendingBuyback: Number(stats.pendingBuybackSol || 0),
        totalBurned: Number(stats.totalBurned || 0),
        burnCount: Number(stats.burnCount || 0),
        longCount: Number(stats.longCount || 0),
      },
      message: hasPosition ? 'Position active on Lavarage' : 'Launching soon — position not yet active',
    });
  } catch (err: any) {
    return NextResponse.json({
      live: false,
      venue: 'lavarage',
      agentWallet: AGENT_WALLET,
      position: { hasPosition: false, count: 0, positions: [], totals: { collateral: 0, pnl: 0, avgLeverage: 0 } },
      stats: {},
      message: 'Error fetching position data',
    });
  }
}
