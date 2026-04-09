import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || '',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit') || 50), 100);

  try {
    // Fetch tx logs from Redis (written by methane-agent)
    const logs = await redis.lrange('methane:txlog', 0, limit - 1);
    const stats = await redis.hgetall('methane:stats') || {};

    return NextResponse.json({
      logs: logs.map((l: any) => typeof l === 'string' ? JSON.parse(l) : l),
      stats: Object.fromEntries(
        Object.entries(stats).map(([k, v]) => [k, Number(v)])
      ),
      source: 'upstash-redis',
    });
  } catch (err: any) {
    // Return empty if Redis not configured yet
    return NextResponse.json({
      logs: [],
      stats: {},
      source: 'none',
      message: 'Agent not yet running — logs will appear after launch',
    });
  }
}
