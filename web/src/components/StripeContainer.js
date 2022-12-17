import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const PUBLIC_KEY =
  "pk_test_51J5TX7LLiFJrGSKS2YAiMz0QWVv2Ue1ijVZWAmSj3tpeiVl8n7qKdk21bVK9zMRUiLjLVXgMR2yvzQJwVrk9ysj500eu5Vy2Nm";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

function StripeContainer() {
  return <Elements stripe={stripeTestPromise}>
    <PaymentForm/>
  </Elements>
}

export default StripeContainer;
