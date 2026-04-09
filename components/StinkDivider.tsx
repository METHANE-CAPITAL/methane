import { StinkLines } from './icons';

export default function StinkDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 py-4 max-w-[1200px] mx-auto px-6">
      <div className="flex-1 flex items-center gap-2">
        {[...Array(4)].map((_, i) => (
          <StinkLines key={i} size={16} className="text-stink/20" />
        ))}
        <div className="flex-1 h-px bg-stink/10" />
      </div>
      {label && (
        <span className="text-[10px] font-mono text-stink/30 uppercase tracking-[0.3em] shrink-0">
          {label}
        </span>
      )}
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-px bg-stink/10" />
        {[...Array(4)].map((_, i) => (
          <StinkLines key={i} size={16} className="text-stink/20" />
        ))}
      </div>
    </div>
  );
}
