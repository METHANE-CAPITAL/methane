import FartClouds from '@/components/FartClouds';
import StinkDivider from '@/components/StinkDivider';
import GasLog from '@/components/GasLog';
import FartChart from '@/components/FartChart';
import {
  GasCloudIcon, FlameIcon, SkullIcon, GaugeIcon,
  ChartUpIcon, RecycleIcon, BombIcon, LeafIcon,
  LiveDot, StinkLines,
} from '@/components/icons';

const MECHANICS = [
  {
    Icon: GasCloudIcon,
    title: 'The Digestive Tract',
    desc: 'You buy $METHANE. Creator fees get claimed, swapped to USDC via Jupiter, and deposited into a 5x leveraged FART long on Drift. 70% goes to the long, 30% buys back $METHANE.',
    detail: 'CLAIM → SWAP → DEPOSIT → LONG',
  },
  {
    Icon: FlameIcon,
    title: 'Burn on Rip',
    desc: 'When the FART long profits, $METHANE supply gets burned. The louder the rip, the more supply vanishes.',
    detail: '0.5% supply burned per take-profit',
  },
  {
    Icon: SkullIcon,
    title: 'The Blowoff',
    desc: 'At 2x, 5x, and 10x profit milestones, realized gains get distributed to $METHANE holders. Stakers earn Drift funding rate payments.',
    detail: '30% of gains → top 500 holders',
  },
  {
    Icon: BombIcon,
    title: 'Critical Mass',
    desc: 'As $METHANE MC hits milestones, the community votes to crank the leverage. More degen. More dangerous.',
    detail: '$100K=3x · $500K=5x · $1M=7x',
  },
];

const PIPELINE_STEPS = [
  { n: '01', title: 'BUY $METHANE', sub: 'on pump.fun' },
  { n: '02', title: 'FEES CLAIMED', sub: '1% creator fee' },
  { n: '03', title: 'SWAP TO USDC', sub: 'via Jupiter' },
  { n: '04', title: '5x FART LONG', sub: 'on Drift Protocol' },
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
      <section className="relative z-10 pt-20 pb-14 md:pt-28 md:pb-20">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <GasCloudIcon size={56} className="text-stink/40 mx-auto mb-6 animate-wobble" />

          <h1 className="font-bungee text-5xl md:text-7xl lg:text-8xl text-stink stink-glow leading-none">
            $METHANE
          </h1>
          <p className="mt-3 text-lg md:text-xl font-display font-bold text-gas/70">
            Every buy rips a bigger FART long
          </p>
          <p className="mt-3 text-sm text-stink/35 max-w-md mx-auto leading-relaxed">
            Creator fees automatically fund a{' '}
            <span className="text-stink font-semibold">5x leveraged Fartcoin long</span>{' '}
            on Drift Protocol. Public position. Real PnL.
          </p>

          {/* CA */}
          <div className="inline-block gas-border px-5 py-2.5 mt-6">
            <div className="text-[9px] font-mono text-stink/25 mb-0.5">CA</div>
            <code className="text-sm font-mono text-stink font-bold">TBD — LAUNCHING SOON</code>
          </div>

          {/* Quick stats */}
          <div className="flex justify-center gap-10 mt-8">
            {[
              { label: 'LEVERAGE', value: '5x' },
              { label: 'TARGET', value: 'FART-PERP' },
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

      {/* PIPELINE — horizontal flow */}
      <section className="relative z-10 py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="font-bungee text-2xl md:text-3xl text-stink mb-8">How It Works</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {PIPELINE_STEPS.map((s, i) => (
              <div key={i} className="relative gas-border p-5 text-center">
                <div className="text-[9px] font-mono text-stink/15 mb-2">STEP {s.n}</div>
                <div className="font-bungee text-sm text-stink mb-1">{s.title}</div>
                <div className="text-[11px] font-mono text-stink/30">{s.sub}</div>
                {i < 3 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-stink/20">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3 text-[10px] font-mono text-stink/15 text-center">
            EVERY STEP ON-CHAIN · VERIFY ON SOLSCAN · POSITION IS PUBLIC
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
              Every dollar of creator fees goes into longing FART with max leverage.
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

      {/* MECHANICS */}
      <section className="relative z-10 py-14">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="font-bungee text-2xl md:text-3xl text-stink mb-8">The Mechanics</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MECHANICS.map((m, i) => (
              <div key={i} className="gas-border hover:border-stink/25 transition-all">
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <m.Icon size={18} className="text-stink/50" />
                    <h3 className="font-bungee text-sm text-stink">{m.title}</h3>
                  </div>
                  <p className="text-[13px] leading-relaxed text-stink/40">{m.desc}</p>
                  <div className="pt-2 border-t border-stink/5">
                    <p className="text-[10px] font-mono text-stink/15">{m.detail}</p>
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
