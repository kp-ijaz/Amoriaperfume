'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Sparkles, X } from 'lucide-react';
import { apiSubmitCustomPerfume } from '@/lib/api/public';
import { usePublicBootstrap } from '@/lib/hooks/usePublicCms';
import { useBrands } from '@/lib/hooks/useApiBrands';
import { usePublicFragranceNotes } from '@/lib/hooks/usePublicFragranceNotes';
import { useLanguage } from '@/lib/context/LanguageContext';

const inputClass =
  'w-full border px-3 py-2.5 text-sm outline-none focus:border-[var(--color-amoria-accent)]';
const labelClass = 'text-xs uppercase tracking-wider block mb-1.5';

function ChipSelect({
  label,
  hint,
  selected,
  onToggle,
  options,
  search,
  onSearchChange,
  allowCustom,
  customPlaceholder,
  onAddCustom,
}: {
  label: string;
  hint?: string;
  selected: string[];
  onToggle: (value: string) => void;
  options: string[];
  search: string;
  onSearchChange: (value: string) => void;
  allowCustom?: boolean;
  customPlaceholder?: string;
  onAddCustom?: (value: string) => void;
}) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, search]);

  function handleCustomKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const value = search.trim();
    if (!value || !onAddCustom) return;
    onAddCustom(value);
    onSearchChange('');
  }

  return (
    <div>
      <label className={labelClass} style={{ color: 'var(--color-amoria-text-muted)' }}>
        {label}
      </label>
      {hint ? (
        <p className="text-xs mb-2" style={{ color: 'var(--color-amoria-text-muted)' }}>
          {hint}
        </p>
      ) : null}
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full"
              style={{ backgroundColor: 'rgba(26,10,46,0.08)', color: 'var(--color-amoria-primary)' }}
            >
              {item}
              <X size={12} />
            </button>
          ))}
        </div>
      ) : null}
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={allowCustom ? handleCustomKeyDown : undefined}
        placeholder={allowCustom ? customPlaceholder : 'Search...'}
        className={inputClass}
        style={{ borderColor: 'var(--color-amoria-border)' }}
      />
      {filtered.length > 0 ? (
        <div
          className="mt-2 max-h-36 overflow-y-auto border divide-y"
          style={{ borderColor: 'var(--color-amoria-border)' }}
        >
          {filtered.slice(0, 30).map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => onToggle(option)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-black/5"
                style={{
                  color: 'var(--color-amoria-text)',
                  backgroundColor: isSelected ? 'rgba(139,113,56,0.08)' : undefined,
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function CustomPerfumePage() {
  const { t } = useLanguage();
  const { data: bootstrap } = usePublicBootstrap();
  const { data: brands = [] } = useBrands();
  const [noteSearch, setNoteSearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  const { data: fragranceNotes = [] } = usePublicFragranceNotes(noteSearch);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    fragranceNotes: [] as string[],
    brandNames: [] as string[],
    inspiration: '',
    occasion: '',
    additionalNotes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const startingPrice = bootstrap?.platform?.customPerfumePrice ?? 0;
  const noteOptions = useMemo(() => fragranceNotes.map((n) => n.name), [fragranceNotes]);
  const brandOptions = useMemo(() => brands.map((b) => b.name), [brands]);

  function toggleItem(field: 'fragranceNotes' | 'brandNames', value: string) {
    setForm((prev) => {
      const list = prev[field];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [field]: next };
    });
  }

  function addCustomNote(value: string) {
    if (!value || form.fragranceNotes.includes(value)) return;
    setForm((prev) => ({ ...prev, fragranceNotes: [...prev.fragranceNotes, value] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiSubmitCustomPerfume(form);
      if (!res.success) throw new Error(res.message ?? 'Failed to submit');
      setSubmitted(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        fragranceNotes: [],
        brandNames: [],
        inspiration: '',
        occasion: '',
        additionalNotes: '',
      });
      toast.success(res.message || t('customPerfumeSuccess'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="py-10 px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles size={22} className="text-white/80" />
        </div>
        <h1 className="text-3xl md:text-4xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('customPerfumeTitle')}
        </h1>
        <p className="text-white/60 text-sm mt-2 max-w-xl mx-auto">{t('customPerfumeSubtitle')}</p>
        {startingPrice > 0 ? (
          <p className="text-white/90 text-sm mt-4 font-medium">
            {t('customPerfumeStartingFrom')} AED {startingPrice.toLocaleString()}
          </p>
        ) : (
          <p className="text-white/70 text-sm mt-4">{t('customPerfumePriceConsultation')}</p>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {submitted ? (
          <div
            className="text-center py-12 px-6 border"
            style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}
          >
            <Sparkles size={32} className="mx-auto mb-4" style={{ color: 'var(--color-amoria-accent)' }} />
            <h2 className="text-xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {t('customPerfumeThankYou')}
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
              {t('customPerfumeThankYouBody')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={{ color: 'var(--color-amoria-text-muted)' }}>
                  {t('customPerfumeName')}
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  style={{ borderColor: 'var(--color-amoria-border)' }}
                />
              </div>
              <div>
                <label className={labelClass} style={{ color: 'var(--color-amoria-text-muted)' }}>
                  {t('customPerfumeEmail')}
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  style={{ borderColor: 'var(--color-amoria-border)' }}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} style={{ color: 'var(--color-amoria-text-muted)' }}>
                {t('customPerfumePhone')}
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass}
                style={{ borderColor: 'var(--color-amoria-border)' }}
              />
            </div>

            <ChipSelect
              label={t('customPerfumeNotes')}
              hint={t('customPerfumeNotesHint')}
              selected={form.fragranceNotes}
              onToggle={(v) => toggleItem('fragranceNotes', v)}
              options={noteOptions}
              search={noteSearch}
              onSearchChange={setNoteSearch}
              allowCustom
              customPlaceholder={t('customPerfumeOtherNote')}
              onAddCustom={addCustomNote}
            />

            <ChipSelect
              label={t('customPerfumeBrands')}
              hint={t('customPerfumeBrandsHint')}
              selected={form.brandNames}
              onToggle={(v) => toggleItem('brandNames', v)}
              options={brandOptions}
              search={brandSearch}
              onSearchChange={setBrandSearch}
            />

            <div>
              <label className={labelClass} style={{ color: 'var(--color-amoria-text-muted)' }}>
                {t('customPerfumeInspiration')}
              </label>
              <textarea
                rows={3}
                value={form.inspiration}
                onChange={(e) => setForm({ ...form, inspiration: e.target.value })}
                placeholder={t('customPerfumeInspirationPlaceholder')}
                className={`${inputClass} resize-none`}
                style={{ borderColor: 'var(--color-amoria-border)' }}
              />
            </div>

            <div>
              <label className={labelClass} style={{ color: 'var(--color-amoria-text-muted)' }}>
                {t('customPerfumeOccasion')}
              </label>
              <input
                value={form.occasion}
                onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                placeholder={t('customPerfumeOccasionPlaceholder')}
                className={inputClass}
                style={{ borderColor: 'var(--color-amoria-border)' }}
              />
            </div>

            <div>
              <label className={labelClass} style={{ color: 'var(--color-amoria-text-muted)' }}>
                {t('customPerfumeAdditional')}
              </label>
              <textarea
                rows={4}
                value={form.additionalNotes}
                onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                placeholder={t('customPerfumeAdditionalPlaceholder')}
                className={`${inputClass} resize-none`}
                style={{ borderColor: 'var(--color-amoria-border)' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold disabled:opacity-70"
              style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
            >
              {loading ? t('customPerfumeSubmitting') : t('customPerfumeSubmit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
