'use client';

import { useState } from 'react';
import Link from 'next/link';

const SECTIONS = [
  { id: 'overview', num: '01', title: 'OVERVIEW' },
  { id: 'pipeline', num: '02', title: 'PIPELINE' },
  { id: 'lavarage', num: '03', title: 'LAVARAGE INTEGRATION' },
  { id: 'tokenomics', num: '04', title: 'TOKENOMICS' },
  { id: 'api', num: '05', title: 'API REFERENCE' },
  { id: 'risks', num: '06', title: 'RISKS' },
  { id: 'faq', num: '07', title: 'FAQ' },
];

function SectionHead({ num, title, id }: { num: string; title: string; id: string }) {
  return (
    <div id={id} style={{ marginBottom: 20, scrollMarginTop: 80 }}>
      <div className="section-label"><span>§ {num} · {title}</span></div>
    </div>
  );
}

function KV({ k, v, accent }: { k: string; v: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k}</span>
      <span style={{ fontSize: 10, color: accent || 'var(--fg-dim)', fontWeight: 600, letterSpacing: '0.03em' }}>{v}</span>
    </div>
  );
}

function Code({ title, children }: { title: string; children: string }) {
  return (
    <div className="panel" style={{ overflow: 'hidden', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
        <span style={{ width: 4, height: 4, background: 'var(--green)', display: 'inline-block' }} />
        <span style={{ fontSize: 8, color: 'var(--fg-dark)', letterSpacing: '0.1em' }}>{title}</span>
      </div>
      <pre style={{ fontSize: 10, lineHeight: 1.9, padding: '14px 18px', overflowX: 'auto', margin: 0, whiteSpace: 'pre' }}>
        {children}
      </pre>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.8, marginBottom: 14, maxWidth: 600 }}>{children}</p>;
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.8, marginBottom: 6, paddingLeft: 12 }}>
      <span style={{ color: 'var(--fg-dark)', marginRight: 6 }}>›</span>{children}
    </div>
  );
}

function SubHead({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 10, marginTop: 20, textTransform: 'uppercase' }}>{children}</h3>;
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="panel" style={{ padding: '12px 18px', marginBottom: 8, cursor: 'pointer' }} onClick={() => setOpen(!open)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 500 }}>{q}</span>
        <span style={{ fontSize: 9, color: 'var(--fg-dark)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>▶</span>
      </div>
      {open && <p style={{ fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.8, marginTop: 10 }}>{a}</p>}
    </div>
  );
}

