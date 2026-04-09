import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 60; // cache 60 seconds

export async function GET() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/fartcoin/market_chart?vs_currency=usd&days=7',
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'CoinGecko API error' }, { status: 502 });
    }

    const data = await res.json();
    const prices = data.prices || [];

    // Also get current price/market data
    const infoRes = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=fartcoin&vs_currencies=usd&include_market_cap=true&include_24hr_change=true&include_24hr_vol=true',
      { next: { revalidate: 60 } }
    );

    let current = { price: 0, market_cap: 0, change_24h: 0, volume_24h: 0 };
    if (infoRes.ok) {
      const infoData = await infoRes.json();
      const fart = infoData.fartcoin || {};
      current = {
        price: fart.usd || 0,
        market_cap: fart.usd_market_cap || 0,
        change_24h: fart.usd_24h_change || 0,
        volume_24h: fart.usd_24h_vol || 0,
      };
    }

    return NextResponse.json({ prices, current });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
