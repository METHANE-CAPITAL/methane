export function MethaneAscii({ className = '' }: { className?: string }) {
  const art = [
    '    __  ___     __  __                   ',
    '   /  |/  /__  / /_/ /_  ____ _____  ___ ',
    '  / /|_/ / _ \\/ __/ __ \\/ __ `/ __ \\/ _ \\',
    ' / /  / /  __/ /_/ / / / /_/ / / / /  __/',
    '/_/  /_/\\___/\\__/_/ /_/\\__,_/_/ /_/\\___/ ',
  ].join('\n');

  return (
    <pre className={`font-mono leading-tight select-none whitespace-pre ${className}`}>{art}</pre>
  );
}

export function FartPerpsAscii({ className = '' }: { className?: string }) {
  const art = [
    '    ______           __             _          ____                      ',
    '   / ____/___ ______/ /__________  (_)___     / __ \\___  _________  _____',
    '  / /_  / __ `/ ___/ __/ ___/ __ \\/ / __ \\   / /_/ / _ \\/ ___/ __ \\/ ___/',
    ' / __/ / /_/ / /  / /_/ /__/ /_/ / / / / /  / ____/  __/ /  / /_/ (__  ) ',
    '/_/    \\__,_/_/   \\__/\\___/\\____/_/_/ /_/  /_/    \\___/_/  / .___/____/  ',
    '                                                          /_/            ',
  ].join('\n');

  return (
    <pre className={`font-mono leading-tight select-none whitespace-pre ${className}`}>{art}</pre>
  );
}