export default function DocsPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <Link href="/" style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.1em', display: 'inline-block', marginBottom: 20 }}>
          ← BACK TO METHANE
        </Link>
        <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)', letterSpacing: '0.04em', marginBottom: 6 }}>DOCUMENTATION</h1>
        <p style={{ fontSize: 10, color: 'var(--fg-dark)', letterSpacing: '0.06em' }}>Gas-as-a-Service · Technical Reference</p>
      </div>

      {/* TOC */}
      <div className="panel" style={{ padding: '16px 20px', marginBottom: 40 }}>
        <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em', marginBottom: 10 }}>TABLE OF CONTENTS</div>
        {SECTIONS.map(s => (
          <a key={s.id} href={`#${s.id}`} style={{ display: 'flex', gap: 12, padding: '4px 0', fontSize: 10, color: 'var(--fg-dim)', textDecoration: 'none' }}>
            <span style={{ color: 'var(--fg-dark)', fontWeight: 600 }}>{s.num}</span>
            <span>{s.title}</span>
          </a>
        ))}
      </div>

      <hr className="divider" style={{ marginBottom: 40 }} />

      {/* § 01 — OVERVIEW */}
      <SectionHead num="01" title="OVERVIEW" id="overview" />
      <P>
        $METHANE is infrastructure for the Fartcoin ecosystem. It turns idle creator fees from any pump.fun token
        into leveraged FART exposure via Lavarage — creating persistent buy pressure while generating yield for holders.
      </P>
      <P>
        Every mechanic is on-chain and verifiable. No custody, no pooling, no trust assumptions beyond the smart contracts themselves.
      </P>
      <div className="panel" style={{ padding: '14px 18px', marginBottom: 24 }}>
        <KV k="Protocol" v="Lavarage (spot leverage)" />
        <KV k="Underlying" v="Fartcoin (FART)" />
        <KV k="Leverage" v="5× (configurable via governance)" />
        <KV k="Collateral" v="SOL (direct deposit)" />
        <KV k="Agent Wallet" v="FXf5...TKd" accent="var(--accent)" />
        <KV k="Cycle Frequency" v="Every 15 minutes" />
        <KV k="Min Claim" v="0.05 SOL" />
      </div>

      <hr className="divider" style={{ marginBottom: 40 }} />

      {/* § 02 — PIPELINE */}
      <SectionHead num="02" title="PIPELINE" id="pipeline" />
      <P>
        The pipeline is a four-stage autonomous loop. No human intervention required after initial setup.
      </P>

      <SubHead>Stage 1: Collect</SubHead>
      <Li>Agent monitors creator fee wallet every 15 minutes</Li>
      <Li>Claims accumulated fees when balance exceeds 0.05 SOL threshold</Li>
      <Li>All claims are logged to Redis with transaction signatures</Li>

      <SubHead>Stage 2: Split</SubHead>
      <Li>70% allocated to leveraged FART position</Li>
      <Li>30% allocated to buyback reserve</Li>
      <Li>Split ratios are configurable via governance</Li>

      <SubHead>Stage 3: Leverage</SubHead>
      <Li>SOL collateral deposited directly to Lavarage</Li>
      <Li>Lavarage borrows additional SOL and buys real FART tokens on-chain</Li>
      <Li>Position opened at configured leverage (default: 5×)</Li>
      <Li>MEV protection via Astralane/Jito bundles</Li>

      <SubHead>Stage 4: Hold</SubHead>
      <Li>Position accrues value as FART price moves</Li>
      <Li>Agent monitors liquidation risk, interest costs, and PnL</Li>
      <Li>Automatic take-profit at +15% triggers burn mechanism</Li>
      <Li>Auto-close if borrowing costs exceed projected returns</Li>

      <Code title="pipeline-flow.pseudo">{`// Every 15 minutes
fees = claim_creator_fees()
if fees < 0.05 SOL → skip

long_amount = fees × 0.70
reserve     = fees × 0.30

position = lavarage.open({
  collateral: long_amount,
  leverage:   5,
  asset:      FART,
  slippage:   1%
})

log(position, redis)`}</Code>

      <hr className="divider" style={{ marginBottom: 40 }} />

      {/* § 03 — LAVARAGE INTEGRATION */}
      <SectionHead num="03" title="LAVARAGE INTEGRATION" id="lavarage" />
      <P>
        Lavarage provides spot leverage — borrowing SOL against your collateral and using it to buy real tokens on-chain.
        Unlike perpetual futures (synthetic exposure), this creates actual buy pressure on the underlying asset.
      </P>

      <div className="panel" style={{ padding: '14px 18px', marginBottom: 16 }}>
        <KV k="Protocol" v="Lavarage" />
        <KV k="Type" v="Spot leverage (real tokens)" />
        <KV k="FART Offers" v="9 active pools" accent="var(--green)" />
        <KV k="Max Leverage" v="7.47×" />
        <KV k="Borrowing APR" v="~99%" accent="var(--red)" />
        <KV k="Liquidation Mode" v="SELL (auto-unwind)" />
        <KV k="Collateral" v="SOL or USDC" />
      </div>

      <SubHead>Why Lavarage over Drift?</SubHead>
      <Li><strong style={{ color: 'var(--accent)' }}>Real buy pressure</strong> — Lavarage buys actual FART tokens vs. Drift&apos;s synthetic perpetuals</Li>
      <Li><strong style={{ color: 'var(--accent)' }}>Permissionless</strong> — any SPL token with liquidity can be traded</Li>
      <Li><strong style={{ color: 'var(--accent)' }}>Simpler flow</strong> — SOL direct collateral, no USDC swap needed</Li>
      <Li><strong style={{ color: 'var(--accent)' }}>Crisis resilient</strong> — decoupled from single protocol risk</Li>

      <SubHead>Position Data Available</SubHead>
      <Li>Entry price, current price, mark price</Li>
      <Li>Unrealized PnL (USD), ROI percentage</Li>
      <Li>Liquidation price, current LTV</Li>
      <Li>Effective leverage, interest accrued</Li>
      <Li>Daily interest cost</Li>

      <hr className="divider" style={{ marginBottom: 40 }} />

      {/* § 04 — TOKENOMICS */}
      <SectionHead num="04" title="TOKENOMICS" id="tokenomics" />

      <SubHead>Burn on Rip</SubHead>
      <P>
        When the FART position hits +15% unrealized PnL, the agent takes partial profit and uses the 30% buyback
        allocation to purchase $METHANE tokens — then sends them to the Solana null address, permanently removing
        them from supply.
      </P>
      <div className="panel" style={{ padding: '14px 18px', marginBottom: 16 }}>
        <KV k="Trigger" v="+15% unrealized PnL" />
        <KV k="Burn Amount" v="0.5% total supply per event" />
        <KV k="Source" v="30% buyback allocation" />
        <KV k="Destination" v="Solana null address (permanent)" />
      </div>

      <SubHead>Profit Distribution (The Blowoff)</SubHead>
      <P>
        At major PnL milestones (2×, 5×, 10×), the agent realizes 30% of gains and distributes directly to the
        top 500 $METHANE holders via SPL token transfer.
      </P>
      <div className="panel" style={{ padding: '14px 18px', marginBottom: 16 }}>
        <KV k="Milestones" v="2×, 5×, 10× PnL" />
        <KV k="Payout" v="30% realized gains" />
        <KV k="Eligible" v="Top 500 holders" />
        <KV k="Delivery" v="Direct SPL transfer" />
      </div>

      <SubHead>Governance (Critical Mass)</SubHead>
      <P>
        As $METHANE market cap grows, governance power scales. Early holders get outsized voting influence
        through SPL Realms.
      </P>
      <div className="panel" style={{ padding: '14px 18px', marginBottom: 16 }}>
        <KV k="$100K MC" v="3× vote weight" />
        <KV k="$500K MC" v="5× vote weight" />
        <KV k="$1M MC" v="7× vote weight" />
        <KV k="Platform" v="SPL Realms" />
        <KV k="Quorum" v="24 hours" />
      </div>

      <hr className="divider" style={{ marginBottom: 40 }} />

      {/* § 05 — API REFERENCE */}
      <SectionHead num="05" title="API REFERENCE" id="api" />
      <P>
        All endpoints are public and return JSON. No authentication required.
      </P>

      <SubHead>GET /api/position</SubHead>
      <P>Returns live position data from the Lavarage API and pipeline statistics from Redis.</P>
      <Code title="response.json">{`{
  "live": true,
  "venue": "lavarage",
  "agentWallet": "FXf5jhkD7Hoyr...Q6TKd",
  "position": {
    "hasPosition": true,
    "count": 1,
    "positions": [{
      "side": "LONG",
      "entryPrice": 0.1805,
      "currentPrice": 0.1923,
      "unrealizedPnl": 12.45,
      "roiPercent": 6.53,
      "liquidationPrice": 0.0412,
      "effectiveLeverage": 4.89,
      "dailyInterestCost": 0.0034
    }],
    "totals": { "collateral": 0.5, "pnl": 12.45 }
  },
  "stats": {
    "totalClaimed": 2.5400,
    "cycleCount": 47,
    "longCount": 12,
    "pendingBuyback": 0.7620
  }
}`}</Code>

      <SubHead>GET /api/fart-price</SubHead>
      <P>Current FART price from Pyth Network oracle.</P>
      <Code title="response.json">{`{
  "price": "0.1805715803",
  "source": "pyth",
  "updatedAt": "2026-04-09T12:37:41.013Z"
}`}</Code>

      <SubHead>GET /api/logs</SubHead>
      <P>Recent agent activity log entries from Redis.</P>
      <Code title="response.json">{`{
  "logs": [
    {
      "type": "CYCLE",
      "message": "Cycle complete — 0.12 SOL → 5× FART long",
      "timestamp": "2026-04-09T12:30:00Z",
      "txSignature": "5xK7m..."
    }
  ]
}`}</Code>

      <hr className="divider" style={{ marginBottom: 40 }} />

      {/* § 06 — RISKS */}
      <SectionHead num="06" title="RISKS" id="risks" />
      <P>
        $METHANE involves real financial risk. This section is not a disclaimer — it&apos;s a technical assessment
        of what can go wrong.
      </P>

      <SubHead>Liquidation Risk</SubHead>
      <Li>At 5× leverage, a ~20% drop in FART price approaches liquidation</Li>
      <Li>Lavarage auto-sells the position (SELL liquidation mode)</Li>
      <Li>Agent re-enters after 1h cooldown at reduced 3× leverage</Li>

      <SubHead>Borrowing Costs</SubHead>
      <Li>~99% APR on borrowed SOL — this is the cost of leverage</Li>
      <Li>Interest is deducted from collateral continuously</Li>
      <Li>In sideways markets, interest erodes the position</Li>
      <Li>Agent auto-closes if costs exceed projected returns</Li>

      <SubHead>Smart Contract Risk</SubHead>
      <Li>Lavarage contracts are permissionless and audited, but not risk-free</Li>
      <Li>Jupiter swap routing carries standard DEX risk</Li>
      <Li>Pipeline agent code is open-source and verifiable</Li>

      <SubHead>Market Risk</SubHead>
      <Li>FART is a memecoin — high volatility, potential for rapid drawdowns</Li>
      <Li>Leverage amplifies both gains and losses</Li>
      <Li>Liquidity conditions may affect execution quality</Li>

      <hr className="divider" style={{ marginBottom: 40 }} />

      {/* § 07 — FAQ */}
      <SectionHead num="07" title="FAQ" id="faq" />

      <FAQ
        q="What happens if FART goes to zero?"
        a="The leveraged position gets liquidated by Lavarage before reaching zero. The remaining collateral (if any) stays in the agent wallet. The agent waits for new fees to accumulate before re-entering."
      />
      <FAQ
        q="Can I withdraw my fees once routed?"
        a="No. Once fees are claimed by the agent, they enter the pipeline. You can disconnect fee routing at any time to stop future fees from being processed, but claimed fees are committed to the position."
      />
      <FAQ
        q="How is this different from just buying FART?"
        a="Leverage. Your fees generate 5× the FART exposure. Plus, the burn mechanism makes $METHANE deflationary as FART pumps, and profit distribution rewards holders at milestones."
      />
      <FAQ
        q="Is the agent code open-source?"
        a="Yes. The pipeline agent, site, and all smart contract interactions are verifiable on-chain. Agent wallet transactions are public on Solscan."
      />
      <FAQ
        q="What if Lavarage goes down?"
        a="The agent is built for protocol resilience. If Lavarage is unavailable, fees accumulate in the agent wallet until the venue is back online. The architecture supports multi-venue failover."
      />
      <FAQ
        q="Who controls the agent wallet?"
        a="The agent runs autonomously with a dedicated keypair. No human has manual access during normal operations. All actions are logged to Redis and verifiable on-chain."
      />
      <FAQ
        q="What's the minimum to participate?"
        a="Any pump.fun token with creator fees enabled. Route your fees to the agent wallet and the pipeline starts on the next 15-minute cycle. No minimum token size."
      />

      {/* Footer */}
      <div style={{ marginTop: 60, paddingTop: 20, borderTop: '1px dashed var(--border-dash)', textAlign: 'center' }}>
        <div style={{ fontSize: 9, color: 'var(--fg-dark)', letterSpacing: '0.08em' }}>
          $METHANE · GAS-AS-A-SERVICE · ALL TRANSACTIONS ON-CHAIN
        </div>
        <div style={{ fontSize: 9, color: 'var(--fg-floor)', marginTop: 6 }}>
          <Link href="/" style={{ color: 'var(--fg-dark)' }}>home</Link>
          {' · '}
          <a href="https://solscan.io/account/2i1i4UJBWKu9Uc35nM6M5FBdvEoHuKQS3TdngfnR6qxw" target="_blank" rel="noopener" style={{ color: 'var(--fg-dark)' }}>solscan</a>
          {' · '}
          <a href="https://lavarage.xyz" target="_blank" rel="noopener" style={{ color: 'var(--fg-dark)' }}>lavarage</a>
        </div>
      </div>
    </div>
  );
}
