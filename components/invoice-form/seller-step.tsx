'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { COUNTRIES } from '@/lib/country-config'
import type { InvoiceFormData, Party, BankAccount } from '@/types/invoice-form'

interface SellerStepProps {
  data: Partial<InvoiceFormData>
  onChange: (data: Partial<InvoiceFormData>) => void
}

const STORAGE_KEY = 'eu-invoice-seller'

function loadSavedSeller(): { seller: Partial<Party>; bankAccount: Partial<BankAccount> } | null {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function saveSeller(seller: Partial<Party>, bankAccount: Partial<BankAccount>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ seller, bankAccount }))
}

export function SellerStep({ data, onChange }: SellerStepProps) {
  const country = data.country ?? 'DE'
  const config = COUNTRIES[country]
  const seller: Partial<Party> = data.seller ?? {}
  const bank: Partial<BankAccount> = data.bankAccount ?? {}

  const updateSeller = (updates: Partial<Party>) => {
    onChange({ seller: { ...seller, ...updates } as Party })
  }

  const updateAddress = (updates: Record<string, string>) => {
    updateSeller({
      address: { ...seller.address, ...updates } as Party['address'],
    })
  }

  const updateBank = (updates: Partial<BankAccount>) => {
    onChange({ bankAccount: { ...bank, ...updates } as BankAccount })
  }

  const handleLoadSaved = () => {
    const saved = loadSavedSeller()
    if (saved) {
      onChange({
        seller: { ...seller, ...saved.seller } as Party,
        bankAccount: { ...bank, ...saved.bankAccount } as BankAccount,
      })
    }
  }

  const handleSave = () => {
    saveSeller(seller, bank)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Business Information</CardTitle>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleLoadSaved}>
                Load Saved
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sellerName">Company Name</Label>
              <Input
                id="sellerName"
                value={seller.name ?? ''}
                onChange={(e) => updateSeller({ name: e.target.value })}
                placeholder="Acme GmbH"
              />
            </div>
            <div>
              <Label htmlFor="sellerVatId">VAT ID</Label>
              <Input
                id="sellerVatId"
                value={seller.vatId ?? ''}
                onChange={(e) => updateSeller({ vatId: e.target.value })}
                placeholder={config.vatIdPlaceholder}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="sellerStreet">Street Address</Label>
            <Input
              id="sellerStreet"
              value={seller.address?.street ?? ''}
              onChange={(e) => updateAddress({ street: e.target.value })}
              placeholder="Musterstraße 42"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="sellerPostal">Postal Code</Label>
              <Input
                id="sellerPostal"
                value={seller.address?.postalCode ?? ''}
                onChange={(e) => updateAddress({ postalCode: e.target.value })}
                placeholder="10115"
              />
            </div>
            <div>
              <Label htmlFor="sellerCity">City</Label>
              <Input
                id="sellerCity"
                value={seller.address?.city ?? ''}
                onChange={(e) => updateAddress({ city: e.target.value })}
                placeholder="Berlin"
              />
            </div>
            <div>
              <Label htmlFor="sellerCountry">Country</Label>
              <Input
                id="sellerCountry"
                value={seller.address?.countryCode ?? country}
                onChange={(e) => updateAddress({ countryCode: e.target.value.toUpperCase() })}
                maxLength={2}
                placeholder={country}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={seller.contactName ?? ''}
                onChange={(e) => updateSeller({ contactName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                value={seller.contactPhone ?? ''}
                onChange={(e) => updateSeller({ contactPhone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={seller.contactEmail ?? ''}
                onChange={(e) => updateSeller({ contactEmail: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bank Account</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              value={bank.iban ?? ''}
              onChange={(e) => updateBank({ iban: e.target.value.replace(/\s/g, '') })}
              placeholder="DE89370400440532013000"
            />
          </div>
          <div>
            <Label htmlFor="bic">BIC / SWIFT</Label>
            <Input
              id="bic"
              value={bank.bic ?? ''}
              onChange={(e) => updateBank({ bic: e.target.value })}
              placeholder="COBADEFFXXX"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
