import { z } from 'zod'

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  countryCode: z.string().length(2, 'Country code must be 2 letters'),
})

export const partySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  registrationName: z.string().optional(),
  vatId: z.string().min(1, 'VAT ID is required'),
  address: addressSchema,
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
})

export const bankAccountSchema = z.object({
  iban: z.string().min(1, 'IBAN is required'),
  bic: z.string().optional(),
  accountName: z.string().optional(),
})

export const lineItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Item name is required'),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  unitCode: z.string().default('HUR'),
  unitPrice: z.coerce.number().min(0, 'Price must be >= 0'),
  vatRate: z.coerce.number().min(0),
  vatCategoryCode: z.string().default('S'),
})

export const invoiceFormSchema = z.object({
  country: z.enum(['DE', 'FR']),
  format: z.string().min(1),
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  currencyCode: z.string().default('EUR'),
  invoiceTypeCode: z.string().default('380'),
  buyerReference: z.string().optional(),
  note: z.string().optional(),
  seller: partySchema,
  buyer: partySchema,
  bankAccount: bankAccountSchema,
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
})

export type Address = z.infer<typeof addressSchema>
export type Party = z.infer<typeof partySchema>
export type BankAccount = z.infer<typeof bankAccountSchema>
export type LineItem = z.infer<typeof lineItemSchema>
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>

export const UNIT_CODES = [
  { value: 'HUR', label: 'Hour' },
  { value: 'DAY', label: 'Day' },
  { value: 'H87', label: 'Piece' },
  { value: 'KGM', label: 'Kilogram' },
  { value: 'MTR', label: 'Metre' },
  { value: 'LTR', label: 'Litre' },
  { value: 'MON', label: 'Month' },
  { value: 'C62', label: 'Unit' },
] as const
