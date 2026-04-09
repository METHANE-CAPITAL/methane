export function MethaneAscii({ className = '' }: { className?: string }) {
  return (
    <pre className={`font-mono leading-tight select-none ${className}`}>
{` __    ___   __ __ 
 / |  / / _ \\/ __/ /_ ____ _____ ___ 
/ /|_/ / __/ /_/ __ \\/ __ \`/ __ \\/ _ \\
/ / / / __/ /_/ / / / /_/ / / / / __/
/_/ /_/\\___/\\__/_/ /_/\\__,_/_/ /_/\\___/`}
    </pre>
  );
}

export function FartPerpsAscii({ className = '' }: { className?: string }) {
  return (
    <pre className={`font-mono leading-tight select-none ${className}`}>
{` ______ __ _ ____ 
/ ____/___ ______/ /__________ (_)___ / __ \\___ _________ _____
/ /_ / __ \`/ ___/ __/ ___/ __ \\/ / __ \\ / /_/ / _ \\/ ___/ __ \\/ ___/
/ __/ / /_/ / / / /_/ /__/ /_/ / / / / / / ____/ __/ / / /_/ (__ ) 
/_/ \\__,_/_/ \\__/\\___/\\____/_/_/ /_/ /_/ \\___/_/ / .___/____/ 
                                              /_/`}
    </pre>
  );
}