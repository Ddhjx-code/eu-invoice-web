'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { COUNTRIES } from '@/lib/country-config'
import { calculateLineTotal, calculateInvoiceTotals } from '@/lib/tax-calculator'
import type { InvoiceFormData, LineItem } from '@/types/invoice-form'
import { UNIT_CODES } from '@/types/invoice-form'

interface ItemsStepProps {
  data: Partial<InvoiceFormData>
  onChange: (data: Partial<InvoiceFormData>) => void
}

function createEmptyItem(): LineItem {
  return {
    id: crypto.randomUUID(),
    name: '',
    quantity: 1,
    unitCode: 'HUR',
    unitPrice: 0,
    vatRate: 19,
    vatCategoryCode: 'S',
  }
}

export function ItemsStep({ data, onChange }: ItemsStepProps) {
  const country = data.country ?? 'DE'
  const config = COUNTRIES[country]
  const items = data.lineItems ?? [createEmptyItem()]

  const updateItems = (newItems: LineItem[]) => {
    onChange({ lineItems: newItems })
  }

  const updateItem = (index: number, updates: Partial<LineItem>) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, ...updates } : item,
    )
    updateItems(newItems)
  }

  const addItem = () => {
    const defaultRate = config.vatRates[0]
    updateItems([
      ...items,
      {
        ...createEmptyItem(),
        vatRate: defaultRate.rate,
        vatCategoryCode: defaultRate.categoryCode,
      },
    ])
  }

  const removeItem = (index: number) => {
    if (items.length <= 1) return
    updateItems(items.filter((_, i) => i !== index))
  }

  const totals = calculateInvoiceTotals(items)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              + Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
                {items.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <Label>Description</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, { name: e.target.value })}
                    placeholder="Service description"
                  />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, { quantity: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <select
                    value={item.unitCode}
                    onChange={(e) => updateItem(index, { unitCode: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    {UNIT_CODES.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Unit Price (EUR)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>VAT Rate</Label>
                  <select
                    value={`${item.vatCategoryCode}-${item.vatRate}`}
                    onChange={(e) => {
                      const [categoryCode, rate] = e.target.value.split('-')
                      updateItem(index, {
                        vatCategoryCode: categoryCode,
                        vatRate: parseFloat(rate),
                      })
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    {config.vatRates.map((vr) => (
                      <option key={`${vr.categoryCode}-${vr.rate}`} value={`${vr.categoryCode}-${vr.rate}`}>
                        {vr.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Line Total</Label>
                  <div className="flex h-9 items-center px-3 text-sm font-medium bg-muted rounded-md">
                    EUR {calculateLineTotal(item).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal (net)</span>
              <span>EUR {totals.lineExtensionAmount.toFixed(2)}</span>
            </div>
            {totals.taxSubtotals.map((st) => (
              <div key={`${st.categoryCode}-${st.taxRate}`} className="flex justify-between">
                <span className="text-muted-foreground">VAT {st.taxRate}%</span>
                <span>EUR {st.taxAmount.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t font-semibold text-base">
              <span>Total</span>
              <span>EUR {totals.taxInclusiveAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
