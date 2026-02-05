import { useSEO } from '@/hooks/useSEO'
import { getBusinessStructuredData } from '@/lib/seo'
import { valibotResolver } from '@hookform/resolvers/valibot'
import {
  Heart,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Star,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as v from 'valibot'

// Feedback form validation schema
const feedbackSchema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your name'),
    v.minLength(2, 'Name must be at least 2 characters')
  ),
  email: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your email'),
    v.email('Please enter a valid email address')
  ),
  phone: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^(\+234|0)[789][01]\d{8}$/, 'Please enter a valid Nigerian phone number')
    )
  ),
  subject: v.pipe(
    v.string(),
    v.nonEmpty('Please enter a subject'),
    v.minLength(3, 'Subject must be at least 3 characters')
  ),
  message: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your message'),
    v.minLength(10, 'Message must be at least 10 characters')
  ),
  rating: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(5))),
  category: v.pipe(v.string(), v.nonEmpty('Please select a category')),
})

type FeedbackFormData = v.InferInput<typeof feedbackSchema>

const feedbackCategories = [
  'General Feedback',
  'Product Quality',
  'Customer Service',
  'Order Experience',
  'Website/App',
  'Delivery',
  'Suggestion',
  'Complaint',
  'Compliment',
]

export default function Feedback() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<FeedbackFormData>({
    resolver: valibotResolver(feedbackSchema),
    defaultValues: {
      category: '',
      rating: undefined,
    },
  })

  useSEO({
    title: 'Feedback - Omade Cravings | Share Your Experience',
    description:
      'We value your feedback! Share your experience with Omade Cravings and help us improve our artisanal bakery products and services.',
    keywords: ['feedback', 'contact', 'customer service', 'review', 'bakery feedback'],
    structuredData: getBusinessStructuredData(),
  })

  const onSubmit = async (data: FeedbackFormData) => {
    try {
      setIsSubmitting(true)

      // Simulate API call - replace with actual feedback submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log('Feedback submission:', {
        ...data,
        rating: selectedRating,
        submittedAt: new Date().toISOString(),
      })

      toast.success(
        'Thank you for your feedback! We appreciate you taking the time to share your thoughts.'
      )
      reset()
      setSelectedRating(null)
    } catch (error) {
      console.error('Feedback submission error:', error)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating)
    setValue('rating', rating)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-6 tracking-wide">
            WE WOULD LOVE TO HEAR FROM YOU
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your feedback helps us create better experiences. Please share your thoughts,
            suggestions, or concerns with us.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Information */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-wide">
                  GET IN TOUCH
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Phone className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Phone</p>
                      <p className="text-gray-600">+234 809 742 3996</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Mail className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Email</p>
                      <p className="text-gray-600">hello@omadecravings.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Instagram className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Instagram</p>
                      <p className="text-gray-600">@omadecravings</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <MapPin className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">Location</p>
                      <p className="text-gray-600">Lagos, Nigeria</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Why Your Feedback Matters
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center space-x-3">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Helps us improve our recipes and products</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span>Guides our customer service approach</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Shapes future bakery innovations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Share Your Experience</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name and Email */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                      placeholder="Enter your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone and Category */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                      placeholder="+234 801 234 5678"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      {...register('category')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    >
                      <option value="">Select a category</option>
                      {feedbackCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    {...register('subject')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors"
                    placeholder="Brief description of your feedback"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Rate Your Experience
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => handleRatingClick(rating)}
                        className="p-1 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            selectedRating && rating <= selectedRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
                        />
                      </button>
                    ))}
                    {selectedRating && (
                      <span className="ml-3 text-sm text-gray-600">
                        {selectedRating === 1 && 'Poor'}
                        {selectedRating === 2 && 'Fair'}
                        {selectedRating === 3 && 'Good'}
                        {selectedRating === 4 && 'Very Good'}
                        {selectedRating === 5 && 'Excellent'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                    placeholder="Share your detailed feedback, suggestions, or concerns..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center space-x-3 ${
                      !isValid || isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>SENDING MESSAGE...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>SEND MESSAGE</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thank You for Choosing Omade Cravings
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every piece of feedback helps us craft better experiences and maintain the highest
              quality in our artisanal baked goods. We read every message and use your insights to
              continuously improve.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
