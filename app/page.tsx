import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <section className="text-center space-y-6 mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          EU-Compliant E-Invoices
          <br />
          <span className="text-muted-foreground">in Minutes</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Generate XRechnung, ZUGFeRD, and Factur-X invoices that meet EU e-invoicing
          standards. No signup, no subscription — just fill in your details and download.
        </p>
        <Link
          href="/invoice/new"
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Create Invoice
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl mb-3">DE</div>
            <h3 className="font-semibold text-lg mb-2">Germany</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>XRechnung (XML) — B2G standard</li>
              <li>ZUGFeRD (PDF+XML) — B2B compatible</li>
              <li>VAT rates: 19%, 7%, 0%</li>
              <li>Leitweg-ID support for public sector</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl mb-3">FR</div>
            <h3 className="font-semibold text-lg mb-2">France</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Factur-X EN16931 (PDF+XML)</li>
              <li>Factur-X Extended (PDF+XML)</li>
              <li>VAT rates: 20%, 10%, 5.5%, 2.1%, 0%</li>
              <li>Mandatory from Sept 2026</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="text-center space-y-4 mb-16">
        <h2 className="text-2xl font-semibold">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div>
            <div className="text-2xl font-bold text-primary mb-2">1</div>
            <h3 className="font-medium mb-1">Fill the form</h3>
            <p className="text-sm text-muted-foreground">
              Enter your business info, client details, and line items
            </p>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-2">2</div>
            <h3 className="font-medium mb-1">Choose format</h3>
            <p className="text-sm text-muted-foreground">
              Select XRechnung, ZUGFeRD, or Factur-X based on your needs
            </p>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary mb-2">3</div>
            <h3 className="font-medium mb-1">Download</h3>
            <p className="text-sm text-muted-foreground">
              Get a compliant PDF or XML invoice ready to send
            </p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <p className="text-sm text-muted-foreground">
          Built on the{' '}
          <a
            href="https://github.com/gflohr/e-invoice-eu"
            className="underline hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            e-invoice-eu
          </a>{' '}
          open-source engine. Supports EN 16931 standard.
        </p>
      </section>
    </div>
  )
}
