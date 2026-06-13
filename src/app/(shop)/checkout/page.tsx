'use client';

import { useMemo, useState, Suspense, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { User, UserCheck, LogIn, ShoppingBag, Shield, Store, Truck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { useUserAddresses } from '@/lib/hooks/useApiAddresses';
import { usePublicBootstrap } from '@/lib/hooks/usePublicCms';
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper';
import { AddressStep, FulfillmentMethod, PickupSlot, PickupStoreOption } from '@/components/checkout/AddressStep';
import { PaymentStep, StripeCheckoutState, CheckoutPaymentMethod } from '@/components/checkout/PaymentStep';
import { ReviewStep } from '@/components/checkout/ReviewStep';
import { amoriaStripeElementsOptions } from '@/lib/stripe/amoriaStripeAppearance';
import { OrderStripeIntentPayload, apiGetTamaraConfig } from '@/lib/api/payments';
import { Address } from '@/types/user';
import { cartItemReactKey, mapCartItemsToOrderPayload } from '@/lib/cart/mapCartItemsToOrder';
import { buildShippingAddress, resolveCheckoutPhone } from '@/lib/utils/checkoutPayload';

type CheckoutFlow = 'gate' | 1 | 2 | 3;

function CheckoutPageInner() {
  const { isLoggedIn, isGuest, user, guestInfo, continueAsGuest } = useAuth();
  const { items, coupon, giftCard } = useCart();
  const { data: savedAddresses = [] } = useUserAddresses();
  const { data: bootstrap } = usePublicBootstrap();
  const platform = bootstrap?.platform;
  const pickupStores = bootstrap?.pickupStores ?? [];

  const tamaraConfigQ = useQuery({
    queryKey: ['tamara-config'],
    queryFn: async () => {
      const res = await apiGetTamaraConfig();
      if (!res.success || !res.data) return { enabled: false, configured: false };
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  function getInitialFlow(): CheckoutFlow {
    if (isLoggedIn || isGuest) return 1;
    return 'gate';
  }

  const [flow, setFlow] = useState<CheckoutFlow>(getInitialFlow);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>('delivery');
  const [pickupSlot, setPickupSlot] = useState<PickupSlot | undefined>(undefined);
  const [selectedPickupStore, setSelectedPickupStore] = useState<PickupStoreOption | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod | null>(null);
  const [stripeSession, setStripeSession] = useState<StripeCheckoutState | null>(null);
  const [paymentAttempt, setPaymentAttempt] = useState(0);

  const effectiveIsGuest = isGuest || isGuestMode;

  const resetStripeCheckout = useCallback(() => {
    setStripeSession(null);
    setPaymentMethod(null);
    setPaymentAttempt((n) => n + 1);
  }, []);

  const cartFingerprint = useMemo(
    () =>
      items
        .map(
          (item) =>
            `${cartItemReactKey(item)}:${item.quantity}:${coupon?.code ?? ''}:${giftCard?.code ?? ''}`
        )
        .join('|'),
    [items, coupon?.code, giftCard?.code]
  );

  useEffect(() => {
    resetStripeCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartFingerprint]);

  const stripePromise = useMemo(
    () => (stripeSession ? loadStripe(stripeSession.publishableKey) : null),
    [stripeSession]
  );

  const handleStripeSession = useCallback((session: StripeCheckoutState | null) => {
    setStripeSession(session);
  }, []);

  const intentPayload = useMemo((): OrderStripeIntentPayload | null => {
    if (flow !== 2 && flow !== 3) return null;
    if (items.length === 0) return null;

    const customerName = user
      ? `${user.firstName} ${user.lastName}`.trim()
      : guestInfo?.name ?? address?.fullName ?? 'Guest';
    const customerEmail = user?.email ?? guestInfo?.email ?? address?.email ?? '';
    const savedPhone =
      savedAddresses.find((a) => a.isDefault)?.phone ?? savedAddresses[0]?.phone ?? '';
    const customerPhone = resolveCheckoutPhone(
      address?.phone,
      user?.phone,
      guestInfo?.phone,
      savedPhone
    );
    const isPickup = fulfillment === 'pickup';
    if (!customerEmail) return null;
    if (!isPickup && customerPhone.length < 10) return null;
    if (isPickup && !selectedPickupStore) return null;

    const shippingAddr = address
      ? buildShippingAddress(address)
      : {
          fullAddress: 'Pickup',
          city: 'Dubai',
          state: 'Dubai',
          pincode: '',
          country: 'UAE',
        };

    return {
      kind: 'order',
      fulfillmentType: fulfillment === 'pickup' ? 'PICKUP' : 'DELIVERY',
      customerDetails: {
        name: customerName,
        email: customerEmail,
        mobile: customerPhone || '',
      },
      shippingAddress: fulfillment === 'delivery' ? shippingAddr : undefined,
      pickupDetails:
        fulfillment === 'pickup' && selectedPickupStore
          ? {
              storeName: selectedPickupStore.name,
              storeAddress: selectedPickupStore.address,
              pickupSlot: pickupSlot ? `${pickupSlot.date} ${pickupSlot.time}` : undefined,
            }
          : undefined,
      couponCode: coupon?.code,
      giftCardCode: giftCard?.code,
      items: mapCartItemsToOrderPayload(items),
    };
  }, [flow, items, user, guestInfo, address, fulfillment, pickupSlot, selectedPickupStore, coupon, giftCard, savedAddresses]);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-5 text-center">
        <ShoppingBag size={52} style={{ color: '#E8E3DC' }} className="mb-5" />
        <h2 className="text-2xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
          Your cart is empty
        </h2>
        <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>
          Add items before checking out.
        </p>
        <Link
          href="/products"
          className="px-8 py-3 text-sm font-bold tracking-wider uppercase"
          style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  function handleGuestContinue() {
    setIsGuestMode(true);
    setFlow(1);
  }

  function handleAddressNext(
    addr: Address | null,
    method: FulfillmentMethod,
    slot?: PickupSlot,
    guestContact?: { name: string; email: string },
    pickupStore?: PickupStoreOption
  ) {
    setAddress(addr);
    setFulfillment(method);
    setPickupSlot(slot);
    setSelectedPickupStore(method === 'pickup' ? pickupStore ?? null : null);
    if (guestContact && effectiveIsGuest) {
      continueAsGuest({ name: guestContact.name, email: guestContact.email, phone: addr?.phone ?? '' });
    }
    resetStripeCheckout();
    setFlow(2);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Trust bar */}
      <div style={{ backgroundColor: '#1A0A2E' }}>
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
          {[
            { icon: <Shield size={11} />, label: 'SSL Secured Checkout' },
            { icon: <Truck size={11} />, label: 'Free Delivery over AED 200' },
            { icon: <Store size={11} />, label: 'Store Pickup Available' },
          ].map(({ icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold" style={{ color: '#C9A84C' }}>
              {icon} {label}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10">
        {/* Page header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-10 h-px" style={{ backgroundColor: '#C9A84C' }} />
            <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#A89880' }}>
              Secure Checkout
            </span>
            <span className="w-10 h-px" style={{ backgroundColor: '#C9A84C' }} />
          </div>
          <h1 className="text-4xl font-light" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
            {flow === 'gate' ? 'Complete Your Order' : 'Checkout'}
          </h1>
          {(isLoggedIn || isGuest) && guestInfo && (
            <p className="text-sm mt-2" style={{ color: '#A89880' }}>
              Checking out as{' '}
              <strong style={{ color: '#1A0A2E' }}>
                {isLoggedIn ? `${user!.firstName} ${user!.lastName}` : guestInfo.name}
              </strong>
            </p>
          )}
          {effectiveIsGuest && !guestInfo && (
            <p className="text-sm mt-2" style={{ color: '#A89880' }}>Guest Checkout</p>
          )}
        </div>

        <AnimatePresence mode="wait">

          {/* ── AUTH GATE ── */}
          {flow === 'gate' && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <div className="space-y-3">

                {/* Sign In — most prominent */}
                <Link
                  href="/login?redirect=/checkout"
                  className="flex items-center gap-4 p-5 transition-all duration-200 group"
                  style={{ backgroundColor: '#1A0A2E' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2D1554')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1A0A2E')}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <LogIn size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-white">Sign In to Your Account</p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Saved addresses · Order history · Loyalty rewards
                    </p>
                  </div>
                  <ChevronRight size={16} style={{ color: '#C9A84C' }} />
                </Link>

                {/* Create Account */}
                <Link
                  href="/register?redirect=/checkout"
                  className="flex items-center gap-4 p-5 border-2 transition-all duration-200 group hover:bg-amber-50/30"
                  style={{ borderColor: '#C9A84C', backgroundColor: 'white' }}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(201,168,76,0.12)' }}>
                    <UserCheck size={20} style={{ color: '#C9A84C' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm" style={{ color: '#1A0A2E' }}>Create an Account</p>
                      <span
                        className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5"
                        style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
                      >
                        10% OFF
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#A89880' }}>
                      First order discount · Faster checkout next time
                    </p>
                  </div>
                  <ChevronRight size={16} className="opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: '#1A0A2E' }} />
                </Link>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px" style={{ backgroundColor: '#E8E3DC' }} />
                  <span className="text-xs" style={{ color: '#A89880' }}>or</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#E8E3DC' }} />
                </div>

                {/* Continue as Guest */}
                <button
                  onClick={handleGuestContinue}
                  className="w-full flex items-center gap-4 p-4 border-2 transition-all duration-200 group text-left hover:border-[#6B6B6B]"
                  style={{ borderColor: '#E8E3DC', backgroundColor: '#FAFAF9' }}
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F0EDE8' }}>
                    <User size={20} style={{ color: '#6B6B6B' }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm" style={{ color: '#1A0A2E' }}>Continue as Guest</p>
                    <p className="text-xs mt-0.5" style={{ color: '#A89880' }}>
                      No account needed · Checkout in minutes
                    </p>
                  </div>
                  <ChevronRight size={15} className="opacity-20 group-hover:opacity-50 transition-opacity" style={{ color: '#1A0A2E' }} />
                </button>
              </div>

              {/* Store pickup note */}
              <div
                className="mt-6 p-4 flex items-start gap-3 text-sm"
                style={{ backgroundColor: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)' }}
              >
                <Store size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#C9A84C' }} />
                <p style={{ color: '#6B4A1E' }}>
                  Prefer to collect in-store?{' '}
                  <strong>Choose Store Pickup</strong> during checkout — ready in 2 hours at our Dubai Mall location.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── STEPS 1–3 ── */}
          {(flow === 1 || flow === 2 || flow === 3) && (
            <motion.div
              key="steps"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              {/* Fulfillment badge (steps 2-3) */}
              {flow !== 1 && (
                <div
                  className="flex items-center gap-2 px-4 py-2.5 mb-5 text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
                >
                  {fulfillment === 'pickup'
                    ? (
                      <>
                        <Store size={13} style={{ color: '#C9A84C' }} />
                        {' '}
                        Store Pickup
                        {selectedPickupStore ? ` — ${selectedPickupStore.name}` : ''}
                      </>
                    )
                    : <><Truck size={13} style={{ color: '#C9A84C' }} /> Home Delivery</>}
                </div>
              )}

              <CheckoutStepper currentStep={flow as 1 | 2 | 3} />

              {flow === 1 && (
                <AddressStep
                  isGuest={effectiveIsGuest}
                  pickupStores={pickupStores}
                  onNext={handleAddressNext}
                />
              )}
              {flow === 2 && (
                <PaymentStep
                  key={paymentAttempt}
                  intentPayload={intentPayload}
                  isPickup={fulfillment === 'pickup'}
                  stripeSession={stripeSession}
                  onStripeSession={handleStripeSession}
                  onlineEnabled={platform?.isOnlinePaymentEnabled !== false}
                  codEnabled={platform?.isCodEnabled !== false}
                  tamaraEnabled={!!tamaraConfigQ.data?.enabled}
                  tamaraConfigured={!!tamaraConfigQ.data?.configured}
                  onNext={(method) => {
                    setPaymentMethod(method);
                    if (method !== 'stripe') setStripeSession(null);
                    setFlow(3);
                  }}
                  onBack={() => {
                    resetStripeCheckout();
                    setFlow(1);
                  }}
                />
              )}
              {flow === 3 && paymentMethod === 'stripe' && stripeSession && stripePromise ? (
                <Elements
                  key={stripeSession.clientSecret}
                  stripe={stripePromise}
                  options={amoriaStripeElementsOptions(stripeSession.clientSecret)}
                >
                  <ReviewStep
                    key={stripeSession.paymentIntentId}
                    address={address}
                    paymentMethod={paymentMethod}
                    stripePaymentIntentId={stripeSession.paymentIntentId}
                    fulfillmentMethod={fulfillment}
                    pickupSlot={pickupSlot}
                    selectedPickupStore={selectedPickupStore}
                    onBack={() => {
                      resetStripeCheckout();
                      setFlow(2);
                    }}
                    guestInfo={guestInfo}
                  />
                </Elements>
              ) : flow === 3 ? (
                <ReviewStep
                  address={address}
                  paymentMethod={paymentMethod}
                  fulfillmentMethod={fulfillment}
                  pickupSlot={pickupSlot}
                  selectedPickupStore={selectedPickupStore}
                  onBack={() => setFlow(2)}
                  guestInfo={guestInfo}
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutPageInner />
    </Suspense>
  );
}
