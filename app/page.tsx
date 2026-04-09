import FartClouds from '@/components/FartClouds';
import StinkDivider from '@/components/StinkDivider';
import GasLog from '@/components/GasLog';
import PressureGauge from '@/components/PressureGauge';
import MoleculeViz from '@/components/MoleculeViz';

const POSITION_STATS = [
  { label: '💨 STINK LEVEL', value: '$2,847', meta: 'total position size', color: '#7CFC00' },
  { label: '🎯 ENTRY SNIFF', value: '$0.0234', meta: 'avg across 12 farts', color: '#ADFF2F' },
  { label: '👃 CURRENT WHIFF', value: '$0.0251', meta: '+7.26% and rising', color: '#7CFC00' },
  { label: '🤑 UNREALIZED GAS', value: '+$206.70', meta: 'pure fart profits', color: '#7CFC00' },
  { label: '💀 DEATH ZONE', value: '$0.0187', meta: '-20.1% = liquidated', color: '#FF4444' },
  { label: '⛽ TOTAL FUEL', value: '4.82 SOL', meta: '~$569 of gas money', color: '#C49B2F' },
];

const MECHANICS = [
  {
    emoji: '🫃',
    title: 'The Digestive Tract',
    desc: 'You buy $METHANE. Creator fees get claimed, swapped to USDC via Jupiter, and shoved into a 5× leveraged FART long on Drift. The whole digestive system runs every 15 minutes. Automatic. Unstoppable. Gaseous.',
    detail: 'CLAIM → SWAP → DEPOSIT → LONG · every 15 min',
  },
  {
    emoji: '🔥',
    title: 'Burn on Rip',
    desc: 'When the FART long takes profit, $METHANE supply gets burned. You literally burn it off. The louder the rip, the more supply vanishes. Silent but deflationary.',
    detail: '0.5% supply burned per profit-take event',
  },
  {
    emoji: '💀',
    title: 'The Blowoff',
    desc: 'At 2×, 5×, and 10× profit milestones, a portion of realized gains gets distributed to $METHANE holders. Hold your nose and hold your tokens — the blowoff rewards the brave.',
    detail: '30% of gains → top 500 holders · snapshot at milestone',
  },
  {
    emoji: '💨💨',
    title: 'Double Gas',
    desc: '70% of fees go to the FART long, 30% buys back $METHANE on the open market. Two streams of gas. Double the pressure. Double the stink.',
    detail: '70/30 split · FART long + METHANE buyback',
  },
  {
    emoji: '💣',
    title: 'Critical Mass',
    desc: 'As $METHANE MC hits milestones, the community votes to crank the leverage. 3× → 5× → 7×. More degen. More dangerous. More hilarious when it prints.',
    detail: '$100K=3× · $500K=5× · $1M=7× · token-weighted vote',
  },
  {
    emoji: '🌿',
    title: 'Composting',
    desc: 'Stake your $METHANE to earn a share of Drift funding rate payments. Let your tokens decompose into passive yield. Nature\'s way of recycling farts.',
    detail: 'variable yield · no lock · claim every epoch',
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg">
      <FartClouds />

      {/* TOP BAR */}
      <div className="relative z-10 border-b border-stink/10 bg-bg/90 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💨</span>
            <span className="font-bungee text-stink text-sm tracking-wider">$METHANE</span>
          </div>
          <div className="flex items-center gap-5 text-[11px] font-mono">
            <a href="https://pump.fun" target="_blank" rel="noopener" className="text-stink/40 hover:text-stink transition-colors">PUMP.FUN</a>
            <a href="https://dexscreener.com" target="_blank" rel="noopener" className="text-stink/40 hover:text-stink transition-colors">DEXSCREENER</a>
            <a href="https://app.drift.trade" target="_blank" rel="noopener" className="text-stink/40 hover:text-stink transition-colors">DRIFT POSITION</a>
            <a href="#" className="text-stink/40 hover:text-stink transition-colors">TWITTER</a>
          </div>
        </div>
      </div>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative z-10 py-20 md:py-32 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center space-y-8">
            {/* Big fart emoji cluster */}
            <div className="text-6xl md:text-8xl animate-wobble select-none">
              💨
            </div>

            <div>
              <h1 className="font-bungee text-6xl md:text-8xl lg:text-9xl text-stink stink-glow leading-none">
                $METHANE
              </h1>
              <p className="mt-4 text-xl md:text-2xl font-display font-bold text-gas/80">
                Every buy rips a bigger FART long
              </p>
              <p className="mt-3 text-base text-fart-tan/60 max-w-lg mx-auto">
                Creator fees are automatically claimed, swapped, and dumped into a{' '}
                <span className="text-stink font-bold">5× leveraged Fartcoin long</span>{' '}
                on Drift Protocol. The position is public. The PnL is real. It smells like money.
              </p>
            </div>

            {/* CA */}
            <div className="inline-block gas-border px-6 py-3 mx-auto">
              <div className="text-[10px] font-mono text-stink/40 mb-1">CONTRACT ADDRESS</div>
              <code className="text-base font-mono text-stink font-bold">
                TBD — LAUNCHING SOON 💨
              </code>
            </div>

            {/* Quick stats row */}
            <div className="flex flex-wrap justify-center gap-8 pt-4">
              {[
                { label: 'BLAST RADIUS', value: '5×', color: '#C49B2F' },
                { label: 'TARGET', value: 'FART-PERP', color: '#ADFF2F' },
                { label: 'PROTOCOL', value: 'DRIFT', color: '#7CFC00' },
                { label: 'STATUS', value: '🟢 RIPPING', color: '#7CFC00' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-[10px] font-mono text-stink/30 mb-1">{s.label}</div>
                  <div className="text-lg font-bungee" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StinkDivider label="THE POSITION" />

      {/* ═══════════════ FART-O-METER ═══════════════ */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="gas-border">
            {/* Header */}
            <div className="px-6 py-3 border-b border-stink/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-stink animate-pulse" />
                <span className="text-sm font-bungee text-stink/70">FART-O-METER</span>
                <span className="text-[10px] font-mono text-stink/30">LIVE POSITION DATA</span>
              </div>
              <span className="text-[10px] font-mono text-stink/20">
                DRIFT · FART-PERP · MKT #71
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {POSITION_STATS.map((stat, i) => (
                <div key={i} className="px-4 py-5 border-b md:border-b-0 border-r border-stink/5 last:border-r-0 hover:bg-stink/[0.02] transition-colors">
                  <div className="text-[10px] font-mono text-stink/30 mb-2">{stat.label}</div>
                  <div className="text-xl font-mono font-bold" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-[10px] font-mono text-stink/20 mt-1">{stat.meta}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ PRESSURE + MOLECULE ═══════════════ */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="gas-border p-8 flex flex-col items-center justify-center">
              <PressureGauge pressure={34} label="GAS PRESSURE" value="34%" sublabel="Level 2 approaching · Next blowoff at 50%" />
            </div>
            <div className="gas-border p-8 flex flex-col items-center justify-center fart-cloud">
              <MoleculeViz />
              <p className="text-center text-sm text-stink/30 font-mono mt-4">
                CH₄ — one carbon, four hydrogens, infinite leverage
              </p>
            </div>
          </div>
        </div>
      </section>

      <StinkDivider label="HOW IT RIPS" />

      {/* ═══════════════ THE DIGESTIVE TRACT ═══════════════ */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-bungee text-3xl md:text-4xl text-stink stink-glow mb-3">
            The Digestive Tract
          </h2>
          <p className="text-base text-stink/40 mb-8 max-w-2xl">
            From purchase to position. Every $METHANE buy goes through the system.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {[
              { step: '01', icon: '🛒', title: 'YOU BUY $METHANE', sub: 'on pump.fun', desc: 'Innocent enough. You buy the token. Little do you know what happens next.' },
              { step: '02', icon: '⚗️', title: 'FEES DIGESTED', sub: '1% creator fee', desc: 'The creator fee gets gobbled up by the smart contract. Nom nom nom.' },
              { step: '03', icon: '🔄', title: 'SWAPPED TO USDC', sub: 'via Jupiter', desc: 'SOL gets converted to USDC. The body processes the nutrients.' },
              { step: '04', icon: '💨', title: '5× FART LONG', sub: 'on Drift Protocol', desc: 'And out the other end comes a leveraged Fartcoin position. Beautiful.' },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="gas-border p-5 h-full hover:bg-stink/[0.02] transition-colors">
                  <div className="text-[10px] font-mono text-stink/20 mb-3">STEP_{s.step}</div>
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <div className="font-bungee text-sm text-stink mb-1">{s.title}</div>
                  <div className="text-[11px] font-mono text-fart-tan/50 mb-3">{s.sub}</div>
                  <p className="text-[13px] text-stink/40 leading-relaxed">{s.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 text-2xl">
                    💨
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 gas-border px-5 py-3">
            <span className="text-[11px] font-mono text-stink/30">
              ⚠️ EVERY TRANSACTION ON-CHAIN · VERIFY ON SOLSCAN · DRIFT POSITION IS PUBLIC · WE LITERALLY CANNOT RUG THE FART
            </span>
          </div>
        </div>
      </section>

      <StinkDivider label="WHY FART?" />

      {/* ═══════════════ FARTCOIN TRIBUTE ═══════════════ */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="gas-border p-8 md:p-12 fart-cloud">
            <div className="text-center space-y-6">
              <div className="text-6xl">🫡</div>
              <h2 className="font-bungee text-3xl md:text-5xl text-gas stink-glow">
                In Honor of FART
              </h2>
              <p className="text-lg text-stink/50 max-w-2xl mx-auto leading-relaxed">
                Let&apos;s be real — <span className="text-stink font-bold">Fartcoin</span> is one of the most iconic tokens on Solana.
                It&apos;s literally called Fartcoin. And it rips.
              </p>
              <p className="text-base text-stink/40 max-w-2xl mx-auto leading-relaxed">
                $METHANE doesn&apos;t compete with FART — we <span className="text-stink font-bold">worship</span> it.
                Every dollar of creator fees goes into longing Fartcoin with maximum leverage.
                We are the degenerate fan club that put their money where their gas is.
              </p>
              <p className="text-base text-fart-tan/60 max-w-xl mx-auto italic">
                &quot;Others talk about farts. We leverage them.&quot;
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <a href="https://dexscreener.com/solana/fartcoin" target="_blank" rel="noopener"
                  className="gas-border px-5 py-2.5 font-mono text-sm text-stink hover:bg-stink/10 transition-colors">
                  📊 FART on DexScreener
                </a>
                <a href="https://www.coingecko.com/en/coins/fartcoin" target="_blank" rel="noopener"
                  className="gas-border px-5 py-2.5 font-mono text-sm text-stink hover:bg-stink/10 transition-colors">
                  🦎 FART on CoinGecko
                </a>
                <a href="https://app.drift.trade/perpetuals/FART-PERP" target="_blank" rel="noopener"
                  className="gas-border px-5 py-2.5 font-mono text-sm text-stink hover:bg-stink/10 transition-colors">
                  📈 FART-PERP on Drift
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StinkDivider label="THE MECHANICS" />

      {/* ═══════════════ MECHANICS ═══════════════ */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="font-bungee text-3xl md:text-4xl text-stink stink-glow mb-3">
            Six Ways to Rip
          </h2>
          <p className="text-base text-stink/40 mb-8 max-w-2xl">
            Autonomous on-chain mechanics. No human intervention. Just gas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MECHANICS.map((m, i) => (
              <div key={i} className="gas-border hover:border-stink/30 transition-all group">
                <div className="px-5 py-3 border-b border-stink/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[10px] font-mono text-stink/30 uppercase tracking-wider">
                      MECHANIC_{String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-stink/20 group-hover:text-stink/50 transition-colors">
                    [ ACTIVE ]
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-bungee text-base text-stink">{m.title}</h3>
                  <p className="text-[14px] leading-relaxed text-stink/50">{m.desc}</p>
                  <div className="pt-2 border-t border-stink/5">
                    <p className="text-[11px] font-mono text-stink/20">{m.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StinkDivider label="GAS LOG" />

      {/* ═══════════════ GAS LOG ═══════════════ */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <GasLog />
        </div>
      </section>

      <StinkDivider label="EMISSIONS REPORT" />

      {/* ═══════════════ EMISSIONS REPORT ═══════════════ */}
      <section className="relative z-10 py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="gas-border p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-bungee text-xl text-stink">
                  Weekly Emissions Report #003 💨
                </h3>
                <p className="text-[11px] font-mono text-stink/20 mt-1">
                  REPORTING PERIOD: APR 2 — APR 9, 2026 · PUBLISHED ON-CHAIN · PEER-REVIEWED (by degens)
                </p>
              </div>
              <span className="text-[10px] font-mono text-stink border border-stink/20 px-2 py-1">
                ✅ VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'TOTAL GAS COLLECTED', value: '4.82 SOL', sub: '~$569 of premium gas', color: '#7CFC00' },
                { label: 'FART PERFORMANCE', value: '+7.26%', sub: 'unrealized stink gains', color: '#ADFF2F' },
                { label: 'SUPPLY BURNED', value: '48,200', sub: '0.48% — burnt offering', color: '#FF4444' },
                { label: 'BUYBACK EXECUTED', value: '1.44 SOL', sub: '30% recycled gas', color: '#C49B2F' },
              ].map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-[10px] font-mono text-stink/20">{s.label}</div>
                  <div className="text-2xl font-mono font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[10px] font-mono text-stink/20">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <div className="relative z-10 mt-12">
        <div className="h-px bg-stink/10" />
        <footer className="bg-bg/95 backdrop-blur-sm">
          <div className="max-w-[1200px] mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">💨</span>
                <span className="font-bungee text-sm text-stink/50">$METHANE</span>
                <span className="text-[10px] font-mono text-stink/20">
                  CH₄ · EVERY BUY RIPS A BIGGER FART LONG
                </span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                {[
                  { label: 'PUMP.FUN', href: 'https://pump.fun' },
                  { label: 'DEXSCREENER', href: 'https://dexscreener.com' },
                  { label: 'DRIFT', href: 'https://app.drift.trade' },
                  { label: 'TWITTER', href: '#' },
                  { label: 'SOLSCAN', href: 'https://solscan.io' },
                ].map((l, i) => (
                  <a key={i} href={l.href} target="_blank" rel="noopener" className="text-stink/25 hover:text-stink transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
