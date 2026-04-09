export function MethaneAscii({ className = '' }: { className?: string }) {
  return (
    <pre className={`font-mono text-[8px] sm:text-[10px] md:text-[13px] lg:text-[15px] leading-tight select-none ${className}`}>
{`     __ __  _________________  _____    _   ________
   _/ //  |/  / ____/_  __/ / / /   |  / | / / ____/
  / __/ /|_/ / __/   / / / /_/ / /| | /  |/ / __/   
 (_  ) /  / / /___  / / / __  / ___ |/ /|  / /___   
/  _/_/  /_/_____/ /_/ /_/ /_/_/  |_/_/ |_/_____/   
/_/`}
    </pre>
  );
}

export function GPaaSAscii({ className = '' }: { className?: string }) {
  return (
    <pre className={`font-mono text-[7px] sm:text-[9px] md:text-[11px] leading-tight select-none ${className}`}>
{`   __________              _____
  / ____/ __ \\____ _____ _/ ___/
 / / __/ /_/ / __ \`/ __ \`/\\__ \\ 
/ /_/ / ____/ /_/ / /_/ /___/ / 
\\____/_/    \\__,_/\\__,_//____/`}
    </pre>
  );
}

export function FartPerpAscii({ className = '' }: { className?: string }) {
  return (
    <pre className={`font-mono text-[6px] sm:text-[8px] md:text-[9px] leading-tight select-none ${className}`}>
{`    _________    ____  ______    ____  __________  ____ 
   / ____/   |  / __ \\/_  __/   / __ \\/ ____/ __ \\/ __ \\
  / /_  / /| | / /_/ / / /_____/ /_/ / __/ / /_/ / /_/ /
 / __/ / ___ |/ _, _/ / /_____/ ____/ /___/ _, _/ ____/ 
/_/   /_/  |_/_/ |_| /_/     /_/   /_____/_/ |_/_/`}
    </pre>
  );
}

export function DividerAscii() {
  return (
    <div className="text-stink/8 font-mono text-[10px] text-center select-none overflow-hidden whitespace-nowrap">
      {'~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~'}
    </div>
  );
}
