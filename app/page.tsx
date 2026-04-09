import FartChart from '@/components/FartChart';
import PositionDashboard from '@/components/PositionDashboard';
import GasLog from '@/components/GasLog';
import { MethaneAscii, FartPerpsAscii } from '@/components/AsciiArt';

const ASCII_HERO = `     __ __  _________________  _____    _   ________
   _/ //  |/  / ____/_  __/ / / /   |  / | / / ____/
  / __/ /|_/ / __/   / / / /_/ / /| | /  |/ / __/   
 (_  ) /  / / /___  / / / __  / ___ |/ /|  / /___   
/  _/_/  /_/_____/ /_/ /_/ /_/_/  |_/_/ |_/_____/   
/_/`;

const ASCII_FART = `   _________    ____  ______    ____  __________  ____ 
  / ____/   |  / __ \\/_  __/   / __ \\/ ____/ __ \\/ __ \\
 / /_  / /| | / /_/ / / /_____/ /_/ / __/ / /_/ / /_/ /
/ __/ / ___ |/ _, _/ / /_____/ ____/ /___/ _, _/ ____/ 
/_/   /_/  |_/_/ |_| /_/     /_/   /_____/_/ |_/_/`;

const PIPELINE_ASCII = `   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │          │     │          │     │          │     │          │     │          │
   │ COLLECT  │────▶│   SWAP   │────▶│  SPLIT   │────▶│ DEPOSIT  │────▶│   LONG   │
   │          │     │          │     │          │     │          │     │          │
   │ claim    │     │ jupiter  │     │  70/30   │     │  drift   │     │ FART-    │
   │ creator  │     │ SOL →    │     │ long  /  │     │ deposit  │     │ PERP     │
   │ fees     │     │ USDC     │     │ burn     │     │ USDC     │     │ 5x       │
   │          │     │          │     │          │     │          │     │          │
   └──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘`;

