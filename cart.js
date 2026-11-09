/* cart.js — سبد خرید، صفحهٔ سبد خرید، صفحهٔ پرداخت و تأیید سفارش
   مسیرها با hash کار می‌کنند:  #/cart   #/checkout   #/done  */
(function(){
'use strict';
var P=window.LH_PRODUCTS,IM=window.LH_IMG,KEY='lh-cart-v1',ORD='lh-last-order';
var $=function(id){return document.getElementById(id)};
var fa=function(n){return Number(n).toLocaleString('fa-IR')};
var money=function(n){return fa(n)+' تومان'};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var latin=function(s){return String(s).replace(/[۰-۹]/g,function(d){return d.charCodeAt(0)-1776}).replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632})};

/* ===== ۱) ذخیرهٔ سبد (در همین مرورگر) ===== */
var items=[],subs=[];
try{var raw=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(raw))raw.forEach(function(i){if(i&&P[i.k]&&i.q>0)items.push({k:i.k,q:Math.min(99,Math.floor(i.q))})})}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){}}
function emit(a,k){subs.forEach(function(f){f(a,k)})}
function find(k){for(var i=0;i<items.length;i++)if(items[i].k===k)return items[i]}
var store=window.lhStore={
  add:function(k,n){if(!P[k])return;n=n||1;var it=find(k);if(it)it.q=Math.min(99,it.q+n);else items.push({k:k,q:Math.min(99,n)});save();emit('add',k)},
  set:function(k,q){var it=find(k);if(!it)return;q=Math.floor(q);if(q<=0)return store.remove(k);it.q=Math.min(99,q);save();emit('set',k)},
  remove:function(k){items=items.filter(function(i){return i.k!==k});save();emit('remove',k)},
  clear:function(){items=[];save();emit('clear')},
  items:function(){return items.map(function(i){return{k:i.k,q:i.q,p:P[i.k]}})},
  count:function(){return items.reduce(function(s,i){return s+i.q},0)},
  total:function(){return items.reduce(function(s,i){return s+i.q*P[i.k].v},0)},
  subscribe:function(f){subs.push(f)}
};

/* ===== ۲) نشان تعداد روی آیکن سبد + پیام «به سبد اضافه شد» ===== */
var badge=$('cart'),cartBtn=$('cartBtn');
function paintBadge(bump){
  var n=store.count();badge.textContent=fa(n);badge.hidden=n===0;
  cartBtn.setAttribute('aria-label',n?'سبد خرید، '+fa(n)+' مورد':'سبد خرید');
  if(bump){badge.classList.remove('bump');void badge.offsetWidth;badge.classList.add('bump')}
}
var toast=document.createElement('div');toast.className='lh-toast';toast.setAttribute('role','status');document.body.appendChild(toast);
var tt;
function showToast(k){
  toast.innerHTML='<span>«'+esc(P[k].n)+'» به سبد خرید اضافه شد</span><a href="#/cart">مشاهده سبد</a>';
  toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},3400);
}
cartBtn.addEventListener('click',function(){location.hash='#/cart'});

/* ===== ۳) صفحه‌ها ===== */
var page=document.createElement('div');page.id='lhp';page.className='lhp';page.hidden=true;document.body.appendChild(page);
var view=null,finishing=false,memOrder=null;

function lastOrder(){try{var o=sessionStorage.getItem(ORD);if(o)return JSON.parse(o)}catch(e){}return memOrder}
function head(step){
  var st=['سبد خرید','پرداخت','تأیید'];
  return '<header class="lh-head"><a class="lh-brand" href="#train" aria-label="کافه فانوس، بازگشت به سایت"><svg class="anc" aria-hidden="true"><use href="#anc"/></svg><b>کافه فانوس</b></a>'
   +'<ol class="lh-steps">'+st.map(function(s,i){return'<li'+(i===step?' class="on" aria-current="step"':i<step?' class="ok"':'')+'><i>'+fa(i+1)+'</i><span>'+s+'</span></li>'}).join('')+'</ol>'
   +'<button class="lh-x" data-act="exit" aria-label="بستن و بازگشت به سایت">✕</button></header>';
}

