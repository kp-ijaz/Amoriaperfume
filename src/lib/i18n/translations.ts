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
  storeLocatorTitle: { en: 'Store Locator', ar: 'موقع المتجر' },
  storeLocatorSubtitle: { en: 'Find your nearest Amoria pickup store', ar: 'اعثر على أقرب متجر أموريا للاستلام' },
  storeHours: { en: 'Opening hours', ar: 'ساعات العمل' },
  getDirections: { en: 'Get directions', ar: 'احصل على الاتجاهات' },
  storeLocatorEmpty: {
    en: 'No pickup stores are available right now. Shop online and we will deliver to your door.',
    ar: 'لا توجد متاجر استلام متاحة حالياً. تسوق عبر الإنترنت وسنوصل طلبك إلى بابك.',
  },
  storeLocatorShopOnline: { en: 'Shop online', ar: 'تسوق عبر الإنترنت' },
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
  navGiftCards: { en: 'Gift Cards', ar: 'بطاقات الهدايا' },
  navBundles: { en: 'Bundles', ar: 'الباقات' },
  navBakhoor: { en: 'Bakhoor', ar: 'البخور' },
  navCustomPerfume: { en: 'Custom Perfume', ar: 'عطر مخصص' },
  navSale: { en: 'Sale', ar: 'التخفيضات' },
  navMore: { en: 'More', ar: 'المزيد' },
  navAbout: { en: 'About Us', ar: 'معلومات عنا' },
  navContact: { en: 'Contact', ar: 'اتصل بنا' },
  navFAQs: { en: 'FAQs', ar: 'الأسئلة الشائعة' },

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
  footerLinkGiftCards: { en: 'Gift Cards', ar: 'بطاقات الهدايا' },
  footerLinkReturns: { en: 'Returns & Exchange', ar: 'الإرجاع والاستبدال' },
  footerLinkCustomPerfume: { en: 'Custom Perfume', ar: 'عطر مخصص' },
  footerLinkContact: { en: 'Contact Us', ar: 'اتصل بنا' },
  footerLinkPrivacy: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  footerLinkTerms: { en: 'Terms of Service', ar: 'شروط الخدمة' },
  footerWeAccept: { en: 'We Accept', ar: 'نقبل' },
  footerCopyright: {
    en: '© 2025 Amoria. All rights reserved. Made with ❤ in UAE.',
    ar: '© 2025 أموريا. جميع الحقوق محفوظة. صُنع بـ ❤ في الإمارات.',
  },

  // ── Custom Perfume ─────────────────────────────────────────────────────
  customPerfumeTitle: { en: 'Custom Perfume', ar: 'عطر مخصص' },
  customPerfumeSubtitle: {
    en: 'Tell us your favourite notes and brands — our perfumers will craft something uniquely yours.',
    ar: 'أخبرنا بالنوتات والماركات المفضلة لديك — سيصنع لك عطارونا عطراً فريداً.',
  },
  customPerfumeStartingFrom: { en: 'Starting from', ar: 'يبدأ من' },
  customPerfumePriceConsultation: { en: 'Price on consultation', ar: 'السعر عند الاستشارة' },
  customPerfumeName: { en: 'Name', ar: 'الاسم' },
  customPerfumeEmail: { en: 'Email', ar: 'البريد الإلكتروني' },
  customPerfumePhone: { en: 'Phone (optional)', ar: 'الهاتف (اختياري)' },
  customPerfumeNotes: { en: 'Fragrance notes', ar: 'نوتات العطر' },
  customPerfumeNotesHint: {
    en: 'Select notes you love, or type a custom note and press Enter.',
    ar: 'اختر النوتات التي تحبها، أو اكتب نوتة مخصصة واضغط Enter.',
  },
  customPerfumeOtherNote: { en: 'Search or add a custom note...', ar: 'ابحث أو أضف نوتة مخصصة...' },
  customPerfumeBrands: { en: 'Preferred brands', ar: 'الماركات المفضلة' },
  customPerfumeBrandsHint: {
    en: 'Choose brands whose style inspires you.',
    ar: 'اختر الماركات التي تلهمك بأسلوبها.',
  },
  customPerfumeInspiration: { en: 'Inspiration', ar: 'الإلهام' },
  customPerfumeInspirationPlaceholder: {
    en: 'Perfumes you love or want to smell like...',
    ar: 'عطور تحبها أو تريد أن تشبه رائحتها...',
  },
  customPerfumeOccasion: { en: 'Occasion (optional)', ar: 'المناسبة (اختياري)' },
  customPerfumeOccasionPlaceholder: {
    en: 'e.g. wedding, daily wear, evening',
    ar: 'مثال: زفاف، استخدام يومي، مساء',
  },
  customPerfumeAdditional: { en: 'Additional preferences', ar: 'تفضيلات إضافية' },
  customPerfumeAdditionalPlaceholder: {
    en: 'Anything else we should know...',
    ar: 'أي شيء آخر يجب أن نعرفه...',
  },
  customPerfumeSubmit: { en: 'Submit Request', ar: 'إرسال الطلب' },
  customPerfumeSubmitting: { en: 'Submitting...', ar: 'جاري الإرسال...' },
  customPerfumeSuccess: {
    en: 'Request submitted! Our team will contact you shortly.',
    ar: 'تم إرسال الطلب! سيتواصل معك فريقنا قريباً.',
  },
  customPerfumeThankYou: { en: 'Thank you', ar: 'شكراً لك' },
  customPerfumeThankYouBody: {
    en: 'We have received your custom perfume request. A perfumer will review your preferences and reach out soon.',
    ar: 'استلمنا طلب العطر المخصص. سيراجع العطار تفضيلاتك ويتواصل معك قريباً.',
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
