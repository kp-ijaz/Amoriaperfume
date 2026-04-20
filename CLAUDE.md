@AGENTS.md
You are building "Amoria" — a premium perfume e-commerce customer website for the UAE market.

REFERENCE WEBSITES TO STUDY AND MATCH IN STYLE:
1. https://www.vperfumes.com/ae-en           ← Main layout, product cards, category icons, header
2. https://yusufbhaifragrances.com           ← Arabian luxury feel, dark/gold tones, fragrance storytelling
3. https://www.marinahomeinteriors.com/en-uae ← Premium UAE retail feel, full-width sections, editorial layout

DESIGN DIRECTION (derived from references):
- vperfumes.com style: clean white background, product-forward layout, icon-based category strip, 
  dual-image hover on cards, prominent cashback/promo banners, AED pricing, "Add to Cart" inline
- yusufbhaifragrances.com style: dark backgrounds for hero/feature sections, gold typography, 
  Arabian calligraphy-inspired decorative elements, oud/attar storytelling sections, rich textures
- marinahomeinteriors.com style: editorial full-width sections, large lifestyle photography, 
  luxury retail spacing, refined typography, subtle hover animations throughout

COMBINED VISUAL IDENTITY FOR AMORIA:
- Light sections (product grids, PLP): white background, clean, vperfumes-style
- Feature/hero sections: near-black (#0D0A08) or deep purple (#1A0A2E) with gold accents
- Typography: Cormorant Garamond (headings) + Inter (body) — elegant editorial feel
- Gold (#C9A84C) is the primary accent for CTAs, prices, highlights
- Subtle grain texture overlay on dark hero sections (CSS noise filter)
- Arabic-inspired geometric border patterns as section dividers (SVG)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Framework: Next.js 14 (App Router)
- Styling: Tailwind CSS + shadcn/ui
- State: Redux Toolkit + Redux Persist (cart, wishlist, recently viewed)
- Server state: TanStack Query
- Forms: React Hook Form + Zod
- Animations: Framer Motion
- Carousel/Slider: Embla Carousel
- Icons: Lucide React
- Fonts: next/font/google — Cormorant Garamond (400, 600) + Inter (400, 500)
- Video: HTML5 <video> with autoplay, muted, loop, playsInline
- Lazy loading: next/image for all images, IntersectionObserver for sections
- Language: TypeScript strict mode

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN SYSTEM — CSS VARIABLES (globals.css)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
:root {
  --color-primary:       #1A0A2E;   /* deep royal purple */
  --color-primary-light: #2D1554;
  --color-accent:        #C9A84C;   /* gold */
  --color-accent-light:  #E8C97A;   /* light gold for hover */
  --color-dark:          #0D0A08;   /* near-black for hero sections */
  --color-bg:            #FAF8F5;   /* warm off-white page background */
  --color-surface:       #FFFFFF;
  --color-surface-2:     #F5F2EE;   /* slightly warm card bg */
  --color-text:          #1C1C1C;
  --color-text-muted:    #6B6B6B;
  --color-text-light:    #A89880;   /* on dark backgrounds */
  --color-border:        #E8E3DC;
  --color-gold-border:   #C9A84C40; /* gold border with opacity */
}

Tailwind extend config:
  colors: map all above CSS vars
  fontFamily: { heading: ['Cormorant Garamond'], body: ['Inter'] }
  animation: { 'fade-in': '...', 'slide-up': '...', 'marquee': '...' }

Component conventions:
  - Primary button: bg-accent text-primary font-heading italic tracking-wide px-8 py-3 
    hover:bg-accent-light transition-all duration-200
  - Outline button: border border-accent text-accent hover:bg-accent hover:text-primary
  - Section headings: font-heading text-4xl md:text-5xl font-normal tracking-wide
  - Gold underline accent: after: pseudo-element, 2px solid accent color, 40px wide, centered
  - Cards: bg-surface border border-[#E8E3DC] rounded-none (square corners like vperfumes)
    hover: border-accent transition-colors duration-200
  - Product price: text-accent font-semibold (gold color like vperfumes)
  - Strikethrough original price: text-muted line-through text-sm
  - All AED prices: formatCurrency(249) → "AED 249.00"
  - Discount badge: bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-sm absolute top-2 left-2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FOLDER STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (shop)/
│   │   ├── page.tsx                     ← Home
│   │   ├── products/
│   │   │   ├── page.tsx                 ← PLP
│   │   │   └── [slug]/page.tsx          ← PDP
│   │   ├── categories/[slug]/page.tsx
│   │   ├── brands/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── order-confirmation/page.tsx
│   │   ├── fragrance-finder/page.tsx
│   │   ├── fragrance-guide/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── faqs/page.tsx
│   └── (account)/
│       ├── account/orders/page.tsx
│       ├── account/orders/[id]/page.tsx
│       └── account/profile/page.tsx
├── components/
│   ├── ui/                              ← shadcn/ui primitives
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── AnnouncementBar.tsx
│   ├── home/
│   │   ├── VideoHero.tsx                ← Full-screen video hero section
│   │   ├── HeroBannerCarousel.tsx       ← Fallback image carousel
│   │   ├── CategoryIconStrip.tsx        ← vperfumes-style icon+label row
│   │   ├── PromoStripBanner.tsx         ← "30% Cashback | Use Code: CB30" wide banner
│   │   ├── FeaturedCollections.tsx      ← Editorial full-width lifestyle section
│   │   ├── ProductSection.tsx           ← Reusable grid section (New Arrivals etc.)
│   │   ├── BrandShowcase.tsx            ← Brand logos horizontal scroll
│   │   ├── FragranceFinderCTA.tsx       ← Dark section with quiz entry
│   │   ├── LimitedDealsSection.tsx      ← Deals + countdown timer
│   │   ├── TestimonialsSection.tsx      ← Customer reviews carousel
│   │   ├── InstagramFeed.tsx            ← Mock Instagram grid (6 dummy images)
│   │   └── NewsletterSection.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductImageGallery.tsx
│   │   ├── ProductVariantSelector.tsx
│   │   ├── FragranceNotes.tsx
│   │   ├── RatingStars.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── ReviewsSection.tsx
│   │   ├── RelatedProducts.tsx
│   │   ├── PeopleAlsoBought.tsx
│   │   └── RecentlyViewed.tsx
│   ├── plp/
│   │   ├── FilterSidebar.tsx
│   │   ├── MobileFilterSheet.tsx
│   │   ├── SortDropdown.tsx
│   │   ├── ActiveFilters.tsx
│   │   └── GridListToggle.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CouponInput.tsx
│   ├── checkout/
│   │   ├── CheckoutStepper.tsx
│   │   ├── AddressStep.tsx
│   │   ├── PaymentStep.tsx
│   │   └── ReviewStep.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   └── fragrance-finder/
│       ├── QuizStep.tsx
│       ├── QuizProgress.tsx
│       └── QuizResults.tsx
├── lib/
│   ├── data/
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   ├── brands.ts
│   │   ├── banners.ts
│   │   ├── videos.ts                    ← Dummy video URLs (use free Pexels video IDs)
│   │   ├── reviews.ts
│   │   ├── coupons.ts
│   │   └── quiz.ts
│   ├── store/
│   │   ├── index.ts
│   │   ├── cartSlice.ts
│   │   ├── wishlistSlice.ts
│   │   └── uiSlice.ts
│   ├── hooks/
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   ├── useProducts.ts
│   │   ├── useCountdown.ts              ← For deal timers
│   │   └── useLocalStorage.ts
│   └── utils/
│       ├── formatCurrency.ts
│       ├── calculateVAT.ts
│       └── cn.ts
└── types/
    ├── product.ts
    ├── cart.ts
    └── user.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VIDEO HERO — VideoHero.tsx (PRIORITY COMPONENT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is the first thing visitors see. Build it exactly like luxury fashion/perfume brand sites:

Structure:
- Full viewport height (100vh) section
- HTML5 <video> tag: autoPlay muted loop playsInline, object-fit: cover, w-full h-full absolute
- Dark overlay: absolute inset-0 bg-black/50 (allows video to show through)
- Centered content overlay (z-10, relative):
    - Small label: "NEW COLLECTION 2025" — letter-spacing: 0.3em, gold color, font-size: 12px
    - Arabic decorative divider SVG (simple geometric pattern, gold color, 60px wide)
    - Main headline: "The Art of" (thin weight) + " Arabian Scent" (on new line, italic) 
      — Cormorant Garamond, 72px desktop / 42px mobile, text-white
    - Subheadline: "Discover perfumes that tell your story" 
      — Inter, 16px, text-white/80
    - Two CTA buttons side by side:
        "Shop Collection" — primary gold button
        "Find Your Scent" — outline white button
- Bottom of video: scroll indicator (animated bouncing arrow down icon)
- Mute/Unmute button (bottom-right corner, small icon button)

Video sources (use free Pexels embed videos — these are royalty-free):
Use these Pexels video IDs in the src. Pexels video embed format:
https://player.vimeo.com/external/{id}.hd.mp4?s=...

Instead, use this approach for dummy video:
In lib/data/videos.ts export a heroVideo object with:
{
  src: "https://www.w3schools.com/html/mov_bbb.mp4",   ← placeholder that actually works
  poster: "https://images.unsplash.com/photo-1557053378-d3e8-4d49-a89f-..."
}
Note to developer: replace with actual brand video (mp4, recommended 1920×1080, <15MB, 
compressed with HandBrake). For production use Cloudinary video delivery with 
auto-quality and format (f_auto, q_auto).

Fallback behavior:
- If video fails to load, show HeroBannerCarousel instead
- Add <noscript> fallback image

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANNOUNCEMENT BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Fixed at very top, bg-primary (deep purple), text-accent (gold), text-xs
- Auto-rotating marquee (CSS animation, 3 messages, no JS needed):
  "🚚 Free Delivery on Orders Over AED 200"  |
  "✨ Use Code WELCOME10 for 10% Off Your First Order"  |
  "⭐ Authentic Fragrances — 100% Original Guaranteed"
- Dismissible (× button, stores dismissed state in localStorage)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HEADER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Two-row header (like vperfumes.com):

Row 1 (top nav bar) — bg-white, border-bottom:
  - Left: Logo — "AMORIA" in Cormorant Garamond with a gold dot/crescent accent
  - Center: Search bar — full-width input with magnifier icon, 
    shows instant dropdown results (product name, image thumbnail, price) as user types
  - Right: Wishlist icon (heart) + count badge | Cart icon + count badge | 
    Account icon (dropdown: Login / Register or My Orders / Profile / Logout)

Row 2 (category nav) — bg-primary (deep purple), text-white:
  Navigation links: Men | Women | Attar & Oud | Bakhoor | Gift Sets | Brands | Sale
  Each with hover: gold underline slide-in animation
  "Sale" link: text-red-400 with a small badge

Sticky behavior:
  - On scroll past 80px: Row 1 only stays sticky, Row 2 hides
  - Sticky header gets subtle drop shadow
  - Logo shrinks slightly (scale transition)

Mobile header (< 768px):
  - Single row: Hamburger | Logo (center) | Cart icon
  - MobileNav: full-screen drawer from left
    Shows: category links, account links, search input at top

Search dropdown (instant search):
  - Shows up to 5 matching products as user types
  - Each result: 40px thumbnail + product name + brand + price
  - "View all results for '{query}'" link at bottom
  - Keyboard navigable (arrow keys)
  - Close on Escape or click outside

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOME PAGE — SECTION BY SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. AnnouncementBar (gold marquee, dismissible)

2. Header (two-row sticky)

3. VideoHero (full viewport, video background, overlay text + 2 CTAs)

4. CategoryIconStrip — inspired by vperfumes.com:
   Horizontal scrollable strip (snap scroll on mobile), centered on desktop
   8 category icon cards: circular image + label below
   Categories: Online Deals | Attar & Oud | Bakhoor | Gift Sets | Niche Perfumes | 
               Men's | Women's | Mini Perfumes
   Each card: 80px circular image, category name below in Inter 12px
   Active/hover: gold ring border on circle
   Use Unsplash images for each category circle (perfume macro shots)

5. PromoStripBanner — full width, bg-accent (gold), text-primary:
   Large centered text: "Massive 30% Cashback | Use Code: CB30" 
   + "Shop Now →" link on the right
   Matches exactly vperfumes.com's cashback strip style

6. "New Arrivals" ProductSection:
   Section header: "New Arrivals" (Cormorant Garamond h2) + "View All" link
   Gold 2px underline accent under heading
   8 ProductCards in responsive grid (2→3→4 cols)

7. FeaturedCollections — editorial dark section (bg: #0D0A08):
   Two-column asymmetric layout:
   - Left (60%): large lifestyle image (perfume bottle on marble, Unsplash)
     with text overlay: Collection name + short description + "Explore" CTA
   - Right (40%): two stacked smaller feature cards with different collections
   Inspired by marinahomeinteriors.com's editorial sections
   On mobile: stacks vertically

8. "Best Sellers" ProductSection (same style as New Arrivals)

9. BrandShowcase — white section:
   "Our Brands" heading
   Horizontal scrollable logos strip (5 brand logos as text in elegant serif font)
   Brands: Swiss Arabian | Ajmal | Rasasi | Lattafa | Armaf
   Each with hover: opacity 100% (default: 60% muted)

10. FragranceFinderCTA — dark section (bg-primary):
    Large decorative Arabic geometric SVG pattern (left side, semi-transparent gold)
    Right side text:
      "Discover Your" (thin) / "Perfect Scent" (italic gold)
      "Answer 5 quick questions and we'll match you with your ideal fragrance"
      "Take the Quiz →" button (gold outline, hover fills gold)
    Framer Motion: slide-in from right on scroll into view

11. LimitedDealsSection:
    bg-surface-2 (warm off-white)
    Heading: "Limited Time Offers" + countdown timer (HH:MM:SS, resets every 24h)
    3 product cards in a row with deal-specific discount badge
    Timer runs client-side using useCountdown hook

12. TestimonialsSection — bg-primary (deep purple):
    "What Our Customers Say" heading in gold
    Embla Carousel of 6 review cards:
      Each card: large quote mark (gold), review text, star rating, customer name + location
      Dark card bg (#2D1554), white text
    Auto-plays every 5 seconds

13. InstagramFeed — white section:
    Heading: "Follow Our Journey @amoria.ae"
    6-column grid of square images (perfume lifestyle shots from Unsplash)
    Each image: hover overlay with Instagram icon + "View Post" text
    Link below: "Follow on Instagram →"

14. NewsletterSection — bg-accent (gold):
    "Stay in the Scent" heading in deep purple
    Single email input + "Subscribe" button (inverted colors)
    Privacy note: "No spam. Just exclusive offers and new arrivals."

15. Footer — bg-dark (#0D0A08), text-white/70:
    4 columns:
      Col 1: Amoria logo + brand description (2 lines) + social icons (Instagram, WhatsApp, TikTok)
      Col 2: Quick Links — Home, Products, Brands, Fragrance Guide, About Us
      Col 3: Customer Service — FAQs, Track Order, Returns, Contact Us
      Col 4: Contact — Phone (WhatsApp link), Email, Address, 
              Payment icons: Visa, Mastercard, Apple Pay, COD badges
    Bottom bar: copyright + "Made with ❤ in UAE" + links to Privacy Policy / Terms
    Thin gold divider line above bottom bar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT CARD — ProductCard.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Exactly like vperfumes.com product cards:

Structure:
- Aspect ratio 1:1 image container (bg-surface-2)
  - Primary image shown by default
  - On hover (desktop): crossfade to secondary image (opacity transition, 300ms)
  - Top-left badge: "NEW" (green) or "SALE" (red) or "BESTSELLER" (amber) — absolute positioned
  - Top-right: heart icon button (wishlist toggle)
    - Unfilled: gray
    - Filled: red (when wishlisted)
    - onClick: adds/removes from wishlist Redux slice + shows toast
  - Bottom of image on hover: "Quick Add" button slides up (translateY animation)
    - Clicking Quick Add: if product has variants → opens QuickViewModal
    - If no variants → directly adds to cart + shows toast
- Below image:
  - Brand name: Inter 11px text-muted uppercase tracking-wider
  - Product name: Inter 14px text-text font-medium (truncate to 2 lines)
  - Rating: star icons + "(count)" in text-muted
  - Price row:
    - Sale price: text-accent font-semibold text-base (gold)
    - Original price: line-through text-muted text-sm (if on sale)
  - Size info: "50ml | 100ml" in text-muted text-xs (if multiple variants)
- "Add to Cart" button: full-width below, bg-primary text-white text-sm
  hover: bg-primary-light

QuickViewModal:
  - shadcn/ui Dialog
  - Shows: image + name + variant selector + qty + Add to Cart
  - For simple browsing without going to full PDP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT LISTING PAGE (PLP) — /products
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Page hero banner (short, 200px): category name + breadcrumb on dark bg
- Layout: 260px fixed sidebar (desktop) | main content area
- FilterSidebar (desktop) / bottom sheet (mobile):
    Filters: Category | Brand | Gender | Price Range slider (AED 0–2000) | 
             Fragrance Family | Discount | Rating | Concentration
    Each filter group: collapsible accordion (shadcn Accordion)
    Applied filter count badge on "Filters" button (mobile)
- ActiveFilters: chip row below top bar, each chip has × to remove, "Clear All" at end
- Top bar: "{count} Products" | SortDropdown | Grid/List toggle
- Product grid: 4 cols desktop → 3 cols tablet → 2 cols mobile
- Load More button (not pagination) — loads 12 more products, Framer Motion stagger animation
  on new cards appearing
- Empty state: illustrated empty state + "Try different filters" message

SortDropdown options:
  Newest | Best Sellers | Price: Low to High | Price: High to Low | Highest Rated | Most Reviewed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCT DETAIL PAGE (PDP) — /products/[slug]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Breadcrumb: Home > Attar & Oud > Shaghaf Oud Aswad
- Two-column layout desktop (55% image | 45% details), single column mobile

LEFT — ProductImageGallery:
  - Main image: large, square aspect ratio, next/image quality=90
  - Zoom: on hover shows magnified area in a fixed corner box (CSS zoom effect)
  - Thumbnails: horizontal strip of 4–5 small images below main, click to change
  - Mobile: Embla Carousel with swipe, dot indicators below

RIGHT — Product details:
  - Brand: uppercase small link (→ brand PLP)
  - Product name: Cormorant Garamond 36px
  - Rating row: 5 stars + "4.5 (127 reviews)" link (scrolls to reviews tab)
  - Price:
    - Sale price: text-accent text-3xl font-semibold
    - Original price: line-through text-muted text-xl
    - Discount pill: "-30%" red badge
  - Thin gold divider line
  - Variant selectors (only render if multiple exist):
    - Concentration tabs: EDP | EDT | Parfum | Attar (styled tab buttons)
    - Size buttons: 30ml | 50ml | 100ml | 200ml (bordered, selected = filled gold)
    - Selected variant updates price dynamically
  - Stock status: green dot + "In Stock" | amber + "Only 3 left!" | red + "Out of Stock"
  - Quantity picker: [ − ] [ 2 ] [ + ] with min=1 max=stock
  - "Add to Cart" button: full-width, large, bg-primary, hover bg-primary-light
    Shows loading spinner on click, then success state with checkmark (500ms)
  - "Add to Wishlist" button: full-width outline below
  - Free shipping badge: if price >= AED 200, show green badge "✓ Free Delivery"
  - Thin gold divider
  - Quick info icons row: 
    🔄 Easy Returns | ✓ 100% Authentic | 🚚 Fast Delivery | 🎁 Gift Wrapping
  - Fragrance info collapsible rows (accordion):
    - Top Notes: [chips]
    - Heart Notes: [chips]  
    - Base Notes: [chips]
    - Fragrance Family | Gender | Concentration

BELOW fold — Tabs (shadcn Tabs):
  Tab 1 — Description: rich product description text
  Tab 2 — Fragrance Notes: visual pyramid layout:
    - Triangle SVG with 3 sections: Top (peak) | Heart (middle) | Base (bottom)
    - Each section lists notes as chips
    - Inspired by luxury perfume brand PDP pages
  Tab 3 — Reviews:
    - Summary: large "4.5" number + stars + total count
    - Rating breakdown bars: 5★ ████░ 78% | 4★ ██░░░ 14% | etc.
    - "Write a Review" button (opens modal if logged in)
    - Individual ReviewCards: 
      Avatar (initials circle) | Name | Date | Stars | Comment | "Verified Purchase" badge
    - Load more reviews button

BELOW tabs:
  - "People Also Bought" — horizontal scroll Embla carousel, 6 ProductCards
  - "Related Products" — grid of 4 ProductCards
  - "Recently Viewed" — horizontal scroll bar, last 6 viewed products

MOBILE-SPECIFIC PDP:
  - Sticky bottom bar (fixed, always visible):
    Price (left) | "Add to Cart" button (right, full remaining width)
  - Hides when "Add to Cart" button in main content is visible on screen
    (use IntersectionObserver)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CART PAGE (/cart)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Desktop: 65% cart items | 35% order summary (sticky)
- Mobile: stacked, summary at bottom

CartItem:
  - 80px product image | Name + variant info | Qty stepper | Line total | × remove
  - "Save for Later" link (moves item to saved section)

CouponInput:
  - Text input + "Apply" button
  - Valid codes: WELCOME10 (10%), AMORIA20 (20%), FREESHIP (free shipping), 
    EID25 (25%), NEWUSER (15%)
  - Shows: green success "Coupon applied! You saved AED X" or red error

Order Summary:
  - Subtotal: AED XX
  - Coupon discount: -AED XX (green text, if applied)
  - Shipping: Free (if > AED 200) / AED 25.00
  - VAT (5%): AED XX
  - ─────────────────
  - Total: AED XX (bold, large, gold color)
  - "Proceed to Checkout" → primary gold button, full-width
  - "Continue Shopping" → text link

Empty cart state:
  - Centered illustration (SVG shopping bag with sparkles)
  - "Your cart is empty" heading
  - "Browse our collection" button → /products

CartDrawer (slide from right on cart icon click):
  - Same content as cart page in compact form
  - "View Full Cart" + "Checkout" buttons at bottom
  - Framer Motion slide-in animation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHECKOUT PAGE (/checkout)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CheckoutStepper: 3 steps with connecting line
  Step 1: Address | Step 2: Payment | Step 3: Review & Place Order

Step 1 — Delivery Address:
  - List 2 pre-saved dummy addresses (radio select)
  - "Add New Address" form:
    Name | Phone | Street & Building | Area | 
    Emirate (dropdown: Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain)
    Postcode (optional) | Set as default checkbox
  - Zod validation, inline error messages

Step 2 — Payment Method:
  - Radio options with icons:
    💳 Credit/Debit Card: mock card input (card number, expiry, CVV fields — static UI)
    🍎 Apple Pay: single button (mock)
    💵 Cash on Delivery: +AED 10 fee note
       When selected: shows "We'll send a WhatsApp OTP to confirm your order"
       OTP input fields (4 digits) with "Verify" button
  - All mock — no real payment processing

Step 3 — Review:
  - Order items list (compact)
  - Delivery address summary
  - Payment method summary
  - Final price breakdown
  - "Place Order" button → loading state → success redirect

Order Confirmation (/order-confirmation):
  - Framer Motion: checkmark circle animation (draw SVG path)
  - "Order Placed Successfully!"
  - Order #: AMR-{random 6 digit}
  - "Estimated Delivery: 3–5 business days"
  - "You'll receive a WhatsApp & email confirmation shortly"
  - Two buttons: "Track Your Order" + "Continue Shopping"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRAGRANCE FINDER (/fragrance-finder)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Full-page quiz with dark luxury background (bg-primary):

Layout: centered card (max-w-2xl), white card on dark purple page

Progress bar: gold fill, animates forward on each answer (20% per step)
Step counter: "Step 2 of 5"
Back button top-left

Question slides (Framer Motion slide transition between questions):

Q1 — "What mood should your fragrance evoke?"
  4 option cards with icon + label, 2×2 grid:
  🌙 Mysterious & Sensual | ⚡ Fresh & Energetic | 🔥 Warm & Cozy | 👑 Bold & Powerful

Q2 — "When will you mostly wear this?"
  🌅 Daily / Office | 🎉 Special Occasions | 🌃 Evenings & Nights | ☀️ All Day Every Day

Q3 — "Which scent family calls to you?"
  🪵 Oud & Amber | 🌹 Floral & Rose | 🌿 Woody & Musk | 🍋 Citrus & Fresh

Q4 — "How intense should the sillage be?"
  🌬️ Light & Subtle | ✨ Moderate Presence | 💫 Strong & Noticeable | 🌟 Commanding & Bold

Q5 — "What's your per-bottle budget?"
  Under AED 100 | AED 100–250 | AED 250–500 | AED 500+

Option cards: white border card, hover: gold border + gold bg tint, 
selected: filled gold bg + primary text

Results page (after Q5 — Framer Motion fade in):
  - "Your Amoria Matches" heading
  - Match logic: map answers to fragrance tags on dummy products, score matches
  - Top 4 products displayed as larger cards with "94% Match" gold badge
  - Each card: image | name | price | "Add to Cart" | "View Details" buttons
  - "Retake Quiz" outlined button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AUTH PAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Split-screen layout (desktop):
  Left 50%: full-height image (luxury perfume lifestyle, Unsplash) with Amoria logo overlay
  Right 50%: form

Login form:
  - Email + Password
  - "Remember me" checkbox
  - "Forgot Password?" link
  - "Sign in" button (primary)
  - Divider "or"
  - "Continue with Google" button (outlined, Google icon)
  - "Don't have an account? Register" link

Register form:
  - First Name | Last Name (2 columns)
  - Email | Phone
  - Password | Confirm Password
  - Agree to Terms checkbox (required)
  - "Create Account" button
  - "Already have an account? Login" link

All forms: React Hook Form + Zod, inline validation errors, loading states on submit

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCOUNT PAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/account/orders:
  - Order cards showing: order number, date, status badge, item count, total
  - Expandable to show item thumbnails + names
  - Status badges with color: 
    Pending=yellow | Confirmed=blue | Processing=orange | 
    Shipped=purple | Delivered=green | Cancelled=red
  - "Track Order" → modal with 4-step timeline:
    Order Placed ✓ → Confirmed ✓ → Out for Delivery → Delivered
  - "Re-order" button (repopulates cart)
  - "Return/Exchange" button (shows if delivered within 7 days)
    Clicking opens modal: reason dropdown + optional message + submit

/account/profile:
  - Avatar with initials + "Change Photo" button
  - Editable fields: Name, Phone
  - Email: readonly (with note "Contact support to change email")
  - "Change Password" section (current + new + confirm)
  - Address Book: cards with edit/delete/set-default, "Add Address" button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DUMMY DATA — lib/data/products.ts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
30 products, each with:
{
  id, slug, name, brand, category, gender (men|women|unisex),
  fragranceFamily, concentration,
  topNotes: string[], heartNotes: string[], baseNotes: string[],
  description,
  images: [{ url, alt, isPrimary }],  ← Unsplash perfume photos
  variants: [{ id, sizeMl, concentration, price, salePrice, stock }],
  rating, reviewCount,
  tags: string[],                     ← used by fragrance finder matching
  isFeatured, isNewArrival, isBestseller, isOnSale
}

Unsplash photo IDs to use (perfume/luxury):
1557053, 1190298, 965989, 1557043, 1563170, 733872, 1668073,
1557927, 1557051, 1557876, 1557879, 1668074, 1345257, 262978,
1008000, 1190297, 1557040, 927022, 1616096, 825947

Image URL format: https://images.unsplash.com/photo-{ID}?w=600&q=80
Secondary image (hover): same ID with ?w=600&q=80&sat=-100 (desaturated effect)

30 sample products:
1.  Shaghaf Oud Aswad — Swiss Arabian, Attar & Oud, unisex, AED 420 / AED 390 sale
2.  Rose Oud — Ajmal, Attar & Oud, women, AED 280
3.  Amber Woods Intense — Rasasi, Premium Signature, men, AED 199 / AED 159 sale
4.  Oud Mood — Lattafa, Niche, men, AED 159
5.  Rose Elixir — Armaf, Inspired Collections, women, AED 129 / AED 99 sale
6.  Bakhoor Oud Al Layl — Ajmal, Bakhoor, unisex, AED 185
7.  Shumukh — Swiss Arabian, Premium Signature, unisex, AED 650
8.  Majd Al Sultan — Rasasi, Attar & Oud, men, AED 299
9.  Ana Abiyedh Rouge — Lattafa, Inspired Collections, women, AED 89
10. Club de Nuit Intense — Armaf, Premium Signature, men, AED 149 / AED 119 sale
11. Haneen — Ajmal, Niche, women, AED 349
12. Oud & Rose — Swiss Arabian, Attar & Oud, women, AED 390
13. Warda Al Hanane — Rasasi, Niche, women, AED 210
14. Musk Al Tahara — Lattafa, Attar & Oud, unisex, AED 75
15. Tres Nuit — Armaf, Inspired Collections, men, AED 109
16. Oud Bouquet — Ajmal, Gift Sets, unisex, AED 520
17. Black Oud — Swiss Arabian, Attar & Oud, men, AED 480
18. Floral Breeze — Rasasi, Premium Signature, women, AED 189
19. Riwayat El Oud — Rasasi, Attar & Oud, unisex, AED 340
20. Opulent Shaik — Armaf, Niche, men, AED 599
21. Night Dreams — Lattafa, Inspired Collections, women, AED 99
22. Jannet El Firdaus — Swiss Arabian, Attar & Oud, unisex, AED 65
23. Ajmal Cedarwood — Ajmal, Premium Signature, men, AED 229
24. Amber Citrus — Rasasi, Niche, unisex, AED 245
25. Velvet Rose — Armaf, Premium Signature, women, AED 179 / AED 149 sale
26. Oud Mubakhar — Lattafa, Bakhoor, unisex, AED 195
27. Cloud 9 — Armaf, Inspired Collections, unisex, AED 139
28. Khaltat Night — Lattafa, Attar & Oud, men, AED 299 / AED 249 sale
29. Dehn El Oud — Swiss Arabian, Attar & Oud, unisex, AED 750
30. Miris Discovery Set — Ajmal, Gift Sets, unisex, AED 420

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANIMATIONS & MICRO-INTERACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Use Framer Motion for all animations. Follow luxury e-commerce feel (smooth, never jarring):

Page transitions:
  - Route changes: fade in (opacity 0→1, 0.3s)

Scroll-triggered animations (use Framer Motion whileInView):
  - Section headings: fade up (y: 30→0, opacity 0→1)
  - Product cards: stagger fade-up (each card 0.05s delay after previous)
  - Editorial sections: slide in from appropriate direction

Interactive micro-animations:
  - Cart icon: bounce scale (1→1.2→1) when item is added
  - Wishlist heart: fill animation (stroke to fill, red color)
  - "Add to Cart" button: brief loading spinner → checkmark → back to normal
  - Product card hover: image crossfade (300ms) + "Quick Add" slides up (200ms)
  - Header logo: smooth scale-down on scroll
  - Banner carousel: slide with opacity fade on edges

Toast notifications (shadcn Sonner):
  - Bottom-right position
  - "✓ Added to cart" — dark bg with gold accent
  - "♥ Added to wishlist" — dark bg
  - "✓ Coupon applied! You saved AED 42" — green tint
  - "✗ Invalid coupon code" — red tint
  - All: 3s duration, slide-in from right

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL BEHAVIORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Cart: Redux Persist → localStorage key "amoria_cart"
- Wishlist: Redux Persist → localStorage key "amoria_wishlist"
- Recently Viewed: last 6 products → localStorage "amoria_recent"
- Guest cart: works without login, persists in localStorage
- Currency: always AED, 2 decimal places, "AED" prefix
- VAT: 5%, shown as line item in cart/checkout
- Free shipping threshold: AED 200
- Scroll to top FAB (bottom-right, appears after 400px scroll, smooth scroll back)
- 404 page: branded, with search input + suggested categories
- Error boundary: global + per-section (fallback to skeleton)
- Loading skeletons: all product grids show skeleton cards while "loading"
  (use setTimeout 800ms to simulate loading for demo purposes)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESPONSIVE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mobile-first. Breakpoints: sm(640) md(768) lg(1024) xl(1280)
- Header: 2-row → single-row hamburger on mobile
- Hero: 100vh video → reduced to 70vh on mobile, smaller typography
- Category strip: always horizontally scrollable, snap to card
- Product grids: 2 cols mobile → 3 cols md → 4 cols lg
- PDP: stacked mobile → side-by-side lg
- Filters: bottom sheet mobile (shadcn Sheet) → left sidebar lg
- Cart/Checkout: single column mobile → two column lg
- Footer: 1 col mobile → 2 col sm → 4 col lg
- All tap targets: minimum 44×44px
- No horizontal overflow at any viewport width

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SETUP COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
npx create-next-app@latest amoria-web --typescript --tailwind --app --src-dir --import-alias "@/*"
cd amoria-web

pnpm add @reduxjs/toolkit react-redux redux-persist
pnpm add @tanstack/react-query
pnpm add react-hook-form @hookform/resolvers zod
pnpm add framer-motion
pnpm add embla-carousel-react embla-carousel-autoplay
pnpm add lucide-react
pnpm add sonner
pnpm add clsx tailwind-merge
pnpm add @radix-ui/react-slider

npx shadcn-ui@latest init
npx shadcn-ui@latest add button input badge card sheet dialog tabs select \
    separator skeleton scroll-area avatar dropdown-menu accordion toast \
    drawer radio-group checkbox label progress

pnpm dev  →  http://localhost:3000

Build & start:
pnpm build && pnpm start