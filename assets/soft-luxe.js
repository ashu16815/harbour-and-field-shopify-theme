(()=>{
  const cfgEl=document.getElementById('slx-config');
  if(!cfgEl) return; const cfg=JSON.parse(cfgEl.textContent||'{}');
  const PCT = Number(cfg.discountPercent||50)/100;
  // Countdown (optional)
  const cd=document.querySelector('[data-slx-countdown]');
  if(cd && cfg.campaignEndISO){
    const end=new Date(cfg.campaignEndISO).getTime();
    const tick=()=>{ const now=Date.now(); let s=Math.max(0,Math.floor((end-now)/1000));
      const d=Math.floor(s/86400); s-=d*86400; const h=Math.floor(s/3600); s-=h*3600; const m=Math.floor(s/60); s-=m*60;
      cd.textContent = d+"d "+h+"h "+m+"m "+s+"s left";
    }; tick(); setInterval(tick,1000);
  }
  // Helper: currency format
  const formatMoney=(cents)=>{
    const sample=document.querySelector('[data-money]');
    const n=(cents/100);
    try{ return new Intl.NumberFormat(undefined,{style:'currency',currency:sample?.dataset.currency||document.documentElement.getAttribute('data-shop-currency')||'NZD'}).format(n);}catch(e){return '$'+n.toFixed(2)};
  };
  // Cart preview logic
  const recalc=async()=>{
    let cart=null; try{ const r=await fetch('/cart.js',{credentials:'same-origin'}); cart=await r.json(); }catch(e){}
    if(!cart||!cart.items) return;
    let subtotal=0; cart.items.forEach(it=>{ subtotal+=it.line_price; });
    const preview=Math.floor(subtotal*PCT);
    const root=document.querySelector('[data-cart-root]')||document.querySelector('form[action^="/cart"]')||document.querySelector('#CartDrawer, .cart__footer, .drawer__footer');
    if(!root) return;
    let note=root.querySelector('.slx-cart-note');
    if(!note){ note=document.createElement('div'); note.className='slx-cart-note'; note.setAttribute('role','status'); note.innerHTML='Launch Offer: <strong>'+cfg.campaignTitle+'</strong> — <strong>'+ (cfg.discountPercent||50) + '% off storewide</strong>. Discount <strong>applies automatically</strong> in cart & checkout.'; root.prepend(note); }
    let row=root.querySelector('.slx-discount-row');
    if(!row){ row=document.createElement('div'); row.className='slx-discount-row'; row.innerHTML='<span>Launch Discount (preview)</span><span data-slx-preview-amt></span>'; root.appendChild(row); }
    const out=row.querySelector('[data-slx-preview-amt]');
    if(out) out.textContent = preview>0 ? '-'+formatMoney(preview) : formatMoney(0);
    // Per-line previews
    document.querySelectorAll('[data-cart-item]').forEach(li=>{
      const priceEl=li.querySelector('[data-cart-item-line-price],[data-cart-item-price],[data-cart-price]');
      if(!priceEl) return;
      if(!li.querySelector('.slx-line-preview')){
        const raw=(priceEl.getAttribute('data-line-price')||priceEl.textContent||'').replace(/[^0-9.]/g,'');
        const cents=Math.round(parseFloat(raw||'0')*100);
        const after=Math.floor(cents*(1-PCT));
        const wrap=document.createElement('div'); wrap.className='slx-line-preview';
        wrap.innerHTML='<span class="slx-strike">'+priceEl.textContent+'</span> <span aria-label="after discount">'+formatMoney(after)+'</span>';
        priceEl.after(wrap);
      }
    });
  };
  ['pageshow','cart:refresh','change','click'].forEach(ev=>document.addEventListener(ev,()=>setTimeout(recalc,150)));
  setTimeout(recalc,300);
})();
