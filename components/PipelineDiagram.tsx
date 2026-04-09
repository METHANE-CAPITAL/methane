'use client';

export default function PipelineDiagram() {
  const steps = [
    { label: 'BUY $METHANE', icon: '💨', sublabel: 'pump.fun' },
    { label: 'FEES COLLECTED', icon: '⚗️', sublabel: '1% creator fee' },
    { label: 'SWAP TO USDC', icon: '🔄', sublabel: 'via Jupiter' },
    { label: '5× FART LONG', icon: '📈', sublabel: 'on Drift' },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
          ——— FEE PIPELINE ———
        </span>
      </div>

      {/* Pipeline */}
      <div className="flex flex-col md:flex-row items-stretch gap-0">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center flex-1">
            {/* Step */}
            <div className="flex-1 border border-neutral-600/30 bg-bg-card/60 p-4 text-center hover:border-toxic/30 transition-colors">
              <div className="text-2xl mb-2">{step.icon}</div>
              <div className="text-[13px] font-mono font-bold text-neutral-100 mb-1">
                {step.label}
              </div>
              <div className="text-[10px] font-mono text-neutral-500">
                {step.sublabel}
              </div>
            </div>
            {/* Arrow */}
            {i < steps.length - 1 && (
              <div className="hidden md:flex items-center px-2">
                <div className="text-toxic text-lg font-mono">→</div>
              </div>
            )}
            {i < steps.length - 1 && (
              <div className="flex md:hidden items-center justify-center py-1">
                <div className="text-toxic text-lg font-mono">↓</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Verification note */}
      <div className="mt-4 px-4 py-2 border border-neutral-600/20 bg-neutral-600/5">
        <span className="text-[10px] font-mono text-neutral-500">
          ⚠ EVERY TRANSACTION VERIFIABLE ON-CHAIN · SOLSCAN / SOLANA.FM · DRIFT POSITION PUBLIC
        </span>
      </div>
    </div>
  );
}
