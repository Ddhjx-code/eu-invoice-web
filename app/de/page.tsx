import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { JsonLd } from '@/components/shared/json-ld'

export const metadata: Metadata = {
  title: 'XRechnung & ZUGFeRD Rechnung erstellen - Kostenlos',
  description:
    'Erstellen Sie kostenlos EU-konforme E-Rechnungen: XRechnung (XML), ZUGFeRD (PDF+XML) und Factur-X. Kein Konto erforderlich. Sofort herunterladen.',
  alternates: {
    canonical: '/de',
    languages: { en: '/', de: '/de', fr: '/fr' },
  },
  openGraph: {
    title: 'Kostenloser XRechnung & ZUGFeRD Generator',
    description:
      'E-Rechnung erstellen in Minuten. XRechnung, ZUGFeRD und Factur-X. Kostenlos und ohne Registrierung.',
    locale: 'de_DE',
    alternateLocale: ['en_US', 'fr_FR'],
  },
}

const faqItems = [
  {
    question: 'Was ist eine XRechnung?',
    answer:
      'XRechnung ist das deutsche Standardformat fuer elektronische Rechnungen im B2G-Bereich (Business-to-Government). Es basiert auf der europaeischen Norm EN 16931 und wird als XML-Datei uebermittelt. Seit 2020 muessen Rechnungen an Bundesbehoerden im XRechnung-Format eingereicht werden.',
  },
  {
    question: 'Ist ZUGFeRD dasselbe wie Factur-X?',
    answer:
      'ZUGFeRD und Factur-X sind technisch identisch. Seit ZUGFeRD 2.0 basieren beide auf dem gleichen Standard. ZUGFeRD ist die deutsche Bezeichnung, Factur-X die franzoesische. Beide erzeugen ein PDF mit eingebettetem XML - lesbar fuer Menschen und Maschinen.',
  },
  {
    question: 'Muss ich als Kleinunternehmer E-Rechnungen erstellen?',
    answer:
      'Ab dem 1. Januar 2025 muessen alle Unternehmen in Deutschland E-Rechnungen empfangen koennen. Die Pflicht zum Versand wird stufenweise eingefuehrt: Ab 2027 fuer Unternehmen mit mehr als 800.000 EUR Jahresumsatz, ab 2028 fuer alle Unternehmen. Kleinunternehmer sollten sich jetzt schon vorbereiten.',
  },
  {
    question: 'Kostet der XRechnung-Generator etwas?',
    answer:
      'Nein, unser XRechnung-Generator ist komplett kostenlos und ohne Registrierung nutzbar. Das Tool basiert auf der Open-Source-Engine e-invoice-eu und erzeugt standardkonforme Rechnungen nach EN 16931.',
  },
]

export default function DePage() {
  return (
    <div lang="de">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <section className="text-center space-y-6 mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            XRechnung &amp; ZUGFeRD
            <br />
            <span className="text-muted-foreground">Rechnung erstellen - Kostenlos</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Erstellen Sie EU-konforme E-Rechnungen in wenigen Minuten. XRechnung (XML),
            ZUGFeRD (PDF+XML) und Factur-X - ohne Registrierung, ohne Abo, sofort herunterladen.
          </p>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Ab 2025 gilt die E-Rechnungspflicht in Deutschland. Bereiten Sie sich jetzt vor.
          </p>
          <Link
            href="/invoice/new"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Rechnung erstellen
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">XRechnung (XML)</h3>
              <p className="text-sm text-muted-foreground">
                Der deutsche Standard fuer B2G-Rechnungen. Unterstuetzt Leitweg-ID
                fuer Rechnungen an Behoerden. Konform mit EN 16931.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">ZUGFeRD (PDF+XML)</h3>
              <p className="text-sm text-muted-foreground">
                Hybridformat: PDF-Rechnung mit eingebettetem XML. Ideal fuer B2B -
                lesbar fuer Menschen und maschinenverarbeitbar.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Factur-X</h3>
              <p className="text-sm text-muted-foreground">
                Franzoesisches Pendant zu ZUGFeRD. Perfekt fuer grenzueberschreitende
                Rechnungen zwischen Deutschland und Frankreich.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center space-y-4 mb-16">
          <h2 className="text-2xl font-semibold">So funktioniert&apos;s</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">1</div>
              <h3 className="font-medium mb-1">Daten eingeben</h3>
              <p className="text-sm text-muted-foreground">
                Firmenangaben, Kundeninformationen und Rechnungspositionen ausfuellen
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">2</div>
              <h3 className="font-medium mb-1">Format waehlen</h3>
              <p className="text-sm text-muted-foreground">
                XRechnung, ZUGFeRD oder Factur-X - je nach Anforderung
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">3</div>
              <h3 className="font-medium mb-1">Herunterladen</h3>
              <p className="text-sm text-muted-foreground">
                Konforme PDF- oder XML-Rechnung sofort herunterladen und versenden
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Haeufig gestellte Fragen
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <details key={item.question} className="border rounded-lg p-4 group">
                <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                  {item.question}
                  <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                    &#9662;
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="text-center">
          <Link
            href="/invoice/new"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Jetzt kostenlos Rechnung erstellen
          </Link>
        </section>
      </div>
    </div>
  )
}
