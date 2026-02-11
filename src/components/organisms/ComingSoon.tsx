import { useSEO } from '@/hooks/useSEO'
import { getBusinessStructuredData } from '@/lib/seo'
import OmadeLogo from "@/assets/Images/Omade Cravings.png"

const ComingSoon = () => {
  useSEO({
    title: 'Omade Cravings - Coming Soon | Artisanal Bakery',
    description:
      'Something delicious is coming. Omade Cravings artisanal bakery will be launching soon with fresh handcrafted breads and pastries.',
    keywords: ['artisanal bakery', 'coming soon', 'handcrafted bread', 'fresh pastries'],
    structuredData: getBusinessStructuredData(),
  })

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="my-4 ">
          {/* <h1
            className="text-4xl sm:text-6xl lg:text-8xl font-light text-gray-900 tracking-tight"
            style={{ fontFamily: 'serif' }}
          >
            OMADE CRAVINGS
          </h1> */}

          <img src={OmadeLogo} width={100}  alt="Omade Cravings Logo" className="mx-auto h-16 sm:h-20 lg:h-24" />
        </div>

        {/* Coming Soon Message */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-6 tracking-wide">
            COMING SOON
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
            Something delicious is baking in our ovens. We're crafting an extraordinary artisanal
            bakery experience that will bring you the finest handcrafted breads, pastries, and
            specialty baked goods.
          </p>
          <p className="text-base text-gray-500">
            Get ready to taste the difference that passion and tradition make.
          </p>
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Be the first to know</h3>
          <p className="text-sm text-gray-600 mb-6">
            Subscribe to get notified when we launch and receive exclusive early access.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-900 text-sm"
            />
            <button className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors font-medium text-sm">
              NOTIFY ME
            </button>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-4">Follow our journey</p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12.017 0C8.396 0 7.989.016 6.756.072 5.526.128 4.705.334 3.999.63c-.723.319-1.274.687-1.85 1.266C1.567 2.472 1.199 3.023.88 3.746c-.297.706-.503 1.527-.559 2.757C.264 7.736.248 8.143.248 11.764s.016 4.028.072 5.261c.056 1.23.262 2.051.559 2.757.319.723.687 1.274 1.266 1.85.576.576 1.127.944 1.85 1.263.706.297 1.527.503 2.757.559 1.233.056 1.64.072 5.261.072s4.028-.016 5.261-.072c1.23-.056 2.051-.262 2.757-.559.723-.319 1.274-.687 1.85-1.266.576-.576.944-1.127 1.263-1.85.297-.706.503-1.527.559-2.757.056-1.233.072-1.64.072-5.261s-.016-4.028-.072-5.261c-.056-1.23-.262-2.051-.559-2.757a5.225 5.225 0 00-1.266-1.85C17.472 1.567 16.921 1.199 16.198.88c-.706-.297-1.527-.503-2.757-.559C12.208.264 11.801.248 8.18.248 8.18.248 8.171.248 12.017 0zm0 2.17c3.304 0 3.697.016 5.007.072.879.04 1.358.187 1.677.31.421.164.723.359 1.038.673.314.315.51.617.673 1.038.123.32.27.798.31 1.677.056 1.31.072 1.703.072 5.007s-.016 3.697-.072 5.007c-.04.879-.187 1.358-.31 1.677-.164.421-.359.723-.673 1.038a2.79 2.79 0 01-1.038.673c-.32.123-.798.27-1.677.31-1.31.056-1.703.072-5.007.072s-3.697-.016-5.007-.072c-.879-.04-1.358-.187-1.677-.31a2.79 2.79 0 01-1.038-.673 2.79 2.79 0 01-.673-1.038c-.123-.32-.27-.798-.31-1.677-.056-1.31-.072-1.703-.072-5.007s.016-3.697.072-5.007c.04-.879.187-1.358.31-1.677.164-.421.359-.723.673-1.038.315-.314.617-.51 1.038-.673.32-.123.798-.27 1.677-.31 1.31-.056 1.703-.072 5.007-.072z"
                />
                <path d="M12.017 15.33a3.566 3.566 0 110-7.132 3.566 3.566 0 010 7.132zM12.017 5.898a6.1 6.1 0 100 12.2 6.1 6.1 0 000-12.2zM18.408 5.594a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
