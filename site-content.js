(function(){
  const KEY='mm_site_content_v1';
  const defaults={
    home:{
      hero:{eyebrow:'MÁS QUE RELOJES',title:'Historias\nque perduran.',text:'Las mejores marcas en relojería y joyería, con la confianza de siempre y la atención de un equipo que te acompaña.',button:'VER RELOJES',href:'catalogo.html',image:'assets/dark-rock-backdrop.jpg'},
      jewelry:{image:'assets/jewelry-editorial.jpg',label:'JOYAS',title:'Piezas que acompañan\ntus mejores historias.',button:'VER COLECCIÓN',href:'#joyas'},
      featured:{label:'RELOJERÍA',title:'Nuestros destacados',text:'Una selección de piezas que combinan diseño, precisión y elegancia.'},
      jewelryProducts:{label:'JOYERÍA',title:'Nuestras joyas',text:'Una selección de piezas pensadas para acompañar tus momentos más especiales.'},
      brands:[
        {name:'SEIKO',text:'UNA PASIÓN QUE\nAVANZA CON EL TIEMPO.',button:'VER SEIKO',image:'https://images.pexels.com/photos/30508189/pexels-photo-30508189.jpeg?auto=compress&cs=tinysrgb&w=1200',href:'#marcas',visible:true},
        {name:'ORIENT',text:'TRADICIÓN JAPONESA\nEN CADA DETALLE.',button:'VER ORIENT',image:'assets/orient-ra-bb0001e.webp',href:'#marcas',visible:true},
        {name:'CASIO',text:'CONFIABILIDAD\nPARA TODOS LOS DÍAS.',button:'VER CASIO',image:'https://images.pexels.com/photos/11106319/pexels-photo-11106319.jpeg?auto=compress&cs=tinysrgb&w=1200',href:'#marcas',visible:true}
      ],
      history:{label:'NUESTRA HISTORIA',title:'M&M',text:'Desde 1990, acompañando\nmomentos importantes.',button:'CONOCER MÁS',href:'#nosotros',image:'assets/story-history.jpg'},
      store:{label:'ATENCIÓN PERSONALIZADA',title:'Visitá nuestro local',text:'Ramos Mejía, Bs. As.',button:'CÓMO LLEGAR',href:'#contacto',image:'assets/story-store.jpg'},
      promise:'Tu historia,\nnuestro compromiso.'
    },
    catalog:{eyebrow:'RELOJES',title:'Catálogo de relojes',subtitle:'Descubrí las mejores marcas, modelos y estilos en un solo lugar.'},
    contact:{whatsapp:'',address:'Ramos Mejía, Buenos Aires, Argentina',hours:'Lunes a sábado · 9:30 a 19:30',instagram:''},
    pages:{aboutTitle:'M&M',aboutText:'Desde 1990, acompañando momentos importantes.'},
    banners:[]
  };
  function merge(base,extra){if(!extra)return JSON.parse(JSON.stringify(base));const out=Array.isArray(base)?base.slice():{...base};Object.keys(extra).forEach(k=>{if(extra[k]&&typeof extra[k]==='object'&&!Array.isArray(extra[k])&&base?.[k]&&typeof base[k]==='object')out[k]=merge(base[k],extra[k]);else out[k]=extra[k]});return out}
  let data;
  try{data=merge(defaults,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){data=JSON.parse(JSON.stringify(defaults))}
  async function resolve(src,fallback){try{return MMMedia?.resolve?((await MMMedia.resolve(src))||fallback||src):src}catch(e){return fallback||src}}
  function applyText(el,val){if(!el)return;let text=val||'';if(el.matches('.hero-content h1'))text=String(text).replace(/DESDE\s+1990/g,'DESDE\u00A01990');el.textContent=text;el.style.whiteSpace='pre-line'}
  function applyHome(){
    const h=data.home||defaults.home;
    const hero=document.querySelector('.hero-content');
    if(hero){applyText(hero.querySelector('.eyebrow span'),h.hero.eyebrow);applyText(hero.querySelector('h1'),h.hero.title);applyText(hero.querySelector('p'),h.hero.text);const b=hero.querySelector('.hero-cta');if(b){b.textContent=h.hero.button||'VER RELOJES';b.href=h.hero.href||'catalogo.html'}}
    const heroPage=document.querySelector('.hero-page'); if(heroPage&&h.hero.image){resolve(h.hero.image).then(src=>{if(src)heroPage.style.backgroundImage=`linear-gradient(90deg, rgba(5,24,21,.88) 0%, rgba(5,24,21,.46) 52%, rgba(5,24,21,.08) 100%), url("${src}")`})}
    const j=document.querySelector('.category-jewelry'); if(j){const img=j.querySelector('img'),copy=j.querySelector('.category-copy');resolve(h.jewelry.image,img?.src).then(src=>{if(img&&src)img.src=src});if(copy){applyText(copy.querySelector('.category-link'),h.jewelry.button);if(copy.querySelector('h2'))applyText(copy.querySelector('h2'),h.jewelry.label);if(copy.querySelector('p'))applyText(copy.querySelector('p'),h.jewelry.title);const a=copy.querySelector('.category-link');if(a)a.href=h.jewelry.href||'#joyas';}}
    const feat=document.querySelectorAll('.featured-products-header'); if(feat[0]){applyText(feat[0].querySelector('span'),h.featured.label);applyText(feat[0].querySelector('h2'),h.featured.title);applyText(feat[0].querySelector('p'),h.featured.text)} if(feat[1]){applyText(feat[1].querySelector('span'),h.jewelryProducts.label);applyText(feat[1].querySelector('h2'),h.jewelryProducts.title);applyText(feat[1].querySelector('p'),h.jewelryProducts.text)}
    const rows=document.querySelector('.brand-row'); if(rows){rows.innerHTML=(h.brands||[]).filter(x=>x.visible!==false).map(b=>`<article class="brand-card"><img src="${esc(b.image||'')}" alt="${esc(b.name||'')}" width="1200" height="800"><div class="brand-card-shade"></div><div class="brand-card-copy"><h3>${esc(b.name||'MARCA')}</h3><p>${esc(b.text||'')}</p><a class="brand-card-link ui-button" href="${esc(b.href||'#marcas')}">${esc(b.button||'VER MARCA')}</a></div></article>`).join('');(async()=>{for(const img of rows.querySelectorAll('img')){const src=await resolve(img.getAttribute('src'));if(src)img.src=src}})()}
    applyStory('.story-panel-history',h.history);applyStory('.story-panel-store',h.store);const prom=document.querySelector('.footer-promise');if(prom)applyText(prom,h.promise)
    const bottom=document.querySelector('.site-footer-bottom p:last-child');if(bottom)bottom.textContent='⌖ '+(data.contact.address||defaults.contact.address)+'.';
  }
  function applyStory(sel,obj){const root=document.querySelector(sel);if(!root)return;const img=root.querySelector('img');resolve(obj.image,img?.src).then(src=>{if(img&&src)img.src=src});const c=root.querySelector('.story-panel-copy');if(c){applyText(c.querySelector('span'),obj.label);applyText(c.querySelector('h2'),obj.title);applyText(c.querySelector('p'),obj.text);applyText(c.querySelector('.story-panel-link'),obj.button)}}
  function applyCatalog(){const c=data.catalog||defaults.catalog;const head=document.querySelector('.catalog-head');if(!head)return;applyText(head.querySelector('.eyebrow'),c.eyebrow);applyText(head.querySelector('h1'),c.title);applyText(head.querySelector('p'),c.subtitle)}
  function esc(v){return String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
  function apply(){applyHome();applyCatalog()}
  window.MMContent={KEY,defaults,get(){return data},save(next){data=merge(defaults,next);localStorage.setItem(KEY,JSON.stringify(data));apply();return data},apply};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();
