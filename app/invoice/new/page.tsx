'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Stepper } from '@/components/shared/stepper'
import { CountryStep } from '@/components/invoice-form/country-step'
import { SellerStep } from '@/components/invoice-form/seller-step'
import { BuyerStep } from '@/components/invoice-form/buyer-step'
import { ItemsStep } from '@/components/invoice-form/items-step'
import { ReviewStep } from '@/components/invoice-form/review-step'
import type { InvoiceFormData } from '@/types/invoice-form'

const STEPS = [
  { title: 'Basics', description: 'Country & invoice details' },
  { title: 'Seller', description: 'Your business info' },
  { title: 'Buyer', description: 'Client information' },
  { title: 'Items', description: 'Line items & totals' },
  { title: 'Review', description: 'Preview & generate' },
]

export default function NewInvoicePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<InvoiceFormData>>({
    country: 'DE',
    format: 'XRECHNUNG-UBL',
    currencyCode: 'EUR',
    invoiceTypeCode: '380',
  })

  const updateFormData = (updates: Partial<InvoiceFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return !!(formData.country && formData.format && formData.invoiceNumber)
      case 1:
        return !!(formData.seller?.name && formData.seller?.vatId && formData.bankAccount?.iban)
      case 2:
        return !!(formData.buyer?.name && formData.buyer?.vatId)
      case 3:
        return (formData.lineItems ?? []).length > 0 &&
          (formData.lineItems ?? []).every((item) => item.name && item.quantity > 0)
      default:
        return true
    }
  }

  const renderStep = () => {
    const stepProps = { data: formData, onChange: updateFormData }
    switch (currentStep) {
      case 0:
        return <CountryStep {...stepProps} />
      case 1:
        return <SellerStep {...stepProps} />
      case 2:
        return <BuyerStep {...stepProps} />
      case 3:
        return <ItemsStep {...stepProps} />
      case 4:
        return <ReviewStep {...stepProps} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Stepper
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      <form onSubmit={(e) => e.preventDefault()}>
        {renderStep()}

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep((s) => s - 1)}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          {currentStep < STEPS.length - 1 && (
            <Button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canGoNext()}
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