/* --- صفحهٔ سبد خرید --- */
function cartHTML(){
  var its=store.items();
  if(!its.length)return head(0)+'<main class="lh-main"><h1 tabindex="-1">سبد خرید</h1><div class="lh-empty"><svg viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg><p>سبد خرید شما خالی است.</p><a class="lh-btn" href="#train">مشاهدهٔ منو</a></div></main>';
  var rows=its.map(function(it){
    var p=it.p,k=it.k;
    return '<li class="lh-item"><img src="'+IM[k].w+'" alt="" width="96" height="96">'
     +'<div class="lh-info"><span class="lh-chip">'+esc(p.c)+'</span><h3>'+esc(p.n)+'</h3><p>'+esc(p.d)+'</p><div class="lh-unit">قیمت هر عدد: <b>'+money(p.v)+'</b></div></div>'
     +'<div class="lh-side"><div class="lh-qty" role="group" aria-label="تعداد '+esc(p.n)+'">'
     +'<button type="button" data-act="dec" data-k="'+k+'" data-f="dec:'+k+'" aria-label="کم کردن یک عدد">−</button><output aria-live="polite">'+fa(it.q)+'</output>'
     +'<button type="button" data-act="inc" data-k="'+k+'" data-f="inc:'+k+'" aria-label="اضافه کردن یک عدد"'+(it.q>=99?' disabled':'')+'>+</button></div>'
     +'<div class="lh-line"><span>جمع</span><b>'+money(it.q*p.v)+'</b></div>'
     +'<button type="button" class="lh-rm" data-act="rm" data-k="'+k+'" data-f="rm:'+k+'">حذف از سبد</button></div></li>';
  }).join('');
  return head(0)+'<main class="lh-main"><h1 tabindex="-1">سبد خرید <small>'+fa(store.count())+' عدد، '+fa(its.length)+' محصول</small></h1>'
   +'<div class="lh-grid"><ul class="lh-list">'+rows+'</ul>'
   +'<aside class="lh-sum" aria-label="خلاصهٔ سفارش"><h2>خلاصهٔ سفارش</h2>'
   +'<dl><div><dt>تعداد کل</dt><dd>'+fa(store.count())+' عدد</dd></div><div><dt>جمع اقلام</dt><dd>'+money(store.total())+'</dd></div></dl>'
   +'<div class="lh-total"><span>مبلغ قابل پرداخت</span><b>'+money(store.total())+'</b></div>'
   +'<a class="lh-btn lh-pay" href="#/checkout">پرداخت</a><a class="lh-link" href="#train">ادامهٔ خرید</a></aside></div></main>';
}

