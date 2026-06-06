import { CompactHeroBanner } from '@/components/home/CompactHeroBanner';

import { CategoryIconStrip } from '@/components/home/CategoryIconStrip';

import { HomepageDynamicSections } from '@/components/home/HomepageDynamicSections';

import { LimitedOfferPopup } from '@/components/home/LimitedOfferPopup';

import { FragranceFinderWidget } from '@/components/home/FragranceFinderWidget';



export default function HomePage() {

  return (

    <>

      <CompactHeroBanner />

      <CategoryIconStrip />

      <HomepageDynamicSections />

      <LimitedOfferPopup />

      <FragranceFinderWidget />

    </>

  );

}

