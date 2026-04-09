import FartClouds from '@/components/FartClouds';
import StinkDivider from '@/components/StinkDivider';
import GasLog from '@/components/GasLog';
import FartChart from '@/components/FartChart';
import {
  GasCloudIcon, FlameIcon, SkullIcon, GaugeIcon,
  ChartUpIcon, RecycleIcon, BombIcon, LeafIcon,
  DoubleGasIcon, LiveDot,
} from '@/components/icons';

const POSITION_STATS = [
  { label: 'POSITION SIZE', value: '$2,847', sub: 'total notional', color: '#7CFC00', Icon: GaugeIcon },
  { label: 'ENTRY PRICE', value: '$0.1480', sub: 'avg across 12 fills', color: '#ADFF2F', Icon: ChartUpIcon },
  { label: 'LEVERAGE', value: '5.0x', sub: 'FART-PERP long', color: '#7CFC00', Icon: GaugeIcon },
  { label: 'UNREALIZED PnL', value: '+$206', sub: '+7.26% leveraged', color: '#7CFC00', Icon: ChartUpIcon },
  { label: 'LIQUIDATION', value: '$0.1180', sub: '-20.1% from entry', color: '#FF4444', Icon: SkullIcon },
  { label: 'COLLATERAL', value: '4.82 SOL', sub: 'USDC deposited', color: '#C49B2F', Icon: FlameIcon },
];

const PIPELINE = [
  {
    n: '01', title: 'FEE COLLECTION',
    Icon: GasCloudIcon,
    desc: 'pump.fun creator fees (1% of every buy/sell) accumulate in the creator wallet. The agent monitors balance every 15 minutes via Helius webhooks.',
    tech: 'Helius webhook → balance threshold check (min 0.05 SOL) → claimCreatorFees()',
  },
  {
    n: '02', title: 'SOL → USDC SWAP',
    Icon: RecycleIcon,
    desc: 'Claimed SOL is swapped to USDC through Jupiter aggregator. Route optimized for minimal slippage across Raydium, Orca, and Phoenix DEXs.',
    tech: 'Jupiter v6 API → quoteGet() → swapInstructionsPost() → Jito bundle submission',
  },
  {
    n: '03', title: 'DRIFT DEPOSIT',
    Icon: GaugeIcon,
    desc: 'USDC is deposited as collateral into a Drift Protocol subaccount. The subaccount is dedicated exclusively to the FART-PERP position.',
    tech: 'driftClient.deposit() → subAccountId: 1 → spotMarketIndex: 0 (USDC)',
  },
  {
    n: '04', title: 'PERP LONG OPENED',
    Icon: ChartUpIcon,
    desc: 'A market order opens or increases the FART-PERP long at 5x leverage. Position uses the Pyth Lazer oracle (ID 182) for mark price.',
    tech: 'placePerpOrder() → marketIndex: 71 → LONG → baseAssetAmount → 5x leverage',
  },
  {
    n: '05', title: 'SPLIT & BUYBACK',
    Icon: DoubleGasIcon,
    desc: '70% of each fee cycle funds the FART long. The remaining 30% buys back $METHANE on the open market and sends it to a burn address.',
    tech: '70/30 split at step 02 → parallel execution → burn address: 1111...1111',
  },
];

