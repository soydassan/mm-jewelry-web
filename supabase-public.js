/* M&M · Public cloud bootstrap
   Hydrates the browser cache from Supabase so the public site works across devices.
*/
(function(){
  'use strict';
  const URL='https://keqwjhwdizqcjjsgaklo.supabase.co';
  const KEY='sb_publishable_kzn2DbSBqotoZUCdaZ0bTQ_yM-jfBoM';
  const PRODUCTS='mm_products_v1', QUOTES='mm_quotes_v1', CONTENT='mm_site_content_v1';
  const SESSION_FLAG='mm_supabase_public_hydrated_v1';

  const safeJSON=(v,f)=>{try{return JSON.parse(v)}catch(e){return f}};
  const num=v=>Number(v||0);
  const mapProduct=p=>({
    id:String(p.id),
    name:p.name||'Nuevo producto',
    brand:p.brand||'',
    model:p.variant_group||'',
    variantGroup:p.variant_group||'',
    variantColor:p.variant_color||'',
    category:p.category||'Relojes',
    description:p.description||'',
    pricing:p.pricing_type==='gold'?'gold':p.pricing_type==='silver'?'silver':'usd',
    usd:num(p.usd_base),
    gold:num(p.gold_grams),
    silver:num(p.silver_grams),
    workmanship:num(p.workmanship),
    image:p.image_url||'',
    images:Array.isArray(p.image_urls)?p.image_urls:[],
    published:p.published!==false,
    featured:p.featured!==false,
    stock:num(p.stock),
    sortOrder:num(p.sort_order)
  });

  async function getJSON(path){
    const r=await fetch(URL+path,{headers:{apikey:KEY,Authorization:'Bearer '+KEY}});
    if(!r.ok) throw new Error('HTTP '+r.status+' '+path);
    return r.json();
  }

  function stable(v){
    try{return JSON.stringify(v)}catch(e){return ''}
  }

  async function hydrate(){
    try{
      const [products,quotes,site] = await Promise.all([
        getJSON('/rest/v1/products?select=*&order=sort_order.asc'),
        getJSON('/rest/v1/internal_quotes?select=*&id=eq.1&limit=1'),
        getJSON('/rest/v1/site_content?select=key,value&key=eq.main&limit=1')
      ]);

      const mapped=Array.isArray(products)?products.map(mapProduct):[];
      const nextProducts=stable(mapped);
      const oldProducts=localStorage.getItem(PRODUCTS)||'';
      localStorage.setItem(PRODUCTS,nextProducts);

      if(Array.isArray(quotes)&&quotes[0]){
        localStorage.setItem(QUOTES,stable({
          usd:num(quotes[0].usd_value),
          gold:num(quotes[0].gold_value),
          silver:num(quotes[0].silver_value)
        }));
      }
      if(Array.isArray(site)&&site[0]?.value){
        localStorage.setItem(CONTENT,stable(site[0].value));
      }

      const changed=oldProducts!==nextProducts || !sessionStorage.getItem(SESSION_FLAG);
      if(changed){
        sessionStorage.setItem(SESSION_FLAG,'1');
        location.reload();
        return;
      }
      sessionStorage.removeItem(SESSION_FLAG);
      window.dispatchEvent(new CustomEvent('mm:supabase-ready'));
    }catch(e){
      console.warn('M&M: no se pudo cargar Supabase. Se usa la copia local.',e);
      sessionStorage.removeItem(SESSION_FLAG);
      window.dispatchEvent(new CustomEvent('mm:supabase-error',{detail:e}));
    }
  }

  hydrate();
})();
