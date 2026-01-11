import { Nunito_Sans } from 'next/font/google';
import { siteConfig } from '@/data/config/site.settings';
import { ThemeProviders } from './theme-providers';
import { Metadata } from 'next';

import { colors } from '@/data/config/colors.js';

import '@/css/globals.css';
import { SearchProvider } from '@/components/shared/SearchProvider';
import { AnalyticsWrapper } from '@/components/shared/Analytics';

const displayFont = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-display',
});

const baseFont = Nunito_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-default',
});

const globalColors = colors;
const style: string[] = [];

Object.keys(globalColors).map((variant) => {
  return Object.keys(globalColors[variant]).map((color) => {
    const value = globalColors[variant][color];
    style.push(`--${variant}-${color}: ${value}`);
  });
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: ['padel', 'sports management', 'Saudi Arabia', 'KSA', 'booking', 'courts', 'tennis', 'sports platform'],
  authors: [{ name: 'Sinjab' }],
  creator: 'Sinjab',
  publisher: 'Sinjab',
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.title,
    images: [
      {
        url: siteConfig.socialBanner,
        width: 1200,
        height: 630,
        alt: 'Sinjab - KSA Leading Sport Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: siteConfig.siteUrl,
  },
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
  twitter: {
    title: siteConfig.title,
    description: siteConfig.description,
    card: 'summary_large_image',
    images: [siteConfig.socialBanner],
    creator: '@sinjabapp',
  },
  icons: {
    icon: '/static/favicon/favicon.ico',
    shortcut: '/static/favicon/favicon-16x16.png',
    apple: '/static/favicon/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang={siteConfig.language}
      className={`${baseFont.variable} ${displayFont.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <style>
          {`
          :root, :before, :after {
            ${style.join(';')}
          }
        `}
        </style>

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/static/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/static/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/static/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/static/favicon/site.webmanifest" />
        <link
          rel="shortcut icon"
          href="/static/favicon/favicon.ico"
        />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#ffffff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#0f172a"
        />
      </head>

      <body className="flex flex-col bg-white text-black antialiased dark:bg-gray-950 dark:text-white min-h-screen">
        <ThemeProviders>
          <AnalyticsWrapper />

          <div className="w-full flex flex-col justify-between items-center font-sans">
            <SearchProvider>
              <main className="w-full flex flex-col items-center mb-auto">
                {children}
              </main>
            </SearchProvider>
          </div>
        </ThemeProviders>
      </body>
    </html>
  );
}
