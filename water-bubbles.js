/* water-bubbles.js — حباب‌های آب در فوتر */
(function(){var w=document.querySelector("footer .water");if(!w)return;
for(var i=0;i<16;i++){var b=document.createElement("i"),s=4+Math.random()*9;b.className="bb";
b.style.cssText="left:"+(Math.random()*100)+"%;width:"+s+"px;height:"+s+"px;animation-duration:"+(7+Math.random()*7)+"s;animation-delay:-"+(Math.random()*12)+"s";w.appendChild(b)}})();
