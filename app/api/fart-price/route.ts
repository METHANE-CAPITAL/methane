import { NextResponse } from 'next/server';

export const runtime = 'edge';

const PYTH_FEED_ID = '58cd29ef0e714c5affc44f269b2c1899a52da4169d7acc147b9da692e6953608';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'candles'; // candles | live

  try {
    if (type === 'live') {
      // Real-time price from Pyth Hermes
      const res = await fetch(
        `https://hermes.pyth.network/api/latest_price_feeds?ids[]=0x${PYTH_FEED_ID}`,
        { cache: 'no-store' }
      );
      if (!res.ok) throw new Error('Pyth Hermes error');
      const data = await res.json();
      const feed = data[0];
      const price = Number(feed.price.price) * Math.pow(10, feed.price.expo);
      const conf = Number(feed.price.conf) * Math.pow(10, feed.price.expo);
      const emaPrice = Number(feed.ema_price.price) * Math.pow(10, feed.ema_price.expo);
      const publishTime = feed.price.publish_time;

      return NextResponse.json({
        price,
        confidence: conf,
        emaPrice,
        publishTime,
        source: 'pyth-hermes',
      });
    }

    // Historical candles from Pyth Benchmarks (TradingView shim)
    const resolution = searchParams.get('resolution') || '60'; // minutes
    const now = Math.floor(Date.now() / 1000);
    const from = searchParams.get('from') || String(now - 86400); // default 24h
    const to = searchParams.get('to') || String(now);

    const res = await fetch(
      `https://benchmarks.pyth.network/v1/shims/tradingview/history?symbol=Crypto.FARTCOIN/USD&resolution=${resolution}&from=${from}&to=${to}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error('Pyth Benchmarks error');
    const data = await res.json();

    if (data.s !== 'ok') {
      return NextResponse.json({ error: 'No candle data', raw: data }, { status: 404 });
    }

    // Transform OHLCV arrays into candle objects
    const candles = data.t.map((time: number, i: number) => ({
      time,
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
      volume: data.v[i],
    }));

    return NextResponse.json({
      candles,
      source: 'pyth-benchmarks',
      resolution,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch price data' }, { status: 500 });
  }
}
