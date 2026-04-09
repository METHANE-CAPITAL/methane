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
      <body>{children}</body>
    </html>
  );
}
