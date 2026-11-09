/* products.js — اطلاعات محصولات (نام، توضیح، قیمت، دسته) و آدرس عکس‌ها
   برای تغییر قیمت یا نام، فقط همین فایل را ویرایش کنید. v = قیمت به تومان */
(function(){
  var P={
    latte:{n:'لاته هنری',d:'اسپرسوی غلیظ با شیر بخارداده و طرح قلب روی فوم',v:85000,c:'نوشیدنی گرم'},
    choco:{n:'کیک شکلاتی',d:'لایه‌های کیک کاکائویی با گاناش شکلات و میوهٔ تازه',v:90000,c:'کیک و دسر'},
    iced:{n:'آیس لاته',d:'اسپرسو و شیر سرد روی یخ، با لایه‌های کرمی',v:85000,c:'نوشیدنی سرد'},
    cheese:{n:'چیزکیک میوه‌های جنگلی',d:'چیزکیک خامه‌ای با سس و میوه‌های جنگلی تازه',v:75000,c:'کیک و دسر'},
    capp:{n:'کاپوچینو',d:'اسپرسو، شیر تازه و فوم خامه‌ای با پودر کاکائو',v:85000,c:'نوشیدنی گرم'},
    carrot:{n:'کیک هویج و گردو',d:'کیک هویج با کرم پنیر و مغز گردو',v:80000,c:'کیک و دسر'}
  };
  Object.keys(P).forEach(function(k){P[k].p=P[k].v.toLocaleString('fa-IR')});
  window.LH_PRODUCTS=P;
  window.LH_IMG={"latte": {"w": "images/latte-card.jpg", "b": "images/latte-thumb.jpg", "f": "images/latte-large.jpg"}, "choco": {"w": "images/choco-card.jpg", "b": "images/choco-thumb.jpg", "f": "images/choco-large.jpg"}, "iced": {"w": "images/iced-card.jpg", "b": "images/iced-thumb.jpg", "f": "images/iced-large.jpg"}, "cheese": {"w": "images/cheese-card.jpg", "b": "images/cheese-thumb.jpg", "f": "images/cheese-large.jpg"}, "capp": {"w": "images/capp-card.jpg", "b": "images/capp-thumb.jpg", "f": "images/capp-large.jpg"}, "carrot": {"w": "images/carrot-card.jpg", "b": "images/carrot-thumb.jpg", "f": "images/carrot-large.jpg"}};
})();
