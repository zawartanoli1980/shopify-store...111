# Apna Saman — catalogue, search and import playbook

Working market: Pakistan. Working store currency: PKR. Confirm both in Shopify before loading real prices. The CSV contains illustrative products and prices, zero stock, no image URLs and no published items. It is an import template, not a supplier catalogue or permission to sell a branded product.

## What is included

[`../data/products.sample.csv`](../data/products.sample.csv) contains **7 unique products and 8 variant rows** across electronics, home, fashion, beauty, travel and fitness. The earbuds demonstrate two colour variants sharing one handle. Everything is `draft` and `Published` is `FALSE`; inventory is zero to avoid creating sellable sample stock.

The template uses Shopify's established product CSV format. Shopify changes import labels and features over time, so **export one draft product from the destination store and compare its headers before the first bulk import**. The Shopify documentation links below could not be fetched in this environment because initial sandboxed requests could not connect to the configured proxy; current admin behaviour and current documentation have not been independently verified here.

## Product CSV field map

| CSV header | What to put in it | Rules for Apna Saman |
| --- | --- | --- |
| `Handle` | Stable ASCII product slug | `everyday-wireless-earbuds`; identical on all variants of one product. Do not change it casually after launch. |
| `Title` | Customer-facing product name | Specific and readable; no keyword stuffing or unsupported benefit claims. |
| `Body (HTML)` | Product description and specifications | This is Shopify's established description header. **Do not substitute `Description/HTML` without checking the store's exported format.** Use simple HTML paragraphs and lists. |
| `Vendor` | Actual brand or supplier | Sample: `Apna Saman`. Replace if this is not the actual vendor. |
| `Product Category` | Shopify Standard Product Taxonomy value | Intentionally blank in the sample. Select the accurate current category in Shopify, export it, then reuse its accepted taxonomy value. A menu department is not a taxonomy value. |
| `Type` | Merchant-defined product type | One consistent value such as `Wireless Earbuds`; useful for collections and filters. |
| `Tags` | Comma-separated merchandising attributes | Controlled tags such as `department:electronics`, `wireless-earbuds`, `edit:everyday`. CSV quotes preserve embedded commas. |
| `Published` | Online Store publication indicator | Sample `FALSE`. Keep false for staging and confirm sales-channel publication separately in admin. |
| `Option1 Name`, `Option1 Value` | First variant dimension | Earbuds: `Color` / `Navy` or `White`. Single-variant products: `Title` / `Default Title`. |
| `Option2 Name`, `Option2 Value` | Optional second dimension | Leave both blank when unused. For size and colour products, keep option ordering consistent. |
| `Variant SKU` | Unique inventory identifier | Never reuse a SKU for different variants. Example: `AS-EL-EAR-001-NV`. |
| `Variant Grams` | Shipping weight in grams | Integer only. Sample weights are illustrative and need supplier confirmation. |
| `Variant Inventory Tracker` | Inventory tracking service | `shopify` in the sample. Use the fulfilment provider's supported configuration when applicable. |
| `Variant Inventory Qty` | Inventory quantity | Sample `0`. Product CSV quantity behaviour depends on location setup; use Shopify's inventory CSV workflow for multiple locations. |
| `Variant Inventory Policy` | Whether to sell without stock | `deny` in the sample. Do not enable overselling without an approved fulfilment process. |
| `Variant Fulfillment Service` | Fulfilment service | `manual` for the sample. Real services must match store configuration. |
| `Variant Price` | Selling price in store currency | Decimal, no currency symbol or thousands separator. `4990.00` means PKR 4,990 only when PKR is the configured store currency. |
| `Variant Compare At Price` | Genuine previous/list price | Blank in sample. Use only substantiated pricing; never invent a discount anchor. |
| `Variant Requires Shipping` | Physical delivery flag | `TRUE` for these physical samples. |
| `Variant Taxable` | Whether tax rules apply | Sample `TRUE` is a placeholder, not tax advice. Confirm the actual product tax treatment and store registration. |
| `Image Src` | Public HTTPS image URL | Blank until you supply licensed product photography at stable public URLs. Shopify must be able to download each URL without login or an expiring token. |
| `Image Position`, `Image Alt Text` | Ordering and accessible description | Fill only when attaching images. Describe the product and view naturally. |
| `Status` | Product lifecycle status | `draft` for staging. Publish only after validation. |

