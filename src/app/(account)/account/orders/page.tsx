'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useOrders, useSendGuestOrdersOtp, useVerifiedGuestOrders, useVerifyGuestOrdersOtp } from '@/lib/hooks/useApiOrders';
import { ApiOrder } from '@/lib/api/types';
import { apiGetProduct, getGuestOrdersToken, setGuestOrdersToken } from '@/lib/api/client';
import { apiGetPublicBootstrap } from '@/lib/api/public';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthToken } from '@/lib/hooks/useAuthToken';
import { useMyReturns } from '@/lib/hooks/useReturns';
import { canShowReplacementCta, getOpenReturnForItem, getOrderStatus } from '@/lib/returns/eligibility';
import { ReturnRequest } from '@/lib/api/returns';
import { OrderTrackingPanel } from '@/components/account/OrderTrackingPanel';
import { OrderPaymentRetryPanel } from '@/components/account/OrderPaymentRetryPanel';
import { OrderInvoiceDownloadButton } from '@/components/account/OrderInvoiceDownloadButton';

const statusColors: Record<string, string> = {
  PENDING:    '#f59e0b',
  CONFIRMED:  '#3b82f6',
  PROCESSING: '#f97316',
  SHIPPED:    '#8b5cf6',
  DELIVERED:  '#22c55e',
  CANCELLED:  '#ef4444',
  FAILED:     '#ef4444',
  pending:    '#f59e0b',
  confirmed:  '#3b82f6',
  processing: '#f97316',
  shipped:    '#8b5cf6',
  delivered:  '#22c55e',
  cancelled:  '#ef4444',
};

function formatAed(value: number) {
  return Number(value ?? 0).toFixed(2);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AE', { year: 'numeric', month: 'short', day: 'numeric' });
}

