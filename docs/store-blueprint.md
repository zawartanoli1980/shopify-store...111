# Apna Saman — اپنا سامان

**Brand promise:** Everyday finds. Thoughtfully chosen.

Apna Saman should feel like a well-edited department store: useful products, clear information, and generous space. Borrow the category depth and search convenience of large marketplaces while giving every product a consistent, restrained presentation.

Working market assumptions are **Pakistan, PKR, English-first navigation, and Urdu branding**. Confirm the selling country, legal business details, payment gateway, shipping zones, and fulfillment operation before launch. This document is a proposed architecture, not evidence that a live Shopify store or its services have been configured.

## 1. A complete sitemap

```text
Home /
├── Shop all /collections/all
├── Electronics & Gadgets /collections/electronics-gadgets
├── Home & Kitchen /collections/home-kitchen
├── Fashion & Accessories /collections/fashion-accessories
├── Beauty & Personal Care /collections/beauty-personal-care
├── Fitness & Outdoors /collections/fitness-outdoors
├── Kids & Play /collections/kids-play
├── Everyday & Travel /collections/everyday-travel
├── Discover & Deals [separate utility navigation group]
│   ├── New arrivals /collections/new-arrivals
│   ├── Best sellers /collections/best-sellers
│   ├── Trending now /collections/trending-now
│   └── Current offers /collections/current-offers
├── Product details /products/{product-handle}
├── Search /search?q={query}
├── Cart /cart
├── Shopify checkout [platform-managed]
├── Customer account [Shopify customer-account URL]
├── Help /pages/help
│   ├── Contact /pages/contact
│   ├── Delivery information /pages/delivery
│   ├── Payment & COD /pages/payment-options
│   ├── Returns & exchanges /pages/returns-exchanges
│   ├── Track an order /pages/track-order
│   ├── FAQs /pages/faq
│   └── Product care & size guide /pages/product-guides
├── About Apna Saman /pages/about
├── Journal /blogs/journal [optional after core launch]
└── Legal
    ├── Privacy /policies/privacy-policy
    ├── Refund policy /policies/refund-policy
    ├── Shipping policy /policies/shipping-policy
    └── Terms /policies/terms-of-service
```

Create help pages only when their information is complete. The tracking page must use an authenticated order lookup or the selected tracking app; never expose orders through a guessable public query. Customer account and checkout links should use Shopify's generated routes rather than assumed fixed paths. Generate the XML sitemap through Shopify at `/sitemap.xml`.

## 2. Seven-parent mega menu and 224-product catalog plan

The following allocation is a **merchandising capacity plan**. It does not invent 224 real products. Count distinct product handles; sizes and colors are variants, not extra products. Each product has one primary department. Give each stocked variant its own SKU; a 224-product catalog can therefore have more than 224 SKUs. Deal collections can contain products from any department without adding to the total. Keep Discover & Deals in utility navigation, separate from the seven product departments.

| Parent department | Primary product count | Child collections and target counts |
| --- | ---: | --- |
| Electronics & Gadgets | 36 | Smartwatches 9; Wireless Earbuds 9; Phone Accessories 9; Mini Appliances 9 |
| Home & Kitchen | 44 | Storage & Organization 11; Kitchen Tools 11; Lighting & Decor 11; Cookware 11 |
| Fashion & Accessories | 40 | Menswear 10; Women's Collection 10; Footwear 10; Bags & Wallets 10 |
| Beauty & Personal Care | 32 | Skincare 8; Hair Accessories 8; Grooming Kits 8; Cosmetics 8 |
| Fitness & Outdoors | 24 | Fitness Equipment 8; Sports Accessories 8; Outdoor Essentials 8 |
| Kids & Play | 24 | Learning & Creativity 8; Toys & Games 8; Kids Accessories 8 |
| Everyday & Travel | 24 | Travel Gear 8; Stationery 8; Everyday Essentials 8 |
| **Unique catalog total** | **224** | **Seven product departments** |

Discover & Deals is an additional cross-catalog utility hub containing New Arrivals, Best Sellers, Trending Now, and Current Offers; it adds **zero** unique products to the allocation.

Use the following complete navigation tree. Parent links open department landing pages; each panel also offers “View all.”

