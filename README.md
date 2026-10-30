# Apna Saman · اپنا سامان

A premium Shopify storefront **design and implementation kit**, with an interactive concept, a complete 224-product merchandising plan, and a cautious bulk-import example.

## Start here

- **[Open the interactive design](preview/index.html)** — self-contained, responsive HTML; open it in a browser. Illustrative merchandise, policies and prices only. Its cart is a local demo, not Shopify checkout.
- **[Store blueprint](docs/store-blueprint.md)** — sitemap, seven departments and all subcategories, brand system, homepage sequence, app shortlist and launch requirements.
- **[Import, search and filtering](docs/catalog-search-and-import.md)** — field-by-field import guide, native Shopify filtering, ratings-data requirements and accessible predictive search architecture.
- **[Download the sample CSV](data/products.sample.csv)** — 7 products / 8 variants, including two colours of one product. All products start as drafts, zero inventory, no invented image URLs.
- **[Install the Shopify components](docs/shopify-integration.md)** — editable Liquid homepage and optional header, scoped CSS, and JavaScript using Shopify's native endpoints.

The intended starting market is **Pakistan / PKR**, with English navigation and Urdu branding. This is an explicit working assumption, not an already configured Shopify market.

## What is implemented

The standalone concept demonstrates search, department navigation, product filtering, quick view and a local demo bag. Production components in `shopify/` use merchant-selected collections and real Shopify products, locale-aware search/cart routes, actual variant availability, responsive Shopify images and server-confirmed cart updates. Hero rotation is manual in the Shopify section.

The Shopify directory is **not a complete theme** and must not be uploaded as a theme ZIP. Add the components to a duplicate of an existing Online Store 2.0 theme, retain that theme's product/collection/cart/search/footer templates, and complete the integration guide. The preview and production components are separate deliverables: preview filters/local bag are demonstrations; real collection filters and the cart page come from the installed Shopify theme.

## Validation and limits

See [validation evidence](docs/validation.md) for executed checks and their limits. No Shopify Admin, real catalogue, payment service, courier, review source or live storefront is connected. No apps were installed and nothing was published. Sample pricing is not supplier pricing. A 224-product allocation is a capacity plan, not 224 uploaded products.

This package follows familiar marketplace discovery patterns—prominent search, department panels, facets and explicit product choices—combined with a quieter editorial visual style. It does not claim fresh competitor research, verified current app rankings, or measured live-store conversion results. Official documentation was not verified live; initial sandboxed requests could not connect to the configured proxy. GitHub access was subsequently verified through the supported execution permission.

Repository files were created for this store-design request after the earlier onboarding check found an empty checkout. No application source existed to preserve.
