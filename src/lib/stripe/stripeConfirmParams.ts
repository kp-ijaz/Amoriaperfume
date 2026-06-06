/** Billing country passed when Payment Element hides the country field. */
export const STRIPE_BILLING_COUNTRY = 'AE';

type StripeBillingContact = {
  name?: string;
  email?: string;
  phone?: string;
};

/** confirmParams for stripe.confirmPayment when country is collected outside the Element. */
export function buildStripeConfirmParams(receiptEmail: string, contact?: StripeBillingContact) {
  return {
    receipt_email: receiptEmail,
    payment_method_data: {
      billing_details: {
        name: contact?.name,
        email: contact?.email || receiptEmail,
        phone: contact?.phone,
        address: {
          country: STRIPE_BILLING_COUNTRY,
        },
      },
    },
  };
}