```text
Electronics & Gadgets
├── Smartwatches                  /collections/smartwatches
├── Wireless Earbuds              /collections/wireless-earbuds
├── Phone Accessories             /collections/phone-accessories
└── Mini Appliances               /collections/mini-appliances

Home & Kitchen
├── Storage & Organization        /collections/storage-organization
├── Kitchen Tools                 /collections/kitchen-tools
├── Lighting & Decor              /collections/lighting-decor
└── Cookware                      /collections/cookware

Fashion & Accessories
├── Menswear                      /collections/menswear
├── Women's Collection            /collections/womens-collection
├── Footwear                      /collections/footwear
└── Bags & Wallets                /collections/bags-wallets

Beauty & Personal Care
├── Skincare                      /collections/skincare
├── Hair Accessories              /collections/hair-accessories
├── Grooming Kits                 /collections/grooming-kits
└── Cosmetics                     /collections/cosmetics

Fitness & Outdoors
├── Fitness Equipment             /collections/fitness-equipment
├── Sports Accessories            /collections/sports-accessories
└── Outdoor Essentials            /collections/outdoor-essentials

Kids & Play
├── Learning & Creativity         /collections/learning-creativity
├── Toys & Games                  /collections/toys-games
└── Kids Accessories              /collections/kids-accessories

Everyday & Travel
├── Travel Gear                   /collections/travel-gear
├── Stationery                    /collections/stationery
└── Everyday Essentials           /collections/everyday-essentials

Discover & Deals [utility link, outside the seven-department row]
├── New Arrivals                  /collections/new-arrivals
├── Best Sellers                  /collections/best-sellers
├── Trending Now                  /collections/trending-now
└── Current Offers                /collections/current-offers
```

### Menu behavior

- **Desktop:** A navy utility row, white masthead with a large search field, and compact department navigation. Each department button opens a panel with child links and one editorial image. Use a button for opening and a separate “View department” link. Open by click, keyboard, or intentional hover; Escape closes and restores focus. Close when focus leaves the panel.
- **Mobile:** A single menu button opens a full-height drawer. Departments expand as accordions; account, order tracking, help, and language selection remain easy to find. Trap focus while open, return focus on close, and prevent background scrolling. Do not force horizontal swiping through seven departments.
- **Search visibility:** Keep search in the first mobile screen. Collapse supporting utility links before reducing the input to an icon.
- **Editorial restraint:** One promotion per open panel. No flashing deal banners, fake scarcity, or discount clutter.

In Shopify Admin, build a three-level navigation menu supported by the chosen Online Store 2.0 theme. Create actual collections first, then select their Shopify objects as menu destinations. Avoid entering links to nonexistent collection handles.

## 3. Visual identity and design system

| Token | Value | Purpose |
| --- | --- | --- |
| Ink | `#102435` | Main text, masthead details, footer |
| Navy | `#102435` | Hero panels and strong brand areas |
| Warm ivory | `#F8F7F3` | Page background and soft section separation |
| Paper | `#FFFFFF` | Product cards and form controls |
| Amber | `#EDB94E` | Primary CTA background with dark ink text |
| Emerald | `#087F5B` | Availability and restrained positive accents |
| Muted text | `#52636A` | Secondary descriptions on light backgrounds |
| Line | `#DCDED6` | Card, field, and section borders |
| Error | `#A92D32` | Inline form errors with explicit text |

Use deep ink text on amber; reserve emerald text for light backgrounds. Test the actual combination in every component for WCAG AA contrast. Never indicate status by color alone.

Use a system sans-serif stack initially for speed, or a licensed, self-hosted Latin family such as Inter after measuring its cost. Use a suitable Urdu font such as Noto Nastaliq Urdu only where needed, with a generous line height and subsetted WOFF2 files. Mark Urdu text `lang="ur" dir="rtl"`; keep currency and SKU strings directionally isolated. A fully Urdu storefront requires translated content, RTL layout testing, and localized search terms, not only a mirrored logo.

- **Container:** Maximum 1,440px, centered; 24–40px desktop gutters and 16px mobile gutters.
- **Spacing:** 4, 8, 12, 16, 24, 32, 48, 72, and 96px. Let spacing establish hierarchy before adding decoration.
- **Type:** Fluid display around 36–68px, section titles 24–36px, body 16–18px, product titles at least 15px. Avoid all-caps paragraphs.
- **Shape:** 12–20px card radii, 8–12px controls, subtle borders, and soft shadows only for overlays or selected cards.
- **Photography:** Consistent 4:5 product images, neutral backdrops, true product colors, and tight editorial crops. Reserve lifestyle photography for the hero and category stories. Do not use unrelated stock imagery as the product being sold.
- **Motion:** 150–240ms for menus and dialogs. Honor `prefers-reduced-motion`. Keep hover effects subtle and available on keyboard focus.