/* --- صفحهٔ پرداخت --- */
function sumList(){
  return '<ul class="lh-mini">'+store.items().map(function(it){
    return'<li><img src="'+IM[it.k].b+'" alt="" width="44" height="44"><span>'+esc(it.p.n)+' <small>× '+fa(it.q)+'</small></span><b>'+money(it.q*it.p.v)+'</b></li>'}).join('')+'</ul>';
}
function checkoutHTML(){
  return head(1)+'<main class="lh-main"><h1 tabindex="-1">پرداخت</h1><div class="lh-grid">'
   +'<form class="lh-form" id="lhForm" novalidate>'
   +'<fieldset><legend>اطلاعات سفارش‌دهنده</legend>'
   +'<label class="lh-f"><span>نام و نام خانوادگی</span><input name="name" autocomplete="name" maxlength="60" required><small class="lh-err" id="e_name" role="alert"></small></label>'
   +'<label class="lh-f"><span>شمارهٔ موبایل</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="09123456789" maxlength="14" required><small class="lh-err" id="e_phone" role="alert"></small></label></fieldset>'
   +'<fieldset><legend>نحوهٔ دریافت</legend><div class="lh-opts">'
   +'<label class="lh-opt"><input type="radio" name="mode" value="dine" checked><span><b>سرو در کافه</b><small>سفارش به میز شما آورده می‌شود</small></span></label>'
   +'<label class="lh-opt"><input type="radio" name="mode" value="take"><span><b>بیرون‌بر</b><small>سفارش را از کافه تحویل می‌گیرید</small></span></label></div>'
   +'<label class="lh-f" id="tblRow"><span>شمارهٔ میز</span><input name="table" inputmode="numeric" autocomplete="off" maxlength="3"><small class="lh-err" id="e_table" role="alert"></small></label>'
   +'<label class="lh-f"><span>توضیحات (اختیاری)</span><textarea name="note" rows="2" maxlength="200" placeholder="مثلاً: بدون شکر"></textarea></label></fieldset>'
   +'<fieldset><legend>روش پرداخت</legend><div class="lh-opts">'
   +'<label class="lh-opt"><input type="radio" name="pay" value="online" checked><span><b>پرداخت آنلاین</b><small>با کارت بانکی، از طریق درگاه پرداخت</small></span></label>'
   +'<label class="lh-opt"><input type="radio" name="pay" value="cafe"><span><b>پرداخت در کافه</b><small>هنگام تحویل سفارش</small></span></label></div>'
   +'<p class="lh-demo">نسخهٔ نمایشی: به درگاه بانکی واقعی وصل نیست و مبلغی کسر نمی‌شود.</p></fieldset>'
   +'<button class="lh-btn lh-pay" type="submit" id="lhPay"></button><a class="lh-link" href="#/cart">بازگشت به سبد خرید</a></form>'
   +'<aside class="lh-sum first" aria-label="خلاصهٔ سفارش"><h2>سفارش شما</h2>'+sumList()
   +'<div class="lh-total"><span>مبلغ قابل پرداخت</span><b>'+money(store.total())+'</b></div></aside></div></main>';
}
function payLabel(f){return f.pay.value==='online'?'پرداخت '+money(store.total()):'ثبت سفارش'}
function bindCheckout(){
  var f=$('lhForm');if(!f)return;
  function sync(){$('tblRow').hidden=f.mode.value!=='dine';$('lhPay').textContent=payLabel(f)}
  f.addEventListener('change',sync);sync();
  ['name','phone','table'].forEach(function(n){f[n].addEventListener('input',function(){$('e_'+n).textContent='';f[n].setAttribute('aria-invalid','false')})});
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var d={name:f.name.value.trim(),phone:latin(f.phone.value).replace(/[\s\-]/g,''),mode:f.mode.value,table:latin(f.table.value).trim(),note:f.note.value.trim(),pay:f.pay.value},er={};
    if(d.name.length<3)er.name='نام و نام خانوادگی را وارد کنید.';
    if(!/^09\d{9}$/.test(d.phone))er.phone='شمارهٔ موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).';
    if(d.mode==='dine'&&!(/^\d{1,3}$/.test(d.table)&&+d.table>0))er.table='شمارهٔ میز را وارد کنید.';
    ['name','phone','table'].forEach(function(n){$('e_'+n).textContent=er[n]||'';f[n].setAttribute('aria-invalid',er[n]?'true':'false')});
    var bad=['name','phone','table'].filter(function(n){return er[n]})[0];
    if(bad){f[bad].focus();return}
    var btn=$('lhPay');btn.disabled=true;
    /* TODO(درگاه واقعی): اینجا باید سفارش به سرور فرستاده و کاربر به درگاه بانکی هدایت شود.
       در نسخهٔ نمایشی، پرداخت آنلاین فقط شبیه‌سازی می‌شود. */
    if(d.pay==='online'){btn.textContent='در حال اتصال به درگاه…';setTimeout(function(){finish(d)},1400)}else finish(d);
  });
}
function finish(d){
  var o={id:'LH-'+Math.random().toString(36).slice(2,7).toUpperCase(),name:d.name,phone:d.phone,mode:d.mode,table:d.table,note:d.note,pay:d.pay,
    total:store.total(),items:store.items().map(function(i){return{k:i.k,n:i.p.n,q:i.q,v:i.p.v}})};
  memOrder=o;try{sessionStorage.setItem(ORD,JSON.stringify(o))}catch(e){}
  finishing=true;store.clear();finishing=false;location.hash='#/done';
}

