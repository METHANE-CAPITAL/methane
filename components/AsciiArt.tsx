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
  '    ______           __             _          ____                      ',
  '   / ____/___ ______/ /__________  (_)___     / __ \\___  _________  _____',
  '  / /_  / __ `/ ___/ __/ ___/ __ \\/ / __ \\   / /_/ / _ \\/ ___/ __ \\/ ___/',
  ' / __/ / /_/ / /  / /_/ /__/ /_/ / / / / /  / ____/  __/ /  / /_/ (__  ) ',
  '/_/    \\__,_/_/   \\__/\\___/\\____/_/_/ /_/  /_/    \\___/_/  / .___/____/  ',
  '                                                          /_/            ',
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
