import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { StructuredData } from "@/components/StructuredData";
import { siteConfig } from "@/config/site";

// Use only Noto Sans JP as requested
const notoSansJp = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: ['ループスライダー', 'カルーセル', '埋め込みコード', 'iframe', '画像スライダー', 'アニメーション'],
  authors: [{ name: 'StartWith Inc.', url: 'https://startwith.studio.site/' }],
  creator: 'StartWith Inc.',
  publisher: 'StartWith Inc.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [
      {
        url: siteConfig.ogImageUrl || '/favicon.png',
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImageUrl || '/favicon.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJp.variable} ${notoSansJp.className}`}>
        <Providers>
          <StructuredData
            title={siteConfig.title}
            description={siteConfig.description}
            url={siteConfig.url}
          />
          <SiteLayout config={siteConfig}>
            {children}
          </SiteLayout>
        </Providers>
      </body>
    </html>
  );
}
