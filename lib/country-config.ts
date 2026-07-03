export interface FormatOption {
  id: string
  label: string
  output: 'xml' | 'pdf'
  description: string
}

export interface CountryConfig {
  name: string
  flag: string
  formats: FormatOption[]
  vatRates: { rate: number; label: string; categoryCode: string }[]
  vatIdPrefix: string
  vatIdPattern: RegExp
  vatIdPlaceholder: string
  requiredFields: string[]
}

export const COUNTRIES: Record<string, CountryConfig> = {
  DE: {
    name: 'Germany',
    flag: 'DE',
    formats: [
      {
        id: 'XRECHNUNG-UBL',
        label: 'XRechnung (XML)',
        output: 'xml',
        description: 'Standard German e-invoice format for B2G and B2B',
      },
      {
        id: 'Factur-X-XRechnung',
        label: 'ZUGFeRD (PDF+XML)',
        output: 'pdf',
        description: 'PDF invoice with embedded XML, compatible with XRechnung',
      },
    ],
    vatRates: [
      { rate: 19, label: '19% (Standard)', categoryCode: 'S' },
      { rate: 7, label: '7% (Reduced)', categoryCode: 'S' },
      { rate: 0, label: '0% (Zero-rated)', categoryCode: 'Z' },
    ],
    vatIdPrefix: 'DE',
    vatIdPattern: /^DE\d{9}$/,
    vatIdPlaceholder: 'DE123456789',
    requiredFields: ['buyerReference'],
  },
  FR: {
    name: 'France',
    flag: 'FR',
    formats: [
      {
        id: 'Factur-X-EN16931',
        label: 'Factur-X EN16931 (PDF+XML)',
        output: 'pdf',
        description: 'Standard French e-invoice format (Comfort profile)',
      },
      {
        id: 'Factur-X-Extended',
        label: 'Factur-X Extended (PDF+XML)',
        output: 'pdf',
        description: 'Extended profile with additional fields',
      },
    ],
    vatRates: [
      { rate: 20, label: '20% (Standard)', categoryCode: 'S' },
      { rate: 10, label: '10% (Reduced)', categoryCode: 'S' },
      { rate: 5.5, label: '5.5% (Reduced)', categoryCode: 'S' },
      { rate: 2.1, label: '2.1% (Super-reduced)', categoryCode: 'S' },
      { rate: 0, label: '0% (Zero-rated)', categoryCode: 'Z' },
    ],
    vatIdPrefix: 'FR',
    vatIdPattern: /^FR[A-Z0-9]{2}\d{9}$/,
    vatIdPlaceholder: 'FR12345678901',
    requiredFields: [],
  },
}

export function getCountryConfig(code: string): CountryConfig {
  const config = COUNTRIES[code]
  if (!config) {
    throw new Error(`Unsupported country: ${code}`)
  }
  return config
}
