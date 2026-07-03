'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { COUNTRIES } from '@/lib/country-config'
import type { InvoiceFormData, Party } from '@/types/invoice-form'

interface BuyerStepProps {
  data: Partial<InvoiceFormData>
  onChange: (data: Partial<InvoiceFormData>) => void
}

export function BuyerStep({ data, onChange }: BuyerStepProps) {
  const country = data.country ?? 'DE'
  const config = COUNTRIES[country]
  const buyer: Partial<Party> = data.buyer ?? {}

  const updateBuyer = (updates: Partial<Party>) => {
    onChange({ buyer: { ...buyer, ...updates } as Party })
  }

  const updateAddress = (updates: Record<string, string>) => {
    updateBuyer({
      address: { ...buyer.address, ...updates } as Party['address'],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="buyerName">Company Name</Label>
            <Input
              id="buyerName"
              value={buyer.name ?? ''}
              onChange={(e) => updateBuyer({ name: e.target.value })}
              placeholder="Client GmbH"
            />
          </div>
          <div>
            <Label htmlFor="buyerVatId">VAT ID</Label>
            <Input
              id="buyerVatId"
              value={buyer.vatId ?? ''}
              onChange={(e) => updateBuyer({ vatId: e.target.value })}
              placeholder={config.vatIdPlaceholder}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="buyerStreet">Street Address</Label>
          <Input
            id="buyerStreet"
            value={buyer.address?.street ?? ''}
            onChange={(e) => updateAddress({ street: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="buyerPostal">Postal Code</Label>
            <Input
              id="buyerPostal"
              value={buyer.address?.postalCode ?? ''}
              onChange={(e) => updateAddress({ postalCode: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="buyerCity">City</Label>
            <Input
              id="buyerCity"
              value={buyer.address?.city ?? ''}
              onChange={(e) => updateAddress({ city: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="buyerCountry">Country</Label>
            <Input
              id="buyerCountry"
              value={buyer.address?.countryCode ?? country}
              onChange={(e) => updateAddress({ countryCode: e.target.value.toUpperCase() })}
              maxLength={2}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="buyerEmail">Contact Email (optional)</Label>
          <Input
            id="buyerEmail"
            type="email"
            value={buyer.contactEmail ?? ''}
            onChange={(e) => updateBuyer({ contactEmail: e.target.value })}
          />
        </div>
      </CardContent>
    </Card>
  )
}
