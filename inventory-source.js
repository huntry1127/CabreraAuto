(function () {
  'use strict';
  const query = '*[_type == "vehicle" && status == "available" && !(_id in path("drafts.**"))] | order(_updatedAt desc) {"id": _id, status, year, make, model, trim, price, mileage, body, transmission, fuel, exterior, description, features, "images": photos[].asset->url}';
  function normalize(vehicles) {
    if (!Array.isArray(vehicles)) throw new Error('Invalid inventory response');
    return vehicles.filter(v => v && typeof v.id==='string' && !v.id.startsWith('drafts.') && v.status==='available' && Number.isInteger(v.year) && v.year>=1900 && typeof v.make==='string' && v.make.trim() && typeof v.model==='string' && v.model.trim()).map(v=>({
      ...v, price: typeof v.price==='number' && Number.isFinite(v.price) && v.price>=0 ? v.price : null,
      mileage: Number.isInteger(v.mileage) && v.mileage>=0 ? v.mileage : null,
      features: Array.isArray(v.features)?v.features.filter(x=>typeof x==='string').slice(0,30):[],
      images: Array.isArray(v.images)?v.images.filter(x=>typeof x==='string' && /^https:\/\/cdn\.sanity\.io\/images\//.test(x)).slice(0,20).map(x=>x+'?w=1600&fit=max&auto=format'):[]
    }));
  }
  async function load(config = window.CABRERA_INVENTORY_CONFIG || {}, fallback = window.CABRERA_INVENTORY || []) {
    if (!config.projectId) return {vehicles: fallback, source:'static'};
    if (!/^[a-z0-9]+$/.test(config.projectId) || !/^[a-z0-9_-]+$/.test(config.dataset) || !/^\d{4}-\d{2}-\d{2}$/.test(config.apiVersion)) throw new Error('Invalid inventory connection');
    const url = new URL('https://'+config.projectId+'.api.sanity.io/v'+config.apiVersion+'/data/query/'+config.dataset);
    url.searchParams.set('query',query); url.searchParams.set('perspective','published');
    const controller = new AbortController(); const timeout = setTimeout(()=>controller.abort(),15000);
    try {
      const response = await fetch(url,{signal:controller.signal,credentials:'omit',cache:'no-store'});
      if (!response.ok) throw new Error('Inventory is temporarily unavailable');
      const data = await response.json();
      return {vehicles:normalize(data.result),source:'sanity'};
    } finally {clearTimeout(timeout);}
  }
  window.CABRERA_INVENTORY_SOURCE = {load,normalize,query};
})();
