// Custom SVG icons — no emoji anywhere

export function GasCloudIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 17c-1.1 0-2-.9-2-2 0-.9.6-1.7 1.5-1.9C3.2 11.3 4.9 10 7 10c.3 0 .6 0 .9.1C8.6 8.3 10.1 7 12 7c2.2 0 4 1.5 4.5 3.5.3-.1.6-.1 1-.1 1.9 0 3.5 1.3 3.9 3.1.6.3 1.1 1 1.1 1.8 0 1.1-.9 2-2 2H4z" fill="currentColor" opacity="0.8"/>
      <path d="M6 14c-.6 0-1-.4-1-1s.4-1 1-1c.2-1.7 1.7-3 3.5-3 .2 0 .4 0 .6.1C10.6 8.3 11.7 7.5 13 7.5c1.5 0 2.7 1 3.1 2.4.2 0 .4-.1.6-.1 1.3 0 2.3.9 2.5 2.1.3.2.5.5.5.9 0 .6-.4 1-1 1H6z" fill="currentColor" opacity="0.3"/>
    </svg>
  );
}

export function FlameIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2c0 4-4 6-4 10a4 4 0 108 0c0-4-4-6-4-10z" fill="currentColor" opacity="0.9"/>
      <path d="M12 8c0 2-2 3-2 5a2 2 0 104 0c0-2-2-3-2-5z" fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

export function SkullIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C7 2 3 6 3 11c0 3 1.5 5.5 4 7v2a1 1 0 001 1h8a1 1 0 001-1v-2c2.5-1.5 4-4 4-7 0-5-4-9-9-9z" fill="currentColor" opacity="0.8"/>
      <circle cx="9" cy="10" r="2" fill="var(--bg, #0d1a0d)"/>
      <circle cx="15" cy="10" r="2" fill="var(--bg, #0d1a0d)"/>
      <path d="M10 16h4" stroke="var(--bg, #0d1a0d)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 18v2M12 18v2M15 18v2" stroke="var(--bg, #0d1a0d)" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

export function GaugeIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
      <path d="M12 6v1M18 12h-1M6 12h1M16.2 7.8l-.7.7M7.8 7.8l.7.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 12l4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  );
}

export function ChartUpIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 20l5-8 4 4 9-13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 3h4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function RecycleIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4l3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 7H9a5 5 0 00-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 20l-3-3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 17h6a5 5 0 005-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function BombIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="14" r="7" fill="currentColor" opacity="0.8"/>
      <path d="M14 7l2-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 4l1-1M17 3l1 1M15 3l-1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M11 7V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export function LeafIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 21c1-4 4-7 8-9 4-2 8-2 8-2s0 4-2 8c-2 4-5 7-9 8" fill="currentColor" opacity="0.7"/>
      <path d="M5 21c0 0 3-3 7-5" stroke="var(--bg, #0d1a0d)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function DoubleGasIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 15c-.5 0-1-.4-1-1 0-.5.3-.9.8-1C3.1 11.6 4.4 10.5 6 10.5c.2 0 .3 0 .5.1C6.9 9.2 8 8.2 9.5 8.2c1.3 0 2.4.9 2.7 2.1.2 0 .3-.1.5-.1 1.1 0 2 .8 2.2 1.8.4.2.6.6.6 1 0 .6-.4 1-1 1H3z" fill="currentColor" opacity="0.8"/>
      <path d="M10 11c-.5 0-1-.4-1-1 0-.5.3-.9.8-1C10.1 7.6 11.4 6.5 13 6.5c.2 0 .3 0 .5.1C13.9 5.2 15 4.2 16.5 4.2c1.3 0 2.4.9 2.7 2.1.2 0 .3-.1.5-.1 1.1 0 2 .8 2.2 1.8.4.2.6.6.6 1 0 .6-.4 1-1 1H10z" fill="currentColor" opacity="0.5"/>
    </svg>
  );
}

export function LiveDot({ className = '' }: { className?: string }) {
  return (
    <span className={`relative flex h-2.5 w-2.5 ${className}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stink opacity-50" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-stink" />
    </span>
  );
}

export function StinkLines({ className = '', size = 20 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M6 16c0-3 2-4 2-7s-1-4-1-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      <path d="M10 16c0-3 2-4 2-7s-1-4-1-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M14 16c0-3 2-4 2-7s-1-4-1-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2"/>
    </svg>
  );
}
