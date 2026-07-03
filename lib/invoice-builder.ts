import type { InvoiceFormData } from '@/types/invoice-form'
import { calculateInvoiceTotals, calculateLineTotal } from './tax-calculator'
import { getCountryConfig } from './country-config'

export function buildInvoiceJson(formData: InvoiceFormData): Record<string, unknown> {
  const totals = calculateInvoiceTotals(formData.lineItems)
  const countryConfig = getCountryConfig(formData.country)
  const format = countryConfig.formats.find((f) => f.id === formData.format)
  const currency = formData.currencyCode

  const supplierParty: Record<string, unknown> = {
    'cbc:EndpointID': formData.seller.vatId,
    'cbc:EndpointID@schemeID': '9930',
    'cac:PartyName': {
      'cbc:Name': formData.seller.name,
    },
    'cac:PostalAddress': {
      'cbc:StreetName': formData.seller.address.street,
      'cbc:CityName': formData.seller.address.city,
      'cbc:PostalZone': formData.seller.address.postalCode,
      'cac:Country': {
        'cbc:IdentificationCode': formData.seller.address.countryCode,
      },
    },
    'cac:PartyTaxScheme': [
      {
        'cbc:CompanyID': formData.seller.vatId,
        'cac:TaxScheme': { 'cbc:ID': 'VAT' },
      },
    ],
    'cac:PartyLegalEntity': {
      'cbc:RegistrationName': formData.seller.registrationName || formData.seller.name,
    },
  }

  if (formData.seller.contactName || formData.seller.contactPhone || formData.seller.contactEmail) {
    const contact: Record<string, string> = {}
    if (formData.seller.contactName) contact['cbc:Name'] = formData.seller.contactName
    if (formData.seller.contactPhone) contact['cbc:Telephone'] = formData.seller.contactPhone
    if (formData.seller.contactEmail) contact['cbc:ElectronicMail'] = formData.seller.contactEmail
    supplierParty['cac:Contact'] = contact
  }

  const customerParty: Record<string, unknown> = {
    'cbc:EndpointID': formData.buyer.vatId,
    'cbc:EndpointID@schemeID': '9930',
    'cac:PartyName': {
      'cbc:Name': formData.buyer.name,
    },
    'cac:PostalAddress': {
      'cbc:StreetName': formData.buyer.address.street,
      'cbc:CityName': formData.buyer.address.city,
      'cbc:PostalZone': formData.buyer.address.postalCode,
      'cac:Country': {
        'cbc:IdentificationCode': formData.buyer.address.countryCode,
      },
    },
    'cac:PartyTaxScheme': {
      'cbc:CompanyID': formData.buyer.vatId,
      'cac:TaxScheme': { 'cbc:ID': 'VAT' },
    },
    'cac:PartyLegalEntity': {
      'cbc:RegistrationName': formData.buyer.registrationName || formData.buyer.name,
    },
  }

  const taxSubtotals = totals.taxSubtotals.map((st) => ({
    'cbc:TaxableAmount': String(st.taxableAmount),
    'cbc:TaxableAmount@currencyID': currency,
    'cbc:TaxAmount': String(st.taxAmount),
    'cbc:TaxAmount@currencyID': currency,
    'cac:TaxCategory': {
      'cbc:ID': st.categoryCode,
      'cbc:Percent': String(st.taxRate),
      'cac:TaxScheme': { 'cbc:ID': 'VAT' },
    },
  }))

  const invoiceLines = formData.lineItems.map((item, index) => {
    const lineTotal = calculateLineTotal(item)
    return {
      'cbc:ID': String(index + 1),
      'cbc:InvoicedQuantity': String(item.quantity),
      'cbc:InvoicedQuantity@unitCode': item.unitCode,
      'cbc:LineExtensionAmount': String(lineTotal),
      'cbc:LineExtensionAmount@currencyID': currency,
      'cac:Item': {
        'cbc:Name': item.name,
        'cac:ClassifiedTaxCategory': {
          'cbc:ID': item.vatCategoryCode,
          'cbc:Percent': String(item.vatRate),
          'cac:TaxScheme': { 'cbc:ID': 'VAT' },
        },
      },
      'cac:Price': {
        'cbc:PriceAmount': String(item.unitPrice),
        'cbc:PriceAmount@currencyID': currency,
      },
    }
  })

  const invoice: Record<string, unknown> = {
    'ubl:Invoice': {
      'cbc:CustomizationID': 'urn:cen.eu:en16931:2017',
      'cbc:ProfileID': 'urn:fdc:peppol.eu:2017:poacc:billing:01:1.0',
      'cbc:ID': formData.invoiceNumber,
      'cbc:IssueDate': formData.issueDate,
      'cbc:DueDate': formData.dueDate,
      'cbc:InvoiceTypeCode': formData.invoiceTypeCode,
      ...(formData.note ? { 'cbc:Note': [formData.note] } : {}),
      'cbc:DocumentCurrencyCode': currency,
      ...(formData.buyerReference ? { 'cbc:BuyerReference': formData.buyerReference } : {}),
      'cac:AccountingSupplierParty': {
        'cac:Party': supplierParty,
      },
      'cac:AccountingCustomerParty': {
        'cac:Party': customerParty,
      },
      'cac:PaymentMeans': [
        {
          'cbc:PaymentMeansCode': '30',
          'cbc:PaymentMeansCode@name': 'Bank Transfer',
          'cbc:PaymentID': `Invoice ${formData.invoiceNumber}`,
          'cac:PayeeFinancialAccount': {
            'cbc:ID': formData.bankAccount.iban,
            ...(formData.bankAccount.accountName
              ? { 'cbc:Name': formData.bankAccount.accountName }
              : {}),
            ...(formData.bankAccount.bic
              ? {
                  'cac:FinancialInstitutionBranch': {
                    'cbc:ID': formData.bankAccount.bic,
                  },
                }
              : {}),
          },
        },
      ],
      'cac:TaxTotal': [
        {
          'cbc:TaxAmount': String(totals.totalTaxAmount),
          'cbc:TaxAmount@currencyID': currency,
          'cac:TaxSubtotal': taxSubtotals,
        },
      ],
      'cac:LegalMonetaryTotal': {
        'cbc:LineExtensionAmount': String(totals.lineExtensionAmount),
        'cbc:LineExtensionAmount@currencyID': currency,
        'cbc:TaxExclusiveAmount': String(totals.taxExclusiveAmount),
        'cbc:TaxExclusiveAmount@currencyID': currency,
        'cbc:TaxInclusiveAmount': String(totals.taxInclusiveAmount),
        'cbc:TaxInclusiveAmount@currencyID': currency,
        'cbc:PayableAmount': String(totals.payableAmount),
        'cbc:PayableAmount@currencyID': currency,
      },
      'cac:InvoiceLine': invoiceLines,
    },
  }

  if (format?.id.startsWith('XRECHNUNG')) {
    const inv = invoice['ubl:Invoice'] as Record<string, unknown>
    inv['cbc:CustomizationID'] =
      'urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0'
  }

  return invoice
}
