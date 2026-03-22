import {
  PaymentLoader,
  type PaymentStatus,
} from "@/components/ui/PaymentLoader";
import {
  type CheckoutFormData,
  checkoutSchema,
} from "@/lib/checkout-validation";
import {
  calculateDeliveryFee,
  formatAmountForDisplay,
  paystackService,
} from "@/services/paystack";
import { useCartStore } from "@/store/cart";
import {
  DELIVERY_AREAS,
  DELIVERY_TIME_SLOTS,
  NIGERIAN_STATES,
} from "@/types/checkout";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  Shield,
  Store,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CheckoutFormProps {
  onOrderComplete?: (orderId: string) => void;
}

export const CheckoutForm = ({ onOrderComplete }: CheckoutFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] =
    useState(DELIVERY_TIME_SLOTS);
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus>("processing");
  const [showPaymentLoader, setShowPaymentLoader] = useState(false);
  const [currentFormData, setCurrentFormData] =
    useState<CheckoutFormData | null>(null);
  const [currentPaymentReference, setCurrentPaymentReference] = useState<
    string | null
  >(null);

  const { items, subtotal, totalPrice, clearCart } = useCartStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    resolver: valibotResolver(checkoutSchema),
    mode: "all",
    defaultValues: {
      deliveryMethod: "home_delivery",
      acceptTerms: false,
      marketingConsent: false,
    },
  });

  console.log(errors, isValid);
  

  const watchedState = watch("state");
  const watchedDeliveryMethod = watch("deliveryMethod");

  // Calculate delivery fee when state changes
  useEffect(() => {
    if (watchedState && watchedDeliveryMethod === "home_delivery") {
      const fee = calculateDeliveryFee(watchedState, subtotal);
      setDeliveryFee(fee);
    } else {
      setDeliveryFee(0);
    }
  }, [watchedState, watchedDeliveryMethod, subtotal]);

  // Set minimum delivery date (next day)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split("T")[0]);
  }, []);

  const finalTotal = subtotal + deliveryFee;

  const formatCurrency = (amount: number) => formatAmountForDisplay(amount);

  // Convert checkout data to order format
  const prepareOrderData = (
    formData: CheckoutFormData,
    paymentReference: string,
  ) => {
    console.log("Raw cart items:", items);
    const filteredItems = items.filter(
      (item) =>
        item.productId != null &&
        item.productId !== undefined &&
        item.productId !== "",
    );
    console.log("Filtered items:", filteredItems);

    return {
      items: filteredItems.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        customCakeConfig: item.customizations
          ? {
              ...(item.customizations.flavors && {
                flavor: item.customizations.flavors.join(", "),
              }),
              ...(item.customizations.size && {
                size: item.customizations.size,
              }),
              ...(item.customizations.message && {
                message: item.customizations.message,
              }),
              ...(item.customizations.layers && {
                extraDetails: {
                  layers: item.customizations.layers,
                  ...(item.customizations.extras && {
                    decorations: item.customizations.extras,
                  }),
                },
              }),
            }
          : undefined,
        specialInstructions: formData.deliveryInstructions || undefined,
      })),
      guest_email: formData.email,
      guest_name: `${formData.firstName} ${formData.lastName}`,
      guest_phone: formData.phone,
      pickup_instructions:
        formData.deliveryMethod === "pickup"
          ? formData.deliveryInstructions
          : undefined,
      preferred_pickup_date: formData.deliveryDate || undefined,
      // preferred_pickup_time: formData.deliveryTime ? `${formData.deliveryTime}:00` : undefined,
      // Additional fields for home delivery
      delivery_method: formData.deliveryMethod,
      delivery_address:
        formData.deliveryMethod === "home_delivery"
          ? {
              address: formData.address,
              city: formData.city,
              state: formData.state,
              postal_code: formData.postalCode,
            }
          : undefined,
      payment_reference: paymentReference,
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      total_amount: finalTotal,
    };
  };

  const handlePaymentSuccess = async (
    response: any,
    formData: CheckoutFormData,
  ) => {
    try {
      setPaymentStatus("verifying");
      setCurrentPaymentReference(response.reference);

      // Verify payment with retries and proper error handling
      const verificationResult = await paystackService.verifyPayment(
        response.reference,
      );

      if (!verificationResult.success) {
        throw new Error(
          verificationResult.error || "Payment verification failed",
        );
      }

      // Move to order creation phase
      setPaymentStatus("creating_order");

      // Create order in backend
      const orderPayload = prepareOrderData(formData, response.reference);
      console.log("Sending order data:", orderPayload);

      const response_order = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/orders/guest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderPayload),
        },
      );

      if (!response_order.ok) {
        const error = await response_order.json();
        throw new Error(error.message || "Failed to create order");
      }

      const createdOrder = await response_order.json();

      // Success state
      setPaymentStatus("success");

      // Clear cart
      clearCart();

      // Show success message
      toast.success("Order placed successfully!");

      // Wait for success animation then redirect
      setTimeout(() => {
        setShowPaymentLoader(false);
        const orderData = createdOrder.data;
        onOrderComplete?.(orderData.id);
        console.log("Order created successfully:", {
          orderId: orderData.id,
          orderNumber: orderData.order_number,
          paymentReference: response.reference,
          amount: response.amount,
        });
      }, 2000);
    } catch (error) {
      console.error("Payment processing failed:", error);
      setPaymentStatus("error");

      // Show specific error message based on the error type
      if (error instanceof Error) {
        if (
          error.message.includes("timeout") ||
          error.message.includes("Timeout")
        ) {
          setPaymentStatus("timeout");
          toast.error(
            "Payment verification is taking longer than expected. Please wait or contact support.",
          );
        } else if (error.message.includes("verification")) {
          toast.error(
            "Payment verification failed. Please contact support with your transaction reference.",
          );
        } else if (error.message.includes("order")) {
          toast.error(
            "Payment was successful but order creation failed. Please contact support.",
          );
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("An unexpected error occurred. Please contact support.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = () => {
    setPaymentStatus("cancelled");
    setIsProcessing(false);
    toast.error("Payment was cancelled or failed");
  };

  const handleRetryPayment = () => {
    setShowPaymentLoader(false);
    setPaymentStatus("processing");
    setCurrentPaymentReference(null);

    if (currentFormData) {
      // Retry with the same form data
      setTimeout(() => onSubmit(currentFormData), 500);
    }
  };

  const handleClosePaymentLoader = () => {
    setShowPaymentLoader(false);
    setPaymentStatus("processing");
    setCurrentPaymentReference(null);
    setCurrentFormData(null);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsProcessing(true);
      setCurrentFormData(data);
      setPaymentStatus("processing");
      setShowPaymentLoader(true);

      // Prepare payment configuration
      const paymentConfig = paystackService.preparePaymentConfig(
        data,
        finalTotal,
        items,
      );

      // Initialize Paystack payment
      await paystackService.initializePayment({
        ...paymentConfig,
        callback: (response: any) => handlePaymentSuccess(response, data),
        onClose: () => {
          setShowPaymentLoader(false);
          handlePaymentError();
        },
      });
    } catch (error) {
      console.error("Payment initialization error:", error);
      setPaymentStatus("error");
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form data-order onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Contact Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
            1
          </div>
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              {...register("firstName")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              {...register("lastName")}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              {...register("phone")}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              placeholder="11 digits (e.g. 08012345678)"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
            2
          </div>
          Delivery Information
        </h3>

        {/* Delivery Method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Delivery Method *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="relative">
              <input
                {...register("deliveryMethod")}
                type="radio"
                value="home_delivery"
                className="sr-only"
              />
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  watchedDeliveryMethod === "home_delivery"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Truck className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">Home Delivery</div>
                    <div className="text-sm opacity-75">
                      Delivered to your address
                    </div>
                  </div>
                </div>
              </div>
            </label>

            <label className="relative">
              <input
                {...register("deliveryMethod")}
                type="radio"
                value="pickup"
                className="sr-only"
              />
              <div
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  watchedDeliveryMethod === "pickup"
                    ? "border-black bg-black text-white"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Store className="h-5 w-5 mr-3" />
                  <div>
                    <div className="font-medium">Store Pickup</div>
                    <div className="text-sm opacity-75">
                      Pick up from our bakery
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Address Fields (only for home delivery) */}
        {watchedDeliveryMethod === "home_delivery" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address *
              </label>
              <textarea
                {...register("address")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
                rows={3}
                placeholder="Enter your full delivery address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <input
                  {...register("city")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <select
                  {...register("state")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  {...register("postalCode")}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  placeholder="123456"
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode.message}
                  </p>
                )}
              </div> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Instructions (Optional)
              </label>
              <textarea
                {...register("deliveryInstructions")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
                rows={2}
                placeholder="Any special instructions for delivery..."
              />
            </div>
          </div>
        )}

        {/* Delivery Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Preferred Delivery Date
            </label>
            <input
              {...register("deliveryDate")}
              type="date"
              min={selectedDate}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Preferred Time Slot
            </label>
            <select
              {...register("deliveryTime")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            >
              <option value="">Select time slot</option>
              {availableTimeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Delivery Fee Notice */}
        {watchedDeliveryMethod === "home_delivery" && watchedState && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">
                  Delivery Information for {watchedState}
                </p>
                <p className="mt-1">
                  Please note that delivery fee is not included in the total
                  amount. We will contact you to confirm the delivery fee.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terms and Agreement */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
          <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
            3
          </div>
          Terms & Agreement
        </h3>

        <div className="space-y-4">
          <label className="flex items-start">
            <input
              {...register("acceptTerms")}
              type="checkbox"
              className="mt-1 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <span className="ml-3 text-sm text-gray-700">
              I accept the{" "}
              <a
                href="/terms"
                className="text-black underline hover:no-underline"
              >
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-black underline hover:no-underline"
              >
                Privacy Policy
              </a>
              *
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>
          )}

          <label className="flex items-start">
            <input
              {...register("marketingConsent")}
              type="checkbox"
              className="mt-1 h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
            />
            <span className="ml-3 text-sm text-gray-700">
              I would like to receive updates about new products and special
              offers via email
            </span>
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Order Summary
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Subtotal ({items.length} items)
            </span>
            <span className="text-gray-900">{formatCurrency(subtotal)}</span>
          </div>

          {deliveryFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-gray-900">
                {formatCurrency(deliveryFee)}
              </span>
            </div>
          )}

         

          <div className="border-t border-gray-200 pt-3 flex justify-between font-medium">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900 text-lg">
              {formatCurrency(finalTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || isProcessing || items.length === 0}
        className={`w-full py-4 px-6 rounded-lg font-medium text-lg transition-all flex items-center justify-center space-x-2 ${
          !isValid || isProcessing || items.length === 0
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <CreditCard className="h-5 w-5" />
        )}
        <span>
          {isProcessing
            ? "Processing..."
            : `Pay ${formatCurrency(finalTotal)} with Paystack`}
        </span>
      </button>

      {/* Security Notice */}
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <Shield className="h-4 w-4" />
        <span>Secure payment powered by Paystack</span>
      </div>

      {/* Payment Loader */}
      <PaymentLoader
        isVisible={showPaymentLoader}
        status={paymentStatus}
        message={
          paymentStatus === "verifying" && currentPaymentReference
            ? `Verifying payment reference: ${currentPaymentReference}`
            : undefined
        }
        onRetry={handleRetryPayment}
        onCancel={handleClosePaymentLoader}
        autoHideOnSuccess={false}
      />
    </form>
  );
};
