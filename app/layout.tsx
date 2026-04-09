import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '$METHANE — Gas Pipeline as a Service',
  description: 'Creator fees → 5x leveraged Fartcoin long on Drift Protocol. Autonomous. On-chain. Verifiable.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
