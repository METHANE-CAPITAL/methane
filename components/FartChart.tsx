'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

const POSITION = {
  entryPrice: 0.148,
  liquidationPrice: 0.118,
  leverage: 5,
};

export default function FartChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timeframe, setTimeframe] = useState<'24h' | '7d'>('24h');

  const fetchCandles = useCallback(async () => {
    try {
      const end = Math.floor(Date.now() / 1000);
      const start = timeframe === '24h' ? end - 86400 : end - 604800;
      const res = await fetch(
        `https://benchmarks.pyth.network/v1/shims/tradingview/history?symbol=Crypto.FARTCOIN/USD&resolution=${timeframe === '24h' ? '15' : '60'}&from=${start}&to=${end}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.s !== 'ok' || !data.t?.length) throw new Error();
      const parsed: Candle[] = data.t.map((t: number, i: number) => ({
        time: t, open: data.o[i], high: data.h[i], low: data.l[i], close: data.c[i],
      }));
      setCandles(parsed);
      setError(false);
    } catch { setError(true); }
    setLoading(false);
  }, [timeframe]);

  useEffect(() => { fetchCandles(); }, [fetchCandles]);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/fart-price');
        if (!res.ok) return;
        const data = await res.json();
        if (data.price) setLivePrice(data.price);
      } catch { /* silent */ }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 10000);
    return () => clearInterval(interval);
  }, []);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;
    const pad = { top: 10, right: 80, bottom: 20, left: 10 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;

    const allPrices = candles.flatMap(c => [c.high, c.low]);
    allPrices.push(POSITION.entryPrice, POSITION.liquidationPrice);
    if (livePrice) allPrices.push(livePrice);
    const minP = Math.min(...allPrices) * 0.995;
    const maxP = Math.max(...allPrices) * 1.005;

    const toY = (p: number) => pad.top + (1 - (p - minP) / (maxP - minP)) * ch;
    const candleW = Math.max(2, (cw / candles.length) * 0.7);
    const gap = cw / candles.length;

    ctx.clearRect(0, 0, w, h);

    // Grid
    const gridN = 6;
    for (let i = 0; i <= gridN; i++) {
      const y = pad.top + (i / gridN) * ch;
      const price = maxP - (i / gridN) * (maxP - minP);
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '9px IBM Plex Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`$${price.toFixed(4)}`, w - pad.right + 6, y + 3);
    }

    // Candlesticks
    candles.forEach((c, i) => {
      const x = pad.left + i * gap + gap / 2;
      const bullish = c.close >= c.open;
      const color = bullish ? '#e0e0e0' : '#666666';
      const wickColor = bullish ? 'rgba(224,224,224,0.5)' : 'rgba(102,102,102,0.5)';

      ctx.beginPath();
      ctx.moveTo(x, toY(c.high));
      ctx.lineTo(x, toY(c.low));
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      const bodyTop = toY(Math.max(c.open, c.close));
      const bodyBottom = toY(Math.min(c.open, c.close));
      const bodyH = Math.max(1, bodyBottom - bodyTop);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
      ctx.globalAlpha = 1;
    });

    // Entry price line
    const entryY = toY(POSITION.entryPrice);
    ctx.beginPath();
    ctx.setLineDash([6, 4]);
    ctx.moveTo(pad.left, entryY);
    ctx.lineTo(w - pad.right, entryY);
    ctx.strokeStyle = '#66ff66';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#66ff66';
    ctx.font = 'bold 9px IBM Plex Mono, monospace';
    ctx.fillText(`ENTRY $${POSITION.entryPrice.toFixed(4)}`, w - pad.right + 6, entryY - 4);

    // Liquidation line
    const liqY = toY(POSITION.liquidationPrice);
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(pad.left, liqY);
    ctx.lineTo(w - pad.right, liqY);
    ctx.strokeStyle = '#ff6666';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ff6666';
    ctx.fillText(`LIQ $${POSITION.liquidationPrice.toFixed(4)}`, w - pad.right + 6, liqY - 4);

    // Live price line
    const currentP = livePrice || candles[candles.length - 1].close;
    const currentY = toY(currentP);
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(pad.left, currentY);
    ctx.lineTo(w - pad.right, currentY);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Price tag
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(w - pad.right + 2, currentY - 8, pad.right - 4, 16);
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 9px IBM Plex Mono, monospace';
    ctx.fillText(`$${currentP.toFixed(4)}`, w - pad.right + 6, currentY + 3);

    // Dot
    const lastX = pad.left + (candles.length - 1) * gap + gap / 2;
    ctx.beginPath();
    ctx.arc(lastX, currentY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Time labels
    const labelCount = Math.min(6, candles.length);
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.floor((i / (labelCount - 1)) * (candles.length - 1));
      const d = new Date(candles[idx].time * 1000);
      const label = timeframe === '24h'
        ? `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
        : `${d.getMonth() + 1}/${d.getDate()}`;
      const x = pad.left + idx * gap + gap / 2;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '9px IBM Plex Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, h - 6);
    }
  }, [candles, livePrice, timeframe]);

  useEffect(() => { drawChart(); window.addEventListener('resize', drawChart); return () => window.removeEventListener('resize', drawChart); }, [drawChart]);

  const currentP = livePrice || (candles.length ? candles[candles.length - 1].close : 0);
  const pnlPct = currentP && POSITION.entryPrice
    ? ((currentP - POSITION.entryPrice) / POSITION.entryPrice * POSITION.leverage * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-dimmest">pyth oracle · real-time</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {(['24h', '7d'] as const).map(tf => (
              <button key={tf} onClick={() => { setTimeframe(tf); setLoading(true); }}
                className={`px-2 py-0.5 text-[10px] transition-colors ${
                  timeframe === tf ? 'text-accent bg-[var(--bg-lighter)] border border-[var(--border)]' : 'text-dimmest border border-transparent hover:text-dim'
                }`}>{tf}</button>
            ))}
          </div>
          {livePrice && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-accent font-bold">${livePrice.toFixed(4)}</span>
              <span className={pnlPct >= 0 ? 'text-green' : 'text-red'}>
                {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}% (5x)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-block p-0" style={{ height: 300 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-dimmest text-xs">loading pyth data...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-dimmest text-xs">failed to load chart — retrying...</div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />
        )}
      </div>

      <div className="flex gap-6 mt-2 text-[10px] text-dimmest">
        <span>entry: <span className="text-green">${POSITION.entryPrice}</span></span>
        <span>liq: <span className="text-red">${POSITION.liquidationPrice}</span></span>
        <span>leverage: <span className="text-dim">{POSITION.leverage}x</span></span>
        {currentP > 0 && <span>PnL: <span className={pnlPct >= 0 ? 'text-green' : 'text-red'}>{pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%</span></span>}
      </div>
    </div>
  );
}
