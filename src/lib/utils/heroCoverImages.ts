import type { PublicCoverImage } from '@/lib/api/public';
import { resolveCmsMediaUrl } from '@/lib/utils/cmsMediaUrl';
import { filterCoverImagesForDevice } from '@/lib/utils/coverImageDevice';

export type HeroCoverBundle = {
  sliders: PublicCoverImage[];
  sidePanels: PublicCoverImage[];
};

export function normalizeCoverImage(cover: PublicCoverImage): PublicCoverImage {
  return {
    ...cover,
    imageUrl: resolveCmsMediaUrl(cover.imageUrl),
    mobileImageUrl: cover.mobileImageUrl ? resolveCmsMediaUrl(cover.mobileImageUrl) : cover.mobileImageUrl,
    thumbnailUrl: cover.thumbnailUrl ? resolveCmsMediaUrl(cover.thumbnailUrl) : cover.thumbnailUrl,
  };
}

export function processHeroCoverImages(raw: PublicCoverImage[]): HeroCoverBundle {
  const all = raw
    .filter((b) => b.imageUrl && b.enabled !== false)
    .map(normalizeCoverImage);
  return {
    sliders: all.filter((b) => b.banner_type === 'home_slider'),
    sidePanels: all.filter((b) => b.banner_type === 'hero_side_panel'),
  };
}

export type HeroBannerSlide = {
  id: string;
  desktopImage: string;
  mobileImage: string;
  href: string;
  alt: string;
};

export function mapSliderBanners(sliders: PublicCoverImage[], isDesktop: boolean): HeroBannerSlide[] {
  return filterCoverImagesForDevice(sliders, isDesktop).map((b) => ({
    id: b._id,
    desktopImage: b.imageUrl,
    mobileImage: b.mobileImageUrl?.trim() || b.imageUrl,
    href: b.redirectUrl?.trim() || '',
    alt: b.title?.trim() || 'Promotional banner',
  }));
}

export function mapSidePanels(panels: PublicCoverImage[], isDesktop: boolean): HeroBannerSlide[] {
  return filterCoverImagesForDevice(panels, isDesktop)
    .slice(0, 2)
    .map((b) => ({
      id: b._id,
      desktopImage: b.imageUrl,
      mobileImage: b.mobileImageUrl?.trim() || b.imageUrl,
      href: b.redirectUrl?.trim() || '',
      alt: b.title?.trim() || 'Promotional offer',
    }));
}
