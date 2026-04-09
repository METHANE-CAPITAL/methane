import { NextResponse } from 'next/server';

export const runtime = 'edge';

const LAVARAGE_API = 'https://api.lavarage.xyz';
const LAVARAGE_KEY = 'REDACTED_LAVARAGE_KEY';
const AGENT_WALLET = 'FXf5jhkD7HoyrRrbtWfN29YZGVTQDnDSqaQVdZfQ6TKd';
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

export async function GET() {
  try {
    // Pull live position data from Lavarage
    const posRes = await fetch(
      `${LAVARAGE_API}/api/v1/positions?owner=${AGENT_WALLET}&status=EXECUTED`,
      { headers: { 'x-api-key': LAVARAGE_KEY, 'Content-Type': 'application/json' } }
    );

    let positions: any[] = [];
    let fartPositions: any[] = [];

    if (posRes.ok) {
      positions = await posRes.json();
      fartPositions = positions.filter(
        (p: any) => p.baseToken?.address === FART_MINT || p.tradedTokenAddress === FART_MINT
      );
    }

    // Pull pipeline stats from Redis
    const stats = await redisHGetAll('methane:stats');

    const hasPosition = fartPositions.length > 0;

    // Build position summary
    const positionData = hasPosition ? {
      hasPosition: true,
      count: fartPositions.length,
      positions: fartPositions.map((p: any) => ({
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
        baseToken: p.baseToken?.symbol,
        quoteToken: p.quoteToken?.symbol,
      })),
      totals: {
        collateral: fartPositions.reduce((s: number, p: any) => s + (parseFloat(p.collateralAmount) || 0), 0),
        pnl: fartPositions.reduce((s: number, p: any) => s + (parseFloat(p.unrealizedPnlUsd) || 0), 0),
        avgLeverage: fartPositions.reduce((s: number, p: any) => s + (parseFloat(p.effectiveLeverage) || 0), 0) / fartPositions.length,
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