Example data, expressed for review:

| Handle | Variant | SKU | Example PKR price | Stock | Status |
| --- | --- | --- | ---: | ---: | --- |
| `everyday-wireless-earbuds` | Navy | `AS-EL-EAR-001-NV` | 4,990 | 0 | Draft |
| `everyday-wireless-earbuds` | White | `AS-EL-EAR-001-WH` | 4,990 | 0 | Draft |
| `modular-kitchen-organizer` | Default | `AS-HK-ORG-001` | 2,490 | 0 | Draft |
| `essential-cotton-t-shirt` | Navy / M | `AS-FA-TEE-001-NV-M` | 1,890 | 0 | Draft |

### Building the full 200+ product file

1. Keep a master spreadsheet with one row per sellable variant, stable handles, unique SKUs, approved prices, verified stock, real dimensions and tax decisions. Product count is the count of unique handles; row count includes variants and images.
2. Keep a controlled vocabulary for `Type`, colours, sizes and tags. `Navy`, `navy blue` and `Blue - Navy` must not become three accidental facet values.
3. Use the seven-department structure in the [store blueprint](store-blueprint.md). Products have one merchandising home, while tags can place them in several curated edits without duplicating the product itself.
4. Use **automated collections** driven by tags or product type. Standard Shopify product CSV has no universal `Collections` assignment column. Configure collections and their rules in Shopify; do not add an invented field to the import.
5. Keep product-level title, description, vendor, type and tags on the first row for each handle. Repeat the handle for continuation variant rows; put that variant's options, SKU, weight and price on its own row. The supplied earbuds show this pattern.
6. To add another product image, add a row with the same handle, the real `Image Src`, its `Image Position` and `Image Alt Text`; leave variant fields empty on image-only rows. Do not create an accidental extra default variant. For variant-specific imagery, export a configured draft product and follow its `Variant Image` pattern.
7. Save UTF-8 CSV, retain exact headers and proper CSV quoting. Validate in a staging store or import a small draft batch first. Do not enable overwrite-by-handle unless intentionally updating reviewed existing records; exports are the recovery reference, not a complete Shopify backup.
8. Inspect the import preview and actual result: unique product count, variant count, prices, images, descriptions, taxonomy, tax, stock locations and collection membership. Download and resolve the importer error report before expanding to the remaining products.
9. Attach real reviews through the review provider's supported import process, with permission and accurate verification labels. CSV sample products do not create customer reviews, order history or a ratings average.
10. Approve a real test order, shipping coverage, COD rules, cancellation/return rules and refund handling before publishing. Remove sample products and demo claims from the live catalogue.

## Multi-attribute filtering

Use **Shopify Search & Discovery** with an Online Store 2.0 theme supporting Shopify storefront filters. Use one filtering engine for a collection; do not install overlapping filter apps. At this catalogue size, native filters are a sensible starting point; evaluate a paid search suite only when measured search quality, merchandising or review facets justify it.

| Customer control | Shopify implementation | Customer-facing behaviour |
| --- | --- | --- |
| Department / category | Department collection navigation plus product type; enable a taxonomy category filter where supported and populated | Clear department links and a relevant subcategory/type facet within the current collection. |
| Price | Native price range | Display PKR; an Apply button avoids reloading on every keystroke. Preserve other selected facets. |
| Availability | Native availability | `In stock` only reflects tracked sellable inventory under the configured inventory policy. |
| Customer rating | Verified review-app facet, or an eligible supported product metafield populated from real reviews | Offer meaningful `4 stars & up`, `3 stars & up`, and `Unrated` options only when accurate data exists. |
| Tags / use case | Native tag filter where available, or a dedicated supported metafield | Expose useful labels such as `Travel`, `Small spaces`, `Under PKR 2,000`; hide internal operations tags. |
| Variant attributes | Native option filters | Sizes and colours only in departments where they are meaningful. |
| Sorting | Shopify sort options | Relevant default, price ascending/descending, newest and best selling when justified by real sales. |

