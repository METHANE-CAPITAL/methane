export default function StinkDivider({ label }: { label?: string }) {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-2">
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-stink/8" />
        {label && (
          <span className="text-[9px] font-mono text-stink/15 uppercase tracking-[0.25em]">
            {label}
          </span>
        )}
        <div className="flex-1 h-px bg-stink/8" />
      </div>
    </div>
  );
}