const MECHANICS = [
  {
    Icon: GasCloudIcon,
    title: 'The Digestive Tract',
    subtitle: 'AUTONOMOUS FEE PIPELINE',
    desc: 'The core loop. Every 15 minutes, an off-chain agent checks creator fee balance, claims when above threshold, splits 70/30, swaps via Jupiter, deposits to Drift, and opens/increases the FART long. No human intervention. No multisig delays. Fully autonomous.',
    specs: [
      'Cycle frequency: every 15 min',
      'Min claim threshold: 0.05 SOL',
      'Swap route: Jupiter v6 aggregator',
      'Position: FART-PERP market index 71',
      'Leverage: 5x (community-adjustable)',
    ],
  },
  {
    Icon: FlameIcon,
    title: 'Burn on Rip',
    subtitle: 'DEFLATIONARY MECHANISM',
    desc: 'When the FART long hits a take-profit trigger, 0.5% of $METHANE total supply is bought from the open market and sent to the Solana burn address. Every profitable close permanently reduces circulating supply.',
    specs: [
      'Trigger: take-profit at +15% unrealized',
      'Burn amount: 0.5% of total supply',
      'Burn address: 1111...1111 (Solana null)',
      'Frequency: per take-profit event',
      'Funded from: 30% buyback allocation',
    ],
  },
  {
    Icon: SkullIcon,
    title: 'The Blowoff',
    subtitle: 'MILESTONE DISTRIBUTIONS',
    desc: 'At 2x, 5x, and 10x cumulative profit milestones, 30% of realized gains are distributed proportionally to the top 500 $METHANE holders. Snapshot is taken at the block the milestone is crossed. No staking required.',
    specs: [
      'Milestones: 2x, 5x, 10x cumulative PnL',
      'Distribution: 30% of realized gains',
      'Eligible: top 500 holders by balance',
      'Snapshot: on-chain at milestone block',
      'Delivery: direct SPL transfer to wallets',
    ],
  },
  {
    Icon: BombIcon,
    title: 'Critical Mass',
    subtitle: 'COMMUNITY LEVERAGE VOTES',
    desc: 'As $METHANE market cap hits milestones, token holders vote on whether to increase leverage. Each tier unlocks higher risk and higher reward. Voting is token-weighted and executed on-chain via Realms.',
    specs: [
      '$100K MC → unlock 3x vote',
      '$500K MC → unlock 5x vote',
      '$1M MC → unlock 7x vote',
      'Voting: SPL Governance (Realms)',
      'Execution: automatic after 24h quorum',
    ],
  },
  {
    Icon: LeafIcon,
    title: 'Composting',
    subtitle: 'FUNDING RATE YIELD',
    desc: 'Drift perps pay/receive funding rates every hour. When the FART long receives positive funding, it compounds into the position. When it pays, it\'s deducted from collateral. Staked $METHANE holders earn a share of net positive funding.',
    specs: [
      'Funding: hourly on Drift Protocol',
      'Positive → compounds into position',
      'Negative → deducted from collateral',
      'Staker yield: 50% of net positive funding',
      'Claim: permissionless, every epoch',
    ],
  },
  {
    Icon: RecycleIcon,
    title: 'Chain Reaction',
    subtitle: 'LIQUIDATION RECOVERY',
    desc: 'If the position gets liquidated, the agent automatically re-enters at a lower price using any remaining collateral plus new incoming fees. The system never stops. It just resets and starts ripping again.',
    specs: [
      'Liquidation → cooldown period (1 hour)',
      'Re-entry: market order at current price',
      'Uses: remaining collateral + new fees',
      'Leverage reset to 3x after liquidation',
      'Community vote to re-escalate',
    ],
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg">
      <FartClouds />

      {/* NAV */}
      <nav className="relative z-10 border-b border-stink/8 bg-bg/90 backdrop-blur-sm">
        <div className="max-w-[1100px] mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GasCloudIcon size={16} className="text-stink/60" />
            <span className="font-bungee text-xs text-stink tracking-wider">$METHANE</span>
          </div>
          <div className="flex items-center gap-5 text-[10px] font-mono">
            {['PUMP.FUN', 'DEXSCREENER', 'DRIFT', 'TWITTER'].map(l => (
              <a key={l} href="#" className="text-stink/25 hover:text-stink/60 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <GasCloudIcon size={56} className="text-stink/40 mx-auto mb-6 animate-wobble" />

          <h1 className="font-bungee text-5xl md:text-7xl lg:text-8xl text-stink stink-glow leading-none">
            $METHANE
          </h1>
          <p className="mt-3 text-lg md:text-xl font-display font-bold text-gas/70">
            Every buy rips a bigger FART long
          </p>
          <p className="mt-3 text-sm text-stink/35 max-w-lg mx-auto leading-relaxed">
            Creator fees are automatically claimed, swapped to USDC via Jupiter, and deposited into a{' '}
            <span className="text-stink font-semibold">5x leveraged Fartcoin perpetual long</span>{' '}
            on Drift Protocol. The position is public. The PnL is real. Every step is on-chain.
          </p>

          {/* CA */}
          <div className="inline-block gas-border px-5 py-2.5 mt-6">
            <div className="text-[9px] font-mono text-stink/25 mb-0.5">CONTRACT ADDRESS</div>
            <code className="text-sm font-mono text-stink font-bold">TBD — LAUNCHING SOON</code>
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-10 mt-8">
            {[
              { label: 'LEVERAGE', value: '5x' },
              { label: 'MARKET', value: 'FART-PERP #71' },
              { label: 'ORACLE', value: 'PYTH LAZER #182' },
              { label: 'PROTOCOL', value: 'DRIFT' },
              { label: 'STATUS', value: 'LIVE', live: true },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-[9px] font-mono text-stink/20 mb-1">{s.label}</div>
                <div className="text-sm font-bungee text-gas flex items-center justify-center gap-1.5">
                  {s.live && <LiveDot className="scale-75" />}
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* CHART */}
      <section className="relative z-10 py-10">
        <div className="max-w-[1100px] mx-auto px-6">
          <FartChart />
        </div>
      </section>

      <StinkDivider />

      {/* POSITION STATS */}
      <section className="relative z-10 py-10">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gas-border">
            <div className="px-5 py-2.5 border-b border-stink/8 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LiveDot />
                <span className="font-bungee text-xs text-stink/60">POSITION DATA</span>
                <span className="text-[9px] font-mono text-stink/20">DRIFT · FART-PERP · MKT #71</span>
              </div>
              <span className="text-[9px] font-mono text-stink/15">UPDATES EVERY BLOCK</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {POSITION_STATS.map((s, i) => (
                <div key={i} className="px-4 py-4 border-b lg:border-b-0 border-r border-stink/5 last:border-r-0 hover:bg-stink/[0.02] transition-colors">
                  <div className="text-[9px] font-mono text-stink/20 mb-1.5 flex items-center gap-1">
                    <s.Icon size={10} className="text-stink/20" />
                    {s.label}
                  </div>
                  <div className="text-lg font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[9px] font-mono text-stink/15 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* THE PIPELINE — detailed technical flow */}
      <section className="relative z-10 py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="font-bungee text-2xl md:text-3xl text-stink mb-2">The Pipeline</h2>
          <p className="text-sm text-stink/30 mb-8 max-w-2xl">
            Five steps from your purchase to the leveraged position. Every step is an on-chain transaction you can verify on Solscan.
          </p>

          <div className="space-y-3">
            {PIPELINE.map((step, i) => (
              <div key={i} className="gas-border hover:border-stink/20 transition-all">
                <div className="flex items-stretch">
                  {/* Step number */}
                  <div className="w-16 md:w-20 shrink-0 flex flex-col items-center justify-center border-r border-stink/8 bg-stink/[0.02]">
                    <span className="text-[9px] font-mono text-stink/20">STEP</span>
                    <span className="font-bungee text-lg text-stink/50">{step.n}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 md:p-5">
                    <div className="flex items-center gap-2.5 mb-2">
                      <step.Icon size={16} className="text-stink/50" />
                      <h3 className="font-bungee text-sm text-stink">{step.title}</h3>
                    </div>
                    <p className="text-[13px] text-stink/40 leading-relaxed mb-3">{step.desc}</p>
                    <div className="bg-bg/80 border border-stink/5 px-3 py-2">
                      <code className="text-[11px] font-mono text-stink/25">{step.tech}</code>
                    </div>
                  </div>

                  {/* Connector */}
                  {i < PIPELINE.length - 1 && (
                    <div className="hidden md:flex w-8 shrink-0 items-end justify-center pb-0">
                      <div className="w-px h-3 bg-stink/10 translate-y-full" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 gas-border px-4 py-2.5 flex items-center gap-2">
            <GasCloudIcon size={12} className="text-stink/20" />
            <span className="text-[10px] font-mono text-stink/20">
              CYCLE RUNS EVERY 15 MIN · ALL TXS VERIFIABLE ON SOLSCAN · DRIFT POSITION IS PUBLIC · AGENT WALLET IS READ-ONLY
            </span>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* IN HONOR OF FART */}
      <section className="relative z-10 py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gas-border p-8 md:p-12 text-center fart-cloud">
            <h2 className="font-bungee text-2xl md:text-4xl text-gas stink-glow mb-4">
              In Honor of FART
            </h2>
            <p className="text-sm text-stink/40 max-w-lg mx-auto leading-relaxed mb-2">
              <span className="text-stink font-semibold">Fartcoin</span> is one of the most iconic tokens on Solana.
              $METHANE doesn&apos;t compete — we <span className="text-stink font-semibold">worship</span> it.
              Every dollar of creator fees goes into longing FART with maximum leverage.
            </p>
            <p className="text-sm text-fart-tan/50 italic mb-6">
              &quot;Others talk about farts. We leverage them.&quot;
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'DexScreener', href: 'https://dexscreener.com/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump' },
                { label: 'CoinGecko', href: 'https://www.coingecko.com/en/coins/fartcoin' },
                { label: 'FART-PERP on Drift', href: 'https://app.drift.trade/perpetuals/FART-PERP' },
              ].map((l, i) => (
                <a key={i} href={l.href} target="_blank" rel="noopener"
                  className="gas-border px-4 py-2 font-mono text-[11px] text-stink/60 hover:text-stink hover:bg-stink/5 transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* THE MECHANICS — detailed cards */}
      <section className="relative z-10 py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="font-bungee text-2xl md:text-3xl text-stink mb-2">The Mechanics</h2>
          <p className="text-sm text-stink/30 mb-8 max-w-2xl">
            Six autonomous on-chain mechanisms that run without human intervention.
            Every parameter is verifiable. Every output is traceable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MECHANICS.map((m, i) => (
              <div key={i} className="gas-border hover:border-stink/25 transition-all">
                {/* Card header */}
                <div className="px-5 py-3 border-b border-stink/5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <m.Icon size={16} className="text-stink/50" />
                    <span className="font-bungee text-xs text-stink">{m.title}</span>
                  </div>
                  <span className="text-[9px] font-mono text-stink/15">{m.subtitle}</span>
                </div>

                {/* Card body */}
                <div className="p-5 space-y-3">
                  <p className="text-[13px] leading-relaxed text-stink/40">{m.desc}</p>

                  {/* Specs list */}
                  <div className="bg-bg/80 border border-stink/5 p-3 space-y-1">
                    {m.specs.map((spec, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-stink/15 text-[10px] mt-0.5">▸</span>
                        <code className="text-[10px] font-mono text-stink/25 leading-relaxed">{spec}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* GAS LOG */}
      <section className="relative z-10 py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <GasLog />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-stink/8 mt-8">
        <div className="max-w-[1100px] mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GasCloudIcon size={14} className="text-stink/30" />
            <span className="font-bungee text-[10px] text-stink/40">$METHANE</span>
            <span className="text-[9px] font-mono text-stink/15">· EVERY BUY RIPS A BIGGER FART LONG</span>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-mono">
            {['PUMP.FUN', 'DEXSCREENER', 'DRIFT', 'TWITTER', 'SOLSCAN'].map(l => (
              <a key={l} href="#" className="text-stink/15 hover:text-stink/40 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
