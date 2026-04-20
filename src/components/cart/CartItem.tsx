'use client';

import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';
import { useCart } from '@/lib/hooks/useCart';
import { formatCurrency } from '@/lib/utils/formatCurrency';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();
  const price = item.variant.salePrice ?? item.variant.price;
  const lineTotal = price * item.quantity;
  const imageUrl =
    item.product.images.find((i) => i.isPrimary)?.url ?? item.product.images[0]?.url;

  return (
    <div
      className="flex gap-4 px-6 py-5 border-b"
      style={{ borderColor: '#F0EDE8' }}
    >
      {/* Product image */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ width: '72px', aspectRatio: '3/4', backgroundColor: '#F5F2EE' }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={item.product.name}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className="text-[9px] uppercase tracking-[0.18em] mb-0.5"
              style={{ color: '#A89880' }}
            >
              {item.product.brand}
            </p>
            <p
              className="text-sm font-normal leading-tight truncate"
              style={{ color: '#1C1C1C' }}
            >
              {item.product.name}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: '#B8B0A5' }}>
              {item.variant.concentration}
              {item.variant.sizeMl > 0 ? ` · ${item.variant.sizeMl}ml` : ''}
            </p>
          </div>

          {/* Remove button */}
          <button
            onClick={() => removeItem(item.product.id, item.variant.id)}
            className="p-1 flex-shrink-0 hover:opacity-50 transition-opacity"
            aria-label="Remove item"
          >
            <X size={14} style={{ color: '#B8B0A5' }} />
          </button>
        </div>

        {/* Qty + price row */}
        <div className="flex items-center justify-between mt-auto pt-3">
          {/* Minimal quantity stepper */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-6 h-6 flex items-center justify-center transition-opacity disabled:opacity-25 hover:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus size={11} />
            </button>
            <span
              className="text-sm w-5 text-center tabular-nums"
              style={{ color: '#1C1C1C' }}
            >
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
              disabled={item.quantity >= item.variant.stock}
              className="w-6 h-6 flex items-center justify-center transition-opacity disabled:opacity-25 hover:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus size={11} />
            </button>
          </div>

          <span
            className="text-sm font-medium tabular-nums"
            style={{ color: '#1C1C1C' }}
          >
            {formatCurrency(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
