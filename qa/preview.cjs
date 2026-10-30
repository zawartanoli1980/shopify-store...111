const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const http = require('node:http');
const fs = require('node:fs');

// Run from the repository root: node qa/preview.cjs
// Requires Playwright and a local Chromium executable (or CHROMIUM_PATH).
(async () => {
  const html = fs.readFileSync(path.resolve(__dirname, '../preview/index.html'));
  const server = http.createServer((req, res) => { res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'}); res.end(html); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  let browser;
  try {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const errors = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  assert.equal(await page.locator('.product').count(), 8);
  assert.equal(await page.locator('.category').count(), 7);
  assert.equal(await page.locator('.nav details').count(), 7);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Desktop horizontal overflow');
  await page.screenshot({ path: '/tmp/apna-desktop.png', fullPage: true });

  await page.locator('.nav details').first().locator('summary').click();
  assert.equal(await page.locator('.nav details[open]').count(), 1);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.nav details[open]').count(), 0);

  await page.locator('#searchInput').fill('lamp');
  await page.waitForFunction(() => !document.getElementById('suggestions').hidden);
  assert.equal(await page.locator('.suggestion').count(), 1);
  assert.equal(await page.locator('.product').count(), 1);
  await page.locator('#searchInput').press('ArrowDown');
  assert.equal(await page.locator('.suggestion').evaluate(el => el === document.activeElement), true);
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#quickDialog').evaluate(el => el.open), true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#quickDialog').evaluate(el => el.open), false);
  await page.locator('#searchInput').fill('');
  await page.waitForFunction(() => document.querySelectorAll('.product').length === 8);

  await page.locator('#filterToggle').click();
  await page.locator('#priceFilter').selectOption('2000');
  assert.equal(await page.locator('.product').count(), 3);
  await page.locator('#departmentFilter').selectOption('Kids & Play');
  assert.equal(await page.locator('.product').count(), 0);
  await page.locator('#resetFilters').click();
  assert.equal(await page.locator('.product').count(), 8);
  await page.locator('#stockFilter').selectOption('available');
  assert.match(await page.locator('#resultStatus').textContent(), /of 11/);
  await page.locator('#ratingFilter').selectOption('4.5');
  assert.match(await page.locator('#resultStatus').textContent(), /of 8/);
  await page.locator('#stockFilter').selectOption('all');
  assert.match(await page.locator('#resultStatus').textContent(), /of 9/);
  await page.locator('#resetFilters').click();
  await page.locator('#departmentFilter').selectOption('Kids & Play');
  assert.equal(await page.locator('.product').count(), 1);
  await page.locator('#stockFilter').selectOption('available');
  assert.equal(await page.locator('.product').count(), 0);
  await page.locator('#resetFilters').click();
  await page.locator('#ratingFilter').selectOption('4.5');
  assert.match(await page.locator('#resultStatus').textContent(), /of 9 illustrative products/);
  await page.locator('#resetFilters').click();
  await page.locator('[data-tab="new"]').click();
  assert.equal(await page.locator('.product').count(), 5);
  await page.locator('[data-tab="all"]').click();
  await page.locator('#sort').selectOption('price-asc');
  assert.match(await page.locator('.product-name').first().textContent(), /Notebook/);
  await page.locator('#sort').selectOption('featured');

  await page.locator('.product-name').first().click();
  await page.locator('#quickVariant').selectOption('Midnight');
  await page.locator('#quickAdd').click();
  assert.equal(await page.locator('#cartCount').textContent(), '1');
  await page.locator('#cartButton').click();
  assert.match(await page.locator('#cartItems').textContent(), /Midnight/);
  await page.locator('[data-delta="1"]').click();
  assert.equal(await page.locator('#cartCount').textContent(), '2');
  assert.match(await page.locator('.cart-total').textContent(), /10,980/);
  await page.keyboard.press('Escape');
  await page.reload();
  assert.equal(await page.locator('#cartCount').textContent(), '2');
  await page.locator('#cartButton').click();
  await page.locator('#demoCheckout').click();
  assert.equal(await page.locator('#infoDialog').evaluate(el => el.open), true);
  assert.match(await page.locator('#infoBody').textContent(), /No payment or order has been created/);
  await page.keyboard.press('Escape');

  await page.locator('[data-slide="1"]').click();
  assert.match(await page.locator('#heroTitle').textContent(), /little detail/);
  assert.equal(await page.locator('#pauseCarousel').getAttribute('aria-label'), 'Play carousel');
  await page.locator('#pauseCarousel').click();
  assert.equal(await page.locator('#pauseCarousel').getAttribute('aria-label'), 'Pause carousel');
  await page.locator('#pauseCarousel').click();
  await page.locator('#newsletterEmail').fill('preview@example.com');
  await page.locator('#newsletterForm button').click();
  assert.equal(await page.locator('#newsletterEmail').inputValue(), '');
  assert.match(await page.locator('#toast').textContent(), /not sent or saved/);

  const mobile = await context.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.setViewportSize({ width: 390, height: 844 });
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.goto(url);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Mobile horizontal overflow');
  await mobile.screenshot({ path: '/tmp/apna-mobile.png', fullPage: true });
  await mobile.locator('#mobileMenu').click();
  assert.equal(await mobile.locator('#mobileMenu').getAttribute('aria-expanded'), 'true');
  await mobile.locator('.nav details').first().locator('summary').click();
  await mobile.locator('.nav details').first().getByText('Smartwatches', { exact: true }).click();
  assert.equal(await mobile.locator('#mobileMenu').getAttribute('aria-expanded'), 'false');
  assert.equal(await mobile.locator('#departmentFilter').inputValue(), 'Electronics & Gadgets');
  assert.equal(await mobile.locator('.product').count(), 3);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Mobile filtered horizontal overflow');
  await mobile.locator('.product-name').first().click();
  await mobile.locator('#quickAdd').click();
  await mobile.locator('#cartButton').click();
  assert.equal(await mobile.locator('#cartDialog').evaluate(el => el.open), true);
  await mobile.keyboard.press('Escape');
  assert.equal(await mobile.locator('#cartDialog').evaluate(el => el.open), false);
  assert.deepEqual(errors, [], 'Browser runtime errors');
  console.log('PASS: desktop/mobile layout, search + keyboard, filters, tabs, sorting, variants, bag quantity/persistence, checkout disclosure, carousel, newsletter, mobile navigation, Escape.');
  console.log('Screenshots: /tmp/apna-desktop.png, /tmp/apna-mobile.png');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
