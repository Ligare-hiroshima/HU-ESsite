import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StoreInitializer } from '@/components/layout/StoreInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HU就活ナビ - 広島大学生専用ESシェアサービス',
  description: '広島大学生が匿名でES（エントリーシート）を共有・閲覧できるサービスです。すべての投稿は運営が審査しています。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={`${inter.className} flex min-h-screen flex-col bg-white text-gray-900 antialiased`}>
        <StoreInitializer />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
