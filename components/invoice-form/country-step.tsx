'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { COUNTRIES } from '@/lib/country-config'
import type { InvoiceFormData } from '@/types/invoice-form'

interface CountryStepProps {
  data: Partial<InvoiceFormData>
  onChange: (data: Partial<InvoiceFormData>) => void
}

export function CountryStep({ data, onChange }: CountryStepProps) {
  const today = new Date().toISOString().split('T')[0]
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Country & Invoice Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="mb-2 block">Select Country</Label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(COUNTRIES).map(([code, config]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    onChange({
                      country: code as 'DE' | 'FR',
                      format: config.formats[0].id,
                    })
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    data.country === code
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="text-2xl mb-1">{code === 'DE' ? '🇩🇪' : '🇫🇷'}</div>
                  <div className="font-medium">{config.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {config.formats.map((f) => f.label).join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {data.country && (
            <div>
              <Label className="mb-2 block">Output Format</Label>
              <div className="space-y-2">
                {COUNTRIES[data.country].formats.map((format) => (
                  <button
                    key={format.id}
                    type="button"
                    onClick={() => onChange({ format: format.id })}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      data.format === format.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div className="font-medium text-sm">{format.label}</div>
                    <div className="text-xs text-muted-foreground">{format.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={data.invoiceNumber ?? ''}
              onChange={(e) => onChange({ invoiceNumber: e.target.value })}
              placeholder="INV-001"
            />
          </div>
          <div>
            <Label htmlFor="invoiceType">Invoice Type</Label>
            <select
              id="invoiceType"
              value={data.invoiceTypeCode ?? '380'}
              onChange={(e) => onChange({ invoiceTypeCode: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              <option value="380">Invoice</option>
              <option value="381">Credit Note</option>
              <option value="384">Corrected Invoice</option>
            </select>
          </div>
          <div>
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input
              id="issueDate"
              type="date"
              value={data.issueDate ?? today}
              onChange={(e) => onChange({ issueDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={data.dueDate ?? dueDate}
              onChange={(e) => onChange({ dueDate: e.target.value })}
            />
          </div>
          {data.country === 'DE' && (
            <div className="col-span-2">
              <Label htmlFor="buyerReference">
                Buyer Reference (Leitweg-ID)
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                id="buyerReference"
                value={data.buyerReference ?? ''}
                onChange={(e) => onChange({ buyerReference: e.target.value })}
                placeholder="04011000-12345-67"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Required for German XRechnung invoices
              </p>
            </div>
          )}
          <div className="col-span-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              value={data.note ?? ''}
              onChange={(e) => onChange({ note: e.target.value })}
              placeholder="Payment terms or additional information"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
