import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "$METHANE — Leveraged FART Long",
  description: "Every buy fuels a 5x leveraged Fartcoin long on Drift. The community-powered degen play.",
  openGraph: {
    title: "$METHANE — Leveraged FART Long",
    description: "Every buy fuels a 5x leveraged Fartcoin long on Drift.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "$METHANE — Leveraged FART Long",
    description: "Every buy fuels a 5x leveraged Fartcoin long on Drift.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bungee&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
