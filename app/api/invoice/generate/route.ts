import { NextRequest, NextResponse } from 'next/server'
import { invoiceFormSchema } from '@/types/invoice-form'
import { buildInvoiceJson } from '@/lib/invoice-builder'
import { generateInvoicePdf } from '@/lib/pdf-generator'
import type { Invoice, InvoiceServiceOptions } from '@e-invoice-eu/core'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = invoiceFormSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const formData = parsed.data
    const invoiceJson = buildInvoiceJson(formData) as unknown as Invoice

    const isPdf = formData.format.toLowerCase().includes('factur-x') ||
      formData.format.toLowerCase().includes('zugferd')

    const { InvoiceService } = await import('@e-invoice-eu/core')

    const logger = {
      log: () => {},
      error: console.error,
      warn: console.warn,
      debug: () => {},
      verbose: () => {},
      fatal: console.error,
    }

    const options: InvoiceServiceOptions = {
      format: formData.format,
      lang: formData.country === 'DE' ? 'de' : 'fr',
    }

    if (isPdf) {
      const pdfBuffer = await generateInvoicePdf(formData)
      options.pdf = {
        buffer: new Uint8Array(pdfBuffer),
        filename: `invoice-${formData.invoiceNumber}.pdf`,
        mimetype: 'application/pdf',
      }
    }

    const invoiceService = new InvoiceService(logger)
    const result = await invoiceService.generate(invoiceJson, options)

    const contentType = isPdf ? 'application/pdf' : 'application/xml'
    const extension = isPdf ? 'pdf' : 'xml'
    const filename = `invoice-${formData.invoiceNumber}.${extension}`

    const responseBody = typeof result === 'string'
      ? result
      : Buffer.from(result)

    return new NextResponse(responseBody, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Invoice generation failed:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Generation failed', details: message }, { status: 500 })
  }
}
