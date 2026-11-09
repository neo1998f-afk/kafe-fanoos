/* main.js — منو، صحنهٔ قایق‌ها، سبد خرید و بنر پیشنهاد ویژه */
(function(){
  var P=window.LH_PRODUCTS,IM=window.LH_IMG;
  var wl={latte:'لاته',choco:'کیک شکلاتی',iced:'آیس لاته',cheese:'چیزکیک',capp:'کاپوچینو',carrot:'کیک هویج'};
  var order=Object.keys(P);
  var $=function(i){return document.getElementById(i)};
  var hero=$('hero'),beam=$('beam'),tower=$('tower'),feat=$('feat');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bubs=[].slice.call(document.querySelectorAll('.bub'));
  bubs.forEach(function(b){var m=IM[b.dataset.key];if(m&&m.b)b.innerHTML='<img src="'+m.b+'" alt="">'});
  var cur='latte',locked=null,hover=false,angle=0;


  function aim(el){
    var h=hero.getBoundingClientRect(),t=tower.getBoundingClientRect(),r=el.getBoundingClientRect();
    var im=$('bgimg'),g=im.getBoundingClientRect(),s=Math.max(g.width/2045,g.height/769),rw=2045*s,rh=769*s,op=(getComputedStyle(im).objectPosition||'50% 0%').split(' '),fx=parseFloat(op[0])/100,fy=(parseFloat(op[1])||0)/100;var lx=g.left+(g.width-rw)*fx+rw*1095/2045-h.left,ly=g.top+(g.height-rh)*fy+rh*172/769-h.top;
    var dx=r.left+r.width/2-h.left-lx,dy=r.top+r.height/2-h.top-ly;
    var d=Math.sqrt(dx*dx+dy*dy),a=Math.atan2(dy,dx)*180/Math.PI;
    a+=360*Math.round((angle-a)/360);angle=a;
    var s=Math.max(d*.1,Math.min(r.height/2,70));
    beam.style.left=lx+'px';beam.style.top=ly+'px';beam.style.width=d+'px';
    beam.style.height=(s*2)+'px';beam.style.marginTop=(-s)+'px';
    beam.style.transform='rotate('+a+'deg)';beam.style.opacity=1;
  }
  function show(k){
    cur=k;var p=P[k];dayRender(order.indexOf(k));
    $('fEm').innerHTML='<img src="'+(IM[k].f||IM[k].w)+'" alt="">';$('fName').textContent=p.n;$('fDesc').textContent=p.d;$('fPrice').textContent=p.p+' تومان';
    bubs.forEach(function(b){var on=b.dataset.key===k;b.classList.toggle('lit',on);b.setAttribute('aria-pressed',locked===k&&on)});
    var b=bubs.filter(function(x){return x.dataset.key===k})[0];
    aim(b||feat);
  }
  bubs.forEach(function(b){
    var k=b.dataset.key;
    b.addEventListener('mouseenter',function(){hover=true;show(k)});
    b.addEventListener('mouseleave',function(){hover=false;if(locked)show(locked)});
    b.addEventListener('focus',function(){show(k)});
    b.addEventListener('click',function(){locked=(locked===k)?null:k;show(k)});
  });
  function step(n){var i=(order.indexOf(cur)+n+order.length)%order.length;locked=order[i];show(order[i])}
  $('prev').onclick=function(){step(-1)};$('next').onclick=function(){step(1)};
  var S=[['قهوه‌ای از دل دریا','برای لحظه‌های خاص'],['صبحانه‌ای با طعم ساحل','هر صبح، تا ظهر'],['دسرهای شبانه','کنار نور فانوس']],si=0;
  $('bNext').onclick=function(){
    si=(si+1)%S.length;$('bT').textContent=S[si][0];$('bS').textContent=S[si][1];
    $('bN').textContent=(si+1).toLocaleString('fa-IR',{minimumIntegerDigits:2})+' / ۰۳';
  };

  setInterval(function(){
    if(locked||hover||reduce||document.documentElement.classList.contains('noauto'))return;
    show(order[(order.indexOf(cur)+1)%order.length]);
  },5200);
  window.addEventListener('resize',function(){show(cur)});
  var BT={"sea": "images/sea-breeze.webp", "harbor": "images/harbor-dream.webp", "ocean": "images/ocean-spirit.webp", "row": "images/little-explorer.webp", "tug": "images/tug-life.webp"};
  function addCart(k){window.lhStore.add(k)}
  $('add').onclick=function(){addCart(cur)};
  var dc=$('dcards');
  dc.innerHTML='<div class="dc"></div><div class="dc"></div><div class="dc"></div><button class="darr l" id="dprev" aria-label="قبلی">&#8249;</button><button class="darr r" id="dnext" aria-label="بعدی">&#8250;</button>';
  function dayRender(i){var ks=dc.querySelectorAll('.dc');for(var j=0;j<3;j++){var k=order[(i+j)%order.length],p=P[k];ks[j].dataset.key=k;ks[j].innerHTML='<img src="'+IM[k].w+'" alt=""><b>'+p.n+'</b><div class="pr"><span>'+p.p+' تومان</span><button class="pa" aria-label="افزودن به سبد">+</button></div>'}}
  $('dprev').onclick=function(){step(-1)};$('dnext').onclick=function(){step(1)};
  dc.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.pa');if(b)addCart(b.closest('.dc').dataset.key)});
  var BO=[['sea','latte',.85,0,10,56,0],['harbor','choco',1.05,3,12,50,0],['ocean','iced',.9,6,9,54,0],['row','cheese',1,2,11,46,0],['tug','capp',1,5,13,50,0],['sea','carrot',.8,8,10,56,1]];
  var fl=document.createElement('div');fl.className='fleet';
  fl.innerHTML='<div class="fl">'+BO.map(function(b){var k=b[1];return '<div class="bt" style="--k:'+b[2]+';--dl:-'+b[3]+'s;--t:'+b[4]+'s;--y:'+b[5]+'px"><div class="bo"><img class="bi'+(b[6]?' fx':'')+'" src="'+BT[b[0]]+'" alt=""><div class="pc"><img src="'+IM[k].b+'" alt=""><b>'+P[k].n+'</b><small>'+P[k].p+' تومان</small><button class="pa" data-key="'+k+'" aria-label="افزودن '+P[k].n+' به سبد">+</button></div></div></div>'}).join('')+'<div class="fw"></div></div>';
  $('train').appendChild(fl);
  fl.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.pa');if(b)addCart(b.dataset.key)});
  function start(){show(cur)}
  start();
  window.addEventListener('load',function(){(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(start)});
})();
