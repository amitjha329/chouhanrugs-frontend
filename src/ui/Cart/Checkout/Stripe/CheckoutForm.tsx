import React, { FormEvent } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useSession } from '@/lib/auth-client';

export default function CheckoutForm({ clientSecret, shippingId }: { clientSecret: string, shippingId: string }) {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { data: session } = useSession()

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    // const clientSecret = new URLSearchParams(window.location.search).get(
    //   "payment_intent_client_secret"
    // );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Please Enter Your Payment Details.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    }).catch(e => console.log(e))
  }, [clientSecret, stripe]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/cart/checkout?shippingId=${shippingId}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message ?? "");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };
  return (
    <form id="payment-form" onSubmit={handleSubmit} className="mt-4 rounded-lg border border-primary/10 bg-base-100 p-4">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-base-content">Card payment</h3>
        <p className="mt-1 text-xs text-base-content/55">Complete the secure Stripe payment form.</p>
      </div>
      <div className="space-y-4">
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => setEmail(e.value.email)}
        options={{ defaultValues: { email: session?.user?.email ?? "" } }}
      />
      <PaymentElement id="payment-element" options={{
        layout: "tabs", defaultValues: { billingDetails: { email: session?.user?.email ?? "", name: session?.user?.name ?? "" } }
      }} />
      <button disabled={isLoading || !stripe || !elements} id="submit" className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-content transition hover:bg-primary/90 disabled:opacity-60">
        <span id="button-text">
          {isLoading ? <span className="inline-flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-primary-content" />Processing</span> : "Pay now"}
        </span>
      </button>
      </div>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className={`mt-3 rounded-md border p-3 text-sm ${
        message.includes("succeeded") ? "bg-success/10 text-success border border-success/20" : 
        message.includes("processing") ? "bg-info/10 text-info border border-info/20" :
        "bg-error/10 text-error border border-error/20"
      }`}>{message}</div>}
    </form>
  );
}