### Liquid, CSS, and Tailwind implementation

Build on an established Shopify Online Store 2.0 theme, such as Dawn, or a carefully reviewed premium theme. Implement reusable sections and product snippets rather than a single rigid page. Use `section.settings` and schema blocks for merchant-editable headings, images, CTAs, collections, and policy labels.

Scope component CSS under an Apna Saman class or a section ID; define shared design tokens with CSS custom properties. Use Shopify's `image_url` and `image_tag` with responsive widths and meaningful `alt` text. Render prices with Shopify money filters and the active currency. Use `routes` for search, cart, and predictive-search endpoints, and `shopify_attributes` on editable blocks.

For quick add, use Shopify's product form or locale-aware Ajax Cart API. Require variant selection when a product has multiple options. If a product has selling plans, required properties, or personalization, send the customer to its product page unless the quick-view implementation fully supports those requirements. Availability must come from the selected variant. Update the cart count only after Shopify confirms the addition and announce the result to assistive technology.

**Tailwind is optional.** If the team prefers it, compile a minimal static stylesheet during development and scan Liquid, JSON, and JavaScript files. Map the palette and spacing tokens into the build configuration; use explicit complete class names in Liquid so extraction is reliable. Do not load the Tailwind browser/CDN runtime in production or add a second utility framework on top of an already heavy theme. A well-scoped CSS implementation is sufficient.

## 4. Homepage section sequence

| Order | Section | Content and interaction |
| ---: | --- | --- |
| 1 | Utility announcement | One accurate operational message, or “Everyday finds. Thoughtfully chosen.” until shipping terms are confirmed. Link the message to its policy. |
| 2 | Masthead and menu | English/Urdu wordmark, prominent search, account, cart quantity, and seven department controls. |
| 3 | Editorial hero carousel | Up to three manually controlled slides: “Small upgrades. Better everyday.”; “A more considered home.”; “Good finds, on the go.” One primary CTA per slide. Use real collection photography and descriptive links. |
| 4 | Shop by department | Seven image tiles, each showing its department and one short category cue. Use a balanced grid with one larger editorial tile; avoid multiple tiny icon rows. |
| 5 | Trending finds | Eight products from an explicitly curated collection, four columns desktop and two mobile. Show quick view, price, availability, and verified ratings only when present. |
| 6 | Shop the edit | A wide home/lifestyle editorial feature with a collection CTA. Add a useful shopping story instead of another generic sale banner. |
| 7 | New and noteworthy | Four to eight recently released products. Newness labels should expire according to a defined merchandising rule. |
| 8 | Service commitments | Three truthful policy cards: delivery information, payment options, and returns support. Upgrade to “Free shipping,” “Cash on delivery,” or an exact returns window only when operationally confirmed. |
| 9 | Customer voices | Genuine reviews with permission and an app-backed source. Manual previous/next controls and no intrusive autoplay. Hide the section until authentic reviews exist; do not publish sample quotes or fake counts. |
| 10 | Email signup | One concise benefit with explicit marketing consent, error/success states, and privacy link. No unpromised discount. |
| 11 | Footer | Brand statement, department links, help, legal policies, real contact details, supported payment methods, and language/country controls only when configured. |

The first hero image should be eager-loaded and sized to avoid layout shift. Lazy-load later slides and below-fold imagery. Keep the heading, copy, and CTA in HTML rather than baking them into an image. Disable carousel auto-rotation by default; manual slide buttons must expose the selected slide to screen readers.

### Product card and product page

A card includes a consistent product image, concise title, current price, optional genuine compare-at price, authentic review count, and a clear action. Calculate discounts from real variant prices; do not combine the cheapest variant with another variant's discount. Use “Choose options” when required. Keep the whole card usable without a hover gesture.

The product page needs a responsive image gallery, clear variant selectors, stock-aware price and CTA, delivery guidance, accurate material/specification data, care instructions, return eligibility, and real reviews. Include a sticky mobile purchase control only after the main purchase button scrolls out of view; it must show the current selected variant and respect safe-area insets. Place the size guide beside size selection. Related products should reflect category or use rather than simply repeat the same bestseller list.

