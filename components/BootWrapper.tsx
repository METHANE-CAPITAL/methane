'use client';

import { useState, useEffect, useCallback } from 'react';
import BiosPreloader from './BiosPreloader';

const SKIP_KEY = 'methane_booted';

export default function BootWrapper({ children }: { children: React.ReactNode }) {
  const [booted, setBooted] = useState(false);
  const [skipBoot, setSkipBoot] = useState(false);

  useEffect(() => {
    // Check if already booted this tab
    try {
      if (sessionStorage.getItem(SKIP_KEY)) {
        setSkipBoot(true);
        setBooted(true);
      }
    } catch { /* no sessionStorage */ }

    // Allow any keypress or click to skip during boot
    const handler = () => {
      setBooted(true);
      try { sessionStorage.setItem(SKIP_KEY, '1'); } catch {}
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
    try { sessionStorage.setItem(SKIP_KEY, '1'); } catch {}
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
