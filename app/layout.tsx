import type { Metadata } from 'next';
import './globals.css';
import PlasmaCloud from '@/components/PlasmaCloud';
import WalletProvider from '@/components/WalletProvider';
import BootWrapper from '@/components/BootWrapper';

export const metadata: Metadata = {
  title: '$METHANE — Gas as a Service | Leveraged FART Infrastructure',
  description: 'Turn idle creator fees into leveraged Fartcoin exposure on Lavarage. Per-project vaults. Autonomous. On-chain. Verifiable.',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <BootWrapper>
            <PlasmaCloud />
            <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
          </BootWrapper>
        </WalletProvider>
      </body>
    </html>
  );
}
