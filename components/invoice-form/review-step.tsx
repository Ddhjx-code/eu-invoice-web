'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { COUNTRIES } from '@/lib/country-config'
import { calculateInvoiceTotals } from '@/lib/tax-calculator'
import { invoiceFormSchema } from '@/types/invoice-form'
import type { InvoiceFormData } from '@/types/invoice-form'

interface ReviewStepProps {
  data: Partial<InvoiceFormData>
  onChange: (data: Partial<InvoiceFormData>) => void
}

type GenerationState =
  | { status: 'idle' }
  | { status: 'validating' }
  | { status: 'generating' }
  | { status: 'success'; filename: string }
  | { status: 'error'; message: string }

export function ReviewStep({ data, onChange }: ReviewStepProps) {
  const [state, setState] = useState<GenerationState>({ status: 'idle' })

  const country = data.country ?? 'DE'
  const config = COUNTRIES[country]
  const format = config.formats.find((f) => f.id === data.format) ?? config.formats[0]
  const items = data.lineItems ?? []
  const totals = items.length > 0 ? calculateInvoiceTotals(items) : null

  const validate = () => {
    const result = invoiceFormSchema.safeParse(data)
    return result
  }

  const handleGenerate = async () => {
    setState({ status: 'validating' })

    const validation = validate()
    if (!validation.success) {
      const errors = validation.error.flatten()
      const fieldErrors = Object.entries(errors.fieldErrors)
        .map(([field, msgs]) => `${field}: ${(msgs ?? []).join(', ')}`)
        .join('\n')
      setState({ status: 'error', message: fieldErrors || 'Validation failed' })
      return
    }

    setState({ status: 'generating' })

    try {
      const response = await fetch('/api/invoice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.details ?? errorData?.error ?? `Server error ${response.status}`)
      }

      const blob = await response.blob()
      const disposition = response.headers.get('Content-Disposition') ?? ''
      const filenameMatch = disposition.match(/filename="?([^"]+)"?/)
      const filename = filenameMatch?.[1] ?? `invoice.${format.output}`

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setState({ status: 'success', filename })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Generation failed'
      setState({ status: 'error', message })
    }
  }

  const handleFormatChange = (formatId: string) => {
    onChange({ format: formatId })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Output Format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {config.formats.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleFormatChange(f.id)}
                className={`w-full p-3 rounded-lg border text-left transition-colors ${
                  data.format === f.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">{f.label}</span>
                    <p className="text-xs text-muted-foreground">{f.description}</p>
                  </div>
                  <Badge variant="secondary">{f.output.toUpperCase()}</Badge>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="text-muted-foreground">Country</div>
            <div>{config.name}</div>
            <div className="text-muted-foreground">Invoice Number</div>
            <div>{data.invoiceNumber || '-'}</div>
            <div className="text-muted-foreground">Issue Date</div>
            <div>{data.issueDate || '-'}</div>
            <div className="text-muted-foreground">Due Date</div>
            <div>{data.dueDate || '-'}</div>
            <div className="text-muted-foreground">Invoice Type</div>
            <div>{data.invoiceTypeCode === '381' ? 'Credit Note' : data.invoiceTypeCode === '384' ? 'Corrected Invoice' : 'Invoice'}</div>
            {data.buyerReference && (
              <>
                <div className="text-muted-foreground">Buyer Reference</div>
                <div>{data.buyerReference}</div>
              </>
            )}
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-sm mb-2">Seller</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
              <div className="text-muted-foreground">Company</div>
              <div>{data.seller?.name || '-'}</div>
              <div className="text-muted-foreground">VAT ID</div>
              <div>{data.seller?.vatId || '-'}</div>
              <div className="text-muted-foreground">Address</div>
              <div>
                {data.seller?.address
                  ? `${data.seller.address.street}, ${data.seller.address.postalCode} ${data.seller.address.city}, ${data.seller.address.countryCode}`
                  : '-'}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-sm mb-2">Buyer</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
              <div className="text-muted-foreground">Company</div>
              <div>{data.buyer?.name || '-'}</div>
              <div className="text-muted-foreground">VAT ID</div>
              <div>{data.buyer?.vatId || '-'}</div>
              <div className="text-muted-foreground">Address</div>
              <div>
                {data.buyer?.address
                  ? `${data.buyer.address.street}, ${data.buyer.address.postalCode} ${data.buyer.address.city}, ${data.buyer.address.countryCode}`
                  : '-'}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-sm mb-2">Bank Account</h4>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
              <div className="text-muted-foreground">IBAN</div>
              <div>{data.bankAccount?.iban || '-'}</div>
              <div className="text-muted-foreground">BIC</div>
              <div>{data.bankAccount?.bic || '-'}</div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-sm mb-2">Line Items ({items.length})</h4>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <div>
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>
                    {item.name || '(no description)'}
                    <span className="text-muted-foreground ml-2">
                      {item.quantity} x EUR {item.unitPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="font-medium">
                    EUR {(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totals && (
            <>
              <Separator />
              <div className="space-y-1 text-sm">
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
            </>
          )}

          {data.note && (
            <>
              <Separator />
              <div className="text-sm">
                <span className="text-muted-foreground">Note: </span>
                {data.note}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            {state.status === 'error' && (
              <div className="w-full p-3 rounded-lg bg-destructive/10 text-destructive text-sm whitespace-pre-line">
                {state.message}
              </div>
            )}

            {state.status === 'success' && (
              <div className="w-full p-3 rounded-lg bg-green-50 text-green-800 text-sm dark:bg-green-900/20 dark:text-green-300">
                Invoice generated successfully: {state.filename}
              </div>
            )}

            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={handleGenerate}
              disabled={state.status === 'generating' || state.status === 'validating'}
            >
              {state.status === 'validating'
                ? 'Validating...'
                : state.status === 'generating'
                  ? 'Generating...'
                  : state.status === 'success'
                    ? 'Download Again'
                    : `Generate ${format.label}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
