/* Local browser smoke checks of the production enhancement script.
 * Uses a representative DOM fixture and mocked localized Shopify Ajax endpoints.
 * This does not render Liquid or contact a Shopify store.
 * Run: node qa/shopify-components.cjs
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const repository = path.resolve(__dirname, '..');
const scriptPath = path.join(repository, 'shopify/assets/apna-store.js');
const fixture = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Apna Saman component fixture</title></head><body>
<header data-apna-header>
  <div data-apna-search data-predictive-url="/ur/search/suggest.json">
    <form action="/ur/search" method="get"><label for="search">Search products</label><input id="search" type="search" name="q" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="search-results"><button type="submit">Search</button></form>
    <ul id="search-results" role="listbox" hidden></ul><span data-apna-search-status role="status"></span>
  </div>
  <a href="/ur/cart">Bag <span data-apna-cart-count>2</span></a>
  <button data-apna-menu-toggle aria-expanded="false" aria-controls="menu">Browse departments</button>
  <ul id="menu" data-apna-menu><li><details id="electronics"><summary>Electronics</summary><a href="/ur/collections/electronics">All electronics</a></details></li><li><details id="home"><summary>Home</summary><a href="/ur/collections/home">All home</a></details></li></ul>
</header>
<main data-apna-home data-section-id="fixture" data-cart-add-url="/ur/cart/add" data-cart-url="/ur/cart" data-currency="PKR" data-locale="en-PK">
  <div><article data-apna-slide>Slide one</article><article data-apna-slide hidden>Slide two</article><article data-apna-slide hidden>Slide three</article></div>
  <button data-apna-prev>Previous</button><span data-apna-slide-status>1 / 3</span><button data-apna-next>Next</button>
  <button data-apna-quick-view data-product-url="/ur/products/earbuds" hidden>Quick view earbuds</button>
  <dialog data-apna-dialog aria-labelledby="ApnaQuickTitle-fixture"><button data-apna-close>Close quick view</button><div data-apna-quick-content></div><p data-apna-feedback role="status"></p></dialog>
</main><button id="outside">Outside fixture</button>
</body></html>`;

const product = {
  id: 1, title: 'Everyday Earbuds', url: '/ur/products/earbuds', featured_image: null,
  variants: [
    { id: 101, title: 'Black', price: 199000, available: false },
    { id: 202, title: 'Navy', price: 249000, available: true },
    { id: 303, title: 'White', price: 349000, available: true }
  ]
};
const failures = [];
let checks = 0;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function setup(browser) {
  const page = await browser.newPage();
  const evidence = { adds: [], searches: [], paths: [], errors: [], failNextAdd: false };
  page.on('pageerror', error => evidence.errors.push(error.message));
  await page.route('http://apna.test/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    evidence.paths.push(url.pathname);
    const json = async (body, status = 200) => {
      try { await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) }); }
      catch (error) { if (!/Target closed|has been closed|disposed|Invalid InterceptionId/.test(error.message)) throw error; }
    };
    if (request.isNavigationRequest()) return route.fulfill({ status: 200, contentType: 'text/html', body: fixture });
    if (url.pathname === '/ur/search/suggest.json') {
      const query = url.searchParams.get('q'); evidence.searches.push(query);
      if (query === 'slow') await wait(350);
      const names = query === 'unsafe' ? ['<img src=x onerror="alert(1)">'] : [`${query} one`, `${query} two`, `${query} three`];
      return json({ resources: { results: { products: names.map((title, index) => ({ title, url: `/ur/products/${encodeURIComponent(query)}-${index}` })) } } });
    }
    if (url.pathname === '/ur/products/earbuds.js') return json(evidence.product || product);
    if (url.pathname === '/ur/cart/add.js' && request.method() === 'POST') {
      evidence.adds.push(request.postDataJSON());
      if (evidence.failNextAdd) { evidence.failNextAdd = false; return json({ status: 422, description: 'Only one item remains. Please reduce the quantity.' }, 422); }
      return json({ items: [{ id: evidence.adds.at(-1).items[0].id, quantity: 1 }] });
    }
    if (url.pathname === '/ur/cart.js') return json({ item_count: 9 });
    return route.fulfill({ status: 404, body: 'Unexpected mocked route' });
  });
  await page.goto('http://apna.test/');
  await page.addScriptTag({ path: scriptPath });
  await page.evaluate(() => {
    document.addEventListener('click', event => {
      const option = event.target.closest('[role="option"] a');
      if (option) { event.preventDefault(); window.chosenSearchURL = option.getAttribute('href'); }
    });
  });
  return { page, evidence };
}

async function check(browser, name, run) {
  checks++;
  const { page, evidence } = await setup(browser);
  try {
    await run(page, evidence);
    assert.deepEqual(evidence.errors, [], 'Unexpected JavaScript exception');
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push({ name, message: error.message });
    console.error(`FAIL ${name}: ${error.message}`);
  } finally { await page.close(); }
}

async function results(page, query = 'lamp') {
  await page.locator('#search').fill(query);
  await page.locator('[role="option"]').first().waitFor();
}

async function quickView(page) {
  await page.locator('[data-apna-quick-view]').click();
  await page.locator('[data-apna-dialog] select').waitFor();
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  try {
    await check(browser, 'predictive search localized endpoint and keyboard selection', async (page, evidence) => {
      await results(page);
      assert.equal(await page.locator('#search').getAttribute('aria-expanded'), 'true');
      await page.locator('#search').press('ArrowDown');
      assert.equal(await page.locator('#search').getAttribute('aria-activedescendant'), 'search-results-0');
      await page.locator('#search').press('ArrowDown');
      assert.equal(await page.locator('#search').getAttribute('aria-activedescendant'), 'search-results-1');
      await page.locator('#search').press('ArrowUp');
      await page.locator('#search').press('Enter');
      assert.equal(await page.evaluate(() => window.chosenSearchURL), 'http://apna.test/ur/products/lamp-0');
      assert.deepEqual(evidence.searches, ['lamp']);
    });

    await check(browser, 'initial ArrowUp selects the last search suggestion', async page => {
      await results(page);
      await page.locator('#search').press('ArrowUp');
      assert.equal(await page.locator('#search').getAttribute('aria-activedescendant'), 'search-results-2');
    });

    await check(browser, 'Escape cancels pending search and stale responses stay closed', async (page, evidence) => {
      const incoming = page.waitForRequest(request => request.url().includes('/ur/search/suggest.json?q=slow'));
      await page.locator('#search').fill('slow'); await incoming;
      await page.locator('#search').press('Escape');
      await page.waitForTimeout(450);
      assert.equal(await page.locator('#search').getAttribute('aria-expanded'), 'false');
      assert.equal(await page.locator('[role="listbox"]').isHidden(), true);
      assert.deepEqual(evidence.searches, ['slow']);
    });

    await check(browser, 'clearing an inflight search and typing anew rejects the old response', async page => {
      const incoming = page.waitForRequest(request => request.url().includes('/ur/search/suggest.json?q=slow'));
      await page.locator('#search').fill('slow'); await incoming;
      await page.locator('#search').fill('');
      await results(page, 'new'); await page.waitForTimeout(400);
      assert.match(await page.locator('[role="listbox"]').textContent(), /new one/);
      assert.doesNotMatch(await page.locator('[role="listbox"]').textContent(), /slow/);
    });

    await check(browser, 'predictive response titles render as text', async page => {
      await results(page, 'unsafe');
      assert.equal(await page.locator('[role="listbox"] img').count(), 0);
      assert.match(await page.locator('[role="option"]').textContent(), /<img src=x/);
    });

    await check(browser, 'quick view selects availability, updates price, sends variant and refreshes authoritative cart', async (page, evidence) => {
      await quickView(page);
      const select = page.locator('[data-apna-dialog] select');
      assert.equal(await select.inputValue(), '202', 'First available variant should be selected');
      const before = await page.locator('[data-apna-dialog] .apna-price').textContent();
      await select.selectOption('303');
      const after = await page.locator('[data-apna-dialog] .apna-price').textContent();
      assert.notEqual(before, after, 'Variant change must update displayed price');
      assert.equal(Number(after.replace(/[^0-9.]/g, '')), 3490);
      await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('[data-apna-cart-count]').textContent === '9');
      assert.deepEqual(evidence.adds, [{ items: [{ id: 303, quantity: 1 }] }]);
      assert.match(await page.locator('[data-apna-feedback]').textContent(), /Added to your bag/);
      assert.ok(evidence.paths.includes('/ur/cart/add.js') && evidence.paths.includes('/ur/cart.js'));
      await select.selectOption('101');
      assert.equal(await page.getByRole('button', { name: 'Sold out', exact: true }).isDisabled(), true);
    });

    await check(browser, 'cart 422 description is visible and retry remains enabled', async (page, evidence) => {
      evidence.failNextAdd = true; await quickView(page);
      await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('[data-apna-feedback]').textContent.includes('Only one item remains'));
      assert.equal(await page.getByRole('button', { name: 'Add to bag', exact: true }).isEnabled(), true);
      assert.equal(await page.locator('[data-apna-cart-count]').textContent(), '2');
    });

    await check(browser, 'selling-plan and product-page-only products direct customers to full product options', async (page, evidence) => {
      for (const overrides of [{ requires_selling_plan: true }, { tags: ['product-page-only'] }]) {
        evidence.product = { ...product, ...overrides };
        await page.locator('[data-apna-quick-view]').click();
        await page.getByRole('link', { name: 'View product options →' }).waitFor();
        assert.equal(await page.locator('[data-apna-dialog] select').count(), 0);
        assert.equal(await page.getByRole('button', { name: 'Add to bag', exact: true }).count(), 0);
        assert.equal(await page.getByRole('link', { name: 'View product options →' }).getAttribute('href'), 'http://apna.test/ur/products/earbuds');
        await page.locator('[data-apna-close]').click();
      }
      assert.deepEqual(evidence.adds, []);
    });

    await check(browser, 'dialog Escape closes and restores the quick-view trigger focus', async page => {
      await quickView(page); await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('[data-apna-dialog]').open);
      assert.equal(await page.locator('[data-apna-quick-view]').evaluate(node => node === document.activeElement), true);
    });

    await check(browser, 'hero previous/next wraps exactly one visible slide', async page => {
      await page.locator('[data-apna-next]').click();
      assert.equal(await page.locator('[data-apna-slide-status]').textContent(), '2 / 3');
      assert.equal(await page.locator('[data-apna-slide]:visible').count(), 1);
      await page.locator('[data-apna-prev]').click(); await page.locator('[data-apna-prev]').click();
      assert.equal(await page.locator('[data-apna-slide-status]').textContent(), '3 / 3');
      assert.equal(await page.locator('[data-apna-slide]:visible').textContent(), 'Slide three');
    });

    await check(browser, 'mega-menu rapid keyboard switching, exclusive disclosure and Escape focus', async page => {
      await page.locator('#electronics summary').focus(); await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.querySelector('#electronics').open);
      await page.locator('#home summary').focus(); await page.keyboard.press('Enter');
      await page.waitForFunction(() => document.querySelector('#home').open && !document.querySelector('#electronics').open);
      for (const id of ['electronics', 'home', 'electronics', 'home']) {
        await page.locator(`#${id} summary`).focus(); await page.keyboard.press('Enter');
        assert.deepEqual(await page.locator('details[open]').evaluateAll(nodes => nodes.map(node => node.id)), [id]);
      }
      await page.locator('#home a').focus(); await page.keyboard.press('Escape');
      assert.equal(await page.locator('#home').evaluate(node => node.open), false);
      assert.equal(await page.locator('#home summary').evaluate(node => node === document.activeElement), true);
    });

    await check(browser, 'mobile menu button toggles with keyboard and exposes expanded state', async page => {
      const button = page.locator('[data-apna-menu-toggle]');
      await button.focus(); await page.keyboard.press('Enter');
      assert.equal(await button.getAttribute('aria-expanded'), 'true');
      assert.match(await page.locator('[data-apna-menu]').getAttribute('class'), /is-open/);
      await page.keyboard.press('Space');
      assert.equal(await button.getAttribute('aria-expanded'), 'false');
    });
  } finally { await browser.close(); }

  checks++;
  try {
    const folder = path.join(repository, 'shopify/sections');
    const sections = fs.readdirSync(folder).filter(name => name.endsWith('.liquid'));
    for (const name of sections) {
      const source = fs.readFileSync(path.join(folder, name), 'utf8');
      const match = source.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
      assert.ok(match, `${name} has a schema block`);
      const schema = JSON.parse(match[1]);
      assert.ok(schema.name && Array.isArray(schema.settings), `${name} schema shape`);
      const settings = schema.settings.map(setting => setting.id).filter(Boolean);
      assert.equal(settings.length, new Set(settings).size, `${name} unique setting ids`);
      for (const block of schema.blocks || []) {
        const ids = block.settings.map(setting => setting.id).filter(Boolean);
        assert.equal(ids.length, new Set(ids).size, `${name}/${block.type} unique setting ids`);
      }
    }
    console.log(`PASS section schema JSON (${sections.length} sections)`);
  } catch (error) { failures.push({ name: 'section schema JSON', message: error.message }); console.error(`FAIL section schema JSON: ${error.message}`); }
  console.log(`${checks - failures.length}/${checks} checks passed. Shopify API calls were mocked; Liquid was not rendered in Shopify.`);
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