**Rating integration needs a deliberate data model.** An app's visible star widget does not automatically make its reviews filterable by Shopify. Confirm that provider writes a supported product metafield and that the installed Search & Discovery version offers it as a filter. Do not assume a raw `rating` metafield is directly filterable. One possible supported string-list design is `custom.rating_thresholds`: a product rated 4.6 receives `4 stars & up`, `3 stars & up`, `2 stars & up`, `1 star & up`; a 3.6 product receives the last three; a product with no reviews receives `Unrated`. Populate and update it from authenticated real review aggregates, not manual fabricated scores. Confirm the metafield type is eligible in the destination store before implementing; otherwise use the review/search provider's documented facet integration.

Render controls from `collection.filters` or `search.filters` in Liquid. Use the actual `param_name`, each value's `value`, `count`, `active`, `url_to_add` and `url_to_remove`; use the range objects' own parameter names. This avoids guessing taxonomy or metafield parameter names. Common native URL examples are:

```text
/collections/electronics-gadgets?filter.v.availability=1
/collections/home-kitchen?filter.v.price.gte=1000&filter.v.price.lte=5000
/collections/all?filter.p.product_type=Wireless%20Earbuds
```

Use the generated URL for tag and rating filters in the target store. Keep checked filters, sort and search terms in the URL, so Back, refresh and shared links reproduce the view. Reset pagination when changing a filter. `Clear all` preserves the current collection; clearing search-page filters preserves the query. Render the number of real matched products, disable zero-count inactive options and keep selected zero-count options removable.

Desktop: 240–280px facet rail, sticky within its own available height. Mobile: `Filter & sort` opens a focus-managed drawer with selected-count chips, a visible results count and Apply/Reset actions. AJAX enhancement should update the results grid, count, facets and pagination together via Shopify's Section Rendering API; a full-page GET form is the fallback. Announce result counts with a polite live region and retain focus on the control used. Empty states should offer one-click filter removal, not recommend nonexistent stock.

## Live search blueprint

### Search UX

- Put a large labelled search field in the main header. Placeholder: “Search products, categories and everyday finds”. Keep the search button available on touch devices.
- Empty state: curated category shortcuts; “recent searches” only if stored with an explicit clear action and compatible privacy settings. Do not label curated terms as popular without search data.
- After 2 characters, show up to 6 matching products plus useful query/category suggestions. Product items show an actual image, title, formatted presentment price and truthful availability. Prefer available products; provide `View all results` even if suggestions are empty.
- Group suggestions clearly and keep their display order stable within a response. Query matches may be visually emphasised through safe text nodes; never inject an unsanitized highlighted HTML string.
- Loading: a restrained progress indicator. Failure: “Search suggestions are unavailable. Press Enter to search.” The ordinary search form must keep working.

### Shopify request and response flow

Native predictive search does not require a browser API secret. Use a locale-aware store route rather than a hardcoded domain:

```javascript
const root = window.Shopify?.routes?.root || '/';
const params = new URLSearchParams({
  q: input.value.trim(),
  'resources[type]': 'query,product,collection',
  'resources[limit]': '6',
  'resources[options][unavailable_products]': 'last'
});
const url = `${root}search/suggest.json?${params}`;
// fetch(url, { signal, headers: { Accept: 'application/json' } });
```

The client implementation should:

