import { CompactHeroBanner } from '@/components/home/CompactHeroBanner';
import { CategoryIconStrip } from '@/components/home/CategoryIconStrip';
import { HomepageDynamicSections } from '@/components/home/HomepageDynamicSections';
import { LimitedOfferPopupLazy } from '@/components/home/LimitedOfferPopupLazy';
import { JsonLd } from '@/components/seo/JsonLd';
import { fetchHeroCoverImages } from '@/lib/api/server';
import { homeMetadata } from '@/lib/seo/static-pages';
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/lib/seo/jsonld';

export const metadata = homeMetadata;

export default async function HomePage() {
  const initialHeroData = await fetchHeroCoverImages();

  return (
    <>
      <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]} />
      <CompactHeroBanner initialHeroData={initialHeroData} />
      <CategoryIconStrip />
      <HomepageDynamicSections />
      <LimitedOfferPopupLazy />
    </>
  );
}
