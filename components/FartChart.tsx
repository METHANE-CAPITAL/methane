'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { LiveDot, GasCloudIcon, ChartUpIcon } from './icons';

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

  // Fetch candles
  const fetchCandles = useCallback(async () => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const from = timeframe === '24h' ? now - 86400 : now - 604800;
      const resolution = timeframe === '24h' ? '15' : '60';
      const res = await fetch(`/api/fart-price?type=candles&resolution=${resolution}&from=${from}&to=${now}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCandles(data.candles || []);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, [timeframe]);

  // Fetch live price
  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch('/api/fart-price?type=live');
      if (!res.ok) return;
      const data = await res.json();
      setLivePrice(data.price);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchCandles();
    fetchLive();
    const candleInterval = setInterval(fetchCandles, 60000);
    const liveInterval = setInterval(fetchLive, 3000);
    return () => { clearInterval(candleInterval); clearInterval(liveInterval); };
  }, [fetchCandles, fetchLive]);

  // Draw chart
  useEffect(() => {
    if (!candles.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const pad = { top: 16, right: 85, bottom: 28, left: 8 };
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
      ctx.strokeStyle = 'rgba(124,252,0,0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = 'rgba(124,252,0,0.2)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`$${price.toFixed(4)}`, w - pad.right + 6, y + 3);
    }

    // Candlesticks
    candles.forEach((c, i) => {
      const x = pad.left + i * gap + gap / 2;
      const bullish = c.close >= c.open;
      const color = bullish ? '#7CFC00' : '#FF4444';
      const colorDim = bullish ? 'rgba(124,252,0,0.5)' : 'rgba(255,68,68,0.5)';

      // Wick
      ctx.beginPath();
      ctx.moveTo(x, toY(c.high));
      ctx.lineTo(x, toY(c.low));
      ctx.strokeStyle = colorDim;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Body
      const bodyTop = toY(Math.max(c.open, c.close));
      const bodyBottom = toY(Math.min(c.open, c.close));
      const bodyH = Math.max(1, bodyBottom - bodyTop);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
      ctx.globalAlpha = 1;
    });

    // Entry price line
    const entryY = toY(POSITION.entryPrice);
    ctx.beginPath();
    ctx.setLineDash([6, 4]);
    ctx.moveTo(pad.left, entryY);
    ctx.lineTo(w - pad.right, entryY);
    ctx.strokeStyle = '#ADFF2F';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ADFF2F';
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`ENTRY $${POSITION.entryPrice.toFixed(4)}`, w - pad.right + 6, entryY - 4);

    // Liquidation line
    const liqY = toY(POSITION.liquidationPrice);
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(pad.left, liqY);
    ctx.lineTo(w - pad.right, liqY);
    ctx.strokeStyle = '#FF4444';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#FF4444';
    ctx.fillText(`LIQ $${POSITION.liquidationPrice.toFixed(4)}`, w - pad.right + 6, liqY - 4);

    // Live price line + dot
    const currentP = livePrice || candles[candles.length - 1].close;
    const currentY = toY(currentP);
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(pad.left, currentY);
    ctx.lineTo(w - pad.right, currentY);
    ctx.strokeStyle = 'rgba(124,252,0,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Price tag on right
    ctx.fillStyle = '#7CFC00';
    ctx.fillRect(w - pad.right + 2, currentY - 8, pad.right - 4, 16);
    ctx.fillStyle = '#0d1a0d';
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.fillText(`$${currentP.toFixed(4)}`, w - pad.right + 6, currentY + 3);

    // Glow dot at last candle
    const lastX = pad.left + (candles.length - 1) * gap + gap / 2;
    const glow = ctx.createRadialGradient(lastX, currentY, 0, lastX, currentY, 10);
    glow.addColorStop(0, 'rgba(124,252,0,0.6)');
    glow.addColorStop(1, 'rgba(124,252,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(lastX - 10, currentY - 10, 20, 20);
    ctx.beginPath();
    ctx.arc(lastX, currentY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#7CFC00';
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
      ctx.fillStyle = 'rgba(124,252,0,0.15)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, h - 6);
    }

  }, [candles, livePrice, timeframe]);

  // PnL calculation
  const currentP = livePrice || (candles.length ? candles[candles.length - 1].close : 0);
  const pnlPct = currentP && POSITION.entryPrice
    ? ((currentP - POSITION.entryPrice) / POSITION.entryPrice * POSITION.leverage * 100)
    : 0;

  return (
    <div className="gas-border">
      {/* Header */}
      <div className="px-6 py-3 border-b border-stink/10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <LiveDot />
          <span className="font-bungee text-sm text-stink/70">FARTCOIN CHART</span>
          <span className="text-[10px] font-mono text-stink/30">PYTH ORACLE · REAL-TIME</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1">
            {(['24h', '7d'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => { setTimeframe(tf); setLoading(true); }}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase transition-colors ${
                  timeframe === tf
                    ? 'text-stink bg-stink/10 border border-stink/20'
                    : 'text-stink/30 border border-transparent hover:text-stink/50'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          {/* Live price */}
          {livePrice && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono font-bold text-stink">
                ${livePrice.toFixed(4)}
              </span>
              <span
                className="text-[11px] font-mono font-bold"
                style={{ color: pnlPct >= 0 ? '#7CFC00' : '#FF4444' }}
              >
                {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}% (5x)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Chart area */}
      <div className="relative px-2 py-4" style={{ height: 340 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <GasCloudIcon size={32} className="text-stink/30 animate-pulse" />
            <span className="ml-3 text-sm font-mono text-stink/30">Loading Pyth oracle data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm font-mono text-stink/30">Failed to load chart — retrying...</span>
          </div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-full" style={{ width: '100%', height: '100%' }} />
        )}
      </div>

      {/* Bottom stats */}
      <div className="px-6 py-3 border-t border-stink/10 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <div className="text-[9px] font-mono text-stink/20">FART PRICE (PYTH)</div>
          <div className="text-sm font-mono font-bold text-stink">${(livePrice || 0).toFixed(6)}</div>
        </div>
        <div>
          <div className="text-[9px] font-mono text-stink/20">OUR ENTRY</div>
          <div className="text-sm font-mono font-bold text-gas/70">${POSITION.entryPrice.toFixed(4)}</div>
        </div>
        <div>
          <div className="text-[9px] font-mono text-stink/20">LIQUIDATION</div>
          <div className="text-sm font-mono font-bold text-danger">${POSITION.liquidationPrice.toFixed(4)}</div>
        </div>
        <div>
          <div className="text-[9px] font-mono text-stink/20">POSITION PnL</div>
          <div className="text-sm font-mono font-bold" style={{ color: pnlPct >= 0 ? '#7CFC00' : '#FF4444' }}>
            {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
          </div>
        </div>
        <div>
          <div className="text-[9px] font-mono text-stink/20">DATA SOURCE</div>
          <div className="flex items-center gap-1.5">
            <ChartUpIcon size={12} className="text-stink/50" />
            <span className="text-sm font-mono font-bold text-stink/50">PYTH + DRIFT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
