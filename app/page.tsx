'use client';

import { useEffect } from 'react';
import FartChart from '@/components/FartChart';
import PositionDashboard from '@/components/PositionDashboard';
import PositionTracker from '@/components/PositionTracker';
import ProtocolStats from '@/components/ProtocolStats';
import BurnTracker from '@/components/BurnTracker';
import FlywheelDiagram from '@/components/FlywheelDiagram';
import GasLog from '@/components/GasLog';
import SetupFlow from '@/components/SetupFlow';
import { MethaneAscii, FartPerpsAscii } from '@/components/AsciiArt';
import Nav from '@/components/Nav';



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

      <Nav />

      {/* ═══ HERO ═══ */}
      <section style={{ padding: '60px 0 40px' }} className="text-center">
        <div className="reveal" style={{ marginBottom: 24 }}>
          <MethaneAscii className="text-[12px] sm:text-[15px] md:text-[18px]" style={{ color: 'var(--white)' }} />
        </div>

        <div className="reveal reveal-d1" style={{ fontSize: 10, letterSpacing: '0.3em', color: 'var(--fg-dim)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 16 }}>
          Gas as a Service
        </div>

        <p className="reveal reveal-d2" style={{ color: 'var(--fg)', fontSize: 13, maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
          Open-source tools that turn idle creator fees into leveraged Fartcoin exposure.
          <br /><span style={{ color: 'var(--fg-dim)' }}>Built for builders. Free to plug in. Your vault, your upside.</span>
        </p>

        <div className="reveal reveal-d3 panel" style={{ display: 'inline-block', padding: '16px 32px', marginTop: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.15em', marginBottom: 4 }}>CONTRACT ADDRESS</div>
          <div style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700, letterSpacing: '0.03em' }}>TBD — LAUNCHING SOON</div>
        </div>
      </section>

      {/* ═══ § 01 — WHY WE BUILT THIS ═══ */}
      <div className="section-label"><span>§ 01 · WHY WE BUILT THIS</span></div>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="grid-responsive">
          <div>
            <img
              src="/methane-logo.png"
              alt="$METHANE"
              style={{ width: 120, height: 120, opacity: 0.85, marginBottom: 20, filter: 'grayscale(0.15)' }}
            />
            <h2 style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700, marginBottom: 16, lineHeight: 1.5 }}>
              Fartcoin deserves an ecosystem.
            </h2>
            <p style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.7, marginBottom: 12 }}>
              $200M+ market cap. Listed everywhere. Born from{' '}
              <a href="https://truthterminal.wiki/" target="_blank" rel="noopener" className="trace-link" style={{ color: 'var(--fg-dim)' }}>Truth Terminal</a>.
              But no one is building infrastructure for it. No tools. No DeFi layer. No way for other projects to tap into FART&apos;s momentum.
            </p>
            <p style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7, marginBottom: 12 }}>
              We built $METHANE to fix that. It&apos;s a set of open-source tools that let <span style={{ color: 'var(--white)', fontWeight: 600 }}>any token on Solana</span> turn
              their idle creator fees into leveraged Fartcoin exposure through Lavarage.
            </p>
            <p style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7 }}>
              We&apos;re not here to extract. We&apos;re here to give projects tools that actually work —
              tools that grow their treasury, create buy pressure on FART, and strengthen the whole ecosystem.
              <span style={{ color: 'var(--green)' }}> Everyone benefits. That&apos;s the point.</span>
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* What you get — direct, plain language */}
            <div className="panel" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.12em', marginBottom: 14 }}>WHAT YOU GET</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
                {[
                  ['your own leveraged vault', 'isolated position, your PnL'],
                  ['autonomous pipeline', 'claims + leverages every 15 min'],
                  ['5× FART leverage', '$100 fees → $500 notional position'],
                  ['on-chain & verifiable', 'every tx public on Solscan'],
                  ['free to plug in', 'no upfront cost, no lock-in'],
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600, flexShrink: 0 }}>{k}</span>
                    <span style={{ color: 'var(--fg-dim)', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Be direct about risks too */}
            <div className="panel" style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.12em', marginBottom: 14 }}>BE AWARE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--fg-dim)' }}>
                <div><span style={{ color: 'var(--red)', marginRight: 6 }}>›</span>Leverage amplifies losses too — 5× means a 20% FART drop could liquidate</div>
                <div><span style={{ color: 'var(--red)', marginRight: 6 }}>›</span>Borrowing costs (APR) apply — you pay interest on the leveraged portion</div>
                <div><span style={{ color: 'var(--red)', marginRight: 6 }}>›</span>Smart contract risk exists on Lavarage, Jupiter, and our pipeline</div>
                <div><span style={{ color: 'var(--fg-dark)', marginRight: 6 }}>›</span>Liquidation recovery is built in — agent re-enters at lower leverage after cooldown</div>
              </div>
            </div>

            {/* Fartcoin stats */}
            <div className="panel" style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', gap: 16, fontSize: 11, flexWrap: 'wrap' }}>
                <a href="https://dexscreener.com/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump" target="_blank" rel="noopener" className="trace-link">dexscreener ↗</a>
                <a href="https://www.coingecko.com/en/coins/fartcoin" target="_blank" rel="noopener" className="trace-link">coingecko ↗</a>
                <a href="https://lavarage.xyz" target="_blank" rel="noopener" className="trace-link">lavarage ↗</a>
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
        <h2 style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700, marginBottom: 6 }}>Your token. Your vault. Your upside.</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-dark)', marginBottom: 24, maxWidth: 580 }}>
          We don&apos;t pool your fees with everyone else. Each project gets a dedicated leveraged vault —
          your own isolated position with your own entry price and PnL. The tools are open. The code is public. You can verify every transaction.
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
              Each project gets a dedicated leveraged vault. Your fees → your position.
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
              The agent runs every 15 minutes. Claims fees, deposits SOL collateral to Lavarage,
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }} className="grid-responsive">
            {[
              { title: 'COLLECT', lines: ['claim', 'creator', 'fees'] },
              { title: 'SPLIT', lines: ['70/30', 'long /', 'burn'] },
              { title: 'LEVERAGE', lines: ['lavarage', 'SOL →', '5× FART'] },
              { title: 'HOLD', lines: ['real', 'FART', 'tokens'] },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="panel" style={{ padding: '16px 14px', flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 6 }}>{step.title}</div>
                  {step.lines.map((l, j) => (
                    <div key={j} style={{ fontSize: 10, color: 'var(--fg-dark)', lineHeight: 1.5 }}>{l}</div>
                  ))}
                </div>
                {i < 3 && <span style={{ color: 'var(--fg-dark)', fontSize: 12, padding: '0 4px', flexShrink: 0 }}>→</span>}
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
        <ProtocolStats />
      </section>

      <hr className="divider" />

      {/* ═══ § 04 — THE FLYWHEEL ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 04 · THE FLYWHEEL</span></div>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <h2 style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700, marginBottom: 6 }}>The more projects plug in, the stronger everyone gets.</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-dark)', marginBottom: 8, maxWidth: 580 }}>
          Every project that joins creates FART buy pressure. FART goes up. All vaults grow.
          It&apos;s not zero-sum — every new participant makes the ecosystem stronger for everyone already in it.
        </p>

        <FlywheelDiagram />

        {/* Who benefits grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }} className="grid-responsive">
          <div className="panel" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>YOUR PROJECT</div>
            <div style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
              Your idle fees stop sitting in a wallet doing nothing. They become a treasury that grows when FART pumps. No extra work on your end.
            </div>
          </div>
          <div className="panel" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>FARTCOIN</div>
            <div style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
              Every project that plugs in creates real buy pressure on FART. We&apos;re building the demand layer that Fartcoin has been missing.
            </div>
          </div>
          <div className="panel" style={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>THE SPACE</div>
            <div style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
              Open-source tools anyone can use or fork. We want more people building on this — the ecosystem gets stronger with every contributor.
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
            { name: 'digestive_tract', desc: 'Core pipeline loop', specs: ['cycle: every 15 min', 'min claim: 0.05 SOL', 'venue: lavarage', 'leverage: up to 7.5×', 'collateral: SOL'],
              detail: 'The core loop that powers everything. Every 15 minutes, the agent checks your creator fee wallet. If there\'s at least 0.05 SOL worth of fees, it claims them, uses the SOL as collateral on Lavarage to open a leveraged long — borrowing more SOL and buying real FART tokens on-chain. Fully autonomous — no manual intervention needed.' },
            { name: 'burn_on_rip', desc: 'Deflationary on profit', specs: ['trigger: +15% unrealized PnL', 'burn: 0.5% total supply', 'source: 30% buyback alloc', 'dest: solana null address', 'freq: per take-profit'],
              detail: 'When FART pumps and your vault hits +15% unrealized PnL, the agent takes profit on a portion and uses the 30% buyback allocation to buy $METHANE tokens and send them to the Solana null address — permanently removing them from supply. The more FART pumps, the more $METHANE gets burned.' },
            { name: 'the_blowoff', desc: 'Profit distribution', specs: ['milestones: 2×, 5×, 10× PnL', 'payout: 30% realized gains', 'eligible: top 500 holders', 'snapshot: on milestone block', 'delivery: direct SPL transfer'],
              detail: 'At major PnL milestones (2×, 5×, 10×), the agent realizes 30% of gains and distributes them directly to the top 500 $METHANE holders via SPL token transfer. A snapshot is taken at the milestone block to determine eligibility. Bigger bag = bigger share. Rewards for holding through the run.' },
            { name: 'critical_mass', desc: 'Governance scaling', specs: ['$100K MC → 3× vote', '$500K MC → 5× vote', '$1M MC → 7× vote', 'governance: SPL Realms', 'execution: 24h quorum'],
              detail: 'As $METHANE grows, governance power scales up. At $100K market cap, each token gets 3× voting weight. At $1M, 7×. This means early holders who believe in the project get outsized governance influence. Proposals go through SPL Realms with a 24-hour quorum period. Community decides leverage levels, fee splits, and new mechanics.' },
            { name: 'composting', desc: 'Borrowing costs', specs: ['interest: ~99% APR', 'on borrowed SOL only', 'deducted from collateral', 'monitored by agent', 'auto-close if unprofitable'],
              detail: 'Lavarage charges interest on the borrowed portion of your position (currently ~99% APR). This is the cost of leverage. When FART goes up, your gains outpace the interest. When it goes sideways, interest eats into your collateral. The agent monitors this and will close positions if the cost exceeds projected returns.' },
            { name: 'chain_reaction', desc: 'Liquidation recovery', specs: ['liquidation → 1h cooldown', 're-entry: market order', 'uses: remaining + new fees', 'reset leverage: 3×', 'community vote to escalate'],
              detail: 'If FART drops hard enough to liquidate the position, the agent doesn\'t panic. It waits 1 hour for volatility to settle, then re-enters with whatever collateral remains plus any new fees that came in during cooldown. Re-entry uses 3× leverage (lower than the normal 5×) for safety. Community can vote to increase leverage back up once conditions stabilize.' },
          ].map((m, i) => (
            <div key={i} className="panel mechanic-card" style={{ padding: '16px 20px', position: 'relative', cursor: 'default' }}
              onMouseEnter={e => {
                const tip = e.currentTarget.querySelector('.mechanic-tooltip') as HTMLElement;
                if (tip) { tip.style.opacity = '1'; tip.style.transform = 'translateY(0)'; tip.style.pointerEvents = 'auto'; }
              }}
              onMouseLeave={e => {
                const tip = e.currentTarget.querySelector('.mechanic-tooltip') as HTMLElement;
                if (tip) { tip.style.opacity = '0'; tip.style.transform = 'translateY(4px)'; tip.style.pointerEvents = 'none'; }
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{m.name}</span>
                <span style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.05em' }}>{m.desc} <span style={{ opacity: 0.4 }}>ⓘ</span></span>
              </div>
              {m.specs.map((s, j) => (
                <div key={j} style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.7 }}>
                  <span style={{ color: 'var(--fg-dark)', marginRight: 6 }}>›</span>{s}
                </div>
              ))}
              {/* Tooltip — overlays above card */}
              <div className="mechanic-tooltip" style={{
                position: 'absolute', left: -1, right: -1, bottom: '100%', zIndex: 50,
                marginBottom: 8, padding: '16px 20px',
                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 2,
                boxShadow: '0 -4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
                fontSize: 11, color: 'var(--fg)', lineHeight: 1.8, letterSpacing: '0.01em',
                opacity: 0, pointerEvents: 'none',
                transform: 'translateY(4px)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}>
                <div style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>{m.name} — how it works</div>
                {m.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <BurnTracker />
      </section>

      <hr className="divider" />

      {/* ═══ § 06 — PLUG IN ═══ */}
      <div id="plug-in" className="section-label" style={{ marginTop: 40 }}><span>§ 06 · PLUG IN</span></div>

      <section className="reveal" style={{ paddingBottom: 48 }}>
        <h2 style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700, marginBottom: 6 }}>Ready to plug in? Here&apos;s how.</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-dark)', marginBottom: 24, maxWidth: 540 }}>
          Three steps. No cost. No lock-in. Verify your token, point your fee routing to the agent wallet,
          and your dedicated vault starts running in 15 minutes. You can disconnect anytime.
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
        <span>$METHANE · gas as a service · 2026</span>
        <div style={{ display: 'flex', gap: 16 }}>
          {['pump.fun', 'dexscreener', 'lavarage', 'solscan'].map(l => (
            <a key={l} href="#" className="trace-link" style={{ color: 'var(--fg-dark)' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
