import FartChart from '@/components/FartChart';
import PositionDashboard from '@/components/PositionDashboard';
import GasLog from '@/components/GasLog';

const ASCII_HERO = `
     __ __  _________________  _____    _   ________
   _/ //  |/  / ____/_  __/ / / /   |  / | / / ____/
  / __/ /|_/ / __/   / / / /_/ / /| | /  |/ / __/   
 (_  ) /  / / /___  / / / __  / ___ |/ /|  / /___   
/  _/_/  /_/_____/ /_/ /_/ /_/_/  |_/_/ |_/_____/   
/_/
`;

const ASCII_FART = `
    _________    ____  ______    ____  __________  ____ 
   / ____/   |  / __ \\/_  __/   / __ \\/ ____/ __ \\/ __ \\
  / /_  / /| | / /_/ / / /_____/ /_/ / __/ / /_/ / /_/ /
 / __/ / ___ |/ _, _/ / /_____/ ____/ /___/ _, _/ ____/ 
/_/   /_/  |_/_/ |_| /_/     /_/   /_____/_/ |_/_/      
`;

export default function Home() {
  return (
    <main>
      {/* HEADER */}
      <nav className="flex items-center justify-between text-xs text-dimmer mb-8">
        <span>$METHANE</span>
        <span className="flex gap-4">
          <a href="#">pump.fun</a>
          <a href="#">dexscreener</a>
          <a href="https://app.drift.trade/perpetuals/FART-PERP" target="_blank" rel="noopener">drift</a>
          <a href="#">twitter</a>
        </span>
      </nav>

      {/* HERO */}
      <pre className="text-accent text-[10px] sm:text-[12px] md:text-[14px] leading-tight select-none whitespace-pre overflow-x-auto">{ASCII_HERO}</pre>
      
      <p className="text-dim text-xs mt-2 mb-1">gas pipeline as a service</p>
      <p className="text-dimmer text-xs mb-6">
        creator fees → USDC → 5x leveraged fartcoin long on drift protocol.
        <br />autonomous. on-chain. verifiable. any token can plug in.
      </p>

      <div className="bg-block mb-8">
        <span className="text-dimmer text-xs">CA: </span>
        <span className="text-accent text-sm">TBD — launching soon</span>
      </div>

      <hr />

      {/* WHY FART */}
      <section className="my-8">
        <pre className="text-dim text-[7px] sm:text-[8px] md:text-[9px] leading-tight select-none whitespace-pre overflow-x-auto mb-4">{ASCII_FART}</pre>

        <p className="text-dim text-sm mb-3">
          <span className="text-accent">fartcoin</span> is one of the most iconic tokens on solana. 
          $200M+ market cap. listed everywhere. born from{' '}
          <a href="https://truthterminal.wiki/" target="_blank" rel="noopener">truth terminal</a>.
          a cultural monument to on-chain degeneracy.
        </p>
        <p className="text-dimmer text-sm mb-4">
          $METHANE doesn&apos;t compete with FART — we <span className="text-accent">long</span> it. 
          every fee we collect becomes leveraged FART exposure on drift. 
          when FART pumps, we pump harder. that&apos;s the whole game.
        </p>

        <div className="bg-block text-xs">
          <div className="grid grid-cols-2 gap-y-2 gap-x-8">
            <div><span className="text-dimmer">perp market </span><span className="text-accent">FART-PERP #71</span></div>
            <div><span className="text-dimmer">oracle      </span><span className="text-accent">Pyth Lazer #182</span></div>
            <div><span className="text-dimmer">max leverage </span><span className="text-accent">20x on Drift</span></div>
            <div><span className="text-dimmer">our leverage </span><span className="text-accent">5x (adjustable)</span></div>
          </div>
          <div className="mt-3 pt-3 border-t border-subtle flex gap-4">
            <a href="https://dexscreener.com/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump" target="_blank" rel="noopener" className="text-xs">dexscreener →</a>
            <a href="https://www.coingecko.com/en/coins/fartcoin" target="_blank" rel="noopener" className="text-xs">coingecko →</a>
            <a href="https://app.drift.trade/perpetuals/FART-PERP" target="_blank" rel="noopener" className="text-xs">fart-perp →</a>
            <a href="https://truthterminal.wiki/" target="_blank" rel="noopener" className="text-xs">truth terminal →</a>
          </div>
        </div>
      </section>

      <hr />

      {/* HOW IT WORKS */}
      <section className="my-8">
        <h2 className="text-accent text-sm mb-1">HOW IT WORKS</h2>
        <p className="text-dimmer text-xs mb-4">five steps. every 15 minutes. fully autonomous.</p>

        <pre className="bg-block text-xs leading-relaxed whitespace-pre overflow-x-auto">{`
  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
  │ COLLECT  │───▶│  SWAP   │───▶│  SPLIT  │───▶│ DEPOSIT │───▶│  LONG   │
  │          │    │         │    │         │    │         │    │         │
  │ claim    │    │ jupiter │    │ 70/30   │    │ drift   │    │ FART-   │
  │ creator  │    │ SOL →   │    │ long /  │    │ deposit │    │ PERP    │
  │ fees     │    │ USDC    │    │ burn    │    │ USDC    │    │ 5x      │
  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
`}</pre>

        <p className="text-dimmest text-[10px] mt-2 text-center">
          all txs on-chain · verify on solscan · position is public · agent wallet is read-only
        </p>
      </section>

      <hr />

      {/* CHART */}
      <section className="my-8">
        <h2 className="text-accent text-sm mb-4">FART/USD</h2>
        <FartChart />
      </section>

      {/* LIVE MARKET DATA */}
      <section className="my-8">
        <PositionDashboard />
      </section>

      <hr />

      {/* MECHANICS */}
      <section className="my-8">
        <h2 className="text-accent text-sm mb-4">MECHANICS</h2>

        <div className="space-y-3 text-xs">
          {[
            {
              name: 'digestive_tract',
              specs: ['cycle: every 15 min', 'min claim: 0.05 SOL', 'route: jupiter v6', 'market: FART-PERP #71', 'oracle: pyth lazer #182'],
            },
            {
              name: 'burn_on_rip',
              specs: ['trigger: +15% unrealized PnL', 'burn: 0.5% total supply', 'source: 30% buyback alloc', 'dest: solana null address', 'freq: per take-profit'],
            },
            {
              name: 'the_blowoff',
              specs: ['milestones: 2x, 5x, 10x PnL', 'payout: 30% realized gains', 'eligible: top 500 holders', 'snapshot: on milestone block', 'delivery: direct SPL transfer'],
            },
            {
              name: 'critical_mass',
              specs: ['$100K MC → 3x vote weight', '$500K MC → 5x vote weight', '$1M MC → 7x vote weight', 'governance: SPL Realms', 'execution: 24h quorum'],
            },
            {
              name: 'composting',
              specs: ['funding: hourly on drift', 'positive → compounds', 'negative → from collateral', 'staker yield: 50% net', 'claim: permissionless'],
            },
            {
              name: 'chain_reaction',
              specs: ['liquidation → 1h cooldown', 're-entry: market order', 'uses: remaining + new fees', 'reset leverage: 3x', 'community vote to escalate'],
            },
          ].map((m, i) => (
            <div key={i} className="bg-block">
              <div className="text-accent mb-1">
                <span className="text-dimmer">{'// '}</span>{m.name}
              </div>
              {m.specs.map((s, j) => (
                <div key={j} className="text-dimmer">
                  <span className="text-dimmest">  ├ </span>{s}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <hr />

      {/* GPAAS */}
      <section className="my-8">
        <h2 className="text-accent text-sm mb-1">FOR YOUR TOKEN</h2>
        <p className="text-dimmer text-xs mb-4">
          $METHANE is infrastructure. any project on solana can route creator fees 
          into the shared FART vault. no code. no setup.
        </p>

        <pre className="bg-block text-xs leading-relaxed whitespace-pre overflow-x-auto">{`
  1. CONNECT    register your creator wallet
                set fee routing percentage

  2. PIPELINE   agent monitors your wallet
                claims → swaps → deposits to drift vault
                fully automatic

  3. EARN       proportional exposure to 5x FART long
                live dashboard + embeddable widget
                real PnL, real yield
`}</pre>

        <div className="bg-block mt-3">
          <div className="text-xs text-dimmer mb-2">
            <span className="text-dimmest">{'// '}</span>the flywheel
          </div>
          <pre className="text-xs text-dim leading-relaxed">{`  more partners → more fees → bigger vault → better returns
       ↑                                            │
       └────────────────────────────────────────────┘

  FART gets buy pressure ↑
  $METHANE burns on profit ↓
  partners earn yield ↑`}</pre>
        </div>
      </section>

      <hr />

      {/* GAS LOG */}
      <section className="my-8">
        <GasLog />
      </section>

      {/* FOOTER */}
      <footer className="mt-12 mb-4 text-dimmest text-[10px] flex justify-between">
        <span>$METHANE · gas pipeline as a service</span>
        <span className="flex gap-3">
          <a href="#">pump.fun</a>
          <a href="#">dexscreener</a>
          <a href="#">drift</a>
          <a href="#">solscan</a>
        </span>
      </footer>
    </main>
  );
}
