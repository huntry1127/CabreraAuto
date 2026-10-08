(function () {
  'use strict';
  function selectLatest(vehicles) {
    return vehicles.filter(v => v && v.status === 'available' && typeof v.id === 'string' && !v.id.startsWith('drafts.'))
      .slice().sort((a,b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0))[0] || null;
  }
  window.CABRERA_SELECT_LATEST = selectLatest;
  const target = document.querySelector('#latest-car-card');
  if (!target) return;
  function el(tag, text, className) {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  }
  function message(heading, text) {
    const box = el('div', undefined, 'latest-car-state');
    box.append(el('h3', heading), el('p', text));
    const link = el('a', 'Call the shop →', 'text-link');
    link.href = 'tel:+17734137713'; box.append(link); target.replaceChildren(box);
  }
  async function refresh() {
    try {
      const result = await window.CABRERA_INVENTORY_SOURCE.load();
      const v = selectLatest(result.vehicles);
      if (!v) { message('Our next listing is on the way.', 'Call Cabrera to ask about cars currently available.'); return; }
      const name = [v.year, v.make, v.model].join(' ');
      const card = el('article', undefined, 'latest-car-feature');
      if (v.images && v.images.length) {
        const photo = el('img', undefined, 'latest-car-photo'); photo.src = v.images[0]; photo.alt = name; photo.loading = 'lazy';
        photo.addEventListener('error', () => photo.replaceWith(el('div', 'Photos coming soon', 'latest-car-photo latest-car-photo-empty')), {once:true});
        card.append(photo);
      } else card.append(el('div', 'Photos coming soon', 'latest-car-photo latest-car-photo-empty'));
      const content = el('div', undefined, 'latest-car-content');
      content.append(el('h3', name));
      if (v.trim) content.append(el('p', v.trim, 'vehicle-trim'));
      const price = Number.isFinite(v.price) ? new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:0}).format(v.price) : 'Call for price';
      content.append(el('p', price, 'vehicle-price'));
      const meta = [];
      if (Number.isFinite(v.mileage)) meta.push(v.mileage.toLocaleString('en-US') + ' miles');
      if (v.body) meta.push(v.body);
      if (meta.length) content.append(el('p', meta.join(' · '), 'vehicle-meta'));
      const link = el('a', 'View vehicle details →', 'button red');
      link.href = 'autos-for-sale.html?vehicle=' + encodeURIComponent(v.id); content.append(link);
      card.append(content); target.replaceChildren(card);
    } catch (error) { message('Listings are temporarily unavailable.', 'Please call the shop for current vehicle availability.'); }
  }
  refresh();
})();
