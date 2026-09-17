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
MSG:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.87 11.87 0 0 0 12.06 0C5.5 0 .17 5.33.17 11.89c0 2.1.55 4.15 1.59 5.96L0 24l6.3-1.65a11.84 11.84 0 0 0 5.76 1.48h.01c6.55 0 11.88-5.33 11.88-11.89 0-3.18-1.24-6.17-3.43-8.46zm-8.45 17.9h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.91 9.91 0 0 1-1.52-5.26C2.17 6.43 6.6 2 12.06 2a9.95 9.95 0 0 1 7.08 2.94A9.95 9.95 0 0 1 22.06 12c0 5.46-4.44 9.9-9.99 9.9zm5.43-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.01-1.04 2.46s1.07 2.85 1.22 3.05c.15.2 2.1 3.21 5.09 4.5.71.31 1.26.5 1.69.64.71.23 1.35.2 1.86.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/></svg>',
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