export default function Home() {
  return (
    <main>
      {/* NAV */}
      <nav className="flex items-center justify-between py-4 text-[10px] text-dimmer">
        <span className="text-dim font-semibold tracking-wider">$METHANE</span>
        <span className="flex gap-5">
          <a href="#">pump.fun</a>
          <a href="#">dexscreener</a>
          <a href="https://app.drift.trade/perpetuals/FART-PERP" target="_blank" rel="noopener">drift</a>
          <a href="#">twitter</a>
        </span>
      </nav>

      <hr />

      {/* ═══ HERO ═══ */}
      <section className="section flex flex-col items-center text-center">
        <div className="text-accent text-[11px] sm:text-[14px] md:text-[17px] font-bold">
          <MethaneAscii />
        </div>

        <div className="mt-6 mb-1 text-[11px] tracking-[0.25em] text-dim font-medium uppercase">
          Gas Pipeline as a Service
        </div>
        <p className="text-dimmer text-[12px] max-w-[520px] leading-relaxed mt-2">
          creator fees → USDC → 5× leveraged fartcoin long on drift protocol.
          <br />autonomous. on-chain. verifiable. <span className="text-dim">any token can plug in.</span>
        </p>

        <div className="block-panel mt-8 inline-block text-center">
          <span className="text-dimmest text-[10px] tracking-wider">CONTRACT ADDRESS</span>
          <div className="text-accent text-[14px] font-bold mt-1 tracking-wide">TBD — LAUNCHING SOON</div>
        </div>
      </section>

      <div className="divider-label">§ 01</div>

      {/* ═══ WHY FART ═══ */}
      <section className="section">
        <div className="text-dim text-[8px] sm:text-[9px] md:text-[10px] overflow-x-auto mb-6">
          <FartPerpsAscii />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-8">
          <div>
            <p className="text-[13px] text-dim leading-relaxed mb-3">
              <span className="text-accent font-semibold">Fartcoin</span> is one of the most iconic tokens on Solana.
              $200M+ market cap. Listed everywhere. Born from{' '}
              <a href="https://truthterminal.wiki/" target="_blank" rel="noopener">Truth Terminal</a>.
              A cultural monument to on-chain degeneracy.
            </p>
            <p className="text-dimmer text-[13px] leading-relaxed">
              $METHANE doesn&apos;t compete with FART — we <span className="text-accent font-semibold">long</span> it.
              Every fee we collect becomes leveraged FART exposure on Drift.
              When FART pumps, we pump harder. That&apos;s the whole game.
            </p>
          </div>

          <div className="hidden md:block bg-[var(--border)]" />

          <div className="block-panel">
            <div className="text-[10px] text-dimmest tracking-wider mb-4">FARTCOIN ON SOLANA</div>
            <div className="space-y-2.5 text-[12px]">
              {[
                ['perp market', 'FART-PERP #71'],
                ['oracle', 'Pyth Lazer #182'],
                ['max leverage', '20× on Drift'],
                ['our leverage', '5× (adjustable)'],
              ].map(([k, v], i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-dimmer">{k}</span>
                  <span className="text-accent font-semibold">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-subtle flex flex-wrap gap-4 text-[11px]">
              <a href="https://dexscreener.com/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump" target="_blank" rel="noopener">dexscreener ↗</a>
              <a href="https://www.coingecko.com/en/coins/fartcoin" target="_blank" rel="noopener">coingecko ↗</a>
              <a href="https://app.drift.trade/perpetuals/FART-PERP" target="_blank" rel="noopener">fart-perp ↗</a>
              <a href="https://truthterminal.wiki/" target="_blank" rel="noopener">truth terminal ↗</a>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-label">§ 02</div>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section">
        <div className="section-title">How It Works</div>
        <p className="text-dimmer text-[12px] mb-6">Five steps. Every 15 minutes. Fully autonomous.</p>

        <div className="block-panel overflow-x-auto">
          <pre className="text-[9px] md:text-[10px] text-dim leading-[1.4] whitespace-pre select-none">{PIPELINE_ASCII}</pre>
        </div>

        <p className="text-dimmest text-[10px] mt-3 text-center tracking-wider">
          ALL TXS ON-CHAIN · VERIFY ON SOLSCAN · POSITION IS PUBLIC · AGENT WALLET IS READ-ONLY
        </p>
      </section>

      <div className="divider-label">§ 03</div>

      {/* ═══ CHART ═══ */}
      <section className="section">
        <div className="section-title">FART / USD</div>
        <FartChart />
      </section>

      {/* ═══ LIVE DATA ═══ */}
      <section className="pb-8">
        <PositionDashboard />
      </section>

      <div className="divider-label">§ 04</div>

      {/* ═══ MECHANICS ═══ */}
      <section className="section">
        <div className="section-title">Mechanics</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              name: 'digestive_tract',
              desc: 'Core pipeline loop',
              specs: ['cycle: every 15 min', 'min claim: 0.05 SOL', 'route: jupiter v6', 'market: FART-PERP #71', 'oracle: pyth lazer #182'],
            },
            {
              name: 'burn_on_rip',
              desc: 'Deflationary on profit',
              specs: ['trigger: +15% unrealized PnL', 'burn: 0.5% total supply', 'source: 30% buyback alloc', 'dest: solana null address', 'freq: per take-profit'],
            },
            {
              name: 'the_blowoff',
              desc: 'Profit distribution',
              specs: ['milestones: 2×, 5×, 10× PnL', 'payout: 30% realized gains', 'eligible: top 500 holders', 'snapshot: on milestone block', 'delivery: direct SPL transfer'],
            },
            {
              name: 'critical_mass',
              desc: 'Governance scaling',
              specs: ['$100K MC → 3× vote', '$500K MC → 5× vote', '$1M MC → 7× vote', 'governance: SPL Realms', 'execution: 24h quorum'],
            },
            {
              name: 'composting',
              desc: 'Yield from funding',
              specs: ['funding: hourly on drift', 'positive → compounds', 'negative → from collateral', 'staker yield: 50% net', 'claim: permissionless'],
            },
            {
              name: 'chain_reaction',
              desc: 'Liquidation recovery',
              specs: ['liquidation → 1h cooldown', 're-entry: market order', 'uses: remaining + new fees', 'reset leverage: 3×', 'community vote to escalate'],
            },
          ].map((m, i) => (
            <div key={i} className="block-panel">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-accent text-[12px] font-semibold">{m.name}</span>
                <span className="text-dimmest text-[10px]">{m.desc}</span>
              </div>
              <div className="space-y-0.5">
                {m.specs.map((s, j) => (
                  <div key={j} className="text-[11px] text-dimmer">
                    <span className="text-dimmest mr-1.5">›</span>{s}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider-label">§ 05</div>

      {/* ═══ GPAAS ═══ */}
      <section className="section">
        <div className="section-title">For Your Token</div>
        <p className="text-dimmer text-[12px] mb-6 max-w-[520px]">
          $METHANE is infrastructure. Any project on Solana can route creator fees
          into the shared FART vault. No code. No setup.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {[
            { n: '01', title: 'CONNECT', lines: ['register your creator wallet', 'set fee routing percentage'] },
            { n: '02', title: 'PIPELINE', lines: ['agent monitors your wallet', 'claims → swaps → deposits', 'fully automatic'] },
            { n: '03', title: 'EARN', lines: ['proportional 5× FART exposure', 'live dashboard + widget', 'real PnL, real yield'] },
          ].map((step, i) => (
            <div key={i} className="block-panel">
              <div className="flex items-baseline gap-2 mb-2.5">
                <span className="text-dimmest text-[10px]">{step.n}</span>
                <span className="text-accent text-[11px] font-semibold tracking-wider">{step.title}</span>
              </div>
              {step.lines.map((line, j) => (
                <div key={j} className="text-[11px] text-dimmer leading-relaxed">{line}</div>
              ))}
            </div>
          ))}
        </div>

        <div className="block-inset">
          <div className="text-[10px] text-dimmest tracking-wider mb-3">THE FLYWHEEL</div>
          <pre className="text-[11px] text-dim leading-relaxed whitespace-pre">{`  more partners → more fees → bigger vault → better returns
       ↑                                            │
       └────────────────────────────────────────────┘`}</pre>
          <div className="mt-3 pt-3 border-t border-subtle text-[11px] text-dimmer space-y-0.5">
            <div>FART gets buy pressure <span className="text-green">↑</span></div>
            <div>$METHANE burns on profit <span className="text-red">↓</span></div>
            <div>partners earn yield <span className="text-green">↑</span></div>
          </div>
        </div>
      </section>

      <div className="divider-label">§ 06</div>

      {/* ═══ GAS LOG ═══ */}
      <section className="section">
        <GasLog />
      </section>

      {/* FOOTER */}
      <hr />
      <footer className="py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-dimmest">
        <span>$METHANE · gas pipeline as a service · 2026</span>
        <span className="flex gap-4">
          <a href="#">pump.fun</a>
          <a href="#">dexscreener</a>
          <a href="#">drift</a>
          <a href="#">solscan</a>
        </span>
      </footer>
    </main>
  );
}
