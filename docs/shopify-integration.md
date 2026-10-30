# Install the Apna Saman components

These are custom **Online Store 2.0 components**, not a self-contained Shopify theme. Work in a duplicate unpublished theme (Dawn or another maintained compatible theme). Keep the theme's working product, collection, search, cart, account, checkout and footer flows. A Shopify Admin installation and live verification remain required.

## Files and merchant controls

| Source | Theme destination | Responsibility |
| --- | --- | --- |
| `shopify/assets/apna-store.css` | `assets/apna-store.css` | Scoped brand tokens, layout, responsive styles, focus and reduced-motion treatment |
| `shopify/assets/apna-store.js` | `assets/apna-store.js` | Predictive search, manual hero controls, quick view, native cart updates, theme-editor reinitialization |
| `shopify/snippets/apna-hero-art.liquid` | `snippets/apna-hero-art.liquid` | Locally authored illustrative hero fallback; replace with licensed collection photography |
| `shopify/sections/apna-home.liquid` | `sections/apna-home.liquid` | Editable hero, seven department blocks, optional verified service benefits, featured collection, editorial panel |
| `shopify/sections/apna-header.liquid` | `sections/apna-header.liquid` | Optional English/Urdu wordmark, native search and three-level navigation |

The sections load their assets; the JS uses an initialization guard to avoid duplicate handlers. There is no Tailwind browser runtime and no third-party client API key. Fonts inherit from the existing theme. Do not include new analytics or tracking scripts just to render this design.

## Homepage installation

1. Duplicate the existing theme in Shopify Admin. Export a backup. Upload the five files into their matching folders through your theme development workflow.
2. In **Customize → Home page**, add **Apna Saman homepage**. Remove duplicate homepage sections in the duplicate theme as appropriate. Avoid duplicate H1s: the first Apna hero provides the homepage H1.
3. Configure one to three hero blocks. Set **actual collection links**: buttons are intentionally omitted until a URL is chosen. Use accurate copy and owned photography. The first hero image gets eager/high-priority loading; later images load lazily. The fallback SVG is illustration, not a real product photograph.
4. Set all seven department blocks to their real collections and upload consistent images. Adjust image crops in the theme as needed. The initial letters are editor fallbacks, not finished merchandising imagery.
5. Select a published collection for **Featured products**, then choose 4, 8 or 12 items. Unpublished or inaccessible products do not become available merely because they appear in a collection in Admin. No fictional product cards, sales figures or ratings are inserted.
6. Set the editorial link. Add optional **Verified store benefit** blocks only after confirming policy wording and linking the relevant policy. Shipping thresholds, COD locations/fees and return windows must match operations. The section has no default free-shipping or returns claim.
7. Retain the base theme's working customer newsletter form and footer. Add the review app using a theme app block, and hide it until real reviews exist. These integrations are not bundled into this section.

## Header and mega menu

Either retain the base theme's header and configure its native mega menu, or use `apna-header` in the theme's header section group. **Do not render two headers.** Replacing a section in a header group depends on the installed theme; use its editor if supported or have a theme developer replace the group's header type in the unpublished theme while preserving its settings and other sections. This kit does not modify an unknown theme's header-group JSON.

Create collections using the blueprint, then build a Shopify navigation menu containing the seven parent departments. Under each parent, add child collections, with an optional third level for curated edits or product types. Connect the menu in the Apna header settings. Put Discover & Deals in utility navigation or as a separate menu link if width permits. Do not create duplicate products to populate deals.

The custom header supports click/keyboard `<details>` mega panels, Escape-to-close, one open panel at a time, an inline mobile accordion, native search and a cart link. It intentionally uses an **inline mobile menu**, rather than claiming to provide the full-screen focus-trapped drawer described as an optional UX enhancement in the blueprint. Keep the base theme's account/localization controls if those are needed; this optional starter header does not implement those controls, sticky scrolling or country/language selectors. For translated production labels, move the literal English UI strings into the installed theme's locale files and use the `t` filter; the included Urdu wordmark is branding, not a full Urdu translation.

Native predictive search queries `routes.predictive_search_url` with six product results after a 200ms debounce. It supports cancellation, latest-response guards, arrow keys, Escape, Enter, status announcements, IME composition and ordinary-form fallback. This compact starter shows **product titles**; the richer product image/price/query/collection suggestions in the blueprint are the next enhancement, not functionality already shipped. For richer localization and money display, use Shopify-rendered predictive-search section markup rather than guessing JSON price units.

## Quick view and cart integration

- Quick view retrieves the real localized `product.url + '.js'` JSON. It displays the actual variants and their prices, chooses the first available variant, and disables adding a sold-out selection. It posts the selected variant ID and quantity to the native cart-add endpoint. This is an ordinary one-time purchase, quantity 1; quantity changes remain on the cart page.
- A product requiring a selling plan redirects customers to its full product options. Tag products **`product-page-only`** when they have required personalization, line-item properties, bundles, quantity rules or other product-page-only requirements. The card omits quick view for these products, and JS also checks the response before enabling add. Their normal product links remain available.
- Mixed subscription/one-time products can use the normal one-time purchase only when supported. Use the `product-page-only` tag for all products where the PDP must enforce special selections. Shopify's response, not the button label, determines whether adding succeeds.
- AJAX errors including unavailable stock are shown in the dialog. Product details and cart remain ordinary navigable links. Quick-view buttons stay hidden when JS is unavailable; product titles/images still link to their pages.
- The header count refreshes from actual `/cart.js` data after a confirmed add. Other theme cart drawers are not automatically updated: use the emitted **`apna:cart-added`** custom event to bridge the installed theme's documented section-rendering mechanism, or keep the provided **View bag** link as the flow. Do not pretend a generic `cart:refresh` event works in every theme.
- Displayed quick-view prices use Shopify Ajax product price units (amount divided by 100) with the current cart currency and locale. Check zero-decimal currency display, multi-market presentment and the installed theme's currency-format conventions in the target store before enabling additional currencies. Header search titles avoid this JSON-price conversion issue.
- The dialog uses native modal focus management and Escape handling, restores trigger focus on close, and cancels pending product requests. The hero never auto-advances.

## Filters and app blocks

Use the existing theme's collection/search templates and Shopify Search & Discovery for actual filtering. This kit does not replace those templates with a second incompatible filtering engine. Configure the price, availability, category/type, meaningful attributes and genuine rating data as described in the [catalogue guide](catalog-search-and-import.md). The local preview's array filters are not a 200-product production search backend.

Use real Judge.me or Loox app blocks for reviews, not fabricated star fields. Use the Shopify order-status page or a courier-compatible tracking provider. Configure Translate & Adapt and Shopify Markets only after gateway, market and language support are confirmed.

## Final verification in the duplicate theme

Run Shopify Theme Check using your authorized theme workflow. Local syntax and mocked browser tests cannot validate Shopify's Liquid renderer, schemas in Admin, app compatibility or real inventory behavior.

Verify the theme editor can add/save/reorder the section and dynamically reinitialize it. Test all configured links, localized search, no-match search, keyboard options, mobile menu, carousel controls, and zoom. Check first-image loading and below-fold lazy loading with real imagery. Test one single-variant item, one multi-variant item, sold-out selection, required properties, stock changed during purchase, cart quantity edits and multiple currencies if enabled. Verify policy links and a test order using the actual payment and delivery setup. Measure performance **after** apps and real catalogue data are present.

Only publish the duplicate theme after the real catalogue, actual policies, translations, payment, delivery, returns and customer support are approved. No live Shopify deployment or theme publication has been performed by this package.
