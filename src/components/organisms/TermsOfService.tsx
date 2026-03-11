import { Link } from '@tanstack/react-router'
import { getBusinessStructuredData } from '@/lib/seo'
import { useSEO } from '@/hooks/useSEO'

export default function TermsOfService() {
  useSEO({
    title: 'Terms of Service - Omade Cravings | Artisanal Bakery',
    description:
      'Terms and conditions for using Omade Cravings website and ordering our artisanal baked goods, cakes, and pastries.',
    keywords: ['terms of service', 'terms and conditions', 'Omade Cravings', 'bakery', 'ordering'],
    structuredData: getBusinessStructuredData(),
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString('en-NG')}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Omade Cravings website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site or place orders.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use of Our Website</h2>
            <p>
              You may use our website for lawful purposes only. You agree not to misuse the site, attempt to gain unauthorized access to our systems or data, or use our services in any way that could harm us, other users, or third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Orders and Payment</h2>
            <p className="mb-3">When you place an order:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You are offering to purchase products at the prices and terms stated at the time of order.</li>
              <li>We reserve the right to accept or decline orders (e.g., due to stock, errors, or fraud).</li>
              <li>Payment is processed in NGN via Paystack. By paying, you confirm that you are authorized to use the payment method.</li>
              <li>Prices are subject to change; orders are charged at the price shown at checkout.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Delivery and Fulfillment</h2>
            <p>
              We aim to deliver within the timeframes communicated at checkout. Delivery times are estimates and not guaranteed. Risk of loss and title for items pass to you upon delivery. You are responsible for providing an accurate delivery address and being available to receive orders where required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Refunds and Cancellations</h2>
            <p>
              Refund and cancellation policies may vary by product and circumstance. For issues with an order (e.g., wrong item, quality concern), please contact us as soon as possible. We will work with you to resolve the matter. Custom or perishable items may have different cancellation terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Products and Allergens</h2>
            <p>
              Our products may contain or come into contact with allergens (e.g., gluten, nuts, dairy). It is your responsibility to check product information and inform us of any allergies. We are not liable for allergic reactions resulting from consumption of our products where we have provided accurate information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>
              The Omade Cravings name, logo, website content, and other materials are our intellectual property. You may not copy, modify, or use them without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Omade Cravings shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability for any claim shall not exceed the amount you paid for the relevant order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. Continued use of our services after changes constitutes acceptance. The &quot;Last updated&quot; date at the top indicates when the terms were last revised.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact</h2>
            {/* <p>
              For questions about these terms, please contact us via our <Link to="/feedback" className="text-gray-900 underline hover:no-underline">feedback/contact page</Link>.
            </p> */}
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link to="/" className="text-gray-900 font-medium hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
