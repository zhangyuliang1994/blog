import 'css/tailwind.css'
import 'pliny/search/algolia.css'

// import { Noto_Sans_SC } from 'next/font/google'
import { AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import AnalyticsWrapper from '@/components/AnalyticsWrapper'
import ClientNavigation from '@/components/ClientNavigation'

// const noto_sans_sc = Noto_Sans_SC({
//   subsets: ['latin'],
//   weight: ['400', '500', '700', '900'],
//   display: 'swap',
//   variable: '--font-noto-sans-sc',
// })

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
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
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
  icons: {
    icon: [
      { url: '/static/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/static/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/static/favicons/apple-touch-icon.png', sizes: '76x76', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/static/favicons/safari-pinned-tab.svg' },
    ],
  },
  manifest: '/static/favicons/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteMetadata.language}
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        {/* 使用中国可访问的字体CDN */}
        <link rel="preconnect" href="https://fonts.loli.net" />
        <link rel="preconnect" href="https://gstatic.loli.net" crossOrigin="" />
        <link href="https://fonts.loli.net/css2?family=Inter:wght@400;500;700;900&family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body className="bg-white/90 text-black antialiased dark:bg-[#1B1B1B] dark:text-white transition-colors duration-200">
        <ThemeProviders>
          <SectionContainer>
            <div className="flex h-screen flex-col justify-between font-sans">
              <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
                <Header />
                <ClientNavigation />
                <main className="mb-auto">{children}</main>
                <AnalyticsWrapper />
              </SearchProvider>
              <Footer />
            </div>
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}
