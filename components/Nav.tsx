'use client';

import { usePathname } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Nav() {
  const pathname = usePathname();
  const { connected, publicKey } = useWallet();

  const links = [
    { label: 'home', href: '/' },
    { label: 'docs', href: '/docs' },
    { label: 'vaults', href: '/vaults' },
    { label: 'plug in', href: '/#plug-in' },
  ];

  const external = [
    { label: 'pump.fun', href: '#', icon: '/icons/pumpfun.png' },
    { label: 'dexscreener', href: '#', icon: '/icons/dexscreener.png' },
    { label: 'lavarage', href: 'https://lavarage.xyz', icon: '/icons/lavarage.png' },
    { label: 'twitter', href: '#', icon: '' },
  ];

  return (
    <nav style={{
      fontSize: 10, borderBottom: '1px solid var(--border)', padding: '12px 0', marginBottom: 8,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
    }}>
      {/* Left: brand + pages */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <span className="status-dot" />
          <span style={{ color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', fontSize: 11 }}>$METHANE</span>
        </a>

        <span style={{ color: 'var(--border)', fontSize: 14 }}>|</span>

        {links.map(l => {
          const isActive = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href.replace('/#', ''));
          return (
            <a key={l.label} href={l.href}
              style={{
                color: isActive ? 'var(--accent)' : 'var(--fg-dim)',
                fontSize: 11, letterSpacing: '0.06em', textDecoration: 'none', fontWeight: isActive ? 600 : 400,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--fg-dim)'; }}
            >
              {l.label}
            </a>
          );
        })}
      </div>

      {/* Right: external + wallet */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* External links - hide on mobile */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {external.map(l => (
            <a key={l.label} href={l.href}
              target={l.href !== '#' ? '_blank' : undefined} rel={l.href !== '#' ? 'noopener' : undefined}
              style={{ color: 'var(--fg-dark)', fontSize: 10, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-dim)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-dark)')}>
              {l.icon && <img src={l.icon} alt={l.label} width={14} height={14} style={{ borderRadius: 2 }} />}
              {l.label === 'twitter' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              )}
              {l.label}
            </a>
          ))}
        </div>

        {/* Wallet button */}
        <WalletMultiButton style={{
          fontSize: 10, fontFamily: 'inherit', height: 30, padding: '0 12px',
          background: connected ? 'rgba(90,170,69,0.08)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${connected ? 'rgba(90,170,69,0.25)' : 'var(--border)'}`,
          borderRadius: 0, color: connected ? 'var(--green)' : 'var(--fg-dim)',
          letterSpacing: '0.04em',
        }} />
      </div>
    </nav>
  );
}
