/* M&M · Supabase public client + Admin cloud sync */
(function(){
  const URL='https://keqwjhwdizqcjjsgaklo.supabase.co';
  const KEY='sb_publishable_kzn2DbSBqotoZUCdaZ0bTQ_yM-jfBoM';
  const client=window.supabase.createClient(URL, KEY);
  const PRODUCTS='mm_products_v1', QUOTES='mm_quotes_v1', CONTENT='mm_site_content_v1', BRANDS='mm_brands_v1';
  const ADMIN_EMAIL_SUFFIX='@mm-jewelry.local';

  function toEmail(value){
    const v=String(value||'').trim();
    return v.includes('@')?v:`${v}${ADMIN_EMAIL_SUFFIX}`;
  }
  function num(v){return Number(v||0)}
  function mapProductToDb(p){
    const images=Array.isArray(p.images)?p.images.slice(0,5):(p.image?[p.image]:[]);
    return {
      id:String(p.id),name:String(p.name||'Nuevo producto'),brand:String(p.brand||''),
      category:String(p.category||'Relojes'),description:String(p.description||''),
      pricing_type:p.pricing==='gold'?'gold':p.pricing==='silver'?'silver':'usd',
      usd_base:num(p.usd),gold_grams:num(p.gold),silver_grams:num(p.silver),workmanship:num(p.workmanship),
      image_url:String(p.image||images[0]||''),image_urls:images,
      variant_group:String(p.variantGroup||p.model||''),variant_color:String(p.variantColor||''),
      published:p.published!==false,featured:p.featured!==false,stock:num(p.stock),sort_order:num(p.sortOrder),
      updated_at:new Date().toISOString()
    };
  }
  function mapDbToProduct(p){
    const images=Array.isArray(p.image_urls)?p.image_urls:[];
    return {id:String(p.id),name:p.name||'Nuevo producto',brand:p.brand||'',model:p.variant_group||'',
      variantGroup:p.variant_group||'',variantColor:p.variant_color||'',category:p.category||'Relojes',
      description:p.description||'',pricing:p.pricing_type==='gold'?'gold':p.pricing_type==='silver'?'silver':'usd',
      usd:num(p.usd_base),gold:num(p.gold_grams),silver:num(p.silver_grams),workmanship:num(p.workmanship),
      image:p.image_url||images[0]||'',images:images.slice(0,5),published:p.published!==false,featured:p.featured!==false,
      stock:num(p.stock),sortOrder:num(p.sort_order)};
  }

  async function signIn(username,password){
    return client.auth.signInWithPassword({email:toEmail(username),password:String(password||'')});
  }
  async function signOut(){return client.auth.signOut()}
  async function session(){return client.auth.getSession()}

  async function loadCloud(){
    const [{data:products,error:pe},{data:quote,error:qe},{data:site,error:ce}] = await Promise.all([
      client.from('products').select('*').order('sort_order',{ascending:true}),
      client.from('internal_quotes').select('*').eq('id',1).maybeSingle(),
      client.from('site_content').select('key,value').eq('key','main').maybeSingle()
    ]);
    if(pe)throw pe; if(qe)throw qe; if(ce)throw ce;
    if(Array.isArray(products)) localStorage.setItem(PRODUCTS,JSON.stringify(products.map(mapDbToProduct)));
    if(quote) localStorage.setItem(QUOTES,JSON.stringify({usd:num(quote.usd_value),gold:num(quote.gold_value),silver:num(quote.silver_value)}));
    if(site?.value){localStorage.setItem(CONTENT,JSON.stringify(site.value)); if(site.value?.home?.brands) localStorage.setItem(BRANDS,JSON.stringify(site.value.home.brands));}
    return {products,quote,site};
  }

  async function syncProducts(products){
    const rows=(products||[]).map(mapProductToDb);
    if(rows.length){const {error}=await client.from('products').upsert(rows,{onConflict:'id'});if(error)throw error;}
    const {data:existing,error:re}=await client.from('products').select('id'); if(re)throw re;
    const wanted=new Set(rows.map(r=>r.id));
    const stale=(existing||[]).map(x=>x.id).filter(id=>!wanted.has(id));
    if(stale.length){const {error}=await client.from('products').delete().in('id',stale);if(error)throw error;}
  }
  async function syncQuotes(q){
    const {error}=await client.from('internal_quotes').upsert({id:1,usd_value:num(q?.usd),gold_value:num(q?.gold),silver_value:num(q?.silver),updated_at:new Date().toISOString()});
    if(error)throw error;
  }
  async function syncContent(content){
    const {error}=await client.from('site_content').upsert({key:'main',value:content||{},updated_at:new Date().toISOString()},{onConflict:'key'});
    if(error)throw error;
  }
  async function syncBrands(brands){
    const rows=(brands||[]).map((b,i)=>({name:String(b.name||'Nueva marca'),description:String(b.text||b.description||''),button:String(b.button||'VER MARCA'),href:String(b.href||'#marcas'),image_url:String(b.image||''),featured:b.visible!==false,active:b.visible!==false,sort_order:i}));
    if(rows.length){
      const {error}=await client.from('brands').upsert(rows,{onConflict:'id'}); // only works when IDs are supplied; fallback to content sync remains authoritative
      if(error && error.code!=='42P10') throw error;
    }
  }
  async function uploadImage(bucket,path,file){
    const {error}=await client.storage.from(bucket).upload(path,file,{upsert:true,contentType:file.type||'image/jpeg'});
    if(error)throw error;
    const {data}=client.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl||'';
  }

  window.MMDB={URL,KEY,client,toEmail,signIn,signOut,session,loadCloud,syncProducts,syncQuotes,syncContent,syncBrands,uploadImage};
})();
