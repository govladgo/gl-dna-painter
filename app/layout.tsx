import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DNA Painter - Genomelink',
  description: 'DNA Match Clustering & Chromosome Painter',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {children}
      </body>
    </html>
  );
}
