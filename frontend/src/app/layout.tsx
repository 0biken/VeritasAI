import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { WalletProvider } from '@/contexts/WalletContext';

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
      <body className="min-h-screen bg-background-primary font-body text-white antialiased">
        <WalletProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
