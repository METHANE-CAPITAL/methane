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
  '    __                                          __   ______           __      ',
  '   / /   ___ _   _____  _________ _____ ____   / /  / ____/___ ______/ /______',
  '  / /   / _ \\ | / / _ \\/ ___/ __ `/ __ `/ _ \\ / /  / /_  / __ `/ ___/ __/ ___/',
  ' / /___/  __/ |/ /  __/ /  / /_/ / /_/ /  __// /  / __/ / /_/ / /  / /_(__  ) ',
  '/_____/\\___/|___/\\___/_/   \\__,_/\\__, /\\___// /  /_/    \\__,_/_/   \\__/____/  ',
  '                              /____/      /_/                                ',
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
