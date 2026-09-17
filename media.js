/* M&M local image storage: avoids localStorage quota and supports galleries. */
window.MMMedia=(()=>{
 const DB='mm_jewelry_media_v1', STORE='images';
 let dbPromise;
 function db(){if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE)};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return dbPromise}
 async function put(key,blob){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readwrite');tx.objectStore(STORE).put(blob,key);tx.oncomplete=()=>res(key);tx.onerror=()=>rej(tx.error)})}
 async function get(key){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readonly');const r=tx.objectStore(STORE).get(key);r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error)})}
 async function del(key){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(key);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)})}
 function isRef(v){return typeof v==='string'&&v.startsWith('idb://')}
 async function resolve(src){if(!isRef(src))return src;const b=await get(src.slice(6));return b?URL.createObjectURL(b):''}
 async function saveFiles(productId,files){const refs=[];for(let i=0;i<files.length;i++){const f=files[i];const key=productId+'-'+Date.now()+'-'+i+'-'+Math.random().toString(36).slice(2);await put(key,f);refs.push('idb://'+key)}return refs}
 async function removeRefs(refs){for(const r of (refs||[]))if(isRef(r))try{await del(r.slice(6))}catch(e){} }
 return {resolve,saveFiles,removeRefs,isRef};
})();
