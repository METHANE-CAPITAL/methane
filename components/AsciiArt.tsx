import React from 'react';

// Read directly from the txt file content — these are the exact chars Duck approved
const METHANE_LINES = [
  '    __  ___     __  __                   ',
  '   /  |/  /__  / /_/ /_  ____ _____  ___ ',
  '  / /|_/ / _ \\/ __/ __ \\/ __ `/ __ \\/ _ \\',
  ' / /  / /  __/ /_/ / / / /_/ / / / /  __/',
  '/_/  /_/\\___/\\__/_/ /_/\\__,_/_/ /_/\\___/ ',
];

const FARTPERPS_LINES = [
  '    ______           __             _          __                        ',
  '   / ____/___ ______/ /__________  (_)___     / /   ____  ____  ____ _  ',
  '  / /_  / __ `/ ___/ __/ ___/ __ \\/ / __ \\   / /   / __ \\/ __ \\/ __ `/  ',
  ' / __/ / /_/ / /  / /_/ /__/ /_/ / / / / /  / /___/ /_/ / / / / /_/ /   ',
  '/_/    \\__,_/_/   \\__/\\___/\\____/_/_/ /_/  /_____/\\____/_/ /_/\\__, /    ',
  '                                                          /____/     ',
];

export function MethaneAscii({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <pre
      className={`select-none whitespace-pre overflow-x-auto ${className}`}
      style={{ lineHeight: 1.15, fontFamily: "'JetBrains Mono', 'Courier New', monospace", ...style }}
    >{METHANE_LINES.join('\n')}</pre>
  );
}

export function FartPerpsAscii({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <pre
      className={`select-none whitespace-pre overflow-x-auto ${className}`}
      style={{ lineHeight: 1.15, fontFamily: "'JetBrains Mono', 'Courier New', monospace", ...style }}
    >{FARTPERPS_LINES.join('\n')}</pre>
  );
}
