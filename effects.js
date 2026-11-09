/* effects.js — هالهٔ فانوس و ستارهٔ پرنده */
(function(){
var hero=document.getElementById("hero"),beam=document.getElementById("beam"),cartEl=document.getElementById("cart");
/* lamp halo follows the beam origin */
if(hero&&beam){var h=document.createElement("div");h.className="lamphalo";h.setAttribute("aria-hidden","true");hero.insertBefore(h,beam);
 var sync=function(){h.style.left=beam.style.left||"0px";h.style.top=beam.style.top||"0px";h.style.opacity=beam.style.opacity||0};
 new MutationObserver(sync).observe(beam,{attributes:true,attributeFilter:["style"]});sync()}
/* star flight */
var STAR='<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 1.5l3 7 7.5.6-5.7 4.9 1.8 7.4L12 17.5 5.4 21.4l1.8-7.4L1.5 9.1 9 8.5z"/></svg>';
var pill=document.createElement("div");pill.id="cartpill";pill.setAttribute("aria-hidden","true");
pill.innerHTML='<svg class="ic" viewBox="0 0 24 24"><path d="M3 4h2l2.4 11h10.2L20 7H6.2"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></svg><b></b>';document.body.appendChild(pill);
var pt;
function el(c,x,y){var d=document.createElement("div");d.className=c;d.innerHTML=STAR;d.style.left=x+"px";d.style.top=y+"px";document.body.appendChild(d);return d}
function spark(x,y,far){var d=el("fspk",x,y);var a=Math.random()*6.28,r=(far?34:14)+Math.random()*(far?24:12);d.style.setProperty("--dx",Math.cos(a)*r+"px");d.style.setProperty("--dy",Math.sin(a)*r+"px");setTimeout(function(){d.remove()},650)}
function target(){var b=cartEl&&cartEl.parentElement,r=b&&b.getBoundingClientRect();
 if(r&&r.width&&r.bottom>8&&r.top<innerHeight-8)return{x:r.left+r.width/2,y:r.top+r.height/2,b:b};
 pill.lastChild.textContent=cartEl?cartEl.textContent:"";pill.classList.add("on");clearTimeout(pt);pt=setTimeout(function(){pill.classList.remove("on")},2200);
 var q=pill.getBoundingClientRect();return{x:q.left+22,y:q.top+q.height/2+14,b:pill}}
function fly(src){
 if(document.documentElement.classList.contains("nomo")||matchMedia("(prefers-reduced-motion:reduce)").matches)return;
 var s=src.getBoundingClientRect(),x0=s.left+s.width/2,y0=s.top+s.height/2;
 for(var i=0;i<6;i++)spark(x0,y0,true);
 var T=target(),x1=T.x,y1=T.y,dist=Math.hypot(x1-x0,y1-y0),cx=(x0+x1)/2+(Math.random()-.5)*dist*.25,cy=Math.min(y0,y1)-Math.max(90,dist*.3);
 var st=el("fstar",x0,y0),t0=performance.now(),D=Math.min(1100,650+dist*.45),last=0;
 (function f(n){var t=Math.min(1,(n-t0)/D),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,u=1-e;
  var x=u*u*x0+2*u*e*cx+e*e*x1,y=u*u*y0+2*u*e*cy+e*e*y1;
  st.style.left=x+"px";st.style.top=y+"px";st.style.transform="rotate("+(t*540)+"deg) scale("+(1.25-.7*e)+")";
  if(n-last>34){last=n;spark(x,y,false)}
  if(t<1)requestAnimationFrame(f);else{st.remove();for(var i=0;i<8;i++)spark(x1,y1,true);
   var b=T.b;b.classList.remove("cartpop");void b.offsetWidth;b.classList.add("cartpop");pill.lastChild.textContent=cartEl?cartEl.textContent:""}
 })(t0)}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".pa,#add");if(b)fly(b)},true);
})();
