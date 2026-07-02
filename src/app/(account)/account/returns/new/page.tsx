'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ImagePlus, Video, X } from 'lucide-react';
import { apiGetOrders, apiGetProduct, apiGetVerifiedGuestOrders } from '@/lib/api/client';
import { ApiOrder } from '@/lib/api/types';
import {
  createReturnRequest,
  getReturnConditions,
  ReturnCondition,
  ReturnEvidence,
  uploadReturnEvidence,
} from '@/lib/api/returns';
import { apiGetPublicBootstrap } from '@/lib/api/public';
import { getOrderStatus } from '@/lib/returns/eligibility';
import { useMyReturns, useReturnAuthToken } from '@/lib/hooks/useReturns';
import { useAuth } from '@/lib/hooks/useAuth';

type Step = 1 | 2 | 3 | 4;

export default function NewReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId') || '';
  const itemIndexParam = searchParams.get('itemIndex');
  const itemIndex = itemIndexParam != null ? Number(itemIndexParam) : NaN;

  const { token, isGuest, isAuthenticated } = useReturnAuthToken();
  const { isLoggedIn } = useAuth();
  const { data: returnsData } = useMyReturns();

  const [step, setStep] = useState<Step>(1);
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [productReturnable, setProductReturnable] = useState<boolean | null>(null);
  const [returnPeriodDays, setReturnPeriodDays] = useState(7);
  const [conditions, setConditions] = useState<ReturnCondition[]>([]);
  const [selectedConditionId, setSelectedConditionId] = useState('');
  const [images, setImages] = useState<ReturnEvidence[]>([]);
  const [videos, setVideos] = useState<ReturnEvidence[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<'image' | 'video' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const lineItem = useMemo(() => {
    if (!order || !Number.isInteger(itemIndex) || itemIndex < 0) return null;
    return order.items?.[itemIndex] ?? null;
  }, [order, itemIndex]);

  const loadContext = useCallback(async () => {
    if (!token || !orderIdParam || !Number.isInteger(itemIndex)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [bootstrapRes, conditionsList] = await Promise.all([
        apiGetPublicBootstrap(),
        getReturnConditions(),
      ]);
      if (bootstrapRes.success && bootstrapRes.data?.platform?.defaultReturnPeriodDays != null) {
        setReturnPeriodDays(bootstrapRes.data.platform.defaultReturnPeriodDays);
      }
      setConditions(conditionsList);

      let orders: ApiOrder[] = [];
      if (isGuest) {
        const res = await apiGetVerifiedGuestOrders(token);
        orders = res.success && Array.isArray(res.data) ? res.data : [];
      } else {
        const res = await apiGetOrders(token);
        orders = res.success && Array.isArray(res.data) ? res.data : [];
      }
      const found = orders.find((o) => o._id === orderIdParam);
      if (!found) {
        setError('Order not found. Open this form from My Orders.');
        return;
      }
      setOrder(found);

      const item = found.items?.[itemIndex];
      if (!item) {
        setError('Invalid order item.');
        return;
      }
      if (item.productId) {
        try {
          const prodRes = await apiGetProduct(item.productId);
          if (prodRes.success && prodRes.data) {
            setProductReturnable(prodRes.data.returnable !== false);
          }
        } catch {
          setProductReturnable(null);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [token, orderIdParam, itemIndex, isGuest]);

  useEffect(() => {
    loadContext();
  }, [loadContext]);

  async function handleUpload(kind: 'image' | 'video', file: File) {
    if (!token) return;
    setUploading(kind);
    setError('');
    try {
      const evidence = await uploadReturnEvidence(file, token);
      if (kind === 'image') setImages((prev) => [...prev, evidence]);
      else setVideos((prev) => [...prev, evidence]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit() {
    if (!token || !order || lineItem == null) return;
    if (!selectedConditionId) {
      setError('Please select a damage condition.');
      setStep(2);
      return;
    }
    if (images.length < 1 || videos.length < 1) {
      setError('Please upload at least one image and one video.');
      setStep(3);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const doc = await createReturnRequest(
        {
          orderId: order._id,
          orderItemIndex: itemIndex,
          returnConditionId: selectedConditionId,
          description: notes.trim() || undefined,
          evidence: [...images, ...videos],
        },
        { isGuest, token }
      );
      router.push(`/account/returns/${doc._id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="mb-4">Sign in or verify your email on My Orders to request a replacement.</p>
        <Link href="/account/orders" className="underline" style={{ color: 'var(--color-amoria-accent)' }}>
          Go to My Orders
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="h-40 bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (!order || !lineItem) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-red-600 mb-4">{error || 'Missing order or item. Start from My Orders.'}</p>
        <Link href="/account/orders" className="underline" style={{ color: 'var(--color-amoria-accent)' }}>
          My Orders
        </Link>
      </div>
    );
  }

  const openReturn = (returnsData?.items ?? []).some(
    (r) => r.orderId === order._id && r.orderItemIndex === itemIndex && r.status !== 'REJECTED' && r.status !== 'CLOSED'
  );
  const delivered = getOrderStatus(order) === 'DELIVERED';
  const notReturnable = productReturnable === false;

  if (!delivered || openReturn || notReturnable) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/account/orders" className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
          ← Back to orders
        </Link>
        <div className="mt-6 p-4 border bg-white" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <p className="font-medium mb-2" style={{ color: 'var(--color-amoria-text)' }}>
            This item is not eligible for a replacement request.
          </p>
          <ul className="text-sm list-disc pl-5 space-y-1" style={{ color: 'var(--color-amoria-text-muted)' }}>
            {!delivered ? <li>Order must be delivered.</li> : null}
            {openReturn ? <li>An open request already exists for this item.</li> : null}
            {notReturnable ? <li>This product is not returnable.</li> : null}
          </ul>
        </div>
      </div>
    );
  }

  if (conditions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <p style={{ color: 'var(--color-amoria-text)' }}>
          Replacement requests are temporarily unavailable. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      <Link href="/account/orders" className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
        ← Back to orders
      </Link>
      <h1
        className="text-2xl font-semibold mt-4 mb-2"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
      >
        Request replacement
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
        Step {step} of 4 · Replacement only (no refunds) · Window: {returnPeriodDays} days after delivery
      </p>

      {error ? (
        <div className="mb-4 p-3 text-sm border border-red-200 bg-red-50 text-red-800">{error}</div>
      ) : null}

      {step === 1 ? (
        <section className="border bg-white p-4 mb-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--color-amoria-primary)' }}>
            Order item
          </h2>
          <div className="flex gap-3">
            {lineItem.image ? (
              <div className="relative w-20 h-20 bg-gray-100 shrink-0">
                <Image src={lineItem.image} alt={lineItem.productName} fill className="object-cover" sizes="80px" />
              </div>
            ) : null}
            <div>
              <p className="font-medium" style={{ color: 'var(--color-amoria-text)' }}>
                {lineItem.productName}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
                Order {order.orderId} · Qty {lineItem.quantity}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-4 w-full py-3 text-sm font-semibold"
            style={{ backgroundColor: 'var(--color-amoria-primary)', color: '#fff' }}
          >
            Continue
          </button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="border bg-white p-4 mb-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--color-amoria-primary)' }}>
            What went wrong?
          </h2>
          <div className="space-y-2">
            {conditions.map((c) => (
              <label
                key={c._id}
                className="flex gap-3 p-3 border cursor-pointer transition-colors"
                style={{
                  borderColor: selectedConditionId === c._id ? 'var(--color-amoria-accent)' : 'var(--color-amoria-border)',
                  backgroundColor: selectedConditionId === c._id ? 'rgba(201,168,76,0.08)' : '#fff',
                }}
              >
                <input
                  type="radio"
                  name="condition"
                  value={c._id}
                  checked={selectedConditionId === c._id}
                  onChange={() => setSelectedConditionId(c._id)}
                  className="mt-1"
                />
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--color-amoria-text)' }}>
                    {c.title}
                  </p>
                  {c.description ? (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-amoria-text-muted)' }}>
                      {c.description}
                    </p>
                  ) : null}
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button type="button" onClick={() => setStep(1)} className="flex-1 py-2 text-sm border" style={{ borderColor: 'var(--color-amoria-border)' }}>
              Back
            </button>
            <button
              type="button"
              disabled={!selectedConditionId}
              onClick={() => setStep(3)}
              className="flex-1 py-2 text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-amoria-primary)', color: '#fff' }}
            >
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="border bg-white p-4 mb-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <h2 className="text-sm font-semibold mb-1 uppercase tracking-wide" style={{ color: 'var(--color-amoria-primary)' }}>
            Upload proof
          </h2>
          <p className="text-xs mb-4" style={{ color: 'var(--color-amoria-text-muted)' }}>
            At least one photo and one video are required.
          </p>

          <div className="mb-6">
            <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--color-amoria-text)' }}>
              <ImagePlus size={14} /> Photos ({images.length})
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((ev, i) => (
                <div key={ev.url} className="relative w-20 h-20">
                  <Image src={ev.url} alt={`Uploaded photo ${i + 1}`} fill className="object-cover border" sizes="80px" />
                  <button
                    type="button"
                    aria-label="Remove image"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-block px-4 py-2 text-xs font-semibold border cursor-pointer" style={{ borderColor: 'var(--color-amoria-border)' }}>
              {uploading === 'image' ? 'Uploading…' : 'Add photo'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading !== null}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload('image', f);
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--color-amoria-text)' }}>
              <Video size={14} /> Videos ({videos.length})
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              {videos.map((ev, i) => (
                <div key={ev.url} className="relative w-32">
                  <video src={ev.url} controls className="w-full aspect-video object-cover border" preload="metadata" />
                  <button
                    type="button"
                    aria-label="Remove video"
                    onClick={() => setVideos((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
            <label className="inline-block px-4 py-2 text-xs font-semibold border cursor-pointer" style={{ borderColor: 'var(--color-amoria-border)' }}>
              {uploading === 'video' ? 'Uploading…' : 'Add video'}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                disabled={uploading !== null}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload('video', f);
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="flex-1 py-2 text-sm border" style={{ borderColor: 'var(--color-amoria-border)' }}>
              Back
            </button>
            <button
              type="button"
              disabled={images.length < 1 || videos.length < 1 || uploading !== null}
              onClick={() => setStep(4)}
              className="flex-1 py-2 text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-amoria-primary)', color: '#fff' }}
            >
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="border bg-white p-4 mb-4" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <h2 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--color-amoria-primary)' }}>
            Review & submit
          </h2>
          <p className="text-sm mb-3" style={{ color: 'var(--color-amoria-text)' }}>
            {lineItem.productName} · {conditions.find((c) => c._id === selectedConditionId)?.title}
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--color-amoria-text-muted)' }}>
            {images.length} photo(s), {videos.length} video(s)
          </p>
          <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Additional notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={4000}
            rows={4}
            className="w-full border px-3 py-2 text-sm mb-4"
            style={{ borderColor: 'var(--color-amoria-border)' }}
            placeholder="Any extra details for our team…"
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(3)} className="flex-1 py-2 text-sm border" style={{ borderColor: 'var(--color-amoria-border)' }}>
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex-1 py-2 text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-amoria-accent)', color: '#1A0A2E' }}
            >
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
