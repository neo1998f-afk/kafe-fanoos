/* navigation.js — منوی بالا، اسکرول‌اسپای و منوی همبرگری */
(function(){
var nav=document.getElementById('mainnav'),bg=document.getElementById('burger');
var links=[].slice.call(nav.querySelectorAll('a'));
var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'))});
function setOn(i){links.forEach(function(a,j){a.classList.toggle('on',j===i);if(j===i)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
function spy(){
  var y=window.innerHeight*.38,best=0,bottom=window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4;
  secs.forEach(function(el,i){if(!el)return;var r=el.getBoundingClientRect();if(r.top<=y)best=i});
  if(bottom)best=secs.length-1;
  setOn(best);
}
var lockI=null,lockY=0,lockT=0;
links.forEach(function(a,i){a.addEventListener('click',function(){setOn(i);lockI=i;lockT=Date.now();setTimeout(function(){lockY=window.scrollY},1100);closeM()})});
function onScroll(){
  if(lockI!==null){
    if(Date.now()-lockT<1100){setOn(lockI);return}
    if(Math.abs(window.scrollY-lockY)<70){setOn(lockI);return}
    lockI=null;
  }
  spy();
}
window.addEventListener('scroll',onScroll,{passive:true});
window.addEventListener('resize',spy);
function closeM(){nav.classList.remove('open');bg.setAttribute('aria-expanded','false')}
bg.addEventListener('click',function(){var o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
document.addEventListener('click',function(e){if(nav.classList.contains('open')&&!nav.contains(e.target)&&!bg.contains(e.target))closeM()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeM()});
window.addEventListener('load',spy);spy();
})();
