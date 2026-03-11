import { useSEO } from '@/hooks/useSEO'
import { getBusinessStructuredData } from '@/lib/seo'
import { Link } from '@tanstack/react-router'

export default function PrivacyPolicy() {
  useSEO({
    title: 'Privacy Policy - Omade Cravings | Artisanal Bakery',
    description:
      'Learn how Omade Cravings collects, uses, and protects your personal information when you use our website and order our baked goods.',
    keywords: ['privacy policy', 'data protection', 'Omade Cravings', 'bakery', 'personal data'],
    structuredData: getBusinessStructuredData(),
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: {new Date().toLocaleDateString('en-NG')}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              Omade Cravings (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, place orders, or interact with our services. Please read this policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Personal information:</strong> Name, email address, phone number, and delivery address when you place an order or create an account.</li>
              <li><strong>Payment information:</strong> Payment is processed securely through Paystack. We do not store your full card details on our servers.</li>
              <li><strong>Order history:</strong> Details of orders you place, including items, quantities, and delivery preferences.</li>
              <li><strong>Communication data:</strong> Messages you send to us via contact forms, email, or feedback.</li>
              <li><strong>Newsletter:</strong> If you subscribe to our newsletter, we collect your email address to send you updates and offers.</li>
              <li><strong>Usage data:</strong> Information about how you use our website (e.g., pages visited, device type) to improve our services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Process and fulfill your orders and deliver products to you.</li>
              <li>Communicate with you about your orders, delivery, and customer support.</li>
              <li>Send newsletters and promotional content (with your consent).</li>
              <li>Improve our website, products, and customer experience.</li>
              <li>Comply with legal obligations and protect our rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to remember your preferences, keep you signed in, and understand how you use our site. You can manage cookie settings in your browser. Disabling certain cookies may affect site functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Sharing Your Information</h2>
            <p>
              We do not sell your personal information. We may share your data with trusted service providers (e.g., payment processors, delivery partners) only as needed to fulfill orders and operate our business. We require these parties to protect your information and use it only for the purposes we specify.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse. Payment transactions are handled by Paystack and are subject to their security standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>
            <p>
              Depending on your location, you may have the right to access, correct, or delete your personal data, object to processing, or request a copy of your data. To exercise these rights or ask questions about this policy, contact us via our feedback or contact page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date at the top will reflect any changes. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
            <p>
              For privacy-related questions or requests, please contact us through our <Link to="/feedback" className="text-gray-900 underline hover:no-underline">contact/feedback page</Link>.
            </p>
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
