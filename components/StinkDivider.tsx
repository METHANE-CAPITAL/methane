export default function StinkDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="flex-1 flex items-center gap-1">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-stink/30 text-lg">💨</span>
        ))}
        <div className="flex-1 h-px bg-stink/10" />
      </div>
      {label && (
        <span className="text-[10px] font-mono text-stink/40 uppercase tracking-[0.3em] shrink-0">
          {label}
        </span>
      )}
      <div className="flex-1 flex items-center gap-1">
        <div className="flex-1 h-px bg-stink/10" />
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-stink/30 text-lg">💨</span>
        ))}
      </div>
    </div>
  );
}
