'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { MapPin, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Address } from '@/types/user';
import {
  useCreateUserAddress,
  useDeleteUserAddress,
  useUpdateUserAddress,
  useUserAddresses,
} from '@/lib/hooks/useApiAddresses';
import { normalizeCheckoutMobile } from '@/lib/utils/checkoutPayload';
import { useAuth } from '@/lib/hooks/useAuth';

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(9, 'Valid phone number required'),
  street: z.string().min(5, 'Street address is required'),
  area: z.string().min(2, 'Area / district is required'),
  emirate: z.string().min(1, 'Please select an emirate'),
  postcode: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

const emptyForm: AddressFormData = {
  fullName: '',
  phone: '',
  street: '',
  area: '',
  emirate: '',
  postcode: '',
  isDefault: false,
};

function toFormValues(address: Address): AddressFormData {
  return {
    fullName: address.fullName,
    phone: address.phone,
    street: address.street,
    area: address.area,
    emirate: address.emirate,
    postcode: address.postcode || '',
    isDefault: address.isDefault,
  };
}

export function ProfileAddressSection() {
  const { user } = useAuth();
  const { data: addresses = [], isLoading } = useUserAddresses();
  const createAddress = useCreateUserAddress();
  const updateAddress = useUpdateUserAddress();
  const deleteAddress = useDeleteUserAddress();

  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyForm,
  });

  function openAdd() {
    setEditingId(null);
    form.reset({
      ...emptyForm,
      fullName: user ? `${user.firstName} ${user.lastName}`.trim() : '',
      phone: user?.phone || '',
      isDefault: addresses.length === 0,
    });
    setMode('add');
  }

  function openEdit(address: Address) {
    setEditingId(address.id);
    form.reset(toFormValues(address));
    setMode('edit');
  }

  function closeForm() {
    setMode('list');
    setEditingId(null);
    form.reset(emptyForm);
  }

  async function onSubmit(data: AddressFormData) {
    const payload = {
      fullName: data.fullName.trim(),
      phone: normalizeCheckoutMobile(data.phone),
      street: data.street.trim(),
      area: data.area.trim(),
      emirate: data.emirate,
      postcode: data.postcode?.trim() || '',
      isDefault: data.isDefault ?? false,
    };

    try {
      if (mode === 'edit' && editingId) {
        await updateAddress.mutateAsync({ id: editingId, payload });
        toast.success('Address updated');
      } else {
        await createAddress.mutateAsync(payload);
        toast.success('Address added');
      }
      closeForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save address');
    }
  }

  async function handleDelete(address: Address) {
    if (!window.confirm(`Delete address for ${address.fullName}?`)) return;
    try {
      await deleteAddress.mutateAsync(address.id);
      toast.success('Address deleted');
      if (editingId === address.id) closeForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not delete address');
    }
  }

  const saving = createAddress.isPending || updateAddress.isPending;

  return (
    <section className="border p-6 mb-6 bg-white" style={{ borderColor: 'var(--color-amoria-border)' }}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="font-semibold flex items-center gap-2" style={{ color: 'var(--color-amoria-primary)' }}>
          <MapPin size={18} />
          Saved Addresses
        </h2>
        {mode === 'list' && (
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: 'var(--color-amoria-accent)' }}
          >
            <Plus size={16} />
            Add address
          </button>
        )}
      </div>

      {mode !== 'list' && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium" style={{ color: 'var(--color-amoria-text)' }}>
              {mode === 'edit' ? 'Edit address' : 'New address'}
            </p>
            <button type="button" onClick={closeForm} className="p-1 hover:opacity-70" aria-label="Close">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" error={form.formState.errors.fullName?.message}>
              <input {...form.register('fullName')} className={inputClass(!!form.formState.errors.fullName)} style={inputStyle(!!form.formState.errors.fullName)} />
            </Field>
            <Field label="Phone" error={form.formState.errors.phone?.message}>
              <input {...form.register('phone')} type="tel" className={inputClass(!!form.formState.errors.phone)} style={inputStyle(!!form.formState.errors.phone)} />
            </Field>
          </div>

          <Field label="Street & building" error={form.formState.errors.street?.message}>
            <input {...form.register('street')} className={inputClass(!!form.formState.errors.street)} style={inputStyle(!!form.formState.errors.street)} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Area / district" error={form.formState.errors.area?.message}>
              <input {...form.register('area')} className={inputClass(!!form.formState.errors.area)} style={inputStyle(!!form.formState.errors.area)} />
            </Field>
            <Field label="Emirate" error={form.formState.errors.emirate?.message}>
              <select {...form.register('emirate')} className={inputClass(!!form.formState.errors.emirate)} style={inputStyle(!!form.formState.errors.emirate)}>
                <option value="">Select emirate</option>
                {EMIRATES.map((emirate) => (
                  <option key={emirate} value={emirate}>
                    {emirate}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Postcode (optional)">
            <input {...form.register('postcode')} className={inputClass(false)} style={inputStyle(false)} />
          </Field>

          <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-amoria-text)' }}>
            <input type="checkbox" {...form.register('isDefault')} className="accent-[#1A0A2E]" />
            Set as default address
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 text-sm font-semibold disabled:opacity-70 text-white"
              style={{ backgroundColor: 'var(--color-amoria-primary)' }}
            >
              {saving ? 'Saving...' : mode === 'edit' ? 'Save address' : 'Add address'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="px-6 py-2.5 text-sm font-semibold border"
              style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === 'list' && isLoading && (
        <p className="text-sm text-stone-500">Loading addresses...</p>
      )}

      {mode === 'list' && !isLoading && addresses.length === 0 && (
        <div className="text-center py-8 border border-dashed" style={{ borderColor: 'var(--color-amoria-border)' }}>
          <p className="text-sm text-stone-500 mb-3">No saved addresses yet.</p>
          <button
            type="button"
            onClick={openAdd}
            className="px-5 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: 'var(--color-amoria-primary)' }}
          >
            Add your first address
          </button>
        </div>
      )}

      {mode === 'list' && !isLoading && addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
              style={{ borderColor: 'var(--color-amoria-border)' }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-amoria-text)' }}>
                    {address.fullName}
                  </p>
                  {address.isDefault && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5"
                      style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}
                    >
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                  {address.street}, {address.area}, {address.emirate}
                  {address.postcode ? ` · ${address.postcode}` : ''}
                </p>
                <p className="text-xs mt-1 text-stone-500">{address.phone}</p>
              </div>

              <div className="flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(address)}
                  className="inline-flex items-center gap-1 text-xs font-semibold underline"
                  style={{ color: 'var(--color-amoria-primary)' }}
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address)}
                  disabled={deleteAddress.isPending}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 disabled:opacity-60"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider block mb-1.5 text-stone-500">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return 'w-full border px-3 py-2.5 text-sm outline-none bg-white';
}

function inputStyle(hasError: boolean): CSSProperties {
  return { borderColor: hasError ? '#ef4444' : 'var(--color-amoria-border)' };
}
