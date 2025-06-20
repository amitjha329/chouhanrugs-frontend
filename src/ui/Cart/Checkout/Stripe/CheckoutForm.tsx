import React, { FormEvent } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useSession } from "next-auth/react";

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
        return_url: `${process.env.NODE_ENV == "development" ? "http://localhost:3000" : "https://chouhanrugs.com"}/cart/checkout?shippingId=${shippingId}`,
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
    <form id="payment-form" onSubmit={handleSubmit} className="card card-body mt-5 shadow-lg bg-base-100 border border-base-300">
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => setEmail(e.value.email)}
        options={{ defaultValues: { email: session?.user?.email ?? "" } }}
      />
      <PaymentElement id="payment-element" options={{
        layout: "tabs", defaultValues: { billingDetails: { email: session?.user?.email ?? "", name: session?.user?.name ?? "" } }
      }} />
      <button disabled={isLoading || !stripe || !elements} id="submit" className="btn btn-primary text-primary-content">
        <span id="button-text">
          {isLoading ? <div className="loading loading-spinner loading-sm"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message" className={`mt-3 p-3 rounded-lg text-sm ${
        message.includes("succeeded") ? "bg-success/10 text-success border border-success/20" : 
        message.includes("processing") ? "bg-info/10 text-info border border-info/20" :
        "bg-error/10 text-error border border-error/20"
      }`}>{message}</div>}
    </form>
  );
}