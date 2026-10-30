# Validation evidence

Executed on 30 October 2026 in the shared development workspace. No Shopify credentials or merchant Admin were supplied. These results establish local package behavior, not live-store readiness.

| Target | Executed result | Limit |
| --- | --- | --- |
| Production JavaScript | `node --check shopify/assets/apna-store.js` passed | Syntax only |
| Liquid section schemas | Both `{% schema %}` payloads parsed as JSON; setting IDs and section-name lengths checked | Shopify Liquid/Theme Check and Admin validation not run |
| Sample product CSV | 26 fields; 7 unique handles; 8 variant rows; unique SKUs; uniform row width; zero inventory | No Shopify import performed; destination-store export remains the authority for headers and enabled features |
| Production component browser checks | **13/13 checks passed**, Chromium/Playwright | Actual JS with a representative DOM fixture and mocked localized Shopify responses; no Liquid rendering |
| Design preview browser checks | Desktop 1440px and mobile 390px passed; zero runtime errors and horizontal overflow in the exercised flows | Local illustrative data, not a backend or real-device coverage |
| Visual review | Desktop and mobile screenshots inspected | No claim of a full WCAG audit, real-user performance or conversion uplift |

## What the 13 component checks exercise

`qa/shopify-components.cjs` loads the actual production script against controlled `/ur/` endpoint fixtures. Checks cover predictive-search debounce and keyboard interaction; initial ArrowUp; stale/cancelled responses and Escape; safe text rendering; first available variant selection; price changes; selected variant ID in the cart request; server-confirmed cart count; a 422 stock error; required selling-plan/product-page-only gating; modal Escape and focus restoration; manual hero controls; rapid menu switching and exclusive disclosure state; mobile menu controls; and section schema parsing. Some checks cover multiple behaviors.

A rapid disclosure-switching race was found during testing and fixed by making summary activation synchronous instead of relying on queued native `toggle` events. The final test passed without a settling delay.

## What the preview checks exercise

`qa/preview.cjs` verifies seven departments, menu open/close, keyboard search suggestions, price/category/availability/sample-rating controls, empty-state recovery, tabs, sorting, quick-view variants, add to demo bag, quantity/subtotal, persistence after reload, explicit no-payment checkout messaging, carousel control and pause, reduced-motion starting state, newsletter no-send messaging, and mobile navigation. It inspects desktop/mobile document widths and records browser exceptions. Screenshots were saved to `/tmp/apna-desktop.png` and `/tmp/apna-mobile.png` in this session.

## Re-run locally

Use the existing isolated checkout; no Git worktree is needed. These browser tests expect Node, Playwright and Chromium (the prepared machine has Node 24.19.0, Playwright available, and `/usr/bin/chromium`). They are development-only tools and do not ship to the storefront.

```sh
node --check shopify/assets/apna-store.js
node qa/shopify-components.cjs
node qa/preview.cjs
```

Run from the package root. The preview QA starts a temporary loopback server and closes it after testing. The production-component QA intercepts a synthetic test origin and mocks every Shopify response. The managed sandbox blocked Chromium socket setup; local browser runs succeeded using the supported escalation mechanism. Browser policy also blocked `file://` test navigation, so the QA uses HTTP or intercepted test pages. No external web preview was published.

## Outstanding production validation

- Install into a duplicate Shopify theme and run Theme Check and the real Liquid renderer.
- Configure real collections, navigation, licensed imagery, inventory, taxonomy, Search & Discovery facets and honest reviews.
- Import a small draft batch and inspect the actual importer result before scaling to 200+ products.
- Verify actual product, cart, currency/language, required customization, checkout, payment, delivery/COD, tracking and returns flows.
- Measure mobile performance and accessibility after final images and app embeds. Core Web Vitals in the blueprint are targets, not measurements.

Initial sandboxed Git/official-documentation requests could not connect to the configured proxy. During the later push request, a read-only GitHub check succeeded using the supported execution permission. The complete local design package was built without downloading dependencies. Official links and established app candidates are supplied for follow-up, but current app ratings/prices, live documentation were not verified during package creation. No app was installed, no production products were uploaded and no theme was published.
