/* Progressive enhancements; the server-rendered links/forms work without JS. */
(() => {
  'use strict';
  if (window.__apnaStoreLoaded) return;
  window.__apnaStoreLoaded = true;
  const cleanups = new WeakMap();
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  // Never navigate to an arbitrary origin returned by product/search data.
  const localURL = (value) => {
    const url = new URL(value, location.origin);
    if (url.origin !== location.origin) throw new Error('Invalid product URL');
    return url;
  };
  function header(root) {
    if (root.dataset.apnaInitialized) return;
    root.dataset.apnaInitialized = 'true';
    const events = new AbortController();
    const listen = (node, name, fn) => node?.addEventListener(name, fn, { signal: events.signal });
    const menus = [...root.querySelectorAll('details')];
    menus.forEach((menu) => {
      // Toggle synchronously: native toggle events are queued and can race rapid navigation.
      listen(menu.querySelector('summary'), 'click', (event) => {
        event.preventDefault();
        const open = !menu.open;
        menus.forEach((other) => { other.open = false; });
        menu.open = open;
      });
      listen(menu, 'focusout', (event) => { if (!menu.contains(event.relatedTarget)) menu.open = false; });
    });
    listen(document, 'click', (event) => { if (!root.contains(event.target)) menus.forEach((menu) => { menu.open = false; }); });
    listen(root, 'keydown', (event) => {
      if (event.key === 'Escape') menus.forEach((menu) => { if (menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
    });
    const toggle = root.querySelector('[data-apna-menu-toggle]');
    const menu = root.querySelector('[data-apna-menu]');
    listen(toggle, 'click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open)); menu.classList.toggle('is-open', open);
    });
    const search = root.querySelector('[data-apna-search]');
    const input = search.querySelector('input[type=search]');
    const list = search.querySelector('[role=listbox]');
    const status = search.querySelector('[data-apna-search-status]');
    let timer, request, generation = 0, active = -1;
    const close = () => { list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; };
    const cancel = () => { clearTimeout(timer); request?.abort(); generation++; close(); };
    const select = (next) => {
      const rows = [...list.children];
      if (!rows.length) return;
      active = (next + rows.length) % rows.length;
      rows.forEach((row, index) => row.setAttribute('aria-selected', String(index === active)));
      input.setAttribute('aria-activedescendant', rows[active].id);
      rows[active].scrollIntoView({ block: 'nearest' });
    };
    listen(input, 'compositionstart', () => cancel());
    listen(input, 'compositionend', () => input.dispatchEvent(new Event('input', { bubbles: true })));
    listen(input, 'input', (event) => {
      cancel(); status.textContent = ''; list.replaceChildren();
      if (event.isComposing) return;
      const query = input.value.trim();
      if (query.length < 2) return;
      const current = generation;
      timer = setTimeout(async () => {
        request = new AbortController();
        try {
          const url = localURL(search.dataset.predictiveUrl);
          url.search = new URLSearchParams({ q: query, 'resources[type]': 'product', 'resources[limit]': '6', 'resources[options][unavailable_products]': 'last' }).toString();
          const response = await fetch(url, { signal: request.signal, headers: { Accept: 'application/json' } });
          if (!response.ok) throw new Error('Search unavailable');
          const result = await response.json();
          if (current !== generation) return;
          const products = result.resources?.results?.products || [];
          const rows = products.map((product, index) => {
            const row = element('li'); row.id = `${list.id}-${index}`; row.setAttribute('role', 'option'); row.setAttribute('aria-selected', 'false');
            const link = element('a', '', product.title); link.href = localURL(product.url).href; link.tabIndex = -1; row.append(link); return row;
          });
          list.replaceChildren(...rows);
          list.hidden = !rows.length; input.setAttribute('aria-expanded', String(Boolean(rows.length)));
          status.textContent = rows.length ? `${rows.length} suggestions. Use the up and down arrow keys.` : 'No suggestions. Press Enter to search all products.';
        } catch (error) {
          if (error.name !== 'AbortError' && current === generation) { close(); status.textContent = 'Suggestions unavailable. Press Enter to search.'; }
        }
      }, 200);
    });
    listen(input, 'keydown', (event) => {
      if (event.key === 'Escape') { cancel(); return; }
      if (list.hidden) return;
      if (event.key === 'ArrowDown') { event.preventDefault(); select(active + 1); }
      if (event.key === 'ArrowUp') { event.preventDefault(); select(active < 0 ? list.children.length - 1 : active - 1); }
      if (event.key === 'Enter' && active >= 0) { event.preventDefault(); list.children[active].querySelector('a').click(); }
    });
    listen(search, 'focusout', (event) => { if (!search.contains(event.relatedTarget)) cancel(); });
    // Keep a mouse click on an option from being swallowed by input focusout.
    listen(list, 'mousedown', (event) => event.preventDefault());
    listen(document, 'click', (event) => { if (!search.contains(event.target)) cancel(); });
    cleanups.set(root, () => { cancel(); events.abort(); delete root.dataset.apnaInitialized; });
  }
  function home(root) {
    if (root.dataset.apnaInitialized) return;
    root.dataset.apnaInitialized = 'true';
    root.querySelectorAll('[data-apna-quick-view]').forEach((button) => { button.hidden = false; });
    const events = new AbortController();
    const listen = (node, name, fn) => node?.addEventListener(name, fn, { signal: events.signal });
    const slides = [...root.querySelectorAll('[data-apna-slide]')];
    let slide = 0;
    function changeSlide(delta) {
      slide = (slide + delta + slides.length) % slides.length;
      slides.forEach((node, index) => { node.hidden = index !== slide; });
      root.querySelector('[data-apna-slide-status]').textContent = `${slide + 1} / ${slides.length}`;
    }
    listen(root.querySelector('[data-apna-prev]'), 'click', () => changeSlide(-1));
    listen(root.querySelector('[data-apna-next]'), 'click', () => changeSlide(1));
    // Manual rotation avoids interrupting reading or unexpectedly moving focus.
    const dialog = root.querySelector('[data-apna-dialog]');
    const content = dialog.querySelector('[data-apna-quick-content]');
    const feedback = dialog.querySelector('[data-apna-feedback]');
    let opener, request, generation = 0;
    const format = (amount) => new Intl.NumberFormat(root.dataset.locale || 'en-PK', { style: 'currency', currency: root.dataset.currency || 'PKR' }).format(amount / 100);
    listen(root, 'click', async (event) => {
      const trigger = event.target.closest('[data-apna-quick-view]');
      if (!trigger || !root.contains(trigger)) return;
      opener = trigger; request?.abort(); request = new AbortController(); const current = ++generation;
      content.replaceChildren(element('p', '', 'Loading product…')); feedback.textContent = '';
      if (!dialog.open) dialog.showModal();
      try {
        const url = localURL(trigger.dataset.productUrl); url.pathname = url.pathname.replace(/\/$/, '') + '.js';
        const response = await fetch(url, { signal: request.signal, headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Unable to load this product.');
        const product = await response.json();
        if (current !== generation || !dialog.open) return;
        if (product.requires_selling_plan || product.tags?.includes('product-page-only')) {
          const title = element('h2', '', product.title); title.id = `ApnaQuickTitle-${root.dataset.sectionId}`;
          const message = element('p', '', 'Choose this product’s full options on its product page.');
          const link = element('a', 'apna-button', 'View product options →'); link.href = localURL(trigger.dataset.productUrl).href;
          content.replaceChildren(title, message, link); return;
        }
        const layout = element('div', 'apna-quick-layout');
        const image = element('img'); image.alt = product.title; image.width = 500; image.height = 500;
        if (product.featured_image) image.src = product.featured_image;
        else image.hidden = true;
        const info = element('div');
        const heading = element('h2', '', product.title); heading.id = `ApnaQuickTitle-${root.dataset.sectionId}`;
        const price = element('p', 'apna-price');
        const label = element('label', '', 'Choose your option'); const select = element('select'); select.id = `ApnaVariant-${root.dataset.sectionId}`; label.htmlFor = select.id;
        for (const variant of product.variants) {
          const option = element('option', '', `${variant.title}${variant.available ? '' : ' — sold out'}`); option.value = variant.id; select.append(option);
        }
        select.value = (product.variants.find((variant) => variant.available) || product.variants[0]).id;
        const add = element('button', 'apna-button', 'Add to bag'); add.type = 'button';
        const details = element('a', '', 'View full product details →'); details.href = localURL(product.url || trigger.dataset.productUrl).href;
        const selectedVariant = () => product.variants.find((variant) => String(variant.id) === select.value);
        const refresh = () => {
          const variant = selectedVariant(); price.textContent = format(variant.price); add.disabled = !variant.available; add.textContent = variant.available ? 'Add to bag' : 'Sold out';
          const variantImage = variant.featured_image?.src || product.featured_image;
          if (variantImage) { image.src = variantImage; image.hidden = false; }
        };
        select.addEventListener('change', () => { feedback.textContent = ''; refresh(); }); refresh();
        add.addEventListener('click', async () => {
          const variant = selectedVariant(); add.disabled = true; select.disabled = true; add.textContent = 'Adding…'; feedback.textContent = '';
          try {
            const result = await fetch(localURL(root.dataset.cartAddUrl + '.js'), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items: [{ id: variant.id, quantity: 1 }] }) });
            const body = await result.json();
            if (!result.ok) throw new Error(body.description || 'Unable to add this item. Please try again.');
            feedback.textContent = 'Added to your bag.'; const link = element('a', '', 'View bag →'); link.href = root.dataset.cartUrl; feedback.append(link);
            document.dispatchEvent(new CustomEvent('apna:cart-added', { detail: body }));
            // Update our count from authoritative cart state, never a client-side estimate.
            try {
              const cartResponse = await fetch(localURL(root.dataset.cartUrl + '.js'), { headers: { Accept: 'application/json' } });
              if (cartResponse.ok) { const cart = await cartResponse.json(); document.querySelectorAll('[data-apna-cart-count]').forEach((node) => { node.textContent = cart.item_count; }); }
            } catch { /* Bag page remains authoritative if count refresh fails. */ }
          } catch (error) { feedback.textContent = error.message || 'Unable to add this item.'; }
          finally { select.disabled = false; refresh(); }
        });
        info.append(heading, price, label, select, add, details); layout.append(image, info); content.replaceChildren(layout);
      } catch (error) {
        if (error.name !== 'AbortError' && current === generation) {
          const message = element('p', '', 'Quick view is unavailable.');
          const link = element('a', '', 'Open product details →'); link.href = localURL(trigger.dataset.productUrl).href; content.replaceChildren(message, link);
        }
      }
    });
    listen(dialog.querySelector('[data-apna-close]'), 'click', () => dialog.close());
    listen(dialog, 'close', () => { generation++; request?.abort(); if (opener?.isConnected) opener.focus(); });
    cleanups.set(root, () => { generation++; request?.abort(); events.abort(); if (dialog.open) dialog.close(); delete root.dataset.apnaInitialized; });
  }
  function init(scope = document) {
    const roots = scope.matches?.('[data-apna-home], [data-apna-header]') ? [scope] : [];
    roots.push(...scope.querySelectorAll('[data-apna-home], [data-apna-header]'));
    roots.forEach((node) => node.matches('[data-apna-header]') ? header(node) : home(node));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init(), { once: true });
  else init();
  document.addEventListener('shopify:section:load', (event) => init(event.target));
  document.addEventListener('shopify:section:unload', (event) => event.target.querySelectorAll('[data-apna-home], [data-apna-header]').forEach((node) => cleanups.get(node)?.()));
})();
