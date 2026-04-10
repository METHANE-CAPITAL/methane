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

type Timeframe = '1m' | '5m' | '15m' | '1h' | '4h' | '24h' | '7d' | '30d';

const TF_CONFIG: Record<Timeframe, { seconds: number; resolution: string; label: string }> = {
  '1m':  { seconds: 900,      resolution: '1',   label: '1m' },
  '5m':  { seconds: 3600,     resolution: '1',   label: '5m' },
  '15m': { seconds: 5400,     resolution: '1',   label: '15m' },
  '1h':  { seconds: 3600,     resolution: '1',   label: '1H' },
  '4h':  { seconds: 14400,    resolution: '5',   label: '4H' },
  '24h': { seconds: 86400,    resolution: '15',  label: '1D' },
  '7d':  { seconds: 604800,   resolution: '60',  label: '7D' },
  '30d': { seconds: 2592000,  resolution: '240', label: '30D' },
};

export default function FartChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');
  const [position, setPosition] = useState<PositionData>({ entryPrice: 0, liquidationPrice: 0, leverage: 5 });
  const [hover, setHover] = useState<{ x: number; y: number; candle: Candle | null } | null>(null);

  // Zoom/pan state
  const [viewStart, setViewStart] = useState(0);
  const [viewEnd, setViewEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; viewStart: number; viewEnd: number } | null>(null);

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
      setViewStart(0);
      setViewEnd(parsed.length);
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
      } catch {}
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
      } catch {}
    };
    fetchPosition();
    const interval = setInterval(fetchPosition, 30000);
    return () => clearInterval(interval);
  }, []);

  // Visible candle slice
  const visibleCandles = candles.slice(viewStart, viewEnd);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visibleCandles.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;

    // Price range from candle data only
    const candlePrices = visibleCandles.flatMap(c => [c.high, c.low]);
    if (livePrice) candlePrices.push(livePrice);
    const candleMin = Math.min(...candlePrices);
    const candleMax = Math.max(...candlePrices);
    const candleRange = candleMax - candleMin;
    // Only include entry/liq if within 15% of candle range — prevents crushing candles
    const allPrices = [...candlePrices];
    if (position.entryPrice > 0 && position.entryPrice > candleMin - candleRange * 0.15 && position.entryPrice < candleMax + candleRange * 0.15) allPrices.push(position.entryPrice);
    if (position.liquidationPrice > 0 && position.liquidationPrice > candleMin - candleRange * 0.15 && position.liquidationPrice < candleMax + candleRange * 0.15) allPrices.push(position.liquidationPrice);
    const minP = Math.min(...allPrices) * 0.998;
    const maxP = Math.max(...allPrices) * 1.002;
    const gap = cw / visibleCandles.length;
    const candleW = Math.max(1, Math.min(12, gap * 0.7));
    const toY = (p: number) => pad.top + (1 - (p - minP) / (maxP - minP)) * ch;

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
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`$${price.toFixed(4)}`, w - pad.right + 6, y + 3);
    }

    // Candlesticks
    visibleCandles.forEach((c, i) => {
      const x = pad.left + i * gap + gap / 2;
      const bullish = c.close >= c.open;
      const color = bullish ? '#e0e0e0' : '#555555';
      const wickColor = bullish ? 'rgba(224,224,224,0.4)' : 'rgba(85,85,85,0.4)';

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
      ctx.globalAlpha = 0.85;
      ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
      ctx.globalAlpha = 1;
    });

    // Entry line
    if (position.entryPrice > 0) {
      const y = toY(position.entryPrice);
      const inView = y >= pad.top && y <= h - pad.bottom;
      if (inView) {
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
      } else {
        // Off-screen indicator
        const edgeY = position.entryPrice > maxP ? pad.top + 2 : h - pad.bottom - 2;
        const arrow = position.entryPrice > maxP ? '▲' : '▼';
        ctx.fillStyle = 'rgba(102,255,102,0.5)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${arrow} ENTRY $${position.entryPrice.toFixed(4)}`, w - pad.right + 6, edgeY + 3);
      }
    }

    // Liquidation line
    if (position.liquidationPrice > 0) {
      const y = toY(position.liquidationPrice);
      const inView = y >= pad.top && y <= h - pad.bottom;
      if (inView) {
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
      } else {
        // Off-screen indicator
        const edgeY = position.liquidationPrice > maxP ? pad.top + 2 : h - pad.bottom - 2;
        const arrow = position.liquidationPrice > maxP ? '▲' : '▼';
        ctx.fillStyle = 'rgba(255,102,102,0.5)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${arrow} LIQ $${position.liquidationPrice.toFixed(4)}`, w - pad.right + 6, edgeY + 12);
      }
    }

    // Live price line
    const currentP = livePrice || visibleCandles[visibleCandles.length - 1].close;
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
    const lastX = pad.left + (visibleCandles.length - 1) * gap + gap / 2;
    ctx.beginPath();
    ctx.arc(lastX, currentY, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Time labels
    const labelCount = Math.min(6, visibleCandles.length);
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.floor((i / (labelCount - 1)) * (visibleCandles.length - 1));
      const d = new Date(visibleCandles[idx].time * 1000);
      let label: string;
      if (['1m', '5m', '15m', '1h', '4h', '24h'].includes(timeframe)) {
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

    // Crosshair
    if (hover && hover.candle) {
      const hx = hover.x;
      const hy = hover.y;

      ctx.beginPath();
      ctx.moveTo(hx, pad.top);
      ctx.lineTo(hx, h - pad.bottom);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pad.left, hy);
      ctx.lineTo(w - pad.right, hy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Y-axis price
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
      const lines = [timeStr, `O $${c.open.toFixed(4)}`, `H $${c.high.toFixed(4)}`, `L $${c.low.toFixed(4)}`, `C $${c.close.toFixed(4)}`];
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
      const bullish = c.close >= c.open;
      lines.forEach((line, i) => {
        ctx.fillStyle = i === 0 ? 'rgba(255,255,255,0.4)' : bullish ? 'rgba(224,224,224,0.8)' : 'rgba(160,160,160,0.8)';
        ctx.fillText(line, tx + 8, ty + 14 + i * 14);
      });
    }
  }, [visibleCandles, livePrice, timeframe, position, hover, pad]);

  useEffect(() => {
    drawChart();
    window.addEventListener('resize', drawChart);
    return () => window.removeEventListener('resize', drawChart);
  }, [drawChart]);

  // Mouse move → crosshair
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !visibleCandles.length) return;

    if (isDragging && dragStartRef.current) {
      const rect = canvas.getBoundingClientRect();
      const dx = e.clientX - dragStartRef.current.x;
      const candlesPerPx = (dragStartRef.current.viewEnd - dragStartRef.current.viewStart) / (rect.width - pad.left - pad.right);
      const shift = Math.round(-dx * candlesPerPx);
      const len = dragStartRef.current.viewEnd - dragStartRef.current.viewStart;
      let newStart = dragStartRef.current.viewStart + shift;
      let newEnd = dragStartRef.current.viewEnd + shift;
      if (newStart < 0) { newStart = 0; newEnd = len; }
      if (newEnd > candles.length) { newEnd = candles.length; newStart = candles.length - len; }
      setViewStart(Math.max(0, newStart));
      setViewEnd(Math.min(candles.length, newEnd));
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cw = rect.width - pad.left - pad.right;
    const gap = cw / visibleCandles.length;
    const idx = Math.round((x - pad.left - gap / 2) / gap);
    const clampedIdx = Math.max(0, Math.min(visibleCandles.length - 1, idx));
    const snapX = pad.left + clampedIdx * gap + gap / 2;
    setHover({ x: snapX, y, candle: visibleCandles[clampedIdx] });
  }, [visibleCandles, candles, isDragging, pad]);

  const handleMouseLeave = useCallback(() => {
    setHover(null);
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  // Drag to pan
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, viewStart, viewEnd };
    setHover(null);
  }, [viewStart, viewEnd]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);

  // Scroll to zoom
  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const len = viewEnd - viewStart;
    const zoomFactor = e.deltaY > 0 ? 1.15 : 0.87; // scroll down = zoom out, up = zoom in
    const newLen = Math.max(10, Math.min(candles.length, Math.round(len * zoomFactor)));

    // Zoom centered on mouse position
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseXRatio = (e.clientX - rect.left - pad.left) / (rect.width - pad.left - pad.right);
    const center = viewStart + Math.round(len * mouseXRatio);

    let newStart = center - Math.round(newLen * mouseXRatio);
    let newEnd = newStart + newLen;
    if (newStart < 0) { newStart = 0; newEnd = newLen; }
    if (newEnd > candles.length) { newEnd = candles.length; newStart = candles.length - newLen; }
    setViewStart(Math.max(0, newStart));
    setViewEnd(Math.min(candles.length, newEnd));
  }, [viewStart, viewEnd, candles.length, pad]);

  // Reset zoom
  const resetZoom = useCallback(() => {
    setViewStart(0);
    setViewEnd(candles.length);
  }, [candles.length]);

  const currentP = livePrice || (visibleCandles.length ? visibleCandles[visibleCandles.length - 1].close : 0);
  const pnlPct = currentP && position.entryPrice
    ? ((currentP - position.entryPrice) / position.entryPrice * position.leverage * 100) : 0;

  const isZoomed = viewEnd - viewStart < candles.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-xs text-dimmest">pyth oracle · real-time</span>
          {isZoomed && (
            <button onClick={resetZoom} className="text-[9px] text-dimmest hover:text-dim transition-colors" style={{ cursor: 'pointer' }}>
              [reset zoom]
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div style={{ display: 'flex', gap: 2 }}>
            {(Object.keys(TF_CONFIG) as Timeframe[]).map(tf => (
              <button key={tf} onClick={() => setTimeframe(tf)}
                style={{
                  padding: '2px 6px',
                  fontSize: 10,
                  color: timeframe === tf ? 'var(--accent)' : 'var(--fg-dark)',
                  background: timeframe === tf ? 'rgba(255,255,255,0.06)' : 'transparent',
                  border: timeframe === tf ? '1px solid var(--border)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>{TF_CONFIG[tf].label}</button>
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

      <div className="bg-block p-0" style={{ height: 300 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-dimmest text-xs">loading pyth data...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-dimmest text-xs">failed to load chart — retrying...</div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%', cursor: isDragging ? 'grabbing' : 'crosshair' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
          />
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 10, color: 'var(--fg-dark)', fontFamily: 'JetBrains Mono, monospace', flexWrap: 'wrap', alignItems: 'center' }}>
        {position.entryPrice > 0 && <span>entry: <span style={{ color: 'var(--green)' }}>${position.entryPrice.toFixed(4)}</span></span>}
        {position.entryPrice > 0 && position.liquidationPrice > 0 && <span style={{ color: 'var(--border)' }}>|</span>}
        {position.liquidationPrice > 0 && <span>liq: <span style={{ color: 'var(--red)' }}>${position.liquidationPrice.toFixed(4)}</span></span>}
        <span style={{ color: 'var(--border)' }}>|</span>
        <span>leverage: <span style={{ color: 'var(--fg-dim)' }}>{position.leverage.toFixed(1)}x</span></span>
        {currentP > 0 && position.entryPrice > 0 && <><span style={{ color: 'var(--border)' }}>|</span><span>PnL: <span style={{ color: pnlPct >= 0 ? 'var(--green)' : 'var(--red)' }}>{pnlPct >= 0 ? '+' : ''}{pnlPct.toFixed(1)}%</span></span></>}
        <span style={{ marginLeft: 'auto', color: 'var(--fg-dark)', opacity: 0.5 }}>scroll to zoom · drag to pan</span>
      </div>
    </div>
  );
}
