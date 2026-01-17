import{g as d}from"./api-BW4WmqIz.js";import{H as m}from"./Header-BAthNqRS.js";import{F as u}from"./Footer-DnPTH6_A.js";import"./Modal-paOObtiz.js";let n=0;const l=5;let a,c;async function f(){try{const e=await d();g(e.results),p(e.results)}catch{a&&(a.innerHTML=`
                <p class="error-message show">
                    상품을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.
                </p>`)}}function g(e){if(!a)return;if(!e||e.length===0){a.innerHTML='<p style="text-align:center; grid-column: 1/-1;">등록된 상품이 없습니다.</p>';return}const o=e.map(r=>{const t=new Intl.NumberFormat("ko-KR").format(r.price),s=r.seller.store_name||r.seller.username;return`
            <li class="product-card">
                <a href="/openMarket/src/pages/product-detail/index.html?productId=${r.id}">
                    <img src="${r.image}" alt="${r.name}" class="product-img" />
                    <span class="seller-name">${s}</span>
                    <h3 class="product-name">${r.name}</h3>
                    <strong class="product-price">${t}<span>원</span></strong>
                </a>
            </li>
        `}).join("");a.innerHTML=o}function p(e){if(!e||e.length===0||!c)return;const r=e.slice(0,l).map(t=>`<img src="${t.image}" alt="${t.name}" class="banner-img" />`).join("");c.innerHTML=r,h()}function h(){const e=document.querySelector(".prev-btn"),o=document.querySelector(".next-btn"),r=document.querySelectorAll(".dot");if(!e||!o)return;function t(s){s<0?n=l-1:s>=l?n=0:n=s,c&&(c.style.transform=`translateX(-${n*100}%)`),r.forEach(i=>i.classList.remove("active")),r[n]&&r[n].classList.add("active")}e.addEventListener("click",()=>t(n-1)),o.addEventListener("click",()=>t(n+1)),r.forEach((s,i)=>{s.addEventListener("click",()=>t(i))}),setInterval(()=>{t(n+1)},5e3)}document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector("#header");e&&new m(e);const o=document.querySelector("#footer");o&&new u(o),a=document.getElementById("product-grid"),c=document.querySelector(".banner-slide"),a&&f()});
