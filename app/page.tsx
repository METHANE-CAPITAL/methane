import GasBubbles from '@/components/GasBubbles';
import WarningTape from '@/components/WarningTape';
import MoleculeViz from '@/components/MoleculeViz';
import PressureGauge from '@/components/PressureGauge';
import FartOMeter from '@/components/FartOMeter';
import PipelineDiagram from '@/components/PipelineDiagram';
import MechanicCard from '@/components/MechanicCard';
import GasLog from '@/components/GasLog';

const POSITION_STATS = [
  { label: 'POSITION SIZE', value: '$2,847', meta: '5× leveraged', color: '#39FF14' },
  { label: 'ENTRY PRICE', value: '$0.0234', meta: 'avg across 12 entries' },
  { label: 'CURRENT PRICE', value: '$0.0251', meta: '+7.26%', color: '#39FF14' },
  { label: 'UNREALIZED PnL', value: '+$206.70', meta: 'before funding', color: '#39FF14' },
  { label: 'LIQUIDATION', value: '$0.0187', meta: '-20.1% from current', color: '#FF3333' },
  { label: 'TOTAL FEES IN', value: '4.82 SOL', meta: '~$569 collected' },
];

const MECHANICS = [
  {
    icon: '⚗️',
    title: 'The Pipeline',
    description: 'Every $METHANE buy generates creator fees. Those fees are automatically claimed, swapped to USDC via Jupiter, and deposited as collateral on Drift to open a 5× leveraged FART long.',
    detail: 'CRON: every 15 min · CLAIM → SWAP → DEPOSIT → INCREASE_POSITION',
  },
  {
    icon: '🔥',
    title: 'Burn on Rip',
    description: 'When the FART long takes profit, a percentage of $METHANE supply gets burned. The position prints, the supply shrinks. Burning off the gas.',
    detail: 'TRIGGER: position profit > 10% · BURN_RATE: 0.5% of supply per profit-take',
  },
  {
    icon: '💀',
    title: 'The Blowoff',
    description: 'At major profit milestones (2×, 5×, 10×), a portion of gains are distributed to $METHANE holders proportionally. The bigger the rip, the bigger the blowoff.',
    detail: 'DISTRIBUTION: 30% of realized gains · SNAPSHOT: top 500 holders',
  },
  {
    icon: '🔄',
    title: 'Double Gas',
    description: 'Fees don\'t just fund the FART long — a portion also buys back $METHANE on the open market. Two positions running. Double the pressure.',
    detail: 'SPLIT: 70% FART long · 30% METHANE buyback',
  },
  {
    icon: '📊',
    title: 'Chain Reaction',
    description: 'As $METHANE market cap hits milestones, the community votes to increase leverage. 3× → 5× → 7×. Higher stakes, more attention, bigger moves.',
    detail: 'THRESHOLDS: $100K=3× · $500K=5× · $1M=7× · VOTE: token-weighted',
  },
  {
    icon: '🌿',
    title: 'Composting',
    description: 'Stake your $METHANE to earn a share of the Drift funding rate payments. When the market pays longs, stakers eat. Passive yield from a leveraged position.',
    detail: 'YIELD: variable · LOCK: none · CLAIM: every epoch',
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg">
      <GasBubbles />

      {/* Top warning tape */}
      <WarningTape />

      {/* Top metadata strip */}
      <div className="relative z-10 border-b border-neutral-600/30 bg-bg/90 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-[11px] font-mono text-toxic font-bold tracking-wider">
              $METHANE
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              CH₄ · LEVERAGED FART PROTOCOL
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://pump.fun" target="_blank" rel="noopener" className="text-[10px] font-mono text-neutral-500 hover:text-toxic transition-colors">
              PUMP.FUN
            </a>
            <a href="https://dexscreener.com" target="_blank" rel="noopener" className="text-[10px] font-mono text-neutral-500 hover:text-toxic transition-colors">
              DEXSCREENER
            </a>
            <a href="https://app.drift.trade" target="_blank" rel="noopener" className="text-[10px] font-mono text-neutral-500 hover:text-toxic transition-colors">
              DRIFT POSITION
            </a>
            <a href="#" className="text-[10px] font-mono text-neutral-500 hover:text-toxic transition-colors">
              TWITTER
            </a>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
              HAZMAT_001 // LEVERAGED GAS DETECTION SYSTEM
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-display font-black text-neutral-100 tracking-tight leading-[1.1]">
                  <span className="text-toxic toxic-text-glow">$METHANE</span>
                </h1>
                <p className="text-xl md:text-2xl font-display font-medium text-neutral-200 leading-snug">
                  Every buy fuels a{' '}
                  <span className="text-toxic font-bold">5× leveraged</span>{' '}
                  Fartcoin long on Drift.
                </p>
              </div>

              <p className="text-[16px] leading-relaxed text-neutral-400 max-w-lg">
                Creator fees are automatically claimed, swapped, and deposited into a leveraged FART-PERP position.
                The position is public. The PnL is real. Every transaction is on-chain.
              </p>

              {/* CA Display */}
              <div className="border border-neutral-600/30 bg-bg-card/60 p-4">
                <div className="text-[10px] font-mono text-neutral-500 mb-2">CONTRACT ADDRESS</div>
                <div className="flex items-center gap-3">
                  <code className="text-[14px] font-mono text-toxic break-all">
                    TBD — LAUNCHING SOON
                  </code>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex gap-6">
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 mb-1">LEVERAGE</div>
                  <div className="text-lg font-mono font-bold text-hazmat">5×</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 mb-1">PERP MARKET</div>
                  <div className="text-lg font-mono font-bold text-neutral-200">FART-PERP</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 mb-1">PROTOCOL</div>
                  <div className="text-lg font-mono font-bold text-neutral-200">DRIFT</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 mb-1">STATUS</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-toxic animate-pulse" />
                    <span className="text-lg font-mono font-bold text-toxic">LIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Molecule */}
            <div className="flex justify-center">
              <MoleculeViz />
            </div>
          </div>
        </div>
      </section>

      {/* FART-O-METER SECTION */}
      <section className="relative z-10 py-16">
        <div className="max-w-[1400px] mx-auto px-6 space-y-6">
          <div className="mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
              ——— SECTION_002 // LIVE POSITION DATA ———
            </span>
          </div>
          <FartOMeter stats={POSITION_STATS} />
        </div>
      </section>

      {/* PRESSURE GAUGE + PIPELINE */}
      <section className="relative z-10 py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
              ——— SECTION_003 // GAS PRESSURE SYSTEM ———
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pressure Gauge */}
            <div className="border border-neutral-600/30 bg-bg-card/60 p-6 flex flex-col items-center justify-center">
              <PressureGauge
                pressure={34}
                label="GAS PRESSURE"
                value="34%"
                sublabel="Level 2 approaching · Next threshold: 50%"
              />
            </div>

            {/* Pipeline Diagram */}
            <div className="lg:col-span-2">
              <PipelineDiagram />
            </div>
          </div>
        </div>
      </section>

      <WarningTape />

      {/* HOW IT WORKS — MECHANICS */}
      <section className="relative z-10 py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
              ——— SECTION_004 // PROTOCOL MECHANICS ———
            </span>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-neutral-100 tracking-tight">
              How It Works
            </h2>
            <p className="mt-3 text-[15px] text-neutral-400 max-w-2xl">
              Six autonomous systems working together. Every mechanic is on-chain, verifiable, and runs without human intervention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MECHANICS.map((m, i) => (
              <MechanicCard key={i} {...m} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* GAS LOG — LIVE FEED */}
      <section className="relative z-10 py-16">
        <div className="max-w-[1400px] mx-auto px-6 space-y-6">
          <div className="mb-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
              ——— SECTION_005 // ACTIVITY FEED ———
            </span>
          </div>
          <GasLog />
        </div>
      </section>

      {/* EMISSIONS REPORT PREVIEW */}
      <section className="relative z-10 py-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="mb-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-neutral-500">
              ——— SECTION_006 // METHANE EMISSIONS REPORT ———
            </span>
          </div>

          <div className="border border-neutral-600/30 bg-bg-card/60 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-display font-bold text-neutral-100">
                  Weekly Emissions Report #003
                </h3>
                <p className="text-[12px] font-mono text-neutral-500 mt-1">
                  REPORTING PERIOD: APR 2 — APR 9, 2026 · PUBLISHED ON-CHAIN
                </p>
              </div>
              <span className="text-[10px] font-mono text-toxic border border-toxic/30 px-2 py-1">
                VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-neutral-500">TOTAL FEES COLLECTED</div>
                <div className="text-xl font-mono font-bold text-toxic">4.82 SOL</div>
                <div className="text-[10px] font-mono text-neutral-500">~$569 USD</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-neutral-500">POSITION PERFORMANCE</div>
                <div className="text-xl font-mono font-bold text-toxic">+7.26%</div>
                <div className="text-[10px] font-mono text-neutral-500">unrealized</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-neutral-500">SUPPLY BURNED</div>
                <div className="text-xl font-mono font-bold text-danger">48,200</div>
                <div className="text-[10px] font-mono text-neutral-500">0.48% of total</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-neutral-500">BUYBACK EXECUTED</div>
                <div className="text-xl font-mono font-bold text-hazmat">1.44 SOL</div>
                <div className="text-[10px] font-mono text-neutral-500">30% of fees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WarningTape />

      {/* BOTTOM METADATA STRIP */}
      <footer className="relative z-10 border-t border-neutral-600/30 bg-bg/90 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-mono text-toxic font-bold">$METHANE</span>
              <span className="text-[10px] font-mono text-neutral-500">
                CH₄ · LEVERAGED FART PROTOCOL · EVERY BUY MAKES THE BET BIGGER
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a href="https://pump.fun" target="_blank" rel="noopener" className="text-[10px] font-mono text-neutral-500 hover:text-toxic transition-colors">
                PUMP.FUN
              </a>
              <span className="text-neutral-600">·</span>
              <a href="https://dexscreener.com" target="_blank" rel="noopener" className="text-[10px] font-mono text-neutral-500 hover:text-toxic transition-colors">
                DEXSCREENER
              </a>
              <span className="text-neutral-600">·</span>
              <a href="https://app.drift.trade" target="_blank" rel="noopener" className="text-[10px] font-mono text-neutral-500 hover:text-toxic transition-colors">
                DRIFT
              </a>
              <span className="text-neutral-600">·</span>
              <a href="#" className="text-[10px] font-mono text-neutral-500 hover:text-toxic transition-colors">
                TWITTER
              </a>
              <span className="text-neutral-600">·</span>
              <a href="https://solscan.io" target="_blank" rel="noopener" className="text-[10px] font-mono text-neutral-500 hover:text-toxic transition-colors">
                SOLSCAN
              </a>
            </div>
          </div>
        </div>
      </footer>

      <WarningTape />
    </div>
  );
}
