import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-reflection-journal.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'AI振り返りジャーナル — 日記×AI感情分析で自己理解を深める',
    template: '%s | AI振り返りジャーナル',
  },
  description:
    '日記を書くだけでAIが感情を自動分析。レーダーチャートで可視化し、月間レポートで振り返り。習慣化をサポートするジャーナルアプリ。',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteUrl,
    siteName: 'AI振り返りジャーナル',
    title: 'AI振り返りジャーナル — 日記×AI感情分析',
    description:
      '日記を書くだけでAIが感情を自動分析。自己理解と習慣化を支援するジャーナルアプリ。',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AI振り返りジャーナル' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI振り返りジャーナル',
    description: '日記×AI感情分析で自己理解を深めるジャーナルアプリ',
    images: ['/og-image.png'],
  },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
