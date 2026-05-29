export type Lang = 'en' | 'ar';

const t = {
  // ── Announcement Bar ──────────────────────────────────────────────────
  announcementMessages: {
    en: [
      '🚚 Free Delivery on Orders Over AED 200',
      '✨ Use Code WELCOME10 for 10% Off Your First Order',
      '⭐ Authentic Fragrances — 100% Original Guaranteed',
      '🎁 Free Gift Wrapping on Orders Above AED 300',
      '🔥 Eid Special — Use Code EID25 for 25% Off Gift Sets',
    ],
    ar: [
      '🚚 توصيل مجاني للطلبات التي تزيد على 200 درهم',
      '✨ استخدم كود WELCOME10 للحصول على خصم 10% على طلبك الأول',
      '⭐ عطور أصلية — 100% مضمونة الأصالة',
      '🎁 تغليف هدايا مجاني للطلبات التي تزيد على 300 درهم',
      '🔥 عرض العيد الخاص — استخدم كود EID25 للحصول على خصم 25% على طقم الهدايا',
    ],
  },

  // ── Header live offers ─────────────────────────────────────────────────
  liveOffers: {
    en: [
      '🔥 FLASH SALE — Use code EID25 for 25% off all Gift Sets',
      '🚚 Free Delivery on orders over AED 200 — Shop Now',
      '✨ New Arrivals in — Attar & Oud Collection 2025',
      '💎 Use WELCOME10 for 10% off your first order',
      '⏰ Limited Stock — Dehn El Oud only 4 left',
    ],
    ar: [
      '🔥 تخفيضات فورية — استخدم كود EID25 للحصول على خصم 25% على جميع طقم الهدايا',
      '🚚 توصيل مجاني للطلبات التي تزيد على 200 درهم — تسوق الآن',
      '✨ وصل حديثاً — مجموعة عطور العود 2025',
      '💎 استخدم WELCOME10 للحصول على خصم 10% على طلبك الأول',
      '⏰ مخزون محدود — دهن العود تبقّى 4 فقط',
    ],
  },

  // ── Header / Top bar ──────────────────────────────────────────────────
  storeLocator: { en: 'Store Locator', ar: 'موقع المتجر' },
  langEnglish: { en: 'English', ar: 'English' },
  langArabic: { en: 'العربية', ar: 'العربية' },
  searchPlaceholder: { en: 'Search perfumes...', ar: 'ابحث عن العطور...' },
  searchViewAll: { en: 'View all results for', ar: 'عرض جميع النتائج لـ' },
  searchNoResults: { en: 'No results for', ar: 'لا توجد نتائج لـ' },

  // ── Nav links ──────────────────────────────────────────────────────────
  navHome: { en: 'Home', ar: 'الرئيسية' },
  navCollections: { en: 'Collections', ar: 'المجموعات' },
  navBrandInspiration: { en: 'Brand Inspiration', ar: 'إلهام الماركات' },
  navGiftSets: { en: 'Gift Sets', ar: 'طقم الهدايا' },
  navBakhoor: { en: 'Bakhoor', ar: 'البخور' },
  navSale: { en: 'Sale', ar: 'التخفيضات' },

  // ── Account dropdown ───────────────────────────────────────────────────
  signIn: { en: 'Sign In', ar: 'تسجيل الدخول' },
  createAccount: { en: 'Create Account', ar: 'إنشاء حساب' },
  myOrders: { en: 'My Orders', ar: 'طلباتي' },
  trackOrder: { en: 'Track Order', ar: 'تتبع الطلب' },
  myWishlist: { en: 'My Wishlist', ar: 'قائمة الأمنيات' },
  profileSettings: { en: 'Profile Settings', ar: 'إعدادات الملف الشخصي' },
  signOut: { en: 'Sign Out', ar: 'تسجيل الخروج' },
  guestCheckout: { en: '→ Guest Checkout', ar: '← الدفع كضيف' },
  editDetails: { en: 'Edit Details', ar: 'تعديل البيانات' },
  clear: { en: 'Clear', ar: 'مسح' },

  // ── Product section (shared) ────────────────────────────────────────────
  viewAll: { en: 'View All', ar: 'عرض الكل' },

  // ── Home slot titles (fallbacks before API) ────────────────────────────
  slotNewArrivals: { en: 'New Arrivals', ar: 'وصل حديثاً' },
  slotNewArrivalsSubtitle: { en: 'Just Landed', ar: 'وصل للتو' },
  slotBestSellers: { en: 'Best Sellers', ar: 'الأكثر مبيعاً' },
  slotBestSellersSubtitle: { en: 'Most Loved', ar: 'الأكثر شعبية' },
  slotTrending: { en: 'Trending Perfumes', ar: 'العطور الرائجة' },
  slotTrendingSubtitle: { en: "What's Hot Right Now", ar: 'الأكثر رواجاً الآن' },
  slotLimitedOffers: { en: 'Limited Offers', ar: 'عروض محدودة' },
  slotLimitedOffersSubtitle: { en: 'Today Only', ar: 'اليوم فقط' },

  // ── Limited Deals ──────────────────────────────────────────────────────
  endsTonight: { en: 'Ends tonight at midnight', ar: 'تنتهي الليلة عند منتصف الليل' },
  timerHrs: { en: 'Hrs', ar: 'ساعة' },
  timerMin: { en: 'Min', ar: 'دقيقة' },
  timerSec: { en: 'Sec', ar: 'ثانية' },
  viewAllDeals: { en: 'View All Deals', ar: 'عرض جميع العروض' },

  // ── Testimonials ───────────────────────────────────────────────────────
  customerStoriesLabel: { en: 'Customer Stories', ar: 'قصص العملاء' },
  customerStoriesHeading: { en: 'What Our', ar: 'ما يقوله' },
  customerStoriesHeadingItalic: { en: 'Customers Say', ar: 'عملاؤنا' },
  statRating: { en: 'Average Rating', ar: 'متوسط التقييم' },
  statRatingSub: { en: '12,400+ reviews', ar: '+12,400 تقييم' },
  statAuthentic: { en: 'Authentic', ar: 'أصالة' },
  statAuthenticSub: { en: 'Certified original', ar: 'معتمد أصلي' },
  statCustomers: { en: 'Customers', ar: 'عملاء' },
  statCustomersSub: { en: 'Across the UAE', ar: 'في جميع أنحاء الإمارات' },
  statDelivery: { en: 'Delivery', ar: 'التوصيل' },
  statDeliverySub: { en: 'Same-day Dubai', ar: 'نفس اليوم في دبي' },
  verifiedBadge: { en: 'Verified', ar: 'موثق' },

  // ── Newsletter ─────────────────────────────────────────────────────────
  newsletterLabel: { en: 'Join the Community', ar: 'انضم للمجتمع' },
  newsletterHeading1: { en: 'Stay in', ar: 'ابقَ في' },
  newsletterHeading2: { en: 'The Scent', ar: 'روح العطر' },
  newsletterBody: {
    en: 'Be first to discover new arrivals, exclusive offers, and the stories behind our finest Arabian fragrances.',
    ar: 'كن أول من يكتشف المنتجات الجديدة والعروض الحصرية وقصص أرقى عطورنا العربية.',
  },
  newsletterPlaceholder: { en: 'Your email address', ar: 'بريدك الإلكتروني' },
  newsletterButton: { en: 'Subscribe', ar: 'اشترك' },
  newsletterSuccess: { en: "✓ You're on the list! Watch your inbox.", ar: '✓ تم تسجيلك! تحقق من بريدك الوارد.' },
  newsletterPrivacy: { en: 'No spam. Just exclusive offers and fragrance stories.', ar: 'لا رسائل مزعجة. فقط عروض حصرية وقصص عطور.' },

  // ── Instagram ──────────────────────────────────────────────────────────
  igLabel: { en: '@amoriaperfumeofficial', ar: '@amoriaperfumeofficial' },
  igHeading1: { en: 'Follow Our', ar: 'تابع' },
  igHeading2: { en: 'Journey', ar: 'رحلتنا' },
  igViewPost: { en: 'View Post', ar: 'عرض المنشور' },
  igFollow: { en: 'Follow on Instagram', ar: 'تابعنا على إنستغرام' },

  // ── Promo strip ────────────────────────────────────────────────────────
  shopNow: { en: 'Shop Now →', ar: '← تسوق الآن' },
  useCode: { en: 'Use Code:', ar: 'استخدم الكود:' },

  // ── Footer ─────────────────────────────────────────────────────────────
  footerAbout: {
    en: 'Your destination for authentic Arabian fragrances. We bring you the finest attars, ouds, and perfumes from the most celebrated houses of the region.',
    ar: 'وجهتك للعطور العربية الأصيلة. نقدم لك أجود العطور والعود والأتار من أشهر دور العطور في المنطقة.',
  },
  footerQuickLinks: { en: 'Quick Links', ar: 'روابط سريعة' },
  footerCustomerService: { en: 'Customer Service', ar: 'خدمة العملاء' },
  footerContactUs: { en: 'Contact Us', ar: 'اتصل بنا' },
  footerLinkHome: { en: 'Home', ar: 'الرئيسية' },
  footerLinkAllProducts: { en: 'All Products', ar: 'جميع المنتجات' },
  footerLinkBrands: { en: 'Brands', ar: 'الماركات' },
  footerLinkFragranceGuide: { en: 'Fragrance Guide', ar: 'دليل العطور' },
  footerLinkAboutUs: { en: 'About Us', ar: 'من نحن' },
  footerLinkFragranceFinder: { en: 'Fragrance Finder', ar: 'اكتشف عطرك' },
  footerLinkFAQs: { en: 'FAQs', ar: 'الأسئلة الشائعة' },
  footerLinkTrackOrder: { en: 'Track Order', ar: 'تتبع الطلب' },
  footerLinkReturns: { en: 'Returns & Exchange', ar: 'الإرجاع والاستبدال' },
  footerLinkContact: { en: 'Contact Us', ar: 'اتصل بنا' },
  footerLinkPrivacy: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  footerLinkTerms: { en: 'Terms of Service', ar: 'شروط الخدمة' },
  footerWeAccept: { en: 'We Accept', ar: 'نقبل' },
  footerCopyright: {
    en: '© 2025 Amoria. All rights reserved. Made with ❤ in UAE.',
    ar: '© 2025 أموريا. جميع الحقوق محفوظة. صُنع بـ ❤ في الإمارات.',
  },

  // ── MobileNav ──────────────────────────────────────────────────────────
  mobileSearchPlaceholder: { en: 'Search perfumes...', ar: 'ابحث عن العطور...' },
  mobileOrders: { en: 'Orders', ar: 'الطلبات' },
  mobileAccount: { en: 'Account', ar: 'الحساب' },
  mobileLogin: { en: 'Login', ar: 'تسجيل الدخول' },
  mobileRegister: { en: 'Register', ar: 'إنشاء حساب' },
} as const;

export type TranslationKey = keyof typeof t;

export function tr(key: TranslationKey, lang: Lang): string {
  const entry = t[key];
  if (Array.isArray(entry)) return '';
  if ('en' in entry && 'ar' in entry) {
    return (entry as Record<Lang, string>)[lang] ?? (entry as Record<string, string>)['en'];
  }
  return '';
}

export function trArray(key: TranslationKey, lang: Lang): string[] {
  const entry = t[key] as Record<string, unknown>;
  if (entry && Array.isArray(entry['en'])) {
    const arr = entry[lang] ?? entry['en'];
    return Array.isArray(arr) ? (arr as string[]) : [];
  }
  return [];
}
