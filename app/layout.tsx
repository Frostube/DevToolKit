import './globals.css'
import type { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'DevToolkit - Swiss Army Knife for Developers',
  description: 'All-in-one developer toolkit with file converters, code formatters, image tools, and more. Fast, secure, and free online tools for developers and IT professionals.',
  keywords: 'developer tools, code formatter, file converter, image converter, online tools, javascript formatter, css formatter, json formatter',
  authors: [{ name: 'DevToolkit' }],
  creator: 'DevToolkit',
  publisher: 'DevToolkit',
  openGraph: {
    title: 'DevToolkit - Swiss Army Knife for Developers',
    description: 'All-in-one developer toolkit with file converters, code formatters, and more.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevToolkit - Swiss Army Knife for Developers',
    description: 'All-in-one developer toolkit with file converters, code formatters, and more.',
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://devtoolkit.com" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
} 