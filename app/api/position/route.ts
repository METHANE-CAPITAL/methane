import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Agent wallet — will be set once deployed
const AGENT_WALLET = 'TBD';

// Until the position exists, return mock data with clear "mock" flag
// Once live, this will query Drift SDK: driftClient.getUser(agentWallet).getPerpPosition(71)
export async function GET() {
  const isLive = AGENT_WALLET !== 'TBD';

  if (!isLive) {
    return NextResponse.json({
      live: false,
      agentWallet: null,
      position: {
        marketIndex: 71,
        marketName: 'FART-PERP',
        direction: 'LONG',
        leverage: 5.0,
        entryPrice: null,
        markPrice: null,
        positionSize: null,
        collateral: null,
        unrealizedPnl: null,
        liquidationPrice: null,
        health: null,
      },
      burns: {
        totalBurned: 0,
        burnEvents: 0,
        lastBurnTx: null,
      },
      milestones: {
        cumulativePnl: 0,
        next: '2x',
        progress: 0,
      },
      pipeline: {
        totalClaimed: 0,
        totalSwapped: 0,
        totalDeposited: 0,
        cycleCount: 0,
        lastCycleTx: null,
        lastCycleTime: null,
      },
      message: 'Position not yet active — launching soon',
    });
  }

  // TODO: Real Drift SDK query when live
  return NextResponse.json({ live: false });
}
