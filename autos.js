(function () {
  'use strict';
  function filterInventory(vehicles, filters) {
    const query = String(filters.query || '').trim().toLowerCase();
    const max = filters.budget === '' ? Infinity : Number(filters.budget);
    const list = vehicles.filter(v => {
      const search = [v.year, v.make, v.model, v.trim].filter(Boolean).join(' ').toLowerCase();
      return (!query || search.includes(query)) && (!filters.body || v.body === filters.body) && (max === Infinity || (Number.isFinite(v.price) && v.price <= max));
    });
    const price = v => Number.isFinite(v.price) ? v.price : Infinity;
    list.sort((a,b) => {
      if (filters.sort === 'price-low') return price(a) - price(b);
      if (filters.sort === 'price-high') return (Number.isFinite(b.price) ? b.price : -Infinity) - (Number.isFinite(a.price) ? a.price : -Infinity);
      if (filters.sort === 'mileage') return (Number.isFinite(a.mileage) ? a.mileage : Infinity) - (Number.isFinite(b.mileage) ? b.mileage : Infinity);
      return Number(b.year) - Number(a.year);
    });
    return list;
  }
  window.CABRERA_FILTER_INVENTORY = filterInventory;
  const grid = document.querySelector('#vehicle-grid');
  if (!grid) return;
  let inventory = [];
  const filters = document.querySelector('#inventory-filters');
  const body = document.querySelector('#vehicle-body');
  const search = document.querySelector('#vehicle-search');
  const budget = document.querySelector('#vehicle-budget');
  const sort = document.querySelector('#vehicle-sort');
  const dialog = document.querySelector('#vehicle-dialog');
  const money = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 });
  const priceLabel = v => Number.isFinite(v.price) ? money.format(v.price) : 'Call for price';
  const title = v => [v.year, v.make, v.model].join(' ');
  const safeImages = v => (v.images || []).filter(url => typeof url === 'string' && (/^assets\/[a-zA-Z0-9_./-]+$/.test(url) || /^https:\/\//.test(url)));
  function el(tag, text, className) { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; }
  function showVehicle(v) {
    const target = document.querySelector('#vehicle-detail-content'); target.replaceChildren();
    const images = safeImages(v);
    if (images.length) {
      const hero = el('img', undefined, 'vehicle-detail-photo'); hero.src = images[0]; hero.alt = title(v); target.append(hero);
      if (images.length > 1) {
        const thumbs = el('div', undefined, 'vehicle-thumbnails');
        images.forEach((url, index) => { const btn = el('button'); btn.type = 'button'; btn.setAttribute('aria-label', 'View photo ' + (index + 1)); const image = el('img'); image.src = url; image.alt = ''; btn.append(image); btn.addEventListener('click', () => { hero.src = url; }); thumbs.append(btn); });
        target.append(thumbs);
      }
    }
    const heading = el('h2', title(v)); heading.id = 'vehicle-dialog-title'; target.append(heading);
    if (v.trim) target.append(el('p', v.trim, 'scope-note'));
    target.append(el('p', priceLabel(v), 'vehicle-price'));
    const specs = el('dl', undefined, 'vehicle-specs');
    for (const [name,value] of [['Mileage',Number.isFinite(v.mileage) ? v.mileage.toLocaleString() + ' miles' : null],['Body',v.body],['Transmission',v.transmission],['Fuel',v.fuel],['Exterior',v.exterior]]) {
      if (value) { const row=el('div'); row.append(el('dt',name),el('dd',value)); specs.append(row); }
    }
    target.append(specs);
    if (v.description) target.append(el('p',v.description));
    if (Array.isArray(v.features) && v.features.length) { const list=el('ul',undefined,'vehicle-features');v.features.forEach(f=>list.append(el('li',String(f))));target.append(el('h3','Features'),list); }
    target.append(el('p','Confirm vehicle availability, condition, history, and all applicable taxes and fees directly with the shop.','vehicle-terms'));
    const call=el('a','Ask about this vehicle · (773) 413-7713 →','button red');call.href='tel:+17734137713';target.append(call);
    dialog.showModal();document.body.classList.add('dialog-open');
  }
  function card(v) {
    const article=el('article',undefined,'vehicle-card');const images=safeImages(v);
    if(images.length){const image=el('img',undefined,'vehicle-photo');image.src=images[0];image.alt=title(v);image.loading='lazy';article.append(image);}
    else article.append(el('div','Photos coming soon','vehicle-photo vehicle-photo-empty'));
    const content=el('div',undefined,'vehicle-card-content');content.append(el('h3',title(v)));if(v.trim)content.append(el('p',v.trim,'vehicle-trim'));
    content.append(el('p',priceLabel(v),'vehicle-price'));const meta=[];if(Number.isFinite(v.mileage))meta.push(v.mileage.toLocaleString()+' miles');if(v.body)meta.push(v.body);content.append(el('p',meta.join(' · '),'vehicle-meta'));
    const button=el('button','View vehicle details →','button outline-dark');button.type='button';button.addEventListener('click',()=>showVehicle(v));content.append(button);article.append(content);return article;
  }
  function render() {
    const results=filterInventory(inventory,{query:search.value,body:body.value,budget:budget.value,sort:sort.value});grid.replaceChildren(...results.map(card));
    document.querySelector('#inventory-count').textContent = results.length + ' vehicle' + (results.length===1?'':'s') + (inventory.length && results.length !== inventory.length ? ' matching your filters':' listed');
    document.querySelector('#inventory-empty').hidden=inventory.length>0;
    document.querySelector('#inventory-no-matches').hidden=inventory.length===0||results.length>0;
  }

  filters.addEventListener('submit',event=>event.preventDefault());[search,body,budget,sort].forEach(input=>input.addEventListener('input',render));
  document.querySelector('#reset-filters').addEventListener('click',()=>{filters.reset();render();search.focus();});
  document.querySelector('.vehicle-dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
  async function refreshInventory() {
    const state = document.querySelector('#inventory-load-state');
    const retry = document.querySelector('#inventory-retry');
    state.hidden=false; state.textContent='Loading current vehicles…'; retry.hidden=true;
    document.querySelector('#inventory-empty').hidden=true;
    document.querySelector('#inventory-no-matches').hidden=true;
    document.querySelector('#inventory-count').textContent='Checking availability…';
    filters.hidden=true; grid.replaceChildren();
    try {
      const result = await window.CABRERA_INVENTORY_SOURCE.load();
      inventory = result.vehicles.filter(v => v && v.id && v.year && v.make && v.model);
      body.replaceChildren(el('option','All body types')); body.options[0].value='';
      [...new Set(inventory.map(v=>v.body).filter(Boolean))].sort().forEach(value=>{const option=el('option',value);option.value=value;body.append(option);});
      filters.hidden=!inventory.length; state.hidden=true; render();
      const requestedId = new URLSearchParams(window.location.search).get('vehicle');
      const requestedVehicle = inventory.find(v => v.id === requestedId);
      if (requestedVehicle) showVehicle(requestedVehicle);
    } catch (error) {
      inventory=[]; document.querySelector('#inventory-count').textContent='Listings unavailable';
      state.textContent='We couldn’t load current listings. Try again or call the shop for availability.';
      retry.hidden=false;
    }
  }
  document.querySelector('#inventory-retry').addEventListener('click',refreshInventory);
  refreshInventory();
})();
