import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { JsonLd } from '@/components/shared/json-ld'

export const metadata: Metadata = {
  title: 'Generateur Factur-X Gratuit - Facture Electronique',
  description:
    'Creez des factures electroniques conformes gratuitement: Factur-X (PDF+XML), XRechnung, ZUGFeRD. Sans inscription. Ideal pour auto-entrepreneurs et PME.',
  alternates: {
    canonical: '/fr',
    languages: { en: '/', de: '/de', fr: '/fr' },
  },
  openGraph: {
    title: 'Generateur de Factures Electroniques Gratuit - Factur-X',
    description:
      'Creez vos factures electroniques Factur-X en quelques minutes. Gratuit, sans inscription, conforme EN 16931.',
    locale: 'fr_FR',
    alternateLocale: ['en_US', 'de_DE'],
  },
}

const faqItems = [
  {
    question: "Qu'est-ce que Factur-X ?",
    answer:
      "Factur-X est le standard franco-allemand de facturation electronique. C'est un fichier PDF contenant un fichier XML integre avec les donnees structurees de la facture. Il est base sur la norme europeenne EN 16931 et est techniquement identique au format allemand ZUGFeRD.",
  },
  {
    question: 'La facturation electronique est-elle obligatoire pour les auto-entrepreneurs ?',
    answer:
      "Oui, a partir de septembre 2026, toutes les entreprises en France devront emettre des factures electroniques pour les transactions B2B domestiques. Cela inclut les auto-entrepreneurs et les micro-entreprises. La reception de factures electroniques est deja obligatoire depuis 2024 pour les grandes entreprises.",
  },
  {
    question: 'Ce generateur est-il vraiment gratuit ?',
    answer:
      "Oui, notre generateur de factures est entierement gratuit et ne necessite aucune inscription. Il est base sur le moteur open-source e-invoice-eu et genere des factures conformes aux normes EN 16931, Factur-X et XRechnung.",
  },
  {
    question: 'Factur-X et ZUGFeRD, quelle difference ?',
    answer:
      "Depuis la version 2.0, Factur-X et ZUGFeRD sont techniquement identiques. Factur-X est le nom utilise en France, tandis que ZUGFeRD est le nom allemand. Les deux formats produisent un PDF hybride avec XML integre, lisible par l'homme et traitable par machine.",
  },
]

export default function FrPage() {
  return (
    <div lang="fr">
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
            Generateur de Factures
            <br />
            <span className="text-muted-foreground">Electroniques Gratuit</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Creez des factures electroniques conformes en quelques minutes.
            Factur-X (PDF+XML), XRechnung et ZUGFeRD - sans inscription, sans abonnement.
          </p>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            La facturation electronique devient obligatoire en France a partir de septembre 2026.
            Preparez-vous des maintenant.
          </p>
          <Link
            href="/invoice/new"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Creer une facture
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Factur-X EN16931</h3>
              <p className="text-sm text-muted-foreground">
                Le profil standard pour la France. PDF avec XML integre,
                conforme a la norme europeenne EN 16931. Accepte par Chorus Pro.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">Factur-X Extended</h3>
              <p className="text-sm text-muted-foreground">
                Profil etendu avec des champs supplementaires pour des besoins
                specifiques. Compatible avec les systemes comptables avances.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-2">XRechnung</h3>
              <p className="text-sm text-muted-foreground">
                Format XML allemand pour les factures B2G. Ideal pour les
                transactions transfrontalieres France-Allemagne.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center space-y-4 mb-16">
          <h2 className="text-2xl font-semibold">Comment ca marche</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">1</div>
              <h3 className="font-medium mb-1">Remplir le formulaire</h3>
              <p className="text-sm text-muted-foreground">
                Saisissez vos informations, celles de votre client et les lignes de facturation
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">2</div>
              <h3 className="font-medium mb-1">Choisir le format</h3>
              <p className="text-sm text-muted-foreground">
                Factur-X, XRechnung ou ZUGFeRD selon vos besoins
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">3</div>
              <h3 className="font-medium mb-1">Telecharger</h3>
              <p className="text-sm text-muted-foreground">
                Obtenez votre facture conforme en PDF ou XML, prete a envoyer
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Questions frequentes
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
            Creer une facture gratuitement
          </Link>
        </section>
      </div>
    </div>
  )
}
