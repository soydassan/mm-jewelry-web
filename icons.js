const S=(p)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const icons={
TRUCK:S('<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
STORE:S('<path d="M4 10h16v10H4z"/><path d="M3 10l2-5h14l2 5"/><path d="M8 10v3h8v-3"/><path d="M9 20v-6h6v6"/>'),
CARD:S('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/>'),
SEARCH:S('<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>'),
USER:S('<circle cx="12" cy="8" r="3"/><path d="M5 20a7 7 0 0 1 14 0"/>'),
CART:S('<path d="M3 4h2l2 11h10l3-8H6"/><circle cx="9" cy="19" r="1.5"/><circle cx="18" cy="19" r="1.5"/>'),
MENU:S('<path d="M4 7h16M4 12h16M4 17h16"/>'),
ARROW:S('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
TRUCKBIG:S('<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'),
STOREBIG:S('<path d="M4 10h16v10H4z"/><path d="M3 10l2-5h14l2 5"/><path d="M8 10v3h8v-3"/><path d="M9 20v-6h6v6"/>'),
CARDBIG:S('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/>'),
SHIELDBIG:S('<path d="M12 3 20 6v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>'),
INSTAGRAM:S('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>'),
MSG:'<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326z"/></svg>',
PIN:S('<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>')};

// Reemplaza placeholders sin reconstruir document.body. Reconstruir el body eliminaba
// los scripts siguientes y, por eso, dejaba sin inicializar el carrito al volver a Inicio.
(function replacePlaceholders(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[]; let node;
  while(node=walker.nextNode()) nodes.push(node);
  nodes.forEach(textNode=>{
    let value=textNode.nodeValue;
    for(const [key,svg] of Object.entries(icons)) value=value.replaceAll(`%%${key}%%`,svg);
    if(value!==textNode.nodeValue){
      const holder=document.createElement('span');
      holder.innerHTML=value;
      textNode.replaceWith(...Array.from(holder.childNodes));
    }
  });
  root.querySelectorAll('*').forEach(el=>{
    for(const attr of Array.from(el.attributes)){
      let value=attr.value;
      for(const [key,svg] of Object.entries(icons)) value=value.replaceAll(`%%${key}%%`,svg);
      if(value!==attr.value) el.setAttribute(attr.name,value);
    }
  });
})(document.body);
