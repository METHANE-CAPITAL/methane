'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface PositionData {
  entryPrice: number;
  liquidationPrice: number;
  leverage: number;
}

type Timeframe = '1h' | '4h' | '24h' | '7d' | '30d';

const TF_CONFIG: Record<Timeframe, { seconds: number; resolution: string; label: string }> = {
  '1h':  { seconds: 3600,     resolution: '1',   label: '1H' },
  '4h':  { seconds: 14400,    resolution: '5',   label: '4H' },
  '24h': { seconds: 86400,    resolution: '15',  label: '1D' },
  '7d':  { seconds: 604800,   resolution: '60',  label: '7D' },
  '30d': { seconds: 2592000,  resolution: '240', label: '30D' },
};

export default function FartChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');
  const [position, setPosition] = useState<PositionData>({ entryPrice: 0, liquidationPrice: 0, leverage: 5 });
  const [hover, setHover] = useState<{ x: number; y: number; candle: Candle | null } | null>(null);

  const pad = { top: 12, right: 80, bottom: 24, left: 10 };

  const fetchCandles = useCallback(async () => {
    setLoading(true);
    try {
      const cfg = TF_CONFIG[timeframe];
      const end = Math.floor(Date.now() / 1000);
      const start = end - cfg.seconds;
      const res = await fetch(
        `https://benchmarks.pyth.network/v1/shims/tradingview/history?symbol=Crypto.FARTCOIN/USD&resolution=${cfg.resolution}&from=${start}&to=${end}`
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

  // Live price polling
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

  // Position data
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const res = await fetch('/api/position');
        if (!res.ok) return;
        const data = await res.json();
        if (data.live && data.position?.positions?.length > 0) {
          const positions = data.position.positions;
          const main = positions.sort((a: any, b: any) => (b.collateral || 0) - (a.collateral || 0))[0];
          const collSol = parseFloat(main.collateral) || 0;
          const collUsd = parseFloat(main.collateralUsd) || 0;
          const solUsd = collSol > 0 ? collUsd / collSol : 0;
          const entryRaw = parseFloat(main.entryPrice) || 0;
          const liqRaw = parseFloat(main.liquidationPrice) || 0;
          setPosition({
            entryPrice: solUsd > 0 ? entryRaw * solUsd : entryRaw,
            liquidationPrice: solUsd > 0 ? liqRaw * solUsd : liqRaw,
            leverage: parseFloat(main.effectiveLeverage) || 5,
          });
        }
      } catch { /* silent */ }
    };
    fetchPosition();
    const interval = setInterval(fetchPosition, 30000);
    return () => clearInterval(interval);
  }, []);

  // Compute chart layout helpers
  const getChartMetrics = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles.length) return null;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;

    const allPrices = candles.flatMap(c => [c.high, c.low]);
    if (position.entryPrice > 0) allPrices.push(position.entryPrice);
    if (position.liquidationPrice > 0) allPrices.push(position.liquidationPrice);
    if (livePrice) allPrices.push(livePrice);
    const minP = Math.min(...allPrices) * 0.998;
    const maxP = Math.max(...allPrices) * 1.002;
    const gap = cw / candles.length;
    const toY = (p: number) => pad.top + (1 - (p - minP) / (maxP - minP)) * ch;
    const toP = (y: number) => minP + (1 - (y - pad.top) / ch) * (maxP - minP);

    return { w, h, cw, ch, minP, maxP, gap, toY, toP };
  }, [candles, livePrice, position, pad]);

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

    const m = getChartMetrics();
    if (!m) return;
    const { w, h, ch, gap, toY, minP, maxP } = m;
    const candleW = Math.max(2, gap * 0.7);

    ctx.clearRect(0, 0, w, h);

    // Grid lines
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
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`$${price.toFixed(4)}`, w - pad.right + 6, y + 3);
    }

    // Candlesticks
    candles.forEach((c, i) => {
      const x = pad.left + i * gap + gap / 2;
      const bullish = c.close >= c.open;
      const color = bullish ? '#e0e0e0' : '#555555';
      const wickColor = bullish ? 'rgba(224,224,224,0.4)' : 'rgba(85,85,85,0.4)';

      // Wick
      ctx.beginPath();
      ctx.moveTo(x, toY(c.high));
      ctx.lineTo(x, toY(c.low));
      ctx.strokeStyle = wickColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Body
      const bodyTop = toY(Math.max(c.open, c.close));
      const bodyBottom = toY(Math.min(c.open, c.close));
      const bodyH = Math.max(1, bodyBottom - bodyTop);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
      ctx.globalAlpha = 1;
    });

    // Entry line
    if (position.entryPrice > 0) {
      const y = toY(position.entryPrice);
      ctx.beginPath();
      ctx.setLineDash([6, 4]);
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.strokeStyle = 'rgba(102,255,102,0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#66ff66';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`ENTRY $${position.entryPrice.toFixed(4)}`, w - pad.right + 6, y - 4);
    }

    // Liquidation line
    if (position.liquidationPrice > 0) {
      const y = toY(position.liquidationPrice);
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.strokeStyle = 'rgba(255,102,102,0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ff6666';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillText(`LIQ $${position.liquidationPrice.toFixed(4)}`, w - pad.right + 6, y - 4);
    }

    // Live price line + tag
    const currentP = livePrice || candles[candles.length - 1].close;
    const currentY = toY(currentP);
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(pad.left, currentY);
    ctx.lineTo(w - pad.right, currentY);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Price tag
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(w - pad.right + 2, currentY - 8, pad.right - 4, 16);
    ctx.fillStyle = '#141414';
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.fillText(`$${currentP.toFixed(4)}`, w - pad.right + 6, currentY + 3);

    // Pulse dot
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
      let label: string;
      if (timeframe === '1h' || timeframe === '4h' || timeframe === '24h') {
        label = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      } else {
        label = `${d.getMonth() + 1}/${d.getDate()}`;
      }
      const x = pad.left + idx * gap + gap / 2;
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, h - 6);
    }

    // Crosshair on hover
    if (hover && hover.candle) {
      const hx = hover.x;
      const hy = hover.y;

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(hx, pad.top);
      ctx.lineTo(hx, h - pad.bottom);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(pad.left, hy);
      ctx.lineTo(w - pad.right, hy);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.stroke();

      // Price label on Y axis
      const hoverPrice = minP + (1 - (hy - pad.top) / ch) * (maxP - minP);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(w - pad.right + 2, hy - 8, pad.right - 4, 16);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '8px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`$${hoverPrice.toFixed(4)}`, w - pad.right + 6, hy + 3);

      // OHLC tooltip
      const c = hover.candle;
      const d = new Date(c.time * 1000);
      const timeStr = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
      const bullish = c.close >= c.open;
      const lines = [
        timeStr,
        `O $${c.open.toFixed(4)}`,
        `H $${c.high.toFixed(4)}`,
        `L $${c.low.toFixed(4)}`,
        `C $${c.close.toFixed(4)}`,
      ];
      const tooltipW = 120;
      const tooltipH = lines.length * 14 + 10;
      let tx = hx + 12;
      let ty = hy - tooltipH / 2;
      if (tx + tooltipW > w - pad.right) tx = hx - tooltipW - 12;
      if (ty < pad.top) ty = pad.top;
      if (ty + tooltipH > h - pad.bottom) ty = h - pad.bottom - tooltipH;

      ctx.fillStyle = 'rgba(20,20,20,0.92)';
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.fillRect(tx, ty, tooltipW, tooltipH);
      ctx.strokeRect(tx, ty, tooltipW, tooltipH);

      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      lines.forEach((line, i) => {
        if (i === 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
        } else {
          ctx.fillStyle = bullish ? 'rgba(224,224,224,0.8)' : 'rgba(160,160,160,0.8)';
        }
        ctx.fillText(line, tx + 8, ty + 14 + i * 14);
      });
    }
  }, [candles, livePrice, timeframe, position, hover, getChartMetrics, pad]);

  useEffect(() => {
    drawChart();
    window.addEventListener('resize', drawChart);
    return () => window.removeEventListener('resize', drawChart);
  }, [drawChart]);

  // Mouse interaction
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !candles.length) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const m = getChartMetrics();
    if (!m) return;

    const idx = Math.round((x - pad.left - m.gap / 2) / m.gap);
    const clampedIdx = Math.max(0, Math.min(candles.length - 1, idx));
    const snapX = pad.left + clampedIdx * m.gap + m.gap / 2;

    setHover({ x: snapX, y, candle: candles[clampedIdx] });
  }, [candles, getChartMetrics, pad]);

  const handleMouseLeave = useCallback(() => {
    setHover(null);
  }, []);

  const currentP = livePrice || (candles.length ? candles[candles.length - 1].close : 0);
  const pnlPct = currentP && position.entryPrice
    ? ((currentP - position.entryPrice) / position.entryPrice * position.leverage * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-dimmest">pyth oracle · real-time</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {(Object.keys(TF_CONFIG) as Timeframe[]).map(tf => (
              <button key={tf} onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 text-[10px] transition-colors ${
                  timeframe === tf ? 'text-accent bg-[var(--bg-lighter)] border border-[var(--border)]' : 'text-dimmest border border-transparent hover:text-dim'
                }`}>{TF_CONFIG[tf].label}</button>
            ))}
          </div>
          {livePrice && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-accent font-bold">${livePrice.toFixed(4)}</span>
              {position.entryPrice > 0 && (
                <span className={pnlPct >= 0 ? 'text-green' : 'text-red'}>
                  {pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}% ({position.leverage.toFixed(0)}x)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div ref={containerRef} className="bg-block p-0" style={{ height: 300 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-dimmest text-xs">loading pyth data...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-dimmest text-xs">failed to load chart — retrying...</div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        )}
      </div>

      <div className="flex gap-6 mt-2 text-[10px] text-dimmest">
        {position.entryPrice > 0 && <span>entry: <span className="text-green">${position.entryPrice.toFixed(4)}</span></span>}
        {position.liquidationPrice > 0 && <span>liq: <span className="text-red">${position.liquidationPrice.toFixed(4)}</span></span>}
        <span>leverage: <span className="text-dim">{position.leverage.toFixed(1)}x</span></span>
        {currentP > 0 && position.entryPrice > 0 && <span>PnL: <span className={pnlPct >= 0 ? 'text-green' : 'text-red'}>{pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%</span></span>}
      </div>
    </div>
  );
}
