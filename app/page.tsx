'use client';

import { useEffect } from 'react';
import FartChart from '@/components/FartChart';
import PositionDashboard from '@/components/PositionDashboard';
import PositionTracker from '@/components/PositionTracker';
import FlywheelDiagram from '@/components/FlywheelDiagram';
import GasLog from '@/components/GasLog';
import SetupFlow from '@/components/SetupFlow';
import { MethaneAscii, FartPerpsAscii } from '@/components/AsciiArt';



function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.01, rootMargin: '0px 0px 100px 0px' });
    els.forEach(el => obs.observe(el));
    const fallback = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
    }, 2000);
    return () => { obs.disconnect(); clearTimeout(fallback); };
  }, []);
}

export default function Home() {
  useScrollReveal();

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>

      {/* NAV */}
      <nav className="flex items-center justify-between" style={{ fontSize: 10, borderBottom: '1px solid var(--border)', padding: '16px 0', marginBottom: 8 }}>
        <div className="flex items-center gap-3">
          <span className="status-dot" />
          <span style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em' }}>$METHANE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {[
            { label: 'pump.fun', href: '#', icon: '/icons/pumpfun.png' },
            { label: 'dexscreener', href: '#', icon: '/icons/dexscreener.png' },
            { label: 'drift', href: 'https://app.drift.trade/perpetuals/FART-PERP', icon: '/icons/drift.png' },
          ].map(l => (
            <a key={l.label} href={l.href}
               target={l.href !== '#' ? '_blank' : undefined} rel={l.href !== '#' ? 'noopener' : undefined}
               style={{ color: 'var(--fg-dim)', fontSize: 11, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none', transition: 'color 0.2s' }}
               onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
               onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}>
              <img src={l.icon} alt={l.label} width={18} height={18} style={{ borderRadius: 3 }} />
              {l.label}
            </a>
          ))}
          <a href="#" style={{ color: 'var(--fg-dim)', display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none', fontSize: 11, transition: 'color 0.2s' }}
             onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
             onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dim)')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            twitter
          </a>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: '60px 0 40px' }} className="text-center">
        <div className="reveal" style={{ marginBottom: 24 }}>
          <MethaneAscii className="text-[12px] sm:text-[15px] md:text-[18px]" style={{ color: 'var(--white)' }} />
        </div>

        <div className="reveal reveal-d1" style={{ fontSize: 10, letterSpacing: '0.3em', color: 'var(--fg-dim)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 16 }}>
          The Infrastructure Layer for Fartcoin
        </div>

        <p className="reveal reveal-d2" style={{ color: 'var(--fg-dark)', fontSize: 12, maxWidth: 520, margin: '0 auto', lineHeight: 1.8 }}>
          Fartcoin has $200M+ market cap, listings everywhere, and zero ecosystem infrastructure.
          <br /><span style={{ color: 'var(--fg-dim)' }}>$METHANE fixes that.</span>
        </p>

        <div className="reveal reveal-d3 panel" style={{ display: 'inline-block', padding: '16px 32px', marginTop: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.15em', marginBottom: 4 }}>CONTRACT ADDRESS</div>
          <div style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700, letterSpacing: '0.03em' }}>TBD — LAUNCHING SOON</div>
        </div>
      </section>

      {/* ═══ § 01 — THE THESIS ═══ */}
      <div className="section-label"><span>§ 01 · THE THESIS</span></div>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="grid-responsive">
          <div>
            <h2 style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700, marginBottom: 16, lineHeight: 1.5 }}>
              Fartcoin is king.<br />It just has no kingdom.
            </h2>
            <p style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.7, marginBottom: 12 }}>
              No infrastructure tokens. No DeFi layer. No ecosystem building on top of it.
              Just a massive, liquid, iconic memecoin — sitting there.
            </p>
            <p style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, marginBottom: 12 }}>
              <span style={{ color: 'var(--white)', fontWeight: 600 }}>$METHANE is the picks-and-shovels play on Fartcoin.</span>{' '}
              We provide autonomous treasury management for any token that wants leveraged FART exposure.
            </p>
            <p style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7 }}>
              Your token generates creator fees. Those fees sit in a wallet doing nothing.
              Route them through METHANE → they become a 5× leveraged FART long on Drift.
              <span style={{ color: 'var(--green)' }}> Your project now has a treasury that grows when FART pumps.</span>
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Why this works */}
            <div className="panel" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.12em', marginBottom: 14 }}>WHY IT WORKS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                {[
                  ['for your project', 'idle fees → leveraged FART treasury'],
                  ['for Fartcoin', 'constant buy pressure from every project'],
                  ['for $METHANE', 'protocol fees on every vault managed'],
                  ['the flywheel', 'more projects → more buying → FART ↑ → more projects'],
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ color: 'var(--fg-dark)', flexShrink: 0 }}>{k}</span>
                    <span style={{ color: i === 3 ? 'var(--green)' : 'var(--accent)', fontWeight: 600, textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fartcoin stats */}
            <div className="panel" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.12em', marginBottom: 14 }}>FARTCOIN ON SOLANA</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                {[
                  ['perp market', 'FART-PERP #71'],
                  ['oracle', 'Pyth Lazer #182'],
                  ['max leverage', '20× on Drift'],
                  ['our leverage', '5× (adjustable)'],
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--fg-dark)' }}>{k}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 16, fontSize: 11 }}>
                <a href="https://dexscreener.com/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump" target="_blank" rel="noopener" className="trace-link">dexscreener ↗</a>
                <a href="https://www.coingecko.com/en/coins/fartcoin" target="_blank" rel="noopener" className="trace-link">coingecko ↗</a>
                <a href="https://app.drift.trade/perpetuals/FART-PERP" target="_blank" rel="noopener" className="trace-link">fart-perp ↗</a>
                <a href="https://truthterminal.wiki/" target="_blank" rel="noopener" className="trace-link">truth terminal ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ § 02 — YOUR VAULT ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 02 · YOUR VAULT</span></div>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <h2 style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700, marginBottom: 6 }}>Every project gets its own vault.</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-dark)', marginBottom: 24, maxWidth: 550 }}>
          Not a shared pool. Your token, your Drift vault, your leveraged FART position, your PnL.
          METHANE manages the strategy. You keep the upside.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="grid-responsive">
          <div className="panel" style={{ padding: '20px 24px' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginBottom: 8 }}>
              <rect x="4" y="8" width="20" height="16" rx="2" stroke="var(--green)" strokeWidth="1.5" />
              <path d="M8 8V6a6 6 0 0112 0v2" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="14" cy="17" r="2" fill="var(--green)" />
              <path d="M14 19v2" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, marginBottom: 6 }}>YOUR VAULT</div>
            <p style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
              Each project gets a dedicated Drift vault. Your fees → your position.
              Isolated from every other project. Your own entry price, your own PnL.
            </p>
          </div>

          <div className="panel" style={{ padding: '20px 24px' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginBottom: 8 }}>
              <circle cx="14" cy="14" r="10" stroke="var(--green)" strokeWidth="1.5" />
              <path d="M14 8v6l4 2" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 6l2-2M22 8l2 0" stroke="var(--green)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, marginBottom: 6 }}>AUTONOMOUS</div>
            <p style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
              The agent runs every 15 minutes. Claims fees, swaps to USDC, deposits to Drift,
              opens or increases your FART long. No manual steps. Ever.
            </p>
          </div>

          <div className="panel" style={{ padding: '20px 24px' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ marginBottom: 8 }}>
              <path d="M4 22L10 14L15 18L24 6" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18 6h6v6" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="7" y="26" fontSize="6" fill="var(--fg-dark)" fontFamily="inherit">5×</text>
            </svg>
            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, marginBottom: 6 }}>5× LEVERAGE</div>
            <p style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
              Your fees earn 5× the FART exposure. $100 in fees → $500 notional FART position.
              When FART moves +10%, your vault moves +50%.
            </p>
          </div>
        </div>

        {/* Pipeline steps */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.12em', marginBottom: 12 }}>THE PIPELINE — EVERY 15 MINUTES</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }} className="grid-responsive">
            {[
              { title: 'COLLECT', lines: ['claim', 'creator', 'fees'] },
              { title: 'SWAP', lines: ['jupiter', 'SOL →', 'USDC'] },
              { title: 'SPLIT', lines: ['70/30', 'long /', 'burn'] },
              { title: 'DEPOSIT', lines: ['drift', 'deposit', 'USDC'] },
              { title: 'LONG', lines: ['FART-', 'PERP', '5×'] },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="panel" style={{ padding: '16px 14px', flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>{step.title}</div>
                  {step.lines.map((l, j) => (
                    <div key={j} style={{ fontSize: 10, color: 'var(--fg-dark)', lineHeight: 1.5 }}>{l}</div>
                  ))}
                </div>
                {i < 4 && <span style={{ color: 'var(--fg-dark)', fontSize: 12, padding: '0 4px', flexShrink: 0 }}>→</span>}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9, color: 'var(--fg-dark)', textAlign: 'center', marginTop: 12, letterSpacing: '0.1em' }}>
            ALL TXS ON-CHAIN · VERIFY ON SOLSCAN · POSITION IS PUBLIC · EACH VAULT IS ISOLATED
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ § 03 — MARKET DATA ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 03 · MARKET DATA</span></div>

      <section className="reveal" style={{ paddingBottom: 16 }}>
        <div className="hide-mobile" style={{ marginBottom: 20 }}>
          <FartPerpsAscii className="text-[8px] sm:text-[9px] md:text-[11px]" style={{ color: 'var(--fg)' }} />
        </div>
        <FartChart />
      </section>

      <section className="reveal" style={{ paddingBottom: 16 }}>
        <PositionDashboard />
      </section>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <PositionTracker />
      </section>

      <hr className="divider" />

      {/* ═══ § 04 — THE FLYWHEEL ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 04 · THE FLYWHEEL</span></div>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <h2 style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700, marginBottom: 6 }}>Everyone wins. That&apos;s the point.</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-dark)', marginBottom: 8, maxWidth: 550 }}>
          Every project that plugs in creates FART buy pressure. FART goes up. All vaults grow.
          More projects want in. The flywheel spins faster.
        </p>

        <FlywheelDiagram />

        {/* Who benefits grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }} className="grid-responsive">
          <div className="panel" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>YOUR PROJECT</div>
            <div style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
              Idle creator fees → leveraged FART treasury. Your token now has a growing war chest that compounds automatically.
            </div>
          </div>
          <div className="panel" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>FARTCOIN</div>
            <div style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
              Constant buy pressure from every plugged-in project. More projects = more buying = price goes up. METHANE is Fartcoin&apos;s growth engine.
            </div>
          </div>
          <div className="panel" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>$METHANE HOLDERS</div>
            <div style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
              Protocol fee on every vault managed. More vaults = more protocol revenue. $METHANE is the infrastructure bet on the entire Fartcoin ecosystem.
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ § 05 — MECHANICS ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 05 · MECHANICS</span></div>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="grid-responsive">
          {[
            { name: 'digestive_tract', desc: 'Core pipeline loop', specs: ['cycle: every 15 min', 'min claim: 0.05 SOL', 'route: jupiter v6', 'market: FART-PERP #71', 'oracle: pyth lazer #182'] },
            { name: 'burn_on_rip', desc: 'Deflationary on profit', specs: ['trigger: +15% unrealized PnL', 'burn: 0.5% total supply', 'source: 30% buyback alloc', 'dest: solana null address', 'freq: per take-profit'] },
            { name: 'the_blowoff', desc: 'Profit distribution', specs: ['milestones: 2×, 5×, 10× PnL', 'payout: 30% realized gains', 'eligible: top 500 holders', 'snapshot: on milestone block', 'delivery: direct SPL transfer'] },
            { name: 'critical_mass', desc: 'Governance scaling', specs: ['$100K MC → 3× vote', '$500K MC → 5× vote', '$1M MC → 7× vote', 'governance: SPL Realms', 'execution: 24h quorum'] },
            { name: 'composting', desc: 'Yield from funding', specs: ['funding: hourly on drift', 'positive → compounds', 'negative → from collateral', 'staker yield: 50% net', 'claim: permissionless'] },
            { name: 'chain_reaction', desc: 'Liquidation recovery', specs: ['liquidation → 1h cooldown', 're-entry: market order', 'uses: remaining + new fees', 'reset leverage: 3×', 'community vote to escalate'] },
          ].map((m, i) => (
            <div key={i} className="panel" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{m.name}</span>
                <span style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.05em' }}>{m.desc}</span>
              </div>
              {m.specs.map((s, j) => (
                <div key={j} style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.7 }}>
                  <span style={{ color: 'var(--fg-dark)', marginRight: 6 }}>›</span>{s}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ § 06 — PLUG IN ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 06 · PLUG IN</span></div>

      <section className="reveal" style={{ paddingBottom: 48 }}>
        <h2 style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700, marginBottom: 6 }}>Get your own FART vault.</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-dark)', marginBottom: 24, maxWidth: 500 }}>
          Verify your token. Configure fee routing. METHANE creates your dedicated Drift vault and starts the pipeline. Your fees start working in 15 minutes.
        </p>

        <SetupFlow />
      </section>

      <hr className="divider" />

      {/* ═══ § 07 — GAS LOG ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 07 · GAS LOG</span></div>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <GasLog />
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: 'var(--fg-dark)' }}>
        <span>$METHANE · the infrastructure layer for fartcoin · 2026</span>
        <div style={{ display: 'flex', gap: 16 }}>
          {['pump.fun', 'dexscreener', 'drift', 'solscan'].map(l => (
            <a key={l} href="#" className="trace-link" style={{ color: 'var(--fg-dark)' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
