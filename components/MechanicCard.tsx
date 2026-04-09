interface MechanicCardProps {
  icon: string;
  title: string;
  description: string;
  detail: string;
  index: number;
}

export default function MechanicCard({ icon, title, description, detail, index }: MechanicCardProps) {
  return (
    <div className="border border-neutral-600/30 bg-bg-card/60 backdrop-blur-sm hover:border-toxic/30 transition-all duration-300 group">
      {/* Header bar */}
      <div className="px-5 py-3 border-b border-neutral-600/20 flex items-center justify-between bg-neutral-600/5">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-300">
            PROTOCOL_{String(index).padStart(2, '0')}
          </span>
        </div>
        <span className="text-[10px] font-mono text-toxic/50 group-hover:text-toxic/80 transition-colors">
          [ ACTIVE ]
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-display font-bold text-neutral-100 tracking-tight">
          {title}
        </h3>
        <p className="text-[15px] leading-relaxed text-neutral-300">
          {description}
        </p>
        <div className="pt-2 border-t border-neutral-600/20">
          <p className="text-[12px] font-mono text-neutral-500 leading-relaxed">
            {detail}
          </p>
        </div>
      </div>
    </div>
  );
}