Do not claim “limited stock,” show visitor counters, use endless countdown timers, or label a review “verified purchase” without supporting order evidence.

## 5. Search and filtering blueprint

### Live predictive search

1. Keep a standard GET search form pointing at Shopify's search route so search works without JavaScript.
2. After approximately 200ms of typing and at least two characters, call Shopify Predictive Search using the theme's locale-aware route. Request a small selection of products, collections, and query suggestions; return title, image, price, availability, and product URL.
3. Cancel stale requests with `AbortController`, maintain a request identifier, and render only the latest response. Cache a small number of recent queries within the browser session; do not send customer search text to unnecessary third parties.
4. Support arrow keys, Enter, Escape, visible focus, screen-reader status messages, and a proper combobox/listbox pattern. Keep results open only while useful; announce loading and errors without repeatedly interrupting typing.
5. A result click opens the actual item; “View all results” submits the query to the full search page. Errors fall back to ordinary search. Never inject unsanitized query strings through `innerHTML`.
6. Configure synonyms such as “earbuds / handsfree,” “organizer / storage box,” and relevant Roman Urdu alternatives only after checking the actual catalog. Inspect no-result queries weekly and improve product titles, synonyms, or merchandising accordingly.

Start with Shopify Search & Discovery and the theme's predictive search support. Consider one specialist search app only when the built-in behavior cannot meet measured catalog or search needs.

### Collection and search filters

| Attribute | Source | Customer-facing behavior |
| --- | --- | --- |
| Price | Native price filter | PKR min/max fields and a range control, with keyboard support and sensible bounds |
| Category | Native category/product type or department metafield | Show meaningful department/subcategory names and counts where available |
| Availability | Native availability | In stock / out of stock; preserve the chosen setting while sorting |
| Customer rating | Review app data or a supported synchronized metafield | “4 stars & up” only from real review data; hide this filter when data is absent |
| Tags/attributes | Structured filterable product metafields | Material, use, compatibility, size, color; expose selected customer-friendly labels rather than every internal tag |

Configure supported filters in **Search & Discovery**, then render Shopify's `collection.filters` or `search.filters`. Use each filter's generated URL/parameter values; do not invent parameter names. Apply asynchronously if the theme supports section rendering, update browser history, and preserve the current search, sort, and filter state on reload/back navigation. Include selected-filter chips, per-chip removal, “Clear all,” a meaningful result count, and an empty-state recovery action.

Shopify filter capabilities depend on data type and the selected theme. A review app's rating metafield is not automatically a working native filter. Check its supported integration; if needed, synchronize authentic rating data into a supported numeric/label metafield or use the chosen search app's rating facet. Define “4 stars & up” explicitly rather than confusing an exact rating of 4 with a minimum of 4. Do not fabricate a rating when none exists.

On mobile, use a filter drawer with a visible “Show results” action, reset control, and current selection count. Large result lists should have stable pagination or a progressively enhanced load-more control with ordinary links available. Keep collection URLs shareable.

## 6. Catalog structure and merchandising operations

- **Handle:** Stable, lowercase, hyphen-separated, unique to one product; do not change existing handles casually because product URLs depend on them.
- **Title:** Product name plus a useful distinguishing feature. Avoid keyword-stuffed titles and unsubstantiated “best” claims.
- **Vendor:** The actual supplier or brand. Use Apna Saman only for genuinely own-brand items, not as a replacement for known manufacturers.
- **Product category:** Select the closest official Shopify product-taxonomy category in Admin. A custom department label is not a substitute for the standard category path.
- **Product type:** A stable merchant-defined type such as `Kitchen Tools`.
- **Tags:** Use predictable internal tags such as `department:home-kitchen`, `kitchen-organizers`, `small-spaces`, and `edit:everyday`. Keep internal automation tags out of customer-facing labels.
- **Metafields:** Define department, material, compatibility, dimensions, care, warranty, and return eligibility where appropriate; use consistent types and units.
- **Options and SKUs:** Standardize option names such as Color and Size. Use a unique SKU for every stocked variant. Keep barcodes distinct from SKUs and never fabricate GTINs.
- **Images:** Own or license all assets. Use stable, publicly retrievable HTTPS sources when importing, then verify imported images. Avoid supplier hotlinks that expire.
- **Reviews:** Import only authentic reviews with suitable rights, source mapping, and order verification where claimed. Never seed the store with fictional social proof.

