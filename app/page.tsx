import FartClouds from '@/components/FartClouds';
import StinkDivider from '@/components/StinkDivider';
import GasLog from '@/components/GasLog';
import FartChart from '@/components/FartChart';
import MoleculeViz from '@/components/MoleculeViz';
import PositionDashboard from '@/components/PositionDashboard';
import { MethaneAscii, GPaaSAscii, FartPerpAscii } from '@/components/AsciiArt';
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

      {/* 1. HERO */}
      <section className="relative z-10 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-[1100px] mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <MethaneAscii className="text-stink stink-glow" />
          </div>
          <div className="flex justify-center mb-2">
            <GPaaSAscii className="text-gas/50" />
          </div>
          <p className="mt-3 text-sm text-stink/35 max-w-lg mx-auto leading-relaxed">
            Every dollar of creator fees is automatically swapped to USDC and dumped into a{' '}
            <span className="text-stink font-semibold">5x leveraged Fartcoin long</span>{' '}
            on Drift Protocol. The position is public. The PnL is real.{' '}
            <span className="text-stink/50">And any token can plug in.</span>
          </p>
          <div className="inline-block gas-border px-5 py-2.5 mt-6">
            <div className="text-[8px] font-mono text-stink/20 mb-0.5">CA</div>
            <code className="text-sm font-mono text-stink font-bold">TBD — LAUNCHING SOON</code>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* 2. WHY FART — split: copy + molecule viz */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: thesis */}
            <div>
              <div className="flex mb-3">
                <FartPerpAscii className="text-gas/60" />
              </div>
              <p className="text-sm text-stink/40 leading-relaxed mb-3">
                <span className="text-stink font-semibold">Fartcoin</span> is one of the most iconic tokens on Solana.
                $200M+ market cap. Listed everywhere. A cultural monument to on-chain degeneracy.
              </p>
              <p className="text-sm text-stink/35 leading-relaxed mb-4">
                $METHANE doesn&apos;t compete with FART — we <span className="text-stink font-semibold">long</span> it.
                Every fee we collect becomes leveraged FART exposure on Drift.
                When FART pumps, we pump harder.
              </p>
              <p className="text-xs text-fart-tan/40 italic">&quot;Others talk about farts. We leverage them.&quot;</p>
            </div>

            {/* Right: data card */}
            <div className="gas-border p-5">
              <div className="text-[9px] font-mono text-stink/20 mb-3">FARTCOIN ON SOLANA</div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'PERP MARKET', value: 'FART-PERP #71' },
                  { label: 'ORACLE', value: 'Pyth Lazer #182' },
                  { label: 'MAX LEVERAGE', value: '20x on Drift' },
                  { label: 'OUR LEVERAGE', value: '5x (adjustable)' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-[8px] font-mono text-stink/15 mb-0.5">{s.label}</div>
                    <div className="text-xs font-mono text-stink/50 font-bold">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'DexScreener', href: 'https://dexscreener.com/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump' },
                  { label: 'CoinGecko', href: 'https://www.coingecko.com/en/coins/fartcoin' },
                  { label: 'FART-PERP', href: 'https://app.drift.trade/perpetuals/FART-PERP' },
                ].map((l, i) => (
                  <a key={i} href={l.href} target="_blank" rel="noopener"
                    className="gas-border px-3 py-1.5 font-mono text-[9px] text-stink/40 hover:text-stink hover:bg-stink/5 transition-colors">
                    {l.label} →
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* 3. HOW IT WORKS */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <pre className="font-mono text-stink/70 text-xs mb-1 select-none">{'// HOW_IT_WORKS.sol'}</pre>
          <h2 className="font-bungee text-xl md:text-2xl text-stink mb-1">How It Works</h2>
          <p className="text-sm text-stink/25 mb-6">Five steps. Every 15 minutes. Fully autonomous.</p>

          <div className="gas-border">
            <div className="grid grid-cols-5">
              {PIPELINE.map((step, i) => (
                <div key={i} className="relative px-3 py-5 border-r border-stink/5 last:border-r-0 text-center hover:bg-stink/[0.02] transition-colors">
                  <div className="text-[9px] font-mono text-stink/15 mb-2">{step.n}</div>
                  <step.Icon size={22} className="text-stink/40 mx-auto mb-2" />
                  <div className="font-bungee text-[10px] text-stink mb-1.5">{step.title}</div>
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

          <div className="mt-3 text-[9px] font-mono text-stink/15 text-center">
            ALL TXS ON-CHAIN · VERIFY ON SOLSCAN · POSITION IS PUBLIC · AGENT WALLET IS READ-ONLY
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* 4. CHART + LIVE MARKET DATA */}
      <section className="relative z-10 py-10">
        <div className="max-w-[1100px] mx-auto px-6 space-y-4">
          <FartChart />

          {/* Live Drift market data — this is REAL data, not empty */}
          <PositionDashboard />

          {/* Position status bar */}
          <div className="gas-border px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GaugeIcon size={14} className="text-stink/30" />
              <span className="text-[10px] font-mono text-stink/40">POSITION STATUS</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-stink/20">5x LONG · FART-PERP #71 · DRIFT PROTOCOL</span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold border border-gas/20 text-gas/50 bg-gas/5">
                LAUNCHING SOON
              </span>
            </div>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* 5. FOR YOUR TOKEN — GPaaS */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <pre className="font-mono text-stink/70 text-xs mb-1 select-none">{'// GAS_PIPELINE.service'}</pre>
          <h2 className="font-bungee text-xl md:text-2xl text-stink mb-2">For Your Token</h2>
          <p className="text-sm text-stink/30 mb-6 max-w-xl">
            $METHANE isn&apos;t just a token — it&apos;s infrastructure. Any project on Solana can route creator fees
            into the shared FART vault. No code. No setup. Just connect and earn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              {
                n: '1', title: 'CONNECT', Icon: GasCloudIcon,
                desc: 'Register your creator wallet address and set what percentage of fees you want routed to the vault.',
              },
              {
                n: '2', title: 'PIPELINE', Icon: RecycleIcon,
                desc: 'Our agent monitors your wallet, claims fees, swaps to USDC, and deposits into the shared Drift Vault. Automatic.',
              },
              {
                n: '3', title: 'EARN', Icon: ChartUpIcon,
                desc: 'Get proportional exposure to the leveraged FART position. Live dashboard. Embeddable widget. Real PnL.',
              },
            ].map((card, i) => (
              <div key={i} className="gas-border hover:border-stink/20 transition-all">
                <div className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-5 h-5 flex items-center justify-center text-[9px] font-mono font-bold text-bg bg-stink/80 rounded-full">{card.n}</span>
                    <card.Icon size={16} className="text-stink/40" />
                    <span className="font-bungee text-xs text-stink">{card.title}</span>
                  </div>
                  <p className="text-[12px] text-stink/35 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Flywheel — visual */}
          <div className="gas-border fart-cloud overflow-hidden">
            <div className="px-5 py-2.5 border-b border-stink/5">
              <span className="text-[9px] font-mono text-stink/20">THE FLYWHEEL</span>
            </div>
            <div className="p-6 flex flex-col items-center">
              {/* Circular flow */}
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                {/* Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <GasCloudIcon size={32} className="text-stink/30 mx-auto mb-1" />
                    <div className="font-bungee text-xs text-stink/40">SHARED</div>
                    <div className="font-bungee text-xs text-stink/40">VAULT</div>
                  </div>
                </div>
                {/* Orbit items */}
                {[
                  { label: 'More Partners', pos: 'top-0 left-1/2 -translate-x-1/2', color: 'text-stink', Icon: GasCloudIcon },
                  { label: 'More Fees', pos: 'top-1/2 right-0 -translate-y-1/2', color: 'text-gas', Icon: RecycleIcon },
                  { label: 'Bigger Position', pos: 'bottom-0 left-1/2 -translate-x-1/2', color: 'text-stink', Icon: ChartUpIcon },
                  { label: 'Better Returns', pos: 'top-1/2 left-0 -translate-y-1/2', color: 'text-gas', Icon: ChartUpIcon },
                ].map((item, i) => (
                  <div key={i} className={`absolute ${item.pos} flex flex-col items-center gap-1`}>
                    <item.Icon size={18} className={`${item.color}/40`} />
                    <span className={`text-[10px] font-bungee ${item.color}/50`}>{item.label}</span>
                  </div>
                ))}
                {/* Connecting arcs (SVG) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="70" stroke="rgba(124,252,0,0.08)" strokeWidth="1" strokeDasharray="4 4" />
                  {/* Arrows */}
                  <path d="M135 30 L155 50" stroke="rgba(124,252,0,0.15)" strokeWidth="1" markerEnd="url(#arrow)" />
                  <path d="M170 135 L155 155" stroke="rgba(124,252,0,0.15)" strokeWidth="1" />
                  <path d="M65 170 L45 150" stroke="rgba(124,252,0,0.15)" strokeWidth="1" />
                  <path d="M30 65 L45 45" stroke="rgba(124,252,0,0.15)" strokeWidth="1" />
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[10px] font-mono text-stink/20">
                <span>FART gets buy pressure ↑</span>
                <span>·</span>
                <span>$METHANE burns on profit ↓</span>
                <span>·</span>
                <span>Partners earn yield ↑</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StinkDivider />

      {/* 6. PRESSURE + MECHANICS */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1100px] mx-auto px-6">
          <pre className="font-mono text-stink/70 text-xs mb-1 select-none">{'// MECHANICS.config'}</pre>
          <h2 className="font-bungee text-lg md:text-xl text-stink mb-6">The Mechanics</h2>

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

      {/* 7. GAS LOG */}
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
            <span className="text-[8px] font-mono text-stink/12">· GAS PIPELINE AS A SERVICE</span>
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
