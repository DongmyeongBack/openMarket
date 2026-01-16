import{g as d}from"./api-CJgaIYVr.js";import{H as m}from"./Header-DuCK9lL2.js";import{F as u}from"./Footer-DnPTH6_A.js";import"./Modal-CoTgg4te.js";let n=0;const l=5;let a,c;async function f(){try{const e=await d();g(e.results),p(e.results)}catch(e){console.error("Error loading products:",e),a&&(a.innerHTML=`
                <p class="error-message show">
                    상품을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
                </p>`)}}function g(e){if(!a)return;if(!e||e.length===0){a.innerHTML='<p style="text-align:center; grid-column: 1/-1;">등록된 상품이 없습니다.</p>';return}const s=e.map(t=>{const r=new Intl.NumberFormat("ko-KR").format(t.price),o=t.seller.store_name||t.seller.username;return`
            <li class="product-card">
                <a href="./src/pages/product-detail/index.html?productId=${t.id}">
                    <img src="${t.image}" alt="${t.name}" class="product-img" />
                    <span class="seller-name">${o}</span>
                    <h3 class="product-name">${t.name}</h3>
                    <strong class="product-price">${r}<span>원</span></strong>
                </a>
            </li>
        `}).join("");a.innerHTML=s}function p(e){if(!e||e.length===0||!c)return;const t=e.slice(0,l).map(r=>`<img src="${r.image}" alt="${r.name}" class="banner-img" />`).join("");c.innerHTML=t,h()}function h(){const e=document.querySelector(".prev-btn"),s=document.querySelector(".next-btn"),t=document.querySelectorAll(".dot");if(!e||!s)return;function r(o){o<0?n=l-1:o>=l?n=0:n=o,c&&(c.style.transform=`translateX(-${n*100}%)`),t.forEach(i=>i.classList.remove("active")),t[n]&&t[n].classList.add("active")}e.addEventListener("click",()=>r(n-1)),s.addEventListener("click",()=>r(n+1)),t.forEach((o,i)=>{o.addEventListener("click",()=>r(i))}),setInterval(()=>{r(n+1)},5e3)}document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector("#header");e&&new m(e);const s=document.querySelector("#footer");s&&new u(s),a=document.getElementById("product-grid"),c=document.querySelector(".banner-slide"),a&&f()});