function OrderCard({
  order,
  returns,
  returnPeriodDays,
  authToken,
  guestToken,
  onRefresh,
}: {
  order: ApiOrder;
  returns: ReturnRequest[];
  returnPeriodDays: number;
  authToken?: string | null;
  guestToken?: string | null;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [returnableMap, setReturnableMap] = useState<Record<string, { returnable?: boolean; refundable?: boolean; loading?: boolean }>>({});
  const orderStatus = getOrderStatus(order);
  const isDelivered = orderStatus === 'DELIVERED';
  const paymentFailed = order.payment?.paymentStatus === 'FAILED';
  const status = paymentFailed
    ? 'FAILED'
    : order.status ?? order.orderStatus ?? order.payment?.paymentStatus ?? 'PENDING';
  const statusColor = statusColors[status] ?? '#6b7280';
  const statusLabel = paymentFailed ? 'Payment failed' : String(status).toLowerCase();
  const totalAed = formatAed(order.pricing?.totalAmount ?? 0);

  useEffect(() => {
    if (!expanded || !order.items?.length) return;
    let cancelled = false;
    const keys = order.items.map((_, idx) => `${order._id}-${idx}`);
    setReturnableMap((prev) => {
      const next = { ...prev };
      keys.forEach((key) => {
        next[key] = { ...next[key], loading: true };
      });
      return next;
    });
    (async () => {
      const map: Record<string, { returnable?: boolean; refundable?: boolean; loading?: boolean }> = {};
      await Promise.all(
        order.items.map(async (item, idx) => {
          const key = `${order._id}-${idx}`;
          if (!item.productId) {
            map[key] = { returnable: true, refundable: false, loading: false };
            return;
          }
          try {
            const res = await apiGetProduct(item.productId);
            if (res.success && res.data) {
              map[key] = {
                returnable: res.data.returnable !== false,
                refundable: res.data.refundable === true,
                loading: false,
              };
            } else {
              map[key] = { returnable: true, loading: false };
            }
          } catch {
            map[key] = { returnable: true, loading: false };
          }
        })
      );
      if (!cancelled) setReturnableMap((prev) => ({ ...prev, ...map }));
    })();
    return () => {
      cancelled = true;
    };
  }, [expanded, order]);

  return (
    <div className="border bg-white" style={{ borderColor: 'var(--color-amoria-border)' }}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Order</p>
            <p className="font-semibold text-sm" style={{ color: 'var(--color-amoria-primary)' }}>{order.orderId}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Date</p>
            <p className="text-sm" style={{ color: 'var(--color-amoria-text)' }}>{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Total</p>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>AED {totalAed}</p>
          </div>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
            style={{ backgroundColor: `${statusColor}20`, color: statusColor }}
          >
            {statusLabel}
          </span>
        </div>
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {expanded && (
        <div className="border-t px-4 pb-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <div className="pt-4 space-y-3 mb-4">
            {order.items?.map((item, i) => {
              const itemKey = `${order._id}-${i}`;
              const productFlags = returnableMap[itemKey];
              const openReturn = getOpenReturnForItem(returns, order._id, i);
              const showReturn = canShowReplacementCta(order, i, {
                returnPeriodDays,
                returns,
                productReturnable: productFlags?.returnable,
                productRefundable: productFlags?.refundable,
              });
              const notEligible =
                isDelivered &&
                !productFlags?.loading &&
                productFlags &&
                productFlags.returnable === false &&
                productFlags.refundable !== true;

              return (
                <div key={i} className="border-b pb-3 last:border-b-0 last:pb-0" style={{ borderColor: 'var(--color-amoria-border)' }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative w-12 h-12 bg-gray-100 shrink-0 overflow-hidden">
                      {item.image && (
                        <Image src={item.image} alt={item.productName} fill className="object-cover" sizes="48px" />
                      )}
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <p className="text-sm font-medium" style={{ color: 'var(--color-amoria-text)' }}>{item.productName}</p>
                      <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
                        {item.brand ? `${item.brand} · ` : ''}Qty: {item.quantity}
                        {item.includedItems?.length
                          ? ` · Includes ${item.includedItems.length} item${item.includedItems.length === 1 ? '' : 's'}`
                          : ''}
                      </p>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-amoria-accent)' }}>
                      AED {formatAed(item.totalPrice)}
                    </p>
                  </div>

                  {isDelivered ? (
                    <div className="mt-2 pl-[3.75rem]">
                      {productFlags?.loading ? (
                        <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>Checking return eligibility…</p>
                      ) : openReturn ? (
                        <Link
                          href={`/account/returns/${openReturn._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold"
                          style={{ backgroundColor: 'var(--color-amoria-accent)', color: '#1A0A2E' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <RotateCcw size={12} /> View return request
                        </Link>
                      ) : showReturn ? (
                        <Link
                          href={`/account/returns/new?orderId=${encodeURIComponent(order._id)}&itemIndex=${i}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold"
                          style={{ backgroundColor: 'var(--color-amoria-accent)', color: '#1A0A2E' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <RotateCcw size={12} /> Return product
                        </Link>
                      ) : notEligible ? (
                        <p className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
                          This product is not eligible for return or replacement.
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {order.shippingAddress && (
            <p className="text-xs mb-4" style={{ color: 'var(--color-amoria-text-muted)' }}>
              Deliver to: {order.shippingAddress.fullAddress}, {order.shippingAddress.city}
            </p>
          )}

          <OrderPaymentRetryPanel
            order={order}
            authToken={authToken || guestToken}
            onSuccess={onRefresh}
          />

          <OrderTrackingPanel order={order} />

          <div className="flex gap-2 flex-wrap">
            {isDelivered ? (
              <OrderInvoiceDownloadButton
                orderId={order._id}
                invoiceNumber={order.invoiceNumber}
                authToken={authToken || guestToken}
              />
            ) : null}
            <Link
              href="/account/returns"
              className="px-4 py-2 text-xs font-medium border transition-colors hover:bg-[#1A0A2E] hover:text-[#C9A84C] hover:border-[#1A0A2E]"
              style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}
            >
              My returns
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { isLoggedIn } = useAuth();
  const authToken = useAuthToken();
  const [guestToken, setGuestToken] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [returnPeriodDays, setReturnPeriodDays] = useState(7);
  const sendOtp = useSendGuestOrdersOtp();
  const verifyOtp = useVerifyGuestOrdersOtp();
  const userOrders = useOrders();
  const guestOrders = useVerifiedGuestOrders(guestToken);
  const { data: returnsData } = useMyReturns(guestToken);

  useEffect(() => {
    if (!isLoggedIn) {
      setGuestToken(getGuestOrdersToken());
    }
  }, [isLoggedIn]);

  useEffect(() => {
    apiGetPublicBootstrap().then((res) => {
      if (res.success && res.data?.platform?.defaultReturnPeriodDays != null) {
        setReturnPeriodDays(res.data.platform.defaultReturnPeriodDays);
      }
    });
  }, []);

  const isLoading = isLoggedIn ? userOrders.isLoading : guestOrders.isLoading;
  const ordersError = isLoggedIn ? userOrders.error : guestOrders.error;
  const orders = isLoggedIn ? (userOrders.data ?? []) : (guestOrders.data ?? []);
  const returns = returnsData?.items ?? [];

  const refreshOrders = () => {
    if (isLoggedIn) userOrders.refetch();
    else guestOrders.refetch();
  };

  async function handleSendOtp() {
    setVerifyError('');
    const email = guestEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setVerifyError('Enter a valid email');
      return;
    }
    const res = await sendOtp.mutateAsync(email);
    if (!res.success) {
      setVerifyError(res.message ?? 'Failed to send OTP');
      return;
    }
    setOtpSent(true);
  }

  async function handleVerifyOtp() {
    setVerifyError('');
    try {
      const res = await verifyOtp.mutateAsync({ email: guestEmail, otp });
      if (!res.success || !res.data?.token) {
        setVerifyError(res.message ?? 'OTP verification failed');
        return;
      }
      setGuestOrdersToken(res.data.token);
      setGuestToken(res.data.token);
    } catch (error) {
      setVerifyError(error instanceof Error ? error.message : 'OTP verification failed');
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        My Orders
      </h1>

      {isLoggedIn && !authToken ? (
        <div className="mb-6 p-4 border border-amber-200 bg-amber-50 text-sm text-amber-900">
          Your session expired. Please{' '}
          <Link href="/login" className="underline font-medium">
            sign in again
          </Link>{' '}
          to view your orders.
        </div>
      ) : null}

      {!isLoggedIn && !guestToken ? (
        <div className="mb-8 border p-4 space-y-3" style={{ borderColor: 'var(--color-amoria-border)', backgroundColor: '#fff' }}>
          <p className="text-sm" style={{ color: 'var(--color-amoria-text)' }}>
            Verify your email to view guest orders.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Enter your checkout email"
              className="flex-1 px-3 py-2 border text-sm"
              style={{ borderColor: 'var(--color-amoria-border)' }}
            />
            <button
              onClick={handleSendOtp}
              disabled={sendOtp.isPending}
              className="px-4 py-2 text-sm font-semibold"
              style={{ backgroundColor: 'var(--color-amoria-primary)', color: '#fff' }}
            >
              Send OTP
            </button>
          </div>
          {otpSent ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="flex-1 px-3 py-2 border text-sm"
                style={{ borderColor: 'var(--color-amoria-border)' }}
              />
              <button
                onClick={handleVerifyOtp}
                disabled={verifyOtp.isPending}
                className="px-4 py-2 text-sm font-semibold"
                style={{ backgroundColor: 'var(--color-amoria-accent)', color: '#1A0A2E' }}
              >
                Verify
              </button>
            </div>
          ) : null}
          {verifyError ? <p className="text-xs text-red-500">{verifyError}</p> : null}
        </div>
      ) : null}

      {ordersError ? (
        <div className="mb-6 p-4 border border-red-200 bg-red-50 text-sm text-red-800">
          {ordersError instanceof Error ? ordersError.message : 'Could not load orders. Try signing in again.'}
        </div>
      ) : null}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 && !ordersError ? (
        <div className="text-center py-16">
          <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--color-amoria-border)' }} />
          <p style={{ color: 'var(--color-amoria-text-muted)' }}>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              returns={returns}
              returnPeriodDays={returnPeriodDays}
              authToken={authToken}
              guestToken={guestToken}
              onRefresh={refreshOrders}
            />
          ))}
        </div>
      )}
    </div>
  );
}
