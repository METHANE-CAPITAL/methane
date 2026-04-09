import { NextResponse } from 'next/server';

export const runtime = 'edge';

const REDIS_URL = process.env.UPSTASH_REDIS_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN || '';
const AGENT_WALLET = 'FXf5jhkD7HoyrRrbtWfN29YZGVTQDnDSqaQVdZfQ6TKd';

async function redisGet(key: string) {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(`${REDIS_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    });
    const data = await res.json();
    return data.result;
  } catch { return null; }
}

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
    // Pull stats from agent's Redis
    const stats = await redisHGetAll('methane:stats');

    const totalClaimed = Number(stats.totalClaimedSol || 0);
    const totalSwapped = Number(stats.totalSwappedUsdc || 0);
    const totalDeposited = Number(stats.totalDepositedUsdc || 0);
    const totalLongNotional = Number(stats.totalLongNotional || 0);
    const cycleCount = Number(stats.cycleCount || 0);
    const pendingBuyback = Number(stats.pendingBuybackSol || 0);
    const totalBurned = Number(stats.totalBurned || 0);
    const burnCount = Number(stats.burnCount || 0);
    const longCount = Number(stats.longCount || 0);
    const depositCount = Number(stats.depositCount || 0);

    const isLive = cycleCount > 0;

    return NextResponse.json({
      live: isLive,
      agentWallet: AGENT_WALLET,
      stats: {
        totalClaimed,
        totalSwapped,
        totalDeposited,
        totalLongNotional,
        cycleCount,
        pendingBuyback,
        totalBurned,
        burnCount,
        longCount,
        depositCount,
      },
      // Position data comes from agent's getPositionData() written to Redis
      // TODO: agent writes position snapshot to methane:position each cycle
      position: {
        marketIndex: 71,
        marketName: 'FART-PERP',
        direction: 'LONG',
        leverage: 5,
      },
      message: isLive ? 'Pipeline active' : 'Launching soon — position not yet active',
    });
  } catch (err: any) {
    return NextResponse.json({
      live: false,
      agentWallet: AGENT_WALLET,
      stats: {},
      position: { marketIndex: 71, marketName: 'FART-PERP', direction: 'LONG', leverage: 5 },
      message: 'Error fetching position data',
    });
  }
}