/* --- صفحهٔ تأیید سفارش --- */
function doneHTML(){
  var o=lastOrder();if(!o)return '';
  var rows=o.items.map(function(i){return'<li><span>'+esc(i.n)+' <small>× '+fa(i.q)+'</small></span><b>'+money(i.q*i.v)+'</b></li>'}).join('');
  return head(2)+'<main class="lh-main lh-done"><div class="lh-ok" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></div>'
   +'<h1 tabindex="-1">سفارش شما ثبت شد</h1><p class="lh-code">کد پیگیری: <b dir="ltr">'+esc(o.id)+'</b></p>'
   +'<p class="lh-st">'+(o.pay==='online'?'پرداخت آزمایشی ثبت شد (در نسخهٔ نمایشی مبلغی کسر نمی‌شود).':'لطفاً مبلغ سفارش را هنگام تحویل در کافه پرداخت کنید.')+'</p>'
   +'<section class="lh-receipt"><dl><div><dt>سفارش‌دهنده</dt><dd>'+esc(o.name)+'</dd></div><div><dt>موبایل</dt><dd dir="ltr">'+esc(o.phone)+'</dd></div>'
   +'<div><dt>دریافت</dt><dd>'+(o.mode==='dine'?'سرو در کافه، میز '+fa(o.table):'بیرون‌بر')+'</dd></div>'
   +'<div><dt>پرداخت</dt><dd>'+(o.pay==='online'?'آنلاین (آزمایشی)':'در کافه')+'</dd></div>'+(o.note?'<div><dt>توضیحات</dt><dd>'+esc(o.note)+'</dd></div>':'')+'</dl>'
   +'<ul class="lh-mini plain">'+rows+'</ul><div class="lh-total"><span>مبلغ کل</span><b>'+money(o.total)+'</b></div></section>'
   +'<a class="lh-btn" href="#train">بازگشت به منو</a></main>';
}

/* ===== ۴) نمایش و مسیریابی ===== */
function setInert(on){[].forEach.call(document.body.children,function(el){if(el===page||el===toast||el.tagName==='SCRIPT')return;el.inert=on})}
function render(){
  var a=document.activeElement,f=a&&page.contains(a)&&a.getAttribute('data-f'),y=page.scrollTop;
  page.innerHTML=view==='cart'?cartHTML():view==='checkout'?checkoutHTML():doneHTML();
  page.scrollTop=y;
  if(view==='checkout')bindCheckout();
  if(f){var n=page.querySelector('[data-f="'+f+'"]');(n||page.querySelector('h1')).focus({preventScroll:true})}
}
function route(){
  var h=location.hash,v=h==='#/cart'?'cart':h==='#/checkout'?'checkout':h==='#/done'?'done':null;
  if(v==='checkout'&&!items.length)return location.replace('#/cart');
  if(v==='done'&&!lastOrder())return location.replace('#/cart');
  if(v===view)return;
  var was=view;view=v;
  if(!v){page.hidden=true;page.innerHTML='';document.documentElement.classList.remove('lhp-open');setInert(false);if(was)try{cartBtn.focus({preventScroll:true})}catch(e){}return}
  toast.classList.remove('on');page.hidden=false;document.documentElement.classList.add('lhp-open');setInert(true);
  render();page.scrollTop=0;var t=page.querySelector('h1');if(t)t.focus({preventScroll:true});
}
window.addEventListener('hashchange',route);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&view)location.hash='#train'});
page.addEventListener('click',function(e){
  var b=e.target.closest('[data-act]');if(!b)return;
  var a=b.dataset.act,k=b.dataset.k,it=k&&find(k);
  if(a==='exit')location.hash='#train';
  else if(a==='inc'&&it)store.set(k,it.q+1);
  else if(a==='dec'&&it)store.set(k,it.q-1);
  else if(a==='rm'&&it)store.remove(k);
});
store.subscribe(function(a,k){
  paintBadge(a==='add');if(a==='add')showToast(k);
  if(view==='checkout'&&!items.length&&!finishing)return location.replace('#/cart');
  if(view==='cart')render();
});
paintBadge(false);route();
})();
