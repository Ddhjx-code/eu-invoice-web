import type { LineItem } from '@/types/invoice-form'

export interface TaxSubtotal {
  taxableAmount: number
  taxAmount: number
  taxRate: number
  categoryCode: string
}

export interface InvoiceTotals {
  lineExtensionAmount: number
  taxExclusiveAmount: number
  taxInclusiveAmount: number
  payableAmount: number
  taxSubtotals: TaxSubtotal[]
  totalTaxAmount: number
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function calculateLineTotal(item: LineItem): number {
  return round2(item.quantity * item.unitPrice)
}

export function calculateInvoiceTotals(lineItems: LineItem[]): InvoiceTotals {
  const lineExtensionAmount = lineItems.reduce(
    (sum, item) => sum + calculateLineTotal(item),
    0,
  )

  const taxGrouped = new Map<string, { taxableAmount: number; rate: number; categoryCode: string }>()
  for (const item of lineItems) {
    const key = `${item.vatCategoryCode}-${item.vatRate}`
    const existing = taxGrouped.get(key)
    const lineTotal = calculateLineTotal(item)
    if (existing) {
      taxGrouped.set(key, { ...existing, taxableAmount: existing.taxableAmount + lineTotal })
    } else {
      taxGrouped.set(key, {
        taxableAmount: lineTotal,
        rate: item.vatRate,
        categoryCode: item.vatCategoryCode,
      })
    }
  }

  const taxSubtotals: TaxSubtotal[] = Array.from(taxGrouped.values()).map((group) => ({
    taxableAmount: round2(group.taxableAmount),
    taxAmount: round2(group.taxableAmount * group.rate / 100),
    taxRate: group.rate,
    categoryCode: group.categoryCode,
  }))

  const totalTaxAmount = round2(
    taxSubtotals.reduce((sum, st) => sum + st.taxAmount, 0),
  )

  const taxExclusiveAmount = round2(lineExtensionAmount)
  const taxInclusiveAmount = round2(taxExclusiveAmount + totalTaxAmount)

  return {
    lineExtensionAmount: round2(lineExtensionAmount),
    taxExclusiveAmount,
    taxInclusiveAmount,
    payableAmount: taxInclusiveAmount,
    taxSubtotals,
    totalTaxAmount,
  }
}
