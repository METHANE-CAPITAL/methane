'use client';

import { useEffect } from 'react';
import FartChart from '@/components/FartChart';
import PositionDashboard from '@/components/PositionDashboard';
import PositionTracker from '@/components/PositionTracker';
import FlywheelDiagram from '@/components/FlywheelDiagram';
import GasLog from '@/components/GasLog';
import SetupFlow from '@/components/SetupFlow';
import { MethaneAscii, FartPerpsAscii } from '@/components/AsciiArt';


// Scroll reveal
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

// Pipeline rendered as styled divs instead of ASCII box-drawing (font-safe)

export default function Home() {
  useScrollReveal();

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>

      {/* NAV */}
      <nav className="flex items-center justify-between py-4" style={{ fontSize: 10, borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <span className="status-dot" />
          <span style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em' }}>$METHANE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}> {/* force redeploy */}
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
          Gas Pipeline as a Service
        </div>

        <p className="reveal reveal-d2" style={{ color: 'var(--fg-dark)', fontSize: 12, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
          Creator fees → USDC → 5× leveraged Fartcoin long on Drift Protocol.
          <br />Autonomous. On-chain. Verifiable. <span style={{ color: 'var(--fg-dim)' }}>Any token can plug in.</span>
        </p>

        <div className="reveal reveal-d3 panel" style={{ display: 'inline-block', padding: '16px 32px', marginTop: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.15em', marginBottom: 4 }}>CONTRACT ADDRESS</div>
          <div style={{ fontSize: 14, color: 'var(--white)', fontWeight: 700, letterSpacing: '0.03em' }}>TBD — LAUNCHING SOON</div>
        </div>
      </section>

      {/* ═══ § 01 — WHY FART ═══ */}
      <div className="section-label"><span>§ 01 · WHY FART</span></div>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <div className="hide-mobile" style={{ marginBottom: 20 }}>
          <FartPerpsAscii className="text-[8px] sm:text-[9px] md:text-[11px]" style={{ color: 'var(--fg)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="grid-responsive">
          <div>
            <p style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.7, marginBottom: 12 }}>
              <span style={{ color: 'var(--white)', fontWeight: 600 }}>Fartcoin</span> is one of the most iconic tokens on Solana.
              $200M+ market cap. Listed everywhere. Born from{' '}
              <a href="https://truthterminal.wiki/" target="_blank" rel="noopener" className="trace-link" style={{ color: 'var(--fg-dim)' }}>
                Truth Terminal
              </a>.
            </p>
            <p style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.7 }}>
              $METHANE doesn&apos;t compete with FART — we <span style={{ color: 'var(--white)', fontWeight: 600 }}>long</span> it.
              Every fee we collect becomes leveraged FART exposure on Drift.
              When FART pumps, we pump harder.
            </p>
          </div>

          <div className="panel" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.12em', marginBottom: 16 }}>FARTCOIN ON SOLANA</div>
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
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 16, fontSize: 11 }}>
              <a href="https://dexscreener.com/solana/9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump" target="_blank" rel="noopener" className="trace-link">dexscreener ↗</a>
              <a href="https://www.coingecko.com/en/coins/fartcoin" target="_blank" rel="noopener" className="trace-link">coingecko ↗</a>
              <a href="https://app.drift.trade/perpetuals/FART-PERP" target="_blank" rel="noopener" className="trace-link">fart-perp ↗</a>
              <a href="https://truthterminal.wiki/" target="_blank" rel="noopener" className="trace-link">truth terminal ↗</a>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ § 02 — HOW IT WORKS ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 02 · PIPELINE</span></div>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <h2 style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>How It Works</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-dark)', marginBottom: 20 }}>Five steps. Every 15 minutes. Fully autonomous.</p>

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
          ALL TXS ON-CHAIN · VERIFY ON SOLSCAN · POSITION IS PUBLIC · AGENT WALLET IS READ-ONLY
        </p>
      </section>

      <hr className="divider" />

      {/* ═══ § 03 — CHART ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 03 · MARKET DATA</span></div>

      <section className="reveal" style={{ paddingBottom: 16 }}>
        <h2 style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>FART / USD</h2>
        <FartChart />
      </section>

      <section className="reveal" style={{ paddingBottom: 16 }}>
        <PositionDashboard />
      </section>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <PositionTracker />
      </section>

      <hr className="divider" />

      {/* ═══ § 04 — MECHANICS ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 04 · MECHANICS</span></div>

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

      {/* ═══ § 05 — GPAAS ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 05 · FOR YOUR TOKEN</span></div>

      <section className="reveal" style={{ paddingBottom: 48 }}>
        <h2 style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Gas Pipeline as a Service</h2>
        <p style={{ fontSize: 12, color: 'var(--fg-dark)', marginBottom: 20, maxWidth: 500 }}>
          Any project on Solana can route creator fees into the shared FART vault. Verify your token, configure routing, and you&apos;re live.
        </p>

        <SetupFlow />

        <div style={{ marginTop: 16 }}>
          <FlywheelDiagram />
        </div>
      </section>

      <hr className="divider" />

      {/* ═══ § 06 — GAS LOG ═══ */}
      <div className="section-label" style={{ marginTop: 40 }}><span>§ 06 · GAS LOG</span></div>

      <section className="reveal" style={{ paddingBottom: 40 }}>
        <GasLog />
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: 'var(--fg-dark)' }}>
        <span>$METHANE · gas pipeline as a service · 2026</span>
        <div style={{ display: 'flex', gap: 16 }}>
          {['pump.fun', 'dexscreener', 'drift', 'solscan'].map(l => (
            <a key={l} href="#" className="trace-link" style={{ color: 'var(--fg-dark)' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
