import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const siteUrl = 'https://eu-invoice-web.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | EU Invoice Generator',
    default: 'EU Invoice Generator - Free XRechnung, ZUGFeRD & Factur-X',
  },
  description:
    'Generate EU-compliant e-invoices for free. XRechnung & ZUGFeRD for Germany, Factur-X for France. No signup, no subscription. EN 16931 compliant.',
  keywords: [
    'e-invoice', 'XRechnung', 'ZUGFeRD', 'Factur-X', 'EU invoice', 'e-Rechnung',
    'xrechnung erstellen kostenlos', 'zugferd rechnung erstellen',
    'facture electronique gratuit', 'factur-x gratuit',
    'EN 16931', 'electronic invoice generator', 'free invoice tool',
  ],
  openGraph: {
    type: 'website',
    siteName: 'EU Invoice Generator',
    locale: 'en_US',
    alternateLocale: ['de_DE', 'fr_FR'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/',
    languages: { en: '/', de: '/de', fr: '/fr' },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-semibold text-lg">
              EU Invoice
            </a>
            <nav className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="/invoice/new" className="hover:text-foreground transition-colors">
                Create Invoice
              </a>
              <span className="text-border">|</span>
              <a href="/de" className="hover:text-foreground transition-colors">DE</a>
              <a href="/fr" className="hover:text-foreground transition-colors">FR</a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 text-center text-xs text-muted-foreground space-y-2">
          <div className="max-w-5xl mx-auto px-4">
            Powered by{' '}
            <a
              href="https://github.com/gflohr/e-invoice-eu"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              e-invoice-eu
            </a>{' '}
            open-source engine
            {' '}&middot;{' '}
            <a href="/terms" className="underline hover:text-foreground">
              Terms &amp; Disclaimer
            </a>
          </div>
          <div className="max-w-5xl mx-auto px-4 text-[11px]">
            This tool generates invoices based on open standards (EN 16931). It does not
            constitute tax, legal, or accounting advice. Always verify compliance with your
            local tax authority before submitting invoices.
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
