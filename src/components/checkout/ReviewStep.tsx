'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Store, Calendar, Clock } from 'lucide-react';
import { useCart } from '@/lib/hooks/useCart';
import { useCreateOrder } from '@/lib/hooks/useApiOrders';
import { useShippingQuote } from '@/lib/hooks/useApiShipping';
import { useAuth } from '@/lib/hooks/useAuth';
import { Address } from '@/types/user';
import { CartSummary } from '@/components/cart/CartSummary';
import { FulfillmentMethod, PickupSlot } from '@/components/checkout/AddressStep';
import { GuestInfo } from '@/lib/store/authSlice';
import Image from 'next/image';
import { toast } from 'sonner';

interface ReviewStepProps {
  address:           Address | null;
  paymentMethod:     'card' | 'applepay' | 'cod' | null;
  fulfillmentMethod: FulfillmentMethod;
  pickupSlot?:       PickupSlot;
  onBack:            () => void;
  guestInfo?:        GuestInfo | null;
}

const methodLabels = { card: 'Credit/Debit Card', applepay: 'Apple Pay', cod: 'Cash on Delivery' };

export function ReviewStep({ address, paymentMethod, fulfillmentMethod, pickupSlot, onBack, guestInfo }: ReviewStepProps) {
  const router = useRouter();
  const baseCart = useCart();
  const shippingCountry = fulfillmentMethod === 'delivery' ? 'UAE' : 'UAE';
  const shippingQuote = useShippingQuote(shippingCountry, baseCart.afterCoupon);
  const quotedShippingCharge = shippingQuote.data?.shippingCharge ?? 0;
  const { items, clearCart, coupon } = useCart({
    shippingChargeOverride: quotedShippingCharge,
  });
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlaceOrder() {
    setLoading(true);
    setError(null);

    // Build customer details
    const customerName = user
      ? `${user.firstName} ${user.lastName}`.trim()
      : guestInfo?.name ?? 'Guest';
    const customerEmail = user?.email ?? guestInfo?.email ?? '';
    const customerPhone = user?.phone ?? guestInfo?.phone ?? address?.phone ?? '';

    // Build shipping address
    const shippingAddr = {
      fullAddress: address ? `${address.street}, ${address.area}` : 'Pickup',
      city: address?.emirate ?? 'Dubai',
      state: address?.emirate ?? 'Dubai',
      pincode: address?.postcode ?? '00000',
      country: 'UAE',
    };

    // Build line items (prices in AED)
    const orderItems = items.map((item) => ({
      productId: item.product.id,
      variantId: item.variant.variantId ?? item.variant.id,
      sizeVariantId: item.variant.sizeVariantId ?? item.variant.id,
      quantity: item.quantity,
    }));

    try {
      const res = await createOrder.mutateAsync({
        fulfillmentType: fulfillmentMethod === 'pickup' ? 'PICKUP' : 'DELIVERY',
        couponCode: coupon?.code || undefined,
        customerDetails: {
          name: customerName,
          email: customerEmail,
          mobile: customerPhone,
        },
        shippingAddress: fulfillmentMethod === 'delivery' ? shippingAddr : undefined,
        pickupDetails:
          fulfillmentMethod === 'pickup'
            ? {
                storeName: 'Dubai Mall',
                storeAddress: 'Dubai Mall, Ground Floor',
                pickupSlot: pickupSlot ? `${pickupSlot.date} ${pickupSlot.time}` : undefined,
              }
            : undefined,
        items: orderItems,
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'ONLINE',
        pricing: {},
      });

      if (!res.success) {
        throw new Error(res.message ?? 'Failed to place order');
      }

      const orderId = res.data?.orderId ?? '';
      clearCart();

      const params = new URLSearchParams();
      params.set('orderId', orderId);
      if (fulfillmentMethod === 'pickup') {
        params.set('type', 'pickup');
        if (pickupSlot) {
          params.set('date', pickupSlot.date);
          params.set('time', pickupSlot.time);
        }
      }
      router.push(`/order-confirmation?${params.toString()}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong placing your order.';
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  }

  const sectionStyle = { border: '1px solid #E8E3DC', backgroundColor: 'white' };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
        Review Your Order
      </h2>

      {/* Fulfillment */}
      <div className="mb-4 p-4" style={sectionStyle}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#A89880' }}>Fulfillment</h3>
        <div className="flex items-center gap-2 text-sm font-semibold mb-2" style={{ color: '#1A0A2E' }}>
          {fulfillmentMethod === 'pickup'
            ? <><Store size={15} style={{ color: '#C9A84C' }} /> Store Pickup — Dubai Mall</>
            : <><Truck size={15} style={{ color: '#C9A84C' }} /> Home Delivery</>}
        </div>
        {fulfillmentMethod === 'pickup' && pickupSlot && (
          <div
            className="mt-2 flex flex-wrap gap-3 px-3 py-2.5 text-xs"
            style={{ backgroundColor: 'rgba(201,168,76,0.07)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '3px' }}
          >
            <span className="flex items-center gap-1.5 font-semibold" style={{ color: '#6B4A1E' }}>
              <Calendar size={12} style={{ color: '#C9A84C' }} />{pickupSlot.date}
            </span>
            <span className="flex items-center gap-1.5 font-semibold" style={{ color: '#6B4A1E' }}>
              <Clock size={12} style={{ color: '#C9A84C' }} />{pickupSlot.time}
            </span>
            <span style={{ color: '#A89880' }}>· Dubai Mall, Ground Floor</span>
          </div>
        )}
      </div>

      {/* Address */}
      {fulfillmentMethod === 'delivery' && address && (
        <div className="mb-4 p-4" style={sectionStyle}>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#A89880' }}>Deliver To</h3>
          <p className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>{address.fullName}</p>
          <p className="text-sm" style={{ color: '#6B6B6B' }}>{address.street}, {address.area}, {address.emirate}</p>
          <p className="text-xs mt-0.5" style={{ color: '#A89880' }}>{address.phone}</p>
        </div>
      )}

      {/* Payment */}
      {paymentMethod && (
        <div className="mb-4 p-4" style={sectionStyle}>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#A89880' }}>Payment</h3>
          <p className="text-sm font-semibold" style={{ color: '#1C1C1C' }}>{methodLabels[paymentMethod]}</p>
          {paymentMethod === 'cod' && (
            <p className="text-xs mt-0.5" style={{ color: '#A89880' }}>+AED 10.00 Cash on Delivery fee</p>
          )}
        </div>
      )}

      {/* Items */}
      <div className="mb-5 p-4" style={sectionStyle}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#A89880' }}>
          Order Items ({items.reduce((a, i) => a + i.quantity, 0)})
        </h3>
        <div className="space-y-3">
          {items.map((item) => {
            const imageUrl = item.product.images.find((i) => i.isPrimary)?.url ?? item.product.images[0]?.url;
            return (
              <div key={`${item.product.id}-${item.variant.id}`} className="flex gap-3 items-center">
                <div className="relative w-12 h-12 flex-shrink-0" style={{ backgroundColor: '#F5F2EE' }}>
                  {imageUrl && <Image src={imageUrl} alt={item.product.name} fill className="object-cover" unoptimized />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#1C1C1C' }}>{item.product.name}</p>
                  <p className="text-xs" style={{ color: '#A89880' }}>
                    Qty: {item.quantity} · {item.variant.concentration} · {item.variant.sizeMl}ml
                  </p>
                </div>
                <p className="text-sm font-semibold flex-shrink-0" style={{ color: '#C9A84C' }}>
                  AED {((item.variant.salePrice ?? item.variant.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <CartSummary
        showCheckoutButton={false}
        paymentMethod={paymentMethod ?? undefined}
        country={shippingCountry}
        shippingChargeOverride={fulfillmentMethod === 'pickup' ? 0 : quotedShippingCharge}
      />

      {error && (
        <div className="mt-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-3 text-sm border font-medium transition-colors hover:bg-gray-50"
          style={{ borderColor: '#E8E3DC', color: '#1C1C1C' }}
        >
          Back
        </button>
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="flex-1 py-3.5 text-sm font-bold tracking-wider uppercase transition-all disabled:opacity-70"
          style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
        >
          {loading ? 'Placing Order…' : 'Place Order →'}
        </button>
      </div>
    </div>
  );
}
