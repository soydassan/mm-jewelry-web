/* M&M Home Cart hardening: keeps the cart usable after navigation back to Home. */
(function(){
  const STORAGE='mm_cart_v1';
  const PRODUCTS='mm_products_v1';
  const LEGACY_IDS=new Set(['featured-1','featured-2','featured-3','featured-4','featured-5','featured-6','featured-7','featured-8',...Array.from({length:8},(_,i)=>'seed-'+i)]);
  const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key)||'');return v??fallback}catch(e){return fallback}};
  const write=(key,v)=>{try{localStorage.setItem(key,JSON.stringify(v))}catch(e){}};
  const products=()=>{const p=read(PRODUCTS,[]);return Array.isArray(p)?p.filter(x=>x&&!LEGACY_IDS.has(String(x.id))):[]};
  const cart=()=>{const c=read(STORAGE,[]);return Array.isArray(c)?c.filter(x=>x&&String(x.id)):[]};
  const saveCart=c=>write(STORAGE,c);
  const total=c=>c.reduce((n,x)=>n+(Number(x.qty)||0),0);
  async function image(ref){
    try{
      if(window.MMMedia && typeof MMMedia.resolve==='function'){
        const r=await MMMedia.resolve(ref||'');
        if(r) return r;
      }
    }catch(e){}
    return ref||'assets/featured-new-01.jpg';
  }
  function ensureDrawer(){
    let drawer=document.querySelector('[data-mm-home-cart-drawer]');
    if(drawer) return drawer;
    drawer=document.querySelector('.mm-cart-drawer')?.parentElement;
    if(drawer && drawer.querySelector('.mm-cart-drawer')) return drawer;
    drawer=document.createElement('div');
    drawer.setAttribute('data-mm-home-cart-drawer','1');
    drawer.innerHTML='<div class="mm-cart-overlay" data-close></div><aside class="mm-cart-drawer" aria-label="Carrito de compras" aria-hidden="true"><div class="mm-cart-head"><h2>Tu carrito</h2><button type="button" class="mm-cart-close" aria-label="Cerrar carrito">×</button></div><div class="mm-cart-items"></div><div class="mm-cart-empty">Tu carrito está vacío.</div><div class="mm-cart-foot"><div><span>Productos</span><strong class="mm-cart-count">0</strong></div><button type="button" class="mm-cart-checkout">CONTINUAR</button></div></aside>';
    document.body.appendChild(drawer);
    return drawer;
  }
  function panelOf(drawer){return drawer.querySelector('.mm-cart-drawer')||drawer}
  function open(){
    const drawer=ensureDrawer(), panel=panelOf(drawer);
    drawer.classList.add('open');
    panel.classList.add('open');
    panel.style.transform='translateX(0)';
    const ov=drawer.querySelector('.mm-cart-overlay'); if(ov){ov.style.opacity='1';ov.style.pointerEvents='auto';}
    panel.setAttribute('aria-hidden','false');
    document.body.classList.add('mm-cart-lock');
    render();
  }
  function close(){
    const drawer=document.querySelector('[data-mm-home-cart-drawer]')||document.querySelector('.mm-cart-drawer')?.parentElement;
    if(!drawer)return;
    const panel=panelOf(drawer);
    drawer.classList.remove('open');panel.classList.remove('open');panel.style.transform='translateX(100%)';const ov=drawer.querySelector('.mm-cart-overlay');if(ov){ov.style.opacity='0';ov.style.pointerEvents='none';}panel.setAttribute('aria-hidden','true');document.body.classList.remove('mm-cart-lock');
  }
  async function render(){
    const c=cart();
    const buttons=document.querySelectorAll('.cart-action');
    buttons.forEach(b=>{const s=b.querySelector('span');if(s)s.textContent=total(c);b.setAttribute('aria-label',`Carrito, ${total(c)} ${total(c)===1?'producto':'productos'}`)});
    const drawer=document.querySelector('[data-mm-home-cart-drawer]')||document.querySelector('.mm-cart-drawer')?.parentElement;
    if(!drawer)return;
    const items=drawer.querySelector('.mm-cart-items'), empty=drawer.querySelector('.mm-cart-empty'), count=drawer.querySelector('.mm-cart-count');
    if(!items)return;
    if(count)count.textContent=total(c);
    if(empty)empty.style.display=c.length?'none':'block';
    const rows=await Promise.all(c.map(async p=>({...p,_img:await image(p.img||p.image)})));
    items.innerHTML=rows.map((p,i)=>`<div class="mm-cart-item"><img src="${p._img||'assets/featured-new-01.jpg'}" alt="${String(p.name||'').replace(/"/g,'&quot;')}" onerror="this.onerror=null;this.src='assets/featured-new-01.jpg'"><div class="mm-cart-item-info"><strong>${p.name||'Producto'}</strong><span>${p.brand||'M&M'}</span><div class="mm-cart-qty"><button type="button" data-inc="${i}">+</button><b>${Number(p.qty)||1}</b><button type="button" data-dec="${i}">−</button><button type="button" class="mm-cart-remove" data-del="${i}">Eliminar</button></div></div></div>`).join('');
  }
  function addById(id,card){
    const pid=String(id||'');if(!pid)return false;
    const ps=products();const p=ps.find(x=>String(x.id)===pid);if(!p)return false;
    const c=cart();const found=c.find(x=>String(x.id)===pid);
    const item={id:p.id,name:p.name||'Producto',brand:p.brand||'M&M',img:p.image||card?.querySelector('img')?.getAttribute('src')||''};
    if(found)found.qty=Number(found.qty||0)+1;else c.push({...item,qty:1});
    saveCart(c);open();return true;
  }
  window.MMHomeOpenCart=open;
  window.MMHomeAddToCart=addById;
  document.addEventListener('click',function(e){
    const cartBtn=e.target.closest?.('.cart-action');
    if(cartBtn){e.preventDefault();e.stopPropagation();open();return;}
    const add=e.target.closest?.('.featured-product-cart[data-product-id]');
    if(add){e.preventDefault();e.stopPropagation();addById(add.dataset.productId,add.closest('.featured-product-card'));}
  },true);
  document.addEventListener('click',function(e){
    const d=e.target.closest?.('[data-mm-home-cart-drawer]');if(!d)return;
    if(e.target.matches('[data-close],.mm-cart-close')){close();return;}
    const i=e.target.dataset.inc,dn=e.target.dataset.dec,del=e.target.dataset.del;
    const c=cart();
    if(i!==undefined&&c[i])c[i].qty=(Number(c[i].qty)||0)+1;
    else if(dn!==undefined&&c[dn]){c[dn].qty=(Number(c[dn].qty)||0)-1;if(c[dn].qty<=0)c.splice(dn,1)}
    else if(del!==undefined&&c[del])c.splice(del,1);else return;
    saveCart(c);render();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();
