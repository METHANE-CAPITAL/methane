'use client';

import { useEffect, useRef, useState } from 'react';
import { LiveDot, GasCloudIcon, ChartUpIcon } from './icons';

interface PricePoint {
  time: number;
  price: number;
}

interface CurrentData {
  price: number;
  market_cap: number;
  change_24h: number;
  volume_24h: number;
}

// Mock position data (will be replaced with real Drift data)
const POSITION = {
  entryPrice: 0.148,
  liquidationPrice: 0.118,
  leverageMultiple: 5,
};

export default function FartChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [prices, setPrices] = useState<PricePoint[]>([]);
  const [current, setCurrent] = useState<CurrentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/fart-price');
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();

        const pts: PricePoint[] = (data.prices || []).map(([t, p]: [number, number]) => ({
          time: t,
          price: p,
        }));
        setPrices(pts);
        setCurrent(data.current || null);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!prices.length) return;
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
    const padding = { top: 20, right: 80, bottom: 30, left: 10 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const allPrices = prices.map(p => p.price);
    const minP = Math.min(...allPrices, POSITION.liquidationPrice) * 0.98;
    const maxP = Math.max(...allPrices, POSITION.entryPrice) * 1.02;

    const toX = (i: number) => padding.left + (i / (prices.length - 1)) * chartW;
    const toY = (p: number) => padding.top + (1 - (p - minP) / (maxP - minP)) * chartH;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (i / gridLines) * chartH;
      const price = maxP - (i / gridLines) * (maxP - minP);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.strokeStyle = 'rgba(124, 252, 0, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = 'rgba(124, 252, 0, 0.25)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`$${price.toFixed(4)}`, w - padding.right + 8, y + 3);
    }

    // Price line gradient fill
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(prices[0].price));
    for (let i = 1; i < prices.length; i++) {
      ctx.lineTo(toX(i), toY(prices[i].price));
    }
    ctx.lineTo(toX(prices.length - 1), padding.top + chartH);
    ctx.lineTo(toX(0), padding.top + chartH);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    fillGrad.addColorStop(0, 'rgba(124, 252, 0, 0.15)');
    fillGrad.addColorStop(1, 'rgba(124, 252, 0, 0.0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Price line
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(prices[0].price));
    for (let i = 1; i < prices.length; i++) {
      ctx.lineTo(toX(i), toY(prices[i].price));
    }
    ctx.strokeStyle = '#7CFC00';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Entry price line
    const entryY = toY(POSITION.entryPrice);
    ctx.beginPath();
    ctx.setLineDash([6, 4]);
    ctx.moveTo(padding.left, entryY);
    ctx.lineTo(w - padding.right, entryY);
    ctx.strokeStyle = '#ADFF2F';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ADFF2F';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`ENTRY $${POSITION.entryPrice.toFixed(4)}`, w - padding.right + 8, entryY + 3);

    // Liquidation price line
    const liqY = toY(POSITION.liquidationPrice);
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(padding.left, liqY);
    ctx.lineTo(w - padding.right, liqY);
    ctx.strokeStyle = '#FF4444';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#FF4444';
    ctx.fillText(`LIQ $${POSITION.liquidationPrice.toFixed(4)}`, w - padding.right + 8, liqY + 3);

    // Current price dot
    if (prices.length) {
      const lastP = prices[prices.length - 1].price;
      const lastX = toX(prices.length - 1);
      const lastY = toY(lastP);

      // Glow
      const glow = ctx.createRadialGradient(lastX, lastY, 0, lastX, lastY, 12);
      glow.addColorStop(0, 'rgba(124, 252, 0, 0.6)');
      glow.addColorStop(1, 'rgba(124, 252, 0, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(lastX - 12, lastY - 12, 24, 24);

      ctx.beginPath();
      ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#7CFC00';
      ctx.fill();
    }

    // Time labels
    const timeLabels = 4;
    for (let i = 0; i <= timeLabels; i++) {
      const idx = Math.floor((i / timeLabels) * (prices.length - 1));
      const d = new Date(prices[idx].time);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      const x = toX(idx);
      ctx.fillStyle = 'rgba(124, 252, 0, 0.2)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, h - 8);
    }

  }, [prices]);

  const formatNum = (n: number) => {
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(1)}K`;
    return `$${n.toFixed(2)}`;
  };

  return (
    <div className="gas-border">
      {/* Header */}
      <div className="px-6 py-3 border-b border-stink/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LiveDot />
          <span className="font-bungee text-sm text-stink/70">FARTCOIN CHART</span>
          <span className="text-[10px] font-mono text-stink/30">7D · USD · COINGECKO</span>
        </div>
        {current && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono font-bold text-stink">
              ${current.price.toFixed(4)}
            </span>
            <span
              className="text-[11px] font-mono font-bold"
              style={{ color: current.change_24h >= 0 ? '#7CFC00' : '#FF4444' }}
            >
              {current.change_24h >= 0 ? '+' : ''}{current.change_24h.toFixed(2)}%
            </span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="relative px-2 py-4" style={{ height: 320 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <GasCloudIcon size={32} className="text-stink/30 animate-pulse" />
            <span className="ml-3 text-sm font-mono text-stink/30">Loading gas data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-sm font-mono text-stink/30">Failed to load chart data</span>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>

      {/* Bottom stats bar */}
      {current && (
        <div className="px-6 py-3 border-t border-stink/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] font-mono text-stink/20">FART PRICE</div>
            <div className="text-sm font-mono font-bold text-stink">${current.price.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-stink/20">MARKET CAP</div>
            <div className="text-sm font-mono font-bold text-stink/70">{formatNum(current.market_cap)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-stink/20">24H VOLUME</div>
            <div className="text-sm font-mono font-bold text-stink/70">{formatNum(current.volume_24h)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono text-stink/20">OUR POSITION</div>
            <div className="flex items-center gap-2">
              <ChartUpIcon size={14} className="text-stink" />
              <span className="text-sm font-mono font-bold text-stink">5x LONG</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