1. Keep the HTML `<form action="{{ routes.search_url }}" method="get">` with `name="q"` as the reliable baseline. Native search works when JavaScript or predictive search fails.
2. Debounce input for about 200ms. Abort the prior request and increment a generation counter **on every new input**, including clearing/shortening the input. Apply a response only if its generation and normalized query still match the current input; abort alone does not prevent every stale render.
3. Request only the bounded suggestion payload. Check `response.ok`, enforce the expected JSON structure, and ignore aborted fetch errors. Never render response text as instructions or execute it.
4. Prefer server-rendered Liquid suggestion markup through a predictive-search section when accurate locale-aware price formatting is needed. Otherwise verify the JSON price representation, currency and presentment context before applying `Intl.NumberFormat`; never assume a universal minor-unit scale.
5. Build title/query nodes using `textContent`. Restrict destination URLs to storefront same-origin paths or explicitly permitted shop domains. Use trusted Shopify product image URLs, size them for the small card and provide appropriate alt text.
6. Implement a labelled combobox with `aria-autocomplete="list"`, `aria-expanded`, `aria-controls`, a stable results listbox, and an active-option relationship. Up/Down chooses an option; Enter activates the selection or submits the form; Escape closes; Tab leaves naturally. Avoid nested interactive controls inside listbox options. Keep the independent `View all results` link outside the listbox.
7. Close on an outside interaction without discarding the query. Announce suggestion counts through a polite status region without reading every keystroke. On composition/IME input, wait for composition to complete before issuing the request.
8. Cache a small number of query results for a short session period if useful; include language and currency context in the key. Do not cache across consent changes or persist personal queries unnecessarily.

Search suggestions are a navigation aid, not a replacement for the full search results page. Configure synonyms deliberately (`earbuds` / `wireless earphones`, `organiser` / `organizer`) and inspect zero-result queries after launch. Use English and Urdu product naming consistently; verify predictive-search language support and tokenisation in the actual configured Shopify market before promising equivalent Urdu search quality.

## Verification before launch

| Check | Expected result |
| --- | --- |
| CSV parsing | Every row matches the header width; exactly 7 unique handles / 8 sample variant rows; no duplicate SKU. |
| Import preview | All products are drafts; the earbuds have two variants; no malformed image or taxonomy values. |
| Search typing race | Typing a long query, clearing it, then entering another never shows the earlier response. |
| Search keyboard | Suggestions work with arrows, Enter and Escape; full form search remains available; focus never becomes trapped. |
| Search failure | A failed request shows a calm fallback and Enter still searches. |
| Filter persistence | Combining price + stock + type preserves all three; Back/refresh restores the same state. |
| Rating honesty | No ratings appear without authentic source reviews; each threshold matches the true aggregate. |
| Mobile filtering | Drawer focus returns to its trigger; Apply updates results and count; reset restores the collection. |
| Inventory | Draft sample stock is not sellable; a real test product follows the configured location and overselling policy. |
| Accessibility | Labels, result announcements, visible focus, touch targets and reduced motion work on keyboard and screen reader. |

## Authoritative references to confirm in the destination store

- [Shopify product CSV format](https://help.shopify.com/en/manual/products/import-export/using-csv)
- [Importing products](https://help.shopify.com/en/manual/products/import-export/import-products)
- [Inventory CSV workflow](https://help.shopify.com/en/manual/products/inventory/getting-started-with-inventory/inventory-csv)
- [Shopify Search & Discovery filters](https://help.shopify.com/en/manual/online-store/search-and-discovery/filters)
- [Predictive Search Ajax API](https://shopify.dev/docs/api/ajax/reference/predictive-search)
- [Theme storefront filtering](https://shopify.dev/docs/storefronts/themes/navigation-search/filtering/storefront-filtering)
- [Section Rendering API](https://shopify.dev/docs/api/ajax/section-rendering)

These are implementation references, not evidence of a successful Shopify Admin import or a connected live store. The CSV has been checked locally; the import and store behaviour require the configured destination Shopify store.
