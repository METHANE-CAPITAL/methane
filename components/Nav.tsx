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
    { label: 'github', href: 'https://github.com/METHANE-CAPITAL/methane', icon: '' },
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
              {l.label === 'github' && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
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
