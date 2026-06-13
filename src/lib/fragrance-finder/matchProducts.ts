import { Product } from '@/types/product';
import { quizQuestions, QuizCriterion } from '@/lib/data/quiz';

export interface QuizMatch {
  product: Product;
  score: number;
}

export function parseQuizMatchIds(param: string | null): string[] | undefined {
  if (!param) return undefined;
  const ids = param
    .split(',')
    .map((s) => decodeURIComponent(s.trim()))
    .filter(Boolean);
  return ids.length ? ids : undefined;
}

export function buildQuizMatchesProductsUrl(productIds: string[]): string {
  if (!productIds.length) return '/products';
  return `/products?quizMatch=${productIds.map(encodeURIComponent).join(',')}`;
}

export function getProductMinPrice(product: Product): number {
  if (!product.variants.length) return 0;
  return product.variants.reduce(
    (min, v) => Math.min(min, v.salePrice ?? v.price),
    Infinity
  );
}

export function getAllNotes(product: Product): string {
  return [...product.topNotes, ...product.heartNotes, ...product.baseNotes]
    .join(' ')
    .toLowerCase();
}

function notesMatchKeywords(product: Product, keywords: string[]): boolean {
  const notes = getAllNotes(product);
  return keywords.some((kw) => notes.includes(kw.toLowerCase()));
}

export function productMatchesCriterion(product: Product, criterion: QuizCriterion): boolean {
  if (criterion.gender !== undefined) {
    if (criterion.gender === null) return true;
    if (product.gender === 'unisex') return true;
    if (product.gender !== criterion.gender) return false;
  }

  if (criterion.dayNight !== undefined) {
    const productDayNight = product.dayNight ?? 'both';
    if (criterion.dayNight === 'both') {
      if (productDayNight !== 'both') return false;
    } else if (productDayNight !== criterion.dayNight && productDayNight !== 'both') {
      return false;
    }
  }

  if (criterion.season !== undefined) {
    const seasons = product.seasons ?? [];
    if (seasons.length > 0 && !seasons.includes(criterion.season)) return false;
  }

  if (criterion.noteKeywords !== undefined && criterion.noteKeywords.length > 0) {
    if (!notesMatchKeywords(product, criterion.noteKeywords)) return false;
  }

  if (criterion.priceMin !== undefined || criterion.priceMax !== undefined) {
    const price = getProductMinPrice(product);
    const min = criterion.priceMin ?? 0;
    const max = criterion.priceMax ?? Infinity;
    if (price < min || price >= max) return false;
  }

  return true;
}

function getCriteriaForAnswers(answers: Record<number, string>): QuizCriterion[] {
  const criteria: QuizCriterion[] = [];
  for (const q of quizQuestions) {
    const optionId = answers[q.id];
    if (!optionId) continue;
    const option = q.options.find((o) => o.id === optionId);
    if (option?.criteria) criteria.push(option.criteria);
  }
  return criteria;
}

export function computeMatchScore(product: Product, criteria: QuizCriterion[]): number {
  if (criteria.length === 0) return 0;
  const met = criteria.filter((c) => productMatchesCriterion(product, c)).length;
  return Math.round((met / criteria.length) * 100);
}

export function matchQuizProducts(
  products: Product[],
  answers: Record<number, string>
): QuizMatch[] {
  const criteria = getCriteriaForAnswers(answers);
  if (criteria.length === 0) return [];

  return products
    .filter((product) => criteria.every((c) => productMatchesCriterion(product, c)))
    .map((product) => ({
      product,
      score: computeMatchScore(product, criteria),
    }))
    .sort((a, b) => a.product.name.localeCompare(b.product.name));
}
