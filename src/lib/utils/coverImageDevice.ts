export type CoverImageDeviceFlags = {
  showMobile?: boolean;
  showDesktop?: boolean;
};

/** Matches Tailwind `md:` breakpoint used in hero layout. */
export const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

export function coverImageVisibleOnDevice(
  banner: CoverImageDeviceFlags,
  isDesktop: boolean
): boolean {
  const showMobile = banner.showMobile !== false;
  const showDesktop = banner.showDesktop !== false;
  return isDesktop ? showDesktop : showMobile;
}

export function filterCoverImagesForDevice<T extends CoverImageDeviceFlags>(
  items: T[],
  isDesktop: boolean
): T[] {
  return items.filter((item) => coverImageVisibleOnDevice(item, isDesktop));
}

export function resolveCoverImageUrl(
  cover: { imageUrl: string; mobileImageUrl?: string },
  isDesktop: boolean
): string {
  if (isDesktop) return cover.imageUrl;
  return cover.mobileImageUrl?.trim() || cover.imageUrl;
}
