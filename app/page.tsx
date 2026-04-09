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
  { label: 'POSITION', value: '$2,847', color: '#7CFC00', Icon: GaugeIcon },
  { label: 'ENTRY', value: '$0.1480', color: '#ADFF2F', Icon: ChartUpIcon },
  { label: 'LEVERAGE', value: '5.0x', color: '#7CFC00', Icon: GaugeIcon },
  { label: 'PnL', value: '+$206', color: '#7CFC00', Icon: ChartUpIcon },
  { label: 'LIQUIDATION', value: '$0.1180', color: '#FF4444', Icon: SkullIcon },
  { label: 'COLLATERAL', value: '4.82 SOL', color: '#C49B2F', Icon: FlameIcon },
];

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

      {/* HERO */}
      <section className="relative z-10 pt-20 pb-10 md:pt-28 md:pb-14">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <GasCloudIcon size={56} className="text-stink/40 mx-auto mb-6 animate-wobble" />

          <h1 className="font-bungee text-5xl md:text-7xl lg:text-8xl text-stink stink-glow leading-none">
            $METHANE
          </h1>
          <p className="mt-3 text-lg md:text-xl font-display font-bold text-gas/70">
            Every buy rips a bigger FART long
          </p>
          <p className="mt-3 text-sm text-stink/30 max-w-md mx-auto">
            Creator fees → USDC → <span className="text-stink">5x leveraged FART-PERP long</span> on Drift.
            Public position. Real PnL. On-chain.
          </p>

          <div className="inline-block gas-border px-5 py-2.5 mt-5">
            <div className="text-[9px] font-mono text-stink/20 mb-0.5">CA</div>
            <code className="text-sm font-mono text-stink font-bold">TBD — LAUNCHING SOON</code>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* PIPELINE — visual horizontal flow */}
      <section className="relative z-10 py-10">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gas-border">
            <div className="px-5 py-2.5 border-b border-stink/8">
              <span className="font-bungee text-xs text-stink/60">THE PIPELINE</span>
              <span className="text-[9px] font-mono text-stink/15 ml-3">RUNS EVERY 15 MIN</span>
            </div>
            <div className="grid grid-cols-5">
              {PIPELINE.map((step, i) => (
                <div key={i} className="relative px-4 py-5 border-r border-stink/5 last:border-r-0 text-center hover:bg-stink/[0.02] transition-colors">
                  <div className="text-[9px] font-mono text-stink/15 mb-2">{step.n}</div>
                  <step.Icon size={24} className="text-stink/50 mx-auto mb-2" />
                  <div className="font-bungee text-[11px] text-stink mb-2">{step.title}</div>
                  <code className="text-[9px] font-mono text-stink/20 leading-relaxed block">{step.tech}</code>
                  {i < 4 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-stink/15">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6h6M7 4l2 2-2 2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
      <section className="relative z-10 py-8">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gas-border">
            <div className="px-5 py-2 border-b border-stink/8 flex items-center gap-2.5">
              <LiveDot />
              <span className="font-bungee text-xs text-stink/60">POSITION</span>
              <span className="text-[9px] font-mono text-stink/15">DRIFT · FART-PERP · MKT #71 · PYTH LAZER #182</span>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-6">
              {POSITION_STATS.map((s, i) => (
                <div key={i} className="px-4 py-3.5 border-r border-b lg:border-b-0 border-stink/5 last:border-r-0 hover:bg-stink/[0.02] transition-colors">
                  <div className="text-[9px] font-mono text-stink/20 mb-1 flex items-center gap-1">
                    <s.Icon size={9} className="text-stink/15" />
                    {s.label}
                  </div>
                  <div className="text-lg font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* IN HONOR OF FART */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="gas-border p-8 md:p-10 text-center fart-cloud">
            <h2 className="font-bungee text-2xl md:text-3xl text-gas stink-glow mb-3">
              In Honor of FART
            </h2>
            <p className="text-sm text-stink/35 max-w-md mx-auto mb-1">
              $METHANE doesn&apos;t compete with Fartcoin — we <span className="text-stink font-semibold">long</span> it.
            </p>
            <p className="text-xs text-fart-tan/40 italic mb-5">
              &quot;Others talk about farts. We leverage them.&quot;
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              {[
                { label: 'DexScreener', href: 'https://dexscreener.com/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump' },
                { label: 'CoinGecko', href: 'https://www.coingecko.com/en/coins/fartcoin' },
                { label: 'FART-PERP on Drift', href: 'https://app.drift.trade/perpetuals/FART-PERP' },
              ].map((l, i) => (
                <a key={i} href={l.href} target="_blank" rel="noopener"
                  className="gas-border px-3 py-1.5 font-mono text-[10px] text-stink/50 hover:text-stink hover:bg-stink/5 transition-colors">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* MECHANICS — compact spec cards */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="font-bungee text-xl md:text-2xl text-stink mb-6">The Mechanics</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {MECHANICS.map((m, i) => (
              <div key={i} className="gas-border hover:border-stink/20 transition-all">
                <div className="px-4 py-3 border-b border-stink/5 flex items-center gap-2">
                  <m.Icon size={14} className="text-stink/40" />
                  <span className="font-bungee text-[11px] text-stink">{m.title}</span>
                </div>
                <div className="px-4 py-3 space-y-1">
                  {m.specs.map((spec, j) => (
                    <div key={j} className="flex items-start gap-1.5">
                      <span className="text-stink/10 text-[8px] mt-[3px]">▸</span>
                      <code className="text-[10px] font-mono text-stink/30 leading-snug">{spec}</code>
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
      <section className="relative z-10 py-12">
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
