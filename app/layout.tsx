import type { Metadata } from 'next';
import './globals.css';
import PlasmaCloud from '@/components/PlasmaCloud';
import WalletProvider from '@/components/WalletProvider';

export const metadata: Metadata = {
  title: '$METHANE — Gas as a Service',
  description: 'Creator fees → leveraged Fartcoin exposure on Lavarage. Autonomous. On-chain. Verifiable.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <PlasmaCloud />
          <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </WalletProvider>
      </body>
    </html>
  );
}
