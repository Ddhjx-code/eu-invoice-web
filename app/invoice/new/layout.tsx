import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Invoice',
  description:
    'Fill in your business details, client info, and line items to generate an EU-compliant e-invoice in XRechnung, ZUGFeRD, or Factur-X format.',
}

export default function InvoiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
