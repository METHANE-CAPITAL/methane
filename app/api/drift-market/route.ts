import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=REDACTED_HELIUS_KEY';
const FART_MARKET_INDEX = 71;

let cachedData: {
  data: Record<string, unknown>;
  timestamp: number;
} | null = null;

const CACHE_MS = 15000;

export async function GET() {
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_MS) {
    return NextResponse.json(cachedData.data);
  }

  // Dynamic import to avoid web3.js version conflicts at type-check time
  try {
    const { Connection, Keypair } = await import('@solana/web3.js');
    const {
      BulkAccountLoader,
      DriftClient,
      Wallet,
      convertToNumber,
      PRICE_PRECISION,
      FUNDING_RATE_BUFFER_PRECISION,
      BASE_PRECISION,
    } = await import('@drift-labs/sdk');

    const connection = new Connection(RPC_URL, 'confirmed');
    const wallet = new (Wallet as any)(Keypair.generate());

    const accountLoader = new (BulkAccountLoader as any)(connection, 'confirmed', 30000);

    const driftClient = new DriftClient({
      connection: connection as any,
      wallet: wallet as any,
      env: 'mainnet-beta' as any,
      accountSubscription: {
        type: 'polling',
        accountLoader: accountLoader as any,
      },
      perpMarketIndexes: [FART_MARKET_INDEX],
      spotMarketIndexes: [0],
    });

    await driftClient.subscribe();

    const perpMarket = driftClient.getPerpMarketAccount(FART_MARKET_INDEX);

    if (!perpMarket) {
      await driftClient.unsubscribe();
      return NextResponse.json({ error: 'FART-PERP market not found' }, { status: 404 });
    }

    const markPrice = convertToNumber(
      driftClient.getOracleDataForPerpMarket(FART_MARKET_INDEX).price,
      PRICE_PRECISION
    );

    // lastFundingRate is stored in PRICE_PRECISION (1e6), not BUFFER (1e3)
    const lastFundingRate = convertToNumber(
      perpMarket.amm.lastFundingRate,
      PRICE_PRECISION
    );

    const openInterestBase = convertToNumber(
      perpMarket.amm.baseAssetAmountWithAmm.abs(),
      BASE_PRECISION
    );

    const result = {
      marketIndex: FART_MARKET_INDEX,
      marketName: 'FART-PERP',
      markPrice,
      lastFundingRate,
      fundingRateHourly: lastFundingRate * 100,
      fundingRateAnnualized: lastFundingRate * 24 * 365 * 100,
      openInterestBase,
      openInterestUsd: openInterestBase * markPrice,
      lastFundingTs: perpMarket.amm.lastFundingRateTs?.toNumber() || null,
      source: 'drift-sdk-onchain',
      timestamp: Date.now(),
    };

    cachedData = { data: result, timestamp: Date.now() };
    await driftClient.unsubscribe();
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Drift market fetch error:', err?.message || err);
    return NextResponse.json({
      error: 'Failed to fetch Drift market data',
      detail: err?.message,
    }, { status: 500 });
  }
}
