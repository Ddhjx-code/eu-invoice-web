import PDFDocument from 'pdfkit'
import type { InvoiceFormData } from '@/types/invoice-form'
import { calculateInvoiceTotals, calculateLineTotal } from './tax-calculator'

export async function generateInvoicePdf(formData: InvoiceFormData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    const chunks: Uint8Array[] = []

    doc.on('data', (chunk: Uint8Array) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const totals = calculateInvoiceTotals(formData.lineItems)
    const pageWidth = doc.page.width - 100

    doc.fontSize(20).text('INVOICE', { align: 'right' })
    doc.moveDown(0.5)

    doc.fontSize(10)
    doc.text(`Invoice No: ${formData.invoiceNumber}`, { align: 'right' })
    doc.text(`Date: ${formData.issueDate}`, { align: 'right' })
    doc.text(`Due: ${formData.dueDate}`, { align: 'right' })
    if (formData.buyerReference) {
      doc.text(`Ref: ${formData.buyerReference}`, { align: 'right' })
    }
    doc.moveDown(1.5)

    const sellerX = 50
    const buyerX = 320

    doc.fontSize(8).fillColor('#888888')
    doc.text('FROM', sellerX, doc.y)
    doc.text('TO', buyerX, doc.y - doc.currentLineHeight())
    doc.fillColor('#000000').fontSize(10)

    const infoY = doc.y + 5
    doc.font('Helvetica-Bold').text(formData.seller.name, sellerX, infoY)
    doc.font('Helvetica').fontSize(9)
    doc.text(formData.seller.address.street, sellerX)
    doc.text(`${formData.seller.address.postalCode} ${formData.seller.address.city}`, sellerX)
    doc.text(`VAT: ${formData.seller.vatId}`, sellerX)

    doc.font('Helvetica-Bold').fontSize(10).text(formData.buyer.name, buyerX, infoY)
    doc.font('Helvetica').fontSize(9)
    doc.text(formData.buyer.address.street, buyerX)
    doc.text(`${formData.buyer.address.postalCode} ${formData.buyer.address.city}`, buyerX)
    doc.text(`VAT: ${formData.buyer.vatId}`, buyerX)

    doc.y = Math.max(doc.y, infoY + 80)
    doc.moveDown(2)

    const tableTop = doc.y
    const colWidths = [30, pageWidth * 0.35, 60, 50, 80, 60, 80]
    const headers = ['#', 'Description', 'Qty', 'Unit', 'Price', 'VAT%', 'Total']

    doc.fontSize(8).font('Helvetica-Bold').fillColor('#555555')
    let xPos = 50
    headers.forEach((header, i) => {
      doc.text(header, xPos, tableTop, { width: colWidths[i], align: i >= 2 ? 'right' : 'left' })
      xPos += colWidths[i]
    })

    doc.moveTo(50, tableTop + 14).lineTo(50 + pageWidth, tableTop + 14).lineWidth(0.5).stroke('#cccccc')

    doc.font('Helvetica').fillColor('#000000').fontSize(9)
    let rowY = tableTop + 20

    formData.lineItems.forEach((item, index) => {
      const lineTotal = calculateLineTotal(item)
      xPos = 50
      const values = [
        String(index + 1),
        item.name,
        String(item.quantity),
        item.unitCode,
        `${formData.currencyCode} ${item.unitPrice.toFixed(2)}`,
        `${item.vatRate}%`,
        `${formData.currencyCode} ${lineTotal.toFixed(2)}`,
      ]
      values.forEach((val, i) => {
        doc.text(val, xPos, rowY, { width: colWidths[i], align: i >= 2 ? 'right' : 'left' })
        xPos += colWidths[i]
      })
      rowY += 18
    })

    doc.moveTo(50, rowY).lineTo(50 + pageWidth, rowY).lineWidth(0.5).stroke('#cccccc')
    rowY += 10

    const summaryX = 350
    const valX = 450
    doc.fontSize(9)
    doc.text('Subtotal (net):', summaryX, rowY, { width: 100, align: 'right' })
    doc.text(`${formData.currencyCode} ${totals.lineExtensionAmount.toFixed(2)}`, valX, rowY, { width: 100, align: 'right' })
    rowY += 16

    totals.taxSubtotals.forEach((st) => {
      doc.text(`VAT ${st.taxRate}%:`, summaryX, rowY, { width: 100, align: 'right' })
      doc.text(`${formData.currencyCode} ${st.taxAmount.toFixed(2)}`, valX, rowY, { width: 100, align: 'right' })
      rowY += 16
    })

    doc.moveTo(summaryX, rowY).lineTo(50 + pageWidth, rowY).lineWidth(0.5).stroke('#cccccc')
    rowY += 8
    doc.font('Helvetica-Bold').fontSize(11)
    doc.text('Total:', summaryX, rowY, { width: 100, align: 'right' })
    doc.text(`${formData.currencyCode} ${totals.taxInclusiveAmount.toFixed(2)}`, valX, rowY, { width: 100, align: 'right' })

    rowY += 40
    doc.font('Helvetica').fontSize(9).fillColor('#555555')
    doc.text('Payment Details', 50, rowY)
    doc.fillColor('#000000')
    rowY += 14
    doc.text(`IBAN: ${formData.bankAccount.iban}`, 50, rowY)
    if (formData.bankAccount.bic) {
      rowY += 14
      doc.text(`BIC: ${formData.bankAccount.bic}`, 50, rowY)
    }

    if (formData.note) {
      rowY += 30
      doc.fontSize(8).fillColor('#888888').text('Note:', 50, rowY)
      doc.fillColor('#000000').text(formData.note, 50, rowY + 12)
    }

    doc.end()
  })
}
