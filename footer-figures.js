/* footer-figures.js — مجسمه‌های شناور دریایی در فوتر */
(function(){var FG=["images/figure-01.webp", "images/figure-02.webp", "images/figure-03.webp", "images/figure-04.webp", "images/figure-05.webp", "images/figure-06.webp", "images/figure-07.webp", "images/figure-08.webp", "images/figure-09.webp", "images/figure-10.webp", "images/figure-11.webp", "images/figure-12.webp", "images/figure-13.webp", "images/figure-14.webp", "images/figure-15.webp", "images/figure-16.webp", "images/figure-17.webp", "images/figure-18.webp", "images/figure-19.webp", "images/figure-20.webp"];
var f=document.getElementById("fgf"),ft=document.getElementById("footer");if(!f)return;
FG.forEach(function(u,i){var d=document.createElement("div");d.className="fg";
 d.style.cssText="--t:"+(38+(i*7)%17)+"s;--b:"+(9+i%4)+"s;--r:"+(1.6+(i%3)*.7)+"vw;--dl:-"+(i*4.3)+"s";
 d.innerHTML='<img alt="" src="'+u+'">';f.appendChild(d)});
function lay(){var w=innerWidth,big=w>700,per=big?10:5,rh=big?106:76,sz=big?Math.min(96,Math.max(62,w*.065)):56;
 [].forEach.call(f.children,function(d,i){var c=i%per,r=(i/per)|0;d.style.setProperty("--s",sz+"px");
  d.style.left=((c+.5)*100/per)+"%";d.style.marginLeft=(-sz/2)+"px";d.style.top=(r*rh+12+(c%2)*12)+"px"});
 ft.style.paddingTop=(Math.ceil(20/per)*rh+36)+"px"}
lay();addEventListener("resize",lay)})();
