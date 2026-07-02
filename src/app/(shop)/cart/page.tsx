import { CartPageClient } from './CartPageClient';
import { noIndexMetadata } from '@/lib/seo/metadata';

export const metadata = noIndexMetadata;

export default function CartPage() {
  return <CartPageClient />;
}
