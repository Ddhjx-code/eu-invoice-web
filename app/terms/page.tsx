export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 prose prose-sm dark:prose-invert">
      <h1>Terms of Use &amp; Disclaimer</h1>

      <h2>1. Nature of the Service</h2>
      <p>
        EU Invoice Generator is a free, open-source tool that helps users create
        electronic invoices in standard European formats (XRechnung, ZUGFeRD, Factur-X)
        based on the EN 16931 standard. The tool runs entirely in your browser and on
        our server for document generation only — we do not store your invoice data.
      </p>

      <h2>2. No Tax or Legal Advice</h2>
      <p>
        This tool does <strong>not</strong> provide tax, legal, or accounting advice.
        The VAT rates, invoice type codes, and format options presented are for
        convenience only. You are solely responsible for ensuring that your invoices
        comply with the applicable tax regulations in your jurisdiction.
      </p>

      <h2>3. No Guarantee of Compliance</h2>
      <p>
        While we strive to generate invoices that conform to published standards
        (EN 16931, XRechnung 3.0, Factur-X), we make <strong>no warranty</strong> that
        the generated documents will be accepted by any specific tax authority, invoicing
        platform, or business partner. Regulations change frequently — always validate
        your invoices using official tools such as the{' '}
        <a
          href="https://github.com/itplr-kosit/validator"
          target="_blank"
          rel="noopener noreferrer"
        >
          KoSIT Validator
        </a>{' '}
        (Germany) or{' '}
        <a
          href="https://portail.chorus-pro.gouv.fr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Chorus Pro
        </a>{' '}
        (France) before submission.
      </p>

      <h2>4. Provided &quot;As Is&quot;</h2>
      <p>
        The service is provided &quot;as is&quot; and &quot;as available&quot; without
        warranties of any kind, either express or implied, including but not limited to
        implied warranties of merchantability, fitness for a particular purpose, or
        non-infringement. In no event shall the authors or operators be liable for any
        claim, damages, or other liability arising from the use of this tool.
      </p>

      <h2>5. Your Responsibilities</h2>
      <ul>
        <li>Verify that all invoice data (amounts, VAT rates, party details) is accurate</li>
        <li>Ensure invoices meet the specific requirements of your tax jurisdiction</li>
        <li>Keep proper records of all invoices as required by law</li>
        <li>Consult a tax professional if you are unsure about compliance requirements</li>
      </ul>

      <h2>6. Data Privacy</h2>
      <p>
        Invoice data is sent to the server solely for PDF/XML generation and is not
        stored, logged, or shared with third parties. Seller information saved via the
        &quot;Save&quot; button is stored in your browser&apos;s local storage only.
      </p>

      <h2>7. Open Source</h2>
      <p>
        This tool is built on the{' '}
        <a
          href="https://github.com/gflohr/e-invoice-eu"
          target="_blank"
          rel="noopener noreferrer"
        >
          e-invoice-eu
        </a>{' '}
        open-source engine. The source code for both the engine and this web application
        is available for review.
      </p>
    </div>
  )
}
