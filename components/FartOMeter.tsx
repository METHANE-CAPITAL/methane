'use client';

interface Stat {
  label: string;
  value: string;
  meta?: string;
  color?: string;
}

interface FartOMeterProps {
  stats: Stat[];
}

export default function FartOMeter({ stats }: FartOMeterProps) {
  return (
    <div className="w-full border border-neutral-600/50 bg-bg-card/80 backdrop-blur-sm">
      {/* Header */}
      <div className="px-6 py-3 border-b border-neutral-600/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-toxic animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-300">
            FART-O-METER — LIVE POSITION DATA
          </span>
        </div>
        <span className="text-[11px] font-mono text-neutral-500">
          DRIFT PROTOCOL · FART-PERP · MKT #71
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-neutral-600/20">
        {stats.map((stat, i) => (
          <div key={i} className="px-4 py-5 flex flex-col gap-1.5 hover:bg-neutral-600/5 transition-colors">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-500">
              {stat.label}
            </span>
            <span
              className="text-lg font-mono font-bold"
              style={{ color: stat.color || '#39FF14' }}
            >
              {stat.value}
            </span>
            {stat.meta && (
              <span className="text-[10px] font-mono text-neutral-500">
                {stat.meta}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
