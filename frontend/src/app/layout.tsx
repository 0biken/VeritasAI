import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'VeritasAI - Decentralized AI Training Data Marketplace',
  description:
    'Transparent, Ethical AI Training Data with Cryptographic Provenance. Upload datasets with cryptographic proofs, get compensated via smart contracts.',
  keywords: [
    'AI',
    'Machine Learning',
    'Dataset',
    'Marketplace',
    'Blockchain',
    'NEAR',
    'Filecoin',
    'Decentralized',
  ],
  openGraph: {
    title: 'VeritasAI - Decentralized AI Training Data Marketplace',
    description: 'Transparent, Ethical AI Training Data with Cryptographic Provenance',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} min-h-screen bg-gray-950 font-sans text-white antialiased`}
      >
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
