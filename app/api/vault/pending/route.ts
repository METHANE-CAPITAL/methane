import { NextResponse } from 'next/server';

export const runtime = 'edge';

const REDIS_URL = process.env.UPSTASH_REDIS_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_TOKEN || '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get('mint');

  if (!mint) {
    return NextResponse.json({ error: 'Missing mint' }, { status: 400 });
  }

  try {
    const res = await fetch(`${REDIS_URL}/hget/methane:vault-pending/${mint}`, {
      headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    });
    const data = await res.json();

    if (data.result) {
      const pending = JSON.parse(data.result);
      return NextResponse.json({
        pending: true,
        tokenMint: pending.tokenMint,
        tokenName: pending.tokenName,
        tokenSymbol: pending.tokenSymbol,
        requestedAt: pending.requestedAt,
      });
    }

    return NextResponse.json({ pending: false });
  } catch {
    return NextResponse.json({ pending: false });
  }
}
