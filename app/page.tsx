import FartClouds from '@/components/FartClouds';
import StinkDivider from '@/components/StinkDivider';
import GasLog from '@/components/GasLog';
import FartChart from '@/components/FartChart';
import PositionDashboard from '@/components/PositionDashboard';
import {
  GasCloudIcon, FlameIcon, SkullIcon, GaugeIcon,
  ChartUpIcon, RecycleIcon, BombIcon, LeafIcon,
  DoubleGasIcon, LiveDot,
} from '@/components/icons';

const PIPELINE = [
  { n: '01', Icon: GasCloudIcon, title: 'COLLECT', tech: 'Helius webhook → claimCreatorFees()' },
  { n: '02', Icon: RecycleIcon, title: 'SWAP', tech: 'Jupiter v6 → SOL → USDC' },
  { n: '03', Icon: DoubleGasIcon, title: 'SPLIT', tech: '70% → FART long · 30% → buyback + burn' },
  { n: '04', Icon: GaugeIcon, title: 'DEPOSIT', tech: 'driftClient.deposit() → subAccount 1' },
  { n: '05', Icon: ChartUpIcon, title: 'LONG', tech: 'placePerpOrder() → FART-PERP #71 → 5x' },
];

const MECHANICS = [
  {
    Icon: GasCloudIcon, title: 'Digestive Tract',
    specs: ['Cycle: every 15 min', 'Min claim: 0.05 SOL', 'Route: Jupiter v6', 'Market: FART-PERP #71', 'Oracle: Pyth Lazer #182'],
  },
  {
    Icon: FlameIcon, title: 'Burn on Rip',
    specs: ['Trigger: +15% unrealized PnL', 'Burn: 0.5% total supply', 'Source: 30% buyback alloc', 'Dest: Solana null address', 'Frequency: per take-profit'],
  },
  {
    Icon: SkullIcon, title: 'The Blowoff',
    specs: ['Milestones: 2x, 5x, 10x PnL', 'Payout: 30% realized gains', 'Eligible: top 500 holders', 'Snapshot: on milestone block', 'Delivery: direct SPL transfer'],
  },
  {
    Icon: BombIcon, title: 'Critical Mass',
    specs: ['$100K MC → 3x vote', '$500K MC → 5x vote', '$1M MC → 7x vote', 'Governance: SPL Realms', 'Execution: 24h quorum'],
  },
  {
    Icon: LeafIcon, title: 'Composting',
    specs: ['Funding: hourly on Drift', 'Positive → compounds', 'Negative → from collateral', 'Staker yield: 50% net', 'Claim: permissionless'],
  },
  {
    Icon: RecycleIcon, title: 'Chain Reaction',
    specs: ['Liquidation → 1h cooldown', 'Re-entry: market order', 'Uses: remaining + new fees', 'Reset leverage: 3x', 'Community vote to escalate'],
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

      {/* HERO — compact */}
      <section className="relative z-10 pt-16 pb-10 md:pt-24 md:pb-12">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <GasCloudIcon size={48} className="text-stink/40 mx-auto mb-4 animate-wobble" />
          <h1 className="font-bungee text-4xl md:text-6xl lg:text-7xl text-stink stink-glow leading-none">
            $METHANE
          </h1>
          <p className="mt-2 text-base md:text-lg font-display font-bold text-gas/70">
            Every buy rips a bigger FART long
          </p>
          <p className="mt-2 text-sm text-stink/30 max-w-md mx-auto">
            Creator fees → USDC → <span className="text-stink">5x FART-PERP long</span> on Drift. Public. Verifiable. Autonomous.
          </p>
          <div className="inline-block gas-border px-4 py-2 mt-4">
            <div className="text-[8px] font-mono text-stink/20 mb-0.5">CA</div>
            <code className="text-xs font-mono text-stink font-bold">TBD — LAUNCHING SOON</code>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* PIPELINE — compact horizontal */}
      <section className="relative z-10 py-8">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gas-border">
            <div className="px-5 py-2 border-b border-stink/8 flex items-center gap-3">
              <span className="font-bungee text-[10px] text-stink/60">THE PIPELINE</span>
              <span className="text-[9px] font-mono text-stink/15">RUNS EVERY 15 MIN · FULLY AUTONOMOUS</span>
            </div>
            <div className="grid grid-cols-5">
              {PIPELINE.map((step, i) => (
                <div key={i} className="relative px-3 py-4 border-r border-stink/5 last:border-r-0 text-center hover:bg-stink/[0.02] transition-colors">
                  <step.Icon size={20} className="text-stink/40 mx-auto mb-1.5" />
                  <div className="font-bungee text-[10px] text-stink mb-1">{step.title}</div>
                  <code className="text-[8px] font-mono text-stink/20 leading-snug block">{step.tech}</code>
                  {i < 4 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-stink/15">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5h6M6 3l2 2-2 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* FARTCOIN CHART */}
      <section className="relative z-10 py-8">
        <div className="max-w-[1100px] mx-auto px-6">
          <FartChart />
        </div>
      </section>

      <StinkDivider />

      {/* POSITION DASHBOARD — the real meat */}
      <section className="relative z-10 py-8">
        <div className="max-w-[1100px] mx-auto px-6">
          <PositionDashboard />
        </div>
      </section>

      <StinkDivider />

      {/* IN HONOR OF FART — compact */}
      <section className="relative z-10 py-10">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gas-border p-6 md:p-8 text-center fart-cloud">
            <h2 className="font-bungee text-xl md:text-2xl text-gas stink-glow mb-2">
              In Honor of FART
            </h2>
            <p className="text-xs text-stink/30 max-w-sm mx-auto mb-1">
              $METHANE doesn&apos;t compete with Fartcoin — we <span className="text-stink font-semibold">long</span> it with everything we&apos;ve got.
            </p>
            <p className="text-[11px] text-fart-tan/35 italic mb-4">&quot;Others talk about farts. We leverage them.&quot;</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: 'DexScreener', href: 'https://dexscreener.com/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump' },
                { label: 'CoinGecko', href: 'https://www.coingecko.com/en/coins/fartcoin' },
                { label: 'FART-PERP', href: 'https://app.drift.trade/perpetuals/FART-PERP' },
              ].map((l, i) => (
                <a key={i} href={l.href} target="_blank" rel="noopener"
                  className="gas-border px-3 py-1.5 font-mono text-[9px] text-stink/40 hover:text-stink hover:bg-stink/5 transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* MECHANICS — compact spec cards */}
      <section className="relative z-10 py-10">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="font-bungee text-lg md:text-xl text-stink mb-5">The Mechanics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MECHANICS.map((m, i) => (
              <div key={i} className="gas-border hover:border-stink/20 transition-all">
                <div className="px-3.5 py-2.5 border-b border-stink/5 flex items-center gap-2">
                  <m.Icon size={12} className="text-stink/40" />
                  <span className="font-bungee text-[10px] text-stink">{m.title}</span>
                </div>
                <div className="px-3.5 py-2.5 space-y-0.5">
                  {m.specs.map((spec, j) => (
                    <div key={j} className="flex items-start gap-1.5">
                      <span className="text-stink/10 text-[7px] mt-[3px]">▸</span>
                      <code className="text-[9px] font-mono text-stink/25 leading-snug">{spec}</code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* GAS LOG */}
      <section className="relative z-10 py-10">
        <div className="max-w-[1100px] mx-auto px-6">
          <GasLog />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-stink/8 mt-6">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GasCloudIcon size={12} className="text-stink/25" />
            <span className="font-bungee text-[9px] text-stink/35">$METHANE</span>
            <span className="text-[8px] font-mono text-stink/12">· EVERY BUY RIPS A BIGGER FART LONG</span>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-mono">
            {['PUMP.FUN', 'DEXSCREENER', 'DRIFT', 'TWITTER', 'SOLSCAN'].map(l => (
              <a key={l} href="#" className="text-stink/12 hover:text-stink/35 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
