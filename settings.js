/* settings.js — پنل تنظیمات: تم، رنگ، اندازهٔ متن، جلوه‌ها */
(function(){var r=document.documentElement,K="lh-settings2",D={theme:"day",accent:"gold",fs:1,bgb:1,motion:1,creatures:1,bubbles:1,beam:1,auto:1},S=Object.assign({},D);
try{var x=JSON.parse(localStorage.getItem(K)||"null");if(x)Object.assign(S,x)}catch(e){}
var mq=matchMedia("(prefers-color-scheme: light)"),$=function(i){return document.getElementById(i)},fa=function(n){return n.toLocaleString("fa-IR")};
function save(){try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}}
function cur(){return S.theme==="auto"?(mq.matches?"day":"night"):S.theme}
function apply(){r.setAttribute("data-theme",cur());r.setAttribute("data-accent",S.accent);r.style.setProperty("--fs",S.fs);r.style.setProperty("--bgb",S.bgb);
r.classList.toggle("nomo",!S.motion);r.classList.toggle("hide-cr",!S.creatures);r.classList.toggle("hide-bb",!S.bubbles);r.classList.toggle("hide-beam",!S.beam);r.classList.toggle("noauto",!S.auto);
[].forEach.call(document.querySelectorAll("[data-theme-v]"),function(b){b.setAttribute("aria-pressed",b.dataset.themeV===S.theme)});
[].forEach.call(document.querySelectorAll("[data-acc]"),function(b){b.setAttribute("aria-pressed",b.dataset.acc===S.accent)});
$("sFs").value=S.fs;$("sFsO").textContent=fa(Math.round(S.fs*100))+"٪";$("sBg").value=S.bgb;$("sBgO").textContent=fa(Math.round(S.bgb*100))+"٪";
["motion","creatures","bubbles","beam","auto"].forEach(function(k){$("t_"+k).checked=!!S[k]})}
function set(k,v){S[k]=v;save();apply()}
[].forEach.call(document.querySelectorAll("[data-theme-v]"),function(b){b.onclick=function(){set("theme",b.dataset.themeV)}});
[].forEach.call(document.querySelectorAll("[data-acc]"),function(b){b.onclick=function(){set("accent",b.dataset.acc)}});
$("sFs").oninput=function(){set("fs",parseFloat(this.value))};$("sBg").oninput=function(){set("bgb",parseFloat(this.value))};
["motion","creatures","bubbles","beam","auto"].forEach(function(k){$("t_"+k).onchange=function(){set(k,this.checked?1:0)}});
$("themeBtn").onclick=function(){set("theme",cur()==="day"?"night":"day")};
$("sCart").onclick=function(){if(window.lhStore)window.lhStore.clear()};
$("sReset").onclick=function(){S=Object.assign({},D);save();apply()};
var sp=$("sp"),bd=$("spb"),g=$("gearBtn");
function open(o){sp.classList.toggle("on",o);bd.classList.toggle("on",o);sp.setAttribute("aria-hidden",!o);(o?$("spx"):g).focus()}
g.onclick=function(){open(true)};$("spx").onclick=bd.onclick=function(){open(false)};
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&sp.classList.contains("on"))open(false)});
try{mq.addEventListener("change",function(){if(S.theme==="auto")apply()})}catch(e){}
apply()})();
