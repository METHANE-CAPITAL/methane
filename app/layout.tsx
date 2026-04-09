import type { Metadata } from 'next';
import './globals.css';
import PlasmaCloud from '@/components/PlasmaCloud';
import WalletProvider from '@/components/WalletProvider';

export const metadata: Metadata = {
  title: '$METHANE — Gas as a Service | Leveraged FART Infrastructure',
  description: 'Turn idle creator fees into leveraged Fartcoin exposure on Lavarage. Per-project vaults. Autonomous. On-chain. Verifiable.',
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
