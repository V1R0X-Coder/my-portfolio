(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const menu = {
    'big-byte': { name: 'The Big Byte', price: 4500 },
    'sunny-bowl': { name: 'Sunny Bowl', price: 5200 },
    'golden-bites': { name: 'Golden Bites', price: 2000 },
    'mini-doughnuts': { name: 'Mini Doughnuts', price: 1800 },
    'iced-cocoa': { name: 'Iced Cocoa', price: 2500 },
    'citrus-fizz': { name: 'Citrus Fizz', price: 2200 }
  };
  const cart = new Map();
  const money = n => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
  const drawer = $('#cart-drawer'), backdrop = $('#drawer-backdrop');
  function total() { return [...cart].reduce((sum, [id, qty]) => sum + menu[id].price * qty, 0); }
  function renderCart() {
    const count = [...cart.values()].reduce((a, b) => a + b, 0);
    $('#cart-count').textContent = count;
    $('#cart-total').textContent = money(total());
    const items = $('#cart-items');
    if (!cart.size) { items.innerHTML = '<p class="cart-empty">Your basket is empty. Add something tasty.</p>'; return; }
    items.replaceChildren(...[...cart].map(([id, qty]) => {
      const row = document.createElement('div'); row.className = 'cart-row';
      const info = document.createElement('div');
      const name = document.createElement('strong'); name.textContent = menu[id].name;
      const price = document.createElement('small'); price.textContent = `${money(menu[id].price)} each · ${money(menu[id].price * qty)}`;
      info.append(name, price);
      const controls = document.createElement('div'); controls.className = 'quantity';
      const minus = document.createElement('button'); minus.textContent = '−'; minus.setAttribute('aria-label', `Remove one ${menu[id].name}`); minus.addEventListener('click', () => changeQty(id, -1));
      const number = document.createElement('b'); number.textContent = qty;
      const plus = document.createElement('button'); plus.textContent = '+'; plus.setAttribute('aria-label', `Add one ${menu[id].name}`); plus.addEventListener('click', () => changeQty(id, 1));
      controls.append(minus, number, plus); row.append(info, controls); return row;
    }));
  }
  function changeQty(id, delta) { const next = (cart.get(id) || 0) + delta; if (next <= 0) cart.delete(id); else cart.set(id, next); renderCart(); }
  function openCart() { drawer.classList.add('open'); backdrop.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
  function closeCart() { drawer.classList.remove('open'); backdrop.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
  let toastTimer;
  function toast(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200); }
  $$('[data-add]').forEach(button => button.addEventListener('click', () => { changeQty(button.dataset.add, 1); toast(`${menu[button.dataset.add].name} added to basket`); }));
  $('#cart-trigger').addEventListener('click', openCart); $('#close-cart').addEventListener('click', closeCart); backdrop.addEventListener('click', closeCart);
  $('#visit-order').addEventListener('click', openCart);
  $('#checkout-button').addEventListener('click', () => {
    if (!cart.size) { toast('Add an item before viewing your order.'); return; }
    const summary = $('#order-summary');
    const lines = [...cart].map(([id, qty]) => `<div class="summary-line"><span>${qty} × ${menu[id].name}</span><b>${money(menu[id].price * qty)}</b></div>`).join('');
    summary.innerHTML = `${lines}<div class="summary-total"><span>TOTAL</span><strong>${money(total())}</strong></div>`;
    closeCart(); $('#order-dialog').showModal();
  });
  $('#close-order').addEventListener('click', () => $('#order-dialog').close());
  $('#copy-order').addEventListener('click', async () => {
    const text = ['BYTEBITE SAMPLE ORDER', ...[...cart].map(([id, qty]) => `${qty} x ${menu[id].name} — ${money(menu[id].price * qty)}`), `TOTAL — ${money(total())}`, 'Demo only — not a real order.'].join('\n');
    try { await navigator.clipboard.writeText(text); toast('Order summary copied.'); }
    catch { toast('Copy is unavailable in this browser.'); }
  });
  const filters = $$('.filters button'); let active = 'all';
  function filterMenu() {
    const query = $('#menu-search').value.trim().toLowerCase(); let shown = 0;
    $$('.menu-card').forEach(card => { const ok = (active === 'all' || card.dataset.category === active) && (!query || `${card.dataset.name} ${card.textContent}`.toLowerCase().includes(query)); card.hidden = !ok; if (ok) shown++; });
    $('#empty-state').hidden = shown > 0;
  }
  filters.forEach(button => button.addEventListener('click', () => { active = button.dataset.filter; filters.forEach(b => { const on = b === button; b.classList.toggle('active', on); b.setAttribute('aria-pressed', String(on)); }); filterMenu(); }));
  $('#menu-search').addEventListener('input', filterMenu);
  const menuToggle = $('#menu-toggle'), nav = $('#site-nav');
  menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); });
  $$('nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeCart(); });
  renderCart();
})();
