'use client';

import { useState, useEffect, useCallback } from 'react';
import BiosPreloader from './BiosPreloader';

const SKIP_KEY = 'methane_booted';
const SKIP_TTL = 1000 * 60 * 30; // 30 min — show again after

export default function BootWrapper({ children }: { children: React.ReactNode }) {
  const [booted, setBooted] = useState(false);
  const [skipBoot, setSkipBoot] = useState(false);

  useEffect(() => {
    // Check if recently booted
    try {
      const ts = localStorage.getItem(SKIP_KEY);
      if (ts && Date.now() - Number(ts) < SKIP_TTL) {
        setSkipBoot(true);
        setBooted(true);
      }
    } catch { /* no localStorage */ }

    // Allow any keypress or click to skip during boot
    const handler = () => {
      setBooted(true);
      try { localStorage.setItem(SKIP_KEY, String(Date.now())); } catch {}
    };
    window.addEventListener('keydown', handler);
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
    };
  }, []);

  const handleComplete = useCallback(() => {
    setBooted(true);
    try { localStorage.setItem(SKIP_KEY, String(Date.now())); } catch {}
  }, []);

  return (
    <>
      {!skipBoot && !booted && <BiosPreloader onComplete={handleComplete} />}
      <div
        style={{
          opacity: booted ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: booted ? 'auto' : 'none',
        }}
      >
        {children}
      </div>
    </>
  );
}