Create automated department collections using stable product types or supported metafield conditions; create child collections with more specific rules. Merchandise New Arrivals by real release/import dates and a clear expiry rule. Let Best Sellers use actual sales data. Curate Trending Now with documented criteria and remove stale selections. Current Offers must include only genuinely discounted, eligible products, with accurate start/end dates and terms.

For bulk upload, start with a CSV exported from the **actual target Shopify store** so the current supported headings and any enabled features match. The accompanying sample is a draft-product structure, not a production catalog. Test two products first, verify variants, images, prices, inventory locations, taxes, and collections, then import in controlled batches. Never overwrite existing products by handle without checking the import preview.

## 7. App recommendations and responsibility boundaries

These are established options to evaluate, not a claim about current App Store ratings, pricing, or availability. Verify recent reviews, theme compatibility, permissions, support, and plan limits in the Shopify App Store before installing. The lean default is Shopify's own discovery and localization tools, one review app, and one tracking integration only if fulfillment needs it.

| Need | Lean default | Alternative when justified | Selection rule |
| --- | --- | --- | --- |
| Predictive/AJAX search and filters | **Shopify Search & Discovery** plus theme search | **Boost AI Search & Filter** or **Fast Simon** | Choose at most one search engine; compare relevant results and mobile speed using real queries. |
| Product reviews | **Judge.me** | **Loox** when photo-review collection is a real requirement | Use one review source and widget; do not display duplicate rating systems. |
| Sticky add to cart | Implement in the theme | **qikify Sticky Add To Cart** if a maintained app is preferred | Use one sticky purchase UI and test variant, sold-out, and personalization behavior. |
| Order tracking | Shopify order-status page for basic needs | **AfterShip Order Tracking** or **Parcel Panel Order Tracking** | Confirm support for the actual Pakistan courier and status updates before buying. |
| Language | **Shopify Translate & Adapt** | A specialist translation app if requirements exceed its capabilities | Human-review Urdu translations, RTL behavior, policy content, and transactional language. |
| Country and currency | **Shopify Markets** with the actual supported gateway | A carefully assessed currency-display app | Display conversion does not guarantee checkout settlement in that currency. Confirm gateway, country, and market support; avoid implying universal multicurrency checkout. |

App installs need access to the merchant's Shopify Admin and may create subscriptions. They are recommendations here, not installed integrations. A subscription or app script should solve a demonstrated need; reevaluate unused apps monthly and remove their remaining snippets or app embeds cleanly.

## 8. Performance, accessibility, SEO, and launch gates

Aim for real-user **LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1 at the 75th percentile**. These are targets, not results already measured. Test the populated theme on ordinary Android devices and mobile connections after app embeds are enabled. Use Lighthouse or equivalent lab checks during development, then Shopify's real-user reports when traffic exists.

- Give images explicit dimensions and responsive sources. Compress photographic assets, avoid autoplay background video, and load only the first hero image eagerly.
- Keep product grids to a useful initial page size. Defer optional scripts and avoid competing carousels, popup tools, and review widgets above the fold.
- Test keyboard-only navigation, visible focus, dialog close/focus restoration, form errors, 200% zoom, reduced motion, tap targets around 44px, and Urdu text rendering. Label every icon button.
- Give every collection and product a unique title, concise meta description, and readable heading. Preserve canonical URLs and Shopify's sitemap; confirm filter/sort URLs do not create index bloat. Use valid product structured data with real prices, availability, identifiers, and review data. Avoid duplicate review markup from multiple apps.
- Verify checkout with the real supported payment methods in test mode, then a controlled live transaction when authorized. Confirm taxes, shipping rates, COD eligibility, fulfillment notifications, cancellation, refund, and return flows.
- Verify at least one single-variant and one multi-variant product; sold-out behavior; cart quantity edits; search with misspellings and no results; combined filters; mobile menu; consent capture; tracking; and all policy links.
- Confirm actual shipping thresholds, delivery windows, COD fees, return window, exclusions, customer-service hours, legal business identity, and contact channels before publishing promises.

**Launch is a separate step:** approve real catalog data and imagery, configure the selected Shopify theme and services in Admin, test the installed store, then publish. The design package alone cannot establish operational readiness or live-store performance.
